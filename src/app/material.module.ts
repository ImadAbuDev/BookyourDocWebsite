import {NgModule} from '@angular/core';

import {
  MatSidenavModule,
  MatToolbarModule,
  MatIconModule,
  MatListModule, MatFormFieldModule, MatInputModule, MatCardModule, MatButtonModule, MatTooltipModule,
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatRadioModule} from '@angular/material/radio';

@NgModule({
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatRadioModule
  ],
  exports: [
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule
  ]
})
export class MaterialModule {
}
