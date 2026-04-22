import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Profile from "./Profile";
import api from "../services/api";

const mockNavigate = jest.fn();

jest.mock("../services/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  MemoryRouter: ({ children }) => <div>{children}</div>,
  useNavigate: () => mockNavigate,
}));

describe("Profile page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("token", "fake-jwt");

    api.get.mockImplementation((url) => {
      if (url === "/users/me") {
        return Promise.resolve({
          data: {
            id: 1,
            fullName: "Test User",
            username: "testuser",
            email: "test@example.com",
            bio: "I love coding",
            interests: "React, Spring Boot",
            followersCount: 2,
            followingCount: 3,
            postsCount: 4,
          },
        });
      }

      if (url === "/users/me/following") {
        return Promise.resolve({ data: [] });
      }

      return Promise.resolve({ data: [] });
    });
  });

  test("loads profile data", async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(await screen.findByText(/test user/i)).toBeInTheDocument();
    expect(await screen.findByText(/test@example.com/i)).toBeInTheDocument();
    expect(await screen.findByText(/i love coding/i)).toBeInTheDocument();
  });

  test("updates profile successfully", async () => {
    api.post.mockResolvedValue({
      data: {
        id: 1,
        fullName: "Updated User",
        username: "updateduser",
        email: "updated@example.com",
        bio: "Updated bio",
        interests: "Java, Testing",
      },
    });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await screen.findByText(/test user/i);

    fireEvent.click(screen.getByRole("button", { name: /edit profile/i }));

    const fullNameInput = screen.getByDisplayValue("Test User");
    const usernameInput = screen.getByDisplayValue("testuser");
    const emailInput = screen.getByDisplayValue("test@example.com");

    fireEvent.change(fullNameInput, { target: { value: "Updated User" } });
    fireEvent.change(usernameInput, { target: { value: "updateduser" } });
    fireEvent.change(emailInput, { target: { value: "updated@example.com" } });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/update-profile", {
        fullName: "Updated User",
        username: "updateduser",
        email: "updated@example.com",
        bio: "I love coding",
        interests: "React, Spring Boot",
      });
    });
  });

  test("shows duplicate username error", async () => {
    api.post.mockRejectedValue({
      response: {
        data: {
          message: "Username already exists",
        },
      },
    });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await screen.findByText(/test user/i);

    fireEvent.click(screen.getByRole("button", { name: /edit profile/i }));

    const usernameInput = screen.getByDisplayValue("testuser");
    fireEvent.change(usernameInput, { target: { value: "existinguser" } });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(
      await screen.findByText(/username already exists/i)
    ).toBeInTheDocument();
  });

  test("shows duplicate email error", async () => {
    api.post.mockRejectedValue({
      response: {
        data: {
          message: "Email already exists",
        },
      },
    });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await screen.findByText(/test user/i);

    fireEvent.click(screen.getByRole("button", { name: /edit profile/i }));

    const emailInput = screen.getByDisplayValue("test@example.com");
    fireEvent.change(emailInput, { target: { value: "existing@example.com" } });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(
      await screen.findByText(/email already exists/i)
    ).toBeInTheDocument();
  });
});