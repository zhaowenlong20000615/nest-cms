import { Body, Controller, Get, NotFoundException, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common'
import { User } from 'src/shared/entities/user.entity'
import { ConfigurationService } from 'src/shared/services/configuration.service'
import { JWTService } from 'src/shared/services/jwt.service'
import { UserService } from 'src/shared/services/user.service'
import { UtilityService } from 'src/shared/services/utility.service'
import { AuthGuard } from '../guards/auth.guard'
import { Request } from 'express'

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly utilityService: UtilityService,
    private readonly jwtService: JWTService,
    private readonly configurationService: ConfigurationService,
  ) {}

  @Post('login')
  async login(@Body() body) {
    const { username, password } = body
    const user = await this.validateUser(username, password)
    if (!user) throw new NotFoundException('用户名或密码错误')
    const tokens = this.createJwtToken(user)
    return { ...tokens }
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  profile(@Req() req: Request) {
    return { user: req.user }
  }

  @Post('refresh-token')
  refreshToken(@Body() body) {
    const { refresh_token } = body
    try {
      const decode = this.jwtService.verify(refresh_token, { secret: this.configurationService.jwtRefreshSecret })
      const tokens = this.createJwtToken(decode)
      return { ...tokens }
    } catch (error) {
      throw new UnauthorizedException('refresh_token无效或已过期！')
    }
  }

  private async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findOne({ where: { username }, relations: ['roles', 'roles.accesses'] })
    if (!user) return user
    if (!this.utilityService.comparsePassword(password, user.password)) return null
    return user
  }

  private createJwtToken(user: User) {
    const payload = { id: user.id, username: user.username }
    const access_token = this.jwtService.sign(payload, { secret: this.configurationService.jwtSecret, expiresIn: '10m' })
    const refresh_token = this.jwtService.sign(payload, { secret: this.configurationService.jwtRefreshSecret, expiresIn: '7d' })
    return { access_token, refresh_token }
  }
}
