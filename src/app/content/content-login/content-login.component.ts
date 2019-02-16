/*Last Time edited 29.10.18 10:00 by Marvin */

/* component import classes */

import {UserService} from '../../services/user.service';
import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ConfirmValidParentMatcher, CustomValidators, errorMessages, regExps} from '../../CustomValidators/CustomValidators';

@Component({
  selector: 'app-content-login',
  templateUrl: './content-login.template.html',
  styleUrls: ['content-login.style.css'],

})

/**test if routed correctly*/
export class ContentLoginComponent implements OnInit, OnDestroy {
  @Input() linkParams: any;
  navigatedTo: any = null;
  userRegistrationForm: FormGroup;
  errors = errorMessages;
  authSubj: any;

  constructor(
    private formBuilder: FormBuilder,
    private DataSvc: DataService,
    private router: Router
  ) {
    this.createForm();
  }

  createForm() {
    this.userRegistrationForm = this.formBuilder.group({
      loginGroup: this.formBuilder.group({
        email: ['', [
          Validators.required,
          Validators.email
        ]],
        password: ['', [
          Validators.required,
          Validators.pattern(regExps.password)
        ]],
      }, ),
    });
  }

  login() {
    this.DataSvc.loginUser(this.userRegistrationForm.value.loginGroup.email, this.userRegistrationForm.value.loginGroup.password)
      .then(() => {
      });
  }

  ngOnInit() {
    this.authSubj = this.DataSvc.authSubject.subscribe((v) => {
      if (v === true) {
        this.router.navigateByUrl('\home');
      }
    });
    // if user is authenticated redirect user to home

  }
  ngOnDestroy() {
    this.authSubj.unsubscribe();
  }
}
