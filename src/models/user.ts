export class User {
    logo = "";
    background_image = "";
    _id = "";
    name = "";
    email = "";
    phonenumber = "";
    username = "";
    type = "";
    facebookid = "";
    gmailid = "";
    verified
    isBlocked
    stripeCustomerId = "";
    createdAt
    lastLoggedin
    secretToken = "";
    deviceToken
    isSubscribe
    expiryDate;
    user_basic_information="";
    newQupeyNotify
    expQupeyNotify
    redemptionNotify
    newBusinessNotify
    constructor(public userData: any) {
       this._id = this.getValue('_id',userData);
     //console.log("userData",userData);
        this.name = this.getValue('name',userData);
        this.email = this.getValue('email',userData);
        this.phonenumber = this.getValue('phonenumber',userData);
        this.username =this.getValue('username',userData);
        this.type = this.getValue('type',userData);
        this.facebookid = this.getValue('facebookid',userData);
        this.gmailid =this.getValue('gmailid',userData);
        this.verified = this.getValue('verified',userData);
        this.isBlocked = this.getValue('isBlocked',userData);
        this.stripeCustomerId =this.getValue('stripeCustomerId',userData);
        this.createdAt = this.getValue('createdAt',userData);
        this.isSubscribe =this.getValue('isSubscribe',userData);
        this.lastLoggedin = this.getValue('lastLoggedin',userData);
        this.secretToken = this.getValue('secretToken',userData);
        this.deviceToken=this.getValue('secretToken',userData);
        this.user_basic_information = this.getValue('user_basic_information', userData);
        this.newQupeyNotify = this.getValue('newQupeyNotify', userData);
        this.expQupeyNotify = this.getValue('expQupeyNotify', userData);
        this.redemptionNotify = this.getValue('redemptionNotify', userData);
        this.newBusinessNotify = this.getValue('newBusinessNotify', userData);
        this.expiryDate=this.getValue('expiryDate',userData);
        this.logo = this.getValue('logo',userData);
        this.background_image = this.getValue('background_image',userData);
    }
     getValue(key, dic) {
        if (key in dic) {
            return dic[key];
        }
        else
            return ""
    }
}
