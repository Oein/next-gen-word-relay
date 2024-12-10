import { getAuthCollection, type IUser } from "@common/db";
import type { Express } from "express";
import { ObjectId } from "mongodb";

import passport from "passport";

declare global {
  namespace Express {
    interface User {
      id: string;
      user: IUser;
    }
  }
}

export default function applyAuth(app: Express) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id: string, done) => {
    const authCollection = getAuthCollection();
    authCollection
      .findOne({
        _id: ObjectId.createFromBase64(id),
      })
      .then((user) => {
        if (!user) {
          done(new Error("User not found"));
          return;
        }
        done(null, {
          id: user._id.toString("base64"),
          user: user,
        });
      });
  });
}
