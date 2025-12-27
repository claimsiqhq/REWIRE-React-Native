import { db } from "../server/db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";

const email = process.argv[2];

if (!email) {
  console.error("Usage: npx tsx scripts/make-admin.ts <email>");
  process.exit(1);
}

async function makeAdmin() {
  const [user] = await db
    .update(users)
    .set({ role: "superadmin" })
    .where(eq(users.email, email))
    .returning();

  if (!user) {
    console.error(`User with email "${email}" not found`);
    process.exit(1);
  }

  console.log(`Successfully made ${user.email} a superadmin`);
  process.exit(0);
}

makeAdmin().catch(console.error);
