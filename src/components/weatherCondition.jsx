
export const WeatherCondition = ({feels,celsiusSign,humidity,wind,windSpeed,precipitation,precipitationSign}) => {
    return (
        
            <div className='ui-display-two'>
                    <div>
                        <p>Feels Like</p>
                        <h3>{feels}°{celsiusSign === "Celsius" ? "C" : "F"}</h3>
                    </div>
                    <div>
                        <p>Humidity</p>
                        <h3>{humidity}%</h3>
                    </div>
                    <div>
                    <p>Wind</p>
                    <h3>{wind} {windSpeed === "mph" ? "mph" : "km/h"}</h3>
                    </div>
                    <div> 
                    <p>Precipitation</p>
                    <h3>{precipitation} {precipitationSign === "mm" ? "mm" : "in"}</h3>
                    </div>
            </div>
    )
}
