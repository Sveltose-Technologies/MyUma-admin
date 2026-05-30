//src/hook/useUtils.js
export const BASE_URL = "https://node.myuma.net";
// export const BASE_URL = "https://nrislaw.rxchartsquare.com";

export const useUtils = () => {
  const DEFAULT_IMAGE = "https://placehold.co/200x200?text=No+Image";

 const getImgURL = (path) => {
   if (!path || typeof path !== "string") return DEFAULT_IMAGE;

   // 1. Removes the trailing space found in your database
   const cleanPath = path.trim();

   // 2. Handle absolute URLs
   if (cleanPath.startsWith("http")) return cleanPath;

   // 3. Ensure correct slash formatting
   const finalPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;

   // Result: https://node.myuma.net/uploads/123.jpg
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
