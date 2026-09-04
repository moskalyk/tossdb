const fs = require('fs')

// TODO
// index for cursor of database entry
// rest of data
// splitting of data into pages for iteration
// in-mem

class Toss {
    path
    constructor(path){
        this.path = path + '.db'
    }
    
    apnd (obj){
        return new Promise((resolve, reject) => {
            if(!fs.existsSync(__dirname + this.path)) fs.writeFileSync(__dirname + this.path, '')
            fs.readFile(__dirname + this.path, 'utf8', async (err, data) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
                const contents = await data.toString()
                const parsed = contents ? JSON.parse(contents) : null
                obj = {...parsed, ...obj}
                const constantString = JSON.stringify(obj).replaceAll('""}"','"","')
                fs.writeFile(__dirname + this.path, constantString, { flag: 'w+' }, (err) => {
                    if (err) {
                        console.error('Error writing file:', err);
                        return;
                    } 
                    resolve({ status: true, v: obj })
                });
            })
        })
    }
    
    look(key) {
        return new Promise((resolve, reject) => {
            fs.readFile(__dirname + this.path, 'utf8', async (err, data) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
              }
                const contents = await data.toString()
                console.log(contents)
                let parsed = contents ? JSON.parse(contents)[key] : null
                if(parsed == undefined){
                    resolve(JSON.stringify({status: false }))
                } else {
                    resolve(JSON.stringify({ status: true, v: parsed }))

                }
            });
            
        })
    }
}

module.exports = Toss
