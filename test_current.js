const Toss = require('./lib/toss.js')

const dbPath = process.argv[2] || '/data' // will create a file if not there
const tss = new Toss(dbPath);

(async () => {
    const secretShard = await tss.apnd({'msg': 'secret'}) // will return whole object of lazy append
    console.log(secretShard)
    
    const secretShardLook = await tss.look('msg') // will return value of key
    console.log(JSON.parse(secretShardLook))
})()
