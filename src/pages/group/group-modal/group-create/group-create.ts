import { AuthenticationProvider } from './../../../../providers/authentication';
import { Platform, ViewController } from 'ionic-angular';
import { GroupProvider } from '../../../../providers/group';
import { Component } from '@angular/core';

@Component({
  templateUrl: 'group-create.html'
})
export class GroupCreateModalPage {
  private currentUser: any;
  public group: IGroup;

  constructor(
    private GroupProvider: GroupProvider,
    private AuthenticationProvider: AuthenticationProvider,
    public Platform: Platform,
    public ViewController: ViewController
  ) {
    this.group = {
      name: '',
      description: '',
      users: {},
      super_admin: '',
      admins: [],
      join_requests: [],
      join_invitations: []
    };
  }

  ngOnInit(): void {
    this.AuthenticationProvider.getCurrentUserData().subscribe(currentUserData => {
      this.currentUser = currentUserData;
    });
  }

  public createGroup(): void {
    this.GroupProvider.createGroup(this.group, this.currentUser.$key);
    this.dismiss();
  }

  public dismiss(): void {
    this.ViewController.dismiss();
  }
}
