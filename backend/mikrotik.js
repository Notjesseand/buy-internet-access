// mikrotik.js (Service Layer using SSH)

import { Client } from "ssh2";
import "dotenv/config";

/**
 * Creates a hotspot user via SSH.
 * Trigger this function after your payment gateway confirms a successful transaction.
 */

export async function createHotspotUser({
  username,
  password,
  profile,
  limitUptime = undefined, // <--- TH
}) {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn
      .on("ready", () => {
        // Construct the command exactly like the manual terminal version
        let command = `/ip hotspot user add name="${username}" password="${password}" profile="${profile}"`;

        if (limitUptime) {
          command += ` limit-uptime=${limitUptime}`;
        }

        conn.exec(command, (err, stream) => {
          if (err) {
            conn.end();
            return reject(err);
          }

          stream
            .on("close", (code, signal) => {
              conn.end();
              if (code === 0) {
                console.log(`✅ Success: User ${username} created.`);
                resolve(true);
              } else {
                reject(new Error(`Exit code: ${code}`));
              }
            })
            .on("data", (data) => {
              console.log("STDOUT: " + data);
            })
            .stderr.on("data", (data) => {
              console.error("Router Error: " + data);
            });
        });
      })
      .on("error", (err) => {
        reject(err);
      })
      .connect({
        host: process.env.MIKROTIK_HOST || "192.168.10.1",
        port: parseInt(process.env.MIKROTIK_PORT) || 22,
        username: process.env.MIKROTIK_USER,
        password: process.env.MIKROTIK_PASS,
        // Added to match your friend's specific terminal requirement
        algorithms: {
          kex: [
            "diffie-hellman-group1-sha1",
            "ecdh-sha2-nistp256",
            "ecdh-sha2-nistp384",
            "ecdh-sha2-nistp521",
            "diffie-hellman-group-exchange-sha256",
            "diffie-hellman-group14-sha1",
          ],
          cipher: [
            "aes128-ctr",
            "aes192-ctr",
            "aes256-ctr",
            "aes128-gcm",
            "aes128-gcm@openssh.com",
            "aes256-gcm",
            "aes256-gcm@openssh.com",
          ],
        },
      });
  });
}

export async function close() {
  // SSH connections in this script close automatically after the command runs.
  return Promise.resolve();
}
