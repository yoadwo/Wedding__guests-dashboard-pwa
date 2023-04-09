import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Observable } from 'rxjs';
import { guestEM } from './models/guest';
import { GuestsService } from './services/guests/guests.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'guests-dashboard-pwa';
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport | undefined;
  guests: Observable<guestEM[]> | undefined;

  constructor(private guestsService: GuestsService) {
  }
  ngOnInit(): void {
    this.guests = this.guestsService.getGuestsInfo();
  }
  rsvpStatus(status?: number){
    switch (status) {
      case null:
        return 'לא ענה להזמנה'
      case -1:
        return 'לא מגיע';
      case 0:
        return 'אולי';
        case 1:
          return 'מגיע';
      default:
        return '??';
    }
  }

  sendTexts(guests: any){
    console.log("sending to ", guests);
    this.guestsService.sendGuestsText(guests).subscribe(resp => {
      console.log('is ok?', resp);
    })
  }
  
  sendTextsToAll(){
    this.guests?.subscribe(guestsRM => {
      this.sendTexts(guestsRM.filter(g => true).map(({lastName, status,...rest})=> rest));
    });
  }

  sendTextsToSelected(){
    this.guests?.subscribe(guestsRM => {
      this.sendTexts(guestsRM.filter(g => !g.status).map(({lastName, status,...rest})=> rest));
    });
    
  }
}
