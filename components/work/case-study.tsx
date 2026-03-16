"use client"

import { IconArrowRight } from "@tabler/icons-react"
import Image from "next/image"
import Link from "next/link"

export default function WorkSection() {

    const projects = [
        {
            category: "Commerce Platform",
            title: "Shared Commerce Platform for Multi-Brand D2C",
            description:
                "Unified three D2C brands on a shared commerce backbone while preserving brand differentiation.",
            image: "/assets/images/work/commerce-platform.jpg",
            href: "/work/d2c-platform",
        },
        {
            category: "Enterprise Platform",
            title: "Modular White-Label Platform for Enterprise Sales",
            description:
                "Built a configurable banking system enabling rapid demo customization for enterprise sales.",
            image: "/assets/images/work/white-label-platform.jpg",
            href: "/work/white-label-rfp",
        },
        {
            category: "Fintech Platform",
            title: "Transaction-Driven SME Credit Platform",
            description:
                "Designed a lending model using transaction data to enable faster SME credit decisions.",
            image: "/assets/images/work/sme-credit-platform.jpg",
            href: "/work/sme-credit",
        },
    ]

    return (
        <section id="work" className="bg-[var(--bg2)]">

            <div className="max-w-7xl mx-auto px-6 py-16">

                {/* Header */}

                <div className="mb-16 w-full">

                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
                        Work
                    </p>

                    <h2 className="text-4xl md:text-5xl font-semibold mt-4 tracking-tight leading-[1.1]">
                        Product Strategy & Platform Design
                    </h2>

                </div>


                {/* Grid */}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {projects.map((project, index) => (

                        <Link href={project.href} key={index}>
                            <div className="group bg-white border border-neutral-200 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">

                                <div className="relative h-52 w-full overflow-hidden">
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>

                                <div className="p-8">

                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500 mb-3">
                                        {project.category}
                                    </p>

                                    <h3 className="text-xl font-semibold leading-snug mb-3">
                                        {project.title}
                                    </h3>

                                    <p className="text-neutral-600 leading-relaxed mb-6">
                                        {project.description}
                                    </p>

                                    <div className="flex items-center gap-2 text-red-600 font-medium transition-all group-hover:gap-3">
                                        View Case Study
                                        <IconArrowRight
                                            size={18}
                                            className="transition-transform group-hover:translate-x-1"
                                        />
                                    </div>

                                </div>

                            </div>
                        </Link>

                    ))}

                </div>

            </div>

        </section>
    )
}