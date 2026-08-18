/* AmbuAfrica Google Maps adapter */
window.AmbuMaps = (() => {
  let map = null;
  let userMarker = null;
  const ambulanceMarkers = new Map();

  function load() {
    return new Promise((resolve, reject) => {
      if (window.google?.maps) return resolve();
      const key = window.AMBU_CONFIG?.googleMapsApiKey;
      if (!key || key.startsWith("YOUR_")) {
        reject(new Error("Google Maps API key is not configured yet."));
        return;
      }
      window.__ambuMapsReady = resolve;
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&loading=async&callback=__ambuMapsReady`;
      s.onerror = () => reject(new Error("Google Maps failed to load."));
      document.head.appendChild(s);
    });
  }

  async function create(element, center = {lat: 6.5244, lng: 3.3792}) {
    await load();
    map = new google.maps.Map(element, {
      center,
      zoom: 14,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });
    return map;
  }

  function setUserLocation(position) {
    if (!map) return;
    if (!userMarker) {
      userMarker = new google.maps.Marker({
        map,
        title: "Your location",
        icon: { url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png" }
      });
    }
    userMarker.setPosition(position);
    map.panTo(position);
  }

  function setAmbulance(id, position, title = "Available ambulance") {
    if (!map) return;
    let marker = ambulanceMarkers.get(id);
    if (!marker) {
      marker = new google.maps.Marker({
        map,
        title,
        icon: { url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png" }
      });
      ambulanceMarkers.set(id, marker);
    }
    marker.setPosition(position);
  }

  function removeAmbulance(id) {
    const marker = ambulanceMarkers.get(id);
    if (marker) marker.setMap(null);
    ambulanceMarkers.delete(id);
  }

  return { load, create, setUserLocation, setAmbulance, removeAmbulance };
})();
