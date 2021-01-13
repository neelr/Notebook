import * as admin from 'firebase-admin';
import config from "../../components/auth.json"
try {
    admin.initializeApp({
        credential: admin.credential.cert(config),
        databaseURL: 'https://notebook-72b94.firebaseio.com'
    });
} catch { }

export default async (req, res) => {
    let ip = req.headers['x-real-ip'] || req.connection.remoteAddress
    if (ip.substr(0, 7) == "::ffff:") {
        ip = ip.substr(7)
    }
    if (req.method == 'POST' && req.body.id) {
        admin.firestore().collection("stars").doc(req.body.id).get()
            .then(snap => {
                if (snap.exists) {
                    if (!snap.data().ip.includes(ip)) {
                        admin.firestore().collection("stars").doc(req.body.id).update({
                            stars: admin.firestore.FieldValue.increment(1),
                            ip: admin.firestore.FieldValue.arrayUnion(ip)
                        })
                    }
                } else {
                    admin.firestore().collection("stars").doc(req.body.id).set({
                        stars: 1,
                        ip: [ip]
                    })
                }
            })
    } else {
        res.send("Only POST")
    }
}