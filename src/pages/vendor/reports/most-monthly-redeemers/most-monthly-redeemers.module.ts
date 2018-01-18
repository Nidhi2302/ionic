import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MostMonthlyRedeemersPage } from './most-monthly-redeemers';

@NgModule({
  declarations: [
    MostMonthlyRedeemersPage,
  ],
  imports: [
    IonicPageModule.forChild(MostMonthlyRedeemersPage),
  ],
  exports: [
    MostMonthlyRedeemersPage
  ]
})
export class MostMonthlyRedeemersPageModule {}
