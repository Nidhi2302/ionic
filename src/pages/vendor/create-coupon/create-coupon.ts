import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Events, ModalController, Content } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ConfigServiceProvider } from "../../../providers/config-service/config-service";
import { User } from "../../../models/user";
import { VendorProvider } from "../../../providers/vendor/vendor";
import { VendorInventoryPage } from "../vendor-inventory/vendor-inventory";
import { CouponReviewPage } from "../coupon-review/coupon-review";
import { SelectFollowersPage } from "../select-followers/select-followers";

/**
 * Generated class for the CreateCouponPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-create-coupon',
  templateUrl: 'create-coupon.html',
})
export class CreateCouponPage {
  public qupeyForm: FormGroup;
  businessBack = "assets/business-image/VendorDefault.jpg";
  businessLogo = "assets/business-logo/user-default.png";
  percentage = [];
  flatFee = [
    // {
    //   type: 'No Fee', status: false
    // }, 
    {
      type: 'Advance Purchase Required', status: true
    }];

  discountTypes = [
    {
      type: 'Percentage', status: false
    }, {
      type: 'Dollar Amount', status: false
    }, {
      type: 'Punchcard', status: false
    }, {
      type: 'Other', status: false
    }];

  followers = [
    {
      type: 'All Followers', status: true
    }, {
      type: 'List Only', status: false
    }];
  countDown = [];
  loggedinUser = {};
  min;
  max;
  curr_date = new Date();
  isSubmitted = true;
  isCouponAvl = true;
  msg = "";
  isEdit = false;
  editCoupon;
  isCreated = false;
  selectedFollowers = []

  public mask = [/[a-z,0-9,A-Z]/, '-', /[a-z,0-9,A-Z]/, '-', /[a-z,0-9,A-Z]/, '-', /[a-z,0-9,A-Z]/, '-', /[a-z,0-9,A-Z]/, '-', /[a-z,0-9,A-Z]/]
  @ViewChild(Content) content: Content;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public config: ConfigServiceProvider,
    public vendor: VendorProvider,
    public menuCtrl: MenuController,
    private cdr: ChangeDetectorRef,
    private events: Events,
    public modalCtrl: ModalController,
  ) {

    this.qupeyForm = new FormGroup({
      qupeyName: new FormControl('', [Validators.required]),
      ava_amount: new FormControl(''),
      pur_amount: new FormControl(''),
      description: new FormControl('', [Validators.required]),
      term_con: new FormControl('', [Validators.required]),
      followers: new FormControl(this.followers[0].type, [Validators.required]),
      lunchDate: new FormControl('', [Validators.required]),
      lunchTime: new FormControl('', [Validators.required]),
      expDate: new FormControl('', [Validators.required]),
      expTime: new FormControl('', [Validators.required]),
      discountType: new FormControl('', [Validators.required]),
      flatFee: new FormControl(''),
      countDown: new FormControl(''),
      percentage: new FormControl(''),
      code: new FormControl('', [Validators.required]),

    })
    this.qupeyForm.get("followers").setValue(this.followers[0].type);
    let minyear = new Date();

    this.min = minyear.getFullYear();
    let maxyear = new Date(minyear.setFullYear(minyear.getFullYear() + 3));
    this.max = maxyear.getFullYear();

    for (let i = 10; i <= 70; i += 10) {
      let types = {
        type: i + "% off or more",
        status: false
      }
      this.percentage.push(types);
    }
    for (let i = 3; i <= 9; i++) {
      let types = {
        type: i + " Purchases",
        status: false
      }
      this.countDown.push(types);
    }

    this.percentage.push({
      type: "Free",
      status: false
    });
    this.config.getLocalStore("LoggedUser").then((value) => {
      this.loggedinUser = new User(value);
      this.config.showLoading();
      if (!this.isEdit) {
        this.vendor.getCouponCount(this.loggedinUser["secretToken"]).then((res) => {
          this.config.printLog("coupon count", res);
          this.config.hideloading();
        }).catch((err) => {
          this.msg = err;
          this.isCouponAvl = false;
          this.config.printLog("erree", err);
          this.config.hideloading();
        })
      } else {
        this.config.hideloading();
      }

    }).catch((err) => {
      console.log(err);
      this.config.hideloading();
    });
    this.config.getLocalStore("profilePic").then((value) => {
      console.log(value);
      if (value) {
        this.businessLogo = value;
      }
    }, error => { console.log("profile pic", error); }).catch((err) => {
      console.log(err);
    })
    this.config.getLocalStore("backgroundPic").then((value) => {
      console.log(value);
      if (value) {
        this.businessBack = value;
      }

    }).catch((err) => {
      console.log(err);
    })

    /*Edit Coupon Logic */
    this.editCoupon = this.navParams.get("coupon");
    if (this.editCoupon) {
      // console.log("inside edit coupon",this.editCoupon);
      this.isEdit = true;
      this.config.showLoading();
      let self = this
      this.qupeyForm.get("qupeyName").setValue(self.editCoupon.coupon_name);
      this.qupeyForm.get("discountType").setValue(self.editCoupon.discount_type);
      this.qupeyForm.get("description").setValue(self.editCoupon.discription);
      this.editToggle({ type: self.editCoupon.discount_type, status: false }, this.discountTypes);
      this.qupeyForm.get("lunchTime").setValue((self.editCoupon.launch_date.split("T")[1]).split("Z")[0]);
      this.qupeyForm.get("expTime").setValue((self.editCoupon.expiration_date.split("T")[1]).split("Z")[0]);

      this.qupeyForm.get("code").setValue(self.editCoupon.redumption_code);
      // this.qupeyForm.get("sDigit").setValue(self.editCoupon.redumption_code.split("-")[1]);
      // this.qupeyForm.get("tDigit").setValue(self.editCoupon.redumption_code.split("-")[2]);
      // this.qupeyForm.get("foDigit").setValue(self.editCoupon.redumption_code.split("-")[3]);
      // this.qupeyForm.get("fiDigit").setValue(self.editCoupon.redumption_code.split("-")[4]);
      // this.qupeyForm.get("siDigit").setValue(self.editCoupon.redumption_code.split("-")[5]);
      this.qupeyForm.get("term_con").setValue(self.editCoupon.terms_condition);
      if (self.editCoupon.available_to[0] == "All Followers") {
        this.qupeyForm.get("followers").setValue(self.editCoupon.available_to[0]);
        this.editToggle({ type: self.editCoupon.available_to, status: false }, this.followers);
      } else {
        this.qupeyForm.get("followers").setValue("List Only");
        this.selectedFollowers = self.editCoupon.available_to;
        this.editToggle({ type: "List Only", status: false }, this.followers);
      }

      if (self.editCoupon.qupey_type.indexOf("%") >= 0) {

        this.qupeyForm.get("percentage").setValue(self.editCoupon.qupey_type.split("%")[0] + "% off or more");
        this.editToggle({ type: self.editCoupon.qupey_type.split("%")[0] + "% off or more", status: false }, this.percentage);

      } else if (self.editCoupon.qupey_type == "Free") {
        this.editToggle({ type: "Free", status: false }, this.percentage);
        this.qupeyForm.get("percentage").setValue("Free");
      }
      else if (self.editCoupon.qupey_type.indexOf("Buy") >= 0) {
        this.qupeyForm.get("countDown").setValue(self.editCoupon.qupey_type.split(" ")[1] + " Purchases");
        this.editToggle({ type: self.editCoupon.qupey_type.split(" ")[1] + " Purchases", status: false }, this.countDown);
      } else {
        this.qupeyForm.get("flatFee").setValue(self.editCoupon.qupey_type);
        this.editToggle({ type: self.editCoupon.qupey_type, status: false }, this.flatFee);
        this.qupeyForm.get("ava_amount").setValue(self.editCoupon.available_amount);
        this.qupeyForm.get("pur_amount").setValue(self.editCoupon.purchase_amount);
      }
      if (self.editCoupon.launch_date.indexOf('T') > 0 && self.editCoupon.expiration_date.indexOf('T') > 0) {
        this.qupeyForm.get("lunchDate").setValue(self.editCoupon.launch_date);
        this.qupeyForm.get("expDate").setValue(self.editCoupon.expiration_date);
      }
      else {
        this.qupeyForm.get("lunchDate").setValue(self.editCoupon.launch_date.split(" ")[0]);
        this.qupeyForm.get("expDate").setValue(self.editCoupon.expiration_date.split(" ")[0]);
      }
      this.config.hideloading();
      //console.log("inside updated edit coupon",this.qupeyForm.value);
    }
    let self = this
    this.events.unsubscribe('resetForm');
    this.events.subscribe('resetForm', (count) => {
      self.qupeyForm.reset();
      self.editToggle({ type: '' }, this.percentage);
      self.editToggle({ type: '' }, this.discountTypes);
      self.editToggle({ type: '' }, this.countDown);
      this.editToggle({ type: '' }, this.flatFee);
      self.editToggle({ type: 'All Followers', status: false }, this.followers);
      self.isCreated = true;
      //scroll to top
      //self.content.scrollToTop();
      self.isCouponAvl = count.isCouponAvl;
      if (!self.isCouponAvl) {
        self.msg = count.msg;
      }
    })
  }


  ngOnChanges(changes: any) {
    console.log("hei");
  }
  isValid(formControl) {

    if (this.isSubmitted) {
      if (this.qupeyForm.get(formControl).value != '')
        return 'text-box'

      return 'text-box-red'
    }
    return 'text-box'
  }
  clickMenu() {
    console.log("menuClicked");
    if (this.isEdit) {
      this.navCtrl.pop();
    } else {
      this.menuCtrl.open();
    }
  }
  openFollowersList() {
    this.config.showLoading();
    let self = this;
    let followersList;
    let page = 1;

    self.vendor.getFollowers(self.loggedinUser["secretToken"], page).then((response) => {
      followersList = response['data'];
      this.config.hideloading();
      let myModal = this.modalCtrl.create(SelectFollowersPage, { "followersList": followersList, "selectedFollowers": this.selectedFollowers }, { enableBackdropDismiss: false });
      myModal.onDidDismiss((followers) => {

        if (followers) {
          console.log("back", followers);
          this.selectedFollowers = followers;
        } else {
          this.selectedFollowers = [];
        }
      })
      myModal.present();
    }).catch((err) => {
      self.config.printLog("err", err);
      self.config.hideloading();
      self.config.showToast("No Follower found");
    });

  }
  removeFollower(user) {
    this.selectedFollowers = this.selectedFollowers.filter((item) => item._id !== user._id);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateCouponPage', this.loggedinUser);

  }
  ionViewWillEnter() {
    if (!this.isEdit) {
      this.qupeyForm.reset();
      this.qupeyForm.get("followers").setValue(this.followers[0].type);
      this.editToggle({ type: '' }, this.percentage);
      this.editToggle({ type: '' }, this.discountTypes);
      this.editToggle({ type: '' }, this.countDown);
      this.editToggle({ type: '' }, this.flatFee);
      this.editToggle({ type: 'All Followers', status: false }, this.followers);
    }

  }
  toggleDiscountClick(event, item, formControlName, list) {

    //console.log([event,item,formControlName]);

    if (event.checked) {
      this.qupeyForm.get(formControlName).setValue(item.type);
      list.forEach(function (i) {
        if (i.type != item.type) {
          i.status = false;
        }
        else {
          i.status = true;
        }
      })

      console.log("Toggle swipe and click", list);

    }
    else {
      let flg = true
      list.forEach((j) => {
        if (j.status) {
          flg = false;
        }

      })
      if (flg) {
        this.qupeyForm.get(formControlName).setValue('');
      }
    }

    console.log("Toggle swipe and click", formControlName, this.qupeyForm.get(formControlName).value);
    this.cdr.detectChanges();
  }
  editToggle(item, list) {
    console.log("inside edit toggle", list);
    list.forEach(function (i) {
      if (i.type != item.type) {
        i.status = false;
      }
      else {
        i.status = true;
      }
    })
  }
  isTrue(name, formControlName) {
    //this.cdr.detectChanges();
    return this.qupeyForm.get(formControlName).value == name
  }
  previous() {
    this.navCtrl.pop();
  }
  autoTab(ev, field) {
    console.log('key pressed', ev, field);
    if (ev.srcElement.form.elements[field]) {
      ev.srcElement.form.elements[field].focus();
      console.log('key pressed set focus');
    }
    else {
      console.log('close keyboard');
    }

  }
  createCoupon(data, isValid) {
    let followers = [];
    let qupey_type;
    let cu = new Date();
    cu.setHours(0, 0, 0, 0);
    let d = new Date(data.lunchDate);
    let d1 = new Date(data.lunchDate);
    let d2 = new Date(this.qupeyForm.get('expDate').value);
    let d3 = new Date(d.setMonth(d.getMonth() + 3));
    console.log(d1, d2, d3);

    this.config.printLog("data", new Date(data.lunchDate));

    if (this.qupeyForm.get('qupeyName').value == '') {
      this.config.showToast("Please fill Qupey name");
    }
    else if (this.qupeyForm.get('discountType').value == '') {
      this.config.showToast("Please select Discount type");
    }
    else if (this.qupeyForm.get('description').value == '') {
      this.config.showToast("Please fill Description");
    }
    else if (this.qupeyForm.get('lunchDate').value == '') {
      this.config.showToast("Please fill Launch date");
    }
    else if (this.qupeyForm.get('lunchTime').value == '') {
      this.config.showToast("Please fill Launch time");
    }
    else if (this.qupeyForm.get('expDate').value == '') {
      this.config.showToast("Please fill Expired date");
    }
    else if (this.qupeyForm.get('expTime').value == '') {
      this.config.showToast("Please fill Expired time");
    }

    else if (this.qupeyForm.get('code').value == '') {
      this.config.showToast("Please fill Redeem code");
    }
    else if (this.qupeyForm.get('term_con').value == '') {
      this.config.showToast("Please fill Terms & Conditions");
    }


    if (isValid) {

      if (data.percentage && data.discountType == 'Percentage') {
        if (data.percentage == "Free") {
          qupey_type = data.percentage;
        } else {
          qupey_type = data.percentage.split(" ")[0] + " off";
        }
        console.log(new Date());
        this.isSubmitted = true;
        // if (d1 < new Date()) {
        //   this.config.showToast("Launch Date must be after current Date");
        //   this.isSubmitted = false;
        // }
        // else if (d2 < d3) {
        //   this.config.showToast("Expired Date must be after 3 months of Launch Date");
        //   this.isSubmitted = false;
        // }
      }
      else if (data.flatFee && data.discountType == 'Dollar Amount') {
        qupey_type = data.flatFee;
        this.isSubmitted = true;
        // if (d1 < new Date()) {
        //   this.config.showToast("Launch Date must be after current Date");
        //   this.isSubmitted = false;
        // }
        // else if (d2 < d3) {
        //   this.config.showToast("Expired Date must be after 3 months of Launch Date");
        //   this.isSubmitted = false;
        // }

      }
      else if (data.countDown && data.discountType == 'Punchcard') {
        qupey_type = "Buy " + data.countDown.split(" ")[0] + " and Get One Free";

        this.isSubmitted = true;
        if (d1 < cu) {
          this.config.showToast("Launch Date must be after current Date");
          this.isSubmitted = false;
        }
        else if (d2 < d3) {
          this.config.showToast("Expired Date must be after 3 months of Launch Date");
          this.isSubmitted = false;
        }
      } else if (data.discountType == 'Other') {
        qupey_type = "Other"
        this.isSubmitted = true;
        if (d1 < cu) {
          this.config.showToast("Launch Date must be after current Date");
          this.isSubmitted = false;
        }
        else if (d2 < d3) {
          this.config.showToast("Expired Date must be after 3 months of Launch Date");
          this.isSubmitted = false;
        }
      } else {
        this.config.showToast("Please select discount");
        this.isSubmitted = false;
      }

      if (data.followers != 'All Followers') {
        console.log("follower", data.followers, this.selectedFollowers);
        followers = this.selectedFollowers;
      } else {

        // this.isSubmitted = true;
        if (data.followers == null) {
          this.config.showToast("Please select Followers");
          this.isSubmitted = false;
        } else {
          console.log("follower", data.followers, this.selectedFollowers);
          followers.push(data.followers);
        }


      }
      if (data.countDown == null) {
        data.countDown = "0 punch";
      }
      if (this.isSubmitted) {
        this.config.showLoading();
        let coupon = {
          vendor_id: this.loggedinUser["secretToken"],
          coupon_name: data.qupeyName,
          discount_type: data.discountType,
          qupey_type: qupey_type,
          available_amount: data.ava_amount,
          purchase_amount: data.pur_amount,
          actual_count: data.countDown.split(" ")[0],
          punch_count: "0",
          discription: data.description,
          launch_date: data.lunchDate + " " + data.lunchTime,
          expiration_date: data.expDate + " " + data.expTime,
          available_to: followers,
          terms_condition: data.term_con,
          redumption_code: data.code,
        }
        let self = this
        this.config.printLog("inside coupon creation ", coupon);
        if (this.isEdit) {
          coupon["id"] = self.editCoupon._id;
          coupon["launch_date"] = data.lunchDate.split("T")[0] + " " + data.lunchTime,
            coupon["expiration_date"] = data.expDate.split("T")[0] + " " + data.expTime,
            this.vendor.updateCoupon(coupon, this.loggedinUser["secretToken"]).then((response) => {
              self.config.hideloading();
              self.config.showToast(response["message"]);
              self.events.publish('updateCoupon', response["data"]);
              self.navCtrl.pop();
            }).catch((err) => {
              self.config.hideloading();
              self.config.printLog("error", err);
            });
        } else {
          this.vendor.createCoupon(coupon, this.loggedinUser["secretToken"]).then((response) => {
            self.config.hideloading();
            self.config.showToast(response["message"]);
            //self.navCtrl.setRoot(VendorInventoryPage);
            self.navCtrl.push(CouponReviewPage, { "id": response["_id"] });
            //self.events.publish('fromCoupon',VendorInventoryPage);
          }).catch((err) => {
            self.config.hideloading();
            self.config.printLog("error", err);
          });
        }

      }

    }
  }


}
