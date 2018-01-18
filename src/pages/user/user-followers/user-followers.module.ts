import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserFollowersPage } from './user-followers';

@NgModule({
  declarations: [
    UserFollowersPage,
  ],
  imports: [
    IonicPageModule.forChild(UserFollowersPage),
  ],
})
export class UserFollowersPageModule {}
