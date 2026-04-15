// Function ke bahar export karein taaki api.js ise use kar sake
export const BASE_URL = "https://nrislaw.rxchartsquare.com";

export const useUtils = () => {
  const getImgURL = (path) => {
    if (!path) return "https://placehold.co/200x200?text=No+Image";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${BASE_URL}${cleanPath}`;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return { getImgURL, formatDate, getAdminID, BASE_URL };
};
