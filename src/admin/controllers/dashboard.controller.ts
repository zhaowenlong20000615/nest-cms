import { Controller, Get, Param, Query, Render, Req, Sse } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { interval, map, mergeMap } from 'rxjs'
import { DashboardService } from 'src/shared/services/dashboard.service'
import { SystemService } from 'src/shared/services/system.service'
import { WeatherService } from 'src/shared/services/weather.service'

@Controller('admin/dashboard')
@ApiTags('admin/dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly weatherService: WeatherService,
    private readonly systemService: SystemService,
  ) {}

  @Get()
  @Render('dashboard')
  async index() {
    const result = await this.dashboardService.getStatisticsData()
    return { ...result }
  }

  @Get('weather/:ip')
  async weather(@Param('ip') ip: string) {
    const weather = await this.weatherService.getWeather(ip)
    return { weather }
  }

  @Sse('systemInfo')
  systemInfo() {
    return interval(3000).pipe(
      mergeMap(() => this.systemService.getSystemInfo()),
      map((systemInfo) => ({ data: systemInfo })),
    )
  }
}
