import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Observable } from 'rxjs';
import { guestEM } from './models/guest';
import { GuestsService } from './services/guests/guests.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'guests-dashboard-pwa';
  //guests: guestEM[] | null;
  rsvpLink: string;
  dataSource: MatTableDataSource<guestEM>;
  displayedColumns: string[] = ['recipient', 'phoneNumber', 'linkCreator', 'copyCreator', 'status', 'attendingCount', 'side', '_group'];
  eventDescription:string = `נשמח לראותכם בחתונה של שירלי צדוק ויועד וולפסטל, שתיערך ב"עדן גן האירועים" ב-29.6. אנא אשרו השתתפותכם בקישור הבא:`;
  shuttleDescription:string = `בנוסף, לחצו כאן כדי להירשם להסעה: https://forms.gle/XMMMfSxGyL65R6T36`;
  ifNoLinks:string = `טיפ: על מנת להפוך את הקישור ללחיץ, *שלחו הודעה חזרה* ונסו שוב בעוד דקה`;

  constructor(private guestsService: GuestsService) {
    //this.guests = null;
    this.dataSource = new MatTableDataSource();
    this.rsvpLink = "";
  }
  async ngOnInit(): Promise<void> {
    this.guestsService.getGuestsInfo().subscribe(resp => {
      //this.guests = resp.data.guests;
      this.dataSource = new MatTableDataSource(resp.data.guests);
      this.rsvpLink = resp.data.rsvpLink;
    })
  }

  rsvpStatus(status?: number) {
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

  filterValues(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSource) {
      this.dataSource.filter = filterValue.trim();
      console.log('data', this.dataSource.data);
      console.log('filtered', this.dataSource.filteredData);
    }
  }

  filterNotResponded(event: MatSlideToggleChange) {
    if (event.checked) {
      this.dataSource = new MatTableDataSource(this.dataSource.data.filter(g => g.status == null));
    } else {
      this.guestsService.getGuestsInfo().subscribe(resp => {
        //this.guests = resp.data.guests;
        this.dataSource = new MatTableDataSource(resp.data.guests);
        this.rsvpLink = resp.data.rsvpLink;
      })
    }
  }
  
  sendTextsToSelected(guest: guestEM) {
    let personalised = `הי ${guest.recipient}`
    let link = this.rsvpLink + guest.phoneNumberHash;
    let message = `${personalised}, ${this.eventDescription}\n${link}\n${this.shuttleDescription}\n\n${this.ifNoLinks}`;
    let number = guest.phoneNumber;
    window.open(`https://web.whatsapp.com/send?phone=+972${number}&text=${encodeURI(message)}`, "_blank");
  }

  copyToClipboard(guest: guestEM) {
    let personalised = `הי ${guest.recipient}`
    let link = this.rsvpLink + guest.phoneNumberHash;
    let message = `${personalised}, ${this.eventDescription} ${link}\n\n${this.shuttleDescription}`;
    navigator.clipboard.writeText(message)
    .then(() => {
      console.log('Text copied to clipboard');
    })
    .catch((error) => {
      console.error('Failed to copy text to clipboard:', error);
    });
  }
}
