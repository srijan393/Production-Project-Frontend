import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PostDetails from "./PostDetails";
import api from "../services/api";

const mockNavigate = jest.fn();

jest.mock("../services/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  MemoryRouter: ({ children }) => <div>{children}</div>,
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: "1" }),
}));

describe("PostDetails page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    window.alert = jest.fn();
  });

  test("renders post details page with post and comments", async () => {
    api.get.mockImplementation((url) => {
      if (url === "/posts/1") {
        return Promise.resolve({
          data: {
            id: 1,
            title: "What is React?",
            body: "Please explain React basics.",
            authorUsername: "alice",
            createdAt: "2026-04-22T10:00:00",
            bestCommentId: null,
          },
        });
      }

      if (url === "/posts/1/comments") {
        return Promise.resolve({
          data: [
            {
              id: 10,
              content: "React is a JavaScript library for building UI.",
              authorUsername: "bob",
              createdAt: "2026-04-22T10:05:00",
            },
          ],
        });
      }

      return Promise.resolve({ data: [] });
    });

    render(
      <MemoryRouter>
        <PostDetails />
      </MemoryRouter>
    );

    expect(await screen.findByText(/what is react/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/please explain react basics/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/react is a javascript library for building ui/i)
    ).toBeInTheDocument();
  });

  test("shows pinned best answer", async () => {
    api.get.mockImplementation((url) => {
      if (url === "/posts/1") {
        return Promise.resolve({
          data: {
            id: 1,
            title: "What is React?",
            body: "Please explain React basics.",
            authorUsername: "alice",
            createdAt: "2026-04-22T10:00:00",
            bestCommentId: 10,
          },
        });
      }

      if (url === "/posts/1/comments") {
        return Promise.resolve({
          data: [
            {
              id: 10,
              content: "React is the best answer here.",
              authorUsername: "bob",
              createdAt: "2026-04-22T10:05:00",
            },
            {
              id: 11,
              content: "Another answer",
              authorUsername: "carol",
              createdAt: "2026-04-22T10:06:00",
            },
          ],
        });
      }

      return Promise.resolve({ data: [] });
    });

    render(
      <MemoryRouter>
        <PostDetails />
      </MemoryRouter>
    );

    expect(
      await screen.findByText(/best answer pinned by ai/i)
    ).toBeInTheDocument();

    expect(
      await screen.findAllByText(/react is the best answer here/i)
    ).toHaveLength(2);
  });

  test("adds valid comment/answer", async () => {
    localStorage.setItem("token", "fake-jwt");

    api.get.mockImplementation((url) => {
      if (url === "/posts/1") {
        return Promise.resolve({
          data: {
            id: 1,
            title: "What is React?",
            body: "Please explain React basics.",
            authorUsername: "alice",
            createdAt: "2026-04-22T10:00:00",
            bestCommentId: null,
          },
        });
      }

      if (url === "/posts/1/comments") {
        return Promise.resolve({ data: [] });
      }

      return Promise.resolve({ data: [] });
    });

    api.post.mockResolvedValue({
      data: { id: 20, message: "Comment added successfully" },
    });

    render(
      <MemoryRouter>
        <PostDetails />
      </MemoryRouter>
    );

    const input = await screen.findByPlaceholderText(/write an answer/i);

    fireEvent.change(input, {
      target: { value: "React is used to build user interfaces." },
    });

    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/posts/1/comments", {
        content: "React is used to build user interfaces.",
      });
    });
  });

  test("redirects to login when commenting without token", async () => {
    api.get.mockImplementation((url) => {
      if (url === "/posts/1") {
        return Promise.resolve({
          data: {
            id: 1,
            title: "What is React?",
            body: "Please explain React basics.",
            authorUsername: "alice",
            createdAt: "2026-04-22T10:00:00",
            bestCommentId: null,
          },
        });
      }

      if (url === "/posts/1/comments") {
        return Promise.resolve({ data: [] });
      }

      return Promise.resolve({ data: [] });
    });

    render(
      <MemoryRouter>
        <PostDetails />
      </MemoryRouter>
    );

    const input = await screen.findByPlaceholderText(/write an answer/i);

    fireEvent.change(input, {
      target: { value: "My answer" },
    });

    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("shows AI moderation alert for comment", async () => {
    localStorage.setItem("token", "fake-jwt");

    api.get.mockImplementation((url) => {
      if (url === "/posts/1") {
        return Promise.resolve({
          data: {
            id: 1,
            title: "What is React?",
            body: "Please explain React basics.",
            authorUsername: "alice",
            createdAt: "2026-04-22T10:00:00",
            bestCommentId: null,
          },
        });
      }

      if (url === "/posts/1/comments") {
        return Promise.resolve({ data: [] });
      }

      return Promise.resolve({ data: [] });
    });

    api.post.mockRejectedValue({
      response: {
        data: {
          message: "Comment blocked by AI moderation",
        },
      },
    });

    render(
      <MemoryRouter>
        <PostDetails />
      </MemoryRouter>
    );

    const input = await screen.findByPlaceholderText(/write an answer/i);

    fireEvent.change(input, {
      target: { value: "Offensive comment content" },
    });

    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Comment blocked by AI moderation");
    });
  });
});