/* eslint camelcase: off */
const {promisify} = require('util')
const {createWriteStream} = require('fs')
const {createGzip} = require('zlib')
const pipeline = promisify(require('stream').pipeline)
const {ensureFile} = require('fs-extra')
const intoStream = require('into-stream')
const csvWriter = require('csv-write-stream')
const normalize = require('@etalab/normadresse')
const {beautify} = require('@etalab/adresses-util')

function getIdFantoirField(codeCommune, idVoie) {
  if (idVoie.length === 10) {
    const [codeCommuneVoie, codeVoie] = idVoie.toUpperCase().split('_')
    return `${codeCommuneVoie}_${codeVoie}`
  }
}

const SOURCES_MAPPING = {
  bal: 'commune',
  'ign-api-gestion-municipal_administration': 'commune',
  'ign-api-gestion-laposte': 'laposte',
  'ign-api-gestion-sdis': 'sdis',
  'ign-api-gestion-ign': 'inconnue',
  'ban-v0': 'inconnue',
  cadastre: 'cadastre',
  ftth: 'arcep',
  'insee-ril': 'insee'
}

function getSource(rawSource) {
  if (rawSource in SOURCES_MAPPING) {
    return SOURCES_MAPPING[rawSource]
  }
}

function adresseToRow(a) {
  return {
    id: a.cleInterop,
    id_fantoir: getIdFantoirField(a.codeCommune, a.idVoie) || '',
    numero: a.numero,
    rep: a.suffixe || '',
    nom_voie: beautify(a.nomVoie),
    code_postal: a.codePostal || '',
    code_insee: a.codeCommune,
    nom_commune: a.nomCommune,
    code_insee_ancienne_commune: a.codeAncienneCommune || '',
    nom_ancienne_commune: a.nomAncienneCommune || '',

    x: a.x || '',
    y: a.y || '',
    lon: a.lon || '',
    lat: a.lat || '',

    alias: '',
    nom_ld: '',
    libelle_acheminement: a.libelleAcheminement || '',
    nom_afnor: normalize(a.nomVoie),

    source_position: getSource(a.sourcePosition) || '',
    source_nom_voie: getSource(a.sourceNomVoie) || ''
  }
}

async function writeData(path, adresses) {
  await ensureFile(path)
  const steps = [
    intoStream.object(adresses.filter(a => a.position).map(adresseToRow)),
    csvWriter({separator: ';'})
  ]
  if (path.endsWith('.gz')) {
    steps.push(createGzip())
  }

  steps.push(createWriteStream(path))
  await pipeline(...steps)
}

module.exports = {writeData}