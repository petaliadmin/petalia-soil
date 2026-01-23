import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { UserRole } from '../../../shared/models/owner.model';

@Component({
  selector: 'app-admin-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-agri-50 to-soil-50 dark:from-gray-900 dark:to-gray-800 px-4 py-12">
      <div class="w-full max-w-md">
        <!-- Logo -->
        <div class="text-center mb-8">
          <a routerLink="/" class="inline-flex items-center space-x-2">
            <div class="w-12 h-12 bg-agri-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <span class="text-2xl font-bold text-gray-900 dark:text-white">Petalia Soil</span>
          </a>
          <h2 class="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
            Créer un compte
          </h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Rejoignez la plateforme agricole du Sénégal
          </p>
        </div>

        <!-- Register Form -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          @if (authService.error()) {
            <div class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="text-sm text-red-700 dark:text-red-400">{{ authService.error() }}</span>
              </div>
            </div>
          }

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-5">
            <!-- Full Name -->
            <div>
              <label for="fullName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Nom complet
              </label>
              <input
                type="text"
                id="fullName"
                formControlName="fullName"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-agri-500 focus:border-transparent transition-colors"
                placeholder="Prénom Nom"
                [class.border-red-500]="isFieldInvalid('fullName')"
              />
              @if (isFieldInvalid('fullName')) {
                <p class="mt-1.5 text-sm text-red-500">Le nom complet est requis</p>
              }
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Adresse email
              </label>
              <input
                type="email"
                id="email"
                formControlName="email"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-agri-500 focus:border-transparent transition-colors"
                placeholder="votre@email.com"
                [class.border-red-500]="isFieldInvalid('email')"
              />
              @if (isFieldInvalid('email')) {
                <p class="mt-1.5 text-sm text-red-500">
                  @if (registerForm.get('email')?.errors?.['required']) {
                    L'email est requis
                  } @else if (registerForm.get('email')?.errors?.['email']) {
                    Format d'email invalide
                  }
                </p>
              }
            </div>

            <!-- Phone -->
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Téléphone
              </label>
              <input
                type="tel"
                id="phone"
                formControlName="phone"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-agri-500 focus:border-transparent transition-colors"
                placeholder="+221 77 123 45 67"
                [class.border-red-500]="isFieldInvalid('phone')"
              />
              @if (isFieldInvalid('phone')) {
                <p class="mt-1.5 text-sm text-red-500">Le téléphone est requis</p>
              }
            </div>

            <!-- Role -->
            <div>
              <label for="role" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Vous êtes
              </label>
              <select
                id="role"
                formControlName="role"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-agri-500 focus:border-transparent transition-colors"
              >
                <option value="OWNER">Propriétaire de terres</option>
                <option value="FARMER">Agriculteur</option>
              </select>
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Mot de passe
              </label>
              <div class="relative">
                <input
                  [type]="showPassword() ? 'text' : 'password'"
                  id="password"
                  formControlName="password"
                  class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-agri-500 focus:border-transparent transition-colors pr-12"
                  placeholder="Minimum 6 caractères"
                  [class.border-red-500]="isFieldInvalid('password')"
                />
                <button
                  type="button"
                  (click)="togglePassword()"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  @if (showPassword()) {
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                  } @else {
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  }
                </button>
              </div>
              @if (isFieldInvalid('password')) {
                <p class="mt-1.5 text-sm text-red-500">
                  Le mot de passe doit contenir au moins 6 caractères
                </p>
              }
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="authService.loading() || registerForm.invalid"
              class="w-full py-3 px-4 bg-agri-600 hover:bg-agri-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center"
            >
              @if (authService.loading()) {
                <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Inscription en cours...
              } @else {
                Créer mon compte
              }
            </button>
          </form>

          <!-- Login Link -->
          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Déjà un compte ?
              <a routerLink="/admin/login" class="text-agri-600 hover:text-agri-700 font-medium">
                Se connecter
              </a>
            </p>
          </div>
        </div>

        <!-- Back to site -->
        <div class="mt-6 text-center">
          <a routerLink="/" class="text-sm text-gray-600 dark:text-gray-400 hover:text-agri-600 dark:hover:text-agri-400 inline-flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Retour au site
          </a>
        </div>
      </div>
    </div>
  `
})
export class AdminRegisterComponent {
  authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  showPassword = signal(false);

  registerForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    role: ['OWNER' as UserRole],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  togglePassword(): void {
    this.showPassword.update(show => !show);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return control ? control.invalid && control.touched : false;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.authService.clearError();
    const formValue = this.registerForm.value;

    this.authService.register({
      fullName: formValue.fullName,
      email: formValue.email,
      phone: formValue.phone,
      role: formValue.role,
      password: formValue.password
    }).subscribe({
      next: () => {
        this.router.navigate(['/admin/dashboard']);
      },
      error: () => {
        // Error is handled by the service
      }
    });
  }
}
