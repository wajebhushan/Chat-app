import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { SocketService } from 'src/app/services/socket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  rooms = [];
  constructor(
    private userService: UserService,
    private socketService: SocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.socketService.setupSocketConnection();
    this.userService.getAllRooms();
    this.userService.roomSubject.subscribe((res: any) => {
      this.rooms = res.result;
    });
  }

  createRoom(room) {
    console.log(room);
    this.userService.createRoom(room).subscribe((res) => {
      this.userService.getAllRooms();
    });
  }

  joinRoom(roomId) {
    console.log(roomId);
    this.socketService.joinChatRoom(roomId);
    this.router.navigate(['/room-chat'], { queryParams: { id: roomId } });

  }

  personalChat() {
    this.router.navigate(['/personal-chat']);
  }
}
