import { Storage } from '@ionic/storage';
import { HomePage } from '../../home/home';
import { LoginEmailPage } from '../login-email/login-email';
import { SignUpPage } from '../sign-up/sign-up';
import { NavController, ToastController } from 'ionic-angular';
import { Component } from '@angular/core';
import { AuthenticationProvider } from '../../../providers/authentication';


@Component({
    templateUrl: 'home.html',
    selector: 'auth-home',
})

export class AuthenticationPage {
    private error: any;

    constructor(
        private NavController: NavController,
        private AuthenticationProvider: AuthenticationProvider,
        private ToastController: ToastController,
        private Storage: Storage
    ) {

    }

    ngOnInit(): void {

    }

    public openSignUpPage(): void {
        this.NavController.push(SignUpPage);
    }

    public openLoginPage(): void {
        this.NavController.push(LoginEmailPage);
    }

    public loginUserWithFacebook(): void {
        this.AuthenticationProvider.loginWithFacebook().subscribe(data => {
            this.Storage.set('currentUserId', data.uid);
            this.NavController.setRoot(HomePage);
        }, error => {
            this.error = error;

            this.ToastController.create({
              message: this.error,
              position: "bottom",
              showCloseButton: true,
              closeButtonText: "OK"
            }).present();
        })
    }
}
