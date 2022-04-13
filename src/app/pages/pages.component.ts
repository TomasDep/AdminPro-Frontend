import { Component, OnInit } from '@angular/core';

import { SidebarService } from '@services/index';
import { SettingsService } from '@services/settings.service';

declare function customInitfunction(): any;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {
  public currentDate: Date = new Date();

  constructor(
    private sidebarService: SidebarService,
    private settingsService: SettingsService
  ) { }

  ngOnInit(): void {
    customInitfunction();
    this.sidebarService.cargarMenu();
    this.settingsService.checkCurrentTheme();
  }

}
