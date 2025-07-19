export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  DEVELOPER = 'developer'
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Admin',
  [UserRole.MANAGER]: 'Manager',
  [UserRole.DEVELOPER]: 'Developer'
};

export const getUserRoleLabel = (role: UserRole): string => {
  return USER_ROLE_LABELS[role];
}; 