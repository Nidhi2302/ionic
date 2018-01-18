import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ActionSheetController, Platform, ModalController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ConfigServiceProvider } from "../../../providers/config-service/config-service";
import { User } from "../../../models/user";
import { VendorProvider } from "../../../providers/vendor/vendor";
import { VendorHomePage } from "../../vendor-home/vendor-home";

import { Camera } from "@ionic-native/camera";
import { Transfer, TransferObject } from "@ionic-native/transfer";
import { FilePath } from "@ionic-native/file-path";
import { File, FileEntry } from '@ionic-native/file';
import { StatisticsPage } from "../statistics/statistics";
import { PasswordChangePage } from "../password-change/password-change";
import { WorkingHoursPage } from "../../vendor/working-hours/working-hours";

/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public qupeyForm: FormGroup;
 
  loggedinUser = {};
  businessBack = "assets/business-image/VendorDefault.jpg";
  businessLogo = "assets/business-logo/user-default.png";
  lastImage;
  profileImage;
  backImage;
  vandorProfile;
  workingHours=[
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
  ];
  APP_URL = this.config.get('APP_URL');
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public config: ConfigServiceProvider, public vendor: VendorProvider,
    public menuCtrl: MenuController,
    private camera: Camera,
    private transfer: Transfer, private file: File, private filePath: FilePath,
    public actionSheetCtrl: ActionSheetController, public platform: Platform,
    public modalCtrl: ModalController) {
    let self = this;
    this.menuCtrl.enable(true);
    self.qupeyForm = new FormGroup({
      displayname: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required,Validators.pattern("^[@]{1}[a-zA-Z0-9-_]{6,30}$")]),
      email: new FormControl(''),
      profiledescription: new FormControl(''),
      address1: new FormControl('', [Validators.required]),
      address2: new FormControl(''),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      zip: new FormControl('', [Validators.required]),
      phonenumber: new FormControl('', [Validators.required]),
      note: new FormControl(''),
      website: new FormControl(''),
      twitter: new FormControl(''),
      facebook: new FormControl(''),
      instagram: new FormControl(''),
      businessPhone:new FormControl('')

    });


    self.config.getLocalStore("LoggedUser").then((value) => {
      self.loggedinUser = new User(value);
      console.log("this.loggedinUser");
      console.log(self.loggedinUser);
      if (self.loggedinUser['verified'] == true) {
        //nothig

        self.getProfile(self.loggedinUser["secretToken"]);
      }
      else {
        self.config.showAlert("You are not verifed");
        self.navCtrl.pop();
      }
    }).catch((err) => {
      this.config.printLog("", err);
    });
    self.config.getLocalStore("profilePic").then((value) => {
      if(value){
        this.businessLogo=value;
      }

    }).catch((err) => {
      console.log(err);
    })
    self.config.getLocalStore("backgroundPic").then((value) => {
      if(value){
        this.businessBack=value;
      }
      }).catch((err) => {
      console.log(err);
    })
  }
  clickMenu() {
    console.log("menuClicked");
    this.menuCtrl.open();
  }
  getProfile(token) {
    let self = this;
    self.vendor.getProfile(token).then((response) => {
      console.log("response", response);
      this.vandorProfile=response;
      self.qupeyForm.get('displayname').setValue(response['name']);
      self.qupeyForm.get('username').setValue("@"+response['username']);
      self.qupeyForm.get('email').setValue(response['email']);
      self.qupeyForm.get('profiledescription').setValue(response['profile_discrption']);
      self.qupeyForm.get('address1').setValue(response['address1']);
      self.qupeyForm.get('address2').setValue(response['address2']);
      self.qupeyForm.get('city').setValue(response['city']);
      self.qupeyForm.get('state').setValue(response['state']);
      self.qupeyForm.get('zip').setValue(response['zip']);
      self.qupeyForm.get('phonenumber').setValue(response['phonenumber']);
      self.qupeyForm.get('note').setValue(response['note']);
      self.qupeyForm.get('website').setValue(response['website']);
      self.qupeyForm.get('twitter').setValue(response['twitter']);
      self.qupeyForm.get('facebook').setValue(response['facebook']);
      self.qupeyForm.get('instagram').setValue(response['instagram']);
      self.qupeyForm.get('businessPhone').setValue(response['businessPhone']);
      self.loggedinUser['name']=response['name'];
      self.config.setLocalStore('LoggedUser', self.loggedinUser);

    }).catch((error) => {
      console.error(error);
    });
  }
  public presentActionSheet(type) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Gallery',
          icon: 'albums',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, type);
          }
        },
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA, type);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  public takePicture(sourceType, type) {
    // Create options for the Camera Dialog
    var options;
    if(type=="profile"){
      options = {
        quality: 100,
        targetWidth: 288,
        targetHeight: 290,
        sourceType: sourceType,
        saveToPhotoAlbum: false,
        correctOrientation: true,
        destinationType: this.camera.DestinationType.FILE_URI
      };
    }
    else{
      options = {
        quality: 100,
        targetWidth: 1245,
        targetHeight: 600,
        sourceType: sourceType,
        saveToPhotoAlbum: false,
        correctOrientation: true,
        destinationType: this.camera.DestinationType.FILE_URI
      };
    }



    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      console.log('imagePath');
      console.log(imagePath);
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(imagePath,correctPath, currentName, this.createFileName(), type);

          });
      } else {

        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(imagePath,correctPath, currentName, this.createFileName(), type);

      }
    }, (err) => {
      this.config.printLog('Error while selecting image.',err);
    });
  }
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return this.file.dataDirectory + img;
    }
  }
  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(imagePath,namePath, currentName, newFileName, type) {
    let self=this;
    console.log('namePath');
    console.log(namePath);
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      this.uploadImage(type);
    }, error => {
      this.config.showToast('Error while storing file.');
    });
  }
  public uploadImage(type) {
    // Destination URL
    let self =this;
    var url = this.APP_URL+"/user/profile-image";

    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);

    // File name only
    var filename = this.lastImage;
    console.log("file");
    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "image/jpg",
      headers: {"Content-Type": undefined,
      'x-auth-token':this.loggedinUser["secretToken"]},
      params: { 'fileName': filename,'imageType':type }
    };

  const fileTransfer: TransferObject = this.transfer.create();

      this.config.showLoading();
     console.log("fileTransfer.upload",targetPath, url, options);
      // Use the FileTransfer to upload the image
      fileTransfer.upload(targetPath, url, options).then(data => {
        //console.log(JSON.parse(data.response));
        let images = JSON.parse(data.response);
        if(type=="profile"){
          this.businessLogo = images.thumb;
           self.config.setLocalStore("profilePic",images.thumb);
        }else if(type=="back"){
          this.businessBack = images.thumb;
          self.config.setLocalStore("backgroundPic",images.thumb);
        }

        this.config.hideloading();
        this.config.showToast('Image succesful uploaded.');
      }, err => {
        this.config.hideloading();
        this.config.printLog('Error while uploading file.',err);
      });
  }

  save(data, isValid) {

    let self = this;
    self.config.showLoading();
    if (isValid) {
      let options = new File();
      self.config.printLog("Profile form data", data);
      let address = data.address1 + "+" + data.address2 + "+" + data.city + "+" + data.state + "+" + data.zip;
      address = address.replace(/\s/g, '');
      let profile = {
        "name": data.displayname,
        "username": data.username.replace("@",""),
        "email": data.email,
        "phonenumber": data.phonenumber,
        "profile_discrption": data.profiledescription,
        "address1": data.address1,
        "address2": data.address2,
        "city": data.city,
        "state": data.state,
        "zip": data.zip,
        "note": data.note,
        "website": data.website,
        "facebook": data.facebook,
        "twitter": data.twitter,
        "weekhours":this.workingHours,
        "instagram":data.instagram,
        "businessPhone":data.businessPhone
      }

      self.vendor.getGeoLocation(address).then((geoLocation) => {
        profile["latitude"] = geoLocation["results"][0].geometry.location.lat;
        profile["longitude"] = geoLocation["results"][0].geometry.location.lng;

        console.log("profile", profile);
        self.vendor.saveProfile(profile, self.loggedinUser["secretToken"]).then((response) => {
          console.log("saveProfile", response);
          self.loggedinUser['name']=data.displayname;
          self.config.setLocalStore('LoggedUser', self.loggedinUser);
          self.config.showToast(response);
          self.config.hideloading();
          //self.navCtrl.setRoot(StatisticsPage);
        }).catch((err) => {
          self.config.hideloading();
          self.config.printLog("", err);
        })
      }).catch((err) => {
        self.config.hideloading();
        self.config.showToast("Location not found, retry after changing your address");
        self.config.printLog("errrr", err);
      })

    }
  }
  goToPwdChng() {
    let myModal = this.modalCtrl.create(PasswordChangePage);
    myModal.present();
  }
  goToHours(){
    let weekhours;
    if(this.vandorProfile.weekhours!=null){
      weekhours=this.vandorProfile.weekhours;
    }
    else{
      weekhours=this.workingHours;
    }
    let self=this
    let myModal = this.modalCtrl.create(WorkingHoursPage,{"workingHours":weekhours});
    myModal.onDidDismiss((workingHours)=>{
      console.log("return",workingHours);
      self.workingHours=workingHours;
    })
    myModal.present();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }
  checkAt(event){
    if(event.target.value.substr(0,1)!='@'){
      event.target.value="@"+event.target.value;
      this.qupeyForm.get("username").setValue(event.target.value);
    }
    else{
      console.log("@ exists");
    }
  }
}

