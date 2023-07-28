# shopify-app-session-storage-firestore

Shopify App Session Storage for Firestore

# Usage

```ts
import {initializeApp, cert} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'
import {shopifyApp} from '@shopify/shopify-app-express';
import {FirestoreSessionStorage} from '@tkashiro/shopify-app-session-storage-firestore';

const firebaseApp = initializeApp({
  credential: cert('/path/to/service-account.json'),
})

const firestore = getFirestore(firebaseApp)

const shopify = shopifyApp({
  sessionStorage: new FirestoreSessionStorage({
    firestore: firestore,
    collectionName: 'shopify_sessions' // optional
  }),
  // ...
});
```

# Pro tips

## Auto cleanup expired session with firestore TTL policy

Firestore now support TTL (Time-to-live) policy which enable you to delete expired session.
Check [official document](https://firebase.google.com/docs/firestore/ttl) for more detail. 
