# @dimzxzzx07/mc-headless

<div align="center">
    <img src="https://i.imgur.com/LIQuuPL.jpeg" width="800" alt="Minecraft Headless Server">
</div>

<div align="center">
    <img src="https://img.shields.io/badge/Version-2.2.1-2563eb?style=for-the-badge&logo=typescript" alt="Version">
    <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge&logo=open-source-initiative" alt="License">
    <img src="https://img.shields.io/badge/Node-18%2B-339933?style=for-the-badge&logo=nodedotjs" alt="Node">
    <img src="https://img.shields.io/badge/Java-Portable-007396?style=for-the-badge&logo=openjdk" alt="Java Portable">
    <img src="https://img.shields.io/badge/Downloads-10K%2B-brightgreen?style=for-the-badge" alt="Downloads">
    <img src="https://img.shields.io/badge/Minecraft-1.21.11-00A98F?style=for-the-badge&logo=minecraft" alt="Minecraft">
</div>

<div align="center">
    <a href="https://t.me/Dimzxzzx07">
        <img src="https://img.shields.io/badge/Telegram-Dimzxzzx07-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram">
    </a>
    <a href="https://github.com/Dimzxzzx07">
        <img src="https://img.shields.io/badge/GitHub-Dimzxzzx07-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
    </a>
    <a href="https://www.npmjs.com/package/@dimzxzzx07/mc-headless">
        <img src="https://img.shields.io/badge/NPM-@dimzxzzx07/mc--headless-CB3837?style=for-the-badge&logo=npm" alt="NPM">
    </a>
</div>

---

## Platform Support

<div align="center">
    <table>
        <tr>
            <td align="center"><img src="https://i.imgur.com/YNDuxZz.png" width="64" height="64" alt="Pterodactyl"><br><strong>Pterodactyl</strong></td>
            <td align="center"><img src="https://i.imgur.com/ibeGaLU.png" width="64" height="64" alt="Ubuntu"><br><strong>Ubuntu</strong></td>
            <td align="center"><img src="https://i.imgur.com/WdYzwTu.png" width="64" height="64" alt="Linux"><br><strong>Linux</strong></td>
            <td align="center"><img src="https://i.imgur.com/CODPucn.png" width="64" height="64" alt="Windows"><br><strong>Windows</strong></td>
            <td align="center"><img src="https://i.imgur.com/sUU24jx.png" width="64" height="64" alt="Termux"><br><strong>Termux</strong></td>
            <td align="center"><img src="https://i.imgur.com/sbBQLaZ.jpeg" width="64" height="64" alt="Darwin"><br><strong>macOS</strong></td>
        </tr>
    </table>
</div>

**MC-Headless** runs perfectly on all platforms above:
- **Pterodactyl** - Popular game hosting panel
- **Ubuntu/Debian** - Most popular Linux servers
- **Linux** - All distributions (CentOS, Fedora, Arch, etc.)
- **Windows** - Windows Server with PowerShell
- **Termux** - Turn your Android into a Minecraft server
- **macOS** - Darwin / Mac OS X

---

## Table of Contents

