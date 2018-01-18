import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActiveRedeemersPage } from './active-redeemers';

@NgModule({
  declarations: [
    ActiveRedeemersPage,
  ],
  imports: [
    IonicPageModule.forChild(ActiveRedeemersPage),
  ],
  exports: [
    ActiveRedeemersPage
  ]
})
export class ActiveRedeemersPageModule {}
