import { Component, OnInit } from '@angular/core';

import { SettingsService } from '@services/settings.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {
  public linkTheme: Element | null = document.querySelector('#theme');
  
  constructor(private settingsService: SettingsService) { }

  ngOnInit(): void {
    this.settingsService.checkCurrentTheme();
  }

  changeTheme(theme: string): void {
    this.settingsService.changeTheme(theme);
  }
}
