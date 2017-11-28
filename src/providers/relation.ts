import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

import { DataProvider } from './data';
import { AuthenticationProvider } from './authentication';

import * as _ from 'lodash';

@Injectable()
export class RelationProvider {

    constructor(
        private DataProvider: DataProvider,
        private AuthenticationProvider: AuthenticationProvider
    ) {

    }

    public getUserRelations(userId: string): Observable<void> {
        return Observable.create(observer => {
            this.AuthenticationProvider.getUserData(userId).subscribe(userData => {
                if (!!userData) {
                    observer.next(userData.relations);
                } else {
                    observer.error();
                }
            });
        });
    }

    public isUser1InUser2Relations(user1Id: string, user2Id: string): Observable<boolean> {
        return Observable.create(observer => {
            let isInRelations = false;
            this.getUserRelations(user2Id).subscribe(user2Relations => {
                _.forEach(user2Relations, (value, key) => {
                    if (key === user1Id) isInRelations = true;
                });
            });
            observer.next(isInRelations);
        });
    }

    public addUser1InUser2Relations(user1Id: string, user2Id: string): firebase.Promise<void> {
        let relationRef = {};
        relationRef[user1Id] = true;

        return this.DataProvider.update(`users/${user2Id}/relations`, relationRef);
    }

    public removeUser1FromUser2Realtions(user1Id: string, user2Id: string): void {
        return this.DataProvider.remove(`users/${user2Id}/relations/${user1Id}`);
    }
}