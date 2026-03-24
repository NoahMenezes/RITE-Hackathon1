export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const dns = await import("node:dns");
    // Force IPv4 resolution globally to prevent Turso/fetch ETIMEDOUT and EAI_AGAIN issues on Node 18+
    dns.setDefaultResultOrder("ipv4first");
    console.log("Global DNS resolution configured to ipv4first");
  }
}
