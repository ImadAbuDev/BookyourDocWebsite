import {ContentDoctorComponent} from './content/content-doctor/content-doctor.component';

﻿import {Routes, RouterModule} from '@angular/router';

import {ContentLoginComponent} from './content/content-login/content-login.component';
import {ContentRegisterComponent} from './content/content-register/content-register.component';
import {ContentDefaultComponent} from './content/content-default/content-default.component';
import {ContentBookComponent} from './content/content-book/content-book.component';
import {ContentHomeComponent} from './content/content-home/content-home.component';
import {ContentAgbComponent} from './content/content-agb/content-agb.component';
import {ContentSupportComponent} from './content/content-support/content-support.component';
import {ContentDoctorbookslotsComponent} from './content/content-doctorbookslots/content-doctorbookslots.component';

const appRoutes: Routes = [
  {path: '', component: ContentDefaultComponent},
  {path: 'login', component: ContentLoginComponent},
  {path: 'home', component: ContentHomeComponent},
  {path: 'register', component: ContentRegisterComponent},
  {path: 'book', component: ContentBookComponent},
  {path: 'agb', component: ContentAgbComponent},
  {path: 'support', component: ContentSupportComponent},
  {path: 'doctor', component: ContentDoctorComponent},
  {path: 'registerslots', component: ContentDoctorbookslotsComponent},
  // otherwise redirect to home
  {path: '**', redirectTo: ''}
];

export const routing = RouterModule.forRoot(appRoutes);
