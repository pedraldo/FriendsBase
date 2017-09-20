import { HomePage } from '../../home/home';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { Component } from '@angular/core';
import { AuthenticationProvider } from '../../../providers/authentication';
import { LoginEmailPage } from '../login-email/login-email';


@Component({
    templateUrl: 'sign-up.html',
    selector: 'sign-up',
})

export class SignUpPage {
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

  public openLoginPage(): void {
    this.NavController.push(LoginEmailPage);
  }

  public register(): void {
    let loading = this.LoadingController.create({
      content: 'Chargement ...'
    });
    this.AuthenticationProvider.registerUser(this.form).subscribe(registerData => {
      this.AuthenticationProvider.loginWithEmail(registerData).subscribe(loginData => {
        loading.dismiss();
        this.NavController.setRoot(HomePage);
      }, loginError => {
        loading.dismiss();
        this.error = loginError;
      });
    }, registerError => {
      loading.dismiss();
      this.error = registerError;
      this.ToastController.create({
        message: this.error,
        position: "bottom",
        showCloseButton: true,
        closeButtonText: "OK"
      }).present();
    })
  }
}
