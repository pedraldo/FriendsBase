import { LoadingController, ToastController } from 'ionic-angular';
import { Component } from '@angular/core';
import { AuthenticationProvider } from '../../../providers/authentication';


@Component({
    templateUrl: 'forgot-password.html',
    selector: 'forgot-password',
})

export class ForgotPasswordPage {
    public error: any;
    public form: any;

    constructor(
        private LoadingController: LoadingController,
        private AuthenticationProvider: AuthenticationProvider,
        private ToastController: ToastController
    ) {
        this.form = {
            email: ''
        }
    }

    public reset(): void {
        let loading = this.LoadingController.create({
            content: 'Chargement ...'
        });
        loading.present();

        this.AuthenticationProvider.sendPasswordResetEmail(this.form.email).subscribe(data => {
            this.error = 'Vous allez bientôt recevoir un email pour changer de mot de passe';
            loading.dismiss();
        }, error => {
            this.error = error;
            loading.dismiss();

            this.ToastController.create({
              message: this.error,
              position: "bottom",
              showCloseButton: true,
              closeButtonText: "OK"
            }).present();
        });
    }
}
