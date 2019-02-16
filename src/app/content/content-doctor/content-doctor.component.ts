/* component import classes */


import {Component, Input, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {Router} from '@angular/router';
import {Slots} from '../../slots';
import {Doctor} from '../../doctor';
import {FormControl, Validators} from '@angular/forms';
import {ReformatService} from '../../services/reformat.service';

/**test if routed correctly*/
@Component({
  selector: 'app-content-doctor',
  templateUrl: './content-doctor.template.html',
  styleUrls: ['content-doctor.style.css'],
})
export class ContentDoctorComponent implements OnInit {
  constructor(private DataSvc: DataService, private router: Router, private reformatter: ReformatService) {
  }

  counter = 0;
  slots: Slots[];
  doctors: Doctor[];

  doctorControl = new FormControl('', [Validators.required]);

  ngOnInit() {
    if (this.DataSvc.authenticated === false) {
      console.log(this.DataSvc.authenticated);
      this.router.navigateByUrl('\login');
    }
    this.slots = [];
    this.DataSvc.getDoctors2().subscribe(erg => this.doctors = erg);
    // this.DataSvc.getDoctors2().subscribe(erg => {
    // for (this.counter = 0; this.counter < this.doctors.length; this.counter++) {
    // this.DataSvc.getSlotsDoctor(this.doctors[this.counter]._id).subscribe(result => this.slots = this.slots.concat(result));
    // }}
    // );
  }

  select(): void {
    if (this.doctorControl.valid) {
      this.DataSvc.getSlotsDoctor(this.doctorControl.value._id).subscribe(result => this.slots = result);
    }
  }

  selectall(): void {
    this.DataSvc.getDoctors2().subscribe(erg => {
        for (this.counter = 0; this.counter < this.doctors.length; this.counter++) {
          this.DataSvc.getSlotsDoctor(this.doctors[this.counter]._id).subscribe(result => this.slots = this.slots.concat(result));
        }
      }
    );
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

  checkstatus(string: string): any {
    return this.reformatter.convertstate(string);
  }

  showstate(string: string): any {
    return this.reformatter.showstate(string);
  }
}
