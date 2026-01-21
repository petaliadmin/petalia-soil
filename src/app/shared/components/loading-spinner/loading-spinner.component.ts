import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="flex flex-col items-center justify-center" [class]="containerClass">
      <!-- Spinner -->
      <div class="relative">
        <div
          class="rounded-full border-4 border-gray-200 dark:border-gray-700"
          [class]="sizeClasses[size]"
        ></div>
        <div
          class="absolute inset-0 rounded-full border-4 border-transparent border-t-agri-500 animate-spin"
          [class]="sizeClasses[size]"
        ></div>
      </div>

      <!-- Message -->
      @if (message) {
        <p class="mt-4 text-gray-600 dark:text-gray-400 text-sm">{{ message }}</p>
      }
    </div>
  `
})
export class LoadingSpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() message?: string;
  @Input() containerClass = 'py-12';

  sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };
}
