import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  template: `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
      <!-- Sidebar -->
      <aside
        class="fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 lg:translate-x-0"
        [class.-translate-x-full]="!sidebarOpen()"
      >
        <!-- Logo -->
        <div class="flex h-16 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
          <a [routerLink]="getDashboardLink()" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <img  src="logo.png" [alt]="'Pétalia'"/>
            </div>
            <div class="hidden sm:block">
              <span class="text-xl md:text-2xl font-display font-bold text-gray-900 dark:text-white">Petalia</span>
              <span class="text-xl md:text-2xl font-display font-bold text-agri-600 dark:text-agri-400">Soil</span>
            </div>
          </a>
          <button
            (click)="toggleSidebar()"
            class="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Navigation -->
        <nav class="mt-6 px-3">
          <div class="space-y-1">
            <a
              [routerLink]="getDashboardLink()"
              routerLinkActive="bg-agri-50 text-agri-700 dark:bg-agri-900/20 dark:text-agri-400"
              class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              Tableau de bord
            </a>

            @if (authService.isOwner()) {
              <a
                routerLink="/admin/lands"
                routerLinkActive="bg-agri-50 text-agri-700 dark:bg-agri-900/20 dark:text-agri-400"
                class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                </svg>
                Gestion des terres
              </a>

              <a
                routerLink="/admin/my-requests"
                routerLinkActive="bg-agri-50 text-agri-700 dark:bg-agri-900/20 dark:text-agri-400"
                class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                </svg>
                Mes demandes d'analyse
              </a>
            }

            @if (authService.isAdmin()) {
              <a
                routerLink="/admin/soil-analysis"
                routerLinkActive="bg-agri-50 text-agri-700 dark:bg-agri-900/20 dark:text-agri-400"
                class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                </svg>
                Demandes d'analyse
              </a>

              <a
                routerLink="/admin/technicians"
                routerLinkActive="bg-agri-50 text-agri-700 dark:bg-agri-900/20 dark:text-agri-400"
                class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                Techniciens
              </a>
            }

            @if (authService.isAdmin()) {
              <a
                routerLink="/admin/users"
                routerLinkActive="bg-agri-50 text-agri-700 dark:bg-agri-900/20 dark:text-agri-400"
                class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
                Utilisateurs
              </a>
            }
          </div>

          <!-- Separator -->
          <div class="my-6 border-t border-gray-200 dark:border-gray-700"></div>

          <!-- Secondary Navigation -->
          <div class="space-y-1">
            <a
              routerLink="/"
              class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
              Voir le site
            </a>
          </div>
        </nav>

        <!-- User Profile -->
        <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 rounded-full bg-agri-100 dark:bg-agri-900 flex items-center justify-center">
                <span class="text-agri-700 dark:text-agri-300 font-medium">
                  {{ getUserInitials() }}
                </span>
              </div>
            </div>
            <div class="ml-3 flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ authService.user()?.fullName }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ getRoleLabel() }}
              </p>
            </div>
            <button
              (click)="logout()"
              class="ml-2 p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Déconnexion"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <!-- Mobile sidebar overlay -->
      @if (sidebarOpen()) {
        <div
          class="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          (click)="toggleSidebar()"
        ></div>
      }

      <!-- Main content -->
      <div class="lg:pl-64">
        <!-- Top bar -->
        <header class="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-sm">
          <div class="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              (click)="toggleSidebar()"
              class="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>

            <div class="flex-1 lg:ml-0"></div>

            <div class="flex items-center space-x-3">
              <!-- Voir le site -->
              <a
                routerLink="/"
                class="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-agri-600 dark:hover:text-agri-400 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
                Voir le site
              </a>

              <!-- Nouvelle terre (owners only) -->
              @if (authService.isOwner()) {
                <a
                  routerLink="/admin/lands/new"
                  class="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-agri-600 rounded-lg hover:bg-agri-700 transition-colors"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  Nouvelle terre
                </a>
              }

              <!-- Notifications -->
              <div class="relative">
                <button
                  (click)="toggleNotifications()"
                  class="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                  </svg>
                  <!-- Notification badge -->
                  <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <!-- Notifications dropdown -->
                @if (notificationsOpen()) {
                  <div class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div class="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    </div>
                    <div class="max-h-64 overflow-y-auto">
                      <div class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                        <p class="text-sm text-gray-900 dark:text-white">Nouvelle demande de contact</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Il y a 5 minutes</p>
                      </div>
                      <div class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                        <p class="text-sm text-gray-900 dark:text-white">Votre annonce a ete vue 50 fois</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Il y a 2 heures</p>
                      </div>
                      <div class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                        <p class="text-sm text-gray-900 dark:text-white">Bienvenue sur Petalia Soil !</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Il y a 1 jour</p>
                      </div>
                    </div>
                    <div class="px-4 py-2 border-t border-gray-100 dark:border-gray-700">
                      <a href="#" class="text-sm text-agri-600 dark:text-agri-400 hover:underline">Voir toutes les notifications</a>
                    </div>
                  </div>
                }
              </div>

              <!-- User Menu -->
              <div class="relative">
                <button
                  (click)="toggleUserMenu()"
                  class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div class="w-8 h-8 rounded-full bg-agri-500 flex items-center justify-center text-white font-semibold text-sm">
                    {{ getUserInitials() }}
                  </div>
                  <div class="hidden md:block text-left">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px]">
                      {{ authService.user()?.fullName }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ getRoleLabel() }}
                    </p>
                  </div>
                  <svg class="w-4 h-4 text-gray-500 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>

                <!-- User dropdown -->
                @if (userMenuOpen()) {
                  <div class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div class="px-4 py-2 border-b border-gray-100 dark:border-gray-700 md:hidden">
                      <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ authService.user()?.fullName }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ authService.user()?.email }}</p>
                    </div>
                    <a
                      [routerLink]="getDashboardLink()"
                      (click)="closeUserMenu()"
                      class="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                      </svg>
                      Tableau de bord
                    </a>
                    @if (authService.isOwner()) {
                      <a
                        routerLink="/admin/lands"
                        (click)="closeUserMenu()"
                        class="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                        </svg>
                        Mes terres
                      </a>
                    }
                    <a
                      routerLink="/"
                      (click)="closeUserMenu()"
                      class="flex items-center gap-3 px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors md:hidden"
                    >
                      <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                      </svg>
                      Voir le site
                    </a>
                    <div class="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                      <button
                        (click)="logout()"
                        class="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                        </svg>
                        Deconnexion
                      </button>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </header>

        <!-- Page content -->
        <main class="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-8rem)]">
          <router-outlet></router-outlet>
        </main>

        <!-- Admin Footer -->
        <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div class="px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                &copy; {{ currentYear }} Petalia Soil. Tous droits reserves.
              </p>
              <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <a href="mailto:contact@petalia.sn" class="hover:text-agri-600 dark:hover:text-agri-400 transition-colors flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  Support
                </a>
                <span class="text-gray-300 dark:text-gray-600">|</span>
                <a routerLink="/" class="hover:text-agri-600 dark:hover:text-agri-400 transition-colors flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                  Voir le site
                </a>
                <span class="text-gray-300 dark:text-gray-600">|</span>
                <span class="text-xs">v1.0.0</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  `
})
export class AdminLayoutComponent {
  authService = inject(AuthService);
  sidebarOpen = signal(false);
  notificationsOpen = signal(false);
  userMenuOpen = signal(false);
  currentYear = new Date().getFullYear();

  toggleSidebar(): void {
    this.sidebarOpen.update(open => !open);
  }

  toggleNotifications(): void {
    this.notificationsOpen.update(open => !open);
    this.userMenuOpen.set(false);
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update(open => !open);
    this.notificationsOpen.set(false);
  }

  closeUserMenu(): void {
    this.userMenuOpen.set(false);
  }

  logout(): void {
    this.closeUserMenu();
    this.authService.logout();
  }

  getUserInitials(): string {
    const user = this.authService.user();
    if (!user?.fullName) return '?';
    const names = user.fullName.split(' ');
    return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getRoleLabel(): string {
    const role = this.authService.user()?.role;
    const labels: Record<string, string> = {
      ADMIN: 'Administrateur',
      OWNER: 'Propriétaire',
      FARMER: 'Agriculteur'
    };
    return labels[role || ''] || role || '';
  }

  getDashboardLink(): string {
    const role = this.authService.user()?.role;
    if (role === 'FARMER') {
      return '/admin/farmer';
    }
    return '/admin/dashboard';
  }
}
