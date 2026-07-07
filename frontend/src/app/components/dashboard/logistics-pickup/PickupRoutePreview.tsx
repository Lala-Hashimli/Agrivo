import { Navigation, Route } from "lucide-react";

export function PickupRoutePreview() {
  return (
    <section className="agrivo-pickup-side-card agrivo-dashboard-panel">
      <h3 className="agrivo-heading text-base font-bold text-[#102018]">Next Route</h3>
      <p className="mt-1 text-xs text-[#6b7a70]">Pickup cluster preview</p>

      <div className="agrivo-pickup-route-preview">
        <div className="agrivo-pickup-route-preview__line" />
        <div className="agrivo-pickup-route-preview__stops">
          <div className="agrivo-pickup-route-preview__stop">
            <span className="agrivo-pickup-route-preview__dot agrivo-pickup-route-preview__dot--active" />
            <div>
              <p className="text-xs font-semibold text-[#14532D]">Next stop</p>
              <p className="text-sm font-bold text-[#102018]">Lankaran Greenhouse</p>
              <p className="text-xs text-[#5F6F64]">09:30 · Tomatoes</p>
            </div>
          </div>
          <div className="agrivo-pickup-route-preview__stop">
            <span className="agrivo-pickup-route-preview__dot" />
            <div>
              <p className="text-sm font-semibold text-[#102018]">Masalli Pickup Point</p>
              <p className="text-xs text-[#5F6F64]">11:00 · Apples</p>
            </div>
          </div>
          <div className="agrivo-pickup-route-preview__stop">
            <span className="agrivo-pickup-route-preview__dot" />
            <div>
              <p className="text-sm font-semibold text-[#102018]">Baku Market</p>
              <p className="text-xs text-[#5F6F64]">Hub drop-off</p>
            </div>
          </div>
        </div>
        <div className="agrivo-pickup-route-preview__footer">
          <Route className="h-4 w-4 text-[#43A047]" />
          <span>Lankaran → Masalli → Baku</span>
          <Navigation className="h-3.5 w-3.5 text-[#6b7a70]" />
        </div>
      </div>
    </section>
  );
}
