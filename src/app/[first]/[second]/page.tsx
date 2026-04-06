import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Category } from '@/data/types'
import { loadCategories, loadImages } from '@/lib/load-data'
import CategoryTemplate from '@/components/templates/CategoryTemplate'

function getRelatedCategories(categories: Category[], currentSlug: string): { name: string; href: string; description?: string }[] {
  return categories
    .filter(c => c.slug !== currentSlug)
    .slice(0, 4)
    .map(c => ({ name: c.name, href: c.href || `/${c.slug}`, description: c.description }))
}

export async function generateStaticParams() {
  const categories = loadCategories()
  return categories
    .filter(c => c.slug.includes('/'))
    .map(c => {
      const [first, second] = c.slug.split('/')
      return { first, second }
    })
}

export async function generateMetadata({ params }: { params: Promise<{ first: string; second: string }> }): Promise<Metadata> {
  const { first, second } = await params
  const slug = `${first}/${second}`
  const categories = loadCategories()
  const cat = categories.find(c => c.slug === slug)
  if (!cat) return { title: 'Nicht gefunden' }

  return {
    title: cat.seoTitle,
    description: cat.seoDescription,
    keywords: cat.metaKeywords || cat.keywords?.join(', '),
    alternates: { canonical: `https://ausmalbilder-gratis.com/${cat.slug}/` },
    openGraph: {
      title: cat.seoTitle,
      description: cat.seoDescription,
      url: `https://ausmalbilder-gratis.com/${cat.slug}/`,
      siteName: 'Ausmalbilder Gratis',
      locale: 'de_DE',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: cat.seoTitle,
      description: cat.seoDescription,
    },
  }
}

export default async function DynamicNestedCategoryPage({ params }: { params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params
  const slug = `${first}/${second}`
  const categories = loadCategories()
  const category = categories.find(c => c.slug === slug)

  if (!category) notFound()

  const images = await loadImages(slug)
  const parent = categories.find(c => c.slug === first)

  const breadcrumbs = [
    { name: 'Startseite', href: '/' },
    { name: parent?.name || first.charAt(0).toUpperCase() + first.slice(1), href: `/${first}` },
    { name: category.name, href: `/${slug}` },
  ]

  return (
    <CategoryTemplate
      category={category}
      images={images}
      breadcrumbs={breadcrumbs}
      relatedCategories={getRelatedCategories(categories, slug)}
    />
  )
}
