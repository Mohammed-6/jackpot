
export type Permission = {
    module: string;
    view: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
};

export type Role = {
    _id: string;
    name: string;
    permissions: Permission[];
};


export type RolesContextType = {
    roles: Role[];
    addRole: (role: Role) => void;
    updateRole: (updatedRole: Role) => void;
    deleteRole: (id: string) => void;
};