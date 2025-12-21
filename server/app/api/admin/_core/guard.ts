import { User } from "@/app/generated/prisma/client";

export function requirePermission(
  user: User & {
    roles: {
      role: {
        permissions: { permission: { resource: string; action: string } }[];
      };
    }[];
  },
  resource: string,
  action: string
) {
  const allowed = user.roles
    .flatMap((ur) => ur.role.permissions)
    .some(
      (rp) =>
        rp.permission.resource === resource && rp.permission.action === action
    );

  if (!allowed) throw new Error("Forbidden");
}
