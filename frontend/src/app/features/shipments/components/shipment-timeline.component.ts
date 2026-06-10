import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineStep } from '../../models/shipment.model';

@Component({
  selector: 'app-shipment-timeline',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="timeline">
      <div
        *ngFor="let step of steps; let last = last"
        class="timeline-item"
        [class.completed]="step.completed"
        [class.active]="step.active"
      >
        <div class="step-wrapper">
          <div class="step-icon">
            <svg *ngIf="step.completed && !step.active" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7l3 3 6-6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div *ngIf="step.active" class="active-dot"></div>
          </div>
          <div *ngIf="!last" class="connector"></div>
        </div>
        <div class="step-info">
          <span class="step-label">{{ step.label }}</span>
          <span class="step-date">{{ step.date }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .timeline {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .timeline-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .step-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
    }

    .step-icon {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #e5e7eb;
      border: 2px solid #e5e7eb;
      z-index: 1;
      transition: all 0.2s ease;
    }

    .connector {
      width: 2px;
      height: 32px;
      background: #e5e7eb;
      margin: 2px 0;
      transition: background 0.2s ease;
    }

    .step-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 4px 0 28px;
    }

    .step-label {
      font-size: 13px;
      font-weight: 500;
      color: #9ca3af;
    }

    .step-date {
      font-size: 11px;
      color: #d1d5db;
    }

    // Completed state
    .timeline-item.completed {
      .step-icon {
        background: #3b82f6;
        border-color: #3b82f6;
      }
      .connector { background: #3b82f6; }
      .step-label { color: #374151; }
      .step-date { color: #6b7280; }
    }

    // Active state
    .timeline-item.active {
      .step-icon {
        background: #fff;
        border-color: #3b82f6;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
      }
      .step-label {
        color: #1d4ed8;
        font-weight: 700;
      }
      .step-date { color: #3b82f6; }

      .active-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #3b82f6;
      }
    }
  `],
})
export class ShipmentTimelineComponent {
  @Input({ required: true }) steps: TimelineStep[] = [];
}