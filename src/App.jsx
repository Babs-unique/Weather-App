import { useState, useEffect, useRef } from 'react'
import logo from './assets/logo.svg'
import iconUnit from './assets/icon-units.svg'
import dropIcon from './assets/icon-dropdown.svg'
import checkmarkIcon from './assets/icon-checkmark.svg'
import Display from './components/display'
import { HourlyCard } from './components/hourlyCard.jsx'
import { DailyCard } from './components/dailyCard.jsx'
import { WeatherCondition } from './components/weatherCondition.jsx'
import { DisplaySkeleton } from './components/skeletons/DisplaySkeleton.jsx'
import './App.css'

function App() {
  const [selectedUnit, setSelectedUnits] = useState({
    temperature: "Celsius",
    wind: "km/h",
    precipitation: "mm"
  })
  const [selectedDay, setSelectedDay] = useState({ days: "Monday" })
  const [formText, setFormText] = useState("")
  const [down, setDown] = useState(false)
  const [dayDown, setDayDown] = useState(false)
  const [city, setCity] = useState("")
  const [current, setCurrent] = useState(null)
  const [hourly, setHourly] = useState([])
  const [daily, setDaily] = useState([])
  const [icon, setIcon] = useState(null)
  const [temp, setTemp] = useState(null)
  const [match, setMatch] = useState("")
  const [loading, setLoading] = useState(false)
  const [uvIndex, setUvIndex] = useState(null)
  const [visibility, setVisibility] = useState(null)
  const [pressure, setPressure] = useState(null)
/*   const [sunrise, setSunrise] = useState(null)
  const [sunset, setSunset] = useState(null) */
  const [bgClass, setBgClass] = useState('')
  const [favorites, setFavorites] = useState([])
/*   const [compare, setCompare] = useState([]) */
  const [compareData] = useState([])
  const recognitionRef = useRef(null)

  const weatherCodeToIcon = (code) => {
    if (code === 0) return "sun"
    if (code === 1 || code === 2) return "cloud-sun"
    if (code === 3) return "cloud"
    if (code >= 45 && code <= 48) return "fog"
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain"
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return "snow"
    if (code >= 95 && code <= 99) return "storm"
    return "cloud"
  }

  const buildHourlyArray = (hourlyResponse) => {
    const times = hourlyResponse.time || []
    const temps = hourlyResponse.temperature_2m || []
    const apparent = hourlyResponse.apparent_temperature || []
    const humidity = hourlyResponse.relativehumidity_2m || []
    const precipitation = hourlyResponse.precipitation || []
    const wind = hourlyResponse.windspeed_10m || []
    const weathercodes = hourlyResponse.weathercode || []
    const visibilityArr = hourlyResponse.visibility || []
    const uv = hourlyResponse.uv_index || []
    const pressureArr = hourlyResponse.surface_pressure || []

    return times.map((t, i) => ({
      time: t,
      temperature: Math.round(temps[i]),
      apparent_temperature: Math.round(apparent[i] ?? temps[i]),
      humidity: Math.round(humidity[i] ?? 0),
      precipitation: Math.round(precipitation[i] ?? 0),
      wind_speed: Math.round(wind[i] ?? 0),
      icon: weatherCodeToIcon(weathercodes[i]),
      visibility: Math.round(visibilityArr[i] ?? 0),
      uv_index: Math.round(uv[i] ?? 0),
      pressure: Math.round(pressureArr[i] ?? 0)
    }))
  }

  // Unit conversion helpers
  const convertTemp = (val) => {
    if (val == null) return val
    if (selectedUnit.temperature === 'Celsius') return Math.round(val)
    // Celsius to Fahrenheit
    return Math.round((val * 9) / 5 + 32)
}

  const convertWind= (val) => {
    if (val == null) return val
    if (selectedUnit.wind === 'km/h') return Math.round(val)
    // km/h to mph (1 km/h = 0.621371 mph)
    return Math.round(val * 0.621371)
  }

  const convertPrecip = (val) => {
    if (val == null) return val
    if (selectedUnit.precipitation === 'mm') return Math.round(val)
    // mm to inch
    return Math.round(val / 25.4)
  }

  const fetchWeather = async (lat, lon, placeName) => {
    setLoading(true)
    try {
      // request additional hourly variables (visibility, uv_index, surface_pressure)
      const params = [
        'hourly=temperature_2m,apparent_temperature,relativehumidity_2m,precipitation,windspeed_10m,weathercode,visibility,uv_index,surface_pressure',
        'daily=temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset',
        'current_weather=true',
        'timezone=auto'
      ].join('&')

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&${params}`
      const res = await fetch(url)
      const data = await res.json()

      const hourlyArr = buildHourlyArray(data.hourly || {})
      const dailyArr = (data.daily?.time || []).map((d, i) => ({
        day: new Date(d).toLocaleDateString(undefined, { weekday: 'long' }),
        temperature: {
          min: Math.round((data.daily.temperature_2m_min || [])[i] ?? 0),
          max: Math.round((data.daily.temperature_2m_max || [])[i] ?? 0)
        },
        icon: weatherCodeToIcon((data.daily.weathercode || [])[i]),
        sunrise: (data.daily.sunrise || [])[i],
        sunset: (data.daily.sunset || [])[i]
      }))

      const currentWeather = data.current_weather || null
      let currentDetailed = null
      if (currentWeather) {
        const idx = (data.hourly?.time || []).indexOf(currentWeather.time)
        currentDetailed = {
          temperature: Math.round(currentWeather.temperature),
          feels_like: Math.round((data.hourly?.apparent_temperature || [])[idx] ?? currentWeather.temperature),
          humidity: Math.round((data.hourly?.relativehumidity_2m || [])[idx] ?? 0),
          wind_speed: Math.round(currentWeather.windspeed),
          precipitation: Math.round((data.hourly?.precipitation || [])[idx] ?? 0),
          icon: weatherCodeToIcon(currentWeather.weathercode),
          unit: 'Celsius',
          wind: 'km/h',
          precipitationUnit: 'mm',
          uv_index: Math.round((data.hourly?.uv_index || [])[idx] ?? 0),
          visibility: Math.round((data.hourly?.visibility || [])[idx] ?? 0),
          pressure: Math.round((data.hourly?.surface_pressure || [])[idx] ?? 0)
        }
        // set sunrise/sunset if daily contains same-day entries
        /* const todayIdx = 0
        setSunrise((data.daily?.sunrise || [])[todayIdx] ?? null)
        setSunset((data.daily?.sunset || [])[todayIdx] ?? null) */
      }

      setHourly(hourlyArr)
      setDaily(dailyArr)
      setCurrent(currentDetailed)
      setIcon(currentDetailed?.icon ?? null)
      setTemp(currentDetailed?.temperature ?? null)
      setUvIndex(currentDetailed?.uv_index ?? null)
      setVisibility(currentDetailed?.visibility ?? null)
      setPressure(currentDetailed?.pressure ?? null)
      setCity(placeName ?? `${lat.toFixed(2)}, ${lon.toFixed(2)}`)
      setMatch("data")

      // set a simple background class based on top-level icon
      setBgClass((currentDetailed?.icon || 'cloud'))
    } catch (err) {
      console.error(err)
      setMatch("no-data")
    } finally {
      setLoading(false)
    }
  }

  const geocodeCity = async (place) => {
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place)}&count=1`
      const res = await fetch(url)
      const data = await res.json()
      if (data && data.results && data.results.length > 0) {
        const r = data.results[0]
        await fetchWeather(r.latitude, r.longitude, `${r.name}${r.country ? ', ' + r.country : ''}`)
      } else {
        setMatch("no-data")
      }
    } catch (e) {
      console.error(e)
      setMatch("no-data")
    }
  }

  // form submit
  const handleForm = async (e) => {
    e.preventDefault()
    const place = formText.trim()
    if (!place) return
    await geocodeCity(place)
  }

  // load favorites from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('favorites')
      if (raw) setFavorites(JSON.parse(raw))
    } catch (e) {
      console.warn('Failed to read favorites', e)
    }
  }, [])

  const toggleFavorite = (placeName) => {
    if (!placeName) return
    const exists = favorites.includes(placeName)
    const next = exists ? favorites.filter(f => f !== placeName) : [...favorites, placeName]
    setFavorites(next)
    localStorage.setItem('favorites', JSON.stringify(next))
  }

  /* const addCompare = (placeName) => {
    if (!placeName) return
    if (compare.includes(placeName)) return
    (async () => {
      try {
        // if comparing current city, reuse current state
        if (placeName === city && current) {
          setCompare(prev => (prev.length >= 2 ? [prev[1], placeName] : [...prev, placeName]))
          setCompareData(prev => (prev.length >= 2 ? [prev[1], { place: placeName, current }] : [...prev, { place: placeName, current }]))
          return
        } */
        // lookup coordinates for placeName
      /*   const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(placeName)}&count=1`)
        const geoJson = await geoRes.json()
        if (!geoJson || !geoJson.results || geoJson.results.length === 0) return
        const r = geoJson.results[0]
        const summary = await fetchWeatherSummary(r.latitude, r.longitude, `${r.name}${r.country ? ', ' + r.country : ''}`)
        setCompare(prev => (prev.length >= 2 ? [prev[1], placeName] : [...prev, placeName]))
        setCompareData(prev => (prev.length >= 2 ? [prev[1], { place: placeName, current: summary.current }] : [...prev, { place: placeName, current: summary.current }]))
      } catch (e) {
        console.warn('compare failed', e)
      }
    })()
  } */

