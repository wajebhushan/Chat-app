import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { RegistrationComponent } from './registration.component';




@NgModule({
  declarations: [RegistrationComponent],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: RegistrationComponent,
      },
    ]),
  ],
})
export class RegistrationModule {}
