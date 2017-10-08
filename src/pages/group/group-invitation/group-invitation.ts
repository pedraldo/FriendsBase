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
  public emailSearched: string;
  public isMemberSearched = false;
  public isMemberFound = false;
  public isMemberAdded = false;
  public isSearchInProgress = false;
  public isAddingInProgress = false;

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
    this.isSearchInProgress = true;
    this.DataProvider.list('users').subscribe(users => {
      this.memberFound = users.find(user => {
        return (user.email === this.emailSearched);
      });
      this.isMemberFound = !!this.memberFound;
      if (this.isMemberFound) {
        this.isMemberAdded = (this.group.users[this.memberFound.$key]);
      }
      this.isSearchInProgress = false;
    });
  }

  public addUserToCurrentGroup(user: any) {
    this.isAddingInProgress = true;
    this.GroupProvider.addUserToGroup(user.$key, this.group.$key).then(() => {
      this.isMemberAdded = true;
      this.isAddingInProgress = false;
    });
  }
}
