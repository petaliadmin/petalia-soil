import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'petalia-theme';

  // Reactive state
  private themeSignal = signal<Theme>(this.getStoredTheme());
  private isDarkSignal = signal<boolean>(false);

  // Public readonly signals
  readonly theme = this.themeSignal.asReadonly();
  readonly isDark = this.isDarkSignal.asReadonly();

  constructor() {
    // Effect to apply theme changes
    effect(() => {
      this.applyTheme(this.themeSignal());
    });

    // Listen for system theme changes
    this.setupSystemThemeListener();

    // Initialize
    this.applyTheme(this.themeSignal());
  }

  /**
   * Set the current theme
   */
  setTheme(theme: Theme): void {
    this.themeSignal.set(theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  /**
   * Toggle between light and dark mode
   */
  toggleTheme(): void {
    const current = this.themeSignal();
    if (current === 'system') {
      this.setTheme(this.getSystemTheme() === 'dark' ? 'light' : 'dark');
    } else {
      this.setTheme(current === 'dark' ? 'light' : 'dark');
    }
  }

  /**
   * Cycle through themes: light -> dark -> system
   */
  cycleTheme(): void {
    const current = this.themeSignal();
    const next: Theme = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
    this.setTheme(next);
  }

  /**
   * Get stored theme from localStorage
   */
  private getStoredTheme(): Theme {
    if (typeof localStorage === 'undefined') return 'system';
    const stored = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    return stored || 'system';
  }

  /**
   * Get current system preference
   */
  private getSystemTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /**
   * Apply theme to document
   */
  private applyTheme(theme: Theme): void {
    if (typeof document === 'undefined') return;

    const isDark = theme === 'dark' || (theme === 'system' && this.getSystemTheme() === 'dark');
    this.isDarkSignal.set(isDark);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  /**
   * Listen for system theme changes
   */
  private setupSystemThemeListener(): void {
    if (typeof window === 'undefined') return;

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.themeSignal() === 'system') {
        this.applyTheme('system');
      }
    });
  }
}
