import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import SkillsPage from "./SkillsPage";

vi.mock("@/lib/axios", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("SkillsPage Filter and Search component behavior", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <SkillsPage />
      </QueryClientProvider>
    );
  };

  it("should render and fetch skills on load", async () => {
    (api.get as any).mockResolvedValue({
      data: {
        data: [
          { _id: "1", name: "TypeScript", category: "Programming", level: 90, yearsExperience: 5, description: "TS dev" },
          { _id: "2", name: "React", category: "Frontend", level: 85, yearsExperience: 4, description: "React UI" },
        ],
      },
    });

    renderComponent();

    expect(screen.getByText("COMPILE_SYSTEMS_INVENTORY...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("React")).toBeInTheDocument();
    });

    expect(api.get).toHaveBeenCalledWith("/skills", { params: {} });
  });

  it("should trigger search query when text is typed into the search bar", async () => {
    (api.get as any).mockResolvedValue({
      data: {
        data: [],
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Search capabilities...")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search capabilities...");
    fireEvent.change(searchInput, { target: { value: "node" } });

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/skills", { params: { search: "node" } });
    });
  });
});
