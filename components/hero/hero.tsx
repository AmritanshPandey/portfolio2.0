"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { IconArrowUpRight, IconDownload } from "@tabler/icons-react"

export default function Hero() {

    const heroRef = useRef(null)

    useEffect(() => {

        const ctx = gsap.context(() => {

            gsap.from(".hero-line", {
                y: 40,
                opacity: 0,
                duration: 0.9,
                stagger: 0.12,
                ease: "power3.out"
            })

            gsap.from(".hero-image", {
                y: 40,
                opacity: 0,
                duration: 1,
                delay: 0.25,
                ease: "power3.out"
            })

        }, heroRef)

        return () => ctx.revert()

    }, [])

    return (

        <section
            ref={heroRef}
            className="max-w-7xl mx-auto px-6 pt-16 md:pt-20 pb-20 md:pb-28 grid lg:grid-cols-[1.9fr_1fr] gap-10 lg:gap-14 items-start"
        >

            {/* LEFT COLUMN */}

            <div className="space-y-4 max-w-2xl">

                <p className="hero-line text-md tracking-[0.16em] font-semibold uppercase text-muted-foreground">
                    Product Designer
                </p>

                <h1 className="hero-line text-[32px] md:text-[48px] lg:text-[56px] font-semibold leading-[1.1] tracking-tight text-balance">

                    Designing Scalable
                    <br />
                    <span className="bg-gradient-to-r from-red-600 to-rose-700 bg-clip-text text-transparent">
                        Product Systems
                    </span>
                    <br />
                    for Global Fintech Platforms

                </h1>

                <p className="hero-line text-lg text-muted-foreground max-w-lg">
                    Designing fintech product systems used across global payment networks.
                    Turning complex capabilities into scalable product experiences.
                </p>

                <div className="hero-line text-sm text-muted-foreground/80 flex gap-3 pt-2">
                    <span>Mastercard</span>
                    <span>•</span>
                    <span>Startup Advisor</span>
                    <span>•</span>
                    <span>Mentor</span>
                </div>

                {/* CTA Buttons */}

                <div className="hero-line flex flex-wrap gap-4 pt-8">

                    <Button
                        size="lg"
                        className="gap-2 px-10 py-6 text-base transition-all hover:-translate-y-[2px]"
                    >
                        Explore Work
                        <IconArrowUpRight size={18} />
                    </Button>

                    <Button
                        size="lg"
                        variant="outline"
                        className="gap-2 px-10 py-6 text-base transition-all hover:-translate-y-[2px]"
                    >
                        Download Résumé
                        <IconDownload size={18} />
                    </Button>

                </div>

            </div>

            {/* RIGHT COLUMN — PORTRAIT */}

            <div className="hero-image flex justify-center lg:justify-end">

                <div className="relative">

                    <div className="absolute -inset-4 bg-neutral-200 rounded-3xl blur-xl opacity-40"></div>

                    <div className="relative w-[400px] h-[520px] rounded-2xl overflow-hidden border border-neutral-100">

                        <Image
                            src="/assets/images/pic.jpg"
                            alt="Amritansh Pandey"
                            fill
                            priority
                            className="object-cover object-[60%_35%]"
                        />

                    </div>

                </div>

            </div>

        </section>

    )
}