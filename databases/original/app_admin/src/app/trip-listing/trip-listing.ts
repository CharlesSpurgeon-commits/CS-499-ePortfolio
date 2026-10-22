import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Trip } from '../models/trip';
import { TripDataService } from '../services/trip-data';
import { TripCard } from '../trip-card/trip-card';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, TripCard, RouterLink],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css'
})
export class TripListing implements OnInit {
  trips: Trip[] = [];
  message = '';

  constructor(private tripDataService: TripDataService) {}

  private getTrips(): void {
    this.tripDataService.getTrips().subscribe({
      next: (value: Trip[]) => {
        this.trips = value;
        this.message = `There are ${value.length} trips available.`;
        console.log(this.message);
      },
      error: (error: unknown) => {
        console.error('Error retrieving trips:', error);
      }
    });
  }

  ngOnInit(): void {
    this.getTrips();
  }
}
