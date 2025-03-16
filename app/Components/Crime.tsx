"use client";
import { useEffect, useRef, useState } from "react";
import "ol/ol.css"; // OpenLayers CSS
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import { Point } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style, Icon, Fill, Stroke, Circle as CircleStyle } from "ol/style";
import Overlay from "ol/Overlay";
import { IncidentType, MediaType, SeverityLevel, VerificationStatus } from "@prisma/client";
import Loader from "./Loader";

// **Crime Data**
const cities = [
  { name: "Detroit, MI", lat: 42.3314, lon: -83.0458, rank: 1, crimes: 5000 },
  { name: "Memphis, TN", lat: 35.1495, lon: -90.0490, rank: 2, crimes: 4800 },
  { name: "Birmingham, AL", lat: 33.5186, lon: -86.8104, rank: 3, crimes: 4600 },
  { name: "St. Louis, MO", lat: 38.6270, lon: -90.1994, rank: 4, crimes: 4500 },
  { name: "Little Rock, AR", lat: 34.7465, lon: -92.2896, rank: 5, crimes: 4400 },
  { name: "Tijuana, Mexico", lat: 32.5149, lon: -117.0382, rank: 6, crimes: 4000 },
  { name: "Acapulco, Mexico", lat: 16.8531, lon: -99.8237, rank: 7, crimes: 3900 },
  { name: "Ciudad Juárez, Mexico", lat: 31.6904, lon: -106.4245, rank: 8, crimes: 3300 },
  { name: "Zacatecas, Mexico", lat: 22.7709, lon: -102.5833, rank: 9, crimes: 3000 },
  { name: "Cancún, Mexico", lat: 21.1619, lon: -86.8515, rank: 10, crimes: 2900 },
];

interface Report {
  id: string;
  createdAt: Date;
  userId: string;
  location: string;
  latitude: number;
  longitude: number;
  type: IncidentType;
  severity: SeverityLevel;
  description: string;
  mediaUrl: string | null;
  mediaType: MediaType;
  verificationStatus: VerificationStatus;
  verifierId: string | null;
  updatedAt: Date;
}
// **CrimeMap Component**
export default function CrimeMap({incidents}: {incidents: Report[]}) {
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const [userFeature, setUserFeature] = useState<Feature | null>(null);
  const [town, setTown] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [userLatitude, setUserLatitude] = useState<number | null>(null);
  const [userLongitude, setUserLongitude] = useState<number | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [isLocationEnabled, setIsLocationEnabled] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("locationEnabled") === "true";
    }
    return false; // Default value for SSR
  });
  
  console.log(incidents)
  useEffect(() => {
    const storedValue = localStorage.getItem("locationEnabled") === "true";
    setIsLocationEnabled(storedValue);
  }, []);

  console.log("Your Location:", town, country, userLatitude, userLongitude);
  useEffect(() => {
    if (!mapRef.current) return;

    // **Initialize Map**
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([36.8219, -1.2921]), // Center over Nairobi, Kenya
        zoom: 4,
        projection: 'EPSG:3857'
      }),
    });

    // **Convert Incidents to Map Features**
    const incidentFeatures = incidents.map((incident) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([incident.longitude, incident.latitude])),
        id: incident.id,
        type: incident.type,
        severity: incident.severity,
        description: incident.description,
      });

       // **Set Marker Style Based on Severity**
       const colorMap: Record<SeverityLevel, string> = {
        LOW: "green",
        MEDIUM: "yellow",
        HIGH: "red",
        CRITICAL: "purple",
      };

      feature.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({ color: colorMap[incident.severity] || "blue" }),
            stroke: new Stroke({ color: "white", width: 2 }),
          }),
        })
      );

      return feature;
    });

    // **Create a Layer for Incidents**
    const incidentLayer = new VectorLayer({
      source: new VectorSource({
        features: incidentFeatures,
      }),
    });

    map.addLayer(incidentLayer);

    // **Create Overlay for Popups**
    const overlay = new Overlay({
      element: popupRef.current!,
      positioning: "bottom-center",
      offset: [0, -10],
    });

    map.on("click", (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (feat) => feat);
      if (feature) {
        const coordinates = (feature.getGeometry() as Point)?.getCoordinates();
        overlay.setPosition(coordinates);

        const type = feature.get("type");
        const severity = feature.get("severity");
        const description = feature.get("description");

        if (popupRef.current) {
          popupRef.current.innerHTML = `
            <strong>Type:</strong> ${type}<br>
            <strong>Severity:</strong> ${severity}<br>
            <strong>Description:</strong> ${description}
          `;
          popupRef.current.style.display = "block";
        }
      } else {
        overlay.setPosition(undefined);
        if (popupRef.current) popupRef.current.style.display = "none";
      }
    });

    // **Get User's Current Location**
    if (isLocationEnabled) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const userCoords = fromLonLat([longitude, latitude]);

          const userFeature = new Feature({
            geometry: new Point(userCoords),
            name: "Your Location",
          });

          
          userFeature.setStyle(
            new Style({
              image: new Icon({
                src: '/images/marker.png',
                scale: 0.07,
                anchor: [0.5, 1],
                crossOrigin: 'anonymous',
              }),
            })
          );

          setUserFeature(userFeature);

          // **Add User Marker to Map**
          const userLayer = new VectorLayer({
            source: new VectorSource({
              features: [userFeature],
            }),
          });

          map.addLayer(userLayer);

          // **Fetch Nearest Town Name**
          const results = await fetchNearestTown(latitude, longitude);
          setUserLatitude(latitude);
          setUserLongitude(longitude);
          if (results) {
            const town = results.town;
            const country = results.country;
            const state = results.state;
            setCountry(country);
            setTown(town);
            setState(state);
            console.log("Your Location:", town, country);
          }

          // **Reposition Map to User's Location**
          map.getView().setCenter(userCoords);
          map.getView().setZoom(12);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true }
      );
    } else {return;}

    return () => {
      map.setTarget(undefined);
    };
  }, [incidents, town, country, state, userLatitude, userLongitude]);

  // **Fetch Town Name**
  async function fetchNearestTown(lat: number, lon: number) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();

      const town = data.address.town || data.address.city || "Unknown";
      const county = data.address.county || "Unknown";
      const state = data.address.state || "Unknown";
      const country = data.address.country || "Unknown";

      if (overlayRef.current && userFeature) {
        const coordinates = (userFeature.getGeometry() as Point)?.getCoordinates();
        overlayRef.current.setPosition(coordinates);
    }
    return {town, state, country};
    
    } catch (error) {
      console.error("Error fetching location details:", error);
    }
  }

  // if(loading) return <Loader/>;
  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
      <div
        ref={popupRef}
        style={{
          position: "absolute",
          backgroundColor: "white",
          padding: "5px",
          borderRadius: "5px",
          display: "none",
          boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
          zIndex: 100,
        }}
        className="text-black text-opacity-55 w-36"
      ></div>
    </div>
  );
}
