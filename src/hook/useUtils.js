export const BASE_URL = "https://nrislaw.rxchartsquare.com";

export const useUtils = () => {
  const DEFAULT_IMAGE = "https://placehold.co/200x200?text=No+Image";

  const getImgURL = (path) => {
    try {
      // ❌ null / undefined / empty
      if (!path || typeof path !== "string") {
        return DEFAULT_IMAGE;
      }

      // ✔️ Already full URL (http / https)
      if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
      }

      // ✔️ Base64 image
      if (path.startsWith("data:image")) {
        return path;
      }

      // ✔️ Remove extra spaces
      const cleanPath = path.trim();

      // ✔️ Add slash if missing
      const finalPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;

      return `${BASE_URL}${finalPath}`;
    } catch (error) {
      console.error("Image URL error:", error);
      return DEFAULT_IMAGE;
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  return { getImgURL, formatDate, BASE_URL };
};
