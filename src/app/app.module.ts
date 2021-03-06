import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { IonicStorageModule } from '@ionic/storage';

// Pages
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { AuthenticationPage } from '../pages/authentication/home/home';
import { ForgotPasswordPage } from '../pages/authentication/forgot-password/forgot-password';
import { LoginEmailPage } from '../pages/authentication/login-email/login-email';
import { SignUpPage } from '../pages/authentication/sign-up/sign-up';
import { HomePage } from '../pages/home/home';
import { GroupPage } from '../pages/group/group-page/group';
import { GroupListPage } from '../pages/group/group-list/groups';
import { GroupCreateModalPage } from '../pages/group/group-modal/group-create/group-create';
import { GroupSearchPage } from '../pages/group/group-search/group-search';
import { GroupInvitationPage } from '../pages/group/group-invitation/group-invitation';
import { GroupChangeAdminModalPage } from '../pages/group/group-modal/group-change-admin/group-change-admin';
import { ProfilePage } from './../pages/profile/profile';
import { ListListPage } from './../pages/list/list-list/lists';
import { RelationshipPage } from './../pages/relationship/relationship';

// providers
import { AuthenticationProvider } from '../providers/authentication';
import { DataProvider } from '../providers/data';
import { GroupProvider } from '../providers/group';
import { RelationshipProvider } from './../providers/relationship';

export const firebaseConfig = {
  apiKey: 'AIzaSyDUNhm1qZ_dSXlA0-TO7rkWQCX6m86XRzM',
  authDomain: 'friendsbase-e0427.firebaseapp.com',
  databaseURL: 'https://friendsbase-e0427.firebaseio.com',
  storageBucket: 'friendsbase-e0427.appspot.com',
};

@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    AuthenticationPage,
    ForgotPasswordPage,
    LoginEmailPage,
    SignUpPage,
    HomePage,
    GroupListPage,
    GroupPage,
    GroupCreateModalPage,
    GroupSearchPage,
    GroupInvitationPage,
    GroupChangeAdminModalPage,
    ProfilePage,
    ListListPage,
    RelationshipPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    AuthenticationPage,
    ForgotPasswordPage,
    LoginEmailPage,
    SignUpPage,
    HomePage,
    GroupListPage,
    GroupPage,
    GroupCreateModalPage,
    GroupSearchPage,
    GroupInvitationPage,
    GroupChangeAdminModalPage,
    ProfilePage,
    ListListPage,
    RelationshipPage
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    DataProvider,
    AuthenticationProvider,
    GroupProvider,
    RelationshipProvider
  ]
})
export class AppModule {}
