import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { Service } from './service/service';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'e-parking';
  // 初始預設在台北車站
  initialCenter = { lat: 25.0474428, lng: 121.5170955 };
  // map設定
  options: google.maps.MapOptions = {
    center: { ...this.initialCenter },
    zoom: 14,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    zoomControl: false,
  };
  // 標記設定
  selfMarkerPositions!: google.maps.LatLngLiteral;
  // 訊息視窗
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;
  currentInfoWindow = {
    id: 0,
    name: '',
    area: '',
    address: '',
    payex: '',
    serviceTime: '',
    totalcar: 0,
    totalmotor: 0,
    ChargingStation: 0,
    location: {
      lat: 0,
      lng: 0,
    },
  };

  allStation: any[] = [];
  service = inject(Service);

  ngOnInit(): void {
    initFlowbite();
    this.getUserPosition();
    this.getStation();
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
        this.selfMarkerPositions = pos;
      });
    }
  }

  getStation() {
    this.service.getAllStation().subscribe((res) => {
      let allStationPosition = res.data.park
        .filter(
          (i: {
            EntranceCoord: { EntrancecoordInfo: { Xcod: any; Ycod: any }[] };
          }) => i.EntranceCoord.EntrancecoordInfo !== undefined,
        )
        .map((item: any) => {
          return {
            id: item.id,
            name: item.name,
            area: item.area,
            address: item.address,
            payex: item.payex,
            serviceTime: item.serviceTime,
            totalcar: item.totalcar,
            totalmotor: item.totalmotor,
            ChargingStation: item.ChargingStation,
            location: {
              lat: Number(item.EntranceCoord.EntrancecoordInfo[0]?.Xcod),
              lng: Number(item.EntranceCoord.EntrancecoordInfo[0]?.Ycod),
            },
          };
        });
      this.allStation = [...allStationPosition];
    });
  }

  openInfoWindow(marker: MapMarker, item: any) {
    this.currentInfoWindow = {
      ...item,
    };
    console.log('current', this.currentInfoWindow);
    this.infoWindow!.open(marker);
  }
}
