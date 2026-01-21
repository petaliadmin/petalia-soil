import { Component, Input, computed, signal } from '@angular/core';

@Component({
  selector: 'app-soil-gauge',
  standalone: true,
  template: `
    <div class="relative">
      <!-- Label -->
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ label }}</span>
        <span class="text-sm font-bold" [class]="valueColorClass()">{{ displayValue() }}</span>
      </div>

      <!-- Gauge Bar -->
      <div class="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-500 ease-out"
          [style.width.%]="percentage()"
          [class]="barColorClass()"
        ></div>
      </div>

      <!-- Min/Max Labels -->
      @if (showRange) {
        <div class="flex justify-between mt-1">
          <span class="text-xs text-gray-400">{{ min }}</span>
          <span class="text-xs text-gray-400">{{ max }}</span>
        </div>
      }
    </div>
  `
})
export class SoilGaugeComponent {
  @Input() label = '';
  @Input() value = 0;
  @Input() min = 0;
  @Input() max = 100;
  @Input() unit = '';
  @Input() optimal?: { min: number; max: number };
  @Input() showRange = false;

  percentage = computed(() => {
    const range = this.max - this.min;
    if (range === 0) return 0;
    const pct = ((this.value - this.min) / range) * 100;
    return Math.min(100, Math.max(0, pct));
  });

  displayValue = computed(() => {
    return this.unit ? `${this.value}${this.unit}` : this.value.toString();
  });

  barColorClass = computed(() => {
    if (this.optimal) {
      if (this.value >= this.optimal.min && this.value <= this.optimal.max) {
        return 'bg-agri-500';
      } else if (this.value < this.optimal.min) {
        return 'bg-amber-500';
      } else {
        return 'bg-red-500';
      }
    }

    // Default gradient based on percentage
    const pct = this.percentage();
    if (pct < 30) return 'bg-red-500';
    if (pct < 60) return 'bg-amber-500';
    return 'bg-agri-500';
  });

  valueColorClass = computed(() => {
    if (this.optimal) {
      if (this.value >= this.optimal.min && this.value <= this.optimal.max) {
        return 'text-agri-600 dark:text-agri-400';
      } else if (this.value < this.optimal.min) {
        return 'text-amber-600 dark:text-amber-400';
      } else {
        return 'text-red-600 dark:text-red-400';
      }
    }
    return 'text-gray-900 dark:text-white';
  });
}
