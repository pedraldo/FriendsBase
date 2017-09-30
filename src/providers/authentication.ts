import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { Facebook } from 'ionic-native';
import firebase from 'firebase';

import { DataProvider } from './data';

@Injectable()
export class AuthenticationProvider {

    constructor(
        private AngularFire: AngularFire,
        private DataProvider: DataProvider,
        private Platform: Platform
    ) {

    }

    public getCurrentUserData(): Observable<any> {
      return Observable.create(observer => {
        this.AngularFire.auth.subscribe(authenticationData => {
            if (authenticationData) {
                this.DataProvider.object('users/' + authenticationData.uid).subscribe(userData => {
                    observer.next(userData);
                    observer.complete();
                });
            } else {
                observer.error();
            }
        })
      });
    }

    public getUserData(userId: string): Observable<any> {
      return Observable.create(observer => {
        this.DataProvider.object(`users/${userId}`).subscribe(userData => {
          if (userData) {
            observer.next(userData);
            observer.complete();
          } else {
            observer.error();
          }
        })
      });
    }

    public registerUser(credentials: any): Observable<any> {
        return Observable.create(observer => {
            this.AngularFire.auth.createUser(credentials).then(authenticationData => {
                this.AngularFire.database.list('users').update(authenticationData.uid, {
                    name: authenticationData.auth.email,
                    email: authenticationData.auth.email,
                    emailVerified: false,
                    provider: 'email',
                    image: null
                });
                credentials.created = true;
                observer.next(credentials);
            }).catch((error: any) => {
              if (error) {
                switch (error.code) {
                  case 'INVALID_EMAIL':
                    observer.error('E-mail invalide.');
                  break;
                  case 'EMAIL_TAKEN':
                    observer.error('Cet e-mail est déjà utilisé');
                  break;
                  case 'NETWORK_ERROR':
                    observer.error('Une erreur est survenue lors de la connexion au service. Veuillez réessayer plus tard.');
                  break;
                  default:
                    observer.error(error);
                }
              }
            });
        });
    }

    public loginWithEmail(credentials: any): Observable<any> {
        return Observable.create(observer => {
            this.AngularFire.auth.login(credentials, {
                provider: AuthProviders.Password,
                method: AuthMethods.Password
            }).then((authenticationData) => {
                observer.next(authenticationData);
            }).catch((error) => {
                observer.error(error);
            });
        })
    }

    public loginWithFacebook(): Observable<any> {
        return Observable.create(observer => {
            if (this.Platform.is('cordova')) {
                Facebook.login(['public_profile', 'email']).then(facebookData => {
                    let provider: firebase.auth.AuthCredential = firebase.auth.FacebookAuthProvider.credential(facebookData.authResponse.accessToken);
                    firebase.auth().signInWithCredential(provider).then((firebaseData) => {
                        this.AngularFire.database.list('users').update(firebaseData.uid, {
                            name: firebaseData.displayName,
                            email: firebaseData.email,
                            provider: 'facebook',
                            image: firebaseData.photoURL
                        });
                        observer.next(firebaseData);
                    });
                }).catch(error => {
                    observer.error(error);
                });
            } else {
                this.AngularFire.auth.login({
                    provider: AuthProviders.Facebook,
                    method: AuthMethods.Popup
                }).then(facebookData => {
                    this.AngularFire.database.list('users').update(facebookData.uid, {
                        name: facebookData.auth.displayName,
                        email: facebookData.auth.email,
                        provider: 'facebook',
                        image: facebookData.auth.photoURL
                    });
                    observer.next(facebookData.auth);
                }).catch(error => {
                    observer.error(error);
                });
            }
        });
    }

    public sendPasswordResetEmail(email: string): Observable<any> {
        return Observable.create(observer => {
            firebase.auth().sendPasswordResetEmail(email).then(() => {
                observer.next(email);
            }).catch(error => {
                observer.error(error);
            });
        })
    }

    public logout(): void {
        this.AngularFire.auth.logout();
    }
}
