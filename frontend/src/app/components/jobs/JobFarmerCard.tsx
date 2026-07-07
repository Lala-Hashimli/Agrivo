import { ArrowRight, BadgeCheck, MapPin, Sprout, Star } from "lucide-react";
import type { FarmJob } from "../../data/farmJobs";
import type { FarmerProfile } from "../../data/farmers";
import { navigateToFarmerProfile } from "../../utils/jobFarmer";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface JobFarmerCardProps {
  job: FarmJob;
  farmer: FarmerProfile | null;
  otherJobsCount?: number;
  compact?: boolean;
}

function getSpecializationLabel(farmer: FarmerProfile | null, job: FarmJob): string {
  if (farmer?.specialties.length) {
    return farmer.specialties.join(", ");
  }
  return job.cropType;
}

function getLocationLine(farmer: FarmerProfile | null, job: FarmJob): string {
  if (farmer) {
    const parts = [farmer.economicRegion, farmer.districtCity, farmer.village].filter(Boolean);
    return parts.join(" · ");
  }
  return [job.economicRegion, job.district, job.village].filter(Boolean).join(" · ");
}

function getBioLine(farmer: FarmerProfile | null): string {
  if (!farmer) return "Verified farmer on Agrivo with traceable farm listings and seasonal work offers.";
  const sentence = farmer.about.split(".")[0];
  return sentence ? `${sentence}.` : farmer.about;
}

export function JobFarmerCard({ job, farmer, otherJobsCount = 0, compact = false }: JobFarmerCardProps) {
  const farmerSlug = farmer?.slug ?? job.farmerSlug;
  const image = farmer?.image ?? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80";
  const experience = farmer?.experience ?? "Experienced grower";
  const rating = farmer?.rating;

  const handleViewProfile = () => {
    if (farmerSlug) navigateToFarmerProfile(farmerSlug);
  };

  return (
    <Card className="agrivo-job-farmer-card overflow-hidden rounded-[28px] border border-[#e5efe1] bg-white shadow-[0_10px_28px_rgba(20,83,45,0.05)]">
      <CardContent className={compact ? "p-5" : "p-6 sm:p-7"}>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#15803d]">Posted by</p>

        <button
          type="button"
          onClick={farmerSlug ? handleViewProfile : undefined}
          className={`mt-4 flex w-full items-start gap-4 rounded-[22px] border border-[#edf2ea] bg-[#f8faf4] p-4 text-left transition ${
            farmerSlug ? "hover:border-[#bbf7d0] hover:bg-[#f0fdf4]" : ""
          }`}
        >
          <ImageWithFallback
            src={image}
            alt={job.farmerName}
            className="h-16 w-16 shrink-0 rounded-2xl object-cover shadow-sm sm:h-20 sm:w-20"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="agrivo-heading text-lg font-bold text-[#102018] hover:text-[#14532D] sm:text-xl">
                {job.farmerName}
              </h3>
              {job.farmerVerified ? (
                <Badge className="rounded-full bg-[#ecfdf5] text-[#166534] hover:bg-[#ecfdf5]">
                  <BadgeCheck className="mr-1 h-3.5 w-3.5" />
                  Verified
                </Badge>
              ) : null}
            </div>
            <p className="mt-1 flex items-start gap-1.5 text-sm text-[#5F6F64]">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#43A047]" />
              {getLocationLine(farmer, job)}
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-[#14532D]">
              <Sprout className="h-3.5 w-3.5 text-[#43A047]" />
              {getSpecializationLabel(farmer, job)}
            </p>
          </div>
        </button>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-[18px] border border-[#edf2ea] bg-[#f8faf4] px-3 py-2.5">
            <p className="text-xs text-[#6b7a70]">Experience</p>
            <p className="mt-0.5 text-sm font-semibold text-[#102018]">{experience}</p>
          </div>
          {rating ? (
            <div className="rounded-[18px] border border-[#edf2ea] bg-[#f8faf4] px-3 py-2.5">
              <p className="text-xs text-[#6b7a70]">Rating</p>
              <p className="mt-0.5 flex items-center gap-1 text-sm font-semibold text-[#102018]">
                <Star className="h-3.5 w-3.5 fill-[#facc15] text-[#facc15]" />
                {rating}
              </p>
            </div>
          ) : (
            <div className="rounded-[18px] border border-[#edf2ea] bg-[#f8faf4] px-3 py-2.5">
              <p className="text-xs text-[#6b7a70]">Listing</p>
              <p className="mt-0.5 text-sm font-semibold text-[#102018]">Agrivo verified</p>
            </div>
          )}
        </div>

        <p className="mt-4 text-sm leading-6 text-[#5F6F64]">{getBioLine(farmer)}</p>

        {farmerSlug ? (
          <div className="mt-5 flex flex-col gap-2">
            <Button
              className="agrivo-button-soft w-full rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
              onClick={handleViewProfile}
            >
              View Farmer Profile
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            {otherJobsCount > 0 ? (
              <Button
                variant="outline"
                className="w-full rounded-full border-[#dbe7d4] text-[#14532D] hover:bg-[#EAF7EC]"
                onClick={handleViewProfile}
              >
                See {otherJobsCount} other job{otherJobsCount !== 1 ? "s" : ""} from this farmer
              </Button>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
