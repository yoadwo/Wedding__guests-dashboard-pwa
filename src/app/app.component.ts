import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Observable } from 'rxjs';
import { guestEM } from './models/guest';
import { GuestsService } from './services/guests/guests.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'guests-dashboard-pwa';
  // @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport | undefined;
  // guests: Observable<guestEM[]> | undefined;
  guests: guestEM[] | null;
  dataSource: MatTableDataSource<guestEM>;
  displayedColumns: string[] = ['firstName', 'lastName', 'phoneNumber', 'status'];

  constructor(private guestsService: GuestsService) {
    this.guests = null;
    this.dataSource = new MatTableDataSource();
  }
  async ngOnInit(): Promise<void> {
    this.guestsService.getGuestsInfo().subscribe(resp => {
      this.guests = resp.data;  
      this.dataSource = new MatTableDataSource(resp.data);
    })
  }
  
  rsvpStatus(status?: number){
    switch (status) {
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSource){
      this.dataSource.filter = filterValue.trim();
      console.log('data', this.dataSource.data);
      console.log('filtered', this.dataSource.filteredData);
    }    
  }

  sendTexts(guests: any){
    console.log("sending to ", guests);
    // this.guestsService.sendGuestsText(guests).subscribe(resp => {
    //   console.log('is ok?', resp);
    // })
  }
  
  sendTextsToAll(){
    this.sendTexts(this.dataSource.data.map(({lastName, status,...rest})=> rest));
  }

  sendTextsToSelected(){
    this.sendTexts(this.dataSource.filteredData.map(({lastName, status,...rest})=> rest));
    
  }
}
