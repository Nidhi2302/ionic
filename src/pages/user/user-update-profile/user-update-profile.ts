import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ActionSheetController, Platform, ModalController, Events } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ConfigServiceProvider } from "../../../providers/config-service/config-service";
import { User } from "../../../models/user";
import { UserServiceProvider } from "../../../providers/user-service/user-service";
import { Camera } from "@ionic-native/camera";
import { Transfer, TransferObject } from "@ionic-native/transfer";
import { FilePath } from "@ionic-native/file-path";
import { File, FileEntry } from '@ionic-native/file';
import { PasswordChangePage } from "../../vendor/password-change/password-change";



/**
 * Generated class for the UserUpdateProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-update-profile',
  templateUrl: 'user-update-profile.html',
})
export class UserUpdateProfilePage {
    public qupeyForm: FormGroup;
  loggedinUser = {};
  businessBack = "assets/business-image/layer12.png";
  businessLogo = "assets/business-logo/user-default.png";
  lastImage;
  profileImage;
  backImage;
  vandorProfile;
  APP_URL = this.config.get('APP_URL');

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public config: ConfigServiceProvider,
    public menuCtrl: MenuController,
    private camera: Camera,
    public userService: UserServiceProvider,
    private transfer: Transfer, private file: File, private filePath: FilePath,
    public actionSheetCtrl: ActionSheetController, public platform: Platform,
    public modalCtrl: ModalController,
    private events: Events) {
      let self = this;
      self.qupeyForm = new FormGroup({
      displayname: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required,Validators.pattern("^[@]{1}[a-zA-Z0-9-_]{6,30}$")]),
      email: new FormControl(''),
      user_basic_information: new FormControl(''),
     });


    self.config.getLocalStore("LoggedUser").then((value) => {
      self.loggedinUser = new User(value);
      console.log("this.loggedinUser");
      console.log(self.loggedinUser);
       self.getProfile(self.loggedinUser["secretToken"]);

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
  previous(){
    this.navCtrl.pop();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad UserUpdateProfilePage');
  }
  goToPwdChng() {
    let myModal = this.modalCtrl.create(PasswordChangePage);
    myModal.present();
  }
   getProfile(token) {
    let self = this;
    self.userService.getProfile(token).then((response) => {
      console.log("response", response);
      this.vandorProfile=response;
      self.qupeyForm.get('displayname').setValue(response['name']);
      self.qupeyForm.get('username').setValue("@"+response['username']);
      self.qupeyForm.get('email').setValue(response['email']);
      self.qupeyForm.get('user_basic_information').setValue(response['user_basic_information']);

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
          self.businessLogo = images.thumb;
          console.log(self.businessLogo);
          self.loggedinUser['logo']=images.thumb;
          self.config.setLocalStore('LoggedUser', self.loggedinUser);
           self.config.setLocalStore("userProfilePic",images.thumb);
        }

        self.config.hideloading();
        self.config.showToast('Image succesful uploaded.');
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
        "user_basic_information": data.user_basic_information,

      }
     
        self.userService.saveProfile(profile, self.loggedinUser["secretToken"]).then((response) => {
          console.log("saveProfile", response);
          self.loggedinUser['name']=data.displayname;
          self.loggedinUser['user_basic_information']=data.user_basic_information;
          self.loggedinUser['username']=data.username.replace("@","");
          self.events.publish("updateProfile",profile);
          self.config.setLocalStore('LoggedUser', self.loggedinUser);
          self.config.showToast(response);
          self.config.hideloading();
          self.navCtrl.pop();
        }).catch((err) => {
          self.config.hideloading();
          self.config.printLog("", err);
        })


    }
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
