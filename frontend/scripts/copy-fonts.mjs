import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'fonts')
const src = (pkg, file) => join(root, 'node_modules', '@fontsource', pkg, 'files', file)

/** Копируем woff2 в public/fonts — отдаёт nginx с того же домена, без Google */
const files = [
  ['montserrat', 'montserrat-cyrillic-400-normal.woff2', 'Montserrat-400.woff2'],
  ['montserrat', 'montserrat-cyrillic-500-normal.woff2', 'Montserrat-500.woff2'],
  ['montserrat', 'montserrat-cyrillic-600-normal.woff2', 'Montserrat-600.woff2'],
  ['montserrat', 'montserrat-cyrillic-700-normal.woff2', 'Montserrat-700.woff2'],
  ['lobster-two', 'lobster-two-latin-400-normal.woff2', 'LobsterTwo-400.woff2'],
]

mkdirSync(outDir, { recursive: true })

for (const [pkg, from, to] of files) {
  const srcPath = src(pkg, from)
  const destPath = join(outDir, to)
  if (!existsSync(srcPath)) {
    console.error(`Missing: ${srcPath}\nRun: npm install`)
    process.exit(1)
  }
  cpSync(srcPath, destPath)
  console.log(`OK ${to}`)
}

console.log(`Fonts → ${outDir}`)
