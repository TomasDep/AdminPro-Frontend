import { AfterViewInit, Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { SettingsService } from '@services/settings.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit, AfterViewInit {
  public linkTheme: Element | null = document.querySelector('#theme');
  public lang: string = 'flag-icon flag-icon-us';

  constructor(
    private settingsService: SettingsService,
    public translate: TranslateService
  ) { }

  ngAfterViewInit(): void {
    if (localStorage.getItem('en')) {
      this.lang = 'flag-icon flag-icon-us';
    } else {
      this.lang = 'flag-icon flag-icon-es';
    }
  }

  ngOnInit(): void {
    this.settingsService.checkCurrentTheme();
    this.translate.use(localStorage.getItem('lang') || 'en');
  }

  changeTheme(theme: string): void {
    this.settingsService.changeTheme(theme);
  }

  changeLang(lang: string): void {
    if (lang === 'en') {
      localStorage.setItem('lang', lang);
      window.location.reload();
    } else {
      localStorage.setItem('lang', lang);
      window.location.reload();
    }
  }
}
