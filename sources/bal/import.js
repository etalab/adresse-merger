const {createReadStream} = require('fs')
const {Transform} = require('stream')
const {pathExists} = require('fs-extra')
const {createGunzip} = require('gunzip-stream')
const pumpify = require('pumpify')
const parse = require('csv-parser')
const getStream = require('get-stream')

function prepareData(item, enc, next) {
  const adresse = {
    source: 'bal',
    originalId: item.id,
    numero: item.numero,
    suffixe: item.suffixe,
    nomVoie: item.nomVoie,
    codeCommune: item.codeCommune,
    nomCommune: item.nomCommune,
    extras: {},
    licence: item.licence
  }

  if (item.lon && item.lat) {
    adresse.position = {
      type: 'Point',
      coordinates: [parseFloat(item.lon), parseFloat(item.lat)]
    }
  }

  next(null, adresse)
}

async function importData(path) {
  if (!(await pathExists(path))) {
    return []
  }

  const adresses = await getStream.array(pumpify.obj(
    createReadStream(path),
    createGunzip(),
    parse({separator: ';'}),
    new Transform({objectMode: true, transform: prepareData})
  ))
  return adresses
}

module.exports = importData