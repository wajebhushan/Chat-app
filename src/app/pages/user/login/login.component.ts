import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../models/user';
import { UserService } from 'src/app/services/user.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private userService: UserService,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {}

  userLogin(user) {
    this.userService.getUserLoginDetails(user).subscribe(
      async (res: any) => {
        // const data = res.result
        console.log(res);
        await localStorage.setItem('token', res.result.token);
        this.socketService.setupSocketConnection();
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.log(error);
      }
    );
    //
  }
}
