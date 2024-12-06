import { Body, Controller, Get, Post, Redirect, Render, Res, Session } from '@nestjs/common'
import { Response } from 'express'
import { UserService } from 'src/shared/services/user.service'
import { UtilityService } from 'src/shared/services/utility.service'

@Controller('admin')
export class AuthController {
  constructor(
    private readonly utilityService: UtilityService,
    private readonly userService: UserService,
  ) {}

  @Get('login')
  index(@Res() res: Response) {
    res.render('auth/login', { layout: false })
  }

  @Post('login')
  async login(@Body() body, @Res() res: Response, @Session() session) {
    const { username, password, captcha } = body
    if (session?.captcha?.toLowerCase() !== captcha?.toLowerCase()) res.render('auth/login', { message: '验证码错误', layout: false })
    const user = await this.userService.findOne({ where: { username }, relations: ['roles', 'roles.accesses'] })
    if (!user || !this.utilityService.comparsePassword(password, user.password))
      return res.render('auth/login', { message: '用户名或密码错误', layout: false })
    session.user = user
    res.redirect('/admin/dashboard')
  }

  @Get('captcha')
  captcha(@Res() res: Response, @Session() session) {
    const captcha = this.utilityService.generateCaptcha({ size: 2, ignoreChars: '0o1i' })
    session.captcha = captcha.text
    res.type('svg')
    res.send(captcha.data)
  }

  @Get('logout')
  @Redirect('/admin/login')
  logout(@Session() session) {
    session.user = null
    session.menuTree = null
  }
}
