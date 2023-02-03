// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const server = 'http://192.168.43.126:3000';
export const environment = {
  production: false,
  socket_endpoint: `${server}`,
  user_login: `${server}/users/user-login`,
  user_register: `${server}/users/user-register`,
  user_logout: `${server}/users/user_logout`,
  new_room: `${server}/chat-room/create-room`,
  all_rooms: `${server}/chat-room/all-rooms`,
  all_users: `${server}/users/all-users`,
  user: `${server}/users/get-user`
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
