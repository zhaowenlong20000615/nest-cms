import { Injectable } from '@nestjs/common'
import { JwtService, type JwtSignOptions, type JwtVerifyOptions } from '@nestjs/jwt'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class JWTService {
  constructor(private readonly jwtService: JwtService) {}

  sign(payload: string, options?: Omit<JwtSignOptions, keyof jwt.SignOptions>): string
  sign(payload: Buffer | object, options?: JwtSignOptions): string
  sign(payload, options) {
    return this.jwtService.sign(payload, options)
  }

  signAsync(payload: string, options?: Omit<JwtSignOptions, keyof jwt.SignOptions>): Promise<string>
  signAsync(payload: Buffer | object, options?: JwtSignOptions): Promise<string>
  signAsync(payload, options) {
    return this.jwtService.signAsync(payload, options)
  }

  verify<T extends object = any>(token: string, options?: JwtVerifyOptions): T {
    return this.jwtService.verify(token, options)
  }
  verifyAsync<T extends object = any>(token: string, options?: JwtVerifyOptions): Promise<T> {
    return this.jwtService.verifyAsync(token, options)
  }
  decode<T = any>(token: string, options?: jwt.DecodeOptions): T {
    return this.jwtService.decode(token, options)
  }
}
