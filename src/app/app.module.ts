import {ContentDoctorComponent} from './content/content-doctor/content-doctor.component';

﻿import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from './services/auth.interceptor';

import {AppComponent} from './app.component';
import {routing} from './app.routing';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material.module';
import {FormsModule} from '@angular/forms';

import {UserService} from './services/user.service';
import {DataService} from './services/data.service';
import {TopMenuComponent} from './top-menu/top-menu.component';
import {ContentComponent} from './content/content.component';
import {ContentLoginComponent} from './content/content-login/content-login.component';
import {ContentRegisterComponent} from './content/content-register/content-register.component';
import {ContentDefaultComponent} from './content/content-default/content-default.component';
import {ContentBookComponent} from './content/content-book/content-book.component';
import {FooterComponent} from './footer/footer.component';


import {
  MatCheckboxModule, MatListModule,
  MatNativeDateModule,
  MatRadioModule,
  MatInputModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatProgressSpinnerModule,
  MatSnackBarModule, MatStepperModule,
  MatSelectModule
} from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {ContentHomeComponent} from './content/content-home/content-home.component';
import {ContentAgbComponent} from './content/content-agb/content-agb.component';
import {NotificationService} from './services/notification.service';
import {ContentSupportComponent} from './content/content-support/content-support.component';
import {ContentDoctorbookslotsComponent} from './content/content-doctorbookslots/content-doctorbookslots.component';
import {ReformatService} from './services/reformat.service';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    routing,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    MatSelectModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatStepperModule,
    MatListModule,
    MatTableModule,
  ],
  declarations: [
    AppComponent,
    TopMenuComponent,
    FooterComponent,
    ContentComponent,
    ContentLoginComponent,
    ContentRegisterComponent,
    ContentDefaultComponent,
    ContentBookComponent,
    ContentHomeComponent,
    ContentAgbComponent,
    ContentSupportComponent,
    ContentDoctorComponent,
    ContentDoctorbookslotsComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    DataService,
    UserService,
    NotificationService,
    ReformatService
  ],
  entryComponents: [
    AppComponent
  ]

})

export class AppModule {
  constructor(private DataSvc: DataService) {

  }

  ngDoBootstrap(app) {
    console.log('AppModule initialized, wait for bootstrap');
    // Initialize DataSvc
    this.DataSvc.init();

    // wait for DataSvc becoming ready
    const subs = this.DataSvc.readySubject.subscribe({
      next: (v) => {
        console.log('ReadySubject observer: ' + v);
        if (v === true) {
          // Bootstrap main component
          app.bootstrap(AppComponent);
          subs.unsubscribe();
        }
      }
    });
  }
}
