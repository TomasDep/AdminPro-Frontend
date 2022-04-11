import { Component, OnInit } from '@angular/core';

import { SidebarService } from '@services/index';

declare function customInitfunction(): any;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  constructor(
    private sidebarService: SidebarService
  ) { }

  ngOnInit(): void {
    customInitfunction();
    this.sidebarService.cargarMenu();
  }

}
