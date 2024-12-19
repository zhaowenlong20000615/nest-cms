declare namespace Express {
  interface Request {
    session: {
      user: any
      menuTree: any
    }
    user: any
  }
}
