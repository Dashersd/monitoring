export const ROLES = {
    ADMIN: 'ADMIN',
    TEACHER: 'TEACHER',
    SUPERVISOR: 'SUPERVISOR',
};

export const getRoleDisplayName = (role) => {
    switch (role) {
        case ROLES.ADMIN:
            return 'Administrator';
        case ROLES.TEACHER:
            return 'Teacher';
        case ROLES.SUPERVISOR:
            return 'Supervisor';
        default:
            return role;
    }
};
