import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'room-chat',
    loadChildren: () =>
      import('./pages/room-chat/room-chat.module').then(
        (m) => m.RoomChatModule
      ),
  },
  {
    path: 'personal-chat',
    loadChildren: () =>
      import('./pages/personal-chat/personal-chat.module').then(
        (m) => m.PersonalChatModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/user/login/login.module').then(
        (m) => m.LoginModule
      ),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/user/registration/registration.module').then(
        (m) => m.RegistrationModule
      ),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./pages/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
