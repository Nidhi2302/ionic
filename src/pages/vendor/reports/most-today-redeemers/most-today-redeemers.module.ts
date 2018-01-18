import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MostTodayRedeemersPage } from './most-today-redeemers';

@NgModule({
  declarations: [
    MostTodayRedeemersPage,
  ],
  imports: [
    IonicPageModule.forChild(MostTodayRedeemersPage),
  ],
  exports: [
    MostTodayRedeemersPage
  ]
})
export class MostTodayRedeemersPageModule {}
