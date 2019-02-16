/* component import classes */


import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {Doctor} from '../../doctor';
import {Doctorslots} from '../../doctorslots';
import {DataService} from '../../services/data.service';
import {Router} from '@angular/router';
import {DateAdapter, MatStepper} from '@angular/material';
import {DatePipe} from '@angular/common';
import {ReformatService} from '../../services/reformat.service';

export interface Timehour {
  hour: string;
}

export interface Timeminute {
  minute: string;
}

@Component({
  selector: 'app-content-doctorbookslots',
  templateUrl: './content-doctorbookslots.template.html',
  styleUrls: ['content-doctorbookslots.style.css'],
})

export class ContentDoctorbookslotsComponent implements OnInit {
  doctorControl = new FormControl('', [Validators.required]);
  dateslotControl = new FormControl('', [Validators.required]);

  doctors: Doctor[];
  dis_name: string;
  dis_field: string;
  dis_start: string;
  dis_end: string;
  error: string;
  pipe = new DatePipe('en-US');

  startControlhour = new FormControl('', [Validators.required]);
  startControlminute = new FormControl('', [Validators.required]);
  endControlhour = new FormControl('', [Validators.required]);
  endControlminute = new FormControl('', [Validators.required]);
  hours: Timehour[] = [
    {hour: '00'},
    {hour: '01'},
    {hour: '02'},
    {hour: '03'},
    {hour: '04'},
    {hour: '05'},
    {hour: '06'},
    {hour: '07'},
    {hour: '08'},
    {hour: '09'},
    {hour: '10'},
    {hour: '11'},
    {hour: '12'},
    {hour: '13'},
    {hour: '14'},
    {hour: '15'},
    {hour: '16'},
    {hour: '17'},
    {hour: '18'},
    {hour: '19'},
    {hour: '20'},
    {hour: '21'},
    {hour: '22'},
    {hour: '23'},
  ];

  minutes: Timeminute[] = [
    {minute: '00'},
    {minute: '05'},
    {minute: '10'},
    {minute: '15'},
    {minute: '20'},
    {minute: '25'},
    {minute: '30'},
    {minute: '35'},
    {minute: '40'},
    {minute: '45'},
    {minute: '50'},
    {minute: '55'},
  ];

  constructor(private DataSvc: DataService, private router: Router, private _formBuilder: FormBuilder,
              private adapter: DateAdapter<any>, private reformatter: ReformatService) {
  }

  ngOnInit() {
    if (this.DataSvc.authenticated !== true) {
      this.router.navigateByUrl('\login');
    }
    this.adapter.setLocale('de');
    this.DataSvc.getDoctors2().subscribe(erg => this.doctors = erg);


  }

  goForward(stepper: MatStepper) {
    if (this.doctorControl.valid) {
      console.log(this.doctorControl.value._id);
      stepper.next();
    }
  }

  goForward2(stepper: MatStepper) {
    if (this.dateslotControl.valid && this.startControlhour.valid &&
      this.startControlminute.valid && this.endControlhour.valid && this.endControlhour.valid) {
      this.DataSvc.registerSlot(this.doctorControl.value._id,
        this.pipe.transform(this.dateslotControl.value, 'yyyy-LL-ddT') +
        this.startControlhour.value.hour + ':' + this.startControlminute.value.minute + ':00.001Z',
        this.pipe.transform(this.dateslotControl.value, 'yyyy-LL-ddT') +
        this.endControlhour.value.hour + ':' + this.endControlminute.value.minute + ':00.001Z');
      this.dis_name = this.doctorControl.value.name;
      this.dis_field = this.doctorControl.value.field;
      this.dis_start = this.changedateformat(this.pipe.transform(this.dateslotControl.value, 'yyyy-LL-ddT') +
        this.startControlhour.value.hour + ':' + this.startControlminute.value.minute + ':00.001Z');
      this.dis_end = this.changedateformat(this.pipe.transform(this.dateslotControl.value, 'yyyy-LL-ddT') +
        this.endControlhour.value.hour + ':' + this.endControlminute.value.minute + ':00.001Z');
      stepper.next();
    }
  }

  goForward3(stepper: MatStepper) {
    this.router.navigateByUrl('/home');
  }

  goBack(stepper: MatStepper) {
    stepper.previous();
  }

  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }

  changedateformat(date: string) {
    return this.reformatter.beautifulizedate(date);
  }

  beginning(stepper: MatStepper) {
    stepper.reset();
  }

}
