import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map, Subscription, Observable } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnDestroy{

  public titulo: string = '';
  public tituloSub$: Subscription = new Subscription();

  constructor(
    private router: Router,
    public translate: TranslateService
  ) {
    this.tituloSub$ = this.getDataRutas()
                        .subscribe(({titulo}) => {
                          this.titulo = titulo;
                          document.title = `AdminPro - ${ this.titulo }`;
                        });
  }

  ngOnDestroy(): void {
    this.tituloSub$.unsubscribe();
  }

  getDataRutas(): Observable<any> {
    return this.router.events
      .pipe(
        filter((event): event is ActivationEnd => event instanceof ActivationEnd),
        filter((event: ActivationEnd) => event.snapshot.firstChild === null),
        map((event: ActivationEnd) => event.snapshot.data),
      )
  }
}
