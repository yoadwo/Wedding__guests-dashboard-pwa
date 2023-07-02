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
  displayedColumns: string[] = ['recipient', 'phoneNumber', 'linkCreator', 'weddingDayCreator', 'copyCreator', 'thanksCreator', 'status', 'attendingCount', 'side', '_group'];
  eventDescription: string = `נשמח לראותכם בחתונה של שירלי צדוק ויועד וולפסטל, שתיערך ב"עדן גן האירועים" ב-29.6. אנא אשרו השתתפותכם בקישור הבא:`;
  shuttleDescription: string = `בנוסף, לחצו כאן כדי להירשם להסעה: https://forms.gle/XMMMfSxGyL65R6T36`;
  ifNoLinks: string = `טיפ: על מנת להפוך את הקישור ללחיץ, *שלחו הודעה חזרה* ונסו שוב בעוד דקה. אם בכל זאת לא הצלחתם, שילחו את מספר המגיעים כאן ואנו נעדכן את התשובה עבורכם.`;
  weddingDayDescription: string = 'נרגשים ומצפים לראותכם היום ביום החתונה שלנו. ניפגש ב19:30 ב"עדן גן האירועים", מושב ניר אליהו. להוראות הגעה:';
  navigationLink: string = 'https://goo.gl/maps/B54sVP7AmmwxFmjr7';
  greeting: string = 'מתרגשים, שירלי צדוק ויועד וולפסטל';
  payboxDescription: string = 'לנוחיותכם, ניתן להעניק מתנות דרך קבוצת ה-PayBox שנפתחה עבורכם בלינק הבא:';
  payboxLinks: string[] = [
    "https://payboxapp.page.link/snan5v3sJWy2WEG97",
    "https://payboxapp.page.link/2DxG279uGV1ug7Jj7"
  ]
  thanksDescription: string = 'משפחה וחברים יקרים! 😍\nהיה לנו כל כך כיף שבאתם, ורצינו להודות לכל אחת ואחד מכם! 👔👗\nתודה על שהייתם חלק מהערב המרגש בחיינו - שהרמתם, ריגשתם ושימחתם! 🎉\nאוהבים מאוד מאוד, שירלי צדוק ויועד וולפסטל 💖';
  attendingGuestsCount: number;

  constructor(private guestsService: GuestsService) {
    //this.guests = null;
    this.dataSource = new MatTableDataSource();
    this.rsvpLink = "";
    this.attendingGuestsCount = 0;
  }
  async ngOnInit(): Promise<void> {
    this.guestsService.getGuestsInfo().subscribe(resp => {
      //this.guests = resp.data.guests;
      this.dataSource = new MatTableDataSource(resp.data.guests);
      this.rsvpLink = resp.data.rsvpLink;
      this.attendingGuestsCount = resp.data.guests.reduce((sum, guest) => guest.status === 1 ? sum + guest.attendingCount : sum, 0);

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
        this.attendingGuestsCount = resp.data.guests.reduce((sum, guest) => guest.status === 1 ? sum + guest.attendingCount : sum, 0);
      })
    }
  }

  filterNotReceived(event: MatSlideToggleChange) {
    if (event.checked) {
      this.dataSource = new MatTableDataSource(this.dataSource.data.filter(g => g.messagesReceived == 0));
    } else {
      this.guestsService.getGuestsInfo().subscribe(resp => {
        //this.guests = resp.data.guests;
        this.dataSource = new MatTableDataSource(resp.data.guests);
        this.rsvpLink = resp.data.rsvpLink;
        this.attendingGuestsCount = resp.data.guests.reduce((sum, guest) => guest.status === 1 ? sum + guest.attendingCount : sum, 0);
      })
    }
  }

  filterAccepted(event: MatSlideToggleChange) {
    if (event.checked) {
      this.dataSource = new MatTableDataSource(this.dataSource.data.filter(g => g.status == 1));
    } else {
      this.guestsService.getGuestsInfo().subscribe(resp => {
        //this.guests = resp.data.guests;
        this.dataSource = new MatTableDataSource(resp.data.guests);
        this.rsvpLink = resp.data.rsvpLink;
        this.attendingGuestsCount = resp.data.guests.reduce((sum, guest) => guest.status === 1 ? sum + guest.attendingCount : sum, 0);
      })
    }
  }

  sendTextsToSelected(guest: guestEM) {
    let personalised = `הי ${guest.recipient}`
    let link = this.rsvpLink + guest.phoneNumberHash;
    let message = `${personalised}, ${this.eventDescription}\n${link}\n${this.shuttleDescription}\n\n${this.ifNoLinks}`;
    let number = this.normalizedPhoneNumber(guest.phoneNumber);
    window.open(`https://web.whatsapp.com/send?phone=${number}&text=${encodeURI(message)}`, "_blank");
  }

  sendWeddingDayTexts(guest: guestEM, index: number) {
    let personalised = `${guest.recipient} היקרים,`
    let payboxLink = this.payboxLinks[index % this.payboxLinks.length];

    let message = `${personalised}\n${this.weddingDayDescription}\n${this.navigationLink}\n${this.payboxDescription}\n${payboxLink}\n\n${this.greeting}`;
    let number = this.normalizedPhoneNumber(guest.phoneNumber);
    window.open(`https://web.whatsapp.com/send?phone=${number}&text=${encodeURI(message)}`, "_blank");
  }

  sendThankyouTexts(guest: guestEM) {    
    let message = this.thanksDescription;
    let number = this.normalizedPhoneNumber(guest.phoneNumber);
    window.open(`https://web.whatsapp.com/send?phone=${number}&text=${encodeURI(message)}`, "_blank");
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

  normalizedPhoneNumber(number: string) {
    // currently most numbers are saved without the internation prefix, so add it if needed
    if (!number.startsWith("+972")) {
      number = "+972" + number;
    }
    // also, alot of numbers contain dashes, remove them
    number = number.replace(/-/g, '');

    return number;
  }
}
