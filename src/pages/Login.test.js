import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";
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
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

describe("Login page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("shows login button", () => {
    render(<Login />);
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("logs in with valid username and password", async () => {
    api.post.mockResolvedValue({
      data: {
        token: "fake-jwt-token",
        role: "USER",
      },
    });

    render(<Login />);

    const textInput = screen.getByRole("textbox");
    const passwordInput = document.querySelector('input[type="password"]');

    fireEvent.change(textInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "Password123!" } });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/login", {
        username: "testuser",
        password: "Password123!",
      });
    });

    expect(localStorage.getItem("token")).toBe("fake-jwt-token");
    expect(localStorage.getItem("role")).toBe("USER");
    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  test("shows wrong password error", async () => {
    api.post.mockRejectedValue({
      response: {
        data: "Password is incorrect",
      },
    });

    render(<Login />);

    const textInput = screen.getByRole("textbox");
    const passwordInput = document.querySelector('input[type="password"]');

    fireEvent.change(textInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpass" } });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/password is incorrect/i)).toBeInTheDocument();
  });

  test("shows username not found error", async () => {
    api.post.mockRejectedValue({
      response: {
        data: "Username not found",
      },
    });

    render(<Login />);

    const textInput = screen.getByRole("textbox");
    const passwordInput = document.querySelector('input[type="password"]');

    fireEvent.change(textInput, { target: { value: "nouser" } });
    fireEvent.change(passwordInput, { target: { value: "Password123!" } });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/username not found/i)).toBeInTheDocument();
  });
});