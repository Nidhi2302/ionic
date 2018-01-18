import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OnBoardingSliderPage } from './on-boarding-slider';


@NgModule({
  declarations: [
    OnBoardingSliderPage,
  ],
  imports: [
    IonicPageModule.forChild(OnBoardingSliderPage),
  ],
  exports: [
    OnBoardingSliderPage
  ]
})
export class OnBoardingSliderPageModule {

}
