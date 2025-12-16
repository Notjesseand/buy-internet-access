// // // backend/mikrotik.js
// // import net from "net";
// // import crypto from "crypto";

// // class MikroTikAPI {
// //   constructor({ host, port = 8728, username, password }) {
// //     this.host = host;
// //     this.port = port;
// //     this.username = username;
// //     this.password = password;
// //     this.socket = null;
// //     this.buffer = Buffer.alloc(0);
// //     this.callbacks = [];
// //   }

// //   connect() {
// //     return new Promise((resolve, reject) => {
// //       this.socket = net.createConnection(this.port, this.host, async () => {
// //         try {
// //           await this.login();
// //           resolve();
// //         } catch (err) {
// //           reject(err);
// //         }
// //       });

// //       this.socket.on("data", (data) => this._onData(data));
// //       this.socket.on("error", reject);
// //       this.socket.on("end", () => console.log("Disconnected from MikroTik"));
// //     });
// //   }

// //   _onData(data) {
// //     this.buffer = Buffer.concat([this.buffer, data]);
// //     while (true) {
// //       const end = this.buffer.indexOf(0);
// //       if (end === -1) break;
// //       const line = this.buffer.slice(0, end).toString("utf8");
// //       this.buffer = this.buffer.slice(end + 1);

// //       if (this.callbacks.length > 0) {
// //         const cb = this.callbacks.shift();
// //         cb(line);
// //       }
// //     }
// //   }

// //   _writeCommand(cmd) {
// //     const buf = Buffer.concat([this._encodeWord(cmd), Buffer.from([0])]);
// //     this.socket.write(buf);
// //   }

// //   _encodeWord(word) {
// //     const buf = Buffer.from(word, "utf8");
// //     if (buf.length < 0x80)
// //       return Buffer.concat([Buffer.from([buf.length]), buf]);
// //     else if (buf.length < 0x4000) {
// //       const len = buf.length | 0x8000;
// //       return Buffer.concat([Buffer.from([(len >> 8) & 0xff, len & 0xff]), buf]);
// //     } else {
// //       throw new Error("Word too long");
// //     }
// //   }

// //   login() {
// //     return new Promise((resolve, reject) => {
// //       this._writeCommand(`/login`);
// //       this.callbacks.push((resp) => {
// //         if (!resp) return reject("No response from router");
// //         const parts = resp.split("=");
// //         if (parts[0] === "!done") {
// //           resolve();
// //         } else {
// //           // Handle challenge response if needed
// //           resolve();
// //         }
// //       });
// //     });
// //   }

// //   addHotspotUser({ username, password, profile, limitUptime }) {
// //     return new Promise((resolve, reject) => {
// //       let cmd = `/ip/hotspot/user/add name=${username} password=${password} profile=${profile}`;
// //       if (limitUptime) cmd += ` limit-uptime=${limitUptime}`;
// //       this._writeCommand(cmd);
// //       this.callbacks.push((resp) => {
// //         if (resp.startsWith("!done")) resolve(true);
// //         else reject(resp);
// //       });
// //     });
// //   }

// //   close() {
// //     this.socket.end();
// //   }
// // }

// // // USAGE EXAMPLE
// // (async () => {
// //   const router = new MikroTikAPI({
// //     host: "192.168.10.1",
// //     username: "admin",
// //     password: "athadmin",
// //   });

// //   await router.connect();
// //   await router.addHotspotUser({
// //     username: "testuser",
// //     password: "testpass",
// //     profile: "default",
// //     limitUptime: "1h",
// //   });

// //   console.log("Hotspot user created ✅");
// //   router.close();
// // })();


// // backend/mikrotik.js
// import net from "net";
// import crypto from "crypto";

// class MikroTikAPI {
//   constructor({ host, port = 8728, username, password }) {
//     this.host = host;
//     this.port = port;
//     this.username = username;
//     this.password = password;
//     this.socket = null;
//     this.buffer = Buffer.alloc(0);
//     this.currentCommandResolver = null; // Stores the resolve/reject for the current command
//   }

//   // --- Core Communication Methods ---

//   connect() {
//     return new Promise((resolve, reject) => {
//       this.socket = net.createConnection(this.port, this.host, async () => {
//         try {
//           // No need to wait for 'data' event here, the internal logic will handle it
//           await this.login();
//           resolve(this); // Resolve with the instance after successful login
//         } catch (err) {
//           reject(err);
//         }
//       });

//       this.socket.on("data", (data) => this._onData(data));
//       this.socket.on("error", reject);
//       this.socket.on("end", () => console.log("Disconnected from MikroTik"));
//     });
//   }

//   _onData(data) {
//     this.buffer = Buffer.concat([this.buffer, data]);
    
//     // Process all complete words in the buffer
//     while (true) {
//       const end = this.buffer.indexOf(0); // Find the null terminator
//       if (end === -1) break;

