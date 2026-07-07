import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  ClipboardList,
  Clock,
  Handshake,
  MapPin,
  Navigation,
  Package,
  Route,
  ShieldCheck,
  Sprout,
  Store,
  Truck,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import agrivoLogoFooter from "../../assets/agrivo-logo-footer.png";
import { AgrivoNavbar } from "../components/AgrivoNavbar";
import { LogisticsHeroVisual } from "../components/logistics/LogisticsHeroVisual";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";

const viewport = { once: true, amount: 0.2 } as const;

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

const heroChips = ["Farm pickup", "Live status updates", "Verified handoff"];

const deliverySteps = [
  {
    step: 1,
    title: "Order confirmed",
    description: "Buyer places an order from a verified farmer.",
    icon: Store,
  },
  {
    step: 2,
    title: "Pickup scheduled",
    description: "A logistics partner receives pickup and delivery details.",
    icon: ClipboardList,
  },
  {
    step: 3,
    title: "Product in transit",
    description: "Fresh produce is tracked from farm pickup to buyer handoff.",
    icon: Truck,
  },
  {
    step: 4,
    title: "Delivery completed",
    description: "Buyer confirms delivery and the order status is updated.",
    icon: BadgeCheck,
  },
];

const trackingSteps = [
  "Order confirmed",
  "Pickup scheduled",
  "Picked up from farm",
  "In transit",
  "Delivered",
] as const;

const currentTrackingStep = "In transit";

const benefits = [
  {
    title: "Verified delivery requests",
    description: "Receive delivery tasks connected to real Agrivo orders.",
    icon: ShieldCheck,
  },
  {
    title: "Clear pickup and drop-off details",
    description: "See farmer location, buyer location, quantity, and delivery window.",
    icon: MapPin,
  },
  {
    title: "Status updates made simple",
    description: "Update pickup, transit, and delivery progress in one place.",
    icon: Navigation,
  },
  {
    title: "Build trusted partnerships",
    description: "Work with farmers, markets, restaurants, and local produce sellers.",
    icon: Handshake,
  },
];

const roleCards = [
  {
    title: "For Farmers",
    question: "Need delivery for your orders?",
    description: "Schedule pickup after receiving buyer orders.",
    icon: Sprout,
  },
  {
    title: "For Buyers",
    question: "Want visibility on your order?",
    description: "Track every batch until delivery.",
    icon: Users,
  },
  {
    title: "For Logistics Partners",
    question: "Want to deliver with Agrivo?",
    description: "Join as a logistics partner and receive delivery tasks.",
    icon: Truck,
  },
];

const faqItems = [
  {
    question: "Who can become a logistics partner?",
    answer:
      "Licensed delivery operators, fleet owners, and independent drivers with refrigerated or fresh-produce capacity can apply through Agrivo.",
  },
  {
    question: "Can buyers track their orders?",
    answer:
      "Yes. Buyers see pickup, transit, and delivery milestones for every confirmed Agrivo order batch.",
  },
  {
    question: "How are deliveries assigned?",
    answer:
      "After an order is confirmed, Agrivo matches available logistics partners based on route, capacity, and delivery window.",
  },
  {
    question: "Is proof of delivery required?",
    answer:
      "Partners confirm handoff at delivery with a status update. Photo or signature proof can be added as the feature expands.",
  },
];

