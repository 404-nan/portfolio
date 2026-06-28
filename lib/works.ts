import worksData from "@/data/works.json"

export type Work = {
  id: string
  title: string
  tags: string
  image: string
  order: number
}

export function getWorks(): Work[] {
  return [...worksData].sort((a, b) => a.order - b.order)
}
