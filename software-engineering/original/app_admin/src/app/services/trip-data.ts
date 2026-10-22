import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip';

@Injectable({
  providedIn: 'root'
})
export class TripDataService {
  private apiBaseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  public getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(
      `${this.apiBaseUrl}/trips`
    );
  }

  public addTrip(formData: Trip): Observable<Trip> {
    return this.http.post<Trip>(
      `${this.apiBaseUrl}/trips`,
      formData
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
    formData
  );
}

public deleteTrip(tripCode: string): Observable<unknown> {
  return this.http.delete(
    `${this.apiBaseUrl}/trips/${tripCode}`
  );
}

}