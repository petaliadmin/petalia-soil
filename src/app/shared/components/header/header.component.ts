import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';

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
            <div class="w-10 h-10 md:w-12 md:h-12 bg-white from-agri-500 to-agri-600 rounded-xl flex items-center justify-center shadow-lg shadow-agri-500/30 group-hover:shadow-agri-500/50 transition-shadow p-1">
              <img  src="logo.png" [alt]="'Pétalia'"/>
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
            <a routerLink="/tools"
               routerLinkActive="bg-agri-50 text-agri-700 dark:bg-agri-900/50 dark:text-agri-400"
               class="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors">
              Outils
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

            <!-- User Menu (when authenticated) -->
            @if (authService.isAuthenticated()) {
              <div class="relative hidden sm:block">
                <button
                  (click)="toggleUserMenu()"
                  class="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <div class="w-8 h-8 rounded-full bg-agri-500 flex items-center justify-center text-white font-semibold text-sm">
                    {{ getInitials() }}
                  </div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[120px] truncate">
                    {{ authService.user()?.fullName }}
                  </span>
                  <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>

                <!-- Dropdown Menu -->
                @if (userMenuOpen()) {
                  <div class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div class="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ authService.user()?.fullName }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ authService.user()?.email }}</p>
                    </div>
                    <a routerLink="/admin/dashboard"
                       (click)="closeUserMenu()"
                       class="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                      </svg>
                      Mon espace
                    </a>
                    <a routerLink="/admin/lands"
                       (click)="closeUserMenu()"
                       class="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                      </svg>
                      Mes terres
                    </a>
                    <a routerLink="/admin/lands/new"
                       (click)="closeUserMenu()"
                       class="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                      Publier une annonce
                    </a>
                    <div class="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                      <button
                        (click)="logout()"
                        class="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                        </svg>
                        Deconnexion
                      </button>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <!-- CTA Button (when not authenticated) -->
              <a routerLink="/admin/register"
                 class="hidden sm:inline-flex btn-primary text-sm px-4 py-2.5">
                <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Publier
              </a>
            }

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
              <a routerLink="/tools"
                 (click)="closeMobileMenu()"
                 routerLinkActive="bg-agri-50 text-agri-700 dark:bg-agri-900/50 dark:text-agri-400"
                 class="px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors">
                Outils agricoles
              </a>

              @if (authService.isAuthenticated()) {
                <!-- Mobile User Menu -->
                <div class="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                  <div class="px-4 py-2 flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-agri-500 flex items-center justify-center text-white font-semibold">
                      {{ getInitials() }}
                    </div>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white">{{ authService.user()?.fullName }}</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ authService.user()?.email }}</p>
                    </div>
                  </div>
                  <a routerLink="/admin/dashboard"
                     (click)="closeMobileMenu()"
                     class="px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors flex items-center gap-3">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                    </svg>
                    Mon espace
                  </a>
                  <a routerLink="/admin/lands"
                     (click)="closeMobileMenu()"
                     class="px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors flex items-center gap-3">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                    </svg>
                    Mes terres
                  </a>
                  <a routerLink="/admin/lands/new"
                     (click)="closeMobileMenu()"
                     class="px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors flex items-center gap-3">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Publier une annonce
                  </a>
                  <button
                    (click)="logout()"
                    class="w-full px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors flex items-center gap-3">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    Deconnexion
                  </button>
                </div>
              } @else {
                <a routerLink="/admin/register"
                   (click)="closeMobileMenu()"
                   class="mt-2 btn-primary justify-center">
                  <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  Publier une annonce
                </a>
              }
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
  authService = inject(AuthService);
  mobileMenuOpen = signal(false);
  userMenuOpen = signal(false);

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
    this.userMenuOpen.set(false);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update(v => !v);
  }

  closeUserMenu(): void {
    this.userMenuOpen.set(false);
  }

  getInitials(): string {
    const name = this.authService.user()?.fullName || '';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  logout(): void {
    this.closeUserMenu();
    this.closeMobileMenu();
    this.authService.logout();
  }
}
