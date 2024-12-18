import { getAuthCollection, type IUser } from "@common/db";
import logger from "@logger";
import { Router } from "express";
import type { Express } from "express";
import { ObjectId } from "mongodb";

import passport from "passport";
import {
  Strategy as DisStrategy,
  type Profile as DiscordProfile,
} from "passport-discord";
import CFG from "../../config/config";

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

  const router = Router();
  app.use("/auth", router);

  if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET) {
    passport.use(
      new DisStrategy(
        {
          clientID: process.env.DISCORD_CLIENT_ID!,
          clientSecret: process.env.DISCORD_CLIENT_SECRET!,
          callbackURL: process.env.HOST + "/auth/discord/callback",
          scope: ["identify", "email"],
        },
        async (
          _accessToken: string,
          _refreshToken: string,
          profile: DiscordProfile,
          done: any
        ) => {
          if (!profile.email) {
            return done(new Error("Email is required"));
          }
          const authCollection = getAuthCollection();
          let usr = await authCollection.findOne({
            provider: profile.provider,
            id: profile.id,
          });

          if (!usr) {
            // @ts-ignore
            usr = await authCollection.insertOne({
              provider: profile.provider,
              id: profile.id,
              email: profile.email,
              username: profile.username,
              permissions: [],
            });
          }

          // name change
          const nameChanged = usr!.username !== profile.username;

          if (nameChanged) {
            await authCollection.updateOne(
              {
                provider: profile.provider,
                id: profile.id,
              },
              {
                $set: {
                  username: profile.username,
                },
              }
            );
            usr!.username = profile.username;
          }

          // email change
          const emailChanged = usr!.email !== profile.email;
          if (emailChanged) {
            if (!profile.email) {
              return done(new Error("Email is required"));
            }
            await authCollection.updateOne(
              {
                provider: profile.provider,
                id: profile.id,
              },
              {
                $set: {
                  email: profile.email,
                },
              }
            );
            usr!.email = profile.email;
          }

          done(null, {
            id: usr!._id.toString("base64"),
            user: usr!,
          });
        }
      )
    );
    router.get("/discord", passport.authenticate("discord"));
    router.get(
      "/discord/callback",
      passport.authenticate("discord", {
        failureRedirect: CFG.AUTH.FAILURE_REDIRECT,
      }),
      (_req, res) => {
        res.redirect(CFG.AUTH.SUCCESS_REDIRECT);
      }
    );
  }

  router.get("/logout", (req, res) => {
    req.logout(
      {
        keepSessionInfo: true,
      },
      (e) => {
        if (e) {
          logger.error(e);
          res.status(500).send("Error logging out");
          return;
        }
        res.redirect((req.query.callback as string) || "/");
      }
    );
  });
}
