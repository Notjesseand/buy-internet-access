import { Client } from "ssh2";
import "dotenv/config";

export async function createHotspotUser({
  username,
  password,
  profile,
  limitUptime = undefined,
}) {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    const host = process.env.MIKROTIK_HOST;
    const port = parseInt(process.env.MIKROTIK_PORT) || 10000;

    console.log(`Connecting directly to ${host}:${port}...`);

    conn
      .on("ready", () => {
        console.log("🔑 SSH Ready! Executing command...");
        let command = `/ip hotspot user add name="${username}" password="${password}" profile="${profile}"`;
        if (limitUptime) command += ` limit-uptime=${limitUptime}`;

        conn.exec(command, (err, stream) => {
          if (err) {
            conn.end();
            return reject(err);
          }
          stream.on("close", (code) => {
            conn.end();
            resolve(code === 0);
          });
          stream.on("data", (data) => console.log("STDOUT: " + data));
          stream.stderr.on("data", (data) => console.log("STDERR: " + data));
        });
      })
      .on("error", (err) => {
        console.error("SSH Error:", err.message);
        reject(err);
      })
      .connect({
        host: host,
        port: port,
        username: process.env.MIKROTIK_USER,
        password: process.env.MIKROTIK_PASS,
        readyTimeout: 40000,
        // No TLS settings here—SSH handles security itself
      });
  });
}
