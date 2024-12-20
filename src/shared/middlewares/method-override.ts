import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class MethodOverride implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      req.method = req.body._method.toUpperCase()
      delete req.body._method
    }
    next()
  }
}
