import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import productService from "../utils/productService";
import categoryService from "../utils/categoryService";
import vendorService from "../utils/vendorService";
import CategoryCard from "./CategoryCard";
import tagService from "../utils/tagService";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useMemo } from "react";
import {
  FaFilter,
  FaStar,
  FaHeart,
  FaExchangeAlt,
  FaSearch,
  FaRegStar,
  FaShoppingCart,
  FaTh,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState(() => {
    const saved = localStorage.getItem("selectedCategories");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedVendors, setSelectedVendors] = useState(() => {
    const saved = localStorage.getItem("selectedVendors");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedPriceRanges, setSelectedPriceRanges] = useState(() => {
    const saved = localStorage.getItem("selectedPriceRanges");
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const [vendors, setVendors] = useState([]);
  const [vendorLoading, setVendorLoading] = useState(true);

  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState("all");

  const [tags, setTags] = useState([]);
  const [tagLoading, setTagLoading] = useState(true);
  const { minPrice, maxPrice } = useMemo(() => {
    if (!products.length) {
      return { minPrice: 0, maxPrice: 0 };
    }
    const prices = products.map((item) => Number(item.price));
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    };
  }, [products]);
  const [selectedPrice, setSelectedPrice] = useState(maxPrice);
  const { addToCartGlobal } = useCart();

  useEffect(() => {
    setSelectedPrice(maxPrice);
  }, [maxPrice]);

  useEffect(() => {
    localStorage.setItem(
      "selectedCategories",
      JSON.stringify(selectedCategories),
    );
  }, [selectedCategories]);

  useEffect(() => {
    localStorage.setItem("selectedVendors", JSON.stringify(selectedVendors));
  }, [selectedVendors]);

  const rangeSize = Math.ceil((maxPrice - minPrice) / 5);

  const priceRanges = [
    [minPrice, minPrice + rangeSize],
    [minPrice + rangeSize, minPrice + rangeSize * 2],
    [minPrice + rangeSize * 2, minPrice + rangeSize * 3],
    [minPrice + rangeSize * 3, minPrice + rangeSize * 4],
    [minPrice + rangeSize * 4, maxPrice],
  ];

  const filteredProducts = products.filter((product) => {
    const productPrice = Number(product.price);

    const sliderPriceMatch = productPrice <= selectedPrice;

    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category?.cid);

    const vendorMatch =
      selectedVendors.length === 0 ||
      selectedVendors.includes(product.vendor?.vid);

    const rangeMatch =
      selectedPriceRanges.length === 0
        ? true
        : selectedPriceRanges.some((rangeIndex) => {
            const [from, to] = priceRanges[rangeIndex];
            return productPrice >= from && productPrice <= to;
          });

    return sliderPriceMatch && categoryMatch && vendorMatch && rangeMatch;
  });

  // ✅ Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (error) {
        console.log("Product Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await vendorService.getAllVendors();
        setVendors(data);
      } catch (error) {
        console.log("Vendor Fetch Error:", error);
      } finally {
        setVendorLoading(false);
      }
    };

    fetchVendors();
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const data = await tagService.getAllTags();
        console.log("Fetched Tags:", data);
        setTags(data);
      } catch (error) {
        console.log("Tag Fetch Error:", error);
      } finally {
        setTagLoading(false);
      }
    };

    fetchTags();
  }, []);

  const filteredProductsByStatus = useMemo(() => {
    if (sortBy === "all") return filteredProducts;

    return filteredProducts.filter((product) => {
      return product.product_status === sortBy;
    });
  }, [filteredProducts, sortBy]);

  useEffect(() => {
    localStorage.setItem(
      "selectedPriceRanges",
      JSON.stringify(selectedPriceRanges),
    );
  }, [selectedPriceRanges]);

  return (
    <PublicLayout>
      <div className="bg-[#f7f8f9] min-h-screen px-5 md:px-10 py-2">
        {/* FILTER TOP */}
        <div className="flex items-center gap-1 mb-1">
          <button className="flex text-[16px] items-center gap-2 border rounded-full px-3 py-1 bg-white shadow-sm">
            <FaFilter />
            Filters
          </button>
        </div>

        {/* FILTER BOXES */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-2 items-start">
          {/* Categories */}
          <CategoryCard
            categories={categories}
            categoryLoading={categoryLoading}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            navigate={navigate}
          />

          {/* Vendors */}
          <div className="bg-white rounded-2xl border p-4 h-fit">
            <h2 className="font-bold text-[16px] mb-2">By Vendors</h2>
            <div className="grid grid-cols-2 gap-2">
              {vendorLoading ? (
                <p className="text-sm text-gray-500">Loading Vendors...</p>
              ) : (
                vendors?.map((vendor) => (
                  <label
                    key={vendor.id || vendor.vid}
                    className="flex items-center gap-2 text-gray-600 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedVendors.includes(vendor.vid)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedVendors([...selectedVendors, vendor.vid]);
                        } else {
                          setSelectedVendors(
                            selectedVendors.filter((id) => id !== vendor.vid),
                          );
                        }
                      }}
                    />
                    {vendor.title || vendor.name || vendor.store_name}
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl border p-4 h-fit">
            <h2 className="font-bold text-[16px] mb-2">By Tags</h2>
            <div className="flex flex-wrap gap-1">
              {tagLoading ? (
                <p className="text-sm text-gray-500">Loading Tags...</p>
              ) : (
                tags?.map((tag) => (
                  <button
                    key={tag.id || tag.slug}
                    className="px-3 py-1 text-[14px] rounded-full bg-gray-100 text-gray-600 hover:bg-green-200 hover:text-green-600 transition"
                  >
                    × {tag.name || tag.title}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Price */}
          <div className="bg-white rounded-2xl border p-4 h-fit">
            <h2 className="font-bold text-[16px]">By Price</h2>
            <div className="mb-4">
              <input
                type="range"
                min={minPrice}
                max={maxPrice}
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(Number(e.target.value))}
                className="w-full h-0.75 cursor-pointer"
              />

              <div className="flex justify-between text-xs mt-2">
                <span>${minPrice}</span>
                <span className="font-semibold text-green-600">
                  ${selectedPrice}
                </span>
                <span>${maxPrice}</span>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              {priceRanges.map(([from, to], index) => (
                <label key={index} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedPriceRanges.includes(index)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPriceRanges([...selectedPriceRanges, index]);
                      } else {
                        setSelectedPriceRanges(
                          selectedPriceRanges.filter((item) => item !== index),
                        );
                      }
                    }}
                  />
                  ${from} - ${to}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <p className="text-gray-600">
            We found{" "}
            <span className="text-green-600 font-bold">
              {filteredProductsByStatus.length}
            </span>{" "}
            items for you!
          </p>
          <div className="flex items-center gap-1">
            <button className="border rounded-lg px-5 py-1 text-[16px] bg-white flex items-center gap-2">
              <FaTh />
              Show: 50
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-lg px-4 py-1 text-[16px] bg-white cursor-pointer outline-none"
            >
              <option value="all">All Products</option>
              <option value="draft">Draft</option>
              <option value="in_review">In Review</option>
              <option value="published">Published</option>
              <option value="rejected">Rejected</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-5 gap-y-5 relative z-0">
          {/* ✅ Loading */}
          {loading && (
            <div className="col-span-full text-center py-10">
              Loading Products...
            </div>
          )}

          {/* ✅ Products */}
          {!loading &&
            filteredProductsByStatus.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product-detail/${product.id}`)}
                className="border rounded-3xl p-2 hover:shadow-xl transition duration-300 group relative bg-white h-fit"
              >
                {/* Discount Badge */}
                {product.discount > 0 && (
                  <span className="absolute top-3 left-3 bg-red-400 text-white z-10 text-xs px-3 py-1 rounded-full">
                    -{product.discount}%
                  </span>
                )}

                {/* Action Buttons */}
                <div className="absolute top-35 right-6 flex flex-row gap-2 opacity-0 group-hover:opacity-100 transition z-20">
                  <button className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-green-500 hover:text-white transition">
                    <FaHeart />
                  </button>

                  <button className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-green-500 hover:text-white transition">
                    <FaExchangeAlt />
                  </button>

                  <button className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-green-500 hover:text-white transition">
                    <FaSearch />
                  </button>
                </div>

                {/* Product Image */}
                <div className="flex items-center justify-center h-40">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-32 object-contain group-hover:scale-105 transition duration-300"
                  />
                </div>

                {/* Category */}
                <p className="text-[11px] text-gray-400 mb-0.5">
                  {product.category?.title}
                </p>

                {/* Title */}
                <h2 className="font-semibold text-sm leading-5 mb-2 line-clamp-2 hover:text-green-500 transition cursor-pointer min-h-5">
                  {product.title}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-1 text-yellow-400 text-xs mb-1">
                  ★★★★★
                  <span className="text-gray-400 text-[11px]">
                    ({product.reviews?.length || 0})
                  </span>
                </div>

                {/* Vendor title  */}
                <p className="text-[11px] text-gray-400 mb-0.5">
                  By {product.vendor?.title}
                </p>

                {/* Price */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex flex-col">
                    <span className="text-green-500 font-bold text-base">
                      ${product.price}
                    </span>

                    {product.old_price && (
                      <span className="text-gray-400 line-through text-xs">
                        ${product.old_price}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // card click prevent
                      addToCartGlobal(product.id, 1);
                    }}
                    className="bg-green-100 hover:bg-green-500 hover:text-white transition px-3 py-2 rounded-lg text-xs font-medium text-green-600"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-center gap-3 mt-12">
          <button className="w-10 h-10 rounded-full border bg-white flex items-center justify-center">
            <FaChevronLeft />
          </button>

          <button className="w-10 h-10 rounded-full bg-green-500 text-white">
            1
          </button>

          <button className="w-10 h-10 rounded-full border bg-white">2</button>

          <button className="w-10 h-10 rounded-full border bg-white">3</button>

          <button className="w-10 h-10 rounded-full border bg-white flex items-center justify-center">
            <FaChevronRight />
          </button>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Products;
