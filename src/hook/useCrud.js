import { useState, useCallback } from "react";
import { toast } from "react-toastify";

/**
 * useCrud Hook
 * Updated to handle both Arrays and Single Objects (like Logos)
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

      // Extract raw data from known keys
      const rawData =
        res?.categories ||
        res?.homeBanner || // Backend key from your screenshot
        res?.logo || // Singular key (Screenshot fix)
        res?.logos || // Plural key
        res?.blogCategories ||
        res?.blogs ||
        res?.data;

      /**
       * TRANSFORMATION LOGIC:
       * 1. If rawData is already an array, use it.
       * 2. If rawData is a single object (like your logo), wrap it in an array [rawData].
       * 3. If response itself is an array, use res.
       * 4. Otherwise, default to empty array [].
       */
      let result = [];
      if (Array.isArray(rawData)) {
        result = rawData;
      } else if (rawData && typeof rawData === "object") {
        result = [rawData]; // Convert single object to array for .map()
      } else if (Array.isArray(res)) {
        result = res;
      }

      setData(result);
    } catch (err) {
      console.error("Error in fetchAll:", err);
      // toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [apiMethods]);

  // 2. ADD / CREATE
  const addItem = async (payload) => {
    setLoading(true);
    try {
      console.log(">>> Adding Item:", payload);
      await apiMethods.add(payload);
      toast.success("Created Successfully!");
      await fetchAll();
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
      console.log(`>>> Updating Item ID: ${id}`, payload);
      await apiMethods.update(id, payload);
      toast.success("Updated Successfully!");
      await fetchAll();
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
      await fetchAll();
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
