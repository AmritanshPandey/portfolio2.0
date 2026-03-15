export default function ContentPage({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <main className="max-w-3xl mx-auto px-6 py-24">

      <h1 className="text-4xl font-semibold mb-6">
        {title}
      </h1>

      <p className="text-muted-foreground mb-12">
        {description}
      </p>

      <div className="space-y-10">
        {children}
      </div>

    </main>
  )
}