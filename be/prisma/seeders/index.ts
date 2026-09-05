import { PrismaClient } from "../generated/prisma/client";

import createAdmin, { assignRoleAndPermission } from "./createAdmin";
import createPermissions from "./createPermissions";
import createRole from "./createRole";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Seeding database...");

  //-----------------------------------
  // Create Admin
  //-----------------------------------
  const admin = await createAdmin(prisma);
  //-----------------------------------
  // Create Permissions
  //-----------------------------------
  const createdPermissions = await createPermissions(prisma, admin);
  //-----------------------------------
  // Create Company Admin Role
  //-----------------------------------
  const role = await createRole(prisma, admin);
  //-----------------------------------
  // Attach permissions
  //-----------------------------------
  await assignRoleAndPermission(prisma, admin, role, createdPermissions);
  console.log("✅ Database seeded.");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
