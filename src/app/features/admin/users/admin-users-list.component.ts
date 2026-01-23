import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../../shared/services/user.service';
import { UserRole } from '../../../shared/models/owner.model';

@Component({
  selector: 'app-admin-users-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DatePipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des utilisateurs
          </h1>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {{ userService.users().length }} utilisateur(s) enregistré(s)
          </p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-gray-500 dark:text-gray-400">Administrateurs</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">{{ getCountByRole('ADMIN') }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div class="flex items-center">
            <div class="p-2 bg-agri-100 dark:bg-agri-900/30 rounded-lg">
              <svg class="w-5 h-5 text-agri-600 dark:text-agri-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-gray-500 dark:text-gray-400">Propriétaires</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">{{ getCountByRole('OWNER') }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div class="flex items-center">
            <div class="p-2 bg-soil-100 dark:bg-soil-900/30 rounded-lg">
              <svg class="w-5 h-5 text-soil-600 dark:text-soil-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-gray-500 dark:text-gray-400">Agriculteurs</p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">{{ getCountByRole('FARMER') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div class="flex flex-wrap items-center gap-4">
          <!-- Search -->
          <div class="flex-1 min-w-[200px]">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="filterUsers()"
              placeholder="Rechercher un utilisateur..."
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-agri-500 focus:border-transparent"
            />
          </div>

          <!-- Role Filter -->
          <select
            [(ngModel)]="filterRole"
            (ngModelChange)="filterUsers()"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-agri-500"
          >
            <option value="">Tous les rôles</option>
            <option value="ADMIN">Administrateurs</option>
            <option value="OWNER">Propriétaires</option>
            <option value="FARMER">Agriculteurs</option>
          </select>

          @if (searchQuery || filterRole) {
            <button
              (click)="clearFilters()"
              class="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Effacer
            </button>
          }
        </div>
      </div>

      <!-- Error Message -->
      @if (userService.error()) {
        <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-sm text-red-700 dark:text-red-400">{{ userService.error() }}</span>
          </div>
        </div>
      }

      <!-- Users Table -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        @if (userService.loading()) {
          <div class="p-8 text-center">
            <div class="animate-spin w-8 h-8 border-4 border-agri-600 border-t-transparent rounded-full mx-auto"></div>
            <p class="mt-4 text-gray-500 dark:text-gray-400">Chargement des utilisateurs...</p>
          </div>
        } @else if (filteredUsers().length === 0) {
          <div class="p-8 text-center">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucun utilisateur trouvé
            </h3>
            <p class="text-gray-500 dark:text-gray-400">
              @if (searchQuery || filterRole) {
                Aucun résultat ne correspond à vos critères.
              } @else {
                Aucun utilisateur enregistré pour le moment.
              }
            </p>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Statut
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Inscription
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                @for (user of filteredUsers(); track user._id) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <div class="h-10 w-10 rounded-full bg-agri-100 dark:bg-agri-900/30 flex items-center justify-center">
                            <span class="text-agri-700 dark:text-agri-400 font-medium">
                              {{ getInitials(user.fullName) }}
                            </span>
                          </div>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900 dark:text-white">
                            {{ user.fullName }}
                          </div>
                          <div class="text-sm text-gray-500 dark:text-gray-400">
                            ID: {{ user._id | slice:0:8 }}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-900 dark:text-white">{{ user.email }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ user.phone }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        [class.bg-purple-100]="user.role === 'ADMIN'"
                        [class.text-purple-800]="user.role === 'ADMIN'"
                        [class.dark:bg-purple-900/30]="user.role === 'ADMIN'"
                        [class.dark:text-purple-400]="user.role === 'ADMIN'"
                        [class.bg-agri-100]="user.role === 'OWNER'"
                        [class.text-agri-800]="user.role === 'OWNER'"
                        [class.dark:bg-agri-900/30]="user.role === 'OWNER'"
                        [class.dark:text-agri-400]="user.role === 'OWNER'"
                        [class.bg-soil-100]="user.role === 'FARMER'"
                        [class.text-soil-800]="user.role === 'FARMER'"
                        [class.dark:bg-soil-900/30]="user.role === 'FARMER'"
                        [class.dark:text-soil-400]="user.role === 'FARMER'"
                      >
                        {{ userService.getRoleLabel(user.role) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      @if (user.verified) {
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                          </svg>
                          Vérifié
                        </span>
                      } @else {
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                          Non vérifié
                        </span>
                      }
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {{ user.createdAt | date:'dd/MM/yyyy' }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `
})
export class AdminUsersListComponent implements OnInit {
  userService = inject(UserService);

  searchQuery = '';
  filterRole: UserRole | '' = '';
  filteredUsers = signal<User[]>([]);

  ngOnInit(): void {
    this.userService.loadUsers().subscribe(() => {
      this.filterUsers();
    });
  }

  filterUsers(): void {
    let users = this.userService.users();

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      users = users.filter(user =>
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.includes(query)
      );
    }

    if (this.filterRole) {
      users = users.filter(user => user.role === this.filterRole);
    }

    this.filteredUsers.set(users);
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterRole = '';
    this.filterUsers();
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getCountByRole(role: UserRole): number {
    return this.userService.getUsersByRole(role).length;
  }
}
