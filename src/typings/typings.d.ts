// Global
interface IPersistedResource {
  $key: string;
}

interface IRelationObject {
  [key: string]: boolean;
}

// Groups
interface IGroup {
  name: string;
  description: string;
  users: IRelationObject;
  super_admin: string;
  admins: string[];
  joinRequests: IRelationObject;
  joinInvitations: string[];
}

interface IPersistedGroup extends IGroup, IPersistedResource {}
