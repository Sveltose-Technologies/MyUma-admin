import { useState, useCallback } from "react";
import { toast } from "react-toastify";

/**
 * useCrud Hook
 * @param {Object} apiMethods - Object containing getAll, add, update, delete functions
 */
export const useCrud = (apiMethods) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. GET ALL DATA (Fetch)
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiMethods.getAll();

      // Console log for debugging
      console.log("Full API Response in Hook:", res);

      /**
       * DATA EXTRACTION LOGIC
       * Backend se aane wale alag-alag keys ko handle karta hai.
       * Aapka latest response 'res.categories' mein aa raha hai.
       */
      const result =
        res?.categories || // For General Categories (Aapka latest response yahi hai)
        res?.blogCategories || // For Blog Categories
        res?.blogs || // For Blogs
        res?.homeBanner || // For Banners
        res?.logos || // For Logos
        res?.data || // Fallback to .data
        (Array.isArray(res) ? res : []); // If response itself is an array

      setData(result);
    } catch (err) {
      console.error("Error in fetchAll:", err);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [apiMethods]); // Dependency: Only changes if apiMethods object changes

  // 2. ADD / CREATE
  const addItem = async (payload) => {
    setLoading(true);
    try {
      console.log(">>> Adding Item with Payload:", payload);
      await apiMethods.add(payload);
      toast.success("Created Successfully!");
      await fetchAll(); // List ko refresh karein
      return true;
    } catch (err) {
      console.error("Add Item Error:", err);
      toast.error(err.response?.data?.message || "Creation Failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 3. UPDATE
  const updateItem = async (id, payload) => {
    setLoading(true);
    try {
      console.log(`>>> Updating Item ID: ${id} with Payload:`, payload);
      await apiMethods.update(id, payload);
      toast.success("Updated Successfully!");
      await fetchAll(); // List ko refresh karein
      return true;
    } catch (err) {
      console.error("Update Item Error:", err);
      toast.error(err.response?.data?.message || "Update Failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 4. DELETE
  const deleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    setLoading(true);
    try {
      console.log(`>>> Deleting Item ID: ${id}`);
      await apiMethods.delete(id);
      toast.success("Deleted Successfully!");
      await fetchAll(); // List ko refresh karein
      return true;
    } catch (err) {
      console.error("Delete Item Error:", err);
      toast.error(err.response?.data?.message || "Delete Failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, fetchAll, addItem, updateItem, deleteItem };
};
