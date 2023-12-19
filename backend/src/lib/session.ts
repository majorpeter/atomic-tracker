import { MemoryStore, SessionData } from "express-session";

/**
 * this in-memory solution is suitable for the single user, home lab installation
 */
export class LimitedMemoryStore extends MemoryStore {
  private maxSessionCount: number;

  // actually inherited from MemoryStore
  // values are JSON encoded SessionData objects
  declare sessions: { [sid: string]: string };

  constructor(maxSessionCount: number) {
    super();
    this.maxSessionCount = maxSessionCount;
  }

  set(
    sid: string,
    session: SessionData,
    callback?: ((err?: any) => void) | undefined
  ): void {
    if (Object.keys(this.sessions).length >= this.maxSessionCount) {
      const sorted = Object.entries(this.sessions).sort(
        ([_aSid, aJson], [_bSid, bJson]) => {
          const aSession = JSON.parse(aJson) as SessionData;
          const bSession = JSON.parse(bJson) as SessionData;
          return (
            new Date(aSession.cookie.expires!).getTime() -
            new Date(bSession.cookie.expires!).getTime()
          );
        }
      );

      // console.log("Removing oldest session: ", sorted[0][0]);
      this.destroy(sorted[0][0]);
    }

    super.set(sid, session, callback);
  }

  getSessionsOfUser(userId: number): SessionData[] {
    return Object.values(this.sessions)
      .map((item) => JSON.parse(item) as SessionData)
      .filter((session) => session.userId === userId);
  }
}
