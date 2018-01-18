import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectFollowersPage } from './select-followers';

@NgModule({
  declarations: [
    SelectFollowersPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectFollowersPage),
  ],
  exports: [
    SelectFollowersPage
  ]
})
export class SelectFollowersPageModule {}
