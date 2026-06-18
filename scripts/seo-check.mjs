import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'

const root = process.cwd()
const siteUrl = 'https://www.slap-your-boss.online/'
const siteOrigin = 'https://www.slap-your-boss.online'
const failures = []

function read(path) {
  return readFileSync(join(root, path), 'utf8')
}

function fail(message) {
  failures.push(message)
}

function expectIncludes(text, value, label) {
  if (!text.includes(value)) fail(`${label} missing: ${value}`)
}

function countMatches(text, pattern) {
  return [...text.matchAll(pattern)].length
}

const distIndexPath = join(root, 'dist/index.html')
if (!existsSync(distIndexPath)) fail('dist/index.html is missing. Run pnpm build first.')

if (existsSync(distIndexPath)) {
  const html = read('dist/index.html')
  expectIncludes(html, '<title>Slap Your Boss – Funny 15-Second Browser Game</title>', 'title')
  expectIncludes(
    html,
    'content="Upload a photo, slap a cartoon boss for 15 seconds, build combos, release stress and share your Slap Report. Free browser game for mobile and desktop."',
    'description',
  )
  expectIncludes(html, `rel="canonical" href="${siteUrl}"`, 'canonical')
  expectIncludes(html, 'property="og:title" content="Slap Your Boss – 15-Second Meme Game"', 'og:title')
  expectIncludes(html, `property="og:url" content="${siteUrl}"`, 'og:url')
  expectIncludes(html, `property="og:image" content="${siteOrigin}/og-cover.png"`, 'og:image')
  expectIncludes(html, 'name="twitter:card" content="summary_large_image"', 'twitter:card')
  expectIncludes(html, `name="twitter:image" content="${siteOrigin}/og-cover.png"`, 'twitter:image')

  const ldJsonMatch = html.match(new RegExp('<script\\s+type="application/ld\\+json">([\\s\\S]*?)</script>'))
  if (!ldJsonMatch) {
    fail('JSON-LD script is missing.')
  } else {
    try {
      const structuredData = JSON.parse(ldJsonMatch[1])
      if (structuredData.url !== siteUrl) fail('JSON-LD url does not match canonical URL.')
      if (structuredData.image !== `${siteOrigin}/og-cover.png`) fail('JSON-LD image does not match OG image.')
      if (structuredData.offers?.price !== '0') fail('JSON-LD free offer is missing.')
    } catch (error) {
      fail(`JSON-LD is not valid JSON: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}

for (const file of ['dist/robots.txt', 'dist/sitemap.xml', 'dist/og-cover.png', 'dist/apple-touch-icon.png']) {
  if (!existsSync(join(root, file))) fail(`${file} is missing.`)
}

if (existsSync(join(root, 'dist/robots.txt'))) {
  const robots = read('dist/robots.txt')
  expectIncludes(robots, 'User-agent: *', 'robots.txt')
  expectIncludes(robots, `Sitemap: ${siteOrigin}/sitemap.xml`, 'robots.txt sitemap')
}

if (existsSync(join(root, 'dist/sitemap.xml'))) {
  const sitemap = read('dist/sitemap.xml')
  expectIncludes(sitemap, `<loc>${siteUrl}</loc>`, 'sitemap loc')
  if (countMatches(sitemap, /<loc>/g) !== 1) fail('sitemap.xml should contain exactly one URL.')
}

if (existsSync(join(root, 'dist/og-cover.png'))) {
  const png = readFileSync(join(root, 'dist/og-cover.png'))
  const width = png.readUInt32BE(16)
  const height = png.readUInt32BE(20)
  if (width !== 1200 || height !== 630) fail(`og-cover.png must be 1200x630, got ${width}x${height}.`)
}

const app = read('src/App.vue')
if (app.includes('@vercel/analytics/vue') || app.includes('<Analytics')) fail('App.vue must not render duplicate Analytics components.')
if (countMatches(app, /<h1\b/g) !== 1) fail('App.vue should contain exactly one SEO H1.')
for (const phrase of ['How to play', 'Private by design', 'Frequently asked questions']) {
  expectIncludes(app, phrase, 'SEO content')
}

const resultScreen = read('src/components/ResultScreen.vue')
if (/<h1\b/.test(resultScreen)) fail('ResultScreen.vue must not add a second H1.')

const main = read('src/main.ts')
if (!main.includes("import { inject")) fail('main.ts must import inject from @vercel/analytics.')
if (!main.includes("from '@vercel/analytics'")) fail('main.ts must import analytics from @vercel/analytics.')
if (countMatches(main, /inject\(/g) !== 1) fail('main.ts must call inject() exactly once.')
if (!main.includes('beforeSend: sanitizeAnalyticsEvent')) fail('Analytics inject() must use the privacy sanitizer.')

const packageJson = JSON.parse(read('package.json'))
if (!packageJson.dependencies?.['@vercel/analytics']) fail('@vercel/analytics is missing from dependencies.')
if (existsSync(join(root, 'package-lock.json')) && existsSync(join(root, 'pnpm-lock.yaml'))) fail('Both package-lock.json and pnpm-lock.yaml exist.')

const sourceText = [
  app,
  main,
  read('src/components/GameStage.vue'),
  read('src/components/LandingScreen.vue'),
  read('src/components/ResultScreen.vue'),
].join('\\n')
for (const forbidden of [
  '?bossName=',
  '&bossName=',
  '?fileName=',
  '&fileName=',
  '?image=',
  '&image=',
  '?face=',
  '&face=',
  '?landmarks=',
  '&landmarks=',
  '?base64=',
  '&base64=',
]) {
  if (sourceText.includes(forbidden)) fail(`Sensitive URL/query pattern found: ${forbidden}`)
}

if (failures.length > 0) {
  console.error('SEO check failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('SEO check passed.')
