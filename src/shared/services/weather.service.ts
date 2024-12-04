import { Injectable } from '@nestjs/common'
import { ConfigurationService } from './configuration.service'
import axios from 'axios'
import * as https from 'https'
import * as geoip from 'geoip-lite'

@Injectable()
export class WeatherService {
  constructor(private readonly configurationService: ConfigurationService) {}

  async getWeather(ip: string) {
    const geo = geoip.lookup(ip)
    const location = geo ? `${geo.city}, ${geo.country}` : 'Unknown'
    if (!geo) return '无法获取天气信息'

    const weatherApiKey = this.configurationService.weatherApiKey
    const weatherApiUrl = this.configurationService.weatherApiUrl
    const response = await axios.get(`${weatherApiUrl}?lang=zh&key=${weatherApiKey}&q=${location}`)
    return `${response.data.current.temp_c}°C, ${response.data.current.condition.text}`
  }
}
