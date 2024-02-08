import { Player, world } from "@minecraft/server";
import { Thread } from "./Utils/Threads";
import { TimeDate } from "./Utils/TimeDate";
import { TextBuilder } from "./Utils/RawBuilder";

const config = {
    dynamic: {
        death: "death",
        player_kill: "player_kill",
        player_kill_entity: "player_kill_entity",
        playtime: "playtime"
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * 
 * @param {Player} player 
 */
function playTime() {
    const players = world.getAllPlayers();
    for(let i = 0; i < players.length; i++) { 
        const player = players[i];
        const second = player.getDynamicProperty(config.dynamic.playtime) ?? 0;
        player.setDynamicProperty(config.dynamic.playtime, second + 1);
        continue;
    }
}

function minecraftTicksToRealTime(ticks) {
    const adjustedTicks = (ticks + 6000) % 24000;
    const realSecondsPerTick = (86400 / 24000);
    const totalRealSeconds = adjustedTicks * realSecondsPerTick;
    let hours = Math.floor(totalRealSeconds / 3600) % 24;
    let minutes = Math.floor((totalRealSeconds % 3600) / 60);
    let seconds = Math.floor(totalRealSeconds % 60);

    let formattedHours = hours.toString().padStart(2, '0');
    let formattedMinutes = minutes.toString().padStart(2, '0');
    //let formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
}

function clock() {
    const time = new TimeDate();
    const clock = time.clock("berlin");
    const players = world.getAllPlayers();
    const day = world.getDay();
    const worldTime = world.getAbsoluteTime();

    for(let i = 0; i < players.length; i++) { 
        const player = players[i];
        const playtime = new TimeDate().convertSecondsToDHM(player.getDynamicProperty(config.dynamic.playtime) ?? 0);

        player.onScreenDisplay.setTitle(
            new TextBuilder()
            .setText("Survival")
            .setText("")
            .setText("Profile: ")
            .setText(`Name: ${player.name}`)
            .setText(`Mcid: ${player.id}`)
            .setText(`Playtime: §f${playtime.days}§7d §f${playtime.hours}§7h §f${playtime.minutes}§7m`)
            .setText(`Time: ${clock.hours}:${clock.minutes}`)
            .setText("")
            .setText("World: ")
            .setText(`Online: ${players.length}`)
            .setText(`Time: ${minecraftTicksToRealTime(worldTime)}`)
            .setText(`Day: ${day}`)
            .setText("")
            .setText("Kills & Death: ")
            .setText(`Player: ${player.getDynamicProperty(config.dynamic.player_kill) ?? 0}`)
            .setText(`Entity: ${player.getDynamicProperty(config.dynamic.player_kill_entity) ?? 0} `)
            .setText(`Death: ${player.getDynamicProperty(config.dynamic.death) ?? 0}`)
            .getText()
        )
    }
}

function startEvents() {

    world.afterEvents.entityDie.subscribe((entity) => {
        if(entity.deadEntity.typeId == "minecraft:player") {
            const player = entity.deadEntity;
            const death = player.getDynamicProperty(config.dynamic.death) ?? 0;
            player.setDynamicProperty(config.dynamic.death, death + 1);
        }

        if(entity.damageSource.damagingEntity.typeId == "minecraft:player") { 
            if(entity.deadEntity.typeId == "minecraft:player") { 
                const player = entity.damageSource.damagingEntity;
                const kills = player.getDynamicProperty(config.dynamic.player_kill) ?? 0;
                player.setDynamicProperty(config.dynamic.player_kill, kills + 1);
                return;
            } else {
                const player = entity.damageSource.damagingEntity;
                const kills = player.getDynamicProperty(config.dynamic.player_kill_entity) ?? 0;
                player.setDynamicProperty(config.dynamic.player_kill_entity, kills + 1);
                return;
            }
        }
    })

    world.afterEvents.playerDimensionChange.subscribe((dimension) => {
        world.sendMessage(
            new TextBuilder()
            .setText(`§e${dimension.player.name} ist von der ${capitalizeFirstLetter(dimension.fromDimension.id.replace("minecraft:", ""))} in den ${capitalizeFirstLetter(dimension.toDimension.id.replace("minecraft:", ""))} gewechselt.`, false)
            .getText()
        )
    })
}

const clock_ = new Thread(clock, 0.25);
const playtime_ = new Thread(playTime, 1);

world.afterEvents.worldInitialize.subscribe(() => {
    startEvents();
    clock_.start();
    playtime_.start();
})