import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="empty-state">
      <div class="icon-wrap">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="31" stroke="#e5e7eb" stroke-width="2"/>
          <path d="M20 22h24M20 32h16M20 42h10" stroke="#9ca3af" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="46" cy="42" r="9" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
          <path d="M43 42l2 2 4-4" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h3 class="empty-title">{{ title }}</h3>
      <p class="empty-desc">{{ description }}</p>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 24px;
      text-align: center;

      .icon-wrap { margin-bottom: 20px; }

      .empty-title {
        font-size: 16px;
        font-weight: 600;
        color: #374151;
        margin: 0 0 8px;
      }

      .empty-desc {
        font-size: 14px;
        color: #9ca3af;
        margin: 0;
        max-width: 280px;
      }
    }
  `],
})
export class EmptyStateComponent {
  @Input() title = 'No shipments found';
  @Input() description = 'Try adjusting your search or check back later.';
}