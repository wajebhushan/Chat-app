import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { RoomChatComponent } from './room-chat.component';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [RoomChatComponent],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: RoomChatComponent,
      },
    ]),
  ],
})
export class RoomChatModule {}
