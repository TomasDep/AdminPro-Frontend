import { Component } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private lang: string = localStorage.getItem('lang') || '';
  public title = 'adminpro';
  
  constructor(public translate: TranslateService) {
    translate.setDefaultLang(this.lang);
  }
}