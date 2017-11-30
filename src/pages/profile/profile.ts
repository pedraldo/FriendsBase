import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NavParams, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AuthenticationProvider } from './../../providers/authentication';
import { RelationshipProvider } from './../../providers/relationship';
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
    public userRelationships: IRelationObject;
    public userRelationshipsData: any[];
    public isCurrentUserProfile: boolean;
    public isCurrentUserRelationship: boolean;

    constructor(
        private NavParams: NavParams,
        private NavController: NavController,
        private AuthenticationProvider: AuthenticationProvider,
        private GroupProvider: GroupProvider,
        private RelationshipProvider: RelationshipProvider,
        private Storage: Storage
    ) {
        this.userId = this.NavParams.data[0];
        this.isCurrentUserProfile = this.NavParams.data[1];
        if (this.isCurrentUserProfile) {
            this.currentUserId = this.userId;
        }
        this.isCurrentUserRelationship = false;
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
        
        this.RelationshipProvider.getUserRelationships(this.userId).subscribe(userRelationships => {
            if (this.isCurrentUserProfile) {
                let obsvArray: Observable<any>[] = [];
                _.forEach(userRelationships, (value, key) => {
                    obsvArray.push(this.AuthenticationProvider.getUserData(key));
                });
                Observable.forkJoin(obsvArray).subscribe(userRelationshipsData => {
                    this.userRelationshipsData = userRelationshipsData;
                });
            } else {
                this.Storage.get('currentUserId').then(currentUserId => {
                    this.currentUserId = currentUserId;
                    this.RelationshipProvider.isUser1InUser2Relationships(this.user.$key, currentUserId).subscribe(isCurrentUserRelationship => {
                        this.isCurrentUserRelationship = isCurrentUserRelationship;
                    })
                });
            }
        });
    }

    public openGroupPage(group: IGroup): void {
        this.NavController.push(GroupPage, group);
    }

    public addUserToRelations(userId: string): firebase.Promise<void> {
        this.isCurrentUserRelationship = true;
        return this.RelationshipProvider.addUser1InUser2Relationships(userId, this.currentUserId);
    }

    public removeUserFromRelations(userId: string): void {
        this.isCurrentUserRelationship = false;
        return this.RelationshipProvider.removeUser1FromUser2Realtionships(userId, this.currentUserId);
    }
}
