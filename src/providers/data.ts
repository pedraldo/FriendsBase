import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DataProvider {
	constructor(
		private AngularFire: AngularFire
	) {

	}

	public push(path: string, data: any): Observable<any> {
		return Observable.create(observer => {
			this.AngularFire.database.list(path).push(data).then((firebaseNewData) => {
				observer.next(firebaseNewData.path.o[firebaseNewData.path.o.length - 1]);
			}, error => {
				observer.next(error);
			});
		});
	}

	public update(path: string, data: any): void {
		this.AngularFire.database.object(path).update(data);
	}

	public list(path: string): FirebaseListObservable<any> {
		return this.AngularFire.database.list(path);
	}

	public object(path: string): FirebaseObjectObservable<any> {
		return this.AngularFire.database.object(path);
	}

	public remove(path: string): Observable<any> {
		return Observable.create(observer => {
			this.AngularFire.database.object(path).remove().then(data => {
				observer.next(data);
			}, error => {
				observer.next(error);
			});
		});
	}
 }
