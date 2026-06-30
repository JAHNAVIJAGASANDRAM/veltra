declare namespace Express {
  export interface Request {
    id: string;
    auth?: {
      userId: string;
      email: string;
      permissions: string[];
      sessionId: string;
    };
  }
}
