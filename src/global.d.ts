declare namespace Express {
  interface Request {
    session: {
      user: any
    }
  }
}
