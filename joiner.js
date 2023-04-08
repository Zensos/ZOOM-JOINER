// THIS SHIT MADE BY ZENSOS
(async () => {
    const axios = require('axios');
    const WebSocket = require('ws');
    const uuid = require('uuid');

    const options = {
        code: "", // MEETING ID
        name: "", // MEET NAME
        password: "", // MEET PASSWORD
    }

    if (!options.code || !options.name || !options.password) return console.log({ error: "INVALID OPTIONS" })

    /* INIT PAGE REQUEST */
    const { data } = await axios({
        url: `https://pwa.zoom.us/wc/${options.code}/join?pwd=${options.password}`,
        methods: "GET",
        headers: {
            /* FIND IT BY YOUR SELF */
            Cookie: `wc_join=${options.code}*${options.name}; wc_dn=${options.name}; _zm_currency=USD; _zm_mtk_guid=1c56a76aaacb4028b1ad337c1a867bbd; _zm_lang=en-US; _zm_client_tz=America/Los_Angeles; _zm_cdn_blocked=unlog_unblk; _ga=GA1.2.1053826471.1585760799; _gid=GA1.2.1984667947.1585760799; wc_info=16800768%23290965%23B2F382A1-8D8A-43E7-861D-68121713ABE0%23%23test%230`
        }
    }).catch(err => {
        console.log({ error: err })
        process.exit()
    })

    /* FIND CONFIG LOCATION */
    const configLocation = data.search("config.ts");
    const ts = data.substr(configLocation).split("'")[1];

    const authLocation = data.search("config.auth");
    const auth = data.substr(authLocation).split('"')[1];

    const rwcTokenLocation = data.search("config.encryptedRWC");
    const rwcToken = data.substr(rwcTokenLocation).split('"')[3]

    const trackAuthLocation = data.search("config.trackAuth");
    const trackAuth = data.substr(trackAuthLocation).split('"')[1]

    const midLocation = data.search("config.mid");
    const mid = data.substr(midLocation).split('"')[1]

    const tidLocation = data.search("config.tid");
    const tid = data.substr(tidLocation).split('"')[1]

    /* GET RWC AUTH AND RWG */
    const rwcRes = await axios({
        url: `https://rwcva1.cloud.zoom.us/wc/ping/${options.code}?ts=${ts}&auth=${auth}&rwcToken=${rwcToken}&dmz=1`,
        method: "GET",
    }).catch(err => {
        console.log({ error: err })
        process.exit()
    })

    /* ESCAPE URL */
    let url = encodeURI(`wss://${rwcRes.data.rwg}/webclient/${options.code}?dn2=${Buffer.from(options.name).toString('base64')}&ts=${ts}&auth=${auth}&trackAuth=${trackAuth}&mid=${mid}&tid=${tid}&browser=Edg100&ZM-CID=${uuid.v1()}&lang=en&_ZM_MTG_TRACK_ID=undefined&wccv=6.4.0&mpwd=${options.password}&rwcAuth=${rwcRes.data.rwcAuth}&from=pwa&as_type=2&email=&cfs=0`)

    /* INIT SOCKET */
    const client = new WebSocket(`${url}`);
    /* OPEN SOCKET */
    client.on('open', () => {
        /* SEND SOCKET */
        client.send(JSON.stringify({
            evt: 4167,
            body: {
                data: "WCL_M, B80()B43()"
            },
            seq: 13
        }))
    })

})()