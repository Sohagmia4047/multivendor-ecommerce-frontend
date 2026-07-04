import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import PublicLayout from "../components/PublicLayout";
// import cartService from "../utils/cartService";
import { useCart } from "../hooks/useCart";
// import { toast } from "react-toastify";
import SingleProductCard from "./SingleProductCart";
import {
  FaStar,
  FaShoppingCart,
  FaHeart,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaShieldAlt,
  FaTruck,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaUndo,
  FaTags,
  FaSearch,
  FaStore,
  FaExchangeAlt,
  FaBoxOpen,
} from "react-icons/fa";
import productService from "../utils/productService";
import categoryService from "../utils/categoryService";
import { Link } from "react-router-dom";

const ProductDetails = () => {
  const { pid } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const { addToCartGlobal } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({
    transformOrigin: "center center",
  });

  const handleAddToCart = (productId) => {
    addToCartGlobal(productId, qty);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getSingleProduct(pid);
        console.log("Product Data:", data);
        setProduct(data);
        if (data?.image) {
          setSelectedImage(data.image);
        }

        // RELATED PRODUCTS
        if (data?.category?.cid) {
          const related = await categoryService.getCategoryProducts(
            data.category.cid,
          );

          const filteredProducts = related.products.filter(
            (item) => item.id !== data.id,
          );

          setRelatedProducts(filteredProducts);
        }
      } catch (error) {
        console.log("Product fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [pid]);

  // ✅ Fetch Categories
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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await productService.addReview(pid, {
        review: reviewText,
        rating,
      });
      const updatedProduct = await productService.getSingleProduct(pid);
      setProduct(updatedProduct);
      setReviewText("");
      setRating(5);
      alert("Review Added Successfully");
    } catch (error) {
      console.log(error);
      alert("Failed To Add Review");
    } finally {
      setSubmitting(false);
    }
  };

  const calculateDiscount = (oldPrice, newPrice) => {
    if (!oldPrice || !newPrice) return 0;
    return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <h2 className="text-2xl font-bold text-gray-700">
            Loading Product...
          </h2>
        </div>
      </PublicLayout>
    );
  }

  if (!product) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <h2 className="text-2xl font-bold text-red-500">Product Not Found</h2>
        </div>
      </PublicLayout>
    );
  }

  const oldPrice = Number(product.old_price) || Number(product.price) + 50;
  const newPrice = Number(product.price);
  const discount = calculateDiscount(oldPrice, newPrice);
  const reviews = product?.reviews || [];

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Number(r.rating) === star).length,
  }));

  const allImages = [
    product.image,
    ...(product.images?.map((img) => img.image) || []),
  ];

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
    });
  };

  return (
    <PublicLayout>
      <div className="bg-[#f5f5f5] min-h-screen py-3">
        <div className="max-w-7xl mx-auto px-3 md:px-5">
          {/* MAIN SECTION */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-3">
            {/* LEFT CONTENT */}
            <div className="xl:col-span-9">
              <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* IMAGE SECTION */}
                  <div className="lg:col-span-5">
                    {/* MAIN IMAGE */}
                    <div
                      className="relative border border-gray-200 rounded-2xl overflow-hidden bg-white"
                      onMouseMove={handleMouseMove}
                    >
                      {/* DISCOUNT */}
                      <div className="absolute top-4 left-4 z-10 bg-rose-500 text-white text-[14px] font-bold px-4 py-1 rounded-xl shadow">
                        -{discount}%
                      </div>

                      <img
                        src={selectedImage}
                        alt=""
                        style={zoomStyle}
                        className="w-full h-60 sm:h-105 object-contain p-2 transition-transform duration-300 hover:scale-150 cursor-zoom-in"
                      />
                    </div>

                    {/* THUMBNAILS */}
                    <div className="flex gap-3 mt-4 overflow-x-auto scrollbar-hide pb-1">
                      {allImages.map((img, index) => (
                        <div
                          key={index}
                          onClick={() => setSelectedImage(img)}
                          className={`min-w-21.25 h-21.25 rounded-2xl border overflow-hidden cursor-pointer bg-white transition-all duration-300 ${
                            selectedImage === img
                              ? "border-green-200 scale-105"
                              : "border-gray-200"
                          }`}
                        >
                          <img
                            src={img}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PRODUCT CONTENT */}
                  <div className="lg:col-span-7">
                    {/* CATEGORY */}
                    <div className="inline-flex items-center bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm font-semibold">
                      {product.category?.title}
                    </div>

                    {/* TITLE */}
                    <h1 className="text-2xl md:text-2xl font-bold text-gray-700 mt-2 leading-tight">
                      {product.title}
                    </h1>

                    {/* RATING */}
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <div className="flex justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={
                              star <= Math.round(avgRating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>

                      <span className="text-gray-500 text-sm">
                        ({product.reviews?.length || 0} Reviews)
                      </span>
                    </div>

                    {/* PRICE */}
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                      <h2 className="text-3xl font-extrabold text-green-600">
                        ${newPrice}
                      </h2>

                      <span className="text-xl text-gray-400 line-through">
                        ${oldPrice}
                      </span>

                      <span className="bg-orange-100 text-orange-500 px-3 py-1 rounded-full text-sm font-bold">
                        {discount}% OFF
                      </span>
                    </div>

                    {/* DESCRIPTION */}
                    <div
                      className="text-gray-500 leading-7 mt-3 text-sm md:text-base"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(product.description || ""),
                      }}
                    />

                    {/* ACTION AREA */}
                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      {/* QTY */}
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                        <button
                          onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                          className="w-4 h-10 flex items-center justify-center hover:bg-gray-100"
                        >
                          <FaChevronLeft size={14} />
                        </button>

                        <span className="w-6 text-center font-bold text-gray-700">
                          {qty}
                        </span>

                        <button
                          onClick={() => setQty(qty + 1)}
                          className="w-4 h-10 flex items-center justify-center hover:bg-gray-100"
                        >
                          <FaChevronRight size={14} />
                        </button>
                      </div>

                      {/* CART */}
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        className="bg-green-500 hover:bg-green-600 text-[14px] transition-all duration-300 text-white px-3 h-10 rounded-xl font-semibold flex items-center gap-3 shadow-lg"
                      >
                        <FaShoppingCart size={14} />
                        Add To Cart
                      </button>

                      {/* WISHLIST */}
                      <button className="w-10 h-10 rounded-2xl border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
                        <FaHeart size={14} className="text-gray-600" />
                      </button>

                      {/* COMPARE */}
                      <button className="w-10 h-10 rounded-2xl border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
                        <FaExchangeAlt size={14} className="text-gray-600" />
                      </button>
                    </div>

                    {/* PRODUCT META */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <FaCheckCircle className="text-green-500" />
                          <span className="font-semibold">Type:</span>
                          <span className="text-gray-500">
                            {product.type || "Organic"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <FaBoxOpen className="text-green-500" />
                          <span className="font-semibold">SKU:</span>
                          <span className="text-gray-500">{product.sku}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <FaStore className="text-green-500" />
                          <span className="font-semibold">Stock:</span>
                          <span className="text-gray-500">
                            {product.stock_count || "10"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <FaCheckCircle className="text-green-500" />
                          <span className="font-semibold">Life:</span>
                          <span className="text-gray-500">
                            {product.life || "100 Days"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <FaCheckCircle className="text-green-500" />
                          <span className="font-semibold">MFG:</span>
                          <span className="text-gray-500 capitalize">
                            {product.mfd}
                          </span>
                        </div>

                        <div className="flex items-start gap-2 text-sm">
                          <FaTags className="text-green-500 mt-1" />

                          <span className="font-semibold">Tags:</span>

                          <div className="flex flex-wrap gap-2">
                            {product.tags?.length > 0 ? (
                              product.tags.map((tag, index) => {
                                const tagTitle =
                                  typeof tag === "object" ? tag.title : tag;
                                const tagSlug =
                                  typeof tag === "object"
                                    ? tag.slug || tag.title?.toLowerCase()
                                    : tag.toLowerCase();

                                return (
                                  <Link
                                    key={index}
                                    to={`/tag/${tagSlug}`}
                                    className="px-3 py-1 cursor-pointer bg-green-100 text-green-600 rounded-full text-xs font-medium"
                                  >
                                    {tagTitle}
                                  </Link>
                                );
                              })
                            ) : (
                              <span className="text-gray-500">No Tags</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* TABS SECTION */}
              <div className="bg-white rounded-3xl border border-gray-100 p-4 md:p-6 shadow-sm mt-3">
                {/* TAB BUTTONS */}
                <div className="flex flex-wrap gap-3 border-b border-gray-100 pb-4">
                  <button
                    onClick={() => setActiveTab("description")}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === "description"
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    Description
                  </button>

                  <button
                    onClick={() => setActiveTab("additional")}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === "additional"
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    Additional Info
                  </button>

                  <button
                    onClick={() => setActiveTab("vendor")}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === "vendor"
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    Vendor
                  </button>

                  <button
                    onClick={() => setActiveTab("reviews")}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === "reviews"
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    Reviews ({product.reviews?.length || 0})
                  </button>
                </div>

                {/* TAB CONTENT */}
                <div className="pt-3">
                  {/* DESCRIPTION */}
                  {activeTab === "description" && (
                    <div
                      className="text-gray-600 leading-6"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(product.description || ""),
                      }}
                    />
                  )}

                  {/* ADDITIONAL */}
                  {activeTab === "additional" && (
                    <div className="overflow-x-auto">
                      <table className="w-full border border-gray-100 rounded-2xl overflow-hidden">
                        <tbody>
                          <tr className="border-b">
                            <td className="p-4 font-semibold bg-gray-50">
                              Type
                            </td>
                            <td className="p-4 text-gray-600">
                              {product.type || "Organic"}
                            </td>
                          </tr>

                          <tr className="border-b">
                            <td className="p-4 font-semibold bg-gray-50">
                              SKU
                            </td>
                            <td className="p-4 text-gray-600">
                              {product.sku || "A67B87DA"}
                            </td>
                          </tr>

                          <tr className="border-b">
                            <td className="p-4 font-semibold bg-gray-50">
                              Stock
                            </td>
                            <td className="p-4 text-gray-600">
                              {product.stock_count || "10"}
                            </td>
                          </tr>

                          <tr className="border-b">
                            <td className="p-4 font-semibold bg-gray-50">
                              Life
                            </td>
                            <td className="p-4 text-gray-600">
                              {product.life || "100 Days"}
                            </td>
                          </tr>

                          <tr>
                            <td className="p-4 font-semibold bg-gray-50">
                              Vendor
                            </td>
                            <td className="p-4 text-gray-600">
                              {product.vendor?.title}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* VENDOR */}
                  {activeTab === "vendor" && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">
                        Vendor
                      </h3>

                      {/* TOP */}
                      <div className="flex items-start gap-2">
                        <img
                          src={product.vendor?.image}
                          alt=""
                          className="w-18 h-15 rounded-2xl object-contain border"
                        />

                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-800">
                            {product.vendor?.title}
                          </h4>

                          {/* REVIEW */}
                          <div className="flex items-center text-[13px] gap-0.5 text-yellow-400 mt-1">
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />

                            <span className="text-[13px] text-gray-500 ml-2">
                              (4.9 Rating)
                            </span>
                          </div>

                          {/* PHONE */}
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                            <FaPhoneAlt className="text-green-500" />
                            <span>{product.vendor?.contact}</span>
                          </div>
                        </div>
                      </div>

                      {/* ADDRESS */}
                      <div className="mt-5 bg-gray-50 rounded-2xl p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                            <FaMapMarkerAlt className="text-green-600" />
                          </div>

                          <div>
                            <p className="font-semibold text-gray-800">
                              Vendor Address
                            </p>

                            <p className="text-sm text-gray-500 mt-1 leading-6">
                              {product.vendor?.address ||
                                "No Address Available"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* DESCRIPTION */}
                      <div className="mt-3">
                        <h4 className="font-bold text-gray-800 mb-2">
                          About Vendor
                        </h4>

                        <p className="text-sm text-gray-500 leading-6">
                          {product.vendor?.description ||
                            "Trusted vendor with quality products and fast delivery service."}
                        </p>
                      </div>

                      {/* STATS */}
                      <div className="grid grid-cols-5 gap-3 mt-2">
                        <div className="bg-gray-50 rounded-xl p-4 text-center">
                          <h4 className="text-green-600 text-xl font-bold">
                            {product.vendor?.authentic_rating
                              ? `${product.vendor.authentic_rating}%`
                              : "92%"}
                          </h4>

                          <p className="text-xs text-gray-500 mt-1">
                            Authentic
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-4 text-center">
                          <h4 className="text-green-600 text-xl font-bold">
                            {product.vendor?.shipping_on_time
                              ? `${product.vendor.shipping_on_time}%`
                              : "100%"}
                          </h4>

                          <p className="text-xs text-gray-500 mt-1">Shipping</p>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-4 text-center">
                          <h4 className="text-green-600 text-xl font-bold">
                            {product.vendor?.chat_res_time
                              ? `${product.vendor.chat_res_time}%`
                              : "89%"}
                          </h4>

                          <p className="text-xs text-gray-500 mt-1">Response</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* REVIEWS */}
                  {activeTab === "reviews" && (
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 lg:gap-8">
                      {/* LEFT SIDE */}
                      <div className="xl:col-span-8">
                        <div className="flex items-center justify-center gap-3 mb-5">
                          <h3 className="text-[16px] font-bold text-gray-800 border-b border-gray-400">
                            Customer Reviews
                          </h3>

                          <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-[14px] font-medium">
                            {reviews.length} Reviews
                          </span>
                        </div>

                        {reviews.length > 0 ? (
                          reviews.map((review, index) => (
                            <div
                              key={index}
                              className="bg-gray-25 border border-gray-300 rounded-3xl p-3 md:p-3 mb-4 hover:shadow-lg transition-all duration-300"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                {/* USER */}
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-[16px">
                                    {(review.username || "A")
                                      .charAt(0)
                                      .toUpperCase()}
                                  </div>

                                  <div>
                                    <h4 className="font-semibold text-gray-800">
                                      {review.username || "Anonymous"}
                                    </h4>

                                    <p className="text-xs text-gray-700">
                                      {review.date
                                        ? `${new Date(
                                            review.date,
                                          ).toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                          })} at ${new Date(
                                            review.date,
                                          ).toLocaleTimeString("en-US", {
                                            hour: "numeric",
                                            minute: "2-digit",
                                            hour12: true,
                                          })}`
                                        : ""}
                                    </p>
                                  </div>
                                </div>

                                {/* RATING */}
                                <div className="flex items-center gap-2">
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <FaStar
                                        key={star}
                                        size={12}
                                        className={
                                          star <= review.rating
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                        }
                                      />
                                    ))}
                                  </div>

                                  <span className="bg-green-100 text-green-600 px-3 py-0.5 rounded-sm text-xs font-medium">
                                    Verified
                                  </span>
                                </div>
                              </div>

                              <p className="text-gray-600 mt-3 leading-5 text-sm md:text-[14px]">
                                {review.review}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="bg-white border border-dashed border-gray-300 rounded-3xl p-12 text-center">
                            <h4 className="font-semibold text-gray-700 text-lg">
                              No Reviews Yet
                            </h4>

                            <p className="text-gray-500 mt-2">
                              Be the first customer to review this product.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* RIGHT SIDE */}
                      <div className="xl:col-span-4">
                        <div className="sticky top-4">
                          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                            {/* HEADER */}
                            <h3 className="text-xl text-center font-bold text-gray-800 border-b border-gray-400 pb-2 mb-4">
                              Rating Summary
                            </h3>

                            {/* AVG RATING */}
                            <div className="text-center border-b border-gray-100 pb-4 mb-2">
                              <h2 className="text-[16px] font-extrabold text-green-600">
                                rating {avgRating} out of {reviews.length}{" "}
                                reviews
                              </h2>

                              <div className="flex justify-center gap-1 mt-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <FaStar
                                    key={star}
                                    size={12}
                                    className={
                                      star <= Math.round(avgRating)
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }
                                  />
                                ))}
                              </div>

                              <p className="text-gray-500 mt-2 text-sm">
                                Based on {reviews.length} customer reviews
                              </p>
                            </div>

                            {/* RATING BREAKDOWN */}
                            <div className="space-y-2">
                              {ratingCounts.map((item) => {
                                const percent =
                                  reviews.length > 0
                                    ? Math.round(
                                        (item.count / reviews.length) * 100,
                                      )
                                    : 0;

                                return (
                                  <div
                                    key={item.star}
                                    className="flex items-center"
                                  >
                                    {/* STAR */}
                                    <span className="w-12 text-sm text-gray-700">
                                      {item.star} star
                                    </span>

                                    {/* PROGRESS BAR */}
                                    <div className="flex-1 h-4 bg-gray-300 rounded overflow-hidden relative">
                                      <div
                                        className="h-full bg-green-500 rounded transition-all duration-700"
                                        style={{ width: `${percent}%` }}
                                      />

                                      {/* PERCENT TEXT INSIDE BAR */}
                                      {percent > 0 && (
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black font-semibold">
                                          {percent}%
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* FOOTER */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                              <div className="flex justify-center text-sm gap-1">
                                <span className="text-gray-500">
                                  Total Reviews :
                                </span>

                                <span className="font-semibold text-gray-800">
                                  {String(reviews.length).padStart(2, "0")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="mt-3 border-t pt-2">
                    <h3 className="text-[16px] text-gray-600 font-bold mb-1">
                      Add a Review
                    </h3>
                    <form onSubmit={handleReviewSubmit} className="space-y-2">
                      {/* Rating */}
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            size={12}
                            onClick={() => setRating(star)}
                            className={`cursor-pointer transition ${
                              star <= rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Review */}
                      <textarea
                        rows="2"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write your review..."
                        className="w-full border rounded-xl text-[14px] p-2 focus:outline-none focus:border-green-500"
                        required
                      />

                      <button
                        type="submit"
                        disabled={submitting}
                        className="bg-green-500 hover:bg-green-600 text-[14px] text-white px-3 py-1 rounded-xl"
                      >
                        {submitting ? "Submitting..." : "Submit Review"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              {/* RELATED PRODUCTS */}

              <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm mt-3">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  Related Products
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                  {Array.isArray(relatedProducts) &&
                  relatedProducts.length > 0 ? (
                    relatedProducts.map((product) => (
                      <SingleProductCard key={product.id} product={product} />
                    ))
                  ) : (
                    <div className="col-span-full text-center text-gray-500 py-6">
                      No related products found.
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* RIGHT SIDEBAR */}
            <div className="xl:col-span-3 space-y-3">
              {/* DELIVERY */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Delivery
                </h3>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <FaMapMarkerAlt className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-700 leading-6">
                      {product.vendor?.address || "No Address"}
                    </p>
                    <button className="text-green-600 font-semibold mt-2 text-sm">
                      Change Address
                    </button>
                  </div>
                </div>
              </div>

              {/* WARRANTY */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Return & Warranty
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <FaShieldAlt className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">100% Authentic</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Original product guarantee
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <FaUndo className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">10 Days Return</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Easy return policy available
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <FaTruck className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Fast Delivery</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Delivery within 2-5 working days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* VENDOR CARD */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Vendor</h3>
                {/* TOP */}
                <div className="flex items-start gap-2">
                  <img
                    src={product.vendor?.image}
                    alt=""
                    className="w-18 h-15 rounded-2xl object-contain border"
                  />
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-800">
                      {product.vendor?.title}
                    </h4>

                    {/* REVIEW */}
                    <div className="flex items-center text-[13px] gap-0.5 text-yellow-400 mt-1">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />

                      <span className="text-[13px] text-gray-500 ml-2">
                        (4.9 Rating)
                      </span>
                    </div>

                    {/* PHONE */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                      <FaPhoneAlt className="text-green-500" />
                      <span>{product.vendor?.contact}</span>
                    </div>
                  </div>
                </div>

                {/* ADDRESS */}
                <div className="mt-5 bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <FaMapMarkerAlt className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        Vendor Address
                      </p>
                      <p className="text-sm text-gray-500 mt-1 leading-6">
                        {product.vendor?.address || "No Address Available"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="mt-3">
                  <h4 className="font-bold text-gray-800 mb-2">About Vendor</h4>

                  <p className="text-sm text-gray-500 leading-6">
                    {product.vendor?.description ||
                      "Trusted vendor with quality products and fast delivery service."}
                  </p>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-3 gap-3 mt-2">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <h4 className="text-green-600 text-xl font-bold">
                      {product.vendor?.authentic_rating
                        ? `${product.vendor.authentic_rating}%`
                        : "92%"}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">Authentic</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 text-center">
                    <h4 className="text-green-600 text-xl font-bold">
                      {product.vendor?.shipping_on_time
                        ? `${product.vendor.shipping_on_time}%`
                        : "100%"}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">Shipping</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 text-center">
                    <h4 className="text-green-600 text-xl font-bold">
                      {product.vendor?.chat_res_time
                        ? `${product.vendor.chat_res_time}%`
                        : "89%"}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">Response</p>
                  </div>
                </div>
              </div>
              <div className="border rounded-xl p-2 md:p-5 h-fit w-full relative z-10">
                <h2 className="text-lg md:text-xl font-bold mb-2">Category</h2>

                {/* Loading */}
                {categoryLoading && (
                  <p className="text-sm text-gray-500">Loading Categories...</p>
                )}

                <div className="space-y-2">
                  {!categoryLoading &&
                    categories.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg border hover:border-green-500 hover:bg-green-50 hover:text-green-600 transition cursor-pointer group"
                        >
                          {/* LEFT */}
                          <div className="flex items-center gap-2">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-8 h-8 rounded-full object-cover"
                            />

                            <span className="text-sm md:text-[15px]">
                              {item.title}
                            </span>
                          </div>

                          {/* RIGHT */}
                          <span className="text-xs bg-gray-100 group-hover:bg-green-500 group-hover:text-white px-2 py-0.5 rounded-full transition">
                            {item.products}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ProductDetails;
