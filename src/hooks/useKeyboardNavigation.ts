/**
 * Keyboard Navigation Hook
 * Handles keyboard navigation within the widget
 */

import { useEffect, useCallback, type RefObject } from "react";

interface UseKeyboardNavigationOptions {
  enabled?: boolean;
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  trapFocus?: boolean;
  containerRef?: RefObject<HTMLElement>;
}

export function useKeyboardNavigation(
  options: UseKeyboardNavigationOptions = {}
) {
  const {
    enabled = true,
    onEscape,
    onEnter,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    trapFocus = false,
    containerRef,
  } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      switch (event.key) {
        case "Escape":
          if (onEscape) {
            event.preventDefault();
            onEscape();
          }
          break;

        case "Enter":
          if (onEnter) {
            event.preventDefault();
            onEnter();
          }
          break;

        case "ArrowUp":
          if (onArrowUp) {
            event.preventDefault();
            onArrowUp();
          }
          break;

        case "ArrowDown":
          if (onArrowDown) {
            event.preventDefault();
            onArrowDown();
          }
          break;

        case "ArrowLeft":
          if (onArrowLeft) {
            event.preventDefault();
            onArrowLeft();
          }
          break;

        case "ArrowRight":
          if (onArrowRight) {
            event.preventDefault();
            onArrowRight();
          }
          break;

        case "Tab":
          if (trapFocus && containerRef?.current) {
            handleTabKey(event, containerRef.current);
          }
          break;

        default:
          break;
      }
    },
    [
      enabled,
      onEscape,
      onEnter,
      onArrowUp,
      onArrowDown,
      onArrowLeft,
      onArrowRight,
      trapFocus,
      containerRef,
    ]
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, handleKeyDown]);
}

/**
 * Handle Tab key for focus trapping
 */
function handleTabKey(event: KeyboardEvent, container: HTMLElement) {
  const focusableElements = getFocusableElements(container);

  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  // Shift + Tab: focus last element when on first
  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  }
  // Tab: focus first element when on last
  else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

/**
 * Get all focusable elements within a container
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");

  return Array.from(container.querySelectorAll(selector));
}

/**
 * Focus Management Hook
 * Manages focus restoration and trap
 */
export function useFocusManagement(
  options: {
    restoreFocus?: boolean;
    initialFocus?: RefObject<HTMLElement>;
    finalFocus?: RefObject<HTMLElement>;
  } = {}
) {
  const { restoreFocus = true, initialFocus, finalFocus } = options;

  useEffect(() => {
    // Save current active element
    const previouslyFocusedElement = document.activeElement as HTMLElement;

    // Focus initial element if provided
    if (initialFocus?.current) {
      initialFocus.current.focus();
    }

    // Cleanup: restore focus
    return () => {
      if (restoreFocus) {
        if (finalFocus?.current) {
          finalFocus.current.focus();
        } else if (previouslyFocusedElement) {
          previouslyFocusedElement.focus();
        }
      }
    };
  }, [restoreFocus, initialFocus, finalFocus]);
}

/**
 * Skip to Content Hook
 * Adds skip link for keyboard navigation
 */
export function useSkipToContent(targetId: string = "main-content") {
  useEffect(() => {
    const skipLink = document.getElementById("skip-to-content");
    if (!skipLink) return;

    const handleClick = (e: Event) => {
      e.preventDefault();
      const target = document.getElementById(targetId);
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    skipLink.addEventListener("click", handleClick);

    return () => {
      skipLink.removeEventListener("click", handleClick);
    };
  }, [targetId]);
}
