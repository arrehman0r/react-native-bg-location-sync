import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
// import * as Location from "expo-location";
import { Alert } from "react-native";


dayjs.extend(duration);
dayjs.extend(relativeTime);

export const getTimeDiffDisplay = (createdAt) => {
  const now = dayjs();
  const created = dayjs(createdAt);
  const diffMs = now.diff(created);
  const diffHours = dayjs.duration(diffMs).asHours();

  if (diffHours <= 24) {
    const hours = Math.floor(diffHours);
    const minutes = Math.floor((diffHours - hours) * 60);
    return { text: `${hours}h ${minutes}m ago`, overdue: false };
  } else {
    const overtime = diffHours - 24;
    const hours = Math.floor(overtime);
    const minutes = Math.floor((overtime - hours) * 60);
    return { text: `- ${hours}h ${minutes}m`, overdue: true };
  }
};




export const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const options = { month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options); // Output: June 2025
};

export const formatDateTime = (isoDate) => {
  const date = new Date(isoDate);
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
  return date.toLocaleDateString('en-GB', options); // Output: 15 June 2025, 14:30
}

export const calculateDistance = (loc1, loc2) => {
    // NOTE: For production, use a more robust library like 'geolib' 
    // or 'haversine-distance' but this simple calculation demonstrates the logic.
    const lat1 = loc1.latitude;
    const lon1 = loc1.longitude;
    const lat2 = loc2.latitude;
    const lon2 = loc2.longitude;
    
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
};

export const phoneRegex = /^\d{11}$/;