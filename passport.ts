import {
  Strategy,
  ExtractJwt,
  type StrategyOptionsWithoutRequest,
} from "passport-jwt";
import prisma from "./db/prisma.ts";
import type { Payload } from "./types.ts";

const key = process.env.SECRET_JWT_KEY;

const options: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: key as string,
};

const JwtStrategy = new Strategy(options, (jwt_payload: Payload, done) => {
  prisma.user
    .findFirst({
      where: {
        id: jwt_payload.sub,
      },
    })
    .then((user) => {
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((error) => {
      return done(error, false);
    });
});

export default JwtStrategy;
