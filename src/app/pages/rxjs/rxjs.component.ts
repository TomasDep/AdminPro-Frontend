import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styleUrls: ['./rxjs.component.css']
})
export class RxjsComponent implements OnInit {

  constructor() { 
    const obs$ = new Observable(observer => {
      let i = -1;
      const interval = setInterval(() => {
        i++;
        observer.next(i);

        if (i === 5) {
          clearInterval(interval);
          observer.complete();
        }

        if (i === 2) {
          observer.error('i llevo al valor de 2');
        }
      }, 1000)
    });

    obs$.subscribe(
      valor => console.log(valor), 
      error => console.warn('Error', error), 
      () => console.info('Observer terminado')
    );
  }

  ngOnInit(): void {
  }
}
