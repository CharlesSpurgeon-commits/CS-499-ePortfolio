import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Trip } from '../models/trip';
import { TripDataService } from '../services/trip-data';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css'
})
export class TripCard {
  @Input() trip!: Trip;

  constructor(
    private router: Router,
    private tripDataService: TripDataService
  ) {}

  editTrip(): void {
    localStorage.setItem('tripCode', this.trip.code);
    this.router.navigate(['/edit-trip']);
  }

  deleteTrip(): void {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${this.trip.name}?`
    );

    if (!confirmed) {
      return;
    }

    this.tripDataService.deleteTrip(this.trip.code).subscribe({
      next: () => {
        window.location.reload();
      },
      error: (error: unknown) => {
        console.error('Error deleting trip:', error);
      }
    });
  }
}
