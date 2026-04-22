import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Admin from "./Admin";
import api from "../services/api";

const mockNavigate = jest.fn();

jest.mock("../services/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  MemoryRouter: ({ children }) => <div>{children}</div>,
  useNavigate: () => mockNavigate,
}));

describe("Admin page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    localStorage.setItem("token", "fake-jwt");
    localStorage.setItem("role", "ADMIN");

    window.alert = jest.fn();
    window.confirm = jest.fn(() => true);

    api.get.mockImplementation((url) => {
      if (url === "/admin/stats") {
        return Promise.resolve({
          data: {
            usersCount: 12,
            postsCount: 8,
            commentsCount: 20,
            followsCount: 5,
            flaggedCount: 2,
          },
        });
      }

      if (url === "/admin/users") {
        return Promise.resolve({
          data: [
            {
              id: 1,
              fullName: "Admin User",
              username: "admin",
              email: "admin@test.com",
              role: "ADMIN",
              bio: "",
              interests: "",
            },
            {
              id: 2,
              fullName: "Alice Johnson",
              username: "alice",
              email: "alice@test.com",
              role: "USER",
              bio: "Java developer",
              interests: "Spring Boot, React",
            },
          ],
        });
      }

      if (url === "/admin/posts") {
        return Promise.resolve({
          data: [
            {
              id: 101,
              title: "What is React?",
              body: "Explain React basics",
              authorUsername: "alice",
              bestCommentId: null,
            },
          ],
        });
      }

      if (url === "/admin/comments") {
        return Promise.resolve({
          data: [
            {
              id: 201,
              postId: 101,
              content: "React is a UI library",
              authorUsername: "bob",
            },
          ],
        });
      }

      if (url === "/admin/flags") {
        return Promise.resolve({
          data: [
            {
              id: 301,
              contentType: "POST",
              username: "alice",
              reason: "Offensive content",
              contentPreview: "Some flagged text",
            },
          ],
        });
      }

      return Promise.resolve({ data: [] });
    });

    api.delete.mockResolvedValue({ data: { message: "Deleted successfully" } });
  });

  test("admin dashboard loads stats tab by default", async () => {
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    expect(await screen.findByText(/admin dashboard/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/admin/stats");
      expect(api.get).toHaveBeenCalledWith("/admin/users");
      expect(api.get).toHaveBeenCalledWith("/admin/posts");
      expect(api.get).toHaveBeenCalledWith("/admin/comments");
      expect(api.get).toHaveBeenCalledWith("/admin/flags");
    });

    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  test("shows users when USERS tab is clicked", async () => {
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    await screen.findByText(/admin dashboard/i);
    fireEvent.click(screen.getByRole("button", { name: /users/i }));

    expect(await screen.findByText(/alice johnson/i)).toBeInTheDocument();
    expect(await screen.findByText(/admin user/i)).toBeInTheDocument();
  });

  test("shows posts when POSTS tab is clicked", async () => {
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    await screen.findByText(/admin dashboard/i);
    fireEvent.click(screen.getByRole("button", { name: /posts/i }));

    expect(await screen.findByText(/what is react/i)).toBeInTheDocument();
    expect(await screen.findByText(/explain react basics/i)).toBeInTheDocument();
  });

  test("shows comments when COMMENTS tab is clicked", async () => {
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    await screen.findByText(/admin dashboard/i);
    fireEvent.click(screen.getByRole("button", { name: /comments/i }));

    expect(await screen.findByText(/react is a ui library/i)).toBeInTheDocument();
  });

  test("shows flags when FLAGS tab is clicked", async () => {
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    await screen.findByText(/admin dashboard/i);
    fireEvent.click(screen.getByRole("button", { name: /flags/i }));

    expect(await screen.findByText(/offensive content/i)).toBeInTheDocument();
  });

  test("non-admin role still renders page current behavior", async () => {
    localStorage.setItem("role", "USER");

    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    expect(await screen.findByText(/admin dashboard/i)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("admin delete post calls backend from POSTS tab", async () => {
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    await screen.findByText(/admin dashboard/i);
    fireEvent.click(screen.getByRole("button", { name: /posts/i }));

    await screen.findByText(/what is react/i);

    const deleteButton = await screen.findByRole("button", { name: /delete post/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith("Delete this post?");
      expect(api.delete).toHaveBeenCalledWith("/admin/posts/101");
    });
  });

  test("admin delete comment calls backend from COMMENTS tab", async () => {
    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    await screen.findByText(/admin dashboard/i);
    fireEvent.click(screen.getByRole("button", { name: /comments/i }));

    await screen.findByText(/react is a ui library/i);

    const deleteButton = await screen.findByRole("button", { name: /delete comment/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith("Delete this comment?");
      expect(api.delete).toHaveBeenCalledWith("/admin/comments/201");
    });
  });
});