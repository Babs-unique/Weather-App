import rainImg from '../assets/icon-rain.webp'
import sunImg from '../assets/icon-sunny.webp'
import cloudImg from '../assets/icon-overcast.webp'
import partlyCloudImg from '../assets/icon-partly-cloudy.webp'
import fogImg from '../assets/icon-fog.webp'
import stormImg from '../assets/icon-storm.webp'
import snowImg from '../assets/icon-snow.webp'
export const DailyCard = ({icon,day,temp}) => {
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
            <div className='inner-box'>
                <div>
                <p>{day}</p>
                </div>
                <div>
                <img src={iconSelection[icon]} alt={icon} />
                </div>
                <div>
                <p>{temp.min}°</p>
                <p>{temp.max}°</p>
                </div>
            </div>
    )
}
