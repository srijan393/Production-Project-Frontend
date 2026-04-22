import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Signup from "./Signup";
import api from "../services/api";

const mockNavigate = jest.fn();

jest.mock("../services/api", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  MemoryRouter: ({ children }) => <div>{children}</div>,
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

describe("Signup page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows create account button", () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("creates new user with valid data", async () => {
    jest.useFakeTimers();

    api.post.mockResolvedValue({
      data: "Signup successful",
    });

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    const textInputs = screen.getAllByRole("textbox");
    const passwordInput = document.querySelector('input[type="password"]');

    fireEvent.change(textInputs[0], { target: { value: "Test User" } });
    fireEvent.change(textInputs[1], { target: { value: "testuser" } });
    fireEvent.change(textInputs[2], { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123!" } });

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/signup", {
        fullName: "Test User",
        username: "testuser",
        email: "test@example.com",
        password: "Password123!",
      });
    });

    expect(await screen.findByText(/signup successful/i)).toBeInTheDocument();

    jest.advanceTimersByTime(700);
    expect(mockNavigate).toHaveBeenCalledWith("/login");

    jest.useRealTimers();
  });

  test("shows existing username error", async () => {
    api.post.mockRejectedValue({
      response: {
        data: "Username already exists",
      },
    });

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    const textInputs = screen.getAllByRole("textbox");
    const passwordInput = document.querySelector('input[type="password"]');

    fireEvent.change(textInputs[0], { target: { value: "Test User" } });
    fireEvent.change(textInputs[1], { target: { value: "existinguser" } });
    fireEvent.change(textInputs[2], { target: { value: "existing@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123!" } });

    fireEvent.click(screen.getByRole("button"));

    expect(await screen.findByText(/username already exists/i)).toBeInTheDocument();
  });

  test("shows backend validation error", async () => {
    api.post.mockRejectedValue({
      response: {
        data: "Password must be at least 8 characters",
      },
    });

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    const textInputs = screen.getAllByRole("textbox");
    const passwordInput = document.querySelector('input[type="password"]');

    fireEvent.change(textInputs[0], { target: { value: "Test User" } });
    fireEvent.change(textInputs[1], { target: { value: "newuser" } });
    fireEvent.change(textInputs[2], { target: { value: "new@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "short" } });

    fireEvent.click(screen.getByRole("button"));

    expect(
      await screen.findByText(/password must be at least 8 characters/i)
    ).toBeInTheDocument();
  });
});