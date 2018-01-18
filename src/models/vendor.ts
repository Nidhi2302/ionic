export class Vendor {

    id = "";
    name = "";
    email = "";
    phonenumber = "";
    username = "";
    type = "";
    vendor_id ="";
    profile_discrption="";
    address1="";
    address2="";
    city="";
    state="";
    zip="";
    note="";
    weekhours = [];
    website="";
    twitter="";
    facebook="";
    instagram="";
    businessPhone="";
    constructor(public vedorData: any) {
       // this.id = this.getValue('_id',vedorData);

        this.id = this.getValue('_id',vedorData);
        this.name = this.getValue('name',vedorData);
        this.email = this.getValue('email',vedorData);
        this.phonenumber = this.getValue('phonenumber',vedorData);
        this.username =this.getValue('username',vedorData);
        this.type = this.getValue('type',vedorData);
        this.vendor_id = this.getValue('vendor_id',vedorData);
        this.profile_discrption =this.getValue('profile_discrption',vedorData);
        this.address1 = this.getValue('address1',vedorData);
        this.address2 = this.getValue('address2',vedorData);
        this.city =this.getValue('city',vedorData);
        this.state = this.getValue('state',vedorData);
        this.zip =this.getValue('zip',vedorData);
        this.note = this.getValue('note',vedorData);
        this.weekhours = this.getValue('weekhours',vedorData);
        this.website=this.getValue('website',vedorData);
        this.facebook=this.getValue('facebook',vedorData);
        this.twitter=this.getValue('twitter',vedorData);
        this.instagram=this.getValue('instagram',vedorData);
        this.businessPhone=this.getValue('businessPhone',vedorData);

    }
     getValue(key, dic) {
        if (key in dic) {
            return dic[key];
        }
        else
            return ""
    }
}
