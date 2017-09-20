import { Platform, ViewController } from 'ionic-angular';
import { GroupProvider } from '../../../providers/group';
import { Component } from '@angular/core';

@Component({
  templateUrl: 'group-create.html'
})
export class GroupCreateModalPage {
  public group: IGroup;

  constructor(
    private GroupProvider: GroupProvider,
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

  public createGroup(): void {
    console.log('Submit modal, creationGroup function should ve called here ...');
    // this.GroupProvider.createGroup(this.group); FIX BUG: create infinite number of groups
    this.dismiss();
  }

  public dismiss(): void {
    this.ViewController.dismiss();
  }
}
