import { BadRequestException, Controller, Post, Req, UploadedFile, UseFilters, UseInterceptors } from '@nestjs/common'
import { AdminExectionFilter } from '../filters/admin-exection.filter'
import { ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { Request } from 'express'

@Controller('admin/upload')
@UseFilters(AdminExectionFilter)
@ApiTags('admin/upload')
export class UploadController {
  @Post('file')
  @UseInterceptors(
    FileInterceptor('upload', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
          const filename = `${uuidv4()}${extname(file.originalname)}`
          callback(null, filename)
        },
      }),
      fileFilter: (req, file: Express.Multer.File, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) return callback(new BadRequestException('不支持的文件类型'), false)
        callback(null, true)
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const url = `${req.headers.origin}/${file.filename}`
    return { url }
  }
}
