import config from './font.config.mjs'
import path, {dirname} from 'node:path'
import opentype from 'opentype.js'
import { fileURLToPath } from 'node:url'
import fs, { readFileSync } from 'node:fs'

const __dirname = dirname(fileURLToPath(import.meta.url));

const { fontPath,  text } = config

const buffer = readFileSync(path.resolve(__dirname, fontPath))
const arrBuffer = new Uint8Array(buffer).buffer
const font = opentype.parse(arrBuffer)
const postScriptName = font.getEnglishName('postScriptName')
const [familyName, styleName] = postScriptName.split('-')
const notdefGlyph = font.glyphs.get(0)
notdefGlyph.name = '.notdef'

const trimText = text.replace(/\n/g, '').replace(/\s*/g, '').split('');
const glyphs = trimText.reduce((acc, cur) => (acc.includes(cur) ? acc : [...acc, cur]), []).join('')
const subGlyphs = [notdefGlyph, ...font.stringToGlyphs(glyphs)]

const subsetFont = new opentype.Font({
    familyName,
    styleName,
    glyphs: subGlyphs,
    unitsPerEm: font.unitsPerEm,
    ascender: font.ascender,
    descender: font.descender,
    version: font.version,
})
const arrayBuffer = subsetFont.toArrayBuffer()
// 存到本地
fs.writeFileSync('subsetFont.otf', Buffer.from(arrayBuffer))
