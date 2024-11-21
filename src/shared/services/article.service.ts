import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Article } from "../entities/article.entity";
import { Repository } from 'typeorm';
import { MysqlBaseService } from "./mysql-base.service";

@Injectable()
export class ArticleService extends MysqlBaseService<Article> {
  constructor(
    @InjectRepository(Article) protected repository: Repository<Article>
  ) {
    super(repository);
  }
}
