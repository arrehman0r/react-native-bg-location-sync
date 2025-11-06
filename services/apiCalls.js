import { IMAGE_BASE_URL } from "../env";
import { makeRequest } from "./instance";

export const LoginUser = (body) => {
  return makeRequest("POST", "user/mobileLogin", body);
};


export const fetchBase64Image = async (id) => {
  try {
    const response = await fetch(`${IMAGE_BASE_URL}/getDocument/${id}`);
    const base64 = await response.text(); // assuming server returns base64 string
    return base64;
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
};
