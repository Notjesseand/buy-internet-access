// // // // mikrotik.js (Service Layer using SSH)

// // // import { Client } from "ssh2";
// // // import "dotenv/config";
// // // import tls from "tls";

// // // /**
// // //  * Creates a hotspot user via SSH.
// // //  * Trigger this function after your payment gateway confirms a successful transaction.
// // //  */

// // // export async function createHotspotUser({
// // //   username,
// // //   password,
// // //   profile,
// // //   limitUptime = undefined, // <--- TH
// // // }) {
// // //   return new Promise((resolve, reject) => {
// // //     const conn = new Client();

// // //     conn
// // //       .on("ready", () => {
// // //         // Construct the command exactly like the manual terminal version
// // //         let command = `/ip hotspot user add name="${username}" password="${password}" profile="${profile}"`;

// // //         if (limitUptime) {
// // //           command += ` limit-uptime=${limitUptime}`;
// // //         }

// // //         conn.exec(command, (err, stream) => {
// // //           if (err) {
// // //             conn.end();
// // //             return reject(err);
// // //           }

// // //           stream
// // //             .on("close", (code, signal) => {
// // //               conn.end();
// // //               if (code === 0) {
// // //                 console.log(`✅ Success: User ${username} created.`);
// // //                 resolve(true);
// // //               } else {
// // //                 reject(new Error(`Exit code: ${code}`));
// // //               }
// // //             })
// // //             .on("data", (data) => {
// // //               console.log("STDOUT: " + data);
// // //             })
// // //             .stderr.on("data", (data) => {
// // //               console.error("Router Error: " + data);
// // //             });
// // //         });
// // //       })
// // //       .on("error", (err) => {
// // //         reject(err);
// // //       })
// // //       .connect({
// // //         host: process.env.MIKROTIK_HOST || "192.168.10.1",
// // //         port: parseInt(process.env.MIKROTIK_PORT) || 22,
// // //         username: process.env.MIKROTIK_USER,
// // //         password: process.env.MIKROTIK_PASS,
// // //         // Added to match your friend's specific terminal requirement
// // //         algorithms: {
// // //           kex: [
// // //             "diffie-hellman-group1-sha1",
// // //             "ecdh-sha2-nistp256",
// // //             "ecdh-sha2-nistp384",
// // //             "ecdh-sha2-nistp521",
// // //             "diffie-hellman-group-exchange-sha256",
// // //             "diffie-hellman-group14-sha1",
// // //           ],
// // //           cipher: [
// // //             "aes128-ctr",
// // //             "aes192-ctr",
// // //             "aes256-ctr",
// // //             "aes128-gcm",
// // //             "aes128-gcm@openssh.com",
// // //             "aes256-gcm",
// // //             "aes256-gcm@openssh.com",
// // //           ],
// // //         },
// // //       });
// // //   });
// // // }

// // // export async function close() {
// // //   // SSH connections in this script close automatically after the command runs.
// // //   return Promise.resolve();
// // // }

// // import { Client } from "ssh2";
// // import "dotenv/config";
// // import tls from "tls"; // Needed to wrap the connection for Tailscale Funnel

// // /**
// //  * Creates a hotspot user via SSH wrapped in TLS for Tailscale Funnel.
// //  */
// // export async function createHotspotUser({
// //   username,
// //   password,
// //   profile,
// //   limitUptime = undefined,
// // }) {
// //   return new Promise((resolve, reject) => {
// //     const conn = new Client();

// //     // 1. Get connection details from environment variables
// //     const host = process.env.MIKROTIK_HOST;
// //     const port = parseInt(process.env.MIKROTIK_PORT) || 443;

// //     console.log(`Attempting connection to ${host} via port ${port}...`);

// //     // 2. Create a TLS socket first (Tailscale Funnel on 443 requires this)
// //     const socket = tls.connect(port, host, { servername: host }, () => {
// //       console.log("🔒 TLS Tunnel established. Initializing SSH...");

// //       // 3. Once TLS is ready, start SSH over that socket
// //       conn.connect({
// //         sock: socket, // Use the encrypted socket
// //         username: process.env.MIKROTIK_USER,
// //         password: process.env.MIKROTIK_PASS,
// //         algorithms: {
// //           kex: [
// //             "diffie-hellman-group1-sha1",
// //             "ecdh-sha2-nistp256",
// //             "ecdh-sha2-nistp384",
// //             "ecdh-sha2-nistp521",
// //             "diffie-hellman-group-exchange-sha256",
// //             "diffie-hellman-group14-sha1",
// //           ],
// //           cipher: [
// //             "aes128-ctr",
// //             "aes192-ctr",
// //             "aes256-ctr",
// //             "aes128-gcm",
// //             "aes128-gcm@openssh.com",
// //             "aes256-gcm",
// //             "aes256-gcm@openssh.com",
// //           ],
// //         },
// //       });
// //     });

// //     socket.on("error", (err) => {
// //       console.error("TLS Socket Error:", err.message);
// //       reject(new Error("Failed to reach Tailscale Funnel: " + err.message));
// //     });

// //     conn
// //       .on("ready", () => {
// //         let command = `/ip hotspot user add name="${username}" password="${password}" profile="${profile}"`;
// //         if (limitUptime) {
// //           command += ` limit-uptime=${limitUptime}`;
// //         }

