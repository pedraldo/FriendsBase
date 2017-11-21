interface IPersistedResource {
  $key: string;
}

// Groups
interface IGroup {
  name: string;
  description: string;
  users: {
    [key: string]: boolean;
  };
  super_admin: string;
  admins: string[];
  joinRequests: {
    [key: string]: boolean;
  };
  joinInvitations: string[];
}

interface IPersistedGroup extends IGroup, IPersistedResource {}
