/* AmbuAfrica real browser geolocation module */
window.AmbuLocation = (() => {
  let watchId = null;

  function ensureSupported() {
    if (!("geolocation" in navigator)) {
      throw new Error("This device/browser does not support GPS location.");
    }
  }

  async function getCurrentPosition(options = {}) {
    ensureSupported();
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        p => resolve({
          lat: p.coords.latitude,
          lng: p.coords.longitude,
          accuracy: p.coords.accuracy,
          timestamp: p.timestamp
        }),
        err => reject(new Error(locationError(err))),
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 15000,
          ...options
        }
      );
    });
  }

  function watch(onPosition, onError) {
    ensureSupported();
    stop();
    watchId = navigator.geolocation.watchPosition(
      p => onPosition({
        lat: p.coords.latitude,
        lng: p.coords.longitude,
        accuracy: p.coords.accuracy,
        timestamp: p.timestamp
      }),
      e => onError?.(new Error(locationError(e))),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
    );
    return watchId;
  }

  function stop() {
    if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }

  function locationError(err) {
    return ({
      1: "Location permission was denied. Please allow location access.",
      2: "Your location could not be determined.",
      3: "Location request timed out."
    })[err?.code] || "Unable to get your location.";
  }

  return { getCurrentPosition, watch, stop };
})();
