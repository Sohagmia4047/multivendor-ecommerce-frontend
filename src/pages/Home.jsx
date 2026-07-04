import React, { useEffect, useState } from "react";
import {
  FaBars,
  FaChevronDown,
  FaPhoneAlt,
  FaShoppingCart,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import SingleProductCard from "./SingleProductCart";
import CategoryCard from "./CategoryCard";
import {
  FaCheese,
  FaTshirt,
  FaBone,
  FaCoffee,
  FaBreadSlice,
  FaAppleAlt,
} from "react-icons/fa";
import background from "../assets/background.jpg";
import PublicLayout from "../components/PublicLayout";
import productService from "../utils/productService";
import categoryService from "../utils/categoryService";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const saved = localStorage.getItem("selectedCategories");
    return saved ? JSON.parse(saved) : [];
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  // ✅ Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.log("Category Fetch Error:", error);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // ✅ Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();

        console.log(data);

        setProducts(data);
      } catch (error) {
        console.log("Product Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "selectedCategories",
      JSON.stringify(selectedCategories),
    );
  }, [selectedCategories]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const title = product?.title?.toLowerCase() || "";
      const category = product?.category?.title?.toLowerCase() || "";
      const vendor = product?.vendor?.title?.toLowerCase() || "";

      const query = searchQuery.toLowerCase();

      const searchMatch =
        title.includes(query) ||
        category.includes(query) ||
        vendor.includes(query);

      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category?.cid);

      return searchMatch && categoryMatch;
    });
  }, [products, searchQuery, selectedCategories]);

  return (
    <PublicLayout>
      {/* ✅ FIX 1: prevent horizontal submenu cut issue */}
      <div className="w-full overflow-x-hidden overflow-y-visible bg-white text-gray-700 relative z-0">
        {/* HERO SECTION */}
        <div className="px-4 md:px-6 2xl:px-12 py-4 lg:py-8">
          <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-4">
            {/* LEFT CATEGORY */}
            <CategoryCard
              categories={categories}
              categoryLoading={categoryLoading}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              navigate={navigate}
            />

            {/* HERO RIGHT */}
            <div className="w-full rounded-[25px] overflow-hidden relative h-62.5 md:h-87.5 lg:h-112.5 z-0">
              <img
                src={background}
                alt="Background"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 flex items-center pt-25 px-6 md:px-10 xl:px-14 z-10">
                <div className="flex w-full max-w-md">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 bg-white px-3 py-2 rounded outline-none"
                  />

                  <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-r-full font-medium transition">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCTS SECTION */}
        <div className="px-4 md:px-6 2xl:px-12 py-4">
          <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-6">
            {/* LEFT FILTER */}
            <div className="border rounded-3xl p-5 h-fit sticky top-5  z-10">
              <h2 className="text-2xl font-bold mb-5">Fill by price</h2>

              <div className="mb-6">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-2/3 h-full bg-green-500"></div>
                </div>

                <div className="flex justify-between text-sm mt-3 text-gray-500">
                  <span>From: $500</span>
                  <span>To: $1,000</span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-bold mb-4">Color</h3>
                <div className="space-y-3 text-sm">
                  {["Red (56)", "Green (78)", "Blue (54)"].map(
                    (item, index) => (
                      <label
                        key={index}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input type="checkbox" />
                        {item}
                      </label>
                    ),
                  )}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-bold mb-4">Item Condition</h3>
                <div className="space-y-3 text-sm">
                  {["New (1506)", "Refurbished (27)", "Used (45)"].map(
                    (item, index) => (
                      <label
                        key={index}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input type="checkbox" />
                        {item}
                      </label>
                    ),
                  )}
                </div>
              </div>

              <button className="bg-green-500 hover:bg-green-600 transition text-white px-5 py-3 rounded-xl w-full font-medium">
                Filter
              </button>

              <img
                src="https://cdn-icons-png.flaticon.com/512/2909/2909763.png"
                alt="leaf"
                className="w-24 mt-8 mx-auto opacity-70"
              />
            </div>

            {/* RIGHT PRODUCTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-5 gap-y-5 relative z-0">
              {loading && (
                <h2 className="text-xl font-semibold">Loading Products...</h2>
              )}

              {!loading && filteredProducts.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <h2 className="text-2xl font-bold text-gray-500">
                    No Product Found
                  </h2>
                </div>
              )}

              {!loading &&
                filteredProducts.map((product) => (
                  <SingleProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Home;
