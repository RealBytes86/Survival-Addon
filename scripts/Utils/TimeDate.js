
export class TimeDate{

    clock(contry) {

        if(!contry) {
            return "no parameter.";
        }
        
        let timezoneOffset = 2;
        const now = new Date();

        switch(contry.toLowerCase()) {
            case "berlin":
                timezoneOffset = 1 * 60 * 60 * 1000;
                break;
            case "new_york":
                timezoneOffset = -3 * 60 * 60 * 1000;
                break;
            case "london":
                timezoneOffset = 0 * 60 * 60 * 1000;
                break;
            case "tokyo":
                timezoneOffset = 8 * 60 * 60 * 1000;
                break;
            case "sydney":
                timezoneOffset = 9 * 60 * 60 * 1000;
                break;
            case "moscow":
                timezoneOffset = 2 * 60 * 60 * 1000;
                break;
            case "los_angeles":
                timezoneOffset = -6 * 60 * 60 * 1000;
                break;
            case "hong_kong":
                timezoneOffset = 7 * 60 * 60 * 1000;
                break;
            case "dubai":
                timezoneOffset = 3 * 60 * 60 * 1000;
                break;
            case "mumbai":
                timezoneOffset = 4.5 * 60 * 60 * 1000;
                break;
            default:
                timezoneOffset = 1 * 60 * 60 * 1000;
                break;
        }

        const countryTime = new Date(now.getTime() + timezoneOffset);
        
        let hours = countryTime.getHours();
        let minutes = countryTime.getMinutes();
        let seconds = countryTime.getSeconds();
        
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        return { hours: hours, minutes: minutes, seconds: seconds, date: countryTime };
    }

    SecondToTick(second) {
        if(typeof second == "string") return "no number";
        return second * 20;
    }

    formatTime(seconds) {
        let hours = Math.floor(seconds / 3600);
        let minutes = Math.floor((seconds % 3600) / 60);
        let remainingSeconds = seconds % 60;
        return hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + remainingSeconds.toString().padStart(2, '0');
    }

    convertSecondsToDHM(seconds) {
        let days = Math.floor(seconds / (24 * 60 * 60));
        let hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
        let minutes = Math.floor((seconds % (60 * 60)) / 60);
        let remainingSeconds = seconds % 60;
    
        return {
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: remainingSeconds
        };
    }
}

export function TicksToSeconds(second) { 
    return second * 20;
}