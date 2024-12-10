import { Session, type SessionParams } from "@shopify/shopify-api";
import { type SessionStorage } from "@shopify/shopify-app-session-storage";
import {
  type DocumentData,
  type Firestore,
  Timestamp,
} from "firebase-admin/firestore";

type SessionFirestore = Omit<SessionParams, "expires"> & {
  expires?: Timestamp;
};

const fromSession = (session: Session): SessionFirestore => {
  const { expires, ...rest } = session.toObject();
  const data: SessionFirestore = { ...rest };
  if (expires != null) {
    data.expires = Timestamp.fromDate(expires);
  }
  return data;
};

const fromFirestore = (documentData: DocumentData): Session => {
  const { expires, ...rest } = documentData satisfies SessionFirestore;
  const data = { ...rest } as SessionParams;
  if (expires != null) {
    data.expires = expires.toDate();
  }
  return new Session(data);
};

export class FirestoreSessionStorage implements SessionStorage {
  private readonly db: Firestore;
  private readonly collectionName: string;

  constructor({
    firestore,
    collectionName = "shopify_sessions",
  }: {
    firestore: Firestore;
    collectionName?: string;
  }) {
    this.db = firestore;
    this.collectionName = collectionName;
  }

  public async storeSession(session: Session): Promise<boolean> {
    await this.db
      .collection(this.collectionName)
      .doc(session.id)
      .set(fromSession(session));
    return true;
  }

  public async loadSession(id: string): Promise<Session | undefined> {
    const doc = await this.db.collection(this.collectionName).doc(id).get();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return doc.exists ? fromFirestore(doc.data()!) : undefined;
  }

  public async deleteSession(id: string): Promise<boolean> {
    await this.db.collection(this.collectionName).doc(id).delete();
    return true;
  }

  public async deleteSessions(ids: string[]): Promise<boolean> {
    const batch = this.db.batch();
    await this.db
      .collection(this.collectionName)
      .where("id", "in", ids)
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs.forEach((documentSnapshot) => {
          batch.delete(documentSnapshot.ref);
        });
      })
      .then(async () => {
        return await batch.commit();
      });
    return true;
  }

  public async findSessionsByShop(shop: string): Promise<Session[]> {
    const querySnapshot = await this.db
      .collection(this.collectionName)
      .where("shop", "==", shop)
      .get();
    return querySnapshot.docs.map((documentSnapshot) => {
      return fromFirestore(documentSnapshot.data());
    });
  }
}
