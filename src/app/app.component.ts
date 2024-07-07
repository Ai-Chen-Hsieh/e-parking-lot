import { SharedObservable } from './sharedObservable/sharedObservable';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  router = inject(Router);
  routerActive = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    initFlowbite();
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          let url = event.url;
          if (url.includes('home')) {
            this.currentItem = 0;
          } else if (url.includes('settings')) {
            this.currentItem = 2;
          } else if (url.includes('about-me')) {
            this.currentItem = 3;
          }
        }
      });
  }

  clickNav(id: number): void {
    this.currentItem = id;
    switch (id) {
      case 0:
        this.sharedObservable.setSharedShowAllStation(true);
        this.sharedObservable.setSharedFavoriteStation(false);
        this.router.navigateByUrl('home');
        break;
      case 1:
        this.sharedObservable.setSharedShowAllStation(false);
        this.sharedObservable.setSharedFavoriteStation(true);
        this.router.navigateByUrl('home');
        break;
      case 2:
        this.router.navigateByUrl('settings');
        break;

      case 3:
        this.router.navigateByUrl('about-me');
        break;
      default:
        break;
    }
  }
}
