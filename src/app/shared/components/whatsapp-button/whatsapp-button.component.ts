import { Component, signal, inject, HostListener } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- Floating Action Buttons Container -->
    <div class="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3" [class.bottom-20]="isAdminRoute()">
      <!-- WhatsApp Button -->
      <div class="relative">
        <!-- Tooltip -->
        @if (showWhatsappTooltip() && !isMobile()) {
          <div class="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap animate-fade-in shadow-lg">
            Besoin d'aide ? Contactez-nous !
            <div class="absolute top-full right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
          </div>
        }

        <a
          href="https://wa.me/221769055852?text=Bonjour%2C%20je%20vous%20contacte%20depuis%20Petalia%20Soil.%20"
          target="_blank"
          rel="noopener noreferrer"
          (mouseenter)="showWhatsappTooltip.set(true)"
          (mouseleave)="showWhatsappTooltip.set(false)"
          class="fab-whatsapp fab-whatsapp-glow w-14 h-14 touch-target no-select"
          aria-label="Contacter via WhatsApp"
        >
          <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <!-- Pulse animation - only on desktop -->
          <span class="absolute w-full h-full rounded-full bg-[#25D366] animate-ping opacity-20 hidden sm:block"></span>
        </a>
      </div>

      <!-- Soil Analysis Request Button (shown on public pages) -->
      @if (!isAnalysisPage() && !isAdminRoute()) {
        <div class="relative">
          <!-- Tooltip -->
          @if (showAnalysisTooltip() && !isMobile()) {
            <div class="absolute bottom-full right-0 mb-2 px-3 py-2 bg-amber-600 text-white text-sm rounded-lg whitespace-nowrap animate-fade-in shadow-lg">
              Demander une analyse de sol
              <div class="absolute top-full right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-amber-600"></div>
            </div>
          }

          <a
            routerLink="/demande-analyse"
            (mouseenter)="showAnalysisTooltip.set(true)"
            (mouseleave)="showAnalysisTooltip.set(false)"
            class="fab-amber fab-amber-glow w-14 h-14 touch-target no-select"
            aria-label="Demander une analyse de sol"
          >
            <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
            </svg>
            <!-- Subtle bounce animation -->
            <span class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-bounce-subtle">
              <span class="text-white text-xs font-bold">!</span>
            </span>
          </a>
        </div>
      }

      <!-- Expand/Collapse Button for mobile when more buttons -->
      @if (isMobile() && showExpandButton()) {
        <button
          (click)="toggleExpand()"
          class="w-10 h-10 rounded-full bg-gray-600 text-white shadow-lg flex items-center justify-center transition-transform"
          [class.rotate-45]="expanded()"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
        </button>
      }
    </div>

    <!-- Mobile Bottom Quick Actions (shown on scroll up) -->
    @if (showMobileBar() && !isAdminRoute()) {
      <div class="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 p-3 sm:hidden safe-area-bottom animate-slide-up">
        <div class="flex items-center gap-2 max-w-lg mx-auto">
          <a
            routerLink="/lands"
            class="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-300 font-medium text-sm transition-colors active:bg-gray-200 dark:active:bg-gray-700"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
            </svg>
            Terres
          </a>
          <a
            routerLink="/demande-analyse"
            class="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-amber-500 hover:bg-amber-600 rounded-xl text-white font-medium text-sm transition-colors active:bg-amber-600"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
            </svg>
            Analyse
          </a>
          @if (authService.isAuthenticated()) {
            <a
              [routerLink]="getDashboardLink()"
              class="flex items-center justify-center w-11 h-11 bg-agri-500 hover:bg-agri-600 rounded-xl text-white transition-colors active:bg-agri-600"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </a>
          } @else {
            <a
              routerLink="/admin/login"
              class="flex items-center justify-center w-11 h-11 bg-agri-500 hover:bg-agri-600 rounded-xl text-white transition-colors active:bg-agri-600"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
              </svg>
            </a>
          }
        </div>
      </div>
    }
  `
})
export class WhatsappButtonComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  showWhatsappTooltip = signal(false);
  showAnalysisTooltip = signal(false);
  expanded = signal(true);
  showMobileBar = signal(true);
  private lastScrollY = 0;
  private currentUrl = '';

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.urlAfterRedirects;
    });
  }

  @HostListener('window:scroll')
  onScroll() {
    const currentScrollY = window.scrollY;
    // Show bar when scrolling up, hide when scrolling down
    if (currentScrollY < this.lastScrollY || currentScrollY < 100) {
      this.showMobileBar.set(true);
    } else {
      this.showMobileBar.set(false);
    }
    this.lastScrollY = currentScrollY;
  }

  isMobile(): boolean {
    return window.innerWidth < 640;
  }

  isAdminRoute(): boolean {
    return this.currentUrl.startsWith('/admin');
  }

  isAnalysisPage(): boolean {
    return this.currentUrl === '/demande-analyse';
  }

  showExpandButton(): boolean {
    return false; // Can be enabled when there are many FAB buttons
  }

  toggleExpand(): void {
    this.expanded.update(v => !v);
  }

  getDashboardLink(): string {
    const role = this.authService.user()?.role;
    if (role === 'FARMER') {
      return '/admin/farmer';
    }
    return '/admin/dashboard';
  }
}
