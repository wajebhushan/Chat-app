import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { PersonalChatComponent } from './personal-chat.component';

@NgModule({
  declarations: [PersonalChatComponent],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: PersonalChatComponent,
      },
    ]),
  ],
})
export class PersonalChatModule {}
