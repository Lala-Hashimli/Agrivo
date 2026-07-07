import { Briefcase, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DashboardBackLink } from "../components/dashboard/DashboardBackLink";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import {
  FARMER_DASHBOARD_HOME_HASH,
  FARMER_DASHBOARD_JOBS_NEW_HASH,
  FARMER_DASHBOARD,
} from "../components/dashboard/dashboardConfig";
import { ProtectedDashboard } from "../components/dashboard/ProtectedDashboard";
import { FarmJobCard } from "../components/jobs/FarmJobCard";
import { getAuthUser, isFarmerUser } from "../auth/authStorage";
import {
  deleteFarmerJob,
  getFarmerJobs,
  updateJobStatus,
} from "../data/farmJobsStorage";
import { Button } from "../components/ui/button";

export default function FarmerJobsDashboardPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const user = getAuthUser();
  const farmer = isFarmerUser();

  useEffect(() => {
    if (!farmer) {
      window.location.hash = "login";
    }
  }, [farmer]);

  const jobs = useMemo(() => {
    void refreshKey;
    return getFarmerJobs();
  }, [refreshKey]);

  const handleClose = (jobId: string) => {
    if (window.confirm("Close this job post? It will no longer appear in public listings.")) {
      updateJobStatus(jobId, "closed");
      setRefreshKey((k) => k + 1);
    }
  };

  const handleDelete = (jobId: string) => {
    if (window.confirm("Delete this job post permanently?")) {
      deleteFarmerJob(jobId);
      setRefreshKey((k) => k + 1);
    }
  };

  if (!farmer) {
    return null;
  }

  return (
    <ProtectedDashboard allowedRoles={["farmer"]}>
      <DashboardLayout
        config={FARMER_DASHBOARD}
        pageTitle="My Job Posts"
        pageSubtitle="Manage your seasonal job offers and find workers for harvest, picking, and farm tasks."
        activeNavId="farm-jobs"
        hideIntro
      >
        <DashboardBackLink label="Back to Dashboard" hash={FARMER_DASHBOARD_HOME_HASH} />

        <div className="agrivo-dashboard-panel">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="agrivo-heading text-2xl font-bold text-[#102018] sm:text-3xl">My Job Posts</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#5F6F64] sm:text-base">
                Manage your seasonal job offers and find workers for harvest, picking, and farm tasks.
              </p>
              {user ? (
                <p className="mt-2 text-xs text-[#6b7a70]">Signed in as {user.name}</p>
              ) : null}
            </div>
            <Button
              className="agrivo-button-soft rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
              onClick={() => {
                window.location.hash = FARMER_DASHBOARD_JOBS_NEW_HASH;
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Job Post
            </Button>
          </div>

          {jobs.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {jobs.map((job) => (
                <FarmJobCard
                  key={job.id}
                  job={job}
                  variant="dashboard"
                  onEdit={
                    !job.isMock
                      ? () => {
                          window.location.hash = `dashboard/jobs/edit/${job.id}`;
                        }
                      : undefined
                  }
                  onClose={() => handleClose(job.id)}
                  onDelete={() => !job.isMock && handleDelete(job.id)}
                />
              ))}
            </div>
          ) : (
            <div className="agrivo-dashboard-empty mt-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ecfdf5]">
                <Briefcase className="h-6 w-6 text-[#14532D]" />
              </div>
              <h3 className="agrivo-heading text-xl font-bold text-[#102018]">You have not posted any jobs yet.</h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#5F6F64]">
                Create your first job post to find seasonal workers.
              </p>
              <Button
                className="mt-6 rounded-full bg-[#14532D] text-white hover:bg-[#1D6A3B]"
                onClick={() => {
                  window.location.hash = FARMER_DASHBOARD_JOBS_NEW_HASH;
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Job Post
              </Button>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedDashboard>
  );
}
