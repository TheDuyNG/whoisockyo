declare global {
  namespace Express {
    interface Request {
      adminUserId?: string;
    }
  }
}

export {};
