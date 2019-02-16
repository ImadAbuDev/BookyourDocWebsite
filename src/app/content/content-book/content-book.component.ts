/* component import classes */

import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DataService} from '../../services/data.service';
import {Router} from '@angular/router';
import {Doctor} from '../../doctor';
import {Doctorslots} from '../../doctorslots';
import {MatStepper} from '@angular/material';
import {ReformatService} from '../../services/reformat.service';


/** @title Select with 2-way value binding */
@Component({
  selector: 'app-content-book',
  templateUrl: './content-book.template.html',
  styleUrls: ['content-book.style.css'],

})
export class ContentBookComponent implements OnInit {
  doctorControl = new FormControl('', [Validators.required]);
  doctorslotsControl = new FormControl('', [Validators.required]);

  doctors: Doctor[];
  doctorslots: Doctorslots;
  dis_name: string;
  dis_field: string;
  dis_start: string;
  dis_end: string;
  dis_id: string;
  error: string;

  constructor(private DataSvc: DataService, private router: Router,
              private _formBuilder: FormBuilder, private reformatter: ReformatService) {
  }

  ngOnInit() {
    if (this.DataSvc.authenticated !== true) {
      this.router.navigateByUrl('\login');
    }
    this.DataSvc.getDoctors().subscribe(erg => this.doctors = erg);

  }

  goForward(stepper: MatStepper) {
    if (this.doctorControl.valid) {
      console.log(this.doctorControl.value._id);
      this.DataSvc.getTimeSlots(this.doctorControl.value._id).subscribe(erg => this.doctorslots = erg);
      stepper.next();
    }
  }

  goForward2(stepper: MatStepper) {
    if (this.doctorslotsControl.valid) {
      if (this.doctorslotsControl.value.state === 'FREE') {
        this.DataSvc.bookSlot(this.doctorslotsControl.value._id);

        this.dis_name = this.doctorControl.value.name;
        this.dis_field = this.doctorControl.value.field;
        this.dis_start = this.reformatter.beautifulizedate(this.doctorslotsControl.value.start);
        this.dis_end = this.reformatter.beautifulizedate(this.doctorslotsControl.value.end);
        this.dis_id = this.doctorslotsControl.value._id;

        stepper.next();
      } else {
        this.error = 'Timeslot is not free';
      }
    }
  }

  goForward3() {
    this.router.navigateByUrl('/home');
  }

  goBack(stepper: MatStepper) {
    stepper.previous();
  }

  beginning(stepper: MatStepper) {
    stepper.reset();
  }


  convert(state: string) {
    if (state === 'BOOK_INT') {
      return 'Slot is booked by a user';
    }
    if (state === 'BOOK_EXT') {
      return 'Slot is booked by a user';
    }
    return state;
  }

  convertshort(state: string) {
    return this.reformatter.convertstate(state);
  }

  changedateformat(date: string) {
    return this.reformatter.beautifulizedate(date);
  }
}
