/** Supabase may return a many-to-one join as an object or a single-element array. */
export function projectTitle(
  projects: { title: string } | { title: string }[] | null | undefined
): string {
  if (!projects) return 'Unknown Project'
  const row = Array.isArray(projects) ? projects[0] : projects
  return row?.title ?? 'Unknown Project'
}
