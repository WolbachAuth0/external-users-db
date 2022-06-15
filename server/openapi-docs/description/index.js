const path = require('path')
const fs = require('fs')
const description = fs.readFileSync(path.join(__dirname, 'description.md'), { encoding: 'utf8' })

module.exports = description.toString('utf8')
