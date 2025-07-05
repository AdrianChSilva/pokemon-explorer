import { renderHook } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";
import { useInfiniteScroll, SCROLL_THRESHOLD_PX } from "@/hooks/useInfiniteScroll";

describe("useInfiniteScroll", () => {
  const DEFAULT_INNER_HEIGHT = 800;
  const DEFAULT_SCROLL_HEIGHT = 1500;

  beforeEach(() => {
    vi.resetAllMocks();

    window.scrollY = 0;

    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: DEFAULT_INNER_HEIGHT,
    });

    Object.defineProperty(document.body, "scrollHeight", {
      configurable: true,
      value: DEFAULT_SCROLL_HEIGHT,
    });
  });

  it("llama al callback cuando se hace scroll dentro del umbral", () => {
    const callback = vi.fn();

    renderHook(() => useInfiniteScroll(callback, false));

    const scrollTop = DEFAULT_SCROLL_HEIGHT - SCROLL_THRESHOLD_PX - DEFAULT_INNER_HEIGHT;
    window.scrollY = scrollTop;

    window.dispatchEvent(new Event("scroll"));

    expect(callback).toHaveBeenCalled();
  });

  it("no llama al callback si está desactivado", () => {
    const callback = vi.fn();

    renderHook(() => useInfiniteScroll(callback, true));

    const scrollTop = DEFAULT_SCROLL_HEIGHT - SCROLL_THRESHOLD_PX - DEFAULT_INNER_HEIGHT;
    window.scrollY = scrollTop;

    window.dispatchEvent(new Event("scroll"));

    expect(callback).not.toHaveBeenCalled();
  });

  it("no llama al callback si aún no se ha llegado al umbral", () => {
    const callback = vi.fn();

    renderHook(() => useInfiniteScroll(callback, false));

    const NOT_REACHED_SCROLL_HEIGHT = 2000;
    const SMALLER_VIEWPORT_HEIGHT = 500;

    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: SMALLER_VIEWPORT_HEIGHT,
    });

    Object.defineProperty(document.body, "scrollHeight", {
      configurable: true,
      value: NOT_REACHED_SCROLL_HEIGHT,
    });

    const scrollTop = NOT_REACHED_SCROLL_HEIGHT - SCROLL_THRESHOLD_PX - SMALLER_VIEWPORT_HEIGHT - 1;
    window.scrollY = scrollTop;

    window.dispatchEvent(new Event("scroll"));

    expect(callback).not.toHaveBeenCalled();
  });
});
