import * as bcrypt from "bcrypt";
import { ADMIN } from "./Constants";
import {
  PrismaClient,
  User,
  UserPermission,
  UserRole,
} from "../generated/prisma/client";

export default async function createAdmin(prisma: PrismaClient) {
  const hash = await bcrypt.hash(ADMIN.password, 10);
  const admin = await prisma.user.upsert({
    where: {
      email: ADMIN.email,
    },
    update: {},
    create: {
      name: ADMIN.name,
      userName: ADMIN.userName,
      email: ADMIN.email,
      mobileNumber: ADMIN.mobileNumber,
      passwordHash: hash,
      lastActive: new Date(),
      lastLoginAt: new Date(),
    },
  });

  await prisma.user.update({
    where: {
      id: admin.id,
    },
    data: {
      createdBy: admin.id,
      updatedBy: admin.id,
    },
  });
  return admin;
}
export const assignRoleAndPermission = async function (
  prisma: PrismaClient,
  admin: User,
  role: UserRole,
  createdPermissions: UserPermission[],
) {
  await prisma.userRole.update({
    where: {
      id: role.id,
    },
    data: {
      userPermission: {
        connect: createdPermissions.map((p) => ({
          id: p.id,
        })),
      },
    },
  });
  await prisma.user.update({
    where: {
      id: admin.id,
    },
    data: {
      role: {
        connect: {
          id: role.id,
        },
      },
    },
  });
};
