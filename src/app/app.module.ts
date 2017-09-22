import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AngularFireModule } from 'angularfire2';

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
import { GroupCreateModalPage } from '../pages/group/group-modal/group-create';
import { GroupSearchPage } from '../pages/group/group-search/group-search';
import { GroupInvitationPage } from '../pages/group/group-invitation/group-invitation';

// providers
import { AuthenticationProvider } from '../providers/authentication';
import { DataProvider } from '../providers/data';
import { GroupProvider } from '../providers/group';

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
    GroupInvitationPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
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
    GroupInvitationPage
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    DataProvider,
    AuthenticationProvider,
    GroupProvider
  ]
})
export class AppModule {}
