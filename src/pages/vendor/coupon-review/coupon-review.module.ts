import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CouponReviewPage } from './coupon-review';

@NgModule({
  declarations: [
    CouponReviewPage,
  ],
  imports: [
    IonicPageModule.forChild(CouponReviewPage),
  ],
  exports: [
    CouponReviewPage
  ]
})
export class CouponReviewPageModule {}
