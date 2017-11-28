import { Storage } from '@ionic/storage';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';

import { HomePage } from '../pages/home/home'
import { AuthenticationPage } from '../pages/authentication/home/home'
import { GroupListPage } from '../pages/group/group-list/groups';
import { ProfilePage } from './../pages/profile/profile';
import { ListListPage } from './../pages/list/list-list/lists';

import { DataProvider } from '../providers/data';
import { AuthenticationProvider } from '../providers/authentication';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  public isAppInitialized: boolean = false;
  public user: any;

  pages: Array<{title: string, component: any}>;

  constructor(
    private platform: Platform,
    private Storage: Storage,
    protected DataProvider: DataProvider,
    protected AuthenticationProvider: AuthenticationProvider
  ) {
    this.user = {
      image: ''
    };

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Page One', component: Page1 },
      { title: 'Page Two', component: Page2 }
    ];

  }

  ngOnInit(): void {
    this.platform.ready().then(() => {
      this.AuthenticationProvider.getCurrentUserData().subscribe(user => {
        if (!this.isAppInitialized) {
          this.nav.setRoot(HomePage);
          this.isAppInitialized = true;
        }
        this.user = user;
      }, error => {
        this.nav.setRoot(AuthenticationPage);
      });
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  public openPage(page): void {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  public openGroupsPage(): void {
    this.nav.setRoot(GroupListPage);
  }

  public openListsPage(): void {
    this.Storage.get('currentUserId').then(currentUserId => this.nav.setRoot(ListListPage, [currentUserId, true]));
  }

  public openProfilePage(): void {
    this.Storage.get('currentUserId').then(currentUserId => this.nav.setRoot(ProfilePage, [currentUserId, true]));
  }

  public logout(): void {
  	this.AuthenticationProvider.logout();
    this.nav.setRoot(AuthenticationPage);
  }
}
