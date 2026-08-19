import type { ScrollBoxRenderable } from "@opentui/core";
import { useCallback, type RefObject } from "react";

export function useListNavigation(
  itemsLength: number,
  scrollRef: RefObject<ScrollBoxRenderable | null>,
) {
  const scrollToItem = useCallback(
    (index: number) => {
      const scrollbox = scrollRef.current;
      if (!scrollbox) return;

      const viewportHeight = scrollbox.viewport.height;
      const visibleEnd = scrollbox.scrollTop + viewportHeight - 1;

      if (index > visibleEnd) {
        scrollbox.scrollTo(index - viewportHeight + 1);
      } else if (index < scrollbox.scrollTop) {
        scrollbox.scrollTo(index);
      }
    },
    [scrollRef],
  );

  const moveSelection = useCallback(
    (direction: "up" | "down", currentIndex: number) => {
      if (itemsLength === 0) return 0;

      const newIndex =
        direction === "up"
          ? Math.max(0, currentIndex - 1)
          : Math.min(itemsLength - 1, currentIndex + 1);

      scrollToItem(newIndex);
      return newIndex;
    },
    [itemsLength, scrollToItem],
  );

  return { moveSelection, scrollToItem };
}