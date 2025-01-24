import * as admin from "firebase-admin";
import config from "@components/auth.js";
try {
  admin.initializeApp({
    credential: admin.credential.cert(config),
    databaseURL: "https://notebook-72b94.firebaseio.com",
  });
} catch (e) {}

export function slugify(str) {
  return String(str)
    .normalize("NFKD") // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, "") // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, "") // remove non-alphanumeric characters
    .replace(/\s+/g, "-"); // replace spaces with hyphens
}

export const local = async (id) => {
  let snap = await admin.firestore().collection("stars").doc(id).get();
  if (!snap.exists) {
    return 0;
  }
  return snap.data().stars;
};

export default async (req, res) => {
  // check if request is valid
  if (req.method === "POST") {
    // get the id from the request
    const id = req.body.id;
    // get the stars from the database
    let snap = await admin
      .firestore()
      .collection("stars")
      .doc(req.body.id)
      .get();
    if (!snap.exists) {
      res.send({ stars: 0 });
      return;
    }
    res.send({ stars: snap.data().stars });
  }
};
