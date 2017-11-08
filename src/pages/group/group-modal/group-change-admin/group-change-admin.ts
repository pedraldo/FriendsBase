import { AuthenticationProvider } from './../../../../providers/authentication';
import { AlertController, NavParams, Platform, ViewController } from 'ionic-angular';
import { GroupProvider } from '../../../../providers/group';
import { Component } from '@angular/core';

@Component({
  templateUrl: 'group-change-admin.html'
})
export class GroupChangeAdminModalPage {
  private currentUser: any;
  public group: IPersistedGroup;
  public groupUsers: IPersistedGroup[];
  public idMemberChosen: string;

  constructor(
    private GroupProvider: GroupProvider,
    private AuthenticationProvider: AuthenticationProvider,
    private AlertController: AlertController,
    private NavParams: NavParams,
    private ViewController: ViewController,
    public Platform: Platform,
  ) {
    this.group = this.NavParams.data.group;
  }

  ngOnInit(): void {
    this.AuthenticationProvider.getCurrentUserData().subscribe(currentUserData => {
      this.currentUser = currentUserData;
      this.groupUsers = this.NavParams.data.groupUsers.filter(user => user.$key !== this.currentUser.$key);
    });
    // TEST DU FILTRE SUR OBSERVABLE ==> Checker la doc de RxJS
    // this.GroupProvider.getGroupUsers(this.group.$key).filter<IPersistedGroup, IPersistedGroup>(groupUser => groupUser.$key !== this.group.super_admin).subscribe(groupUsers => {

    // });
  }

  public changeGroupSuperAdmin(): void {
    const newAdminChosen = this.groupUsers.find(user => user.$key === this.idMemberChosen)
    this.AlertController.create({
      title: 'Confirmez le choix du nouvel admin ?',
      message: `Etes vous sûr de vouloir désigner ${newAdminChosen.name} comme administrateur du groupe ${this.group.name} ?`,
      buttons: [
        {
          text: 'Oui',
          handler: () => {
            this.GroupProvider.updateGroupSuperAdmin(this.group.$key, newAdminChosen.$key);
            this.dismiss();
          }
        },
        {
          text: 'Non',
          role: 'cancel'
        }
      ]
    }).present();
  }

  public dismiss(): void {
    this.ViewController.dismiss();
  }
}
