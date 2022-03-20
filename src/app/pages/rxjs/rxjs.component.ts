import { Component, OnDestroy } from '@angular/core';
import { Observable, interval, retry, take, map, filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styleUrls: ['./rxjs.component.css']
})
export class RxjsComponent implements OnDestroy{
  
  public intervalSubs: Subscription = new Subscription();

  constructor() {
    // this.retornaObservable().pipe(
    //   retry(2)
    // ).subscribe(
    //     valor => console.log(valor), 
    //     error => console.warn('Error', error), 
    //     () => console.info('Observer terminado')
    //   );

    this.retornaIntervalo()
      .subscribe(console.log);
  }

  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  retornaIntervalo(): Observable<number> {
    return interval(500)
            .pipe(
              map(valor => valor + 1),
              filter(valor => valor % 2 == 0),
              take(10),
            );
  }

  retornaObservable(): Observable<number> {
    let i = -1;
    return new Observable<number>(observer => {
      const interval = setInterval(() => {
        i++;
        observer.next(i);

        if (i === 6) {
          clearInterval(interval);
          observer.complete();
        }

        if (i === 2) {
          i = 0;
          observer.error('i llevo al valor de 2');
        }
      }, 1000)
    });
  }
}
