/* component import classes */

import {Component, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-content-default',
  templateUrl: './content-default.template.html',
  styleUrls: ['content-default.style.css'],
  providers: []
})
export class ContentDefaultComponent implements OnInit {

  constructor(private DataSvc: DataService, private router: Router) {
  }

  /* initialsing on init function */
  ngOnInit() {
    if (this.DataSvc.authenticated === true) {
      this.router.navigateByUrl('\home');
    }

  }

}
