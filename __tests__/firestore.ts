import { batteryOfTests } from "./libs/battery-of-tests.ts";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { beforeAll, describe } from "@std/testing/bdd";

import { FirestoreSessionStorage } from "../firestore.ts";

const app = initializeApp({
  projectId: "test-project",
});
const firestore = getFirestore(app);

describe({
  name: "FirestoreSessionStorage",
  fn() {
    let storage: FirestoreSessionStorage;

    beforeAll(() => {
      storage = new FirestoreSessionStorage({ firestore });
    });

    batteryOfTests(() => storage);
  },
  sanitizeExit: false,
  sanitizeOps: false,
  sanitizeResources: false,
});
