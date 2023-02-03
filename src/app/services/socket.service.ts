import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  public socket;
  public subject = new Subject();
  public userSubject = new BehaviorSubject(null);
  public newUserSubject = new BehaviorSubject(null);
  public errorSubject = new Subject();
  constructor() {}

  setupSocketConnection() {
    const token = localStorage.getItem('token');
    this.socket = io.connect(environment.socket_endpoint, {query: 'token=' + token});

    this.socket.on('user', data => {
      // console.log(data);
      this.userSubject.next(data);
    });
    this.socket.on('all-user', data => {
      console.log(data);
      this.newUserSubject.next(data);
    });
  }

  joinChatRoom(roomId) {
    this.socket.emit('join', roomId, (message) => {
      this.subject.next(message);
    });
  }

  sendMessage(roomId, message) {
    this.socket.emit('sendMessage', {roomId, message});
  }

 /*   getStatus(): Observable<any>{
    return Observable.create((observer) => {
      this.socket.on('new-message', (message) => {
        observer.next(message);
      });
    });
   } */

  leaveRoom() {
    this.socket.emit('leave');
  }

   getMessages(): Observable<any>{
    return Observable.create((observer) => {
      this.socket.on('message', (message) => {
        console.log(message);
        observer.next(message);
      });
    });
   }

  getRoomUsers(room) {
    this.socket.emit('users', {room});
  }

  createPrivateRoom(id, username) {
    console.log(username);
    this.socket.emit('private-room', {id, username});
  }

  sendPrivateMsg(receiver, message) {
    this.socket.emit('private-msg', {receiver, message });
  }

  createUser(username) {
    this.socket.emit('new-user', username, (message) => {
      this.errorSubject.next(message);
    });
  }

  getAllusers() {
    this.socket.emit('all-users');
  }

  getTime(date) {
    const d = new Date(date);
    let hours = d.getHours();
    let minutes = d.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? 0 + minutes : minutes;
    const time = hours + ':' + minutes + ' ' + ampm;
    return time;
  }
}
