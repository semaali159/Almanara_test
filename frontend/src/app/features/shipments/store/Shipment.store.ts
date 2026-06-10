import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Shipment, ShipmentStatus, ShipmentTabFilter } from '../models/shipment.model';

@Injectable({ providedIn: 'root' })
export class ShipmentStore {
  // --- Signals ---
  readonly shipments = signal<Shipment[]>([]);
  readonly loading = signal<boolean>(false);
  readonly expandedId = signal<string | null>(null);

  // --- BehaviorSubjects for reactive search/filter ---
  readonly searchQuery$ = new BehaviorSubject<string>('');
  readonly activeTab$ = new BehaviorSubject<ShipmentTabFilter>('active');

  // --- Computed filtered list ---
  readonly filteredShipments$: Observable<Shipment[]> = combineLatest([
    this.searchQuery$.pipe(debounceTime(300), distinctUntilChanged()),
    this.activeTab$,
  ]).pipe(
    map(([query, tab]) => {
      const all = this.shipments();
      const tabFiltered = this.applyTabFilter(all, tab);
      return this.applySearch(tabFiltered, query);
    })
  );

  // --- Derived counts ---
  readonly activeCount = computed(() =>
    this.shipments().filter((s) =>
      [ShipmentStatus.PREPARATION, ShipmentStatus.TRANSIT, ShipmentStatus.ARRIVED].includes(s.status)
    ).length
  );

  readonly deliveredCount = computed(() =>
    this.shipments().filter((s) => s.status === ShipmentStatus.DELIVERED).length
  );

  // --- Mutations ---
  setShipments(shipments: Shipment[]): void {
    this.shipments.set(shipments);
  }

  setLoading(loading: boolean): void {
    this.loading.set(loading);
  }

  setSearch(query: string): void {
    this.searchQuery$.next(query);
  }

  setTab(tab: ShipmentTabFilter): void {
    this.activeTab$.next(tab);
    this.searchQuery$.next('');
  }

  toggleExpanded(id: string): void {
    this.expandedId.update((current) => (current === id ? null : id));
  }

  // --- Private helpers ---
  private applyTabFilter(shipments: Shipment[], tab: ShipmentTabFilter): Shipment[] {
    if (tab === 'active') {
      return shipments.filter((s) =>
        [ShipmentStatus.PREPARATION, ShipmentStatus.TRANSIT, ShipmentStatus.ARRIVED].includes(s.status)
      );
    }
    return shipments.filter((s) => s.status === ShipmentStatus.DELIVERED);
  }

  private applySearch(shipments: Shipment[], query: string): Shipment[] {
    if (!query.trim()) return shipments;
    const lower = query.toLowerCase().trim();
    return shipments.filter(
      (s) =>
        s.id.toLowerCase().includes(lower) ||
        s.customerName.toLowerCase().includes(lower) ||
        s.productName.toLowerCase().includes(lower)
    );
  }
}