/**
 * Storage Service
 * Handles localStorage operations for draft saving/restoring
 */

import type { AppointmentState } from "@/types";

const STORAGE_KEYS = {
  DRAFT: "salontakvim_draft",
  WIDGET_KEY: "salontakvim_widget_key",
} as const;

// Draft expiry time (24 hours)
const DRAFT_EXPIRY_MS = 24 * 60 * 60 * 1000;

interface StoredDraft {
  data: Partial<AppointmentState>;
  timestamp: number;
  widgetKey: string;
}

/**
 * Storage Service Class
 */
export class StorageService {
  /**
   * Check if localStorage is available
   */
  private isLocalStorageAvailable(): boolean {
    try {
      const test = "__storage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Save draft appointment state
   */
  saveDraft(widgetKey: string, data: Partial<AppointmentState>): boolean {
    if (!this.isLocalStorageAvailable()) {
      return false;
    }

    try {
      const draft: StoredDraft = {
        data,
        timestamp: Date.now(),
        widgetKey,
      };

      localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(draft));
      return true;
    } catch (error) {
      console.error("Failed to save draft:", error);
      return false;
    }
  }

  /**
   * Load draft appointment state
   */
  loadDraft(widgetKey: string): Partial<AppointmentState> | null {
    if (!this.isLocalStorageAvailable()) {
      return null;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DRAFT);
      if (!stored) {
        return null;
      }

      const draft: StoredDraft = JSON.parse(stored);

      // Check if draft is for the same widget
      if (draft.widgetKey !== widgetKey) {
        this.clearDraft();
        return null;
      }

      // Check if draft has expired
      const age = Date.now() - draft.timestamp;
      if (age > DRAFT_EXPIRY_MS) {
        this.clearDraft();
        return null;
      }

      return draft.data;
    } catch (error) {
      console.error("Failed to load draft:", error);
      return null;
    }
  }

  /**
   * Clear draft appointment state
   */
  clearDraft(): boolean {
    if (!this.isLocalStorageAvailable()) {
      return false;
    }

    try {
      localStorage.removeItem(STORAGE_KEYS.DRAFT);
      return true;
    } catch (error) {
      console.error("Failed to clear draft:", error);
      return false;
    }
  }

  /**
   * Check if draft exists and is valid
   */
  hasDraft(widgetKey: string): boolean {
    const draft = this.loadDraft(widgetKey);
    return draft !== null;
  }

  /**
   * Save widget key
   */
  saveWidgetKey(widgetKey: string): boolean {
    if (!this.isLocalStorageAvailable()) {
      return false;
    }

    try {
      localStorage.setItem(STORAGE_KEYS.WIDGET_KEY, widgetKey);
      return true;
    } catch (error) {
      console.error("Failed to save widget key:", error);
      return false;
    }
  }

  /**
   * Load widget key
   */
  loadWidgetKey(): string | null {
    if (!this.isLocalStorageAvailable()) {
      return null;
    }

    try {
      return localStorage.getItem(STORAGE_KEYS.WIDGET_KEY);
    } catch (error) {
      console.error("Failed to load widget key:", error);
      return null;
    }
  }

  /**
   * Clear all storage
   */
  clearAll(): boolean {
    if (!this.isLocalStorageAvailable()) {
      return false;
    }

    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error("Failed to clear storage:", error);
      return false;
    }
  }
}

/**
 * Export singleton instance
 */
export const storageService = new StorageService();
