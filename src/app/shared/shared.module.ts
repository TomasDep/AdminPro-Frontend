import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';



@NgModule({
  declarations: [
    BreadcrumbsComponent,
    SidebarComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ], 
  exports: [
    BreadcrumbsComponent,
    SidebarComponent,
    HeaderComponent,
  ]
})
export class SharedModule { }
