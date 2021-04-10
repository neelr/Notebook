import * as admin from "firebase-admin";
import config from "../../components/auth.json";
try {
  admin.initializeApp({
    credential: admin.credential.cert(config),
    databaseURL: "https://notebook-72b94.firebaseio.com",
  });
} catch {}

export const local = async (id) => {
  let snap = await admin.firestore().collection("stars").doc(id).get();
  if (!snap.exists) {
    return 0;
  }
  return snap.data().stars;
};

export default async (req, res) => {
  if (req.body.id) {
    admin
      .firestore()
      .collection("stars")
      .doc(req.body.id)
      .get()
      .then((snap) => {
        console.log(id);
        console.log(snap.data());
        if (!snap.exists) {
          res.send({ stars: 0 });
          return;
        }
        res.send({ stars: snap.data().stars });
      });
  }
};
