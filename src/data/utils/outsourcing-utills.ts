// import fs from 'fs'
// import path from 'path'
// import matter from 'gray-matter'
// import { OutsourcingOffer, BreadcrumbItem } from '@/types'
// import routes from '@/config/routes'

// const outsourcingDirectory = (locale: string) =>
//   path.join(process.cwd(), `src/data/static/markdown/${locale}/outsourcing`)

// function getAllMarkdownFiles(dir: string): string[] {
//   const entries = fs.readdirSync(dir, { withFileTypes: true })

//   return entries.flatMap((entry) => {
//     const fullPath = path.join(dir, entry.name)
//     if (entry.isDirectory()) {
//       return getAllMarkdownFiles(fullPath)
//     } else if (entry.isFile() && entry.name.endsWith('.md')) {
//       return [fullPath]
//     } else {
//       return []
//     }
//   })
// }

// export async function getAllOutsourcingOffers(
//   locale: string
// ): Promise<OutsourcingOffer[]> {
//   const baseDir = outsourcingDirectory(locale)
//   const files = getAllMarkdownFiles(baseDir)

//   const flatOffers: OutsourcingOffer[] = await Promise.all(
//     files.map(async (filePath) => {
//       const fileContents = fs.readFileSync(filePath, 'utf8')
//       const { data, content } = matter(fileContents)

//       const relativePath = path.relative(baseDir, filePath)
//       const url_path = relativePath
//         .replace(/\.md$/, '')
//         .split(path.sep)
//         .join('/')

//       return {
//         ...(data as Omit<
//           OutsourcingOffer,
//           'id' | 'content' | 'url' | 'children'
//         >),
//         id: '',
//         content,
//         url: url_path,
//         children: []
//       }
//     })
//   )

//   const pathMap = new Map<string, OutsourcingOffer>()
//   flatOffers.forEach((offer) => pathMap.set(offer.url, offer))

//   for (const offer of flatOffers) {
//     const parentPath = offer.url.split('/').slice(0, -1).join('/')
//     if (pathMap.has(parentPath)) {
//       const parent = pathMap.get(parentPath)!
//       parent.children = parent.children || []
//       parent.children.push(offer)
//     }
//   }

//   return process.env.APPLICATION_RUN_MODE === 'production'
//     ? flatOffers.filter((offer) => offer.is_visible)
//     : flatOffers
// }

// export async function getTopLevelOutsourcingOffers(
//   locale: string
// ): Promise<OutsourcingOffer[]> {
//   const allOffers = await getAllOutsourcingOffers(locale)

//   const topLevelOffers = allOffers.filter((offer) => {
//     const parentPath = offer.url.split('/').slice(0, -1).join('/')
//     return !allOffers.some((o) => o.url === parentPath)
//   })

//   return process.env.APPLICATION_RUN_MODE === 'production'
//     ? topLevelOffers.filter((offer) => offer.is_visible)
//     : topLevelOffers
// }

// export async function getOutsourcingOffer(
//   locale: string,
//   urlPath: string
// ): Promise<{ offer: OutsourcingOffer; breadcrumbs: BreadcrumbItem[] }> {
//   const baseDir = outsourcingDirectory(locale)
//   const filePath = path.join(baseDir, `${urlPath}.md`)

//   if (!fs.existsSync(filePath)) {
//     throw new Error(`Offer not found: ${filePath}`)
//   }

//   const fileContents = fs.readFileSync(filePath, 'utf8')
//   const { data, content } = matter(fileContents)

//   const allOffers = await getAllOutsourcingOffers(locale)
//   const currentDepth = urlPath.split('/').length

//   const children = allOffers.filter((o) => {
//     const segments = o.url.split('/')
//     return (
//       o.url.startsWith(`${urlPath}/`) && segments.length === currentDepth + 1
//     )
//   })

//   const offer: OutsourcingOffer = {
//     ...(data as Omit<OutsourcingOffer, 'id' | 'content' | 'url' | 'children'>),
//     id: '',
//     content,
//     url: urlPath,
//     children
//   }

//   const breadcrumbs: BreadcrumbItem[] = []
//   const segments = urlPath.split('/')

//   for (let i = 0; i < segments.length; i++) {
//     const partial = segments.slice(0, i + 1).join('/')
//     const found = allOffers.find((o) => o.url === partial)
//     if (found) {
//       breadcrumbs.push({
//         label: found.title,
//         href: routes.outsourcingOffer(found.url)
//       })
//     }
//   }

//   if (
//     offer.is_visible === false &&
//     process.env.APPLICATION_RUN_MODE === 'production'
//   ) {
//     throw new Error('Offer is not visible')
//   }

//   return { offer, breadcrumbs }
// }
