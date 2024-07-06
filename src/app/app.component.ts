import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { Service } from './service/service';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { ParkingLot, ParkingStationInfo } from './model/model';

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
  service = inject(Service);
  showAllStation = true;
  showFavorite = false;
  currentItem = 0;

  navItemList = [
    {
      id: 0,
      name: '地圖',
      icon: 'fa-solid fa-lg fa-user fa-location-dot',
    },
    {
      id: 1,
      name: '收藏',
      icon: 'fa-regular fa-lg fa-bookmark',
    },
    {
      id: 2,
      name: '設定',
      icon: 'fa-solid fa-lg fa-user fa-gear',
    },
    {
      id: 3,
      name: '關於我',
      icon: 'fa-regular fa-lg fa-user fa-user',
    },
  ];

  ngOnInit(): void {
    initFlowbite();
    this.setFavoriteStation();
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

  clickNav(id: number): void {
    this.currentItem = id;
    switch (id) {
      case 0:
        this.showAllStation = true;
        this.showFavorite = false;
        break;
      case 1:
        this.showFavorite = true;
        this.showAllStation = false;
        break;
      default:
        this.showAllStation = true;
        this.showFavorite = false;
        break;
    }
  }
}
