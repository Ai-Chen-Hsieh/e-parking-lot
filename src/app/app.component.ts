import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'e-parking';
  // 初始預設在台北車站
  initialCenter = { lat: 25.0474428, lng: 121.5170955 };
  options: google.maps.MapOptions = {
    center: { ...this.initialCenter },
    zoom: 14,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
  };
  infoWindow = new google.maps.InfoWindow();
  markerPositions!: google.maps.LatLngLiteral;
  @ViewChild('map') map: ElementRef | undefined;

  ngOnInit(): void {
    initFlowbite();
    this.getUserPosition();
  }

  getUserPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.options = {
          ...this.options,
          center: pos,
        };
        this.markerPositions = pos;
      });
    }
  }
}
