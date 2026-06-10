import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="skeleton-card" *ngFor="let item of items">
      <div class="skeleton-image shimmer"></div>
      <div class="skeleton-content">
        <div class="skeleton-line wide shimmer"></div>
        <div class="skeleton-line medium shimmer"></div>
        <div class="skeleton-chips">
          <div class="skeleton-chip shimmer"></div>
          <div class="skeleton-chip shimmer"></div>
          <div class="skeleton-chip shimmer"></div>
          <div class="skeleton-chip shimmer"></div>
        </div>
      </div>
      <div class="skeleton-status shimmer"></div>
    </div>
  `,
  styles: [`
    @keyframes shimmer {
      0% { background-position: -500px 0; }
      100% { background-position: 500px 0; }
    }

    .shimmer {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 1000px 100%;
      animation: shimmer 1.4s infinite linear;
      border-radius: 6px;
    }

    .skeleton-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      border: 1.5px solid #e5e7eb;
      border-radius: 12px;
      margin-bottom: 12px;
      background: #fff;
    }

    .skeleton-image {
      width: 90px;
      height: 80px;
      border-radius: 10px;
      flex-shrink: 0;
    }

    .skeleton-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .skeleton-line {
      height: 14px;
      border-radius: 4px;

      &.wide { width: 60%; }
      &.medium { width: 40%; }
    }

    .skeleton-chips {
      display: flex;
      gap: 10px;
    }

    .skeleton-chip {
      width: 90px;
      height: 28px;
      border-radius: 20px;
    }

    .skeleton-status {
      width: 110px;
      height: 32px;
      border-radius: 20px;
      flex-shrink: 0;
    }
  `],
})
export class SkeletonLoaderComponent {
  @Input() count = 5;
  get items() { return Array(this.count); }
}