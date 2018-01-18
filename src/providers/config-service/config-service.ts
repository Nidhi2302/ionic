import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ENV } from '../../config/app';
import { LoadingController, ToastController, AlertController, Toast } from "ionic-angular";
import { Storage } from '@ionic/storage';
/*
  Generated class for the ConfigServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ConfigServiceProvider {
  protected config;
  loading
  constructor(public http: Http,
    protected storage: Storage,
    protected loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController) {
    this.config = ENV[ENV.environment];
    this.printLog('Hello ConfigServiceProvider Provider', '');
  }
  get(key) {
    return this.config[key];
  }
  printLog(message: any, values: any) {
    console.log(message, values);
  }
  public isConnect=true;
  setLocalStore(key, data) {
    return this.storage.set(key, data);
  }

  getLocalStore(key) {
    return this.storage.get(key);
  }

  clearStorageFor(key) {
    return this.storage.remove(key)
  }

  clearStorage() {
    return this.storage.clear();
  }
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait ...'
    });
    this.loading.present();
  }

  hideloading() {
    this.loading.dismiss();
  }
  showToast(error) {
    let toast: Toast;
    if (toast) 
    {
      console.log(toast);toast.dismiss();
    }
      toast = this.toastCtrl.create({
        message: error,
        duration: 2000
      });
      toast.present();
    

     
  }
  showAlert(error) {
    const alert = this.alertCtrl.create({
      message: error,
      title: "Alert",
      buttons: ['Ok']
    });
    alert.present();
  }
}
