import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedObservable {
  showAllStation$ = new BehaviorSubject(true);
  showFavoriteStation$ = new BehaviorSubject(false);

  public shareShowAllStation = this.showAllStation$.asObservable();
  public shareFavoriteStation = this.showFavoriteStation$.asObservable();

  setSharedShowAllStation(value: boolean) {
    this.showAllStation$.next(value);
  }

  setSharedFavoriteStation(value: boolean) {
    this.showFavoriteStation$.next(value);
  }
}
