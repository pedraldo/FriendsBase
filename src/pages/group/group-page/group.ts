import { AuthenticationProvider } from '../../../providers/authentication';
import { GroupProvider } from '../../../providers/group';
import { NavParams } from 'ionic-angular';
import { Component } from '@angular/core';

@Component({
  templateUrl: 'group.html',
  selector: 'group',
})
export class GroupPage {
  public group: IPersistedGroup;
  public groupUsers: any[];
  public currentUser: any;
  public isAtLeastGroupAdmin: boolean;

  constructor(
    private NavParams: NavParams,
    private GroupProvider: GroupProvider,
    private AuthenticationProvider: AuthenticationProvider
  ) {
    this.group = this.NavParams.data;
  }

  ngOnInit(): void {
    this.GroupProvider.getGroupUsers(this.group.$key).subscribe(groupUsers => {
      this.groupUsers = groupUsers;
    });
    this.AuthenticationProvider.getCurrentUserData().subscribe(currentUserData => {
      this.currentUser = currentUserData;
    });
    debugger;
    this.isAtLeastGroupAdmin = this.currentUser.$key === this.group.super_admin || this.group.admins.indexOf(this.currentUser.$key) > -1;
  }
}
