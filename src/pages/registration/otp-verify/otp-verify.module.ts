import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OtpVerifyPage } from './otp-verify';

@NgModule({
  declarations: [
    OtpVerifyPage,
  ],
  imports: [
    IonicPageModule.forChild(OtpVerifyPage),
  ],
  exports: [
    OtpVerifyPage
  ]
})
export class OtpVerifyPageModule {}
