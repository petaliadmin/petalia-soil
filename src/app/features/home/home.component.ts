import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LandService } from '../../shared/services/land.service';
import { FarmerService } from '../../shared/services/farmer.service';
import { AuthService } from '../../shared/services/auth.service';
import { LandCardComponent } from '../../shared/components/land-card/land-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { Land } from '../../shared/models/land.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, LandCardComponent, LoadingSpinnerComponent],
  template: `
    <!-- Hero Section -->
    <section class="relative min-h-[85vh] flex items-center overflow-hidden">
      <!-- Background -->
      <div class="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80"
          alt="Agricultural landscape"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/40"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
      </div>

      <!-- Floating Elements -->
      <div class="absolute top-20 right-20 w-72 h-72 bg-agri-500/20 rounded-full blur-3xl animate-float hidden lg:block"></div>
      <div class="absolute bottom-40 left-20 w-64 h-64 bg-agri-400/15 rounded-full blur-3xl animate-float hidden lg:block" style="animation-delay: 1s;"></div>

      <!-- Content -->
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="max-w-3xl">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-agri-500/20 backdrop-blur-sm border border-agri-500/30 rounded-full mb-8 animate-fade-in">
            <span class="w-2 h-2 bg-agri-400 rounded-full animate-pulse"></span>
            <span class="text-agri-300 text-sm font-medium">Plateforme agricole intelligente</span>
          </div>

          <!-- Headline -->
          <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight mb-6 animate-slide-up">
            Trouvez la terre
            <span class="block text-agri-400">ideale pour votre culture</span>
          </h1>

          <!-- Subtitle -->
          <p class="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl animate-slide-up stagger-1">
            Analysez les parametres du sol, decouvrez les cultures adaptees et connectez-vous directement avec les proprietaires. L'agriculture de precision commence ici.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 animate-slide-up stagger-2">
            <a routerLink="/lands" class="btn-primary text-lg px-8 py-4">
              <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              Voir les terres disponibles
            </a>
            <a routerLink="/map" class="btn-secondary text-lg px-8 py-4 bg-white/10 border-white/20 text-white hover:bg-white/20">
              <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
              </svg>
              Explorer la carte
            </a>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/10 animate-slide-up stagger-3">
            <div>
              <p class="text-3xl md:text-4xl font-bold text-white">500+</p>
              <p class="text-gray-400 text-sm md:text-base">Terres disponibles</p>
            </div>
            <div>
              <p class="text-3xl md:text-4xl font-bold text-white">12</p>
              <p class="text-gray-400 text-sm md:text-base">Regions couvertes</p>
            </div>
            <div>
              <p class="text-3xl md:text-4xl font-bold text-white">1200+</p>
              <p class="text-gray-400 text-sm md:text-base">Agriculteurs actifs</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg class="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
        </svg>
      </div>
    </section>

    <!-- Soil Analysis Service Banner -->
    <section class="py-16 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 relative overflow-hidden">
      <div class="absolute inset-0 opacity-20">
        <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="1" fill="currentColor"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-10">
          <span class="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white uppercase tracking-wide mb-4">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            Nouveau service
          </span>
          <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">Service d'analyse de sol professionnelle</h2>
          <p class="text-amber-100 text-base md:text-lg max-w-2xl mx-auto">Nos experts se deplacent sur votre parcelle pour une analyse complete et personnalisee</p>
        </div>

        <!-- Benefits Grid -->
        <div class="grid md:grid-cols-3 gap-6 mb-10">
          <!-- Benefit 1 -->
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-colors">
            <div class="w-14 h-14 mx-auto mb-4 bg-white/20 rounded-xl flex items-center justify-center">
              <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Optimisez vos rendements</h3>
            <p class="text-amber-100 text-sm">Connaissez les parametres de votre sol (pH, NPK, texture) pour maximiser vos cultures</p>
          </div>

          <!-- Benefit 2 -->
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-colors">
            <div class="w-14 h-14 mx-auto mb-4 bg-white/20 rounded-xl flex items-center justify-center">
              <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Valorisez vos terres</h3>
            <p class="text-amber-100 text-sm">Mettez vos terres en vente ou en location avec des donnees fiables et certifiees</p>
          </div>

          <!-- Benefit 3 -->
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-colors">
            <div class="w-14 h-14 mx-auto mb-4 bg-white/20 rounded-xl flex items-center justify-center">
              <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Recommandations IA</h3>
            <p class="text-amber-100 text-sm">Beneficiez de conseils personnalises par intelligence artificielle pour vos cultures</p>
          </div>
        </div>

        <!-- CTA -->
        <div class="text-center">
          <a routerLink="/demande-analyse" class="inline-flex items-center btn-primary bg-white text-amber-700 hover:bg-amber-50 shadow-xl px-8 py-4 text-lg">
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            Demander une analyse gratuite
          </a>
          <p class="text-amber-100/80 text-sm mt-3">Reponse sous 48h - Intervention sur toutes les regions du Senegal</p>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 md:py-28 bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <span class="badge-green mb-4">Pourquoi Petalia Soil</span>
          <h2 class="section-title mb-4">Une plateforme complete pour l'agriculture</h2>
          <p class="section-subtitle mx-auto">
            Des outils modernes pour vous aider a prendre les meilleures decisions pour vos cultures.
          </p>
        </div>

        <!-- Features Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="card p-8 text-center group">
            <div class="w-16 h-16 mx-auto mb-6 bg-agri-100 dark:bg-agri-900/50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-agri-600 dark:text-agri-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Carte Interactive</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Explorez les terres disponibles sur une carte interactive avec geolocalisation precise.
            </p>
          </div>

          <!-- Feature 2 - Analyse du Sol -->
          <a routerLink="/demande-analyse" class="card p-8 text-center group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block">
            <div class="w-16 h-16 mx-auto mb-6 bg-amber-100 dark:bg-amber-900/50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform relative">
              <svg class="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
              </svg>
              <span class="absolute -top-1 -right-1 px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full">PRO</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-amber-600 transition-colors">Analyse du Sol</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              Demandez une analyse professionnelle : pH, NPK, texture, humidite et recommandations.
            </p>
            <span class="inline-flex items-center text-amber-600 dark:text-amber-400 font-medium text-sm group-hover:gap-2 transition-all">
              Demander une analyse
              <svg class="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </span>
          </a>

          <!-- Feature 3 -->
          <div class="card p-8 text-center group">
            <div class="w-16 h-16 mx-auto mb-6 bg-green-100 dark:bg-green-900/50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Recommandations IA</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Recevez des suggestions de cultures adaptees basees sur l'analyse intelligente du sol.
            </p>
          </div>

          <!-- Feature 4 -->
          <div class="card p-8 text-center group">
            <div class="w-16 h-16 mx-auto mb-6 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Contact Direct</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Connectez-vous directement avec les proprietaires via telephone, email ou WhatsApp.
            </p>
          </div>

          <!-- Feature 5 -->
          <div class="card p-8 text-center group">
            <div class="w-16 h-16 mx-auto mb-6 bg-purple-100 dark:bg-purple-900/50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Filtres Avances</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Trouvez la terre parfaite grace a des filtres par region, pH, surface et culture.
            </p>
          </div>

          <!-- Feature 6 -->
          <div class="card p-8 text-center group">
            <div class="w-16 h-16 mx-auto mb-6 bg-rose-100 dark:bg-rose-900/50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Prix Transparents</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Comparez les prix de location et de vente en toute transparence.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Lands Section -->
    <section class="py-20 md:py-28 bg-gray-50 dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <span class="badge-green mb-4">Nouvelles annonces</span>
            <h2 class="section-title">Terres recemment ajoutees</h2>
          </div>
          <a routerLink="/lands" class="btn-outline self-start sm:self-auto">
            Voir toutes les terres
            <svg class="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
        </div>

        <!-- Loading State -->
        @if (landService.loading()) {
          <app-loading-spinner message="Chargement des terres..." />
        }

        <!-- Lands Grid -->
        @if (!landService.loading() && recentLands().length > 0) {
          <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (land of recentLands(); track land._id) {
              <app-land-card
                [land]="land"
                [isFavorite]="farmerService.isFavorite(land._id)"
                (favoriteToggle)="onFavoriteToggle($event)"
              />
            }
          </div>
        }
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 md:py-28 bg-gradient-to-br from-agri-600 via-agri-700 to-agri-800 relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" stroke-width="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
          Pret a trouver votre terre ideale ?
        </h2>
        <p class="text-lg md:text-xl text-agri-100 mb-10 max-w-2xl mx-auto">
          Rejoignez des centaines d'agriculteurs qui ont deja trouve leur parcelle parfaite grace a Petalia Soil.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a routerLink="/lands" class="btn-primary bg-white text-agri-700 hover:bg-gray-100 shadow-xl text-lg px-8 py-4">
            Commencer maintenant
          </a>
          <a routerLink="/map" class="btn-secondary border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4">
            Explorer la carte
          </a>
        </div>
      </div>
    </section>
  `
})
export class HomeComponent implements OnInit {
  private router = inject(Router);
  landService = inject(LandService);
  farmerService = inject(FarmerService);
  authService = inject(AuthService);
  recentLands = signal<Land[]>([]);

  ngOnInit(): void {
    this.landService.loadLands().subscribe(lands => {
      // Sort by creation date and take the 4 most recent
      const sorted = [...lands].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      this.recentLands.set(sorted.slice(0, 4));
    });
  }

  onFavoriteToggle(land: Land): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/admin/login']);
      return;
    }
    this.farmerService.toggleFavorite(land._id);
  }
}
