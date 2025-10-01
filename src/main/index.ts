import { app, BrowserWindow } from "electron"
import * as path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"
import { getDrives } from "filesystem-utilities"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let mainWindow: BrowserWindow | null = null

const createWindow = () => {


	(async () => {
		console.log("Test")
		var affen = await getDrives()
		console.log("Test", affen)
	})()



	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	})

  	if (process.env.VITE_DEV_SERVER_URL) {
    	mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    	mainWindow.webContents.openDevTools()
  	} else 
    	mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"))
  	
}

app.on("ready", createWindow)
app.on("window-all-closed", () => {
	if (process.platform !== "darwin")
		app.quit()
})
app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0)
		createWindow()
})