import { Injectable } from '@nestjs/common'
import * as OSS from 'ali-oss'
import { ConfigurationService } from 'src/shared/services/configuration.service'

@Injectable()
export class OssService {
  constructor(private readonly configurationService: ConfigurationService) {}

  private getOssConfig() {
    const {
      ossAcessKeyId: accessKeyId,
      ossAcessKeySecret: accessKeySecret,
      ossRoleArn: roleArn,
      ossBucket: bucket,
      ossRegion: region,
    } = this.configurationService
    const seconds = 3000 //3000秒，50分钟过期
    const date = new Date()
    date.setSeconds(date.getSeconds() + seconds)
    const dir = ''
    const policy = {
      expiration: date.toISOString(), // 请求有效期。
      conditions: [
        ['content-length-range', 0, 1048576000], // 设置上传文件的大小限制。
        ['starts-with', '$key', dir], // 限制文件只能上传到user-dirs目录下。
        { bucket }, // 限制文件只能上传至指定Bucket。
      ],
    }
    return { accessKeyId, accessKeySecret, roleArn, bucket, region, date, dir, policy, seconds }
  }

  async getSignature() {
    const { accessKeyId, accessKeySecret, roleArn, bucket, region, date, dir, policy, seconds } = this.getOssConfig()
    const sts = new OSS.STS({ accessKeyId, accessKeySecret })
    const {
      credentials: { AccessKeyId, AccessKeySecret, SecurityToken: stsToken },
    } = await sts.assumeRole(roleArn, '', seconds, 'sessiontest')
    const client = new OSS({ accessKeyId: AccessKeyId, accessKeySecret: AccessKeySecret, stsToken })
    const formData = await client.calculatePostSignature(policy)
    const params = {
      expire: new Date(date).getTime(),
      policy: formData.policy,
      signature: formData.Signature,
      accessid: formData.OSSAccessKeyId,
      stsToken,
      host: `http://${bucket}.${region}.aliyuncs.com`,
      dir,
    }
    return params
  }
}