/*   const removeCompare = (placeName) => {
    setCompare(prev => prev.filter(p => p !== placeName))
    setCompareData(prev => prev.filter(d => d.place !== placeName))
  }
 */
  // fetch a lightweight weather summary without mutating main UI state
 /*  const fetchWeatherSummary = async (lat, lon, placeName) => {
    try {
      const params = [
        'hourly=temperature_2m,apparent_temperature,relativehumidity_2m,precipitation,windspeed_10m,weathercode',
        'daily=temperature_2m_max,temperature_2m_min,weathercode',
        'current_weather=true',
        'timezone=auto'
      ].join('&')
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&${params}`
      const res = await fetch(url)
      const data = await res.json()
      const currentWeather = data.current_weather || null
      const summary = { place: placeName, current: null }
      if (currentWeather) {
        const idx = (data.hourly?.time || []).indexOf(currentWeather.time)
        summary.current = {
          temperature: Math.round(currentWeather.temperature),
          feels_like: Math.round((data.hourly?.apparent_temperature || [])[idx] ?? currentWeather.temperature),
          humidity: Math.round((data.hourly?.relativehumidity_2m || [])[idx] ?? 0),
          wind_speed: Math.round(currentWeather.windspeed),
          precipitation: Math.round((data.hourly?.precipitation || [])[idx] ?? 0),
          icon: weatherCodeToIcon(currentWeather.weathercode)
        }
      }
      return summary
    } catch (e) {
      console.warn('summary fetch failed', e)
      return { place: placeName, current: null }
    }
  }
 */
  // On load, request geolocation
  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords
      await fetchWeather(latitude, longitude, 'Your location')
    }, (err) => {
      console.warn('Geolocation failed or denied', err)
    })
  }, [])

  // Initialize voice recognition (if available)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return
    const r = new SpeechRecognition()
    r.lang = 'en-US'
    r.interimResults = false
    r.maxAlternatives = 1
    r.onresult = async (e) => {
      const transcript = e.results[0][0].transcript
      setFormText(transcript)
      await geocodeCity(transcript)
    }
    r.onerror = (err) => console.warn('Speech recognition error', err)
    recognitionRef.current = r
  }, [])

  const toggle = () => setDown(prev => !prev)
  const toggleDay = () => setDayDown(prev => !prev)

  const handleSelect = (category, value) => {
    setSelectedUnits(prevSelect => ({ ...prevSelect, [category]: value }))
  }
  const daySelect = (category, value) => {
    setSelectedDay(prev => ({ ...prev, [category]: value }))
  }

  // Group hourly by day name for day selector
  // create a converted copy of hourly data according to selected units
  const convertedHourly = hourly.map(h => ({
    ...h,
    temperature: convertTemp(h.temperature),
    wind_speed: convertWind(h.wind_speed),
    precipitation: convertPrecip(h.precipitation)
  }))

  const groupedByDate = convertedHourly.reduce((acc, h) => {
    const dayName = new Date(h.time).toLocaleDateString(undefined, { weekday: 'long' })
    acc[dayName] = acc[dayName] || []
    acc[dayName].push(h)
    return acc
  }, {})
  const checkHourly = groupedByDate[selectedDay.days] || []

  const mappedHourlyData = checkHourly.length > 0 ? (
    <HourlyCard
      hourlyData={checkHourly}
      day={daySelect}
      down={dayDown}
      toggle={toggleDay}
      selectedDay={selectedDay}
      countryName={city}
    />
  ) : (
    <HourlyCard
      hourlyData={hourly.slice(0, 8)}
      day={daySelect}
      down={dayDown}
      toggle={toggleDay}
      selectedDay={selectedDay}
      countryName={city}
    />
  )

  const dailyCard = daily.map((dayObj, index) => (
    <DailyCard key={index}
      day={dayObj.day}
      temp={{ min: convertTemp(dayObj.temperature.min), max: convertTemp(dayObj.temperature.max) }}
      icon={dayObj.icon}
    />
  ))

  return (
    <>
      <header className="app-header">
        <div className="logo-wrap"><img src={logo} alt="WebApp Logo" /></div>
        <div className="units-wrap">
          <button onClick={toggle} className="units-btn">
            <img src={iconUnit} alt="" /> Units <img src={dropIcon} alt="" />
          </button>
          {down && <div className='toggle-design'>
            <h4>Switch units</h4>
            <p>Temperature</p>
            <div onClick={() => handleSelect("temperature", "Celsius")}>
              <span>Celsius(°C)</span> {selectedUnit.temperature === "Celsius" && <img src={checkmarkIcon} alt="selected" />}
            </div>
            <div onClick={() => handleSelect("temperature", "Fahrenheit")}>
              <span>Fahrenheit(°F)</span> {selectedUnit.temperature === "Fahrenheit" && <img src={checkmarkIcon} alt="selected" />}
            </div>
            <hr />
            <span>Wind Speed</span>
            <div onClick={() => handleSelect("wind", "km/h")}>
              <span>Km/h</span> {selectedUnit.wind === "km/h" && <img src={checkmarkIcon} alt="selected" />}
            </div>
            <div onClick={() => handleSelect("wind", "mph")}>
              <span>mph</span> {selectedUnit.wind === "mph" && <img src={checkmarkIcon} alt="selected" />}
            </div>
            <hr />
            <span>Precipitation</span>
            <div onClick={() => handleSelect("precipitation", "mm")}>
              <span>mm</span> {selectedUnit.precipitation === "mm" && <img src={checkmarkIcon} alt="selected" />}
            </div>
            <div onClick={() => handleSelect("precipitation", "inch")}>
              <span>inch</span> {selectedUnit.precipitation === "inch" && <img src={checkmarkIcon} alt="selected" />}
            </div>
          </div>}
        </div>
      </header>

      <main className="app-main">
        <section><h1>How's the sky looking today?</h1></section>

        <section className='search'>
          <form onSubmit={handleForm}>
            <input type="text" name='text' placeholder="🍳 Search for a place..." value={formText} onChange={(e) => setFormText(e.target.value)} />
            <button type="submit">Search</button>
          </form>
          {favorites.length > 0 && (
            <div className='favorites-bar'>
              <p>Favorites:</p>
              <div className='favorites-list'>
                {favorites.map((f, i) => (
                  <div key={i} className='fav-item'>
                    <button onClick={() => geocodeCity(f)}>{f}</button>
                    <button onClick={() => toggleFavorite(f)}>Remove</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {loading && <p>Loading weather...</p>}

        {match === "no-data" ? <p>Search results not found!</p> :
          <section className='ui-display'>
            <Display countryName={city} icon={icon} temp={convertTemp(temp)}/*  sunrise={sunrise} sunset={sunset} */ bgClass={bgClass} />
            {/* <div className='display-actions'>
              <button onClick={() => toggleFavorite(city)} title="Save to favorites">{favorites.includes(city) ? '★ Saved' : '☆ Save'}</button>
              <button onClick={() => addCompare(city)} title="Add to compare">Compare</button>
              <button onClick={() => recognitionRef.current?.start()} title="Voice search">🎤</button>
            </div> */}
            {mappedHourlyData}
            {compareData.length > 0 && (
              <div className='compare-panel'>
                <h3>Compare</h3>
                <div className='compare-cards'>
                  {compareData.map((c, idx) => (
                    <div key={idx} className='compare-card'>
                      <strong>{c.place}</strong>
                      {c.current ? (
                        <div>
                          <p>{convertTemp(c.current.temperature)}°</p>
                          <p>Feels {convertTemp(c.current.feels_like)}°</p>
                          <p>{c.current.humidity}%</p>
                          <p>{convertWind(c.current.wind_speed)} {selectedUnit.wind}</p>
                        </div>
                      ) : <p>No data</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className='ui-display-three'>
              <div><p>Daily Forecast</p></div>
              <div className='inner-boxes'>{dailyCard}</div>
            </div>
            <WeatherCondition
              current={current}
              feels={convertTemp(current?.feels_like)}
              humidity={current?.humidity}
              wind={convertWind(current?.wind_speed)}
              precipitation={convertPrecip(current?.precipitation)}
              uvIndex={uvIndex}
              visibility={visibility}
              pressure={pressure}
              celsiusSign={selectedUnit.temperature}
              windSpeed={selectedUnit.wind}
              precipitationSign={selectedUnit.precipitation}
            />
          </section>}
      </main>
    </>
  )
}

export default App
