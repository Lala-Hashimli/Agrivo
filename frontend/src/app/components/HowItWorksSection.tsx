import { BadgeCheck, ImageIcon, Sprout, Store, Truck, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import howItWorksStep1 from "../../assets/how-it-works-step-1.png";
import howItWorksStep2 from "../../assets/how-it-works-step-2.png";
import howItWorksStep3 from "../../assets/how-it-works-step-3.png";
import howItWorksStep4 from "../../assets/how-it-works-step-4.png";

const viewport = { once: true, amount: 0.2 } as const;

const reveal = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 },
};

export type HowItWorksStep = {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Swap image imports in `howItWorksSteps` below, or pass `undefined` for placeholder UI */
  image?: string;
  imageAlt: string;
};

export const howItWorksSteps: HowItWorksStep[] = [
  {
    step: 1,
    title: "Farmer lists produce",
    description: "Verified farmers publish available fresh products ready for sale.",
    icon: Sprout,
    image: howItWorksStep1,
    imageAlt: "Farmer preparing fresh produce for listing on Agrivo",
  },
  {
    step: 2,
    title: "Buyer places order",
    description:
      "Supermarkets, produce shops, market vendors, and roadside sellers place orders quickly and directly.",
    icon: Store,
    image: howItWorksStep2,
    imageAlt: "Business buyer placing a produce order through Agrivo",
  },
  {
    step: 3,
    title: "Batch is tracked",
    description: "Each order batch stays visible and traceable from listing to handoff.",
    icon: BadgeCheck,
    image: howItWorksStep3,
    imageAlt: "Order batch tracking on a smartphone in the field",
  },
  {
    step: 4,
    title: "Delivery is completed",
    description: "Logistics partners deliver the produce and complete the order flow efficiently.",
    icon: Truck,
    image: howItWorksStep4,
    imageAlt: "Logistics partner completing a fresh produce delivery",
  },
];

function StepCard({ step, index }: { step: HowItWorksStep; index: number }) {
  const Icon = step.icon;

  return (
    <motion.article
      className="agrivo-step-card"
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={reveal}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="agrivo-step-card-body">
        <div className="agrivo-step-card-head">
          <div className="agrivo-step-icon">
            <Icon className="h-5 w-5 text-[#14532D]" strokeWidth={2} />
          </div>
          <p className="agrivo-step-label">Step {String(step.step).padStart(2, "0")}</p>
        </div>

        <h3 className="agrivo-step-title">{step.title}</h3>
        <p className="agrivo-step-description">{step.description}</p>
      </div>

      <div className="agrivo-step-image">
        {step.image ? (
          <img src={step.image} alt={step.imageAlt} loading="lazy" decoding="async" />
        ) : (
          <div className="agrivo-step-image-placeholder" aria-hidden>
            <ImageIcon className="h-6 w-6 text-[#7a9a82]" strokeWidth={1.75} />
            <span>Image placeholder</span>
          </div>
        )}
      </div>
    </motion.article>
  );
}

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="agrivo-section agrivo-scroll-anchor agrivo-how-it-works">
      <div className="agrivo-how-it-works-bg" aria-hidden />
      <div className="agrivo-container relative">
        <motion.div
          className="agrivo-how-it-works-intro"
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          variants={reveal}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="agrivo-how-it-works-eyebrow">How it works</p>
          <h2 className="agrivo-heading agrivo-how-it-works-title">
            From farm to market in 4 simple steps
          </h2>
          <p className="agrivo-how-it-works-description">
            Agrivo connects farmers, business buyers, and logistics partners in one transparent
            platform.
          </p>
        </motion.div>

        <div className="agrivo-steps-track">
          <div className="agrivo-steps-connector" aria-hidden />
          <div className="agrivo-steps-grid">
            {howItWorksSteps.map((step, index) => (
              <StepCard key={step.step} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
