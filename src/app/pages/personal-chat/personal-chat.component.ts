import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-personal-chat',
  templateUrl: './personal-chat.component.html',
  styleUrls: ['./personal-chat.component.scss'],
})
export class PersonalChatComponent implements OnInit {
  public status;
  public messages: any = [];
  public socketId: string;
  public time: string;
  public receiver;
  public users: any = [];
  public room;
  public sender;
  public username;
  constructor(
    private socketService: SocketService,
    private userService: UserService
  ) {}

  ngOnInit(): void {

    this.socketService.setupSocketConnection();

    this.userService.getUser().subscribe((res: any) => {
      // console.log(res);
      this.sender = res.result._id;
    });

    this.userService.getAllUsers().subscribe((res: any) => {
      this.users = res.result;
    });

    /* this.activatedRoute.queryParams.subscribe(query => {
      this.sender = query.username;
    }); */

    /* this.socketService.newUserSubject.subscribe((res) => {
      this.users = res;
    }); */

    this.socketService.getMessages().subscribe((res) => {
      console.log(res);
      this.time = this.socketService.getTime(res.time);
      this.messages.push(res);
      this.username = res.sender_name;
      this.receiver = res.sender;
    });
  }

  handleUserClick(username, userId) {
    this.username = username;
    this.receiver = userId;
  }

  sendMessage(message) {
    console.log(this.sender);
    console.log(this.receiver);
    console.log(message.message);
    if (this.sender !== undefined && this.receiver !== undefined) {
      this.socketService.sendPrivateMsg(
        this.receiver,
        message.message
      );
    }
  }
}
