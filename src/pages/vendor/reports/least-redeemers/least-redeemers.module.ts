import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeastRedeemersPage } from './least-redeemers';

@NgModule({
  declarations: [
    LeastRedeemersPage,
  ],
  imports: [
    IonicPageModule.forChild(LeastRedeemersPage),
  ],
  exports: [
    LeastRedeemersPage
  ]
})
export class LeastRedeemersPageModule {}