//       const word = this.buffer.slice(0, end).toString("utf8");
//       this.buffer = this.buffer.slice(end + 1);
      
//       // If we have an active command, process the word
//       if (this.currentCommandResolver) {
//         this.currentCommandResolver.process(word);
//       } else if (word.startsWith("!done") && word.includes("ret=")) {
//         // This is a special case for the initial response from the router after connection
//         // It provides the login challenge before any command is sent.
//         const challenge = word.split("=")[1].substring(0, 32); // Extract the challenge hash
//         this.loginChallenge = challenge;
//       }
//     }
//   }

//   _encodeWord(word) {
//     const buf = Buffer.from(word, "utf8");
//     const len = buf.length;

//     if (len < 0x80)
//       return Buffer.concat([Buffer.from([len]), buf]);
//     else if (len < 0x4000)
//       return Buffer.concat([Buffer.from([0x80 | (len >> 8), len & 0xff]), buf]);
//     else
//       throw new Error("Word too long");
//   }

//   _writeCommands(commands) {
//     if (!this.socket || this.socket.destroyed) {
//         throw new Error("Socket is not connected.");
//     }
    
//     let buffer = Buffer.alloc(0);
//     commands.forEach(cmd => {
//         buffer = Buffer.concat([buffer, this._encodeWord(cmd)]);
//     });
//     // The final null terminator
//     buffer = Buffer.concat([buffer, Buffer.from([0])]); 
//     this.socket.write(buffer);
//   }

//   // New generic command sender: collects all response lines until !done or !trap
//   send(commands) {
//     return new Promise((resolve, reject) => {
//       const response = [];
      
//       this.currentCommandResolver = {
//         process: (word) => {
//           if (word.startsWith("!done")) {
//             this.currentCommandResolver = null;
//             resolve(response);
//           } else if (word.startsWith("!re")) {
//             response.push(word);
//           } else if (word.startsWith("!trap")) {
//             this.currentCommandResolver = null;
//             reject(new Error(`MikroTik Trap: ${word}`));
//           }
//           // Ignore other non-response words like !fatal
//         },
//         resolve,
//         reject,
//       };

//       this._writeCommands(commands);
//     });
//   }

//   // --- Fixed Login Logic ---

//   async login() {
//     // 1. Wait for the initial challenge from the router (which happens right after connection)
//     // The challenge is captured in this.loginChallenge within _onData.
    
//     if (!this.loginChallenge) {
//         throw new Error("Could not retrieve login challenge from router.");
//     }
    
//     // 2. Compute the response hash: MD5(0 + password + challenge)
//     const passwordBytes = Buffer.from('\0' + this.password, 'utf8');
//     const challengeBytes = Buffer.from(this.loginChallenge, 'hex');
//     const hashData = Buffer.concat([passwordBytes, challengeBytes]);
    
//     const responseHash = crypto.createHash('md5').update(hashData).digest('hex');

//     // 3. Send the final login command with the name and response hash
//     await this.send([
//       "/login",
//       `=name=${this.username}`,
//       `=response=00${responseHash}`
//     ]);
//   }

//   // --- API Methods ---
  
//   async addHotspotUser({ username, password, profile, limitUptime }) {
//     const commands = [
//       "/ip/hotspot/user/add",
//       `=name=${username}`,
//       `=password=${password}`,
//       `=profile=${profile}`
//     ];
//     if (limitUptime) commands.push(`=limit-uptime=${limitUptime}`);
    
//     return this.send(commands);
//   }

//   close() {
//     this.socket.end();
//   }
// }

// // USAGE EXAMPLE
// (async () => {
//   const router = new MikroTikAPI({
//     host: "192.168.10.1",
//     username: "admin",
//     password: "athadmin",
//   });
  
//   try {
//     console.log("Connecting and logging in...");
//     await router.connect(); // Wait for connect to establish connection and login
    
//     console.log("Attempting to add Hotspot user...");
//     await router.addHotspotUser({
//       username: "testuser",
//       password: "testpass",
//       profile: "default",
//       limitUptime: "1h",
//     });

//     console.log("Hotspot user created successfully ✅");
//   } catch (error) {
//     console.error("An error occurred:", error.message);
//   } finally {
//     router.close();
//   }
// })();

// backend/mikrotik.js
import net from "net";
import crypto from "crypto";

class MikroTikAPI {
  constructor({ host, port = 8728, username, password }) {
    this.host = host;
    this.port = port;
    this.username = username;
    this.password = password;
    this.socket = null;
    this.buffer = Buffer.alloc(0);
    this.currentCommandResolver = null;
    this.loginChallenge = null;
    // NEW: Promise for capturing the initial challenge
    this.challengePromise = new Promise(resolve => {
        this.resolveChallenge = resolve;
    });
  }

  // --- Core Communication Methods ---

