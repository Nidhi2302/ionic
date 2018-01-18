import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateCouponPage } from './create-coupon';

@NgModule({
  declarations: [
    CreateCouponPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateCouponPage),
  ],
  exports: [
    CreateCouponPage
  ]
})
export class CreateCouponPageModule {}
