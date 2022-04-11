import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRountingModule } from './app-rounting.module';
import { PagesModule } from '@pages/pages.module';
import { SharedModule } from '@shared/shared.module';
import { AuthModule } from '@auth/auth.module';

import { NopagefoundComponent } from '@noPageFound/nopagefound.component';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    NopagefoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRountingModule,
    PagesModule,
    SharedModule,
    AuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
