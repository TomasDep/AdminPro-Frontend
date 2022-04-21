import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private linkTheme: Element | null = document.querySelector('#theme');
  private themeColor: string = 'default';

  constructor() { 
    const theme: string = localStorage.getItem('theme') || "./assets/css/colors/default-dark.css";
    this.linkTheme?.setAttribute('href', theme);
  }

  changeTheme(theme: string): void {
    const url: string = `./assets/css/colors/${ theme }.css`;
    this.linkTheme?.setAttribute('href', url);
    localStorage.setItem('theme', url);
    this.changeButtonTheme();
    this.checkCurrentTheme();
  }

  changeButtonTheme(): void {
    const theme: string = localStorage.getItem('theme') || '';
    this.themeColor = theme.replace('./assets/css/colors/', '').replace('.css', '');
    localStorage.setItem('themeButton', this.themeColor);
  } 

  checkCurrentTheme(): void {
    const links: NodeListOf<Element> = document.querySelectorAll('.selector');

    links.forEach(element => {
      element.classList.remove('working');
      const btnTheme = element.getAttribute('data-theme');
      const btnThemeUrl = `./assets/css/colors/${ btnTheme }.css`;
      const currentTheme = this.linkTheme?.getAttribute('href');

      if (btnThemeUrl === currentTheme) {
        element.classList.add('working');
      }
    });
  }
}
