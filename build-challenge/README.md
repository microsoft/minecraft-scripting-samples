---
page_type: sample
author: mammerla
description: Demonstrates basic gameplay of a Build Challenge.
ms.author: mikeam@microsoft.com
ms.date: 10/11/2022
languages:
  - typescript
products:
  - minecraft
---

# Minecraft Build Challenge Example Project

This sample demonstrates a multiplayer build challenge experience.

The Minecraft Build Challenge scales from basic two-hour four-player resource accumulation events up through 32-team multiday events.

The build challenge is a behavior pack that can be added to any world - survival seed worlds would make a great choice.

Play proceeds in two main phases:

1. Build. Every player chooses a team by visiting a "pad" and joining that team. Points are awarded based on the blocks and items that they acquire and return to their pad. Because it's a survival world, players will need to use all their Minecraft survival skills.
1. Vote. In the vote phase, players can choose to vote for two other teams, based on whatever criteria they like. The main vote winners get score multiplier bonuses to their score from the build phase.

There are also other phases:

1. Setup. Here, the gameplay operator can deploy the Build Pads in their desired area of the map.  You can also customize the center of the "donut" of pads as you see fit.
1. Pre phase. Players can gather and hang out before the Build phase begins.




## Manifest

- [gulpfile.js](https://github.com/microsoft/minecraft-scripting-samples/blob/main/ts-starter/gulpfile.js): This file contains build instructions for Gulp, for building out TypeScript code.
- [scripts](https://github.com/microsoft/minecraft-scripting-samples/blob/main/ts-starter/scripts): This contains all of your TypeScript files, that will be compiled and built into your projects.
- [behavior_packs](https://github.com/microsoft/minecraft-scripting-samples/blob/main/ts-starter/behavior_packs): This contains resources and JSON files that define your behavior pack.
