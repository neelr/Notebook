import fetch from "isomorphic-unfetch"
import getConfig from 'next/config'

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

export default async (req, res) => {
    if (req.method === 'POST') {
        let resp = await fetch(serverRuntimeConfig.UPVOTE_URL)
        let json = await resp.json()
        let payload = {}
        let id = JSON.parse(req.body).id
        payload[id] = json[id] ? json[id] + 1 : 1
        resp = await fetch(serverRuntimeConfig.UPVOTE_URL, {
            method: "POST",
            body: JSON.stringify(payload)
        })
        json = await resp.text()
        res.send(json)
    } else {
        res.send("Only POST")
    }
}