- [What is MC-Headless?](#what-is-mc-headless)
- [What's New in 2.2.1](#whats-new-in-221)
- [Features](#features)
- [Why MC-Headless?](#why-mc-headless)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration Guide](#configuration-guide)
- [API Reference](#api-reference)
- [Usage Examples](#usage-examples)
- [Server Types](#server-types)
- [Platform Options](#platform-options)
- [Memory Management](#memory-management)
- [Network Settings](#network-settings)
- [World Configuration](#world-configuration)
- [Folder Structure](#folder-structure)
- [Backup System](#backup-system)
- [Event System](#event-system)
- [Commands](#commands)
- [Player Management](#player-management)
- [Cross-Play (Geyser)](#cross-play-geyser)
- [ViaVersion Support](#viaversion-support)
- [SkinRestorer Support](#skinrestorer-support)
- [Portable Java](#portable-java)
- [Performance Tuning](#performance-tuning)
- [Pterodactyl Setup](#pterodactyl-setup)
- [Termux Setup](#termux-setup)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## What is MC-Headless?

**MC-Headless** is a powerful Node.js library that simplifies running Minecraft servers (Java, Bedrock, or Cross-play) with a clean, promise-based API. No more dealing with complex Java commands, server.properties files, or manual downloads - just simple JavaScript methods.

Built specifically for developers, sysadmins, and Minecraft enthusiasts who want to automate server management, run headless servers on VPS/Pterodactyl/Termux, or integrate Minecraft servers into their applications.

### Keywords for Search Engine Optimization
- Minecraft server hosting
- Minecraft server manager
- Minecraft headless server
- PaperMC server setup
- Minecraft VPS hosting
- Pterodactyl Minecraft egg
- Minecraft server automation
- Minecraft cross-play server
- Java portable Minecraft
- Minecraft Termux server
- Minecraft Ubuntu server
- Minecraft Docker container
- Minecraft server control panel
- Minecraft server API
- Minecraft hosting solution

---

## What's New in 2.2.1

### Version 2.2.1 - March 2026

- **Pterodactyl Optimized** - Full compatibility with Pterodactyl panel
- **No curl/wget required** - Pure Node.js downloader works everywhere
- **Better error handling** - Clear messages for disk space issues
- **Smaller Java downloads** - Uses JRE instead of full JDK (saves 150MB)
- **Automatic disk space check** - Warns before downloading
- **Improved platform detection** - Works on all Linux distros
- **Fallback URLs** - Multiple mirrors for Java downloads
- **Corrupted file detection** - Auto-retry on bad downloads
- **Memory limit awareness** - Respects cgroup limits in containers

---

## Features

| Category | Features |
|----------|----------|
| **Server Types** | Paper, Purpur, Vanilla, Spigot, Forge, Fabric |
| **Platforms** | Java Edition, Bedrock Edition, Cross-play (Geyser) |
| **Auto Setup** | Automatic Java detection, EULA acceptance, server.properties generation |
| **Portable Java** | Download JRE to current directory, no system installation required |
| **Cgroups Stats** | CPU/Memory stats like Pterodactyl (30s interval) |
| **Downloader** | Pure Node.js downloader (no curl/wget needed) |
| **Memory Management** | Custom memory allocation, Aikar's flags optimization |
| **Backup System** | Automatic scheduled backups, manual backup triggers |
| **Monitoring** | Real-time CPU/memory usage, player tracking, server events |
| **Cross-play** | Built-in Geyser & Floodgate support for Bedrock clients |
| **ViaVersion** | Built-in ViaVersion, ViaBackwards, ViaRewind support |
| **SkinRestorer** | Auto-download and install SkinRestorer plugin |
| **Pterodactyl Ready** | Optimized for panel hosting |
| **Termux Friendly** | Optimized for Android/Termux environments |
| **Headless Ready** | No GUI required, perfect for servers and automation |
| **Silent Mode** | Direct log piping for minimal CPU usage |

---

## Why MC-Headless?

### Before (Manual Setup)
```bash
# Download server jar
wget https://api.papermc.io/v2/projects/paper/versions/1.21.11/builds/196/downloads/paper-1.21.11-196.jar

# Check if Java installed
which java || echo "Java not found"

# Install Java manually if needed
sudo apt install openjdk-21-jre-headless

# Accept EULA
echo "eula=true" > eula.txt

# Create server.properties
echo "server-port=25565" > server.properties
echo "max-players=20" >> server.properties

# Run server with complex Java flags
java -Xms4G -Xmx12G -XX:+UseG1GC -jar paper-1.21.11-196.jar nogui

# Download plugins manually
wget https://github.com/ViaVersion/ViaVersion/releases/download/5.7.2/ViaVersion-5.7.2.jar -P plugins/
wget https://github.com/SkinsRestorer/SkinsRestorerX/releases/latest/download/SkinsRestorer.jar -P plugins/

# Monitor manually
tail -f logs/latest.log
```

After (MC-Headless v2.2.1)

```javascript
const { MinecraftServer } = require('@dimzxzzx07/mc-headless');

const server = new MinecraftServer({
  version: '1.21.11',
  type: 'paper',
  usePortableJava: true,
  memory: { init: '4G', max: '12G' },
  enableViaVersion: true,
  enableSkinRestorer: true
});

server.on('ready', () => console.log('Server ready!'));
server.on('player-join', (player) => console.log(`${player.name} joined`));

await server.start();
```

---

Installation

From NPM

```bash
# Install as dependency
npm install @dimzxzzx07/mc-headless

# Install globally
npm install -g @dimzxzzx07/mc-headless
```

Requirements

Requirement Minimum Recommended
Node.js 18.0.0 20.0.0 or higher
RAM 2 GB 4 GB or more
Storage 2 GB 10 GB
OS Linux, macOS, Windows, Termux Linux (production)

Note: Java is auto-downloaded as portable JRE (no system installation needed)

---

Quick Start

Basic Java Server with Portable Java

```javascript
const { MinecraftServer } = require('@dimzxzzx07/mc-headless');
const os = require('os');

async function startServer() {
  // Auto-detect system RAM
  const totalRam = Math.floor(os.totalmem() / 1024 / 1024 / 1024);
  const recommendedMax = Math.min(12, Math.max(2, Math.floor(totalRam * 0.7)));

  console.log(`System RAM: ${totalRam}GB, Recommended: ${recommendedMax}GB`);

  const server = new MinecraftServer({
    platform: 'java',
    version: '1.21.11',
    type: 'paper',
    usePortableJava: true,
    memory: {
      init: '4G',
      max: `${recommendedMax}G`,
      useAikarsFlags: true
    }
  });

  server.on('ready', (info) => {
    console.log(`Server ready on port ${info.port}`);
    console.log(`Memory: ${info.memory.used}/${info.memory.max} MB`);
    console.log(`CPU: ${info.cpu}%`);
  });

  await server.start();
}

startServer();
```

Complete Server with All Features

```javascript
const { MinecraftServer } = require('@dimzxzzx07/mc-headless');
const axios = require('axios');
const os = require('os');

async function startServer() {
  // Get public IP
  let publicIp = "127.0.0.1";
  try {
    const res = await axios.get('https://api.ipify.org?format=json');
    publicIp = res.data.ip;
  } catch (err) {
    console.log("Using default IP");
  }

  // Auto-detect RAM
  const totalRam = Math.floor(os.totalmem() / 1024 / 1024 / 1024);
  const recommendedMax = Math.min(12, Math.max(2, Math.floor(totalRam * 0.7)));

  const server = new MinecraftServer({
    platform: "all",
    version: "1.21.11",
    type: "paper",
    autoAcceptEula: true,
    
    // Java options
    usePortableJava: true,
    javaVersion: "auto",
    
    memory: {
      init: "4G",
      max: "12G",
      useAikarsFlags: true
    },
    
    network: {
      ip: "0.0.0.0",
      port: 25565,
      bedrockPort: 19132,
      motd: "Minecraft 1.21.11 Server",
      onlineMode: false
    },

    world: {
      difficulty: "normal",
      maxPlayers: 20,
      levelName: "world",
      viewDistance: 6,
      simulationDistance: 4
    },
    
    // Plugins
    enableViaVersion: true,
    enableViaBackwards: true,
    enableViaRewind: true,
    enableSkinRestorer: true,
    
    // Monitoring
    memoryMonitor: {
      enabled: true,
      threshold: 85,
      interval: 30000,
      action: 'warn'
    },
    
    // Performance
    silentMode: true,
    statsInterval: 30000
  });

  server.on("ready", (info) => {
    console.clear();
    console.log(`\n==========================================`);
    console.log(`Minecraft Server - v2.2.1`);
    console.log(` IP: ${publicIp}:${info.port}`);
    console.log(` Version: ${info.version}`);
    console.log(` Memory: ${info.memory.used}/${info.memory.max} MB`);
    console.log(` CPU: ${info.cpu || 0}%`);
    console.log(` Players: ${info.players}/${info.maxPlayers}`);
    console.log(`==========================================\n`);
  });

  server.on("player-join", (player) => {
    console.log(`${player.name} joined`);
    server.sendCommand(`tellraw ${player.name} {"text":"Welcome!","color":"aqua"}`);
  });

  server.on("player-leave", (name) => {
    console.log(`${name} left`);
  });

  server.on("resource", (info) => {
    if (info.memory.used > info.memory.max * 0.8) {
      console.log(` High memory: ${info.memory.used}/${info.memory.max} MB`);
    }
  });

  await server.start();
}

startServer();
```

---

Configuration Guide

Complete Configuration Example

```javascript
const { MinecraftServer } = require('@dimzxzzx07/mc-headless');

const server = new MinecraftServer({
  // Platform Selection
  platform: 'all',
  version: '1.21.11',
  type: 'paper',
  autoAcceptEula: true,

  // Java Options
  usePortableJava: true,
  javaVersion: 'auto',

  // Resource Management
  memory: {
    init: '4G',
    max: '12G',
    useAikarsFlags: true
  },

  // Network Settings
  network: {
    port: 25565,
    bedrockPort: 19132,
    ip: '0.0.0.0',
    onlineMode: false,
    motd: 'Minecraft Server'
  },

  // World & Difficulty Settings
  world: {
    difficulty: 'normal',
    hardcore: false,
    gamemode: 'survival',
    seed: 'my-secret-seed',
    maxPlayers: 20,
    viewDistance: 6,
    simulationDistance: 4,
    levelName: 'world'
  },

  // Folder Management
  folders: {
    addons: './addons',
    mods: './mods',
    plugins: './plugins',
    world: './world'
  },

  // Plugins
  enableViaVersion: true,
  enableViaBackwards: true,
  enableViaRewind: true,
  enableSkinRestorer: true,

  // Server Behavior
  autoRestart: true,
  backup: {
    enabled: true,
    interval: '24h',
    path: './backups'
  },

  // Monitoring
  memoryMonitor: {
    enabled: true,
    threshold: 85,
    interval: 30000,
    action: 'warn'
  },

  // Performance
  silentMode: true,
  statsInterval: 30000
});

await server.start();
```

Configuration Options Reference

Platform Options

Option Type Default Description
platform string 'java' 'java', 'bedrock', or 'all'
version string '1.21.11' Minecraft version
type string 'paper' paper, purpur, vanilla, spigot, forge, fabric
autoAcceptEula boolean true Automatically accept Minecraft EULA

Java Options

Option Type Default Description
usePortableJava boolean true Download portable JRE to current directory
javaVersion string 'auto' '17', '21', or 'auto'

Memory Options

Option Type Default Description
memory.init string '2G' Initial heap size
memory.max string '4G' Maximum heap size
memory.useAikarsFlags boolean true Use Aikar's optimized GC flags

Network Options

Option Type Default Description
network.port number 25565 Java edition server port
network.bedrockPort number 19132 Bedrock edition server port
network.ip string '0.0.0.0' Bind IP address
network.onlineMode boolean false Enable Mojang authentication
network.motd string 'Minecraft Server' Message of the day

World Options

Option Type Default Description
world.difficulty string 'normal' peaceful, easy, normal, hard
world.hardcore boolean false Enable hardcore mode
world.gamemode string 'survival' survival, creative, adventure, spectator
world.seed string undefined World generation seed
world.maxPlayers number 20 Maximum player count
world.viewDistance number 6 Chunk view distance
world.simulationDistance number 4 Simulation distance
world.levelName string 'world' World folder name

Plugin Options

Option Type Default Description
enableViaVersion boolean false Enable ViaVersion plugin
enableViaBackwards boolean false Enable ViaBackwards plugin
enableViaRewind boolean false Enable ViaRewind plugin
enableSkinRestorer boolean false Enable SkinRestorer plugin

Performance Options

Option Type Default Description
silentMode boolean true Direct pipe logs (no Node.js processing)
statsInterval number 30000 Stats update interval in ms

Owner Options

Option Type Default Description
owners array [] List of owner usernames
ownerCommands.prefix string '!' Command prefix for owners
ownerCommands.enabled boolean true Enable owner commands

---

API Reference

MinecraftServer Class

```javascript
class MinecraftServer extends EventEmitter {
  constructor(config: Partial<MinecraftConfig>);
  
  // Methods
  async start(): Promise<ServerInfo>;
  async stop(): Promise<void>;
  sendCommand(command: string): void;
  async getInfo(): Promise<ServerInfo>;
  getPlayers(): Player[];
  async backup(type?: 'full' | 'world' | 'plugins'): Promise<string>;
  
  // Events
  on(event: 'ready', listener: (info: ServerInfo) => void): this;
  on(event: 'stop', listener: (data: { code: number }) => void): this;
  on(event: 'player-join', listener: (player: Player) => void): this;
  on(event: 'player-leave', listener: (name: string) => void): this;
  on(event: 'resource', listener: (info: ServerInfo) => void): this;
}
```

ServerInfo Interface

```javascript
interface ServerInfo {
  pid: number;
  ip: string;
  port: number;
  bedrockPort?: number;
  version: string;
  type: string;
  platform: string;
  players: number;
  maxPlayers: number;
  uptime: number;
  memory: {
    used: number;
    max: number;
  };
  cpu: number;
  status: 'starting' | 'running' | 'stopping' | 'stopped' | 'crashed';
}
```

Player Interface

```javascript
interface Player {
  name: string;
  uuid: string;
  ip: string;
  ping: number;
  connectedAt: Date;
}
```

---

Usage Examples

Server with Auto RAM Detection

```javascript
const { MinecraftServer } = require('@dimzxzzx07/mc-headless');
const os = require('os');

const totalRam = Math.floor(os.totalmem() / 1024 / 1024 / 1024);
const maxRam = Math.min(12, Math.floor(totalRam * 0.7));

const server = new MinecraftServer({
  version: '1.21.11',
  type: 'paper',
  usePortableJava: true,
  memory: {
    init: `${Math.floor(maxRam * 0.3)}G`,
    max: `${maxRam}G`
  }
});

server.on('ready', (info) => {
  console.log(`Server running with ${info.memory.max} MB max`);
});

server.start();
```

Multiple Servers with Different Versions

```javascript
const { ServerManager } = require('@dimzxzzx07/mc-headless');

const manager = new ServerManager();

// Create servers
manager.createServer('lobby', {
  version: '1.21.11',
  type: 'paper',
  network: { port: 25565 }
});

manager.createServer('survival', {
  version: '1.21.11',
  type: 'paper',
  network: { port: 25566 },
  world: { levelName: 'survival' }
});

manager.createServer('creative', {
  version: '1.21.11',
  type: 'paper',
  network: { port: 25567 },
  world: { gamemode: 'creative' }
});

// Start all
await manager.startAll();

// Broadcast command
await manager.broadcastCommand('say Server is running!');
```

Server with Owner Commands

```javascript
const { MinecraftServer } = require('@dimzxzzx07/mc-headless');

const server = new MinecraftServer({
  version: '1.21.11',
  type: 'paper',
  owners: ['dimzxind', 'admin1', 'tesuser'],
  ownerCommands: {
    prefix: '!',
    enabled: true
  }
});

server.on('player-join', (player) => {
  if (['dimzxind', 'admin1', 'tesuser'].includes(player.name)) {
    server.sendCommand(`tellraw ${player.name} {"text":"Welcome Owner! Use !help for commands","color":"gold"}`);
  }
});

server.start();
```

Owner Commands Available

Command Description Example
!gamemode <mode> [player] Change gamemode !gamemode creative
!gm <mode> [player] Shortcut for gamemode !gm survival
!tp <player> [x y z] Teleport !tp player2
!give <player> <item> [amount] Give items !give player2 diamond 64
!time <set\|add> <value> Change time !time set day
!weather <clear\|rain\|thunder> Change weather !weather clear
!kill [player] Kill player !kill player2
!ban <player> [reason] Ban player !ban hacker
!kick <player> [reason] Kick player !kick spammer
!op <player> Give operator !op friend
!deop <player> Remove operator !deop friend
!reload Reload server !reload
!save Save world !save
!list List players !list
!help Show owner commands !help

---

Server Types

Paper (Recommended for Performance)

```javascript
const server = new MinecraftServer({
  type: 'paper',
  version: '1.21.11',
  memory: { useAikarsFlags: true }
});
```

Vanilla (Official Mojang)

```javascript
const server = new MinecraftServer({
  type: 'vanilla',
  version: '1.21.11'
});
```

Forge (Modded)

```javascript
const server = new MinecraftServer({
  type: 'forge',
  version: '1.21.11',
  folders: { mods: './mods' }
});
```

Fabric (Lightweight Modding)

```javascript
const server = new MinecraftServer({
  type: 'fabric',
  version: '1.21.11',
  folders: { mods: './mods' }
});
```

---

Platform Options

Java Edition Only

```javascript
const server = new MinecraftServer({
  platform: 'java',
  version: '1.21.11',
  type: 'paper',
  network: { port: 25565 }
});
```

Bedrock Edition Only

```javascript
const server = new MinecraftServer({
  platform: 'bedrock',
  version: '1.21.11',
  network: { port: 19132 },
  folders: { addons: './addons' }
});
```

Cross-Play (Java + Bedrock)

```javascript
const server = new MinecraftServer({
  platform: 'all',
  version: '1.21.11',
  type: 'paper',
  network: {
    port: 25565,
    bedrockPort: 19132
  }
});
```

---

Memory Management

Basic Memory Configuration

```javascript
memory: {
  init: '2G',
  max: '4G',
  useAikarsFlags: false
}
```

Aikar's Flags (Optimized)

```javascript
memory: {
  init: '2G',
  max: '8G',
  useAikarsFlags: true
}
```

Memory Recommendations

Players RAM Init Max
1-10 2 GB 1G 2G
10-20 4 GB 2G 4G
20-50 8 GB 4G 8G
50-100 16 GB 8G 16G

---

Network Settings

Basic Network

```javascript
network: {
  port: 25565,
  ip: '0.0.0.0',
  onlineMode: false,
  motd: 'My Server'
}
```

Cross-Play Network

```javascript
network: {
  port: 25565,
  bedrockPort: 19132,
  ip: '0.0.0.0',
  onlineMode: false,
  motd: 'Cross-Play Server'
}
```

---

World Configuration

Basic World

```javascript
world: {
  difficulty: 'normal',
  gamemode: 'survival',
  maxPlayers: 20,
  viewDistance: 6,
  simulationDistance: 4,
  levelName: 'world'
}
```

Hardcore Mode

```javascript
world: {
  difficulty: 'hard',
  hardcore: true,
  gamemode: 'survival',
  maxPlayers: 10,
  viewDistance: 6
}
```

Custom Seed

```javascript
world: {
  seed: 'my-amazing-seed-12345',
  levelName: 'custom_world'
}
```

---

Folder Structure

```
server/
├── plugins/          # Paper/Spigot plugins
├── mods/             # Forge/Fabric mods
├── addons/           # Bedrock addons
├── world/            # World data
├── logs/             # Server logs
├── backups/          # Backup files
└── .java/            # Portable Java (if enabled)
```

---

Backup System

Enable Automatic Backups

```javascript
backup: {
  enabled: true,
  interval: '24h',
  path: './backups'
}
```

Manual Backup

```javascript
// Full backup
const fullPath = await server.backup('full');

// World only backup
const worldPath = await server.backup('world');

// Plugins only backup
const pluginsPath = await server.backup('plugins');
```

---

Event System

Server Events

```javascript
server.on('ready', (info) => {
  console.log('Server ready at', info.port);
});

server.on('stop', ({ code }) => {
  console.log('Server stopped with code', code);
});

server.on('resource', (info) => {
  console.log(`Memory: ${info.memory.used}/${info.memory.max} MB`);
});
```

Player Events

```javascript
server.on('player-join', (player) => {
  console.log(`${player.name} joined from ${player.ip}`);
  server.sendCommand(`say Welcome ${player.name}!`);
});

server.on('player-leave', (name) => {
  console.log(`${name} left the game`);
});
```

---

Commands

Built-in Commands

```javascript
// Send any Minecraft command
server.sendCommand('say Hello world');
server.sendCommand('time set day');
server.sendCommand('weather clear');
server.sendCommand('difficulty hard');
server.sendCommand('gamemode creative @a');
```

Console Commands

```javascript
// Stop server
server.sendCommand('stop');

// Save world
server.sendCommand('save-all');

// List players
server.sendCommand('list');

// Ban player
server.sendCommand('ban Notch');
```

---

Player Management

Get Player List

```javascript
const players = server.getPlayers();
players.forEach(player => {
  console.log(`${player.name} - Ping: ${player.ping}ms`);
});
```

Player Count

```javascript
const info = await server.getInfo();
console.log(`Players online: ${info.players}/${info.maxPlayers}`);
```

---

Cross-Play (Geyser)

Automatic Setup

```javascript
const server = new MinecraftServer({
  platform: 'all',
  version: '1.21.11',
  type: 'paper',
  network: {
    port: 25565,
    bedrockPort: 19132
  }
});
```

---

ViaVersion Support

Enable All ViaVersion Plugins

```javascript
const server = new MinecraftServer({
  version: '1.21.11',
  type: 'paper',
  enableViaVersion: true,
  enableViaBackwards: true,
  enableViaRewind: true
});
```

What Each Plugin Does

Plugin Function
ViaVersion Allows newer clients to connect to older servers
ViaBackwards Allows older clients to connect to newer servers
ViaRewind Adds support for 1.7.x - 1.8.x clients

With ViaVersion enabled, your server can accept connections from Minecraft versions 1.7.x through 1.21.x.

---

SkinRestorer Support

Enable SkinRestorer

```javascript
const server = new MinecraftServer({
  enableSkinRestorer: true
});
```

· Auto-downloads latest SkinRestorer
· Fixes player skins for offline mode
· Works with Geyser (Bedrock players)

---

Portable Java

How It Works

```javascript
const server = new MinecraftServer({
  usePortableJava: true,  // Download JRE to .java folder
  javaVersion: 'auto'      // Auto-detect required version
});
```

· Downloads JRE (not full JDK) ~50MB
· Extracts to .java/jre-{version}/ in current directory
· Auto-cleanup after 24 hours
· No system installation required
· Sets JAVA_HOME and PATH automatically
· Adds MALLOC_ARENA_MAX=2 for memory efficiency

Java Version Requirements

Minecraft Version Java Version
1.21.x Java 21
1.20.x Java 17
1.19.x Java 17
1.18.x Java 17
1.17.x Java 16
1.16.x Java 8

---

Performance Tuning

Optimized Configuration

```javascript
const server = new MinecraftServer({
  version: '1.21.11',
  type: 'paper',
  usePortableJava: true,
  memory: {
    init: '4G',
    max: '12G',
    useAikarsFlags: true
  },
  world: {
    viewDistance: 6,
    simulationDistance: 4,
    maxPlayers: 20
  },
  silentMode: true,
  statsInterval: 30000
});
```

Environment Optimizations

Variable Value Effect
MALLOC_ARENA_MAX 2 Prevents memory fragmentation
_JAVA_OPTIONS -Xmx... Global Java memory limit
JAVA_HOME (auto) Points to portable Java

---

Pterodactyl Setup

Installation on Pterodactyl

```bash
# Connect to your Pterodactyl server via SSH
ssh user@your-server.com

# Create directory for your server
mkdir minecraft-server
cd minecraft-server

# Install Node.js (if not available)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install mc-headless
npm init -y
npm install @dimzxzzx07/mc-headless

# Create server script
cat > index.js << 'EOF'
const { MinecraftServer } = require('@dimzxzzx07/mc-headless');

const server = new MinecraftServer({
  version: '1.21.11',
  type: 'paper',
  usePortableJava: true,
  memory: {
    init: '2G',
    max: '4G'
  },
  network: {
    port: 25565
  }
});

server.on('ready', (info) => {
  console.log(`Server ready on port ${info.port}`);
});

server.start();
EOF

# Run server
node index.js
```

Pterodactyl Egg Configuration

If you want to create a custom Pterodactyl egg:

```json
{
  "name": "MC-Headless",
  "description": "Minecraft Headless Server Manager",
  "docker_images": {
    "node:20": "node:20"
  },
  "startup": "node /home/container/index.js",
  "environment": {
    "SERVER_VERSION": "1.21.11",
    "SERVER_TYPE": "paper",
    "MEMORY_INIT": "2G",
    "MEMORY_MAX": "4G"
  }
}
```

---

Termux Setup

Install in Termux

```bash
# Update packages
pkg update && pkg upgrade

# Install Node.js
pkg install nodejs

# Install mc-headless
npm install -g @dimzxzzx07/mc-headless

# Create server directory
mkdir minecraft-server
cd minecraft-server

# Create server script
cat > server.js << 'EOF'
const { MinecraftServer } = require('@dimzxzzx07/mc-headless');

const server = new MinecraftServer({
  platform: 'java',
  version: '1.21.11',
  type: 'paper',
  usePortableJava: true,
  memory: {
    init: '512M',
    max: '2G'
  }
});

server.start();
EOF

# Run server
node server.js
```

Termux Optimizations

```javascript
const server = new MinecraftServer({
  version: '1.21.11',
  type: 'paper',
  usePortableJava: true,
  memory: {
    init: '512M',
    max: '2G'
  },
  world: {
    viewDistance: 4,
    simulationDistance: 3,
    maxPlayers: 10
  }
});
```

---

Troubleshooting

Common Issues

Issue Cause Solution
Java not found Java not installed Enable usePortableJava: true
ENOSPC: no space left Disk full Free disk space, reduce memory
Download failed: 302 URL redirect Using Node.js downloader (fixed in v2.2.1)
Port already in use Another server running Change port number
Plugin corrupt Bad download Delete plugin and restart
High CPU usage Too many chunks Reduce viewDistance to 4
Out of memory RAM too low Reduce max memory or add RAM

Disk Space Issues

```bash
# Check disk usage
df -h

# Clean up old Java files
rm -rf .java/jre-*

# Clean npm cache
npm cache clean --force

# Remove old backups
rm -rf backups/*
```

Debug Mode

```javascript
const server = new MinecraftServer({
  silentMode: false,  // Disable silent mode to see all logs
  statsInterval: 5000 // Update stats every 5 seconds
});
```

Logs Location

```bash
# Server logs are piped directly to console
# Check console output for errors

# Java portable logs
ls -la .java/
```

---

Contributing

Development Setup

```bash
git clone https://github.com/Dimzxzzx07/mc-headless.git
cd mc-headless
npm install
npm run build
npm test
```

Project Structure

```
mc-headless/
├── src/
│   ├── core/
│   │   ├── MinecraftServer.ts
│   │   ├── ConfigHandler.ts
│   │   ├── JavaChecker.ts
│   │   └── ServerManager.ts
│   ├── engines/
│   │   ├── PaperEngine.ts
│   │   ├── VanillaEngine.ts
│   │   ├── ForgeEngine.ts
│   │   └── FabricEngine.ts
│   ├── platforms/
│   │   ├── GeyserBridge.ts
│   │   ├── ViaVersion.ts
│   │   └── SkinRestorer.ts
│   └── utils/
│       ├── Logger.ts
│       ├── FileUtils.ts
│       └── SystemDetector.ts
├── tests/
├── examples/
└── README.md
```

Pull Request Process

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

---

License

MIT License

Copyright (c) 2026 Dimzxzzx07

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

<div align="center">
    <img src="https://i.imgur.com/aPSNrKE.png" alt="Dimzxzzx07 Logo" width="200">
    <br>
    <strong>Powered By Dimzxzzx07</strong>
    <br>
    <br>
    <a href="https://t.me/Dimzxzzx07">
        <img src="https://img.shields.io/badge/Telegram-Contact-26A5E4?style=for-the-badge&logo=telegram" alt="Telegram">
    </a>
    <a href="https://github.com/Dimzxzzx07">
        <img src="https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github" alt="GitHub">
    </a>
    <br>
    <br>
    <small>Copyright © 2026 Dimzxzzx07. All rights reserved.</small>
</div>
