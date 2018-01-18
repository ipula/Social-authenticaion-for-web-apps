import { Component, ElementRef, AfterViewInit } from '@angular/core';
declare const gapi: any;
declare const FB: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  token: any;
  loged: boolean;

  private clientId: string = '653993884008-9t9sjrdra7to61fbm7uiajud4cuv79oj.apps.googleusercontent.com';

  private scope = [
    'profile',
    'email',
    'https://www.googleapis.com/auth/contacts.readonly',
    'https://www.googleapis.com/auth/admin.directory.user.readonly'
  ].join(' ');

  public auth2: any;
  public googleInit() {
    let that = this;
    gapi.load('auth2', function () {
      that.auth2 = gapi.auth2.init({
        client_id: that.clientId,
        apiKey: 'AIzaSyAoE213N7EOg6dTX9cvgaKvKTHHvaT32DQ',
        cookiepolicy: 'single_host_origin',
        approvalprompt: 'force'
      });
      that.attachSignin(that.element.nativeElement.firstChild);
    });
  }
  public attachSignin(element) {
    let that = this;
    this.auth2.attachClickHandler(element, {},
      function (googleUser) {

        let profile = googleUser.getBasicProfile();
        console.log('Token || ' + googleUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        //YOUR CODE HERE
        let id_token = googleUser.getAuthResponse().id_token;
        console.log("ID Token: " + id_token);


      }, function (error) {
        console.log(JSON.stringify(error, undefined, 2));
      });
  }

  constructor(private element: ElementRef) {
    console.log('ElementRef: ', this.element);
    FB.init({
      appId: '1993391787343241',
      status: true,
      cookie: true,
      xfbml: true,
      version: 'v2.8'
    });
  }
  onFacebookLoginClick() {
    FB.login((result: any) => {
      this.loged = true;
      this.token = result;
    }, { scope: 'user_friends' });
  }

  statusChangeCallback(resp) {
    console.log("sdfsdf",resp);
    if (resp.status === 'connected') {
      this.me();
      // connect here with your server for facebook login by passing access token given by facebook
    } else if (resp.status === 'not_authorized') {

    } else {

    }
  };
  me() {
    FB.api('/me?fields=id,name,first_name,gender,picture.width(150).height(150),age_range,friends',
        function(result) {
            if (result && !result.error) {
                this.user = result;
                console.log(this.user);
            } else {
                console.log(result.error);
            }
        });
}

  ngAfterViewInit() {
    this.googleInit();
    FB.getLoginStatus(response => {
      this.statusChangeCallback(response);
    });
  }
}
