/* component import classes */


import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataService} from '../../services/data.service';
import {Router} from '@angular/router';
import {ConfirmValidParentMatcher, CustomValidators, errorMessages, regExps} from '../../CustomValidators/CustomValidators';


@Component({
  selector: 'app-content-register',
  templateUrl: './content-register.template.html',
  styleUrls: ['content-register.style.css']
})
export class ContentRegisterComponent implements OnInit {
  userRegistrationForm: FormGroup;

  confirmValidParentMatcher = new ConfirmValidParentMatcher();

  errors = errorMessages;

  constructor(
    private formBuilder: FormBuilder,
    private DataSvc: DataService,
    private router: Router
  ) {
    this.createForm();
  }

  createForm() {
    this.userRegistrationForm = this.formBuilder.group({
      type: ['', [
        Validators.required
      ]],
      gender: ['', [
        Validators.required
      ]],
      nameGroup: this.formBuilder.group({
        firstName: ['', [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(64)
        ]],
        lastName: ['', [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(64)
        ]],
      }, ),
      emailGroup: this.formBuilder.group({
        email: ['', [
          Validators.required,
          Validators.email
        ]],
        confirmEmail: ['', Validators.required]
      }, {validator: CustomValidators.childrenEqual}),
      passwordGroup: this.formBuilder.group({
        password: ['', [
          Validators.required,
          Validators.pattern(regExps.password)
        ]],
        confirmPassword: ['', Validators.required]
      }, {validator: CustomValidators.childrenEqual}),
      agreement: ['', [
        Validators.required,
        Validators.requiredTrue
      ]],
    });
  }

  register(): void {
    this.DataSvc.registerUser(this.userRegistrationForm.value.type, this.userRegistrationForm.value.gender,
      this.userRegistrationForm.value.nameGroup.firstName, this.userRegistrationForm.value.nameGroup.lastName,
      this.userRegistrationForm.value.emailGroup.email, this.userRegistrationForm.value.passwordGroup.password);

    console.log(this.userRegistrationForm.value.type);
    console.log(this.userRegistrationForm.value.gender);
    console.log(this.userRegistrationForm.value.nameGroup.firstName);
    console.log(this.userRegistrationForm.value.nameGroup.lastName);
    console.log(this.userRegistrationForm.value.emailGroup.email);
    console.log(this.userRegistrationForm.value.passwordGroup.password);
  }

  ngOnInit() {
    this.DataSvc.authSubject.subscribe((v) => {
      if (v === true) {
        this.DataSvc.authSubject.unsubscribe();
        this.router.navigateByUrl('/home');
      }
    });
  }
}
