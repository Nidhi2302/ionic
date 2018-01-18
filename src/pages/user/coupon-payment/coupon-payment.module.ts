import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CouponPaymentPage } from './coupon-payment';

@NgModule({
  declarations: [
    CouponPaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(CouponPaymentPage),
  ],
})
export class CouponPaymentPageModule {}
