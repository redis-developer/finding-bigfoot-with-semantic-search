import { html } from 'lit'

import UnlitElement from '../util/unlit-element.js'

/*
 * This component could stand to be busted up into some smaller components.
 */

export default class SightingWeather extends UnlitElement {

  static properties = {
    sighting: { type: Object }
  }

  render() {

    const moonPhase = new MoonPhase(this.sighting.moonPhase)
    const cloudCover = new CloudCover(this.sighting.cloudCover)
    const wind = new Wind(this.sighting.windSpeed, this.sighting.windBearing)

    const temperature = this.#formatTemperature(this.sighting.midTemp)
    const weatherIcon = this.#selectWeatherIcon(cloudCover.icon, this.sighting.precipitationType)
    const weatherSummary = this.sighting.weatherSummary

    const highLow = this.#formatHighLow(this.sighting)
    const humidity = this.#formatHumidity(this.sighting)
    const pressure = this.#formatPressure(this.sighting)
    const visibility = this.#formatVisibility(this.sighting)
    const dewPoint = this.#formatTemperature(this.sighting.dewPoint)
    const uvIndex = this.#formatUvIndex(this.sighting)

    const precipitationIcon = this.#selectPrecipitationIcon(this.sighting)
    const precipitationChance = this.#formatPrecipitationChance(this.sighting)

    return html`
      <h2 class="text-xl font-semibold pt-4">Weather</h2>

      <p class="pt-1">
        <span class="text-3xl pr-1">${temperature}</span>
        <span class="text-3xl pr-1">${weatherIcon}</span>
        <span>${weatherSummary}</span>
      </p>

      <div class="flex flex-row items-top w-full pt-4">

        <div class="flex flex-col items-left w-full">
          <div class="flex flex-row items-top border-b px-2 py-1">
            <p class="pr-3">🌡️</p>
            <p class="min-w-24 font-semibold">High/Low</p>
            <p class="w-full text-right">${highLow}</p>
          </div>
          <div class="flex flex-row items-top border-b px-2 py-1">
            <p class="pr-3">${precipitationIcon}</p>
            <p class="min-w-24 font-semibold">Precipitation</p>
            <p class="w-full text-right">${precipitationChance}</p>
          </div>
          <div class="flex flex-row items-top border-b px-2 py-1">
            <p class="pr-3">💧</p>
            <p class="min-w-24 font-semibold">Humidity</p>
            <p class="w-full text-right">${humidity}</p>
          </div>
          <div class="flex flex-row items-top border-b px-2 py-1">
            <p class="pr-3">⏬</p>
            <p class="min-w-24 font-semibold">Pressure</p>
            <p class="w-full text-right">${pressure}</p>
          </div>
          <div class="flex flex-row items-top px-2 py-1">
            <p class="pr-3">👁️</p>
            <p class="min-w-24 font-semibold">Visibility</p>
            <p class="w-full text-right">${visibility}</p>
          </div>
        </div>

        <div class="flex flex-col items-left w-full ml-4">
          <div class="flex flex-row items-top border-b px-2 py-1">
            <p class="pr-3">💨</p>
            <p class="min-w-24 font-semibold">Wind</p>
            <p class="w-full text-right">${wind.text}</p>
          </div>
          <div class="flex flex-row items-top border-b px-2 py-1">
            <p class="pr-3">${cloudCover.icon}</p>
            <p class="min-w-24 font-semibold">Cloud Cover</p>
            <p class="w-full text-right">${cloudCover.text}</p>
          </div>
          <div class="flex flex-row items-top border-b px-2 py-1">
            <p class="pr-3">💧</p>
            <p class="min-w-24 font-semibold">Dew Point</p>
            <p class="w-full text-right">${dewPoint}</p>
          </div>
          <div class="flex flex-row items-top border-b px-2 py-1">
            <p class="pr-3">🧴</p>
            <p class="min-w-24 font-semibold">UV Index</p>
            <p class="w-full text-right">${uvIndex}</p>
          </div>
          <div class="flex flex-row items-top px-2 py-1">
            <p class="pr-3">${moonPhase.icon}</p>
            <p class="min-w-48 font-semibold">Moon Phase</p>
            <p class="w-full text-right">${moonPhase.text}</p>
          </div>
        </div>
      </div>
    `
  }

  #selectWeatherIcon(cloudCoverIcon, precipitationType) {
    if (precipitationType === 'rain') return '🌧️'
    else if (precipitationType === 'snow') return '🌨️'
    return cloudCoverIcon
  }

  #formatTemperature(temperature) {
    if (temperature === undefined) return '--'
    return `${Math.round(temperature)}°F`
  }

  #formatHighLow({ lowTemp, highTemp }) {
    return `${this.#formatTemperature(lowTemp)} / ${this.#formatTemperature(highTemp)}`
  }

  #formatHumidity({ humidity }) {
    if (humidity === undefined) return '--'
    return this.#formatPercentage(humidity)
  }

  #formatPressure({ pressure }) {
    if (pressure === undefined) return '--'
    return `${pressure} mb`
  }

  #formatVisibility({ visibility }) {
    if (visibility === undefined) return '--'
    return `${Math.round(visibility)} miles`
  }

  #formatUvIndex({ uvIndex }) {
    if (uvIndex === undefined) return '--'
    return `${uvIndex}`
  }

  #selectPrecipitationIcon({ precipitationType }) {
    return precipitationType === 'snow' ? '🌨️' : '🌧️'
  }

  #formatPrecipitationChance({ precipitationProbability }) {
    if (!precipitationProbability) return '--'
    return this.#formatPercentage(precipitationProbability)
  }

  #formatPercentage(number) {
    if (number === undefined) return '--'
    return `${Math.round(number * 100)}%`
  }
}

customElements.define('sighting-weather', SightingWeather)

class MoonPhase {

  #name = [
    'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
    'Full Moon', 'Waning Gibbous', 'Third Quarter', 'Waning Crescent', 'New Moon' ]
  #icons = [ '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌑' ]
  #index = 0

  constructor(moonPhase) {
    this.#index = moonPhase === undefined ? -1 : Math.round(moonPhase * 8)
  }

  get text() {
    if (this.#index === -1) return 'Unknown'
    return this.#name[this.#index]
  }

  get icon() {
    if (this.#index === -1) return '🌕'
    return this.#icons[this.#index]
  }
}

class CloudCover {

  #names = [ 'Clear', 'Mostly clear', 'Partly cloudy', 'Mostly cloudy', 'Cloudy', 'Cloudy' ]
  #icons = [ '☀️', '🌤️', '⛅️', '🌥️', '☁️', '☁️' ]
  #index = 0

  constructor(cloudCover) {
    this.#index = cloudCover === undefined ? -1 : Math.round(cloudCover * 5)
  }

  get text() {
    if (this.#index === -1) return 'Unknown'
    return this.#names[this.#index]
  }

  get icon() {
    if (this.#index === -1) return '🌤️'
    return this.#icons[this.#index]
  }
}

class Wind {
  #directions = [ 'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW' ]
  #speed = 0
  #index = 0

  constructor(speed, bearing) {
    if (speed === undefined || bearing === undefined) {
      this.#index = -1
    } else {
      this.#speed = Math.round(speed)
      this.#index = Math.round(Number(bearing) / 22.5)
    }
  }

  get text() {
    if (this.#index === -1) return 'Unknown'
    return `${this.#directions[this.#index]} ${this.#speed} mph`
  }
}
