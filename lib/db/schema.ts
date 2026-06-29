export type Work = {
  id: string
  title: string
  subtitle: string
  tags: string
  year: string
  client: string
  role: string
  coverImage: string
  overview: string
  body: string
  gallery: string[]
  order: number
  published: boolean
  createdAt: string
  updatedAt: string
}

/** Row shape returned by Supabase (snake_case). */
export type WorkRow = {
  id: string
  title: string
  subtitle: string
  tags: string
  year: string
  client: string
  role: string
  cover_image: string
  overview: string
  body: string
  gallery: string[]
  order: number
  published: boolean
  created_at: string
  updated_at: string
}

export function rowToWork(r: WorkRow): Work {
  return {
    id: r.id,
    title: r.title,
    subtitle: r.subtitle,
    tags: r.tags,
    year: r.year,
    client: r.client,
    role: r.role,
    coverImage: r.cover_image,
    overview: r.overview,
    body: r.body,
    gallery: Array.isArray(r.gallery) ? r.gallery : [],
    order: r.order,
    published: r.published,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}
