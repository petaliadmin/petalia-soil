import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 md:h-20">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-3 group">
            <div class="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-agri-500 to-agri-600 rounded-xl flex items-center justify-center shadow-lg shadow-agri-500/30 group-hover:shadow-agri-500/50 transition-shadow">
              <svg class="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="hidden sm:block">
              <span class="text-xl md:text-2xl font-display font-bold text-gray-900 dark:text-white">Petalia</span>
              <span class="text-xl md:text-2xl font-display font-bold text-agri-600 dark:text-agri-400">Soil</span>
            </div>
          </a>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-1">
            <a routerLink="/"
               routerLinkActive="bg-agri-50 text-agri-700 dark:bg-agri-900/50 dark:text-agri-400"
               [routerLinkActiveOptions]="{exact: true}"
               class="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors">
              Accueil
            </a>
            <a routerLink="/lands"
               routerLinkActive="bg-agri-50 text-agri-700 dark:bg-agri-900/50 dark:text-agri-400"
               class="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors">
              Terres
            </a>
            <a routerLink="/map"
               routerLinkActive="bg-agri-50 text-agri-700 dark:bg-agri-900/50 dark:text-agri-400"
               class="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors">
              Carte
            </a>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 md:gap-4">
            <!-- Theme Toggle -->
            <button
              (click)="toggleTheme()"
              class="p-2 md:p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              [attr.aria-label]="themeService.isDark() ? 'Activer le mode clair' : 'Activer le mode sombre'"
            >
              @if (themeService.isDark()) {
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              } @else {
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                </svg>
              }
            </button>

            <!-- CTA Button -->
            <a routerLink="/lands"
               class="hidden sm:inline-flex btn-primary text-sm px-4 py-2.5">
              <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Publier
            </a>

            <!-- Mobile Menu Button -->
            <button
              (click)="toggleMobileMenu()"
              class="md:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
              @if (mobileMenuOpen()) {
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              } @else {
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              }
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        @if (mobileMenuOpen()) {
          <div class="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 animate-slide-down">
            <div class="flex flex-col gap-1">
              <a routerLink="/"
                 (click)="closeMobileMenu()"
                 routerLinkActive="bg-agri-50 text-agri-700 dark:bg-agri-900/50 dark:text-agri-400"
                 [routerLinkActiveOptions]="{exact: true}"
                 class="px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors">
                Accueil
              </a>
              <a routerLink="/lands"
                 (click)="closeMobileMenu()"
                 routerLinkActive="bg-agri-50 text-agri-700 dark:bg-agri-900/50 dark:text-agri-400"
                 class="px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors">
                Terres disponibles
              </a>
              <a routerLink="/map"
                 (click)="closeMobileMenu()"
                 routerLinkActive="bg-agri-50 text-agri-700 dark:bg-agri-900/50 dark:text-agri-400"
                 class="px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors">
                Carte interactive
              </a>
              <a routerLink="/lands"
                 (click)="closeMobileMenu()"
                 class="mt-2 btn-primary justify-center">
                <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Publier une annonce
              </a>
            </div>
          </div>
        }
      </nav>
    </header>
    <!-- Spacer -->
    <div class="h-16 md:h-20"></div>
  `
})
export class HeaderComponent {
  themeService = inject(ThemeService);
  mobileMenuOpen = signal(false);

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
