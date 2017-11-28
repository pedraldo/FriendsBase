import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NavParams, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AuthenticationProvider } from './../../providers/authentication';
import { RelationProvider } from './../../providers/relation';
import { GroupProvider } from '../../providers/group';
import { GroupPage } from '../group/group-page/group';
import * as _ from 'lodash';

@Component({
    templateUrl: 'profile.html',
    selector: 'profile',
})
export class ProfilePage {
    public user: any;
    public userId: string;
    public currentUserId: string;
    public userGroups: IGroup[];
    public userRelations: IRelationObject;
    public userRelationsData: any[];
    public isCurrentUserProfile: boolean;
    public isCurrentUserRelation: boolean;

    constructor(
        private NavParams: NavParams,
        private NavController: NavController,
        private AuthenticationProvider: AuthenticationProvider,
        private GroupProvider: GroupProvider,
        private RelationProvider: RelationProvider,
        private Storage: Storage
    ) {
        this.userId = this.NavParams.data[0];
        this.isCurrentUserProfile = this.NavParams.data[1];
        if (this.isCurrentUserProfile) {
            this.currentUserId = this.userId;
        }
        this.isCurrentUserRelation = false;
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
        
        this.RelationProvider.getUserRelations(this.userId).subscribe(userRelations => {
            if (this.isCurrentUserProfile) {
                let obsvArray: Observable<any>[] = [];
                _.forEach(userRelations, (value, key) => {
                    obsvArray.push(this.AuthenticationProvider.getUserData(key));
                });
                Observable.forkJoin(obsvArray).subscribe(userRelationsData => {
                    this.userRelationsData = userRelationsData;
                });
            } else {
                this.Storage.get('currentUserId').then(currentUserId => {
                    this.currentUserId = currentUserId;
                    this.RelationProvider.isUser1InUser2Relations(this.user.$key, currentUserId).subscribe(isCurrentUserRelation => {
                        this.isCurrentUserRelation = isCurrentUserRelation;
                    })
                });
            }
        });
    }

    public openGroupPage(group: IGroup): void {
        this.NavController.push(GroupPage, group);
    }

    public addUserToRelations(userId: string): firebase.Promise<void> {
        this.isCurrentUserRelation = true;
        return this.RelationProvider.addUser1InUser2Relations(userId, this.currentUserId);
    }

    public removeUserFromRelations(userId: string): void {
        this.isCurrentUserRelation = false;
        return this.RelationProvider.removeUser1FromUser2Realtions(userId, this.currentUserId);
    }
}
