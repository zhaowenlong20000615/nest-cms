export enum ArticleStateEnum {
  DRAFT = 'draft', //草稿
  PENDING = 'pending', //已经提交审核
  PUBLISHED = 'published', //审核通过
  REJECTED = 'rejected', //审核不通过
  WITHDRAWN = 'withdrawn', //审核后撤回
}

export enum ArticleStateEnumText {
  'draft' = '草稿', //草稿
  'pending' = '提交审核', //已经提交审核
  'published' = '审核通过', //审核通过
  'rejected' = '审核不通过', //审核不通过
  'withdrawn' = '审核后撤回', //审核后撤回
}
