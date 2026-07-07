import { ArrowLeft } from "lucide-react";

interface DashboardBackLinkProps {
  label: string;
  hash: string;
}

export function DashboardBackLink({ label, hash }: DashboardBackLinkProps) {
  return (
    <button
      type="button"
      onClick={() => {
        window.location.hash = hash;
      }}
      className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#5F6F64] transition hover:text-[#14532D]"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}
