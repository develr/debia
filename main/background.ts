import { app, ipcMain } from "electron";
import serve from "electron-serve";
import Knex from "knex";
import schemaInspector from "knex-schema-inspector";

import { createWindow } from "./helpers";
import { Database } from "./config/database";

const isProd: boolean = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});

ipcMain.on("connect-database-req", async (event, arg) => {
  const data = JSON.parse(arg);

  const db = await Database.instance(data);

  db.raw("SELECT 1")
    .then(() => {
      event.sender.send(
        "connect-database-res",
        JSON.stringify({ status: "connected" })
      );
    })
    .catch(() => {
      event.sender.send(
        "connect-database-res",
        JSON.stringify({ status: "error" })
      );
    });
});

ipcMain.on("make-raw-query-req", async (event, arg) => {
  const db = Database.getDatabase();

  const res = await db.raw(arg);

  event.sender.send(
    "make-raw-query-res",
    JSON.stringify({
      rows: res.rows,
      fields: res.fields,
    })
  );
});
