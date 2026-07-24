import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaExchangeAlt,
  FaHeart,
  FaMapMarkerAlt,
  FaMinus,
  FaPhoneAlt,
  FaPlus,
  FaShieldAlt,
  FaShoppingCart,
  FaStar,
  FaStore,
  FaTags,
  FaTruck,
  FaUndo,
} from "react-icons/fa";

import PublicLayout from "../components/PublicLayout";
import { useCart } from "../hooks/useCart";
import productService from "../utils/productService";
import categoryService from "../utils/categoryService";
import SingleProductCard from "./SingleProductCart";

const PRODUCT_TABS = [
  { id: "description", label: "Description" },
  { id: "additional", label: "Specifications" },
  { id: "vendor", label: "Seller" },
  { id: "reviews", label: "Reviews" },
];

const formatPrice = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0.00";
  }

  return number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatReviewDate = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const Stars = ({ value = 0, sizeClass = "text-xs" }) => {
  const roundedValue = Math.round(Number(value) || 0);

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${Number(value) || 0} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`${sizeClass} ${
            star <= roundedValue ? "text-yellow-400" : "text-gray-200"
          }`}
        />
      ))}
    </div>
  );
};

const PageState = ({ type = "loading" }) => {
  const isLoading = type === "loading";

  return (
    <PublicLayout>
      <main className="min-h-[70vh] bg-[#f5f5f5] px-3 py-8 sm:px-5">
        <div className="mx-auto max-w-[1500px]">
          {isLoading ? (
            <div className="grid animate-pulse grid-cols-1 gap-3 xl:grid-cols-12">
              <div className="space-y-3 xl:col-span-9">
                <div className="grid gap-5 rounded-lg bg-white p-4 sm:p-6 lg:grid-cols-2">
                  <div className="aspect-square rounded-lg bg-gray-200" />

                  <div className="space-y-4 py-2">
                    <div className="h-5 w-24 rounded bg-gray-200" />
                    <div className="h-7 w-full rounded bg-gray-200" />
                    <div className="h-7 w-4/5 rounded bg-gray-200" />
                    <div className="h-20 rounded bg-gray-200" />
                    <div className="h-12 rounded bg-gray-200" />
                    <div className="h-11 w-56 rounded bg-gray-200" />
                  </div>
                </div>

                <div className="h-72 rounded-lg bg-white" />
              </div>

              <div className="hidden space-y-3 xl:col-span-3 xl:block">
                <div className="h-44 rounded-lg bg-white" />
                <div className="h-64 rounded-lg bg-white" />
                <div className="h-72 rounded-lg bg-white" />
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-white px-4 py-20 text-center shadow-sm">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red-50 text-2xl text-red-500">
                <FaBoxOpen />
              </div>

              <h1 className="mt-5 text-xl font-semibold text-gray-900 sm:text-2xl">
                Product not found
              </h1>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                The product may have been removed or the link may be incorrect.
              </p>

              <Link
                to="/"
                className="mt-6 inline-flex rounded-md bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Return to home
              </Link>
            </div>
          )}
        </div>
      </main>
    </PublicLayout>
  );
};

const QuantitySelector = ({ quantity, setQuantity }) => {
  return (
    <div className="inline-flex h-11 items-center overflow-hidden rounded-md border border-gray-300 bg-white">
      <button
        type="button"
        onClick={() => setQuantity((current) => Math.max(1, current - 1))}
        aria-label="Decrease quantity"
        className="grid h-full w-10 place-items-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        disabled={quantity <= 1}
      >
        <FaMinus className="text-[10px]" />
      </button>

      <span className="min-w-10 border-x border-gray-200 px-2 text-center text-sm font-semibold text-gray-800">
        {quantity}
      </span>

      <button
        type="button"
        onClick={() => setQuantity((current) => current + 1)}
        aria-label="Increase quantity"
        className="grid h-full w-10 place-items-center text-gray-600 transition hover:bg-gray-100"
      >
        <FaPlus className="text-[10px]" />
      </button>
    </div>
  );
};

