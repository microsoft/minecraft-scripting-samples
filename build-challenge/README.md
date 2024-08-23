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

1. Setup. Here, the gameplay operator can deploy the Build Pads in their desired area of the map. You can also customize the center of the "donut" of pads as you see fit.
1. Pre phase. Players can gather and hang out before the Build phase begins.
1. Post phase. Voting is over, and the world is in adventure mode.

## Development Commands

- Use NPM to install our tools:

```powershell
   npm i
```

- Run this one to deploy in the game.

```powershell
   npm run local-deploy
```

- To run lint use this shortcut command:

```powershell
   npm run lint
```

- To auto fix issues use this:

```powershell
   npm run lint -- --fix
```

- Create an addon file to share.

```powershell
   npm run mcaddon
```

- Deploy a test world to your Minecraft instance.

```powershell
   npm run update-world
```

- To create a world file to share run this.

```powershell
   npm run pack-world
```

## How to play this content

You'll likely want to host this on a shared dedicated server that is up for hours or days at a time.

[See the Scoresheet for how scoring is done.](ScoreSheet.md)

First, start a survival world. Choose a world with a seed you like, or just find a nice spot in the world you start up with.

Choose a relatively flat plain or desert area as your starting area. Go to the north west corner of the starting area (minimal x/z), and go to the bottom floor of that location. Note the x/y/z coordinates. Go to chat and run this pseudo command: "!setstart x y z" with the location of your x/y/z contents. Over the next couple of minutes or so, you should see the pads pop in. Please be patient.

!NOTE: There may be some issues with the pads popping in, fully, so you may want to run the command a second time several minutes after the first one has started.

Use !setphase setup to enter your initial setup. !setphase build to put the world into build mode. !setphase vote to put the world into vote mode.

## Commands

`!setstart x y z` - Sets the starting location of this map. This should be the north/west/bottom of your play area.

Team Pads are arranged like this:

```dotnetcli
16 17  8  9 18 19
20 21  4  5 22 23
14  0        2 10
15  1        3 11
24 25  6  7 26 27
28 29 12 13 30 31
```

Each team pad is 32 blocks X by 32 blocks Z, and is 64 blocks tall (Y). Each pad has 32 blocks around it.

For this reason, the play area is a wide 384 blocks by 384 blocks tall, even if you only play with 4 teams (pads). See that there is a 128 block by 128 block "donut hole" in the middle, which you can use to creatively place your welcome center as you see fit.

`!setsize [s/m/l/xl]` - Sets the relative size of the gameplay area, and the number of teams that can be accommodated. See the diagram above for how pads are provisioned - for example, in an 8 team/pad game, pads 0-7 are provisioned.

`s` - (the default). 4 teams (pads)
`m` - 8 teams/pads
`l` - 16 teams/pads
`xl` - 32 teams/pads

Note that this can only be set while the phase is in setup. Also, it is only supported to upgrade your size (e.g, from s->m or s->l or m->xl)

`!setphase [setup/pre/build/vote/post]` - Sets the current phase of the game.

- setup - Places the mode generally in creative. As the game host, you can build and create and run other commands.
- pre - this is in the pre-phase of the game. The game is in Adventure mode so customizations cannot be made. This might be useful as a lobby to assembly players before the formal build event starts.
- build - This is the build phase of the game. Players are actively playing and can modify the world and are generally running in Survival mode
- vote - This is the voting phase of the game. Players can apply two votes to the pad of their choice (not including their own team pad)

`!setscoring [blockvalues/votes]` - Sets the scoring mode of the game.
        
* blockvalues - Uses block values as the primary scoring tool of the game, with bonuses for votes and more
* votes - Derives a score purely based on the number of votes.

`!setrole [player name] [role]` - Sets the role of the current player.

- spectator - Places the player on a "camera track" above the play area
- admin - Makes the player an administrator
- player - Makes the player a regular contestant

`!setmotdtitle <message>` - Sets the main message of the day header.
`!setmotdsubtitle <message>` - Sets the subtitle message of the day header.

## Manifest

- [just.config.ts](https://github.com/microsoft/minecraft-scripting-samples/blob/main/build-challenge/just.config.ts): This file contains build instructions for just-scripts, for building out TypeScript code.
- [scripts](https://github.com/microsoft/minecraft-scripting-samples/blob/main/build-challenge/scripts): This contains all of the Build Challenge TypeScript files, that will be compiled and built into your projects.
- [behavior_packs](https://github.com/microsoft/minecraft-scripting-samples/blob/main/build-challenge/behavior_packs): This contains resources and JSON files that define the Build Challenge behavior pack.
