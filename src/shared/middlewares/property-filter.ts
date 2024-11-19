import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class PropertyFilter implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req.body = this.filterEmpty(req.body)
    next()
  }

  filterEmpty(body: any) {
    if (body && typeof body === 'object') {
      for (const key in body) {
        const value = body[key]
        if (value === '' || value === null || value === undefined) delete body[key]
      }
    }
    return body
  }
}
