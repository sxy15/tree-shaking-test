import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
    fontPath: join(__dirname, './gbk.ttf'),
    text: '锐字工房云字库行楷GBK'
}