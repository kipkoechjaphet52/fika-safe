'use server';
import { PrismaClient } from "@prisma/client";


import Overlay from 'ol/Overlay'; // Import Overlay from OpenLayers

const overlayRef: { current: Overlay | null } = { current: null }; // Define overlayRef with proper type
import { Feature } from 'ol'; // Import Feature from OpenLayers
import { Point } from 'ol/geom'; // Import Point from OpenLayers

const userFeature: Feature<Point> | null = null; // Define userFeature with proper type

export async function fetchNearestTown(lat: number, lon: number) {
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