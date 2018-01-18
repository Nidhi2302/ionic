import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistrationTypeSelectPage } from './registration-type-select';

@NgModule({
  declarations: [
    RegistrationTypeSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(RegistrationTypeSelectPage),
  ],
  exports: [
    RegistrationTypeSelectPage
  ]
})
export class RegistrationTypeSelectPageModule {}
