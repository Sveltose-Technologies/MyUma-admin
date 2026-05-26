//src/hook/useUtils.js
export const BASE_URL = "https://node.myuma.net";
// export const BASE_URL = "https://nrislaw.rxchartsquare.com";

export const useUtils = () => {
  const DEFAULT_IMAGE = "https://placehold.co/200x200?text=No+Image";

 const getImgURL = (path) => {
   if (!path || typeof path !== "string") return DEFAULT_IMAGE;

   // .trim() removes the trailing space from your API response
   const cleanPath = path.trim();

   if (cleanPath.startsWith("http")) return cleanPath;

   const finalPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
   return `${BASE_URL}${finalPath}`;
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
