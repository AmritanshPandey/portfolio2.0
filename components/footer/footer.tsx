import { IconBrandLinkedin, IconMail } from "@tabler/icons-react"

export default function Footer() {
  return (
    <footer className="border-t mt-32">

      <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row justify-between gap-10">

        <div className="max-w-sm space-y-4">

          <p className="text-lg font-semibold">
            Designing products at the intersection of strategy,
            systems, and technology.
          </p>

        </div>

        <div className="flex flex-col gap-4 text-sm">

          <a
            href="mailto:amritansh.pandey6@gmail.com"
            className="flex items-center gap-2"
          >
            <IconMail size={18} />
            Email
          </a>

          <a
            href="https://linkedin.com"
            className="flex items-center gap-2"
          >
            <IconBrandLinkedin size={18} />
            LinkedIn
          </a>

          <p>Gurgaon, India</p>

        </div>

      </div>

      <div className="text-center text-sm pb-8 text-muted-foreground">
        © 2025 Amritansh Pandey
      </div>

    </footer>
  )
}