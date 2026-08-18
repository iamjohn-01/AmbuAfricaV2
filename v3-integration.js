/* =========================================================
   AMBUAFRICA V3 REAL INTEGRATION LAYER
   This layer intentionally does not fake GPS or payment data.
   It provides real device location and provider adapters while
   the Supabase backend is being connected.
========================================================= */

window.AmbuV3 = {
  patientLocation: null,
  map: null,
  watchStarted: false,

  async requestLocation() {
    try {
      const pos = await AmbuLocation.getCurrentPosition();
      this.patientLocation = pos;
      window.dispatchEvent(new CustomEvent("ambu:location", {detail: pos}));
      return pos;
    } catch (e) {
      toast?.(e.message, "error");
      throw e;
    }
  },

  startLiveLocation(onUpdate) {
    if (this.watchStarted) return;
    this.watchStarted = true;
    AmbuLocation.watch(pos => {
      this.patientLocation = pos;
      onUpdate?.(pos);
      window.dispatchEvent(new CustomEvent("ambu:location", {detail: pos}));
    }, err => toast?.(err.message, "error"));
  },

  stopLiveLocation() {
    AmbuLocation.stop();
    this.watchStarted = false;
  },

  async openMap(elementId, center) {
    const el = document.getElementById(elementId);
    if (!el) throw new Error("Map container not found.");
    this.map = await AmbuMaps.create(el, center);
    return this.map;
  },

  async showPatientOnMap(elementId) {
    const pos = await this.requestLocation();
    if (!this.map) await this.openMap(elementId, pos);
    AmbuMaps.setUserLocation({lat: pos.lat, lng: pos.lng});
    this.startLiveLocation(p => AmbuMaps.setUserLocation({lat:p.lat,lng:p.lng}));
    return pos;
  }
};

/* Add a real-location action to the existing patient request page when it exists. */
document.addEventListener("click", async (event) => {
  const btn = event.target.closest("[data-ambu-location]");
  if (!btn) return;
  const target = btn.getAttribute("data-ambu-location");
  try {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Locating…';
    await AmbuV3.showPatientOnMap(target);
    btn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> Location enabled';
  } catch {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> Enable location';
  }
});
