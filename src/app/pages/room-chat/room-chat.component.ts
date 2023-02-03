import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRoom } from 'src/app/models/user-rom';

@Component({
  selector: 'app-room-chat',
  templateUrl: './room-chat.component.html',
  styleUrls: ['./room-chat.component.scss'],
})
export class RoomChatComponent implements OnInit {
  public status;
  public messages: any = [];
  public socketId: string;
  public time: string;
  public user;
  public users: any = [];
  public room;
  public roomId;
  constructor(
    private socketService: SocketService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activeRoute.queryParams.subscribe((params: any) => {
      this.roomId = params.id;
    });
  }

  ngOnInit() {
    this.socketService.getMessages().subscribe((res) => {
      console.log(res);
      this.time = this.socketService.getTime(res.time);
      // this.socketId = res.data.socketId;
      // console.log(new Date(res.time));
      this.messages.push(res);
      this.socketService.getRoomUsers(this.room);
    });
  }

  handleClick(message) {
    this.socketService.sendMessage(this.roomId, message.message);
  }

  leaveRoom() {
    this.socketService.leaveRoom();
    this.router.navigate(['/dashboard']);
  }
}
