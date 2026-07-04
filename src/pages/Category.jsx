import React, { useEffect, useState } from "react";
import { FaSearch, FaHeart, FaStar, FaRegStar } from "react-icons/fa";
import categoryService from "../utils/categoryService";
import PublicLayout from "../components/PublicLayout";

const trendingProducts = [
  {
    id: 1,
    title: "Chen Cardigan",
    price: "$99.50",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500",
  },
  {
    id: 2,
    title: "Chen Sweater",
    price: "$89.50",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=500",
  },
  {
    id: 3,
    title: "Colorful Jacket",
    price: "$120.00",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=500",
  },
];

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();

        console.log("Categories:", data);

        setCategories(data);
      } catch (error) {
        console.log("Category Fetch Error:", error);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <PublicLayout>
      <div className="bg-white min-h-screen px-3 sm:px-5 md:px-8 lg:px-10 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* LEFT SIDE */}
          <div className="lg:col-span-3">
            
            {/* TOP BAR */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 md:mb-8">
              <h1 className="text-2xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                {categories.length} Categories
              </h1>

              <div className="flex flex-wrap items-center gap-2">
                <button className="bg-white border rounded-lg px-3 py-2 text-xs sm:text-sm shadow-sm hover:border-green-500 transition">
                  Show: 50
                </button>

                <button className="bg-white border rounded-lg px-3 py-2 text-xs sm:text-sm shadow-sm hover:border-green-500 transition">
                  Sort: Featured
                </button>
              </div>
            </div>

            {/* LOADING */}
            {categoryLoading ? (
              <div className="text-center py-20">
                <h2 className="text-lg font-semibold text-gray-500">
                  Loading Categories...
                </h2>
              </div>
            ) : (
              
              /* CATEGORY CARDS */
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                {categories.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white rounded-xl md:rounded-2xl border hover:shadow-lg transition duration-300 overflow-hidden"
                  >
                    
                    {/* IMAGE */}
                    <div className="relative bg-white p-4 sm:p-6 md:p-8">
                      
                      {/* Wishlist */}
                      <button className="absolute top-2 left-2 md:top-4 md:left-4 bg-yellow-400 text-white w-6 h-6 md:w-8 md:h-8 rounded-md flex items-center justify-center">
                        <FaHeart size={10} className="md:text-[13px]" />
                      </button>

                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-16 sm:h-18 md:h-20 object-contain group-hover:scale-105 transition duration-300"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="text-center py-4 md:py-6 px-2">
                      <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-1 md:mb-2 line-clamp-1">
                        {item.title}
                      </h2>

                      <p className="text-gray-500 text-[11px] sm:text-xs md:text-sm">
                        {item.products} Products
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-5 md:space-y-6">
            
            {/* SEARCH */}
            <div className="bg-white rounded-xl md:rounded-2xl border p-4 md:p-5">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-3 md:px-4 py-2 md:py-3 outline-none text-sm"
                />

                <button className="px-3 md:px-4 text-gray-500">
                  <FaSearch className="text-sm" />
                </button>
              </div>
            </div>

            {/* CATEGORY SIDEBAR */}
            <div className="bg-white rounded-xl md:rounded-2xl border p-4 md:p-6">
              <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">
                Category
              </h2>

              <div className="space-y-3">
                {categories.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border rounded-lg px-3 md:px-4 py-2 md:py-3 hover:border-green-500 transition"
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <span className="text-sm md:text-base">📦</span>

                      <div>{item.title}</div>
                    </div>

                    <span className="bg-green-100 text-green-600 text-[10px] md:text-xs font-semibold px-2 py-1 rounded-full">
                      {item.products}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* TRENDING */}
            <div className="bg-white rounded-xl md:rounded-2xl border p-4 md:p-6">
              <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">
                Trending Now
              </h2>

              <div className="space-y-4">
                {trendingProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex gap-3 border-b pb-3 last:border-none"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg object-cover"
                    />

                    <div>
                      <h3 className="font-semibold text-green-700 hover:text-green-500 cursor-pointer transition text-xs sm:text-sm md:text-base line-clamp-1">
                        {product.title}
                      </h3>

                      <p className="text-gray-700 font-bold mt-1 text-xs sm:text-sm md:text-base">
                        {product.price}
                      </p>

                      <div className="flex items-center gap-0.5 text-yellow-400 text-[10px] sm:text-xs md:text-sm mt-1">
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaRegStar />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Category;