import { AuthenticationProvider } from './authentication';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { Observable } from 'rxjs/Observable';

import { DataProvider } from './data';

@Injectable()
export class GroupProvider {
    constructor(
        private AngularFire: AngularFire,
        private DataProvider: DataProvider,
        private AuthenticationProvider: AuthenticationProvider,
        private Platform: Platform
    ) {

    }

    public getGroupData(groupId: string): Observable<any> {
      return Observable.create(observer => {
        this.DataProvider.object('groups/' + groupId).subscribe(groupData => {
          if (groupData) {
            observer.next(groupData);
            observer.complete();
          } else {
            observer.error();
          }
        });
      });
    }

    public getGroupUsers(groupId: string): Observable<any[]> {
      let groupUsers: any[];
      return Observable.create(observer => {
        this.DataProvider.list(`groups/${groupId}/users`).subscribe(groupUsersId => {
          if (groupUsersId) {
            groupUsers = [];
            groupUsersId.forEach(userId => {
              this.AuthenticationProvider.getUserData(userId.$key).subscribe(userData => {
                groupUsers.push(userData);
              });
            });
            observer.next(groupUsers);
          } else {
            observer.error();
          }
        });
      });
    }

    public getGroupList(): Observable<IGroup[]> {
      return this.DataProvider.list('groups');
    }

    public getUserGroups(userId: string): Observable<IGroup[]> {
      return Observable.create(observer => {
        this.DataProvider.list(`users/${userId}/groups`).subscribe(userGroupsId => {
          if (userGroupsId) {
            let userGroups: IGroup[] = [];
            userGroupsId.forEach(groupId => {
              this.getGroupData(groupId.$key).toPromise().then(groupData => {
                userGroups.push(groupData);
              });
            });
            observer.next(userGroups);
          } else {
            observer.error();
          }
        });
      });
    }

    public createGroup(group: IGroup, userId: string): void {
      if (group.name) {
        group.users[userId] = true;
        group.super_admin = userId;
        this.DataProvider.push('groups', group).subscribe(groupId => {
          let groupRef = {};
          groupRef[groupId] = true;
          this.DataProvider.update(`users/${userId}/groups`, groupRef);
        });
      }
    }

    public removeGroup(groupId: string): void {
      this.DataProvider.remove(`groups/${groupId}`);
    }

    public addUserToGroup(userId: string, groupId: string): Promise<[void, void]> {
      let groupRef = {};
      let userRef = {};

      groupRef[groupId] = true;
      userRef[userId] = true;

      return Promise.all([
        this.DataProvider.update(`groups/${groupId}/users`, userRef),
        this.DataProvider.update(`users/${userId}/groups`, groupRef)
      ]);
    }

    public removeMemberFromGroup(userId: string, groupId: string) {
      this.DataProvider.remove(`/users/${userId}/groups/${groupId}`);
      this.DataProvider.remove(`/groups/${groupId}/users/${userId}`);
    }
}
