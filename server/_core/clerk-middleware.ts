import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { Express } from 'express';

export const configureClerk = (app: Express) => {
  app.use(ClerkExpressWithAuth());
};
