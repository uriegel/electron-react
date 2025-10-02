# electron-react
Scaffold for an electron app with react, vite and typescript

## Setup

```
nvm install 22
nvm use 22
```
Clone repository in visual studio code
```
npm init
npm install react react-dom
```
### Dev dependencies
```
npm install -D typescript
npm install -D @types/react
npm install -D @types/react-dom
npm install -D electron
npm install -D electron-builder
npm install -D concurrently
npm install -D wait-on
npm install -D cross-env
npm install -D vite
npm install -D @vitejs/plugin-react
```

### Configure typescript
Add tsconfig.json:
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "node",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "resolveJsonModule": true,
    "outDir": "dist"
  },
  "include": ["src"]
}

```

### Set up electron main process
Add file src/main/index.ts
```ts
import { app, BrowserWindow } from "electron"
import * as path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let mainWindow: BrowserWindow | null = null

const createWindow = () => {
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
```

### Set up React renderer 
Add file src/renderer/main.tsx

```ts
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"

ReactDOM.createRoot(document.getElementById("root")!).render(<App />)
```

Add file scr/renderer/App.tsx
```ts
import React from "react"

export default function App() {
	return <h1>Hello from React + TypeScript + Electron!</h1>
}

```

### Create index.html
Add file src/renderer/index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Electron + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>

```

### Configure vite
Add file vite.config.ts
```ts
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  root: "src/renderer",
  base: "./",
  build: {
    outDir: "../../dist/renderer",
    emptyOutDir: true,
  },
})
```

### Add scripts in package.json

```json
{
  "main": "dist/main/index.js",
  "scripts": {
    "dev": "concurrently \"vite\" \"wait-on http://localhost:5173 && cross-env VITE_DEV_SERVER_URL=http://localhost:5173 electron .\"",
    "build": "vite build && tsc -p tsconfig.json",
    "electron": "electron ."
  }
}
```

TODO
* build web server
* serve icon from filesystem-utilities
* test it in React
* Events (sse)
* Menu
* React extensions