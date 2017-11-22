import { NavController, NavParams } from 'ionic-angular';
import { GroupProvider } from '../../../providers/group';
import { AuthenticationProvider } from '../../../providers/authentication';
import { Component } from '@angular/core';
import { GroupPage } from '../group-page/group';

@Component({
  templateUrl: 'group-search.html',
  selector: 'group-search',
})
export class GroupSearchPage {
  public currentUser: any;
  public groups: IGroup[] = [];
  public filteredGroups: IGroup[] = [];

  constructor(
    private NavParams: NavParams,
    private AuthenticationProvider: AuthenticationProvider,
    private GroupProvider: GroupProvider,
    private NavController: NavController
  ) {
    this.getAllGroups();
    this.currentUser = this.NavParams.data;
  }

  private getAllGroups(): void {
    this.GroupProvider.getGroupList().subscribe((groups: IGroup[]) => {
      this.groups = groups;
    })
  }

  public getItems(event: any) {
    let val = event.target.value;

    if (val && val.trim() != '') {
      this.filteredGroups = this.groups.filter((group: IGroup) => {
        return (group.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    } else {
      this.filteredGroups = this.groups;
    }
  }

  public openGroupPage(group: IGroup): void {
    this.NavController.push(GroupPage, group);
  }
}
