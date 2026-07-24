import React, { useMemo } from "react";
import {
  FaExchangeAlt,
  FaHeart,
  FaSearch,
  FaShoppingCart,
  FaStar,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";

const formatPrice = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "0.00";
  }

  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const SingleProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCartGlobal } = useCart();

  const averageRating = useMemo(() => {
    const reviews = Array.isArray(product?.reviews) ? product.reviews : [];

    if (reviews.length === 0) {
      return 0;
    }

    const total = reviews.reduce(
      (sum, review) => sum + Number(review?.rating || 0),
      0,
    );

    return Number((total / reviews.length).toFixed(1));
  }, [product?.reviews]);

  const reviewCount = Array.isArray(product?.reviews)
    ? product.reviews.length
    : 0;

  const openProduct = () => {
    if (product?.id) {
      navigate(`/product-detail/${product.id}`);
    }
  };

  const stopCardNavigation = (event) => {
    event.stopPropagation();
  };

  const handleAddToCart = (event) => {
    event.stopPropagation();

    if (product?.id) {
      addToCartGlobal(product.id, 1);
    }
  };

  return (
    <article
      onClick={openProduct}
      className="group relative flex h-full min-w-0 cursor-pointer flex-col overflow-hidden rounded-md border border-gray-100 bg-white p-1.5 transition duration-200 hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-md sm:p-2"
    >
      {/* Discount badge */}
      {Number(product?.discount) > 0 && (
        <span className="absolute left-1.5 top-1.5 z-20 rounded-sm bg-orange-500 px-1.5 py-0.5 text-[8px] font-semibold leading-4 text-white sm:left-2 sm:top-2 sm:text-[9px]">
          -{product.discount}%
        </span>
      )}

      {/* Wishlist */}
      <button
        type="button"
        aria-label="Add to wishlist"
        onClick={stopCardNavigation}
        className="absolute right-1.5 top-1.5 z-20 grid h-6 w-6 place-items-center rounded-full bg-white/95 text-[10px] text-gray-500 shadow-sm transition hover:bg-green-500 hover:text-white sm:right-2 sm:top-2 sm:h-7 sm:w-7 sm:text-xs"
      >
        <FaHeart />
      </button>

      {/* Desktop hover actions */}
      <div className="pointer-events-none absolute right-2 top-9 z-20 hidden flex-col gap-1 opacity-0 transition duration-200 group-hover:opacity-100 md:flex">
        <button
          type="button"
          aria-label="Compare product"
          onClick={stopCardNavigation}
          className="pointer-events-auto grid h-6 w-6 place-items-center rounded-full bg-white text-[9px] text-gray-500 shadow-sm transition hover:bg-green-500 hover:text-white"
        >
          <FaExchangeAlt />
        </button>

        <button
          type="button"
          aria-label="Quick view"
          onClick={stopCardNavigation}
          className="pointer-events-auto grid h-6 w-6 place-items-center rounded-full bg-white text-[9px] text-gray-500 shadow-sm transition hover:bg-green-500 hover:text-white"
        >
          <FaSearch />
        </button>
      </div>

      {/* Compact image area: height is about 70% of previous square area */}
      <div className="flex aspect-[10/7] w-full items-center justify-center overflow-hidden rounded bg-white p-1 sm:p-1.5">
        <img
          src={product?.image}
          alt={product?.title || "Product"}
          loading="lazy"
          className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
        />
      </div>

      {/* Product content */}
      <div className="flex min-w-0 flex-1 flex-col pt-1.5">
        {/* Category */}
        <p className="mb-0.5 truncate text-[8px] leading-3 text-gray-400 sm:text-[9px]">
          {product?.category?.title || "Uncategorized"}
        </p>

        {/* Title */}
        <h3
          title={product?.title}
          className="min-h-[28px] overflow-hidden text-[10px] font-medium leading-[14px] text-gray-800 transition group-hover:text-green-600 sm:min-h-[30px] sm:text-[11px] sm:leading-[15px] lg:text-xs"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product?.title || "Untitled product"}
        </h3>

        {/* Rating */}
        <div className="mt-0.5 flex min-w-0 items-center gap-0.5">
          <div className="flex shrink-0 items-center gap-px">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`text-[7px] sm:text-[8px] ${
                  star <= Math.round(averageRating)
                    ? "text-yellow-400"
                    : "text-gray-200"
                }`}
              />
            ))}
          </div>

          <span className="truncate text-[8px] text-gray-400 sm:text-[9px]">
            ({reviewCount})
          </span>
        </div>

        {/* Vendor */}
        <p className="mt-0.5 truncate text-[8px] leading-3 text-gray-400 sm:text-[9px]">
          By{" "}
          <span className="text-green-600">
            {product?.vendor?.title || "Unknown seller"}
          </span>
        </p>

        {/* Price and cart button */}
        <div className="mt-auto pt-1.5">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-1 gap-y-0">
            <span className="truncate text-xs font-bold text-orange-500 sm:text-sm">
              ${formatPrice(product?.price)}
            </span>

            {product?.old_price && (
              <span className="truncate text-[8px] text-gray-400 line-through sm:text-[9px]">
                ${formatPrice(product.old_price)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="mt-1.5 inline-flex min-h-7 w-full items-center justify-center gap-1 rounded bg-green-50 px-1.5 py-1 text-[9px] font-semibold leading-4 text-green-600 transition hover:bg-green-500 hover:text-white active:scale-[0.99] sm:min-h-8 sm:text-[10px]"
          >
            <FaShoppingCart className="shrink-0 text-[9px]" />
            <span className="truncate">Add to cart</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default SingleProductCard;