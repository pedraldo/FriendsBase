import { DataProvider } from './../../../providers/data';
import { AuthenticationProvider } from '../../../providers/authentication';
import { GroupProvider } from '../../../providers/group';
import { NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';

@Component({
  templateUrl: 'group-invitation.html',
  selector: 'group-invitation',
})
export class GroupInvitationPage {
  public group: IPersistedGroup;
  public memberFound: any;
  public isMemberSearched = false;
  public isMemberFound = false;
  public emailSearched: string;
  public isMemberAdded = false;

  constructor(
    private NavParams: NavParams,
    private GroupProvider: GroupProvider,
    private AuthenticationProvider: AuthenticationProvider,
    private DataProvider: DataProvider,
    private NavController: NavController
  ) {
    this.group = this.NavParams.data;
  }

  ngOnInit(): void {

  }

  public getUserByEmail(): void {
    this.isMemberSearched = true;
    this.DataProvider.list('users').subscribe(users => {
      this.memberFound = users.find(user => {
        return (user.email === this.emailSearched);
      });
      this.isMemberFound = !!this.memberFound;
    });
  }

  public addUserToCurrentGroup(user: any) {
    this.GroupProvider.addUserToGroup(user.$key, this.group.$key).then(() => {
      this.isMemberAdded = true;
    });
  }
}
