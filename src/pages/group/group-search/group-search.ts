import { NavController } from 'ionic-angular';
import { GroupProvider } from '../../../providers/group';
import { AuthenticationProvider } from '../../../providers/authentication';
import { Component } from '@angular/core';

@Component({
  templateUrl: 'group-search.html',
  selector: 'group-search',
})
export class GroupSearchPage {
  public groups: IGroup[] = [];
  public filteredGroups: IGroup[] = [];

  constructor(
    private AuthenticationProvider: AuthenticationProvider,
    private GroupProvider: GroupProvider,
    private NavController: NavController
  ) {
    this.getAllGroups();
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
}
