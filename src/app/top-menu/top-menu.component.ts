/*Last Time edited 29.10.18 10:00 by Marvin */

/* component import classes */


import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from '../services/data.service';
import {Router} from '@angular/router';
import {AutoUnsubscribe} from '../AutoUnsubscribe';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.template.html',
  styleUrls: ['./top-menu.style.css']
})
@AutoUnsubscribe
export class TopMenuComponent implements OnInit, OnDestroy {
  greetings = 'Book Doctor Appointments easy and fast!';
  userSub: any; authSub: any;

  constructor(public DataSvc: DataService, private router: Router) {
  }

  ngOnInit() {
    this.userSub = this.DataSvc.userSubject.subscribe({
      next: (v) => {
        if (v === true && this.DataSvc.user.first_name && this.DataSvc.user.last_name) {
          this.greetings = 'Hello, ' + this.DataSvc.user.first_name + ' ' + this.DataSvc.user.last_name;
        } else {
          this.greetings = 'Book Doctor Appointments easy and fast!';
        }
      }
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  loginlogout() {
    console.log('klicked');
    this.DataSvc.logoutUser();
   /* this.authSub = this.DataSvc.authSubject.subscribe((v) => {
      if (v === false) {
        console.log("Logged out");
        this.userSub.unsubscribe();
        this.authSub.unsubscribe();
        this.router.navigateByUrl('/login');
      }
    });*/
  }

  calendaroverview() {
    console.log('calendar nicht vorhanden');
    this.router.navigateByUrl('/home');
  }

  support() {
    console.log('support nicht vorhanden');
    this.router.navigateByUrl('/support');
  }
}
