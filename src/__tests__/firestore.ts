import { batteryOfTests } from "./libs/battery-of-tests";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import { FirestoreSessionStorage } from "../firestore";

const app = initializeApp({
  projectId: "test-project",
});
const firestore = getFirestore(app);

describe("FirestoreSessionStorage", () => {
  let storage: FirestoreSessionStorage;

  beforeAll(async () => {
    storage = new FirestoreSessionStorage({ firestore });
  });

  batteryOfTests(async () => storage);
});
