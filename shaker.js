import * as acorn from 'acorn'
import fs from 'node:fs'
import { transformFromAstSync } from '@babel/core'

const args = ['utils.mjs']
const body = args.map(it => {
    const buffer = fs.readFileSync(it).toString()
    const { body } = acorn.parse(buffer, {
        sourceType: "module"
    })
    return body
})

// 创建一个 Set 来保存被使用的导出
const usedExports = new Set();

// 标记被使用的导出
function markUsedExports(node) {
 
}

// 遍历 AST 树并标记被使用的导出
function traverse(node) {
  
}

// 移除未使用的代码
function removeUnusedCode(node) {

}



// 遍历整个 AST 树
body.forEach(b => b.forEach(node => traverse(node)))
body.forEach(b => b.forEach(node => removeUnusedCode(node)))
console.log(usedExports)
const ast = {
    type: 'Program',
    body: body[0],
    sourceType: "module"
}

const { code } = transformFromAstSync(ast);

console.log(code)