/* component import classes */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {Router} from '@angular/router';
import {Slots} from '../../slots';
import {Doctor} from '../../doctor';
import {ReformatService} from '../../services/reformat.service';

/** @title Select with 2-way value binding */
@Component({
  selector: 'app-content-home',
  templateUrl: './content-home.template.html',
  styleUrls: ['content-home.style.css'],
})
export class ContentHomeComponent implements OnInit, OnDestroy {
  constructor(private DataSvc: DataService, private router: Router, private reformatter: ReformatService) {
  }
  displayDocLink = false;
  counter = 0;
  slots: Slots[];
  doctors: Doctor[];
  userSubj: any;

  ngOnInit() {
    if (this.DataSvc.authenticated === false) {
      console.log(this.DataSvc.authenticated);
      this.router.navigateByUrl('\login');
    }
    this.DataSvc.getDoctors().subscribe(erg => this.doctors = erg);
    this.DataSvc.getSlots().subscribe(erg => this.slots = erg);
    this.userSubj = this.DataSvc.userSubject.subscribe({
      next: (v) => {
        if (v === true) {
          console.log(this.DataSvc.user);
          if (this.DataSvc.user.type === 'DOCTOR') {
            console.log(this.DataSvc.user.type);
            this.displayDocLink = true;
          }
        }
      }
    });
    if (this.DataSvc.user && this.DataSvc.user.type) {
      if (this.DataSvc.user.type === 'DOCTOR') {
        console.log( this.DataSvc.user.type );
        this.displayDocLink = true;
      }
    }
  }

  getdocname(id: string) {
    console.log('i get this id ' + id);
    for (this.counter = 0; this.counter < this.doctors.length; this.counter++) {
      console.log(this.doctors[this.counter]._id);
      if (this.doctors[this.counter]._id === id) {
        return this.doctors[this.counter].name + ', ' + this.doctors[this.counter].field;
      }
    }
    return 'Doctor not found';
  }

  changedateformat(date: string) {
    return this.reformatter.beautifulizedate(date);
  }
  ngOnDestroy() {
    this.userSubj.unsubscribe();
  }
}