const DeliveryCard = ({ vendor }) => {
  return (
    <section className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">Delivery</h2>

      <div className="mt-4 flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-orange-50 text-orange-500">
          <FaMapMarkerAlt />
        </div>

        <div className="min-w-0">
          <p className="text-sm leading-6 text-gray-600">
            {vendor?.address || "Delivery address is not available."}
          </p>

          <button
            type="button"
            className="mt-2 text-xs font-semibold text-orange-500 hover:text-orange-600"
          >
            Change address
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 border-t border-gray-100 pt-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-green-50 text-green-600">
          <FaTruck />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-800">Standard delivery</p>
          <p className="mt-1 text-xs leading-5 text-gray-500">
            Estimated delivery within 2–5 working days.
          </p>
        </div>
      </div>
    </section>
  );
};

const WarrantyCard = () => {
  const items = [
    {
      icon: <FaShieldAlt />,
      title: "100% authentic",
      description: "Original product guarantee",
    },
    {
      icon: <FaUndo />,
      title: "10-day return",
      description: "Easy return policy available",
    },
    {
      icon: <FaCheckCircle />,
      title: "Secure checkout",
      description: "Protected ordering process",
    },
  ];

  return (
    <section className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">
        Return & warranty
      </h2>

      <div className="mt-4 space-y-4">
        {items.map((item) => (
          <div key={item.title} className="flex items-start gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-green-50 text-sm text-green-600">
              {item.icon}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-800">{item.title}</p>
              <p className="mt-0.5 text-xs leading-5 text-gray-500">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const VendorCard = ({ vendor, detailed = false }) => {
  const stats = [
    {
      label: "Authentic",
      value:
        vendor?.authentic_rating !== undefined
          ? `${vendor.authentic_rating}%`
          : "92%",
    },
    {
      label: "On-time",
      value:
        vendor?.shipping_on_time !== undefined
          ? `${vendor.shipping_on_time}%`
          : "100%",
    },
    {
      label: "Response",
      value:
        vendor?.chat_res_time !== undefined
          ? `${vendor.chat_res_time}%`
          : "89%",
    },
  ];

  return (
    <section className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3">
        <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-md border border-gray-200 bg-gray-50">
          {vendor?.image ? (
            <img
              src={vendor.image}
              alt={vendor?.title || "Seller"}
              className="h-full w-full object-contain"
            />
          ) : (
            <FaStore className="text-xl text-gray-400" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs text-gray-400">Sold by</p>
          <h3 className="truncate text-base font-semibold text-gray-900">
            {vendor?.title || "Unknown seller"}
          </h3>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Stars value={4.9} sizeClass="text-[10px]" />
            <span className="text-xs text-gray-500">4.9 seller rating</span>
          </div>
        </div>
      </div>

      {vendor?.contact && (
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <FaPhoneAlt className="shrink-0 text-green-600" />
          <span className="break-all">{vendor.contact}</span>
        </div>
      )}

      {detailed && (
        <>
          <div className="mt-4 rounded-md bg-gray-50 p-3">
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1 shrink-0 text-orange-500" />

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Seller address
                </p>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  {vendor?.address || "No address available."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-900">
              About this seller
            </h4>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              {vendor?.description ||
                "Trusted seller offering quality products and reliable delivery service."}
            </p>
          </div>
        </>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-100 pt-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-md bg-gray-50 p-2 text-center">
            <p className="text-sm font-bold text-green-600 sm:text-base">
              {stat.value}
            </p>
            <p className="mt-0.5 truncate text-[10px] text-gray-500 sm:text-xs">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

const CategoryList = ({ categories, loading }) => {
  return (
    <section className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">Categories</h2>

      {loading ? (
        <div className="mt-4 space-y-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-11 animate-pulse rounded-md bg-gray-200"
            />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">No categories found.</p>
      ) : (
        <div className="mt-3 max-h-[360px] space-y-1 overflow-y-auto">
          {categories.map((item) => (
            <Link
              key={item.cid ?? item.id}
              to={`/category/${item.cid}`}
              className="group flex items-center gap-3 rounded-md px-2 py-2 transition hover:bg-orange-50"
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="h-9 w-9 shrink-0 rounded-md object-cover"
              />

              <span className="min-w-0 flex-1 truncate text-sm text-gray-700 transition group-hover:text-orange-600">
                {item.title}
              </span>

              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
                {item.products ?? 0}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

const ReviewSummary = ({ reviews, averageRating, ratingCounts }) => {
  return (
    <section className="rounded-lg border border-gray-100 bg-white p-4">
      <h3 className="text-base font-semibold text-gray-900">Rating summary</h3>

      <div className="mt-4 flex items-center gap-4 border-b border-gray-100 pb-4">
        <div>
          <p className="text-4xl font-bold text-orange-500">
            {Number(averageRating).toFixed(1)}
          </p>
          <p className="mt-1 text-xs text-gray-500">out of 5</p>
        </div>

        <div>
          <Stars value={averageRating} sizeClass="text-sm" />
          <p className="mt-2 text-xs text-gray-500">
            {reviews.length} customer review{reviews.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        {ratingCounts.map((item) => {
          const percentage =
            reviews.length > 0
              ? Math.round((item.count / reviews.length) * 100)
              : 0;

          return (
            <div key={item.star} className="flex items-center gap-2">
              <span className="w-8 text-xs text-gray-500">{item.star}★</span>

              <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <span className="w-8 text-right text-xs text-gray-500">
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const ProductDetails = () => {
  const { pid } = useParams();
  const { addToCartGlobal } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [zoomOrigin, setZoomOrigin] = useState("center center");

  useEffect(() => {
    let cancelled = false;

    const fetchProduct = async () => {
      setLoading(true);
      setQuantity(1);
      setActiveTab("description");

      try {
        const data = await productService.getSingleProduct(pid);

        if (cancelled) {
          return;
        }

        setProduct(data || null);
        setSelectedImage(data?.image || "");
        setRelatedProducts([]);

        if (data?.category?.cid) {
          try {
            const relatedResponse =
              await categoryService.getCategoryProducts(data.category.cid);

            if (cancelled) {
              return;
            }

            const relatedList = Array.isArray(relatedResponse)
              ? relatedResponse
              : Array.isArray(relatedResponse?.products)
                ? relatedResponse.products
                : [];

            setRelatedProducts(
              relatedList.filter(
                (item) => String(item?.id) !== String(data?.id),
              ),
            );
          } catch (relatedError) {
            console.error("Related product fetch error:", relatedError);

            if (!cancelled) {
              setRelatedProducts([]);
            }
          }
        }
      } catch (error) {
        console.error("Product fetch error:", error);

        if (!cancelled) {
          setProduct(null);
          setRelatedProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [pid]);

  useEffect(() => {
    let cancelled = false;

    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();

        if (!cancelled) {
          setCategories(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Category fetch error:", error);

        if (!cancelled) {
          setCategories([]);
        }
      } finally {
        if (!cancelled) {
          setCategoryLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  const reviews = useMemo(
    () => (Array.isArray(product?.reviews) ? product.reviews : []),
    [product?.reviews],
  );

  const averageRating = useMemo(() => {
    if (reviews.length === 0) {
      return 0;
    }

    const total = reviews.reduce(
      (sum, item) => sum + Number(item?.rating || 0),
      0,
    );

    return total / reviews.length;
  }, [reviews]);

  const ratingCounts = useMemo(
    () =>
      [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((review) => Number(review?.rating) === star)
          .length,
      })),
    [reviews],
  );

  const allImages = useMemo(() => {
    const imageList = [
      product?.image,
      ...(Array.isArray(product?.images)
        ? product.images.map((item) =>
            typeof item === "string" ? item : item?.image,
          )
        : []),
    ].filter(Boolean);

    return [...new Set(imageList)];
  }, [product]);

  const cleanDescription = useMemo(
    () => DOMPurify.sanitize(product?.description || ""),
    [product?.description],
  );

  const newPrice = Number(product?.price) || 0;
  const suppliedOldPrice = Number(product?.old_price) || 0;
  const oldPrice =
    suppliedOldPrice > newPrice && newPrice > 0 ? suppliedOldPrice : 0;
  const discount =
    oldPrice > 0
      ? Math.max(0, Math.round(((oldPrice - newPrice) / oldPrice) * 100))
      : Number(product?.discount) || 0;

  const handleAddToCart = () => {
    if (!product?.id) {
      return;
    }

    addToCartGlobal(product.id, quantity);
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    if (!reviewText.trim()) {
      return;
    }

    try {
      setSubmitting(true);

      await productService.addReview(pid, {
        review: reviewText.trim(),
        rating,
      });

      const updatedProduct = await productService.getSingleProduct(pid);
      setProduct(updatedProduct || product);
      setReviewText("");
      setRating(5);
      setActiveTab("reviews");
      window.alert("Review added successfully.");
    } catch (error) {
      console.error("Review submit error:", error);
      window.alert("Failed to add review.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setZoomOrigin(`${x}% ${y}%`);
  };

  if (loading) {
    return <PageState type="loading" />;
  }

  if (!product) {
    return <PageState type="not-found" />;
  }

  return (
    <PublicLayout>
      <main className="min-h-screen overflow-x-hidden bg-[#f5f5f5] pb-20 text-gray-700 lg:pb-6">
        <div className="mx-auto w-full max-w-[1500px] px-2.5 py-3 sm:px-4 md:px-6 lg:py-5">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-3 flex items-center gap-2 overflow-hidden text-xs text-gray-500 sm:text-sm"
          >
            <Link to="/" className="shrink-0 transition hover:text-orange-500">
              Home
            </Link>
            <span>/</span>

            {product?.category?.cid && (
              <>
                <Link
                  to={`/category/${product.category.cid}`}
                  className="max-w-[120px] truncate transition hover:text-orange-500 sm:max-w-[220px]"
                >
                  {product.category?.title || "Category"}
                </Link>
                <span>/</span>
              </>
            )}

            <span className="truncate text-gray-700">{product.title}</span>
          </nav>

          <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
            {/* Main content */}
            <div className="min-w-0 space-y-3 xl:col-span-9">
              {/* Product overview */}
              <section className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm sm:p-5 lg:p-6">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-7">
                  {/* Gallery */}
                  <div className="min-w-0 lg:col-span-5">
                    <div
                      onMouseMove={handleImageMouseMove}
                      onMouseLeave={() => setZoomOrigin("center center")}
                      className="group relative aspect-square overflow-hidden rounded-md border border-gray-200 bg-white"
                    >
                      {discount > 0 && (
                        <span className="absolute left-2 top-2 z-20 rounded bg-orange-500 px-2 py-1 text-xs font-semibold text-white sm:left-3 sm:top-3">
                          -{discount}%
                        </span>
                      )}

                      <img
                        src={selectedImage || allImages[0]}
                        alt={product.title}
                        style={{ transformOrigin: zoomOrigin }}
                        className="h-full w-full object-contain p-3 transition-transform duration-300 lg:group-hover:scale-[1.45]"
                      />
                    </div>

                    {allImages.length > 1 && (
                      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                        {allImages.map((image, index) => {
                          const active = selectedImage === image;

                          return (
                            <button
                              key={`${image}-${index}`}
                              type="button"
                              onClick={() => setSelectedImage(image)}
                              aria-label={`View product image ${index + 1}`}
                              className={`h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-white p-1 transition sm:h-[72px] sm:w-[72px] ${
                                active
                                  ? "border-orange-500 ring-1 ring-orange-500"
                                  : "border-gray-200 hover:border-orange-300"
                              }`}
                            >
                              <img
                                src={image}
                                alt=""
                                className="h-full w-full object-contain"
                              />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Product information */}
                  <div className="min-w-0 lg:col-span-7">
                    <p className="inline-flex rounded bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">
                      {product.category?.title || "Uncategorized"}
                    </p>

                    <h1 className="mt-3 break-words text-xl font-semibold leading-snug text-gray-900 sm:text-2xl lg:text-[28px]">
                      {product.title}
                    </h1>

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-gray-100 pb-4">
                      <button
                        type="button"
                        onClick={() => setActiveTab("reviews")}
                        className="flex items-center gap-2"
                      >
                        <span className="text-sm font-semibold text-orange-500">
                          {averageRating.toFixed(1)}
                        </span>
                        <Stars value={averageRating} />
                      </button>

                      <span className="h-4 w-px bg-gray-200" />

                      <button
                        type="button"
                        onClick={() => setActiveTab("reviews")}
                        className="text-xs text-gray-500 hover:text-orange-500 sm:text-sm"
                      >
                        {reviews.length} rating{reviews.length === 1 ? "" : "s"}
                      </button>

                      <span className="h-4 w-px bg-gray-200" />

                      <span className="text-xs text-gray-500 sm:text-sm">
                        {product.stock_count ?? 0} in stock
                      </span>
                    </div>

                    <div className="mt-4 rounded-md bg-[#fafafa] px-3 py-4 sm:px-4">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="text-2xl font-bold text-orange-500 sm:text-3xl">
                          ${formatPrice(newPrice)}
                        </span>

                        {oldPrice > 0 && (
                          <span className="text-sm text-gray-400 line-through sm:text-base">
                            ${formatPrice(oldPrice)}
                          </span>
                        )}

                        {discount > 0 && (
                          <span className="rounded-sm bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-600">
                            {discount}% OFF
                          </span>
                        )}
                      </div>
                    </div>

                    {cleanDescription && (
                      <div
                        className="mt-4 max-h-24 overflow-hidden text-sm leading-6 text-gray-600 [&_a]:text-orange-500 [&_li]:mb-1 [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:mb-2 [&_ul]:ml-5 [&_ul]:list-disc"
                        dangerouslySetInnerHTML={{ __html: cleanDescription }}
                      />
                    )}

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <QuantitySelector
                        quantity={quantity}
                        setQuantity={setQuantity}
                      />

                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-orange-500 px-5 text-sm font-semibold text-white transition hover:bg-orange-600 active:scale-[0.99] sm:flex-none sm:min-w-[170px]"
                      >
                        <FaShoppingCart />
                        Add to cart
                      </button>

                      <button
                        type="button"
                        aria-label="Add to wishlist"
                        className="grid h-11 w-11 place-items-center rounded-md border border-gray-300 bg-white text-gray-600 transition hover:border-orange-500 hover:text-orange-500"
                      >
                        <FaHeart />
                      </button>

                      <button
                        type="button"
                        aria-label="Compare product"
                        className="grid h-11 w-11 place-items-center rounded-md border border-gray-300 bg-white text-gray-600 transition hover:border-orange-500 hover:text-orange-500"
                      >
                        <FaExchangeAlt />
                      </button>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-3 border-t border-gray-100 pt-5 sm:grid-cols-2">
                      <div className="flex min-w-0 items-center gap-2 text-sm">
                        <FaCheckCircle className="shrink-0 text-green-600" />
                        <span className="font-medium text-gray-800">Type:</span>
                        <span className="truncate text-gray-500">
                          {product.type || "Standard"}
                        </span>
                      </div>

                      <div className="flex min-w-0 items-center gap-2 text-sm">
                        <FaBoxOpen className="shrink-0 text-green-600" />
                        <span className="font-medium text-gray-800">SKU:</span>
                        <span className="truncate text-gray-500">
                          {product.sku || "N/A"}
                        </span>
                      </div>

                      <div className="flex min-w-0 items-center gap-2 text-sm">
                        <FaStore className="shrink-0 text-green-600" />
                        <span className="font-medium text-gray-800">Stock:</span>
                        <span className="truncate text-gray-500">
                          {product.stock_count ?? 0}
                        </span>
                      </div>

                      <div className="flex min-w-0 items-center gap-2 text-sm">
                        <FaCheckCircle className="shrink-0 text-green-600" />
                        <span className="font-medium text-gray-800">Life:</span>
                        <span className="truncate text-gray-500">
                          {product.life || "N/A"}
                        </span>
                      </div>

                      <div className="flex min-w-0 items-center gap-2 text-sm">
                        <FaCheckCircle className="shrink-0 text-green-600" />
                        <span className="font-medium text-gray-800">MFG:</span>
                        <span className="truncate capitalize text-gray-500">
                          {product.mfd || "N/A"}
                        </span>
                      </div>

                      <div className="flex min-w-0 items-start gap-2 text-sm">
                        <FaTags className="mt-1 shrink-0 text-green-600" />
                        <span className="shrink-0 font-medium text-gray-800">
                          Tags:
                        </span>

                        <div className="flex min-w-0 flex-wrap gap-1.5">
                          {Array.isArray(product.tags) &&
                          product.tags.length > 0 ? (
                            product.tags.map((tag, index) => {
                              const title =
                                typeof tag === "object" ? tag?.title : tag;
                              const slug =
                                typeof tag === "object"
                                  ? tag?.slug || tag?.title
                                  : tag;

                              if (!title) {
                                return null;
                              }

                              return (
                                <Link
                                  key={`${title}-${index}`}
                                  to={`/tag/${encodeURIComponent(
                                    String(slug || title).toLowerCase(),
                                  )}`}
                                  className="rounded bg-gray-100 px-2 py-1 text-[11px] text-gray-600 transition hover:bg-orange-50 hover:text-orange-600"
                                >
                                  {title}
                                </Link>
                              );
                            })
                          ) : (
                            <span className="text-gray-500">No tags</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Mobile information cards */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:hidden">
                <DeliveryCard vendor={product.vendor} />
                <WarrantyCard />

                <div className="sm:col-span-2">
                  <VendorCard vendor={product.vendor} />
                </div>
              </div>

              {/* Tabs */}
              <section className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
                <div className="overflow-x-auto border-b border-gray-200">
                  <div className="flex min-w-max px-2 sm:px-4">
                    {PRODUCT_TABS.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative px-3 py-4 text-sm font-medium transition sm:px-5 ${
                          activeTab === tab.id
                            ? "text-orange-600"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {tab.label}
                        {tab.id === "reviews" && ` (${reviews.length})`}

                        {activeTab === tab.id && (
                          <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-orange-500 sm:left-5 sm:right-5" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 sm:p-5 lg:p-6">
                  {activeTab === "description" && (
                    <div
                      className="text-sm leading-7 text-gray-600 [&_a]:text-orange-500 [&_h1]:mb-3 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:font-semibold [&_img]:my-4 [&_img]:max-w-full [&_li]:mb-1 [&_ol]:mb-4 [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:mb-3 [&_table]:w-full [&_ul]:mb-4 [&_ul]:ml-5 [&_ul]:list-disc"
                      dangerouslySetInnerHTML={{ __html: cleanDescription }}
                    />
                  )}

                  {activeTab === "additional" && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse text-sm">
                        <tbody>
                          {[
                            ["Type", product.type || "Standard"],
                            ["SKU", product.sku || "N/A"],
                            ["Stock", product.stock_count ?? 0],
                            ["Life", product.life || "N/A"],
                            ["Manufactured", product.mfd || "N/A"],
                            [
                              "Seller",
                              product.vendor?.title || "Unknown seller",
                            ],
                          ].map(([label, value]) => (
                            <tr
                              key={label}
                              className="border-b border-gray-100 last:border-b-0"
                            >
                              <th className="w-[38%] min-w-[130px] bg-gray-50 px-3 py-3 text-left font-medium text-gray-700 sm:px-4">
                                {label}
                              </th>
                              <td className="px-3 py-3 text-gray-600 sm:px-4">
                                {value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeTab === "vendor" && (
                    <VendorCard vendor={product.vendor} detailed />
                  )}

                  {activeTab === "reviews" && (
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                      <div className="space-y-4 lg:col-span-8">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h2 className="text-lg font-semibold text-gray-900">
                            Customer reviews
                          </h2>
                          <span className="rounded bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600">
                            {reviews.length} review
                            {reviews.length === 1 ? "" : "s"}
                          </span>
                        </div>

                        {reviews.length > 0 ? (
                          <div className="space-y-3">
                            {reviews.map((review, index) => (
                              <article
                                key={review.id ?? index}
                                className="rounded-lg border border-gray-100 bg-white p-3 transition hover:border-gray-200 hover:shadow-sm sm:p-4"
                              >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <div className="flex min-w-0 items-center gap-3">
                                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-orange-50 text-sm font-bold text-orange-600">
                                      {String(review.username || "A")
                                        .charAt(0)
                                        .toUpperCase()}
                                    </div>

                                    <div className="min-w-0">
                                      <h3 className="truncate text-sm font-semibold text-gray-900">
                                        {review.username || "Anonymous"}
                                      </h3>
                                      <p className="mt-0.5 text-[11px] text-gray-400">
                                        {formatReviewDate(review.date)}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Stars
                                      value={review.rating}
                                      sizeClass="text-[10px]"
                                    />
                                    <span className="rounded bg-green-50 px-2 py-1 text-[10px] font-medium text-green-600">
                                      Verified
                                    </span>
                                  </div>
                                </div>

                                <p className="mt-3 break-words text-sm leading-6 text-gray-600">
                                  {review.review}
                                </p>
                              </article>
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-lg border border-dashed border-gray-300 px-4 py-12 text-center">
                            <h3 className="font-semibold text-gray-800">
                              No reviews yet
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                              Be the first customer to review this product.
                            </p>
                          </div>
                        )}

                        <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 sm:p-4">
                          <h3 className="text-base font-semibold text-gray-900">
                            Write a review
                          </h3>

                          <form
                            onSubmit={handleReviewSubmit}
                            className="mt-4 space-y-4"
                          >
                            <div>
                              <label className="mb-2 block text-xs font-medium text-gray-600">
                                Your rating
                              </label>

                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    aria-label={`Rate ${star} star${
                                      star === 1 ? "" : "s"
                                    }`}
                                    className="p-1"
                                  >
                                    <FaStar
                                      className={`text-lg ${
                                        star <= rating
                                          ? "text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>

                            <textarea
                              rows={4}
                              value={reviewText}
                              onChange={(event) =>
                                setReviewText(event.target.value)
                              }
                              placeholder="Share your experience with this product..."
                              className="w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                              required
                            />

                            <button
                              type="submit"
                              disabled={submitting}
                              className="rounded-md bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {submitting
                                ? "Submitting..."
                                : "Submit review"}
                            </button>
                          </form>
                        </div>
                      </div>

                      <div className="lg:col-span-4">
                        <div className="lg:sticky lg:top-20">
                          <ReviewSummary
                            reviews={reviews}
                            averageRating={averageRating}
                            ratingCounts={ratingCounts}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Related products */}
              <section className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
                      Related products
                    </h2>
                    <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                      More products from the same category
                    </p>
                  </div>

                  {product.category?.cid && (
                    <Link
                      to={`/category/${product.category.cid}`}
                      className="shrink-0 text-xs font-semibold text-orange-500 hover:text-orange-600 sm:text-sm"
                    >
                      View all
                    </Link>
                  )}
                </div>

                {relatedProducts.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:gap-3 lg:grid-cols-4">
                    {relatedProducts.slice(0, 8).map((item) => (
                      <SingleProductCard key={item.id} product={item} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md bg-gray-50 px-4 py-10 text-center text-sm text-gray-500">
                    No related products found.
                  </div>
                )}
              </section>

              {/* Mobile categories */}
              <div className="xl:hidden">
                <CategoryList
                  categories={categories}
                  loading={categoryLoading}
                />
              </div>
            </div>

            {/* Desktop sidebar */}
            <aside className="hidden xl:col-span-3 xl:block">
              <div className="sticky top-20 space-y-3">
                <DeliveryCard vendor={product.vendor} />
                <WarrantyCard />
                <VendorCard vendor={product.vendor} detailed />
                <CategoryList
                  categories={categories}
                  loading={categoryLoading}
                />
              </div>
            </aside>
          </div>
        </div>

        {/* Mobile sticky purchase bar */}
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white px-3 py-2 shadow-[0_-4px_18px_rgba(0,0,0,0.08)] lg:hidden">
          <div className="mx-auto flex max-w-[1500px] items-center gap-2">
            <button
              type="button"
              aria-label="Add to wishlist"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-gray-300 text-gray-600"
            >
              <FaHeart />
            </button>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] text-gray-400">Total price</p>
              <p className="truncate text-base font-bold text-orange-500">
                ${formatPrice(newPrice * quantity)}
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-orange-500 px-4 text-xs font-semibold text-white sm:px-6 sm:text-sm"
            >
              <FaShoppingCart />
              Add to cart
            </button>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
};

export default ProductDetails;