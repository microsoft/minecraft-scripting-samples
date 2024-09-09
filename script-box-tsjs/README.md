---
page_type: sample workspace
author: keyyard
description: A simple sandbox for experimenting with Minecraft coding behaviors in TypeScript and JavaScript.
author: keyyard
date: 06/09/2024
languages:
  - typescript
  - javascript
products:
  - minecraft
---
# Minecraft Script Box TypeScript and JavaScript

This workspace is designed to allow you to experiment with TypeScript and JavaScript code, and build it into a Minecraft behavior pack.
This workspace also works when you add a resource pack.

## How to use this workspace sample

To get started, you'll need to clone or download this repository to your local machine. You can do this by clicking the green "Code" button in the top right of this page, and then selecting "Download ZIP".

## Prerequisites

**Install Node.js tools, if you haven't already**

We're going to use the package manager [npm](https://www.npmjs.com/package/npm) to get more tools to make the process of building our project easier.

Visit [https://nodejs.org/](https://nodejs.org).

Download the version with "LTS" next to the number and install it. (LTS stands for Long Term Support, if you're curious.) In the Node.js Windows installer, accept the installation defaults. You do not need to install any additional tools for Native compilation.

**Install Visual Studio Code, if you haven't already**

Visit the [Visual Studio Code website](https://code.visualstudio.com) and install Visual Studio Code.

## Getting Started

1. Use npm to install dependent modules:

   ```powershell
   npm i
   ```

1. Use this shortcut command to open the project in Visual Studio Code:

   ```powershell
   code .
   ```

### Chapter 2. Let's test the parts of our project

Within the root folder (script-box) of this sample, run this command:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Run this one, too.

```powershell
npm run local-deploy
```

Create an addon file to share.

```powershell
npm run mcaddon
```

## Manifest

- [just.config.ts](https://github.com/microsoft/minecraft-scripting-samples/blob/main/script-box/just.config.ts): This file contains build instructions for just-scripts, for building out TypeScript code.
- [scripts](https://github.com/microsoft/minecraft-scripting-samples/blob/main/script-box/scripts): This contains Script Box TypeScript files, that will be compiled and built into your projects.
- [behavior_packs](https://github.com/microsoft/minecraft-scripting-samples/blob/main/script-box/behavior_packs): This contains resources and JSON files that define your behavior pack.
