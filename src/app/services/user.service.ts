import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public roomSubject = new Subject();
  public userSubject = new Subject();
  constructor(private http: HttpClient) { }

/**
 * Function for save user details
 */
  setUserRegistration(userDetails): Observable<object> {
    console.log(userDetails);
    return this.http.post(environment.user_register, userDetails);
  }

  /**
   * This function fetch login details from server
   */
  getUserLoginDetails(userDetails): Observable<object> {
    const user = {
      email: userDetails.email,
      password: userDetails.password
    };
    console.log(user);
    return this.http.get(environment.user_login, {params: user});
  }

  /**
   * Function for create new room for chatting
   */
  createRoom(room) {
    // const userRoom = { room };
    // const token = localStorage.getItem('token');
    // const header = new HttpHeaders().set('Authorization', 'Bearer' + token);
    return this.http.post(environment.new_room, room);
  }

/**
 * Function for get all rooms
 */
  getAllRooms() {
    this.http.get(environment.all_rooms).subscribe(res => {
      this.roomSubject.next(res);
    });
  }

  getUser() {
    const token = localStorage.getItem('token');
    const header = new HttpHeaders().set('Authorization', 'Bearer' + token);
    return this.http.get(environment.user, { headers: header });
  }

  getAllUsers() {
  //  console.log('hello');
    return this.http.get(environment.all_users);
  }

  /**
   *
   * @param token - token
   * Function for logout
   *
   */
  logoutUser(token: string): Observable<object> {
    const header = new HttpHeaders().set('Authorization', 'Bearer' + token);
    return this.http.get(environment.user_logout, {headers: header});
  }
}
