import * as acorn from 'acorn'
import fs from 'node:fs'
import { transformFromAstSync } from '@babel/core'

function getAst(path) {
    const buffer = fs.readFileSync(path).toString()
    const ast = acorn.parse(buffer, {
        sourceType: "module"
    })
    return ast
}

// 创建一个 Set 来保存被使用的导出
const usedExports = new Set();
const importPaths = new Set();

// 遍历 AST 树并标记被使用的导出
function traverse(node) {
  node.forEach(n => {
    if(n.type === 'ImportDeclaration') {
        usedExports.add(...n.specifiers.map(specifier => specifier.imported.name))
        importPaths.add(n.source.value)
    }
  })
}

function shak(ast) {
    const body = ast.body.filter(it => it.type === 'ExportNamedDeclaration' && usedExports.has(it.declaration.id.name))

    return {
        ...ast,
        body
    }
}

// 遍历整个 AST 树
const mainAst = getAst('main.mjs')
traverse(mainAst.body)

Array.from(importPaths).forEach(it => {
    const ast = shak(getAst(it))
    
    const { code } = transformFromAstSync(ast)
    console.log(code)
    // export function add(a, b) {
    //     return a + b;
    // }
})