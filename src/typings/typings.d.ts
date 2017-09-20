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
  join_requests: string[];
  join_invitations: string[];
}

interface IPersistedGroup extends IGroup, IPersistedResource {}
