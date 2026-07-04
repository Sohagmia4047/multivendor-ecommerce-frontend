import React, { useEffect, useState, useRef } from "react";
import { FaHeart, FaExchangeAlt, FaSearch, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";

const SingleProductCard = ({ product }) => {
  const navigate = useNavigate();

  // per product rating (safe fallback)
  const reviews = product?.reviews || [];
  const { addToCartGlobal } = useCart();

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  const ProductTitle = ({ title }) => {
    const titleRef = useRef(null);
    const [isTruncated, setIsTruncated] = useState(false);

    useEffect(() => {
      if (titleRef.current) {
        setIsTruncated(
          titleRef.current.scrollWidth > titleRef.current.clientWidth,
        );
      }
    }, [title]);

    return (
      <div className="relative group">
        <h2
          ref={titleRef}
          className="font-semibold text-sm leading-4 mb-2 truncate hover:text-green-500 transition cursor-pointer w-full"
        >
          {title}
        </h2>

        {isTruncated && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full py-1 -mb-10 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 w-full">
            <div className="bg-gray-900 text-white text-sm rounded-lg px-2 py-1 shadow-xl w-full max-w-full wrap-break-words">
              {title}
            </div>

            <div className="w-2 h-2 bg-gray-900 rotate-45 mx-auto -mt-1"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      onClick={() => navigate(`/product-detail/${product.id}`)}
      className="border rounded-3xl p-2 hover:shadow-xl transition duration-300 group relative bg-white h-fit cursor-pointer"
    >
      {/* Discount */}
      {product.discount > 0 && (
        <span className="absolute top-3 left-3 bg-red-400 text-white z-10 text-xs px-3 py-1 rounded-full">
          -{product.discount}%
        </span>
      )}

      {/* Action buttons */}
      <div className="absolute top-30 right-10 flex gap-2 opacity-0 group-hover:opacity-100 transition z-20">
        <button className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-green-500 hover:text-white">
          <FaHeart />
        </button>

        <button className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-green-500 hover:text-white">
          <FaExchangeAlt />
        </button>

        <button className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-green-500 hover:text-white">
          <FaSearch />
        </button>
      </div>

      {/* Image */}
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
      <ProductTitle title={product.title} />

      {/* Rating */}
      <div className="flex items-center gap-1 text-xs mb-1">
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

        <span className="text-gray-500 text-[11px] ml-1">({avgRating})</span>
      </div>

      {/* Vendor */}
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
  );
};

export default SingleProductCard;
