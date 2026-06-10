import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Shipment } from '../../models/shipment.model';
import { StatusChipComponent } from '../../../../shared/components/status-chip/status-chip.component';
import { ShipmentTimelineComponent } from '../shipment-timeline/shipment-timeline.component';

@Component({
  selector: 'app-shipment-card',
  standalone: true,
  imports: [CommonModule, StatusChipComponent, ShipmentTimelineComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('expand', [
      state('void', style({ height: '0', opacity: 0, overflow: 'hidden' })),
      state('*', style({ height: '*', opacity: 1 })),
      transition('void <=> *', animate('250ms cubic-bezier(0.4,0,0.2,1)')),
    ]),
  ],
  template: `
    <div class="card" [class.expanded]="expanded" (click)="onCardClick()">

      <!-- Collapsed Row -->
      <div class="card-row">
        <img
          [src]="shipment.image"
          [alt]="shipment.productName"
          class="product-image"
          loading="lazy"
          (error)="onImgError($event)"
        />

        <div class="card-info">
          <div class="customer-name">{{ shipment.customerName }}</div>
          <div class="meta-row">
            <div class="meta-item">
              <span class="meta-label">No. of Orders</span>
              <span class="meta-value">{{ shipment.orderCount }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Weight</span>
              <span class="meta-value">{{ shipment.weight }}kg</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Arrival Date</span>
              <span class="meta-value">{{ shipment.deliveryDate }}</span>
            </div>
            <div class="meta-item notes-item" *ngIf="shipment.notes">
              <span class="meta-label">Notes</span>
              <span class="meta-value notes-text">{{ shipment.notes }}</span>
            </div>
          </div>
        </div>

        <div class="card-right">
          <app-status-chip [status]="shipment.status" />
          <button class="expand-btn" [class.rotated]="expanded" (click)="$event.stopPropagation(); onCardClick()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Expanded Section -->
      <div class="expanded-section" *ngIf="expanded" @expand>
        <div class="divider"></div>
        <div class="detail-grid">

          <!-- Left: Product -->
          <div class="detail-col product-col">
            <img
              [src]="shipment.image"
              [alt]="shipment.productName"
              class="detail-image"
              loading="lazy"
            />
            <div class="detail-product-info">
              <div class="detail-product-name">{{ shipment.productName }}</div>
              <div class="detail-badges">
                <span *ngIf="shipment.category" class="badge-category">{{ shipment.category }}</span>
                <span class="badge-order-id">{{ shipment.id }}</span>
              </div>
              <div class="detail-dims" *ngIf="shipment.dimensions">
                <span class="dim-item">
                  <span class="dim-label">L</span>{{ shipment.dimensions.length }}cm
                </span>
                <span class="dim-sep">×</span>
                <span class="dim-item">
                  <span class="dim-label">W</span>{{ shipment.dimensions.width }}cm
                </span>
                <span class="dim-sep">×</span>
                <span class="dim-item">
                  <span class="dim-label">H</span>{{ shipment.dimensions.height }}cm
                </span>
              </div>
            </div>
          </div>

          <!-- Middle: Order Details + Receiver -->
          <div class="detail-col info-col">
            <div class="info-section">
              <div class="info-section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"/>
                  <rect x="9" y="3" width="6" height="4" rx="1" stroke="#3b82f6" stroke-width="2"/>
                </svg>
                Order Details
              </div>
              <div class="info-row">
                <span class="info-key">Order ID</span>
                <span class="info-val order-id-val">{{ shipment.id }}</span>
              </div>
              <div class="info-row">
                <span class="info-key">Order Date</span>
                <span class="info-val">{{ shipment.orderDate }}</span>
              </div>
              <div class="info-row">
                <span class="info-key">Delivery Date</span>
                <span class="info-val">{{ shipment.deliveryDate }}</span>
              </div>
              <div class="info-row">
                <span class="info-key">No. of Orders</span>
                <span class="info-val">{{ shipment.orderCount }}</span>
              </div>
              <div class="info-row">
                <span class="info-key">Weight</span>
                <span class="info-val">{{ shipment.weight }} kg</span>
              </div>
              <div class="info-row">
                <span class="info-key">Tracking</span>
                <span class="info-val tracking">{{ shipment.trackingNumber }}</span>
              </div>
            </div>

            <div class="info-section">
              <div class="info-section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"/>
                  <circle cx="12" cy="7" r="4" stroke="#3b82f6" stroke-width="2"/>
                </svg>
                Receiver Information
              </div>
              <div class="info-row">
                <span class="info-key">Name</span>
                <span class="info-val">{{ shipment.receiverName }}</span>
              </div>
              <div class="info-row">
                <span class="info-key">Phone</span>
                <span class="info-val phone">{{ shipment.receiverPhone }}</span>
              </div>
              <div class="info-row">
                <span class="info-key">City</span>
                <span class="info-val">{{ shipment.receiverCity }}</span>
              </div>
              <div class="info-row">
                <span class="info-key">Address</span>
                <span class="info-val">{{ shipment.receiverAddress }}</span>
              </div>
            </div>

            <div class="info-section" *ngIf="shipment.notes">
              <div class="info-section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8v4m0 4h.01M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10z" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Notes
              </div>
              <p class="notes-content">{{ shipment.notes }}</p>
            </div>
          </div>

          <!-- Right: Timeline -->
          <div class="detail-col timeline-col">
            <div class="info-section-title timeline-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#3b82f6" stroke-width="2"/>
                <path d="M12 6v6l4 2" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Timeline
            </div>
            <app-shipment-timeline [steps]="shipment.timeline" />
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .card {
      background: #fff;
      border: 1.5px solid #e5e7eb;
      border-radius: 12px;
      margin-bottom: 10px;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      cursor: pointer;
      overflow: hidden;

      &:hover {
        border-color: #93c5fd;
        box-shadow: 0 2px 12px rgba(59, 130, 246, 0.08);
      }

      &.expanded {
        border-color: #3b82f6;
        box-shadow: 0 4px 20px rgba(59, 130, 246, 0.12);
      }
    }

    .card-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 14px 16px;
    }

    .product-image {
      width: 88px;
      height: 76px;
      object-fit: cover;
      border-radius: 8px;
      flex-shrink: 0;
      background: #f3f4f6;
    }

    .card-info {
      flex: 1;
      min-width: 0;
    }

    .customer-name {
      font-size: 15px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 8px;
    }

    .meta-row {
      display: flex;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
    }

    .meta-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .meta-label {
      font-size: 10px;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      font-weight: 500;
    }

    .meta-value {
      font-size: 13px;
      color: #374151;
      font-weight: 600;
    }

    .notes-item { max-width: 200px; }

    .notes-text {
      font-size: 12px;
      font-weight: 400;
      color: #6b7280;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 200px;
      display: block;
    }

    .card-right {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }

    .expand-btn {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: 1.5px solid #e5e7eb;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #6b7280;
      transition: all 0.2s ease;
      padding: 0;

      &:hover {
        border-color: #3b82f6;
        color: #3b82f6;
        background: #eff6ff;
      }

      svg { transition: transform 0.25s ease; }

      &.rotated svg { transform: rotate(180deg); }
    }

    .divider {
      height: 1px;
      background: #f3f4f6;
      margin: 0 16px;
    }

    .expanded-section {
      cursor: default;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 220px 1fr 200px;
      gap: 24px;
      padding: 20px 20px 24px;
    }

    .detail-col { display: flex; flex-direction: column; gap: 16px; }

    // Product column
    .product-col { align-items: flex-start; }

    .detail-image {
      width: 100%;
      aspect-ratio: 4/3;
      object-fit: cover;
      border-radius: 10px;
      background: #f3f4f6;
    }

    .detail-product-info { width: 100%; }

    .detail-product-name {
      font-size: 14px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 8px;
    }

    .detail-badges {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-bottom: 10px;
    }

    .badge-category, .badge-order-id {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
    }

    .badge-category {
      background: #f0fdf4;
      color: #065f46;
    }

    .badge-order-id {
      background: #eff6ff;
      color: #1d4ed8;
    }

    .detail-dims {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #6b7280;
    }

    .dim-label {
      font-weight: 700;
      color: #374151;
      margin-right: 2px;
    }

    .dim-sep { color: #9ca3af; }

    // Info column
    .info-section { display: flex; flex-direction: column; gap: 8px; }

    .info-section-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 4px;
      padding-bottom: 8px;
      border-bottom: 1px solid #f3f4f6;
    }

    .info-row {
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }

    .info-key {
      font-size: 12px;
      color: #9ca3af;
      min-width: 90px;
      flex-shrink: 0;
    }

    .info-val {
      font-size: 12px;
      color: #374151;
      font-weight: 500;

      &.order-id-val { color: #1d4ed8; font-weight: 700; }
      &.phone { color: #374151; }
      &.tracking { color: #6b7280; font-family: monospace; font-size: 11px; }
    }

    .notes-content {
      font-size: 12px;
      color: #6b7280;
      line-height: 1.6;
      margin: 0;
      background: #fffbeb;
      padding: 10px 12px;
      border-radius: 8px;
      border-left: 3px solid #f59e0b;
    }

    // Timeline column
    .timeline-col { }

    .timeline-title {
      font-size: 13px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 4px;
      padding-bottom: 8px;
      border-bottom: 1px solid #f3f4f6;
    }

    // Responsive
    @media (max-width: 900px) {
      .detail-grid {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto;
      }
      .timeline-col {
        grid-column: 1 / -1;
        border-top: 1px solid #f3f4f6;
        padding-top: 16px;
      }
    }

    @media (max-width: 600px) {
      .card-row { flex-wrap: wrap; gap: 12px; }

      .product-image { width: 72px; height: 64px; }

      .meta-row { gap: 12px; }

      .card-right {
        width: 100%;
        justify-content: space-between;
        padding-top: 4px;
      }

      .notes-item { display: none; }

      .detail-grid {
        grid-template-columns: 1fr;
        gap: 16px;
        padding: 16px;
      }

      .detail-image { width: 100%; aspect-ratio: 16/9; }
    }
  `],
})
export class ShipmentCardComponent {
  @Input({ required: true }) shipment!: Shipment;
  @Input() expanded = false;
  @Output() toggle = new EventEmitter<string>();

  onCardClick(): void {
    this.toggle.emit(this.shipment.id);
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=200&fit=crop';
  }
}