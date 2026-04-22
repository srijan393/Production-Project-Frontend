import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CreatePost from "./CreatePost";
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
}));

describe("CreatePost page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renders create post page", () => {
    render(
      <MemoryRouter>
        <CreatePost />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", { name: /post question/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /cancel/i })
    ).toBeInTheDocument();
  });

  test("creates post with valid academic question", async () => {
    localStorage.setItem("token", "fake-jwt");

    api.post.mockResolvedValue({
      data: { id: 1, message: "Post created successfully" },
    });

    render(
      <MemoryRouter>
        <CreatePost />
      </MemoryRouter>
    );

    const titleInput = screen.getByPlaceholderText(/enter question title/i);
    const bodyInput = screen.getByPlaceholderText(/explain your question in detail/i);

    fireEvent.change(titleInput, {
      target: { value: "What is DBMS normalization?" },
    });

    fireEvent.change(bodyInput, {
      target: {
        value:
          "Please explain first normal form, second normal form and third normal form with examples.",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /post question/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/posts", {
        title: "What is DBMS normalization?",
        body: "Please explain first normal form, second normal form and third normal form with examples.",
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  test("shows AI moderation block message for offensive post", async () => {
    localStorage.setItem("token", "fake-jwt");

    api.post.mockRejectedValue({
      response: {
        data: {
          message: "Post blocked by AI moderation",
        },
      },
    });

    render(
      <MemoryRouter>
        <CreatePost />
      </MemoryRouter>
    );

    const titleInput = screen.getByPlaceholderText(/enter question title/i);
    const bodyInput = screen.getByPlaceholderText(/explain your question in detail/i);

    fireEvent.change(titleInput, {
      target: { value: "Bad content" },
    });

    fireEvent.change(bodyInput, {
      target: { value: "This is offensive content that should be blocked." },
    });

    fireEvent.click(screen.getByRole("button", { name: /post question/i }));

    expect(
      await screen.findByText(/post blocked by ai moderation/i)
    ).toBeInTheDocument();
  });

  test("shows validation error for short content", async () => {
    localStorage.setItem("token", "fake-jwt");

    api.post.mockRejectedValue({
      response: {
        data: {
          message: "Post body must be at least 10 characters",
        },
      },
    });

    render(
      <MemoryRouter>
        <CreatePost />
      </MemoryRouter>
    );

    const titleInput = screen.getByPlaceholderText(/enter question title/i);
    const bodyInput = screen.getByPlaceholderText(/explain your question in detail/i);

    fireEvent.change(titleInput, {
      target: { value: "Short post" },
    });

    fireEvent.change(bodyInput, {
      target: { value: "short" },
    });

    fireEvent.click(screen.getByRole("button", { name: /post question/i }));

    expect(
      await screen.findByText(/post body must be at least 10 characters/i)
    ).toBeInTheDocument();
  });
});