import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");
import { createClient } from "@libsql/client";
const db = createClient({
  url: "libsql://productivity-noahmenezes.aws-ap-south-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzQzNjUwMzMsImlkIjoiMDE5ZDIwNjUtMjIwMS03MzYwLWE2MTItMmQyYzZiYjc0OThjIiwicmlkIjoiYmFkYjQ1MzAtNTYwZS00YjViLWFlMDgtMDhkZjZmYzllOTk2In0.c_8fpoCumpxlEITVTrp3NSK-FujoP22YzAq2r5fHehmtyXDpZ-KGdox4S5B2Djj7fApipnWZeETJDHk_6q-2Ag"
});
async function run() {
  console.time("db");
  try {
    const res = await db.execute("SELECT 1");
    console.log(res);
  } catch (e) {
    console.error(e);
  }
  console.timeEnd("db");
}
run();
