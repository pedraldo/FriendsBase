import { GroupInvitationPage } from '../group-invitation/group-invitation';
import { AuthenticationProvider } from '../../../providers/authentication';
import { GroupProvider } from '../../../providers/group';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';

@Component({
  templateUrl: 'group.html',
  selector: 'group',
})
export class GroupPage {
  public group: IPersistedGroup;
  public groupUsers: any[];
  public currentUser: any;
  public currentUserId = '';
  public isAtLeastGroupAdmin = false;
  public areGroupUsersLoaded = false;

  constructor(
    private NavParams: NavParams,
    private GroupProvider: GroupProvider,
    private AuthenticationProvider: AuthenticationProvider,
    private NavController: NavController,
    private AlertController: AlertController
  ) {
    this.group = this.NavParams.data;
  }

  ngOnInit(): void {
    this.GroupProvider.getGroupUsers(this.group.$key).subscribe(groupUsers => {
      this.groupUsers = groupUsers;
      this.areGroupUsersLoaded = true;
      this.AuthenticationProvider.getCurrentUserData().subscribe(currentUserData => {
        this.currentUser = currentUserData;
        this.currentUserId = currentUserData.$key;
        this.isAtLeastGroupAdmin = this.currentUser.$key === this.group.super_admin;// || this.group.admins.indexOf(this.currentUser.$key) > -1;
      });
    });
  }

  public openGroupInvitationPage(group: IGroup): void {
    this.NavController.push(GroupInvitationPage, group);
  }

  public removeMemberFromCurrentGroup(user: any, group: IPersistedGroup) {
    this.AlertController.create({
      title: 'Supprimer un membre du groupe ?',
      message: `Etes vous sûr de vouloir retirer ${user.name} du groupe ${group.name} ?`,
      buttons: [
        {
          text: 'Oui',
          handler: () => {
            this.GroupProvider.removeMemberFromGroup(user.$key, group.$key);
          }
        },
        {
          text: 'Non',
          role: 'cancel'
        }
      ]
    }).present();
    // this.GroupProvider.removeMemberFromGroup(user.$key, group.$key);
  }
}
