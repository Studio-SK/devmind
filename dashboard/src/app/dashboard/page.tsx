import { connection } from "next/server";
import DashboardApp from "./dashboard-app";

export default async function DashboardPage() {
  await connection();
  return <DashboardApp />;
}
