import { forbidden } from "../utils/ApiError.js";

export function roleMiddleware(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      next(forbidden("Authentication required."));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(forbidden("You do not have permission to access this resource."));
      return;
    }

    next();
  };
}
