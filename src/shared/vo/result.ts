export class Result {
  public success: boolean
  public message: string

  constructor(success: boolean, message: string) {
    this.success = success
    this.message = message
  }

  static success(message: string) {
    return new Result(true, message)
  }

  static fail(message: string) {
    return new Result(false, message)
  }
}
