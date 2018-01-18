import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserUpdateProfilePage } from './user-update-profile';

@NgModule({
  declarations: [
    UserUpdateProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(UserUpdateProfilePage),
  ],
  exports: [
    UserUpdateProfilePage
  ]
})
export class UserUpdateProfilePageModule {}
