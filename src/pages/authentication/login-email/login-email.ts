import { HomePage } from '../../home/home';
import { SignUpPage } from '../sign-up/sign-up';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { Component } from '@angular/core';
import { AuthenticationProvider } from '../../../providers/authentication';


@Component({
    templateUrl: 'login-email.html',
    selector: 'login-email',
})

export class LoginEmailPage {
    public error: any;
    public form: any;

    constructor(
        private NavController: NavController,
        private AuthenticationProvider: AuthenticationProvider,
        private LoadingController: LoadingController,
        private ToastController: ToastController
    ) {
        this.form = {
            email: '',
            password: ''
        };
    }

    public openForgotPasswordPage(): void {
        this.NavController.push(ForgotPasswordPage);
    }

    public openSignUpPage(): void {
        this.NavController.push(SignUpPage);
    }

    public login(): void {
        let loading = this.LoadingController.create({
            content: 'Chargement ...'
        });
        loading.present();

        this.AuthenticationProvider.loginWithEmail(this.form).subscribe(data => {
            loading.dismiss();
            this.NavController.push(HomePage);
        }, error => {
            loading.dismiss();
            this.error = error;
            this.ToastController.create({
              message: this.error,
              position: "bottom",
              showCloseButton: true,
              closeButtonText: "OK"
            }).present();
        });
    }
}
