import type { ArticleItem } from "@/lib/types/content"

// featured: true → shown in the homepage Insights section (first 4 shown)
export const articleItems: ArticleItem[] = [
  {
    title:       "Dating Apps Solved the Wrong Problem",
    description: "The hard problem is not showing more profiles. It is deciding who gets seen, how often, and under what fairness rules.",
    href:        "/articles/dating-app-allocation",
    image:       "/article.png",
    accent:      "linear-gradient(135deg, #f472a8 0%, #ae2f3a 55%, #7c1c26 100%)",
    featured:    true,
    readTime:    "9 min read",
    date:        "Jun 2026",
    category:    "Product Strategy",
    tags:        ["Matching Markets", "Marketplaces", "Incentives", "Optimization"],
    intro: "Every dating app on your phone is great at one thing. It shows you people. Endless profiles, fast filters, a swipe in under a second. That part is basically solved. So why do these apps feel worse every year? Because showing you people was never the hard part. The hard part is who actually gets seen, by whom, and how often. That is the problem I have been working on. The longer I sat with it, the more it looked like a product decision dressed up as an algorithm.",
    takeaways: [
      "Dating apps solved discovery, which is a search problem. Who actually gets seen is the part still left open.",
      "Optimizing for engagement rewards keeping people under-served. The goal you pick, not the UI, is the real product.",
      "Gale–Shapley is the core, not the thing being replaced. Its mutuality and stability stay. The weekly, fair layer is built around it.",
      "Reframing from one stable matching to a fair weekly allocation means the system always returns an answer.",
      "Fairness has to reward a pairing, not a person. A per-person bonus cancels out and does nothing.",
      "The tradeoff between quality, fairness, and stability is real. Picking a point on it is a product call, and worth making in the open.",
    ],
  },

  {
    title:       "Typography Systems for Product Interfaces",
    description: "A practical look at scale, rhythm, hierarchy, responsive type, and the token decisions that make text usable across product surfaces.",
    href:        "/articles/typography-system",
    image:       "/article.png",
    accent:      "linear-gradient(135deg, #fb7185 0%, #e11d48 50%, #881337 100%)",
    featured:    true,
    readTime:    "16 min read",
    date:        "Jun 2024",
    category:    "Design Systems",
    tags:        ["Typography", "Type Scale", "Design Tokens", "Accessibility"],
    intro: "Roughly 95% of the web is written language, which makes the type system the product's primary medium, not a cosmetic pass. This is a complete framework: classification, the modular scale, reading mechanics, hierarchy, responsive type, accessibility, and tokens, each made live with an interactive tool.",
  },

  {
    title:       "Color Systems Are Rules, Not Palettes",
    description: "Foundations, surfaces, semantic roles, accessibility, and how to build an 11-stop scale that teams can apply consistently.",
    href:        "/articles/color-system",
    image:       "/article.png",
    accent:      "linear-gradient(135deg, #fda4af 0%, #f43f5e 45%, #9f1239 100%)",
    featured:    true,
    readTime:    "22 min read",
    date:        "Jun 2024",
    category:    "Design Systems",
    tags:        ["Color", "Design Tokens", "Accessibility", "Foundations"],
    intro: "Your primary color is the single most consequential decision in a design system, every hover, CTA, and focus ring stems from it. This is a complete framework for foundation colors, surfaces, typography, semantic states, picking a primary, and building a full 11-stop tonal scale.",
  },

  {
    title:       "Trust as Architecture in Agentic Commerce",
    description: "When AI pays for you, the payment brand has fewer visible moments. The design problem becomes when trust should appear.",
    href:        "/articles/silent-guardian-agentic-trust",
    image:       "/article.png",
    accent:      "linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #134e4a 100%)",
    featured:    true,
    readTime:    "6 min read",
    date:        "Jun 2026",
    category:    "AI Commerce",
    tags:        ["Agentic Commerce", "Trust Design", "Mastercard", "AI Payments"],
    intro: "Agentic commerce is payments without a payment screen. AI agents transact on your behalf, you don't tap, you don't confirm, you don't see a logo. Which means the entire trust architecture of the payment experience has to be rebuilt from scratch. This is what I learned designing it.",
    sections: [
      {
        heading: "The problem nobody had named yet",
        body: "Traditional payments have trust built into the UI. You see the checkout form. You tap. The Mastercard logo appears. You feel safe. The brand is the trust signal.\n\nAgentic commerce removes every one of those signals. The AI browses on your behalf, selects the best option, initiates the transaction, and the user might not even know it happened until it's done. The logo has nowhere to go. The checkout screen doesn't exist.\n\nMastercard processes the payment in the background, invisible and unacknowledged. In a world where there's no checkout screen, how does a payment network maintain trust, visibility, and relevance?",
      },
      {
        body: "The instinct is to put the logo everywhere. If users can't see you at checkout, make them see you before checkout. After checkout. During. Everywhere. Maximum presence as a compensation for lost real estate.",
        type: "quote",
      },
      {
        heading: "The wrong answer",
        body: "Brand's instinct was maximum visibility. The Mastercard logo throughout the agentic flow, every stage, every state. More presence equals more trust.\n\nThis is wrong for agentic commerce. Agentic commerce is defined by fluidity. The AI is supposed to be acting smoothly on your behalf. Constant brand interruptions break that fluidity. A logo at every stage is noise, not signal. It undermines the very thing that makes agentic commerce valuable.\n\nThe question isn't 'how visible should Mastercard be?' It's 'at which exact moments does Mastercard's presence actually reduce user anxiety?'",
      },
      {
        heading: "The silent guardian",
        body: "The answer I pushed for, and eventually got alignment on, was the silent guardian framework.\n\nMastercard is present throughout the agentic payment journey, processing and routing and protecting. But it's only visible at three moments: payment confirmation, identity verification, and transaction completion. Not a logo, a trust signal. Subtle. Unmistakable when it appears.\n\nThe rest of the time: invisible. The AI acts fluidly. Mastercard is there, working in the background, but not interrupting the experience the user delegated to the AI.\n\nThe visual metaphor that made this land in stakeholder conversations: a bodyguard you don't notice until you need them.",
      },
      {
        type: "image-layout",
        layout: "single",
        images: [
          { src: "/assets/images/work/agent-commerce.jpg", alt: "Agent-led payment flow", caption: "The three guardian moments across the agentic flow." },
        ],
      },
      {
        body: "In ambient computing, trust is earned by appearing at the right moment, not by being everywhere. Presence everywhere is wallpaper. Presence at the right moment is a signal.",
        type: "callout",
      },
      {
        heading: "Why this is a product decision, not a design preference",
        body: "I want to be precise about this: pushing back on Brand wasn't a design choice. It was a product argument.\n\nThe question isn't aesthetic, it's functional. What does Mastercard's presence do at each stage of the agentic flow? At browsing and selection stages, brand presence does nothing useful and potentially interrupts the AI's agency. At confirmation, verification, and completion, the moments of financial commitment and risk, brand presence reduces anxiety and builds confidence.\n\nDesign follows that logic. The framework wasn't 'make it look nicer', it was 'match the trust signal to the moment of user need.'\n\nThe SVP of Multi-Sensory, the Brand team, and all stakeholders aligned. Silent guardian is now the adopted direction for Mastercard's role in agentic commerce.",
      },
      {
        heading: "The multi-sensory dimension",
        body: "Agentic commerce creates another problem the silent guardian framework helped expose: in third-party environments, Mastercard has no persistent visual presence at all.\n\nWhen the screen belongs to ChatGPT or Claude, you can't put a persistent Mastercard logo anywhere. The UI belongs to another platform. So the three guardian moments have to work through channels other than just visual: sound and haptics become primary brand channels.\n\nThis moved multi-sensory design from a nice-to-have to a core brand strategy. The trust signal at payment confirmation isn't just a visual appearance, it's a sound, a haptic pattern, a moment that engages multiple senses simultaneously.\n\nThis is why we partnered with Haptic Labs for research. You can't test whether a haptic pattern builds trust by simulating it in Figma.",
      },
      {
        heading: "What this taught me about trust",
        body: "Trust is not a visual problem. It's an architectural one.\n\nThe question isn't where to put the logo. It's what should happen, and what should be felt, at the exact moment a user needs to know they're safe. Those are different design questions with different answers, and they require different tools to answer them.\n\nIn ambient computing, where AI acts on your behalf and you're not watching every step, trust becomes something the system has to earn at specific moments rather than display continuously. The design challenge is identifying those moments and making them matter.\n\nAgentic commerce is still being figured out. Nobody has done this before. Which is why it's the most interesting design problem I've worked on, and why the answer is still evolving.",
      },
    ],
    takeaways: [
      "Brand presence in agentic flows must be architected around user anxiety, not visibility goals",
      "The silent guardian framework: invisible by default, present only at the three moments that matter",
      "In third-party environments, sound and haptics become the primary brand channels, not visual elements",
      "Pushing back on brand decisions requires product arguments, not design preferences",
      "Trust in ambient computing is earned at specific moments, not displayed continuously",
    ],
  },

  {
    title:       "Designing Incentive Systems",
    description: "Most products fail due to misaligned incentives, not poor UX.",
    href:        "/articles/incentive-systems",
    image:       "/article.png",
    accent:      "linear-gradient(135deg, #f43f5e 0%, #e11d48 50%, #9f1239 100%)",
    featured:    true,
    readTime:    "5 min read",
    date:        "Jan 2025",
    category:    "Product Strategy",
    tags:        ["Incentives", "Retention", "Strategy"],
    intro: "Most products fail not because of bad UX or technical debt, but because the incentives baked into the product don't align with what users actually need. When a platform rewards engagement over satisfaction, it's optimizing for the wrong thing. And users always notice, even when they can't articulate why.",
    sections: [
      {
        heading: "The Misalignment Gap",
        body: "Every product has two sets of stakeholders: the paying customer and the end user. When these aren't the same person, incentives diverge. An ad-supported social app is incentivized to maximize time-on-screen. A B2B tool is incentivized to please the buyer, not the daily user. Understanding this gap is step zero of any serious product audit.\n\nThe misalignment isn't always obvious. A customer success team might celebrate high login rates while support tickets quietly pile up, users logging in to fix problems, not to get value.",
      },
      {
        body: "When your revenue model succeeds only when users succeed, design becomes cleaner. Fewer dark patterns. Less friction. More transparency. Spotify earns when users keep listening, so they optimize for the listening experience. That's incentive alignment in action.",
        type: "quote",
      },
      {
        heading: "Mapping the Incentive Stack",
        body: "Start by asking: what does this product reward? What behavior does it encourage, and who benefits from that behavior? A food delivery app that rewards reordering is fine. But one that penalizes cancellations, even justified ones, has a misaligned incentive that quietly erodes trust.\n\nMap every major user action against who benefits from it. If the answer is consistently 'the company, not the user,' you've found your problem. The product is extracting value rather than creating it.",
      },
      {
        type: "image-layout",
        layout: "2-col",
        images: [
          { src: "/assets/images/work/commerce-platform.jpg", alt: "Extractive commerce model", caption: "Extractive model — value flows to the company." },
          { src: "/assets/images/work/fintech-ai-system.jpg", alt: "Aligned commerce model", caption: "Aligned model — value flows to the user." },
        ],
      },
      {
        heading: "Designing for Alignment",
        body: "Realigning incentives isn't always a redesign, sometimes it's a business model question. But where it is a design problem, the fix usually involves two moves: increase transparency about what the product is optimizing for, and build in friction at the points where misalignment hurts users most.\n\nA lending product shouldn't make it easy to borrow more than a user needs. A streaming platform shouldn't autoplay the next episode without a deliberate pause. These aren't anti-features, they're trust-building mechanics that pay off in long-term retention.",
      },
      {
        body: "The dark pattern playbook works in the short term. It works until users find an alternative, or until a regulator steps in. Incentive alignment is the long-term bet.",
        type: "callout",
      },
    ],
    takeaways: [
      "Always ask: who profits when users behave a certain way?",
      "Misaligned incentives create dark patterns; aligned incentives create trust",
      "Transparency about optimization is itself a trust-building mechanic",
      "When redesigning, audit incentives before auditing flows",
    ],
  },

  {
    title:       "The Cost of Over-Engineering UX",
    description: "Complexity doesn't make products powerful, it makes them harder to use.",
    href:        "/articles/overengineering-ux",
    image:       "/article.png",
    accent:      "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 50%, #4c1d95 100%)",
    featured:    true,
    readTime:    "4 min read",
    date:        "Dec 2024",
    category:    "UX Design",
    tags:        ["Complexity", "Design Decisions", "Simplicity"],
    intro: "There's a certain pride in building elaborate systems. Eleven filter options. Three types of dashboards. A notification preference centre with twenty-three toggles. It feels thorough. It isn't. Complexity is easy to add and nearly impossible to take back, and users pay for it with every interaction.",
    sections: [
      {
        heading: "Complexity as a Safety Net",
        body: "Teams add features when they're unsure who their user is. More options feel like covering all the bases. But every toggle, every menu item, every additional step is a small tax on attention. They compound. A product that requires thirty minutes to configure loses users who needed five minutes to succeed.\n\nThe instinct to add is natural. Removing something feels like admitting a mistake. Keeping it feels safe, 'someone uses this.' But that reasoning fails at scale: ten users who need a feature can easily be served another way. Two hundred users confused by it cannot.",
      },
      {
        body: "When everything is important, nothing is. The most powerful moment in a product redesign is often removing a feature that ten users loved but two hundred found confusing.",
        type: "quote",
      },
      {
        heading: "The Real Cost",
        body: "Over-engineered UX creates three compounding problems. First, it slows down first-time users who can't find the core value. Second, it bloats maintenance costs, every additional state is a potential failure mode. Third, it obscures the product's actual promise behind configuration noise.\n\nI've seen products where the onboarding flow had seventeen steps before a user could do anything meaningful. The engineering team was proud of the flexibility. The conversion numbers told a different story.",
      },
      {
        type: "image-layout",
        layout: "3-featured",
        caption: "The seventeen-step onboarding flow, mapped.",
        images: [
          { src: "/assets/images/work/design-tokens.jpg", alt: "Onboarding flow overview" },
          { src: "/assets/images/work/ai-decision-engine.jpg", alt: "Configuration detail" },
          { src: "/assets/images/work/execution-system.jpg", alt: "Step sequence detail" },
        ],
      },
      {
        heading: "The Subtraction Test",
        body: "Before adding anything, ask: what happens if we remove it? If the answer is 'most users won't notice,' reconsider the addition. Build the minimal version, observe behaviour, add only what friction demands.\n\nThe best products feel inevitable, like every feature is exactly where it should be and nothing is missing. That feeling is the result of relentless subtraction, not addition. It's harder to achieve than it looks.",
      },
      {
        body: "Simplicity is not the absence of features. It's the absence of features that don't belong.",
        type: "callout",
      },
    ],
    takeaways: [
      "Add features last, they compound complexity faster than they compound value",
      "Confusion is usually a signal of unnecessary complexity, not user error",
      "The best redesigns are often net removals of features and steps",
      "Run the subtraction test before every addition: what if we didn't build this?",
    ],
  },

  {
    title:       "Risk as a Design Constraint",
    description: "In fintech, every product decision is also a risk decision.",
    href:        "/articles/risk-as-design-constraint",
    image:       "/article.png",
    accent:      "linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #075985 100%)",
    featured:    true,
    readTime:    "5 min read",
    date:        "Nov 2024",
    category:    "Fintech Design",
    tags:        ["Risk", "Fintech", "Trust"],
    intro: "In fintech, design decisions carry weight that most industries don't experience. A confusing transfer flow isn't just a usability problem, it's a financial risk. An ambiguous confirmation screen isn't copy debt, it's a liability. Understanding risk as a design constraint changes how you approach every single interaction.",
    sections: [
      {
        heading: "Risk Is Always Present",
        body: "Financial products sit at the intersection of trust, money, and regulation. Every design decision influences whether a user acts confidently or hesitates. An ambiguous button label on a payment screen isn't a copy problem, it's a risk signal. If the user isn't sure what will happen, they either abandon or make a mistake. Both outcomes are costly.\n\nThis is why fintech products earn trust slowly and lose it instantly. A single confusing moment during a transaction can be enough to make a user switch providers. The asymmetry is stark.",
      },
      {
        heading: "Friction as a Feature",
        body: "In most contexts, friction is the enemy. In high-stakes contexts, it's intentional design. Banks add confirmation steps on large transfers not to frustrate users, but to reduce the cost of accidental, irreversible actions. Good fintech design knows when to make things fast and when to make them deliberate.\n\nRemoving all friction isn't good UX, it's risk that hasn't been considered. The user who sends money to the wrong account in three taps isn't impressed by the streamlined flow.",
      },
      {
        type: "image-layout",
        layout: "bento",
        gap: "sm",
        caption: "The risk surface across a transfer flow.",
        images: [
          { src: "/assets/images/work/fintech-ai-system.jpg", alt: "Transfer confirmation", colSpan: 2 },
          { src: "/assets/images/work/white-label-platform.jpg", alt: "Risk states", rowSpan: 2 },
          { src: "/assets/images/work/agent-commerce.jpg", alt: "Verification step" },
          { src: "/assets/images/work/commerce-platform.jpg", alt: "Error recovery" },
          { src: "/assets/images/work/design-tokens.jpg", alt: "Confidence cues", colSpan: 3 },
        ],
      },
      {
        body: "The goal isn't a frictionless experience. It's a confident one. Users should understand what's about to happen, feel sure it's correct, and know what to do if something goes wrong.",
        type: "quote",
      },
      {
        heading: "Designing for Confidence",
        body: "Confidence comes from transparency, reversibility, and clear error states. Show the user exactly what will happen before they commit. Where possible, make actions reversible. When something goes wrong, and it will, give users a path forward that doesn't require a support ticket.\n\nThese aren't nice-to-haves in fintech, they're table stakes. And they're also the source of differentiation. The product that makes users feel in control wins long-term retention in a way that clever animations never will.",
      },
    ],
    takeaways: [
      "Friction can be a feature, know when to remove it and when to keep it",
      "Confidence, not frictionlessness, is the goal in high-stakes products",
      "Error handling is a first-class design concern, not an afterthought",
      "Trust is built slowly through consistency and lost instantly through a single confusing moment",
    ],
  },

  {
    title:       "Designing Under Uncertainty",
    description: "Strong teams move forward without perfect data and learn faster.",
    href:        "/articles/designing-under-uncertainty",
    image:       "/article.png",
    accent:      "linear-gradient(135deg, #10b981 0%, #059669 50%, #065f46 100%)",
    featured:    true,
    readTime:    "4 min read",
    date:        "Oct 2024",
    category:    "Process",
    tags:        ["Decision Making", "Process", "Teams"],
    intro: "Waiting for certainty is a strategy for finishing second. The best product teams move forward with incomplete data, structured hypotheses, and the discipline to learn fast when they're wrong. Uncertainty is not an obstacle, it's the permanent condition of building anything worthwhile.",
    sections: [
      {
        heading: "Why Teams Stall",
        body: "Uncertainty is uncomfortable. Teams delay decisions waiting for more research, more data, a clearer brief. But markets don't pause while you gather confidence. The longer you wait, the more likely you are to solve yesterday's problem with tomorrow's deadline.\n\nParalysis masquerades as due diligence. The difference is in the question being asked. 'Do we have enough information to be sure?' leads to waiting. 'What's the cheapest way to get the information that would change our decision?' leads to action.",
      },
      {
        body: "The question isn't 'do we have enough information?', it's 'what's the cheapest experiment that would change our mind?' If the answer is a two-hour prototype, build it. If it's a five-minute user call, make it.",
        type: "quote",
      },
      {
        heading: "The Right Frame",
        body: "Uncertainty isn't a problem to be solved, it's a condition to be managed. Map the decision space: what are the possible outcomes, and what's the cost of each? If the downside of being wrong is recoverable, decide fast. If it's not, invest in reducing uncertainty before committing.\n\nMost product decisions are more recoverable than they feel in the moment. A feature that ships and underperforms can be removed. A design pattern that creates confusion can be updated. The irreversible decisions, architecture choices, public APIs, legal commitments, deserve the extra scrutiny.",
      },
      {
        heading: "Building for Reversibility",
        body: "The infrastructure of confident uncertainty is reversibility. Design systems, modular architecture, and feature flags are tools that make experimentation cheap. When you can undo something quickly, you can decide quickly. The teams that move fastest aren't those with the best instincts, they're those who've invested in making mistakes cheaper.",
      },
      {
        body: "Speed of learning matters more than speed of shipping. A team that ships slowly but learns fast will consistently outperform a team that ships fast but learns slowly.",
        type: "callout",
      },
    ],
    takeaways: [
      "Frame every decision by what information would actually change it",
      "Most product decisions are more reversible than they feel, act accordingly",
      "Reversibility is a design asset worth engineering deliberately",
      "Speed of learning matters more than speed of shipping",
    ],
  },

  {
    title:       "Designing for Cognitive Load in AI Products",
    description: "Managing complexity in intelligent interfaces requires intentional restraint.",
    href:        "/articles/cognitive-load-ai",
    image:       "/article.png",
    accent:      "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #92400e 100%)",
    featured:    false,
    readTime:    "6 min read",
    date:        "Sep 2024",
    category:    "AI Design",
    tags:        ["AI", "Cognitive Load", "Interfaces"],
    intro: "AI makes products more powerful. It also makes them easier to misuse, harder to explain, and more cognitively demanding for the users who interact with them. Managing that complexity isn't a UX problem, it's a product philosophy problem. The teams getting it right are the ones who treat AI as a tool to reduce user effort, not showcase technical capability.",
    sections: [
      {
        heading: "The Complexity Budget",
        body: "Every user arrives with a fixed attention budget. AI features that surface twenty suggestions, generate verbose explanations, and express uncertainty in every output burn that budget fast. The question isn't 'how much can we show?' but 'how little do we need to show for the user to act?'\n\nThe instinct with AI products is to show the reasoning, to prove the system is smart. But users don't want to understand how the intelligence works. They want it to work. The explanation is a cost, not a feature.",
      },
      {
        heading: "Trust and Transparency",
        body: "AI systems create a new design tension: users need to trust the output without blindly following it. Overconfident AI interfaces, those that never show uncertainty, never explain reasoning, lead to either blind trust or wholesale rejection. Neither is healthy.\n\nThe right design expresses confidence where appropriate and invites scrutiny where it matters. A medical AI that presents diagnoses with the same tone as a weather forecast is dangerous. A coding assistant that explains why it made a suggestion helps users learn and evaluate, not just copy-paste.",
      },
      {
        body: "The best AI interfaces don't show everything they know. They show the right thing at the right moment. Lead with the conclusion. Surface the reasoning on demand.",
        type: "quote",
      },
      {
        heading: "Progressive Disclosure of Intelligence",
        body: "The same principle that governs UI complexity governs AI output. Lead with the answer. Offer the reasoning on demand. Surface metadata, confidence level, data source, limitations, only when the user needs to make a high-stakes decision.\n\nThis isn't hiding the AI, it's respecting the user's context. A user doing routine work doesn't need to see uncertainty estimates. A user making a $10M decision does. Design for the task, not the technology.",
      },
    ],
    takeaways: [
      "AI power should reduce user effort, not create new cognitive tasks",
      "Uncertainty in AI output needs a deliberate design pattern, not silence",
      "Progressive disclosure applies to intelligence just as it does to UI",
      "Design for the task the user is trying to complete, not the capability you want to demonstrate",
    ],
  },

  {
    title:       "Building Systems, Not Screens",
    description: "Why senior designers must think in product architectures, not individual flows.",
    href:        "/articles/systems-not-screens",
    image:       "/article.png",
    accent:      "linear-gradient(135deg, #ec4899 0%, #be185d 50%, #831843 100%)",
    featured:    false,
    readTime:    "5 min read",
    date:        "Aug 2024",
    category:    "Design Systems",
    tags:        ["Systems", "Scale", "Architecture"],
    intro: "Junior designers build screens. Senior designers build systems. The difference isn't experience alone, it's the unit of thinking. A screen solves one problem at one moment. A system solves a class of problems across time, context, and scale. The shift from one to the other is the defining transition in a designer's career.",
    sections: [
      {
        heading: "The Trap of Flow-Level Design",
        body: "Most design work happens at the flow level. A sign-up screen. An onboarding sequence. A checkout experience. These are important. But without a systems layer, shared components, patterns, interaction rules, voice guidelines, each flow is an island.\n\nInconsistency compounds invisibly until it becomes the product. A button that behaves differently in two flows isn't a small inconsistency, it's a crack in the user's mental model. Enough cracks, and the whole structure feels unreliable.",
      },
      {
        body: "A design system's real value isn't what it adds, it's what it frees teams to stop thinking about. When spacing, typography, and interaction patterns are solved, energy goes to the problems that actually need it.",
        type: "quote",
      },
      {
        heading: "What a System Actually Is",
        body: "A design system is more than a component library. It's a set of decisions made once so they don't need to be made again. Typography scales, spacing tokens, motion principles, error patterns, voice guidelines, these are decisions that, once made well, liberate teams to focus on unsolved problems.\n\nThe most expensive thing a design team can do is make the same decision fifty times across fifty different screens. The second most expensive thing is to document those fifty decisions after the fact.",
      },
      {
        heading: "Systems Thinking in Product",
        body: "The same principle applies beyond visual design. A product team that designs systems rather than features asks: how does this decision work for a user with one account vs. fifty? How does this pattern scale from one hundred users to one hundred thousand? What breaks at the edges?\n\nSystems thinking is what separates products that look good in demos from products that hold up in the real world. It's a discipline, not a deliverable.",
      },
    ],
    takeaways: [
      "Every design decision is either a one-off or a pattern, treat most as patterns",
      "A design system's value is in what it frees teams to stop thinking about",
      "Scale exposes system debt faster than any audit",
      "The shift from flow-level to systems-level thinking is the core senior-designer transition",
    ],
  },

  {
    title:       "The Trade-Off Framework for Product Decisions",
    description: "Evaluating speed vs scale, and growth vs risk with structured trade-off thinking.",
    href:        "/articles/tradeoff-framework",
    image:       "/article.png",
    accent:      "linear-gradient(135deg, #14b8a6 0%, #0d9488 50%, #134e4a 100%)",
    featured:    false,
    readTime:    "5 min read",
    date:        "Jul 2024",
    category:    "Decision Making",
    tags:        ["Frameworks", "Trade-offs", "Strategy"],
    intro: "Every product decision is a trade-off. Speed vs. quality. Growth vs. retention. Simplicity vs. power. Personalisation vs. privacy. The teams that decide well aren't those with better instincts, they're those with better frameworks for evaluating the trade-offs they face regularly.",
    sections: [
      {
        heading: "Why Trade-Offs Are Hard",
        body: "Trade-offs are uncomfortable because they require committing to a position. Every option in a decision has advocates. Choosing one means accepting the cost of the other. The teams that avoid this discomfort end up with muddled decisions, products that try to do everything and do nothing particularly well.\n\nThe discomfort is a signal that the trade-off is real. If a decision feels easy, it's either not a real trade-off, or someone hasn't thought it through yet.",
      },
      {
        heading: "A Simple Framework",
        body: "When facing a trade-off, map three dimensions: reversibility, cost of being wrong, and time to learn. High reversibility + low cost + fast feedback = decide quickly and iterate. Low reversibility + high cost + slow feedback = invest in reducing uncertainty before committing.\n\nMost product decisions fall into the first category. Architecture decisions, public API contracts, and legal commitments fall into the second. The mistake teams make is treating the second category like the first.",
      },
      {
        body: "Map the reversibility, cost, and feedback speed of a decision before committing. Most product decisions are more reversible than they feel. A few are not, and those deserve genuine scrutiny.",
        type: "quote",
      },
      {
        heading: "Trade-Offs at Scale",
        body: "At scale, every small trade-off compounds. A team of fifty makes hundreds of micro-decisions weekly. Without a shared framework for resolving them, each is resolved individually, inconsistently. Some teams optimise for speed, others for safety. The result is a product that pulls in two directions.\n\nDocumenting trade-off logic, not just outcomes, but the reasoning behind decisions, is what builds organisational judgment over time. A decision log that captures 'we chose X because reversibility outweighed cost at this stage' is worth more than a month of design reviews.",
      },
    ],
    takeaways: [
      "Map reversibility, cost, and feedback speed before committing to any direction",
      "Document why decisions were made, not just what was decided",
      "Shared frameworks create consistent judgment at scale",
      "Discomfort in a trade-off is a signal it's worth taking seriously",
    ],
  },

  {
    title:       "Zero to One vs Scale",
    description: "Why early-stage and enterprise products require fundamentally different design approaches.",
    href:        "/articles/zero-to-one-vs-scale",
    image:       "/article.png",
    accent:      "linear-gradient(135deg, #6366f1 0%, #4338ca 50%, #312e81 100%)",
    featured:    false,
    readTime:    "6 min read",
    date:        "Jun 2024",
    category:    "Product Strategy",
    tags:        ["Startups", "Enterprise", "Product Stages"],
    intro: "The skills that build a product from nothing are largely incompatible with the skills that scale it. Exploration and consolidation require different intuitions, different success metrics, and different tolerances for ambiguity. Understanding which phase you're in, and designing accordingly, is one of the most underrated product skills.",
    sections: [
      {
        heading: "Zero to One: Exploration Mode",
        body: "In the early stage, your job is to discover, not to optimise. Consistency is less important than learning. Moving fast matters more than maintaining standards. A design system at this stage is often premature, it locks in patterns before you know if they're right.\n\nThe metrics that matter here are qualitative: are users getting value? Are they coming back? Can they articulate what the product does for them? Quantitative optimisation against a leaky hypothesis is expensive and misdirected.",
      },
      {
        body: "In the zero-to-one phase, the cost of being wrong about a pattern is low, you can change it. The cost of not learning fast enough is high. Optimise for learning rate, not consistency.",
        type: "quote",
      },
      {
        heading: "Scale Mode: Consolidation",
        body: "Once you know what works, the job changes. Consistency matters. Onboarding new users at scale requires predictability, users can't call you when they're confused. An enterprise customer with a hundred users needs reliability, not novelty. The feature that felt delightfully clever at five hundred users can become confusing noise at fifty thousand.\n\nThis is the phase where a design system pays dividends. Where documentation earns its cost. Where the informal decisions of the early stage need to be formalised and made consistent.",
      },
      {
        heading: "The Transition Problem",
        body: "Most product failures happen in the transition between phases. Teams keep moving fast when the product needs consolidation. Or they consolidate prematurely, freezing patterns before the product has found its footing.\n\nThe signal that you've crossed the threshold: when fixing something breaks more than it helps. When adding a feature creates support tickets. When the onboarding drop-off is about confusion, not value. At that point, the product is telling you it needs system work, not feature work.",
      },
    ],
    takeaways: [
      "In zero-to-one, optimise for learning rate, not consistency or polish",
      "The transition to scale requires a deliberate shift in success metrics",
      "Premature consolidation is as dangerous as staying in exploration mode too long",
      "Watch for the signal: when fixing things breaks more than it helps, you need systems work",
    ],
  },
]
