import { ForbiddenException, HttpStatus, Injectable, NestMiddleware, Session } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import session from 'express-session'
import { match } from 'path-to-regexp'
import { AccessType } from 'src/shared/dto/access.dto'
import { AccessService } from 'src/shared/services/access.service'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly accessService: AccessService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const user = req.session.user
    const menuTree = req.session.menuTree

    if (!user) return res.redirect('/admin/login')
    res.locals.user = user

    let accessTree = []
    if (!menuTree || menuTree.length <= 0) {
      accessTree = await this.accessService.findAll()
    }

    const userAccessIds = this.getUserAccessIds(user)
    const tempMenuTree = user.is_super ? (menuTree ?? accessTree) : this.getMenuTree(menuTree ?? accessTree, userAccessIds)
    res.locals.menuTree = tempMenuTree
    req.session.menuTree = tempMenuTree
    if (user.is_super || req.originalUrl === '/admin/dashboard') return next()
    if (!this.hasPermission(user, req.originalUrl))
      res.status(HttpStatus.FORBIDDEN).render('error', { message: '无权限访问此页面', layout: false })
    next()
  }

  private hasPermission(user, url: string) {
    const userAccessUrls = user.roles.flatMap((role) => role.accesses.map((access) => access.url))
    return userAccessUrls.some((urlPattern) => match(urlPattern)(url))
  }

  private getMenuTree(accessTree, userAccessIds) {
    return accessTree.filter((access) => {
      if (access.type === AccessType.PAGE || access.type === AccessType.BUTTON || !userAccessIds.includes(access.id)) return false
      access.children = this.getMenuTree(access.children, userAccessIds)
      return true
    })
  }

  private getUserAccessIds(user) {
    return user.roles.flatMap((role) => role.accesses.map((access) => access.id))
  }
}
