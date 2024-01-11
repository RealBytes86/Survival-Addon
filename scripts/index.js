import { Dimension, world } from "@minecraft/server";
import { Thread } from "./Utils/Threads";
import { TimeDate } from "./Utils/TimeDate";
import { TextBuilder } from "./Utils/RawBuilder";

const config = {
    dynamic: {
        death: "death"
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
    let formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}


function clock() {
    const time = new TimeDate();
    const clock = time.clock("berlin");
    const players = world.getAllPlayers();
    const day = world.getDay();
    const worldTime = world.getAbsoluteTime();

    for(let i = 0; i < players.length; i++) { 
        const player = players[i];
        player.onScreenDisplay.setActionBar(
            new TextBuilder()
            .setText(`Real Time: ${clock.hours}:${clock.minutes}:${clock.seconds}`)
            .setText(`World Time: ${minecraftTicksToRealTime(worldTime)}`)
            .setText(`World Day: ${day}`)
            .setText(`Death: ${player.getDynamicProperty(config.dynamic.death) ?? 0}`)
            .getText()
        )
    }
}

function startEvents() {

    world.afterEvents.entityDie.subscribe((entity) => {
        if(entity.deadEntity.typeId == "minecraft:player") {
            const player = entity.deadEntity;
            const death = player.getDynamicProperty(config.dynamic.death);
            if(death == undefined) {
                player.setDynamicProperty(config.dynamic.death, 1);
            } else {
                player.setDynamicProperty(config.dynamic.death, death + 1);
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

const ThreadOne = new Thread(clock, 0);

world.afterEvents.worldInitialize.subscribe(() => {
    startEvents();
    ThreadOne.start();
})