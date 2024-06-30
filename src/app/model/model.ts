export interface FarePeriod {
  Period: string;
  Fare: string;
}

export interface FareInfo {
  Holiday: FarePeriod[];
  WorkingDay: FarePeriod[];
}

export interface EntranceCoordInfo {
  Xcod: string;
  Ycod: string;
}

export interface EntranceCoord {
  EntrancecoordInfo: EntranceCoordInfo[];
}

export interface Location {
  lat: number;
  lng: number;
}

export interface ParkingLot {
  id: string;
  area: string;
  name: string;
  type: string;
  type2: string;
  summary: string;
  address: string;
  tel: string;
  payex: string;
  serviceTime: string;
  tw97x: string;
  tw97y: string;
  totalcar: number;
  totalmotor: number;
  totalbike: number;
  totalbus: number;
  Pregnancy_First: string;
  Handicap_First: string;
  totallargemotor: string;
  ChargingStation: string;
  Taxi_OneHR_Free: string;
  AED_Equipment: string;
  CellSignal_Enhancement: string;
  Accessibility_Elevator: string;
  Phone_Charge: string;
  Child_Pickup_Area: string;
  FareInfo: FareInfo;
  EntranceCoord: EntranceCoord;
}

export interface ParkingStationInfo {
  id: string;
  name: string;
  area: string;
  address: string;
  payex: string;
  serviceTime: string;
  totalcar: number;
  totalmotor: number;
  ChargingStation: string;
  location: Location;
  isFavorite: boolean;
}
