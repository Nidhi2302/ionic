import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SplashVideoPage } from './splash-video';

@NgModule({
  declarations: [
    SplashVideoPage,
  ],
  imports: [
    IonicPageModule.forChild(SplashVideoPage),
  ],
  exports: [
    SplashVideoPage
  ]
})
export class SplashVideoPageModule {}
