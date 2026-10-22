import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip';

@Injectable({
  providedIn: 'root'
})
export class TripDataService {
  private apiBaseUrl = 'http://localhost:3000/api';

  private credentials = '';

  constructor(private http: HttpClient) {}

  private adminOptions() {
    if (!this.credentials) {
      const username = window.prompt('Administrator username');
      const password = window.prompt('Administrator password');
      if (username === null || password === null) throw new Error('Administrator credentials required');
      this.credentials = btoa(`${username}:${password}`);
    }
    return { headers: new HttpHeaders({ Authorization: `Basic ${this.credentials}` }) };
  }

  public signOut(): void { this.credentials = ''; }

  public getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(
      `${this.apiBaseUrl}/trips`
    );
  }

  public addTrip(formData: Trip): Observable<Trip> {
    return this.http.post<Trip>(
      `${this.apiBaseUrl}/trips`,
      this.payload(formData),
      this.adminOptions()
    );
  }

  public getTrip(tripCode: string): Observable<Trip[]> {
  return this.http.get<Trip[]>(
    `${this.apiBaseUrl}/trips/${tripCode}`
  );
}

public updateTrip(formData: Trip): Observable<Trip> {
  return this.http.put<Trip>(
    `${this.apiBaseUrl}/trips/${formData.code}`,
    this.payload(formData),
    this.adminOptions()
  );
}

public deleteTrip(tripCode: string): Observable<unknown> {
  return this.http.delete(
    `${this.apiBaseUrl}/trips/${tripCode}`,
    this.adminOptions()
  );
}

  private payload(trip: Trip) {
    const { _id, ...fields } = trip;
    return { ...fields, perPerson: String(fields.perPerson) };
  }
}