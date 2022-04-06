import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  public menu: any = [];

  constructor () {
    this.cargarMenu();
  }

  cargarMenu(): void {
    this.menu = JSON.parse(sessionStorage.getItem('menu') || '') || [];
  }
}
