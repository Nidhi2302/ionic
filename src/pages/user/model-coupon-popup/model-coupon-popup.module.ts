import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModelCouponPopupPage } from './model-coupon-popup';

@NgModule({
  declarations: [
    ModelCouponPopupPage,
  ],
  imports: [
    IonicPageModule.forChild(ModelCouponPopupPage),
  ],
  exports: [
    ModelCouponPopupPage
  ]
})
export class ModelCouponPopupPageModule {}
