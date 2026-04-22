import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Discover from "./Discover";
import api from "../services/api";

const mockNavigate = jest.fn();

jest.mock("../services/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  MemoryRouter: ({ children }) => <div>{children}</div>,
  useNavigate: () => mockNavigate,
}));

describe("Discover page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("token", "fake-jwt");
  });

  test("renders discover page with users", async () => {
    api.get.mockResolvedValue({
      data: [
        {
          id: 1,
          fullName: "Alice Johnson",
          username: "alice",
          bio: "Java developer",
          interests: "Spring Boot, React",
          followersCount: 5,
          followingCount: 3,
          following: false,
          role: "USER",
        },
      ],
    });

    render(
      <MemoryRouter>
        <Discover />
      </MemoryRouter>
    );

    expect(await screen.findByText(/alice johnson/i)).toBeInTheDocument();
    expect(await screen.findByText(/@alice/i)).toBeInTheDocument();
  });

  test("follow another user", async () => {
    api.get
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            fullName: "Alice Johnson",
            username: "alice",
            bio: "Java developer",
            interests: "Spring Boot, React",
            followersCount: 5,
            followingCount: 3,
            following: false,
            role: "USER",
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            fullName: "Alice Johnson",
            username: "alice",
            bio: "Java developer",
            interests: "Spring Boot, React",
            followersCount: 6,
            followingCount: 3,
            following: true,
            role: "USER",
          },
        ],
      });

    api.post.mockResolvedValue({ data: { message: "Followed successfully" } });

    render(
      <MemoryRouter>
        <Discover />
      </MemoryRouter>
    );

    const followButton = await screen.findByRole("button", { name: /follow/i });
    fireEvent.click(followButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/users/1/follow");
    });
  });

  test("unfollow another user", async () => {
    api.get
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            fullName: "Alice Johnson",
            username: "alice",
            bio: "Java developer",
            interests: "Spring Boot, React",
            followersCount: 6,
            followingCount: 3,
            following: true,
            role: "USER",
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            fullName: "Alice Johnson",
            username: "alice",
            bio: "Java developer",
            interests: "Spring Boot, React",
            followersCount: 5,
            followingCount: 3,
            following: false,
            role: "USER",
          },
        ],
      });

    api.delete.mockResolvedValue({ data: { message: "Unfollowed successfully" } });

    render(
      <MemoryRouter>
        <Discover />
      </MemoryRouter>
    );

    const unfollowButton = await screen.findByRole("button", { name: /unfollow/i });
    fireEvent.click(unfollowButton);

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith("/users/1/follow");
    });
  });

  test("discover page renders returned users including admin if backend sends it", async () => {
    api.get.mockResolvedValue({
      data: [
        {
          id: 1,
          fullName: "Alice Johnson",
          username: "alice",
          bio: "Java developer",
          interests: "Spring Boot, React",
          followersCount: 5,
          followingCount: 3,
          following: false,
          role: "USER",
        },
        {
          id: 2,
          fullName: "Admin User",
          username: "admin",
          bio: "Administrator",
          interests: "Management",
          followersCount: 10,
          followingCount: 1,
          following: false,
          role: "ADMIN",
        },
      ],
    });

    render(
      <MemoryRouter>
        <Discover />
      </MemoryRouter>
    );

    expect(await screen.findByText(/alice johnson/i)).toBeInTheDocument();
    expect(await screen.findByText(/admin user/i)).toBeInTheDocument();
  });
});