import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PublicLayout from "../components/PublicLayout";
import tagService from "../utils/tagService";
import { useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaExchangeAlt,
  FaSearch,
} from "react-icons/fa";

const TagProducts = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTagProducts = async () => {
      try {
        const data = await tagService.getTagProducts(slug);
        setProducts(data.products || []);
        setTag(data.tag || "");
      } catch (error) {
        console.log("Tag Products Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTagProducts();
  }, [slug]);

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Products Tagged:
            <span className="text-green-500 ml-2">{tag}</span>
          </h1>

          <p className="text-gray-500 mt-2">
            Total Products: {products.length}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <h2 className="text-lg font-semibold text-gray-600">
              Loading Products...
            </h2>
          </div>
        )}

        {/* Products */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product-detail/${product.id}`)}
                className="border rounded-3xl p-2 hover:shadow-xl transition duration-300 group relative bg-white h-fit block"
              >
                {/* Discount Badge */}
                {product.discount > 0 && (
                  <span className="absolute top-3 left-3 bg-red-400 text-white z-10 text-xs px-3 py-1 rounded-full">
                    -{product.discount}%
                  </span>
                )}

                {/* Action Buttons */}
                <div className="absolute top-32 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition z-20">
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-green-500 hover:text-white transition"
                  >
                    <FaHeart />
                  </button>

                  <button
                    onClick={(e) => e.preventDefault()}
                    className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-green-500 hover:text-white transition"
                  >
                    <FaExchangeAlt />
                  </button>

                  <button
                    onClick={(e) => e.preventDefault()}
                    className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-green-500 hover:text-white transition"
                  >
                    <FaSearch />
                  </button>
                </div>

                {/* Product Image */}
                <div className="flex items-center justify-center h-44">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-36 object-contain group-hover:scale-105 transition duration-300"
                  />
                </div>

                {/* Category */}
                <p className="text-[11px] text-gray-400 mb-1">
                  {product.category?.title}
                </p>

                {/* Title */}
                <h2 className="font-semibold text-sm leading-5 mb-2 line-clamp-2 hover:text-green-500 transition min-h-10">
                  {product.title}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-1 text-yellow-400 text-xs mb-1">
                  ★★★★★
                  <span className="text-gray-400 text-[11px]">
                    ({product.reviews?.length || 0})
                  </span>
                </div>

                {/* Vendor */}
                <p className="text-[11px] text-gray-400 mb-1">
                  By {product.vendor?.title}
                </p>

                {/* Price */}
                <div className="flex items-center justify-between mt-3">
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
                    onClick={(e) => e.preventDefault()}
                    className="bg-green-100 hover:bg-green-500 hover:text-white transition px-3 py-2 rounded-lg text-xs font-medium text-green-600"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="bg-white border rounded-3xl p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-700">
              No Products Found
            </h3>

            <p className="text-gray-500 mt-2">
              No products available for this tag.
            </p>
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default TagProducts;