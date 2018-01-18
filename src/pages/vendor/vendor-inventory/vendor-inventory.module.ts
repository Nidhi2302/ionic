import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendorInventoryPage } from './vendor-inventory';

@NgModule({
  declarations: [
    VendorInventoryPage,
  ],
  imports: [
    IonicPageModule.forChild(VendorInventoryPage),
  ],
  exports: [
    VendorInventoryPage
  ]
})
export class VendorInventoryPageModule {}
