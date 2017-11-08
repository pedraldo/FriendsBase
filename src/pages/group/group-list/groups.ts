import { GroupSearchPage } from '../group-search/group-search';
import { GroupPage } from '../group-page/group';
import { GroupCreateModalPage } from '../group-modal/group-create/group-create';
import { Loading, LoadingController, ModalController, NavController } from 'ionic-angular';
import { GroupProvider } from '../../../providers/group';
import { AuthenticationProvider } from '../../../providers/authentication';
import { Component } from '@angular/core';

@Component({
  templateUrl: 'groups.html',
  selector: 'groups',
})
export class GroupListPage {
  public groups: IGroup[];
  public currentUser: any;
  public loader: Loading

  constructor(
    private AuthenticationProvider: AuthenticationProvider,
    private GroupProvider: GroupProvider,
    private ModalController: ModalController,
    private NavController: NavController,
    private LoadingController: LoadingController
  ) {
    this.loader = this.LoadingController.create({
      spinner: 'crescent'
    });
    this.loader.present();
    this.groups = [];
    this.AuthenticationProvider.getCurrentUserData().subscribe(currentUserData => {
      this.currentUser = currentUserData;
      this.getCurrentUserGroups();
    });
  }

  public getCurrentUserGroups(): void {
    this.GroupProvider.getUserGroups(this.currentUser.$key).subscribe(currentUserGroups => {
      this.groups = currentUserGroups;
      this.loader.dismiss();
    });
  }

  public openNewGroupModal(): void {
    let modal = this.ModalController.create(GroupCreateModalPage);
    modal.present();
  }

  public openGroupPage(group: IGroup): void {
    this.NavController.push(GroupPage, group);
  }

  public openGroupSearchPage(): void {
    this.NavController.push(GroupSearchPage);
  }
}
