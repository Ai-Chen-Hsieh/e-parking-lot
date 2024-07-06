import { SharedObservable } from './sharedObservable/sharedObservable';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'e-parking';

  currentItem = 0;
  showAllStation = true;
  showFavorite = false;

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

  sharedObservable = inject(SharedObservable);

  ngOnInit(): void {
    initFlowbite();
  }

  clickNav(id: number): void {
    this.currentItem = id;
    switch (id) {
      case 0:
        this.sharedObservable.setSharedShowAllStation(true);
        this.sharedObservable.setSharedFavoriteStation(false);
        break;
      case 1:
        this.sharedObservable.setSharedShowAllStation(false);
        this.sharedObservable.setSharedFavoriteStation(true);
        break;
      default:
        this.sharedObservable.setSharedShowAllStation(true);
        this.sharedObservable.setSharedFavoriteStation(false);
        break;
    }
  }
}
