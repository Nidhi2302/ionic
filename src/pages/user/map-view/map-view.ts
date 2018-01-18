import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { UserServiceProvider } from "../../../providers/user-service/user-service";
import { ConfigServiceProvider } from "../../../providers/config-service/config-service";
import { Geolocation } from '@ionic-native/geolocation';
import { User } from "../../../models/user";
import { StoreDetailPage } from "../store-detail/store-detail";
declare var google: any;
/**
 * Generated class for the MapViewPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@Component({
    selector: 'page-map-view',
    templateUrl: 'map-view.html',
})
export class MapViewPage implements OnInit {
    address: any = {
        place: '',
        set: false,
    };
    placesService: any;
    map: any;
    markers = [];
    placedetails: any;
    autocompleteItems: any;
    autocomplete: any;
    acService: any;
    isLocationAvl = true
    vendorList
    loggedinUser
    infoWindow
    isListErr = true
    constructor(public navCtrl: NavController,
        public userService: UserServiceProvider,
        public config: ConfigServiceProvider,
        private geolocation: Geolocation,
        public platform: Platform) {
    }

    ngOnInit() {
        this.initMap();
        this.initPlacedetails();
        this.infoWindow = new google.maps.InfoWindow();
        console.log(new google.maps.places.AutocompleteService());
        this.acService = new google.maps.places.AutocompleteService();
        this.autocompleteItems = [];
        this.autocomplete = {
            query: '',
        };
    }



    private getPlaceDetail(place_id: string): void {
        var self = this;
        var request = {
            placeId: place_id
        };
        this.placesService = new google.maps.places.PlacesService(this.map);
        this.placesService.getDetails(request, callback);
        function callback(place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {

                self.map.setCenter(place.geometry.location);

                console.log('page > getPlaceDetail > details > ', self.placedetails);
            } else {
                console.log('page > getPlaceDetail > status > ', status);
            }
        }
    }

    private initMap() {
        let self = this
        this.config.showLoading();
        this.config.getLocalStore("LoggedUser").then((value) => {
            self.loggedinUser = new User(value);
            console.log("this.loggedinUser");
            console.log(self.loggedinUser);
            self.geolocation.getCurrentPosition().then((resp) => {
                self.isLocationAvl = true;
                self.config.printLog("current position :", resp);
                let location = {
                    "longitude": resp.coords.longitude,
                    "latitude": resp.coords.latitude,
                    "start": 1
                }
                self.userService.getNearByVendor(location, self.loggedinUser["secretToken"]).then((list: any) => {
                    self.config.printLog("vendor listhh", list);
                    if (list.length > 0) {
                        list.sort((a: any, b: any) => {
                            if (a.distance.calculated < b.distance.calculated) {
                                //a is the Object and args is the orderBy condition (data.likes.count in this case)
                                return -1;
                            } else if (a.distance.calculated > b.distance.calculated) {
                                return 1;
                            } else {
                                return 0;
                            }
                        });
                        self.vendorList = list;
                        var point = { lat: self.vendorList[0].distance.location[1], lng: self.vendorList[0].distance.location[0] };
                        let divMap = (<HTMLInputElement>document.getElementById('map'));
                        self.map = new google.maps.Map(divMap, {
                            center: point,
                            zoom: 15,
                            mapTypeId: google.maps.MapTypeId.ROADMAP,
                            disableDefaultUI: true,
                            draggable: true,
                            zoomControl: true
                        });
                        self.vendorList.forEach((item) => {
                            let loc = { lat: item.distance.location[1], lng: item.distance.location[0] };
                            let logo = 'assets/business-logo/user-default.png';
                            if (item.logo_url) {
                                logo = item.logo_url
                            }

                            let content = "<div id='info'>" +
                                "<img class='logo' src ='" + logo + "'/>" +
                                "<div class='title2'>" + item.vendorname + "</div>" +
                                "<div class='ad1'>" + item.address1 + "</div>" +
                                "<div class='ad1'>" + item.address2 + "</div>" +
                                "</div>" +
                                "<button class='dir-btn' id='openMap'>Directions</button>";
                            self.createMapMarker(loc, item, content);
                        })

                        self.config.hideloading();
                    }
                    else {
                        self.config.hideloading();
                    }

                }).catch((err) => {
                    self.config.printLog("vendor list", Object.keys(self.vendorList).length);
                    self.config.hideloading();
                    self.isListErr = false;
                    self.config.printLog("hh", err);
                })
            }, err => {
                self.isLocationAvl = false;
                self.config.hideloading();
                console.log('Error getting location', err);
            }).catch((error) => {
                self.isLocationAvl = false;
                self.config.hideloading();
                console.log('Error getting location', error);
            });
        }, err => {
            self.isLocationAvl = false;
            self.config.hideloading();
            console.log('Error getting location', err);
        }).catch((error) => {
            self.isLocationAvl = false;
            self.config.hideloading();
            console.log('Error getting user', error);
        });

    }
    private addInfoWindow(marker, item, place, content) {
        let self = this;
        google.maps.event.addListener(marker, 'click', () => {
            this.infoWindow.setContent(content);
            this.infoWindow.open(this.map, marker);
            let listener1 = google.maps.event.addListener(this.infoWindow, 'domready', function () {
                let direction = (<HTMLInputElement>document.getElementById('openMap'));
                direction.addEventListener('click', () => {
                    console.log("direction click");
                    self.openMap(place);
                })
                let info = document.getElementById('info');
                info.removeEventListener('click');
                info.addEventListener('click', () => {

                    console.log("infowindow click");
                    let state = {
                        isFollow: item.status == "Follow",
                        isFav: item.like
                    }
                    item["state"] = state;
                    self.navCtrl.push(StoreDetailPage, { "storeDetails": item });

                })
                google.maps.event.removeListener(listener1);
            });
        });


    }
    private createMapMarker(place: any, item, content: any): void {
        var marker = new google.maps.Marker({
            map: this.map,
            position: place,
            icon: 'assets/MapPin/shape8.png',
            // animation: google.maps.Animation.DROP, 
        });
        this.markers.push(marker);
        this.addInfoWindow(marker, item, place, content);
    }

    private initPlacedetails() {
        this.placedetails = {
            address: '',
            lat: '',
            lng: '',
            components: {
                route: { set: false, short: '', long: '' },                           // calle 
                street_number: { set: false, short: '', long: '' },                   // numero
                sublocality_level_1: { set: false, short: '', long: '' },             // barrio
                locality: { set: false, short: '', long: '' },                        // localidad, ciudad
                administrative_area_level_2: { set: false, short: '', long: '' },     // zona/comuna/partido 
                administrative_area_level_1: { set: false, short: '', long: '' },     // estado/provincia 
                country: { set: false, short: '', long: '' },                         // pais
                postal_code: { set: false, short: '', long: '' },                     // codigo postal
                postal_code_suffix: { set: false, short: '', long: '' },              // codigo postal - sufijo
            }
        };
    }

    openMap(place) {
        this.geolocation.getCurrentPosition().then((position) => {
            // ios
            if (this.platform.is('ios')) {
                console.log("platform ios");
                window.open('maps://?q=' + name + '&saddr=' + position.coords.latitude + ',' + position.coords.longitude + '&daddr=' + place.lat + ',' + place.lng, '_system');
            };
            // android
            if (this.platform.is('android')) {
                window.open('geo://' + position.coords.latitude + ',' + position.coords.longitude + '?q=' + place.lat + ',' + place.lng + '(' + name + ')', '_system');
            };
        });

    }
    updateSearch() {

        console.log('modal > updateSearch');
        if (this.address.place == '') {
            this.autocompleteItems = [];
            this.address.set = false;
            return;
        }
        let self = this;
        let config = {
            types: ['geocode'], // other types available in the API: 'establishment', 'regions', and 'cities'
            input: this.address.place,
            componentRestrictions: {}
        }
        this.acService.getPlacePredictions(config, function (predictions, status) {
            console.log('modal > getPlacePredictions > status > ', status);
            self.autocompleteItems = [];
            predictions.forEach(function (prediction) {
                self.autocompleteItems.push(prediction);
            });
            if (self.autocompleteItems.length != 0) {
                self.address.set = true;
            }

        });
    }
    chooseItem(item: any) {
        this.address.place = item.description;
        this.address.set = false;
        this.getPlaceDetail(item.place_id);

    }
}
