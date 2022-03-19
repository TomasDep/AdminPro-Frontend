import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public menu: any[] = [
    {
      titulo: 'Dashboard',
      icono: 'mdi mdi-gauge',
      submenu: [
        { titulo: 'Main', url: '/' },
        { titulo: 'progressBar', url: 'progress' },
        { titulo: 'Graficas', url: 'grafica1' },
      ]
    }
  ];

  constructor() { }
}
