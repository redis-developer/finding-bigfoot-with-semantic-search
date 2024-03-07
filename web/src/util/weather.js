export class MoonPhase {

  #name = [
    'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
    'Full Moon', 'Waning Gibbous', 'Third Quarter', 'Waning Crescent' ]
  #icons = [ '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘' ]
  #index = 0

  constructor(moonPhase) {
    if (moonPhase === undefined) this.#index = -1
    else if (moonPhase <= 0.0625) this.#index = 0
    else if (moonPhase <= 0.1875) this.#index = 1
    else if (moonPhase <= 0.3125) this.#index = 2
    else if (moonPhase <= 0.4375) this.#index = 3
    else if (moonPhase <= 0.5625) this.#index = 4
    else if (moonPhase <= 0.6875) this.#index = 5
    else if (moonPhase <= 0.8125) this.#index = 6
    else if (moonPhase <= 0.9375) this.#index = 7
    else this.#index = 0
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

export class CloudCover {

  #names = [ 'Clear', 'Mostly clear', 'Partly cloudy', 'Mostly cloudy', 'Cloudy' ]
  #icons = [ '☀️', '🌤️', '⛅️', '🌥️', '☁️' ]
  #index = 0

  constructor(cloudCover) {
    if (cloudCover === undefined) this.#index = -1
    else if (cloudCover <= 0.125) this.#index = 0
    else if (cloudCover <= 0.375) this.#index = 1
    else if (cloudCover <= 0.625) this.#index = 2
    else if (cloudCover <= 0.875) this.#index = 3
    else this.#index = 4
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

export class Wind {
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
