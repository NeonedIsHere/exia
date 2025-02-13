const { join } = require('path')
const { Database } = require('sqlite3')

const dbPath = join(__dirname, '..', 'database', 'data.sqlite')
const db = new Database(dbPath, (err) => {
    if (err) {
        console.error(`[❌] » [Data] Erreur lors de la connexion à la base de données :`, err.message)
        return
    }
    console.log(`[✅] » [Data] Connexion à la base de données réussie`)
 
})

new Promise((resolve, reject) => {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS bots(
            id INTEGER PRIMARY KEY,
            token TEXT NOT NULL,
            buyerId INTEGER NOT NULL,
            secret TEXT,
            type TEXT NOT NULL,
            state INTEGER NOT NULL DEFAULT 1,
            expiration TEXT NOT NULL DEFAULT (datetime('now', '+30 days')),
            createdAt TEXT NOT NULL DEFAULT (datetime('now'))
            )`,
        (err) => {
            if (err) {
                reject(err)
                return
            }
            resolve()
            console.log(`[✅] » [Data] La table bots à été créée avec succès`)
        })

        db.run(`CREATE TABLE IF NOT EXISTS keys (
            "key" TEXT NOT NULL,
            type TEXT NOT NULL,
            author TEXT NOT NULL,
            expiration TEXT NOT NULL,
            createdAt TEXT NOT NULL DEFAULT (datetime('now'))
            )`,
        (err) => {
            if (err) {
                reject(err)
                return
            }
            resolve()
            console.log(`[✅] » [Data] La table keys à été créée avec succès`)
        })

        db.run(`CREATE TABLE IF NOT EXISTS prevname (
                id TEXT NOT NULL,
                oldUsername TEXT NOT NULL,
                oldDisplayName TEXT,
                newUsername TEXT NOT NULL,
                newDisplayName TEXT,
                timestamp TEXT NOT NULL DEFAULT (datetime('now'))
            )`,
        (err) => {
            if (err) {
                reject(err)
                return
            }
            resolve()
            console.log(`[✅] » [Data] La table prevname à été créée avec succès`)
        })
    })
})

module.exports = db