// //         conn.exec(command, (err, stream) => {
// //           if (err) {
// //             conn.end();
// //             return reject(err);
// //           }

// //           stream
// //             .on("close", (code) => {
// //               conn.end();
// //               if (code === 0) {
// //                 console.log(`✅ Success: User ${username} created.`);
// //                 resolve(true);
// //               } else {
// //                 reject(new Error(`Router exit code: ${code}`));
// //               }
// //             })
// //             .on("data", (data) => {
// //               console.log("STDOUT: " + data);
// //             })
// //             .stderr.on("data", (data) => {
// //               console.error("Router Error: " + data);
// //             });
// //         });
// //       })
// //       .on("error", (err) => {
// //         reject(err);
// //       });
// //   });
// // }

// // export async function close() {
// //   return Promise.resolve();
// // }

// import { Client } from "ssh2";
// import "dotenv/config";
// import tls from "tls";

// export async function createHotspotUser({
//   username,
//   password,
//   profile,
//   limitUptime = undefined,
// }) {
//   return new Promise((resolve, reject) => {
//     const conn = new Client();

//     const host = process.env.MIKROTIK_HOST;
//     const port = parseInt(process.env.MIKROTIK_PORT) || 443;

//     console.log(`Attempting connection to ${host} via port ${port}...`);

//     // Create the TLS socket
//     const socket = tls.connect(
//       {
//         host: host,
//         port: port,
//         servername: host,
//         rejectUnauthorized: false, // Prevents "wrong version" errors from certificate mismatches
//       },
//       () => {
//         console.log("🔒 TLS Tunnel established. Initializing SSH...");

//         conn.connect({
//           sock: socket,
//           username: process.env.MIKROTIK_USER,
//           password: process.env.MIKROTIK_PASS,
//           readyTimeout: 20000,
//           algorithms: {
//             kex: [
//               "diffie-hellman-group14-sha1",
//               "diffie-hellman-group-exchange-sha256",
//               "diffie-hellman-group1-sha1", // Added for older MikroTik versions
//             ],
//             cipher: [
//               "aes128-ctr",
//               "aes192-ctr",
//               "aes256-ctr",
//               "aes128-cbc",
//               "aes256-cbc", // Some MikroTik versions prefer CBC
//             ],
//           },
//         });
//       }
//     );

//     socket.on("error", (err) => {
//       console.error("TLS Socket Error:", err.message);
//       reject(new Error("Tailscale Connection Error: " + err.message));
//     });

//     conn
//       .on("ready", () => {
//         console.log("🔑 SSH Ready! Sending command...");
//         let command = `/ip hotspot user add name="${username}" password="${password}" profile="${profile}"`;
//         if (limitUptime) command += ` limit-uptime=${limitUptime}`;

//         conn.exec(command, (err, stream) => {
//           if (err) {
//             conn.end();
//             return reject(err);
//           }
//           stream.on("close", (code) => {
//             conn.end();
//             resolve(code === 0);
//           });
//         });
//       })
//       .on("error", (err) => {
//         console.error("SSH Error:", err.message);
//         reject(err);
//       });
//   });
// }

// export async function close() {
//   return Promise.resolve();
// }

// import { Client } from "ssh2";
// import "dotenv/config";
// import tls from "tls";

// export async function createHotspotUser({
//   username,
//   password,
//   profile,
//   limitUptime = undefined,
// }) {
//   return new Promise((resolve, reject) => {
//     const conn = new Client();
//     const host = process.env.MIKROTIK_HOST;
//     const port = 443; // Reverting to 443 for maximum stability

//     console.log(`Attempting connection to ${host} via port ${port}...`);

//     const socket = tls.connect(
//       {
//         host: host,
//         port: port,
//         servername: host,
//         rejectUnauthorized: false,
//         checkServerIdentity: () => undefined, // This ignores the "wrong version" header issue
//       },
//       () => {
//         console.log("🔒 TLS Tunnel established. Initializing SSH...");

//         conn.connect({
//           sock: socket,
//           username: process.env.MIKROTIK_USER,
//           password: process.env.MIKROTIK_PASS,
//           readyTimeout: 30000,
//         });
//       }
//     );

//     socket.on("error", (err) => {
//       console.error("TLS Socket Error:", err.message);
//       reject(new Error("Tailscale Error: " + err.message));
//     });

//     conn
//       .on("ready", () => {
//         console.log("🔑 SSH Ready! Creating user...");
//         let command = `/ip hotspot user add name="${username}" password="${password}" profile="${profile}"`;
//         if (limitUptime) command += ` limit-uptime=${limitUptime}`;

//         conn.exec(command, (err, stream) => {
//           if (err) {
//             conn.end();
//             return reject(err);
//           }
//           stream.on("close", (code) => {
//             conn.end();
//             resolve(code === 0);
//           });
//         });
//       })
//       .on("error", (err) => {
//         console.error("SSH Error:", err.message);
//         reject(err);
//       });
//   });
// }

// export async function close() {
//   return Promise.resolve();
// }

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
    // USE PORT 10000 (Recommended) or 443, but NOT with tls.connect
    const port = parseInt(process.env.MIKROTIK_PORT) || 10000;

    console.log(`Attempting connection to ${host} via port ${port}...`);

    conn
      .on("ready", () => {
        console.log("🔑 SSH Ready! Creating user...");
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
        readyTimeout: 30000,
      });
  });
}
