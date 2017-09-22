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
  public isMemberFound = false;

  constructor(
    private NavParams: NavParams,
    private GroupProvider: GroupProvider,
    private AuthenticationProvider: AuthenticationProvider,
    private NavController: NavController
  ) {
    this.group = this.NavParams.data;
  }

  ngOnInit(): void {

  }
}
