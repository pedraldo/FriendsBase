import { GroupChangeAdminModalPage } from '../group-modal/group-change-admin/group-change-admin';
import { GroupInvitationPage } from '../group-invitation/group-invitation';
import { AuthenticationProvider } from '../../../providers/authentication';
import { GroupProvider } from '../../../providers/group';
import { NavController, NavParams, AlertController, ModalController, ToastController } from 'ionic-angular';
import { Component } from '@angular/core';

@Component({
  templateUrl: 'group.html',
  selector: 'group',
})
export class GroupPage {
  public group: IPersistedGroup;
  public groupUsers: any[];
  public joinRequestUsers: any[] = [];
  public currentUser: any;
  public superAdminUser: any;
  public currentUserId = '';
  public isCurrentUserSuperAdmin = false;
  public isCurrentUserMemberOfGroup = false;
  public areGroupUsersLoaded = false;
  public hasCurrentUserAlreadyMadeJoinRequest = false;

  private isRemovingCurrentUserFromGroup = false;

  constructor(
    private NavParams: NavParams,
    private GroupProvider: GroupProvider,
    private AuthenticationProvider: AuthenticationProvider,
    private NavController: NavController,
    private AlertController: AlertController,
    private ModalController: ModalController,
    private ToastController: ToastController
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
        this.isCurrentUserMemberOfGroup = !!this.groupUsers.find(groupUser => groupUser.$key === this.currentUserId);
        this.isCurrentUserSuperAdmin = this.isCurrentUserMemberOfGroup ? this.currentUser.$key === this.group.super_admin : false; // || this.group.admins.indexOf(this.currentUser.$key) > -1;
        this.superAdminUser = !this.isCurrentUserSuperAdmin ? this.groupUsers.find(groupUser => groupUser.$key === this.group.super_admin) : this.currentUser;
      
        this.GroupProvider.getGroupJoinRequestsUsers(this.group.$key).subscribe(joinRequestUsers => {
          this.joinRequestUsers = joinRequestUsers;
          this.hasCurrentUserAlreadyMadeJoinRequest = !!this.joinRequestUsers.find(joinRequestUser => joinRequestUser.$key === this.currentUserId);
        });
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
  }

  public leaveGroup(): void {
    let messageComplement = '';
    if (this.isCurrentUserSuperAdmin && this.groupUsers.length > 1) {
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
        this.isCurrentUserSuperAdmin = this.currentUser.$key === this.group.super_admin;
        if (this.isRemovingCurrentUserFromGroup) {
          this.GroupProvider.removeMemberFromGroup(this.currentUserId, this.group.$key);
        }
      }
    })
  }

  public sendGroupJoinRequest(): void {
    this.hasCurrentUserAlreadyMadeJoinRequest = true;
    if (!this.isCurrentUserMemberOfGroup) {
      this.GroupProvider.createNewGroupJoinRequest(this.group.$key, this.currentUserId)
    }
  }

  public acceptJoinRequest(userId: string, userName: string): void {
    this.joinRequestUsers = this.joinRequestUsers.filter(joinRequestUser => joinRequestUser.$key !== userId);
    this.GroupProvider.removeGroupJoinRequest(this.group.$key, userId);
    this.GroupProvider.addUserToGroup(userId, this.group.$key).then(() => {
      let toast = this.ToastController.create({
        message: `${userName} vient d'être ajouté au groupe ${this.group.name}.`,
        duration: 4000
      });
      toast.present();
    });
  }

  public refuseJoinRequest(userId: string, userName: string): void {
    this.joinRequestUsers = this.joinRequestUsers.filter(joinRequestUser => joinRequestUser.$key !== userId);
    this.GroupProvider.removeGroupJoinRequest(this.group.$key, userId);
    let toast = this.ToastController.create({
      message: `La demande d'intégration de ${userName} au groupe ${this.group.name} vient d'être refusée.`,
      duration: 4000
    });
    toast.present();
  }
}
