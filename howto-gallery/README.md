---
page_type: sample
author: mammerla
description: A comprehensive gallery of different samples of Minecraft coding behaviors.
ms.author: mikeam@microsoft.com
ms.date: 05/05/2022
languages:
  - typescript
products:
  - minecraft
---

# Minecraft How-to Gallery

This sample contains many code snippets that show how you can manipulate basic Minecraft behaviors.

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

1. When that's done, enter:

   ```powershell
   npm i gulp-cli --global
   ```

1. Use this shortcut command to open the project in Visual Studio Code:

   ```powershell
   code .
   ```

### Chapter 2. Let's test the parts of our project

Within the root folder (howto-gallery) of this sample, run this command:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Run this one, too.

```powershell
gulp
```

Deploy a test world to your Minecraft instance.

```powershell
gulp updateworld
```


## Manifest

- [gulpfile.js](https://github.com/microsoft/minecraft-scripting-samples/blob/main/howto-gallery/gulpfile.js): This file contains build instructions for Gulp, for building out TypeScript code.
- [scripts](https://github.com/microsoft/minecraft-scripting-samples/blob/main/howto-gallery/scripts): This contains How to Gallery TypeScript files, that will be compiled and built into your projects.
- [behavior_packs](https://github.com/microsoft/minecraft-scripting-samples/blob/main/howto-gallery/behavior_packs): This contains resources and JSON files that define your behavior pack.
