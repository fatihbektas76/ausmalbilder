import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Category } from '@/data/types'
import { loadCategories, loadImages } from '@/lib/load-data'
import CategoryTemplate from '@/components/templates/CategoryTemplate'

function getRelatedCategories(categories: Category[], currentSlug: string): { name: string; href: string; description?: string }[] {
  return categories
    .filter(c => c.slug !== currentSlug && !c.slug.includes('/'))
    .slice(0, 4)
    .map(c => ({ name: c.name, href: c.href || `/${c.slug}`, description: c.description }))
}

export function generateStaticParams() {
  const categories = loadCategories()
  return categories
    .filter(c => !c.slug.includes('/'))
    .map(c => ({ first: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ first: string }> }): Promise<Metadata> {
  const { first } = await params
  const categories = loadCategories()
  const cat = categories.find(c => c.slug === first)
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

export default async function DynamicCategoryPage({ params }: { params: Promise<{ first: string }> }) {
  const { first } = await params
  const categories = loadCategories()
  const category = categories.find(c => c.slug === first)

  if (!category) notFound()

  // Find child categories (e.g. tiere → tiere/pferd, tiere/elefant, tiere/loewen)
  const childCategories = categories
    .filter(c => c.parentSlug === first)
    .map(c => ({
      name: c.name,
      href: `/${c.slug}`,
      description: c.description,
      slug: c.slug,
    }))

  // Load images: direct + all child categories combined
  let images = await loadImages(first)
  if (childCategories.length > 0) {
    const childImages = await Promise.all(
      childCategories.map(c => loadImages(c.slug))
    )
    images = [...images, ...childImages.flat()]
  }

  const breadcrumbs = [
    { name: 'Startseite', href: '/' },
    { name: category.name, href: `/${category.slug}` },
  ]

  return (
    <CategoryTemplate
      category={category}
      images={images}
      breadcrumbs={breadcrumbs}
      relatedCategories={getRelatedCategories(categories, category.slug)}
      childCategories={childCategories.length > 0 ? childCategories : undefined}
    />
  )
}
