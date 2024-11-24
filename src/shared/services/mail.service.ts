import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { ConfigurationService } from './configuration.service'

@Injectable()
export class MailService {
  private transporter
  constructor(private readonly configurationService: ConfigurationService) {
    this.transporter = nodemailer.createTransport({
      host: this.configurationService.smtpHost,
      port: this.configurationService.smtpPort,
      secure: true, // true for port 465, false for other ports
      auth: {
        user: this.configurationService.smtpUser,
        pass: this.configurationService.smtpPass,
      },
    })
  }

  async sendEmail(mailOptions) {
    await this.transporter.sendMail({
      from: this.configurationService.smtpUser, // sender address
      ...mailOptions,
    })
  }
}
