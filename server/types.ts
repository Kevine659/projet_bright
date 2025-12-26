import {
  Permission,
  Role,
  RolePermission,
  User,
  UserRole,
} from "./app/generated/prisma/client";
import { ACTIONS, RESOURCES } from "./constants";

export type UserWithRolesAndPermissions = User & {
  roles: (UserRole & {
    role: Role & {
      permissions: (RolePermission & {
        permission: Permission;
      })[];
    };
  })[];
};

export type Resource = (typeof RESOURCES)[number];
export type Action = (typeof ACTIONS)[number];
