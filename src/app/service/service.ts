import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Service {
  baseUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=`;
  http = inject(HttpClient);
  getAllStation(): Observable<any> {
    return this.http.get('../../assets/taipei-parking-info.json');
  }
}
