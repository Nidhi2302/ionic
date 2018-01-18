import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModelReedemCodePage } from './model-reedem-code';

@NgModule({
  declarations: [
    ModelReedemCodePage,
  ],
  imports: [
    IonicPageModule.forChild(ModelReedemCodePage),
  ],
  exports: [
    ModelReedemCodePage
  ]
})
export class ModelReedemCodePageModule {}
