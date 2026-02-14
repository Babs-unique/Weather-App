import dropIcon from  '../assets/icon-dropdown.svg'
import rainImg from '../assets/icon-rain.webp'
import sunImg from '../assets/icon-sunny.webp'
import cloudImg from '../assets/icon-overcast.webp'
import partlyCloudImg from '../assets/icon-partly-cloudy.webp'
import fogImg from '../assets/icon-fog.webp'
import stormImg from '../assets/icon-storm.webp'
import snowImg from '../assets/icon-snow.webp'
export const HourlyCard = ({day,hourlyData,toggle,selectedDay,down}) => {
    const formatHour = (t) => {
        if (!t) return ''
        try {
            const d = new Date(t)
            if (!isNaN(d.getTime())) {
                return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })
            }
        } catch (e) {
            // ignore and fallback
            console.error(e)
        }
        if (typeof t === 'string' && t.length >= 16) return t.slice(11,16)
        return String(t)
    }
    let iconSelection = {
                "rain" : rainImg,
                "sun" : sunImg,
                "cloud": cloudImg,
                "cloud-sun" : partlyCloudImg,
                "fog":fogImg,
                "storm" : stormImg,
                "snow" : snowImg
            };
    return (
        
            <div className='ui-display-four'>
                <div className='forecast'>
                    <p>Hourly Forecast</p>
                        <button onClick={toggle} aria-expanded={down} aria-controls="day-list" type="button">
                                {selectedDay.days}
                                    <img src={dropIcon} alt="" />
                        </button>
                    {down && <div className='toggle-days'>
                            <button id="day-list" onClick={()=> day("days","Monday")} aria-pressed={selectedDay.days === "Monday"} type="button">Monday</button>
                            <button onClick={()=> day("days","Tuesday")} aria-pressed={selectedDay.days === "Tuesday"} type="button">Tuesday</button>
                            <button onClick={()=> day("days","Wednesday")} aria-pressed={selectedDay.days === "Wednesday"} type="button">Wednesday</button>
                            <button onClick={()=> day("days","Thursday")} aria-pressed={selectedDay.days === "Thursday"} type="button">Thursday</button>
                            <button onClick={()=> day("days","Friday")} aria-pressed={selectedDay.days === "Friday"} type="button">Friday</button>
                            <button onClick={()=> day("days","Saturday")} aria-pressed={selectedDay.days === "Saturday"} type="button">Saturday</button>
                            <button onClick={()=> day("days","Sunday")} aria-pressed={selectedDay.days === "Sunday"} type="button">Sunday</button>
                    </div>}
                </div>
                <div className='forecast-time'>
                    {hourlyData.slice(0, 8).map((hour, index) =>( <div 
                    key={index}
                    className='timely-forecast'>
                    <div>
                        <img src={iconSelection[hour.icon]} alt="rainy" />
                        <p>{formatHour(hour.time)}</p>
                    </div>
                    <div>
                        <p>{hour.temperature}°</p>
                    </div>
                    </div>))}
                </div>
            </div>
    )
}
