import { SharedObservable } from './../../sharedObservable/sharedObservable';
import { Component, Input, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GoogleMapsModule,
  MapInfoWindow,
  MapMarker,
} from '@angular/google-maps';
import { initFlowbite } from 'flowbite';
import { ParkingStationInfo, ParkingLot } from 'src/app/model/model';
import { Service } from 'src/app/service/service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
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

  // 標記位置設定
  selfMarkerPositions!: google.maps.LatLngLiteral;
  selfMarkerOptions: google.maps.MarkerOptions = {
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 20,
      fillColor: '#14ba54',
      fillOpacity: 1,
      strokeWeight: 0,
      rotation: 0,
    },
    label: {
      text: '目前位置',
      fontSize: '20px',
      fontWeight: '700',
    },
  };
  markerOptions: google.maps.MarkerOptions = {
    label: '1',
  };

  favoriteMarkerOption: google.maps.MarkerOptions = {
    icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
  };

  // cluster
  markerClustererImagePath =
    'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m';

  // 訊息視窗
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;
  currentInfoWindow: ParkingStationInfo = {
    id: '0',
    name: '',
    area: '',
    address: '',
    payex: '',
    serviceTime: '',
    totalcar: 0,
    totalmotor: 0,
    ChargingStation: '0',
    location: {
      lat: 0,
      lng: 0,
    },
    isFavorite: false,
  };

  allStation: ParkingStationInfo[] = [];
  favoriteStation: ParkingStationInfo[] = [];
  favoriteList: string[] = [];
  showAllStation = true;
  showFavoriteStation = false;
  service = inject(Service);
  SharedObservable = inject(SharedObservable);

  ngOnInit(): void {
    initFlowbite();
    this.setFavoriteStation();
    this.getUserPosition();
    this.getStation();
    this.SharedObservable.showAllStation$.subscribe((res) => {
      this.showAllStation = res;
    });

    this.SharedObservable.showFavoriteStation$.subscribe((res) => {
      this.showFavoriteStation = res;
    });
  }

  getUserPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.options = {
            ...this.options,
            center: pos,
          };
          this.selfMarkerPositions = pos;
        },
        (error) => {
          console.error(error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      );
    }
  }

  getStation(): void {
    this.service.getAllStation().subscribe((res) => {
      this.allStation = res.data.park
        .filter(
          (i: ParkingLot) => i.EntranceCoord.EntrancecoordInfo !== undefined,
        )
        .map((item: ParkingLot): ParkingStationInfo => {
          const isFavorite = this.favoriteList.includes(item.id.toString());
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
            isFavorite: isFavorite,
          };
        });
      this.setFavoriteStation();
    });
  }

  openInfoWindow(marker: MapMarker, item: ParkingStationInfo): void {
    this.currentInfoWindow = { ...item };
    this.infoWindow!.open(marker);
  }

  addToFavorite(id: string): void {
    const isFavorite = this.favoriteList.includes(id);
    if (isFavorite) {
      this.favoriteList = this.favoriteList.filter((favId) => favId !== id);
    } else {
      this.favoriteList.push(id);
    }
    localStorage.setItem('favorite', JSON.stringify(this.favoriteList));
    this.updateStationFavorites();
  }

  setFavoriteStation(): void {
    this.favoriteList = JSON.parse(localStorage.getItem('favorite') || '[]');
    this.favoriteStation = this.allStation.filter((station) =>
      this.favoriteList.includes(station.id),
    );
  }

  updateStationFavorites(): void {
    this.allStation = this.allStation.map((station) => ({
      ...station,
      isFavorite: this.favoriteList.includes(station.id),
    }));
    this.favoriteStation = this.allStation.filter(
      (station) => station.isFavorite,
    );
  }
}
