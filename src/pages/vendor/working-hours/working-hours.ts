import { Component, Renderer, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the WorkingHoursPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-working-hours',
  templateUrl: 'working-hours.html',
})
export class WorkingHoursPage implements OnInit {
  status
  workingDay = [
    {
      day: 'Mon',
      status: '',
    },
    {
      day: 'Tue',
      status: '',
    },
    {
      day: 'Wed',
      status: '',
    },
    {
      day: 'Thu',
      status: '',
    },
    {
      day: 'Fri',
      status: '',
    },
    {
      day: 'Sat',
      status: '',
    },
    {
      day: 'Sun',
      status: '',
    }
  ]
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    params: NavParams,
    public renderer: Renderer,

  ) {
    this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'my-popup', true);
    let workingHours=this.navParams.get("workingHours");
    if(workingHours.length>0){
      console.log("efd",workingHours);
      this.workingDay=workingHours;
    }
    

  }
  ngOnInit(): void {
    
  }
  dismiss() {

    console.log(status);
  }
  setHours() {
    console.log("sending",this.workingDay);
    this.viewCtrl.dismiss(this.workingDay);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad WorkingHoursPage');
  }

}
