import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MAP_KEY } from 'src/env/env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Service {
  baseUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=`;
  http = inject(HttpClient);
  getChargeStation(address: string): Observable<any> {
    const url = `${this.baseUrl}${address}&key=${MAP_KEY}`;
    return this.http.get(url);
  }

  getAllStation(): Observable<any> {
    return this.http.get('../../assets/taipei-parking-info.json');
  }
}
