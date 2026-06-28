import { listWorks } from "@/app/actions/works"
import { WorksManager } from "@/components/admin/works-manager"

export const metadata = {
  title: "Works 管理 — NaN",
}

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const works = await listWorks()
  return <WorksManager initialWorks={works} />
}
