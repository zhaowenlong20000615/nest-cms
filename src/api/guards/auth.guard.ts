import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { Observable } from 'rxjs'
import { ConfigurationService } from 'src/shared/services/configuration.service'
import { JWTService } from 'src/shared/services/jwt.service'
import { UserService } from 'src/shared/services/user.service'
import { Request } from 'express'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JWTService,
    private readonly userService: UserService,
    private readonly configurationService: ConfigurationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>()
    const token = this.extractTokenFromHeader(req)
    if (!token) throw new UnauthorizedException('没有token！')
    try {
      const { id } = this.jwtService.verify(token, { secret: this.configurationService.jwtSecret })
      const user = await this.userService.findOne({ where: { id }, relations: ['roles', 'roles.accesses'] })
      if (!user) throw new NotFoundException('用户未找到！')
      delete user.password
      req.user = user
      return true
    } catch (error) {
      throw new UnauthorizedException('token无效或已过期！')
    }
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