function SectionIntro({
  eyebrow,
  title,
  description,
  className = "",
}: {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <motion.div
      className={`mx-auto mb-8 max-w-2xl text-center md:mb-12 ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={reveal}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#15803d] sm:mb-3 sm:text-sm sm:tracking-[0.24em]">
        {eyebrow}
      </p>
      <h2 className="agrivo-heading agrivo-section-title text-[#102018]">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-[#5F6F64] sm:mt-4 sm:text-base">{description}</p>
    </motion.div>
  );
}

function FlowStepCard({
  step,
  index,
}: {
  step: (typeof deliverySteps)[number];
  index: number;
}) {
  const Icon = step.icon;

  return (
    <motion.article
      className="agrivo-logistics-flow-card agrivo-card"
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={reveal}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="agrivo-logistics-flow-card-inner">
        <div className="flex items-center justify-between gap-3">
          <div className="agrivo-step-icon">
            <Icon className="h-5 w-5 text-[#14532D]" strokeWidth={2} />
          </div>
          <p className="agrivo-step-label">Step {String(step.step).padStart(2, "0")}</p>
        </div>
        <h3 className="agrivo-heading mt-4 text-lg font-bold text-[#102018]">{step.title}</h3>
        <p className="mt-2 text-sm leading-6 text-[#5F6F64]">{step.description}</p>
      </div>
      {index < deliverySteps.length - 1 ? (
        <ChevronRight className="agrivo-logistics-flow-arrow hidden h-5 w-5 text-[#86efac] lg:block" aria-hidden />
      ) : null}
    </motion.article>
  );
}

function BenefitCard({
  benefit,
  index,
}: {
  benefit: (typeof benefits)[number];
  index: number;
}) {
  const Icon = benefit.icon;

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={reveal}
      transition={{ duration: 0.65, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="agrivo-logistics-benefit-card agrivo-card h-full rounded-[28px] border border-[#e5efe1] bg-white shadow-[0_10px_28px_rgba(20,83,45,0.05)]">
        <CardContent className="flex h-full flex-col p-6 sm:p-7">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f0f7ee]">
            <Icon className="h-5 w-5 text-[#14532d]" strokeWidth={1.75} />
          </div>
          <h3 className="agrivo-heading text-lg font-bold text-[#102018]">{benefit.title}</h3>
          <p className="mt-2 flex-1 text-sm leading-6 text-[#5F6F64]">{benefit.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function RoleCard({
  card,
  index,
}: {
  card: (typeof roleCards)[number];
  index: number;
}) {
  const Icon = card.icon;

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={reveal}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="agrivo-card h-full rounded-[28px] border border-[#e5efe1] bg-white shadow-[0_10px_28px_rgba(20,83,45,0.05)]">
        <CardContent className="flex h-full flex-col p-6 sm:p-7">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ecfdf5]">
              <Icon className="h-5 w-5 text-[#14532d]" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#15803d]">{card.title}</p>
          </div>
          <h3 className="agrivo-heading text-xl font-bold text-[#102018]">{card.question}</h3>
          <p className="mt-2 flex-1 text-sm leading-6 text-[#5F6F64]">{card.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function scrollToSection(sectionId: string) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  const top = section.getBoundingClientRect().top + window.scrollY - 88;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

export default function LogisticsPage() {
  const goToPage = (page: string) => {
    window.location.hash = page;
  };

  return (
    <div className="agrivo-shell agrivo-logistics-page min-h-screen overflow-x-hidden">
      <AgrivoNavbar activeItem="logistics" />
      <div className="agrivo-header-spacer" aria-hidden="true" />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pb-12 pt-6 sm:pb-16 sm:pt-8 md:pb-20 lg:pb-24">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,#F6FBF4_0%,#EEF8EE_55%,#FFFFFF_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[30rem] bg-[radial-gradient(circle_at_top_left,rgba(67,160,71,0.14),transparent_30%),radial-gradient(circle_at_top_right,rgba(20,83,45,0.06),transparent_22%)]" />

          <div className="agrivo-container relative">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <motion.div
                initial="hidden"
                animate="show"
                variants={reveal}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#15803d] sm:text-sm">
                  Agrivo Logistics
                </p>
                <h1 className="agrivo-heading text-3xl font-bold leading-tight text-[#102018] sm:text-4xl md:text-5xl">
                  Smarter delivery for fresh produce
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-[#5F6F64] sm:text-base">
                  Agrivo helps farmers, buyers, and logistics partners move fresh products from farm
                  pickup to market delivery with transparency and trust.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button
                    className="agrivo-button-soft w-full rounded-full bg-[#14532D] px-6 text-white hover:bg-[#1D6A3B] sm:w-auto"
                    onClick={() => goToPage("login")}
                  >
                    Become a Logistics Partner
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-[#dbe7d4] bg-white px-6 text-[#14532D] hover:bg-[#EAF7EC] sm:w-auto"
                    onClick={() => scrollToSection("tracking")}
                  >
                    Track Delivery
                  </Button>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {heroChips.map((chip) => (
                    <span
                      key={chip}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#dbe7d4] bg-white px-4 py-1.5 text-xs font-medium text-[#14532D] sm:text-sm"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-[#43A047]" />
                      {chip}
                    </span>
                  ))}
                </div>
              </motion.div>

              <LogisticsHeroVisual />
            </div>
          </div>
        </section>

        {/* Delivery flow */}
        <section className="agrivo-section bg-white">
          <div className="agrivo-container">
            <SectionIntro
              eyebrow="Delivery flow"
              title="How Agrivo Logistics Works"
              description="A clear delivery flow from confirmed order to completed handoff."
            />

            <div className="agrivo-logistics-flow-grid">
              {deliverySteps.map((step, index) => (
                <FlowStepCard key={step.step} step={step} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Tracking preview */}
        <section id="tracking" className="agrivo-section agrivo-scroll-anchor bg-[#f8faf4]">
          <div className="agrivo-container">
            <SectionIntro
              eyebrow="Order visibility"
              title="Track every batch from farm to buyer"
              description="Agrivo gives all sides visibility into pickup, transit, and delivery status."
            />

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              variants={reveal}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card className="agrivo-logistics-tracking-card overflow-hidden rounded-[32px] border border-[#e5efe1] bg-white shadow-[0_16px_48px_rgba(20,83,45,0.08)]">
                <CardContent className="p-5 sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#edf2ea] pb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ecfdf5]">
                        <Package className="h-5 w-5 text-[#14532d]" />
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-[#6b7a70]">Order ID</p>
                        <h3 className="agrivo-heading text-2xl font-bold text-[#102018]">AGR-2048</h3>
                      </div>
                    </div>
                    <Badge className="rounded-full border border-[#fde68a] bg-[#fffbeb] px-3 py-1 text-xs font-semibold text-[#b45309] hover:bg-[#fffbeb]">
                      {currentTrackingStep}
                    </Badge>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      { label: "Product", value: "Tomatoes · 120 kg" },
                      { label: "Farmer", value: "Ali Hasanov" },
                      { label: "Buyer", value: "Green Market Baku" },
                      { label: "Route", value: "Lankaran Farm → Baku Market" },
                    ].map((detail) => (
                      <div
                        key={detail.label}
                        className="rounded-[18px] border border-[#edf2ea] bg-[#f8faf4] px-4 py-3"
                      >
                        <p className="text-xs font-medium uppercase tracking-wide text-[#7a8b80]">{detail.label}</p>
                        <p className="mt-1 text-sm font-semibold leading-snug text-[#102018] sm:text-base">
                          {detail.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="agrivo-logistics-timeline mt-8">
                    {trackingSteps.map((step, index) => {
                      const currentIndex = trackingSteps.indexOf(currentTrackingStep);
                      const isComplete = index < currentIndex;
                      const isCurrent = step === currentTrackingStep;
                      const isPending = index > currentIndex;

                      return (
                        <div
                          key={step}
                          className={`agrivo-logistics-timeline-item ${isComplete ? "agrivo-logistics-timeline-item--done" : ""}`}
                        >
                          <div className="agrivo-logistics-timeline-marker-wrap">
                            <span
                              className={`agrivo-logistics-timeline-marker ${
                                isCurrent
                                  ? "agrivo-logistics-timeline-marker--current"
                                  : isComplete
                                    ? "agrivo-logistics-timeline-marker--done"
                                    : "agrivo-logistics-timeline-marker--pending"
                              }`}
                            />
                            {index < trackingSteps.length - 1 ? (
                              <span
                                className={`agrivo-logistics-timeline-line ${
                                  isComplete ? "agrivo-logistics-timeline-line--done" : ""
                                }`}
                              />
                            ) : null}
                          </div>
                          <div
                            className={`agrivo-logistics-timeline-content ${
                              isCurrent ? "agrivo-logistics-timeline-content--current" : ""
                            } ${isPending ? "agrivo-logistics-timeline-content--pending" : ""}`}
                          >
                            <p className="text-sm font-semibold text-[#102018]">{step}</p>
                            {isCurrent ? (
                              <p className="mt-0.5 text-xs text-[#15803d]">Current status</p>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Partner benefits */}
        <section className="agrivo-section bg-white">
          <div className="agrivo-container">
            <SectionIntro
              eyebrow="Partner network"
              title="Why join Agrivo Logistics?"
              description="Help fresh products reach markets while growing your delivery network."
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6">
              {benefits.map((benefit, index) => (
                <BenefitCard key={benefit.title} benefit={benefit} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Route preview */}
        <section className="agrivo-section bg-[#f8faf4]">
          <div className="agrivo-container">
            <SectionIntro
              eyebrow="Route planning"
              title="Plan routes between farms and markets"
              description="See distance, timing, and batch details before every handoff."
            />

            <motion.div
              className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8"
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              variants={reveal}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card className="agrivo-logistics-route-card overflow-hidden rounded-[32px] border border-[#e5efe1] bg-white shadow-[0_12px_36px_rgba(20,83,45,0.06)]">
                <CardContent className="p-5 sm:p-7">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f0f7ee]">
                      <Route className="h-5 w-5 text-[#14532d]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#15803d]">Active route</p>
                      <h3 className="agrivo-heading text-lg font-bold text-[#102018] sm:text-xl">
                        Quba farm pickup → Baku market delivery
                      </h3>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-[24px] border border-[#e5efe1] bg-[linear-gradient(180deg,#f8faf4_0%,#eef8ee_100%)] p-5 sm:p-6">
                    <svg className="h-36 w-full sm:h-44" viewBox="0 0 480 160" aria-hidden>
                      <path
                        d="M 40 120 Q 140 40, 240 70 T 440 50"
                        fill="none"
                        stroke="#dbe7d4"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <path
                        className="agrivo-logistics-route-progress-static"
                        d="M 40 120 Q 140 40, 240 70 T 440 50"
                        fill="none"
                        stroke="#43A047"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <circle cx="40" cy="120" r="8" fill="#14532D" />
                      <circle cx="440" cy="50" r="8" fill="#43A047" />
                    </svg>

                    <motion.div
                      className="absolute left-[48%] top-[38%] flex h-10 w-10 items-center justify-center rounded-xl border border-[#bbf7d0] bg-[#14532D] text-white shadow-md"
                      animate={{ x: [0, 8, 0], y: [0, -4, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Truck className="h-4 w-4" />
                    </motion.div>

                    <div className="mt-2 flex items-center justify-between text-xs font-semibold text-[#3f5247]">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#14532D]" />
                        Quba farm
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#43A047]" />
                        Baku market
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="agrivo-card flex h-full flex-col rounded-[32px] border border-[#e5efe1] bg-white shadow-[0_12px_36px_rgba(20,83,45,0.06)]">
                <CardContent className="flex flex-1 flex-col p-5 sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#15803d]">Route details</p>
                  <h3 className="agrivo-heading mt-2 text-2xl font-bold text-[#102018]">Delivery overview</h3>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {[
                      { label: "Distance", value: "168 km", icon: Route },
                      { label: "Estimated time", value: "2h 40m", icon: Clock },
                      { label: "Batch", value: "Apples · 200 kg", icon: Package },
                      { label: "Status", value: "In transit", icon: Truck },
                    ].map((item) => {
                      const Icon = item.icon as LucideIcon;
                      return (
                        <div
                          key={item.label}
                          className="rounded-[18px] border border-[#edf2ea] bg-[#f8faf4] px-4 py-3"
                        >
                          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[#7a8b80]">
                            <Icon className="h-3.5 w-3.5 text-[#43A047]" />
                            {item.label}
                          </div>
                          <p className="mt-1 text-sm font-semibold text-[#102018] sm:text-base">{item.value}</p>
                        </div>
                      );
                    })}
                  </div>

                  <p className="mt-6 rounded-[18px] border border-dashed border-[#bbf7d0] bg-[#f6fbf4] px-4 py-3 text-sm leading-6 text-[#3f5247]">
                    Route previews help logistics partners plan pickups, transit windows, and market
                    handoffs before departure.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Role CTA */}
        <section className="agrivo-section bg-white">
          <div className="agrivo-container">
            <SectionIntro
              eyebrow="Built for every role"
              title="Delivery that works for farmers, buyers, and partners"
              description="Agrivo connects each side of the supply chain with clear status and trusted handoffs."
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6">
              {roleCards.map((card, index) => (
                <RoleCard key={card.title} card={card} index={index} />
              ))}
            </div>

            <motion.div
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              variants={reveal}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <Button
                className="agrivo-button-soft w-full rounded-full bg-[#14532D] px-8 text-white hover:bg-[#1D6A3B] sm:w-auto"
                onClick={() => goToPage("login")}
              >
                Join as Logistics Partner
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-full border-[#dbe7d4] px-8 text-[#14532D] hover:bg-[#EAF7EC] sm:w-auto"
                onClick={() => goToPage("products")}
              >
                Browse Marketplace
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="agrivo-section bg-[#f8faf4]">
          <div className="agrivo-container">
            <SectionIntro
              eyebrow="FAQ"
              title="Common questions about Agrivo Logistics"
              description="Short answers for farmers, buyers, and delivery partners."
            />

            <motion.div
              className="mx-auto max-w-3xl"
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              variants={reveal}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Accordion type="single" collapsible className="space-y-3">
                {faqItems.map((item, index) => (
                  <AccordionItem
                    key={item.question}
                    value={`faq-${index}`}
                    className="overflow-hidden rounded-[20px] border border-[#e5efe1] bg-white px-5 shadow-sm"
                  >
                    <AccordionTrigger className="py-4 text-left text-sm font-semibold text-[#102018] hover:no-underline sm:text-base">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-sm leading-6 text-[#5F6F64]">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-[#14532d] py-12 text-white sm:py-16">
        <div className="agrivo-container">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3 xl:grid-cols-5">
            <div className="agrivo-reveal">
              <button
                type="button"
                className="footer-logo mb-6 inline-block"
                onClick={() => goToPage("home")}
                aria-label="Agrivo home"
              >
                <img src={agrivoLogoFooter} alt="Agrivo" width={170} height={48} decoding="async" />
              </button>
              <p className="max-w-sm text-sm leading-7 text-[#d1fae5]">
                Connecting Azerbaijan&apos;s farms to markets with trust and transparency.
              </p>
            </div>

            <div className="agrivo-reveal">
              <h3 className="text-lg font-semibold">Platform</h3>
              <div className="mt-4 space-y-3 text-sm text-[#d1fae5]">
                <button className="block transition-colors hover:text-white" onClick={() => goToPage("products")}>
                  Marketplace
                </button>
                <button className="block transition-colors hover:text-white" onClick={() => goToPage("farmers")}>
                  Farmers
                </button>
                <button className="block transition-colors hover:text-white" onClick={() => goToPage("jobs")}>
                  Farm Jobs
                </button>
                <button className="block transition-colors hover:text-white" onClick={() => goToPage("logistics")}>
                  Logistics
                </button>
              </div>
            </div>

            <div className="agrivo-reveal">
              <h3 className="text-lg font-semibold">Company</h3>
              <div className="mt-4 space-y-3 text-sm text-[#d1fae5]">
                <button className="block transition-colors hover:text-white" onClick={() => goToPage("home")}>
                  About
                </button>
                <button className="block transition-colors hover:text-white" onClick={() => goToPage("products")}>
                  Blog
                </button>
                <button className="block transition-colors hover:text-white" onClick={() => goToPage("farmers")}>
                  Contact
                </button>
              </div>
            </div>

            <div className="agrivo-reveal">
              <h3 className="text-lg font-semibold">Support</h3>
              <div className="mt-4 space-y-3 text-sm text-[#d1fae5]">
                <button className="block transition-colors hover:text-white" onClick={() => goToPage("login")}>
                  Help Center
                </button>
                <button className="block transition-colors hover:text-white" onClick={() => scrollToSection("tracking")}>
                  Track Orders
                </button>
                <button className="block transition-colors hover:text-white" onClick={() => goToPage("login")}>
                  Privacy Policy
                </button>
              </div>
            </div>

            <div className="agrivo-reveal">
              <h3 className="text-lg font-semibold">Newsletter</h3>
              <p className="mt-4 text-sm leading-7 text-[#d1fae5]">Get fresh updates and farming insights.</p>
              <div className="mt-5 flex w-full max-w-sm flex-col gap-3 sm:flex-row lg:max-w-none lg:flex-col">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="h-11 w-full rounded-full border-white/15 bg-white/10 text-white placeholder:text-[#bbf7d0] focus-visible:ring-1 focus-visible:ring-white sm:h-12"
                />
                <Button className="agrivo-button-soft h-11 w-full rounded-full bg-[#43A047] text-white hover:bg-[#4CAF50] sm:h-12 sm:w-auto lg:w-full">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-5 text-center text-xs text-[#bbf7d0] sm:mt-12 sm:pt-6 sm:text-left sm:text-sm">
            <p>© 2026 Agrivo. Built for cleaner farm-to-market trade.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
