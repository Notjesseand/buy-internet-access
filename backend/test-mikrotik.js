// test-mikrotik.js
import { createHotspotUser, close } from "./mikrotik.js";

(async () => {
  try {
    await createHotspotUser({
      username: "user7",
      password: "1234",
      profile: "DAILY_ACCESS",
    });

    console.log("🎉 Hotspot user created");
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await close();
  }
})();
