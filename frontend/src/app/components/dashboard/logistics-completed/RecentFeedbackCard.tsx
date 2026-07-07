import { Star } from "lucide-react";
import type { CompletedFeedback } from "../../../utils/completedDeliveriesStorage";

export function RecentFeedbackCard({ feedback }: { feedback: CompletedFeedback[] }) {
  return (
    <section className="agrivo-completed-side-card agrivo-dashboard-panel">
      <h3 className="agrivo-heading text-base font-bold text-[#102018]">Recent Feedback</h3>
      <p className="mt-1 text-xs text-[#6b7a70]">Latest buyer reviews</p>
      <ul className="agrivo-completed-feedback-list">
        {feedback.map((item) => (
          <li key={item.id} className="agrivo-completed-feedback-item">
            <p className="text-sm font-semibold text-[#102018]">{item.buyerName}</p>
            <p className="mt-1 text-xs leading-5 text-[#5F6F64]">&ldquo;{item.quote}&rdquo;</p>
            <p className="mt-2 flex items-center gap-1 text-xs font-bold text-[#14532D]">
              <Star className="h-3 w-3 fill-[#facc15] text-[#facc15]" />
              Rating: {item.rating.toFixed(1)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
