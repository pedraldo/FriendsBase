import { GroupChangeAdminModalPage } from '../group-modal/group-change-admin/group-change-admin';
import { GroupInvitationPage } from '../group-invitation/group-invitation';
import { AuthenticationProvider } from '../../../providers/authentication';
import { GroupProvider } from '../../../providers/group';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
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
  public isSuperAdmin = false;
  public areGroupUsersLoaded = false;

  private isRemovingCurrentUserFromGroup = false;

  constructor(
    private NavParams: NavParams,
    private GroupProvider: GroupProvider,
    private AuthenticationProvider: AuthenticationProvider,
    private NavController: NavController,
    private AlertController: AlertController,
    private ModalController: ModalController
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
        this.isSuperAdmin = this.currentUser.$key === this.group.super_admin; // || this.group.admins.indexOf(this.currentUser.$key) > -1;
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

  public leaveGroup(): void {
    let messageComplement = '';
    if (this.isSuperAdmin && this.groupUsers.length > 1) {
      messageComplement = "Vous êtes l'administrateur de ce groupe, si vous décidez de le quitter, vous devrez désigner un nouvel administrateur parmis les membres du groupe.";
    }
    this.AlertController.create({
      title: 'Quitter le groupe  ?',
      message: `Etes vous sûr de vouloir quitter le groupe ${this.group.name} ? ${messageComplement}`,
      buttons: [
        {
          text: 'Oui',
          handler: () => {
            if (messageComplement.length > 0) {
              this.isRemovingCurrentUserFromGroup = true;
              this.changeGroupSuperAdmin();
            } else {
              this.GroupProvider.removeMemberFromGroup(this.currentUserId, this.group.$key);
            }
          }
        },
        {
          text: 'Non',
          role: 'cancel'
        }
      ]
    }).present();
  }

  public changeGroupSuperAdmin(): void {
    let modal = this.ModalController.create(GroupChangeAdminModalPage, { group: this.group, groupUsers: this.groupUsers });
    modal.present();
    modal.onDidDismiss(newAdminId => {
      if (!!newAdminId) {
        this.group.super_admin = newAdminId;
        this.isSuperAdmin = this.currentUser.$key === this.group.super_admin;
        if (this.isRemovingCurrentUserFromGroup) {
          this.GroupProvider.removeMemberFromGroup(this.currentUserId, this.group.$key);
        }
      }
    })
  }
}
