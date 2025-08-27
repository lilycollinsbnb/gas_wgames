// import fs from 'fs'
// import path from 'path'
// import matter from 'gray-matter'
// import { BreadcrumbItem, Training } from '@/types'
// import routes from '@/config/routes'

// const trainingsDirectory = (locale: string) =>
//   path.join(process.cwd(), `src/data/static/markdown/${locale}/trainings`)

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

// export async function getAllTrainings(locale: string): Promise<Training[]> {
//   const baseDir = trainingsDirectory(locale)
//   const files = getAllMarkdownFiles(baseDir)

//   const flatTrainings: Training[] = await Promise.all(
//     files.map(async (filePath) => {
//       const fileContents = fs.readFileSync(filePath, 'utf8')
//       const { data, content } = matter(fileContents)

//       const relativePath = path.relative(baseDir, filePath)
//       const url_path = relativePath
//         .replace(/\.md$/, '')
//         .split(path.sep)
//         .join('/')

//       return {
//         ...(data as Omit<Training, 'id' | 'content' | 'url' | 'children'>),
//         id: '',
//         content,
//         url: url_path,
//         children: []
//       }
//     })
//   )

//   const pathMap = new Map<string, Training>()
//   flatTrainings.forEach((training) => pathMap.set(training.url, training))

//   for (const training of flatTrainings) {
//     const parentPath = training.url.split('/').slice(0, -1).join('/')
//     if (pathMap.has(parentPath)) {
//       const parent = pathMap.get(parentPath)!
//       parent.children = parent.children || []
//       parent.children.push(training)
//     }
//   }

//   return process.env.APPLICATION_RUN_MODE === 'production'
//     ? flatTrainings.filter((training) => training.is_visible)
//     : flatTrainings
// }

// export async function getTopLevelTrainings(
//   locale: string
// ): Promise<Training[]> {
//   const allTrainings = await getAllTrainings(locale)

//   const topLevelTrainings = allTrainings.filter((training) => {
//     const parentPath = training.url.split('/').slice(0, -1).join('/')
//     return !allTrainings.some((t) => t.url === parentPath)
//   })

//   return process.env.APPLICATION_RUN_MODE === 'production'
//     ? topLevelTrainings.filter((training) => training.is_visible)
//     : topLevelTrainings
// }

// export async function getTraining(
//   locale: string,
//   urlPath: string
// ): Promise<{ training: Training; breadcrumbs: BreadcrumbItem[] }> {
//   const baseDir = trainingsDirectory(locale)
//   const filePath = path.join(baseDir, `${urlPath}.md`)

//   if (!fs.existsSync(filePath)) {
//     throw new Error(`Training not found: ${filePath}`)
//   }

//   const fileContents = fs.readFileSync(filePath, 'utf8')
//   const { data, content } = matter(fileContents)

//   const allTrainings = await getAllTrainings(locale)
//   const currentDepth = urlPath.split('/').length

//   const children = allTrainings.filter((t) => {
//     const segments = t.url.split('/')
//     return (
//       t.url.startsWith(`${urlPath}/`) && segments.length === currentDepth + 1
//     )
//   })

//   const training: Training = {
//     ...(data as Omit<Training, 'id' | 'content' | 'url' | 'children'>),
//     id: '',
//     content,
//     url: urlPath,
//     children
//   }

//   const breadcrumbs: BreadcrumbItem[] = []
//   const segments = urlPath.split('/')

//   for (let i = 0; i < segments.length; i++) {
//     const partial = segments.slice(0, i + 1).join('/')
//     const found = allTrainings.find((t) => t.url === partial)
//     if (found) {
//       breadcrumbs.push({
//         label: found.title,
//         href: routes.training(found.url)
//       })
//     }
//   }

//   if (
//     training.is_visible === false &&
//     process.env.APPLICATION_RUN_MODE === 'production'
//   ) {
//     throw new Error('Training is not visible')
//   }

//   return { training, breadcrumbs }
// }
