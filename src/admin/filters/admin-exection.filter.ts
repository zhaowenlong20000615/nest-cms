import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import { Request, Response } from 'express'
import { I18nService, I18nValidationException } from 'nestjs-i18n'

@Catch(HttpException)
export class AdminExectionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request: any = ctx.getRequest<Request>()
    const status = exception.getStatus()
    let message = ''
    if (exception instanceof BadRequestException) {
      const { message: errMessage } = exception.getResponse() as any
      message = errMessage
    } else if (exception instanceof I18nValidationException) {
      const errors = exception.errors
      message = errors.map((error) => this.formatErrorMessage(error, request.i18nLang)).join(';')
    }
    response.status(status).render('error', { message })
  }

  formatErrorMessage(error, lang) {
    const { property, value, constraints } = error
    const constraintValues = Object.values(constraints)
    const formattedMessages = constraintValues.map((constraintValue: any) => {
      const [key, params] = constraintValue.split('|')
      if (params) {
        const parsedParams = JSON.parse(params)
        return this.i18n.translate(key, {
          lang,
          args: parsedParams,
        })
      }
      return key
    })

    return `${property}:${value ?? ''} ${formattedMessages.join(',')}`
  }
}
