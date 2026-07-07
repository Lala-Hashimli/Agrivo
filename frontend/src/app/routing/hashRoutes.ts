export type ResolvedHashRoute = {
  page: string;
  farmerSlug: string | null;
  jobSlug: string | null;
  editJobId: string | null;
  productSlug: string | null;
};

export function resolveHashRoute(hash: string): ResolvedHashRoute {
  if (hash.startsWith("farmers/")) {
    return { page: "farmer-profile", farmerSlug: hash.split("/")[1] ?? "", jobSlug: null, editJobId: null, productSlug: null };
  }

  if (hash.startsWith("products/")) {
    const productSlug = decodeURIComponent(hash.slice("products/".length).split("/")[0] ?? "");
    return { page: "product-detail", farmerSlug: null, jobSlug: null, editJobId: null, productSlug };
  }

  if (hash.startsWith("dashboard/buyer")) {
    return { page: "dashboard-buyer", farmerSlug: null, jobSlug: null, editJobId: null, productSlug: null };
  }

  if (hash.startsWith("dashboard/farmer")) {
    return { page: "dashboard-farmer", farmerSlug: null, jobSlug: null, editJobId: null, productSlug: null };
  }

  if (hash.startsWith("dashboard/logistics")) {
    return { page: "dashboard-logistics", farmerSlug: null, jobSlug: null, editJobId: null, productSlug: null };
  }

  if (hash.startsWith("dashboard/admin")) {
    return { page: "dashboard-admin", farmerSlug: null, jobSlug: null, editJobId: null, productSlug: null };
  }

  if (hash === "jobs/create" || hash === "dashboard/jobs/new") {
    return { page: "jobs-create", farmerSlug: null, jobSlug: null, editJobId: null, productSlug: null };
  }

  if (hash.startsWith("dashboard/jobs/edit/")) {
    const editJobId = hash.split("/")[3] ?? "";
    return { page: "jobs-create", farmerSlug: null, jobSlug: null, editJobId, productSlug: null };
  }

  if (hash === "dashboard/jobs") {
    return { page: "dashboard-jobs", farmerSlug: null, jobSlug: null, editJobId: null, productSlug: null };
  }

  if (hash.startsWith("jobs/")) {
    const slug = hash.split("/")[1] ?? "";
    if (slug && slug !== "create") {
      return { page: "job-detail", farmerSlug: null, jobSlug: slug, editJobId: null, productSlug: null };
    }
  }

  if (hash === "jobs") {
    return { page: "jobs", farmerSlug: null, jobSlug: null, editJobId: null, productSlug: null };
  }

  return { page: hash, farmerSlug: null, jobSlug: null, editJobId: null, productSlug: null };
}

export function getRouteKey(route: ResolvedHashRoute): string {
  if (route.page === "farmer-profile" && route.farmerSlug) {
    return `farmer-profile:${route.farmerSlug}`;
  }

  if (route.page === "job-detail" && route.jobSlug) {
    return `job-detail:${route.jobSlug}`;
  }

  if (route.page === "product-detail" && route.productSlug) {
    return `product-detail:${route.productSlug}`;
  }

  if (route.page === "jobs-create") {
    return route.editJobId ? `jobs-create:edit:${route.editJobId}` : "jobs-create:new";
  }

  return route.page;
}
