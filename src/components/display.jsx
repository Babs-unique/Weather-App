import rainImg from '../assets/icon-rain.webp'
import sunImg from '../assets/icon-sunny.webp'
import cloudImg from '../assets/icon-overcast.webp'
import partlyCloudImg from '../assets/icon-partly-cloudy.webp'
import fogImg from '../assets/icon-fog.webp'
import stormImg from '../assets/icon-storm.webp'
import snowImg from '../assets/icon-snow.webp'
function Display({icon,temp,countryName,bgClass}){
    let iconSelection = {
                    "rain" : rainImg,
                    "sun" : sunImg,
                    "cloud": cloudImg,
                    "cloud-sun" : partlyCloudImg,
                    "fog":fogImg,
                    "storm" : stormImg,
                    "snow" : snowImg
                };
    return(
        <>
            <div className={`ui-display-one ${bgClass || ''}`} role="region" aria-label={`Current weather for ${countryName}`} tabIndex={0}>
                    <div className='country-details'>
                    <h2>{countryName}</h2>
                    <p>{new Date().toLocaleString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                    {/* <p className='sun-times'>Sunrise: {sunrise ?? '—'} • Sunset: {sunset ?? '—'}</p> */}
                    </div>
                    <div>
                    <img src={iconSelection[icon]} alt={icon || 'weather icon'}/>
                    <i>{temp}°</i>
                    </div>
            </div>
        </>
    )
}
export default Display;
