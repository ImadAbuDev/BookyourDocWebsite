import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {NotificationService} from './notification.service';
import {MessageService} from '../message.service';

export class ReformatService {

  constructor() {
  }

  parts: string[];
  parts2: string[];
  parts3: string[];

  beautifulizedate(date: string): any {
    // 1970-01-01T00:30:00.001Z
    this.parts = date.split('-');
    this.parts2 = this.parts[2].split('T');
    this.parts3 = this.parts2[1].split(':');
    return this.parts2[0] + '. ' + this.month(this.parts[1]) + ' ' + this.parts[0]
      + ' - ' + this.parts3[0] + ':' + this.parts3[1];
  }

  month(number: string): any {
    if (number === '01') {
      return 'January';
    } else if (number === '02') {
      return 'February';
    } else if (number === '03') {
      return 'March';
    } else if (number === '04') {
      return 'April';
    } else if (number === '05') {
      return 'May';
    } else if (number === '06') {
      return 'June';
    } else if (number === '07') {
      return 'July';
    } else if (number === '08') {
      return 'August';
    } else if (number === '09') {
      return 'September';
    } else if (number === '10') {
      return 'October';
    } else if (number === '11') {
      return 'November';
    } else if (number === '12') {
      return 'December';
    }
  }

  convertstate(state: string): any {
    if (state === 'BOOK_INT') {
      return 'Booked: ';
    }
    if (state === 'BOOK_EXT') {
      return 'Booked: ';
    }
    return '';
  }
  showstate(state: string): any {
    if (state != null && state.length > 0) {
      return state;
    } else {
      return '--FREE--';
    }
  }
}
