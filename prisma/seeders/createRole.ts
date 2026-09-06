import { PrismaClient, User } from "../generated/prisma/client";

export default async function createRole(prisma: PrismaClient, admin: User) {
  const roles = [
    {
      roleName: "Company Admin",
      description: "Full system access",
    },
    {
      roleName: "Company Manager",
      description: "Manage company operations",
    },
    {
      roleName: "User",
      description: "View, Solve and enjoy the platform",
    },
  ];

  return Promise.all(
    roles.map((role) =>
      prisma.userRole.upsert({
        where: {
          roleName: role.roleName,
        },
        update: {},
        create: {
          ...role,
          createdBy: admin.id,
        },
      }),
    ),
  );
}