  connect() {
    return new Promise((resolve, reject) => {
      this.socket = net.createConnection(this.port, this.host, async () => {
        try {
          // 1. WAIT for the challenge data to arrive and be processed
          await this.challengePromise; 
          
          // 2. Proceed with the actual login after challenge is confirmed
          await this.login();
          resolve(this);
        } catch (err) {
          reject(err);
        }
      });

      this.socket.on("data", (data) => this._onData(data));
      this.socket.on("error", reject);
      this.socket.on("end", () => console.log("Disconnected from MikroTik"));
    });
  }

  _onData(data) {
    this.buffer = Buffer.concat([this.buffer, data]);
    
    // Process all complete words in the buffer
    while (true) {
      const end = this.buffer.indexOf(0); // Find the null terminator
      if (end === -1) break;

      const word = this.buffer.slice(0, end).toString("utf8");
      this.buffer = this.buffer.slice(end + 1);
      
      if (this.currentCommandResolver) {
        // Handle responses for currently executing commands
        this.currentCommandResolver.process(word);
      } else if (word.startsWith("!done") && word.includes("ret=")) {
        // This handles the initial login challenge data (only executes once)
        if (!this.loginChallenge) {
            const parts = word.split("=");
            // Filter for the ret value, which is the challenge
            const retPart = parts.find(p => p.startsWith('ret'));
            if (retPart) {
                // Extract the 32-character hex hash
                this.loginChallenge = retPart.substring(4, 36); 
                // Resolve the waiting promise
                this.resolveChallenge(true); 
            }
        }
      }
    }
  }
// --- REST OF CLASS IS UNCHANGED (login, send, _encodeWord, _writeCommands, addHotspotUser, close) ---
// Note: I'll include the login method below just for completeness of the fix context.
  
  _encodeWord(word) {
    const buf = Buffer.from(word, "utf8");
    const len = buf.length;

    if (len < 0x80)
      return Buffer.concat([Buffer.from([len]), buf]);
    else if (len < 0x4000)
      return Buffer.concat([Buffer.from([0x80 | (len >> 8), len & 0xff]), buf]);
    else
      throw new Error("Word too long");
  }

  _writeCommands(commands) {
    if (!this.socket || this.socket.destroyed) {
        throw new Error("Socket is not connected.");
    }
    
    let buffer = Buffer.alloc(0);
    commands.forEach(cmd => {
        buffer = Buffer.concat([buffer, this._encodeWord(cmd)]);
    });
    buffer = Buffer.concat([buffer, Buffer.from([0])]); 
    this.socket.write(buffer);
  }

  send(commands) {
    return new Promise((resolve, reject) => {
      const response = [];
      
      this.currentCommandResolver = {
        process: (word) => {
          if (word.startsWith("!done")) {
            this.currentCommandResolver = null;
            resolve(response);
          } else if (word.startsWith("!re")) {
            response.push(word);
          } else if (word.startsWith("!trap")) {
            this.currentCommandResolver = null;
            reject(new Error(`MikroTik Trap: ${word}`));
          }
        },
        resolve,
        reject,
      };

      this._writeCommands(commands);
    });
  }

  async login() {
    // 1. The challenge is now guaranteed to be captured before this point
    if (!this.loginChallenge) {
        // This should not happen due to the challengePromise wait, but kept for safety
        throw new Error("Login challenge missing during login attempt."); 
    }
    
    // 2. Compute the response hash: MD5(0 + password + challenge)
    const passwordBytes = Buffer.from('\0' + this.password, 'utf8');
    const challengeBytes = Buffer.from(this.loginChallenge, 'hex');
    const hashData = Buffer.concat([passwordBytes, challengeBytes]);
    
    const responseHash = crypto.createHash('md5').update(hashData).digest('hex');

    // 3. Send the final login command with the name and response hash
    await this.send([
      "/login",
      `=name=${this.username}`,
      `=response=00${responseHash}`
    ]);
  }

  async addHotspotUser({ username, password, profile, limitUptime }) {
    const commands = [
      "/ip/hotspot/user/add",
      `=name=${username}`,
      `=password=${password}`,
      `=profile=${profile}`
    ];
    if (limitUptime) commands.push(`=limit-uptime=${limitUptime}`);
    
    return this.send(commands);
  }

  close() {
    if (this.socket && !this.socket.destroyed) {
        this.socket.end();
    }
  }
}

// USAGE EXAMPLE (Unchanged)
(async () => {
  const router = new MikroTikAPI({
    host: "192.168.10.1",
    username: "admin",
    password: "athadmin",
  });
  
  try {
    console.log("Connecting and logging in...");
    await router.connect();
    
    console.log("Attempting to add Hotspot user...");
    await router.addHotspotUser({
      username: "testuser",
      password: "testpass",
      profile: "default",
      limitUptime: "1h",
    });

    console.log("Hotspot user created successfully ✅");
  } catch (error) {
    console.error("An error occurred:", error.message);
  } finally {
    router.close();
  }
})();