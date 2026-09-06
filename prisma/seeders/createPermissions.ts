import { PrismaClient, User } from "../generated/prisma/client";
import { permissions } from "./permissions";

export default async function createPermissions(
  prisma: PrismaClient,
  admin: User,
) {
  const createdPermissions = [];

  for (const permission of permissions) {
    const p = await prisma.userPermission.upsert({
      where: {
        codeName: permission.codeName,
      },
      update: {},
      create: {
        ...permission,
        createdBy: admin.id,
      },
    });

    createdPermissions.push(p);
  }
  return createdPermissions;
}
