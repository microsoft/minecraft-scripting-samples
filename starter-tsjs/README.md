# ---
# page_type: sample
# author: keyyard
# description: A basic Hello World example of developing Minecraft scripts using TypeScript or JavaScript and a build process.
# ms.author: contact@keyyard.xyz
# ms.date: 13/06/2025
# languages:
#   - typescript
#   - javascript
# products:
#   - minecraft
# ---

# Minecraft Starter TSJS Project

This sample demonstrates a simple build process for Minecraft that supports both TypeScript and JavaScript. It's ideal for those migrating from JavaScript to TypeScript, or anyone who wants a flexible starter boilerplate. You can use Script APIs to build out simple or advanced gameplay styles, and this project serves as a great foundation for your own scripting projects—whether you prefer JS, TS, or a mix of both. For a more complete tutorial using this starter, see the [official documentation](https://learn.microsoft.com/minecraft/creator/documents/scriptinggettingstarted).

## Prerequisites

### Install Node.js tools, if you haven't already

We're going to use the Node Package Manager (or NPM) to get more tools to make the process of building our project easier.

Visit [https://nodejs.org/](https://nodejs.org).

Download the version with "LTS" next to the number and install it. (LTS stands for Long Term Support, if you're curious.) You do not need to install any additional tools for Native compilation.

### Install Visual Studio Code, if you haven't already

Visit the [Visual Studio Code website](https://code.visualstudio.com) and install Visual Studio Code.

## Getting Started

1. Using a copy of this starter project from GitHub - you can get a copy of this project by visiting [https://github.com/microsoft/minecraft-scripting-samples/](https://github.com/microsoft/minecraft-scripting-samples/) and, under the Code button, selecting `Download ZIP`.

1. The `starter-tsjs` folder (this folder) contains a starter TypeScript project for Minecraft.

1. To make your own environment look like the example, create a folder on your `C:\` drive and call it **projects**. Create a subfolder called **cotta**.

1. Put the extracted contents of the TypeScript Starter Project folder into **cotta**.

1. Open a Windows Terminal or PowerShell window and change the working directory to your **cotta** folder:

   ```powershell
   cd c:\projects\cotta\
   ```

1. Use NPM to install our tools:

   ```powershell
   npm i
   ```

1. Use this shortcut command to open the project in Visual Studio Code:

   ```powershell
   code .
   ```

It might also ask you to install the Minecraft Debugger and Blockception's Visual Studio Code plugin, which are plugins to Visual Studio Code that can help with Minecraft development. Go ahead and do that, if you haven't already.

## Testing and Building

Within the root folder of this sample, run this command:

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

- [just.config.ts](https://github.com/microsoft/minecraft-scripting-samples/blob/main/starter-tsjs/just.config.ts): This file contains build instructions for just-scripts, for building out TypeScript code.
- [scripts](https://github.com/microsoft/minecraft-scripting-samples/blob/main/starter-tsjs/scripts): This contains all of your TypeScript files, that will be compiled and built into your projects.
- [behavior_packs](https://github.com/microsoft/minecraft-scripting-samples/blob/main/starter-tsjs/behavior_packs): This contains resources and JSON files that define your behavior pack.
