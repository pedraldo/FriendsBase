import { Component } from '@angular/core';
import { AuthenticationProvider } from './../../providers/authentication';
import { NavParams, NavController } from 'ionic-angular';
import { GroupProvider } from '../../providers/group';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { GroupPage } from '../group/group-page/group';

@Component({
    templateUrl: 'profile.html',
    selector: 'profile',
})
export class ProfilePage {
    public user: any;
    public userId: string;
    public userGroups: IGroup[];

    constructor(
        private NavParams: NavParams,
        private NavController: NavController,
        private AuthenticationProvider: AuthenticationProvider,
        private GroupProvider: GroupProvider
    ) {
        this.userId = this.NavParams.data;
    }

    ngOnInit(): void {
        this.AuthenticationProvider.getUserData(this.userId).subscribe(userData => {
            let obsvArray: Observable<IGroup>[] = [];
            this.user = userData;

            _.forEach(this.user.groups, (value, key) => {
                obsvArray.push(this.GroupProvider.getGroupData(key));
            });

            Observable.forkJoin(obsvArray).subscribe(userGroups => {
                this.userGroups = userGroups;
            });
        });
    }

    public openGroupPage(group: IGroup): void {
        this.NavController.push(GroupPage, group);
    }
}
