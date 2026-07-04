import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import categoryService from "../utils/categoryService";
import PublicLayout from "../components/PublicLayout";
import SingleProductCard from "./SingleProductCart";
import {
  FaBars,
  FaChevronDown,
  FaPhoneAlt,
  FaShoppingCart,
  FaTimes,
  FaUser,
} from "react-icons/fa";

const CategoryProductsList = () => {
  const { cid } = useParams();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Category Products (clean async/await style)
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const data = await categoryService.getCategoryProducts(cid);
        setProducts(data.products || []);
        setCategory(data.category || "");
      } catch (error) {
        console.log("Category Products Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [cid]);

  if (loading) {
    return <p className="p-5">Loading...</p>;
  }

  return (
    <PublicLayout>
      <div className="p-6">
        {/* ✅ Title */}
        <h2 className="text-2xl font-bold mb-5">{category} Products</h2>

        {/* ✅ Loading */}
        {loading && (
          <div className="text-center py-10 text-lg font-semibold text-gray-500">
            Loading Products...
          </div>
        )}

        {/* ✅ Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            No products found in this category
          </div>
        )}

        {/* ✅ Products Grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {products.map((product) => (
              <SingleProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default CategoryProductsList;
