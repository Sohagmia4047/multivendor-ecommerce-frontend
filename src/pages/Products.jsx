import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExchangeAlt,
  FaFilter,
  FaHeart,
  FaSearch,
  FaShoppingCart,
  FaStar,
  FaTh,
  FaTimes,
} from "react-icons/fa";

import PublicLayout from "../components/PublicLayout";
import productService from "../utils/productService";
import categoryService from "../utils/categoryService";
import vendorService from "../utils/vendorService";
import tagService from "../utils/tagService";
import { useCart } from "../hooks/useCart";

const PAGE_SIZE = 20;

const readStoredArray = (key) => {
  try {
    const saved = localStorage.getItem(key);
    const parsed = saved ? JSON.parse(saved) : [];

    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch (error) {
    console.error(`Unable to read ${key}:`, error);
    return [];
  }
};

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

const Stars = ({ value = 0 }) => {
  const roundedRating = Math.round(Number(value) || 0);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`text-[9px] sm:text-[10px] ${
            star <= roundedRating ? "text-yellow-400" : "text-gray-200"
          }`}
        />
      ))}
    </div>
  );
};

const ProductSkeleton = () => {
  return (
    <div className="animate-pulse overflow-hidden rounded-lg border border-gray-100 bg-white p-2.5 sm:p-3">
      <div className="aspect-square rounded-md bg-gray-200" />
      <div className="mt-3 h-3 w-1/3 rounded bg-gray-200" />
      <div className="mt-2 h-4 w-full rounded bg-gray-200" />
      <div className="mt-2 h-4 w-4/5 rounded bg-gray-200" />
      <div className="mt-4 h-10 rounded bg-gray-200" />
    </div>
  );
};

const FilterSection = ({ title, children, noBorder = false }) => {
  return (
    <section className={noBorder ? "" : "border-t border-gray-100 pt-5"}>
      <h3 className="mb-3 text-sm font-semibold text-gray-900">{title}</h3>
      {children}
    </section>
  );
};

const Products = () => {
  const navigate = useNavigate();
  const { addToCartGlobal } = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [tags, setTags] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState(() =>
    readStoredArray("selectedCategories"),
  );
  const [selectedVendors, setSelectedVendors] = useState(() =>
    readStoredArray("selectedVendors"),
  );
  const [selectedPriceRanges, setSelectedPriceRanges] = useState(() =>
    readStoredArray("selectedPriceRanges"),
  );
  const [selectedTags, setSelectedTags] = useState(() =>
    readStoredArray("selectedTags"),
  );

  const [selectedPrice, setSelectedPrice] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [vendorLoading, setVendorLoading] = useState(true);
  const [tagLoading, setTagLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();

        if (!cancelled) {
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Product Fetch Error:", error);

        if (!cancelled) {
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();

        if (!cancelled) {
          setCategories(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Category Fetch Error:", error);

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

  useEffect(() => {
    let cancelled = false;

    const fetchVendors = async () => {
      try {
        const data = await vendorService.getAllVendors();

        if (!cancelled) {
          setVendors(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Vendor Fetch Error:", error);

        if (!cancelled) {
          setVendors([]);
        }
      } finally {
        if (!cancelled) {
          setVendorLoading(false);
        }
      }
    };

    fetchVendors();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchTags = async () => {
      try {
        const data = await tagService.getAllTags();

        if (!cancelled) {
          setTags(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Tag Fetch Error:", error);

        if (!cancelled) {
          setTags([]);
        }
      } finally {
        if (!cancelled) {
          setTagLoading(false);
        }
      }
    };

    fetchTags();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "selectedCategories",
      JSON.stringify(selectedCategories),
    );
  }, [selectedCategories]);

  useEffect(() => {
    localStorage.setItem("selectedVendors", JSON.stringify(selectedVendors));
  }, [selectedVendors]);

  useEffect(() => {
    localStorage.setItem(
      "selectedPriceRanges",
      JSON.stringify(selectedPriceRanges),
    );
  }, [selectedPriceRanges]);

  useEffect(() => {
    localStorage.setItem("selectedTags", JSON.stringify(selectedTags));
  }, [selectedTags]);

  useEffect(() => {
    document.body.style.overflow = showMobileFilters ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [showMobileFilters]);

  const { minPrice, maxPrice } = useMemo(() => {
    const prices = products
      .map((product) => Number(product?.price))
      .filter((price) => Number.isFinite(price));

    if (prices.length === 0) {
      return {
        minPrice: 0,
        maxPrice: 0,
      };
    }

    return {
      minPrice: Math.floor(Math.min(...prices)),
      maxPrice: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  useEffect(() => {
    setSelectedPrice(maxPrice);
  }, [maxPrice]);

  const priceRanges = useMemo(() => {
    if (maxPrice <= minPrice) {
      return maxPrice > 0 ? [[minPrice, maxPrice]] : [];
    }

    const rangeSize = Math.max(1, Math.ceil((maxPrice - minPrice) / 5));

    return Array.from({ length: 5 }, (_, index) => {
      const from = minPrice + rangeSize * index;
      const to =
        index === 4
          ? maxPrice
          : Math.min(maxPrice, minPrice + rangeSize * (index + 1));

      return [from, to];
    }).filter(([from, to]) => from <= to);
  }, [minPrice, maxPrice]);

  const toggleStringValue = (setter, value) => {
    const normalizedValue = String(value);

    setter((current) =>
      current.includes(normalizedValue)
        ? current.filter((item) => item !== normalizedValue)
        : [...current, normalizedValue],
    );
  };

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const price = Number(product?.price) || 0;
      const categoryId = String(product?.category?.cid ?? "");
      const vendorId = String(product?.vendor?.vid ?? "");
      const productStatus = String(product?.product_status ?? "");
      const productTagIds = Array.isArray(product?.tags)
        ? product.tags.map((tag) =>
            String(
              typeof tag === "object"
                ? tag?.id ?? tag?.slug ?? tag?.title ?? ""
                : tag,
            ),
          )
        : [];

      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(categoryId);

      const vendorMatch =
        selectedVendors.length === 0 || selectedVendors.includes(vendorId);

      const tagMatch =
        selectedTags.length === 0 ||
        selectedTags.some((tagId) => productTagIds.includes(tagId));

      const sliderMatch = maxPrice === 0 || price <= selectedPrice;

      const rangeMatch =
        selectedPriceRanges.length === 0 ||
        selectedPriceRanges.some((rangeIndex) => {
          const range = priceRanges[Number(rangeIndex)];

          if (!range) {
            return false;
          }

          const [from, to] = range;
          return price >= from && price <= to;
        });

      const statusMatch =
        statusFilter === "all" || productStatus === statusFilter;

      return (
        categoryMatch &&
        vendorMatch &&
        tagMatch &&
        sliderMatch &&
        rangeMatch &&
        statusMatch
      );
    });

    return [...filtered].sort((first, second) => {
      if (sortBy === "price-low") {
        return Number(first?.price || 0) - Number(second?.price || 0);
      }

      if (sortBy === "price-high") {
        return Number(second?.price || 0) - Number(first?.price || 0);
      }

      if (sortBy === "name-az") {
        return String(first?.title || "").localeCompare(
          String(second?.title || ""),
        );
      }

      if (sortBy === "name-za") {
        return String(second?.title || "").localeCompare(
          String(first?.title || ""),
        );
      }

      if (sortBy === "newest") {
        const firstDate = new Date(
          first?.created_at || first?.date || 0,
        ).getTime();
        const secondDate = new Date(
          second?.created_at || second?.date || 0,
        ).getTime();

        return secondDate - firstDate;
      }

      return 0;
    });
  }, [
    products,
    selectedCategories,
    selectedVendors,
    selectedTags,
    selectedPrice,
    selectedPriceRanges,
    priceRanges,
    statusFilter,
    sortBy,
    maxPrice,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategories,
    selectedVendors,
    selectedTags,
    selectedPrice,
    selectedPriceRanges,
    statusFilter,
    sortBy,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedProducts.length / PAGE_SIZE),
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const visibleProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAndSortedProducts.slice(start, start + PAGE_SIZE);
  }, [filteredAndSortedProducts, currentPage]);

  const activeFilterCount =
    selectedCategories.length +
    selectedVendors.length +
    selectedTags.length +
    selectedPriceRanges.length +
    (selectedPrice < maxPrice ? 1 : 0) +
    (statusFilter !== "all" ? 1 : 0);

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedVendors([]);
    setSelectedTags([]);
    setSelectedPriceRanges([]);
    setSelectedPrice(maxPrice);
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const FilterContent = ({ onClose }) => (
    <div className="h-full overflow-y-auto bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Filters</h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Refine your product results
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="grid h-9 w-9 place-items-center rounded-full text-gray-500 transition hover:bg-gray-100"
          >
            <FaTimes />
          </button>
        )}
      </div>

      <div className="space-y-5 p-4">
        <FilterSection title="Product status" noBorder>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          >
            <option value="all">All products</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="in_review">In review</option>
            <option value="rejected">Rejected</option>
            <option value="disabled">Disabled</option>
          </select>
        </FilterSection>

        <FilterSection title="Categories">
          {categoryLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-9 animate-pulse rounded-md bg-gray-200"
                />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <p className="text-sm text-gray-500">No categories found.</p>
          ) : (
            <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
              {categories.map((category) => {
                const categoryId = String(category?.cid ?? category?.id ?? "");
                const selected = selectedCategories.includes(categoryId);

                return (
                  <label
                    key={categoryId}
                    className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 transition ${
                      selected ? "bg-orange-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() =>
                        toggleStringValue(
                          setSelectedCategories,
                          categoryId,
                        )
                      }
                      className="h-4 w-4 shrink-0 accent-orange-500"
                    />

                    {category.image && (
                      <img
                        src={category.image}
                        alt={category.title}
                        className="h-7 w-7 shrink-0 rounded-md object-cover"
                      />
                    )}

                    <span className="min-w-0 flex-1 truncate text-sm text-gray-700">
                      {category.title}
                    </span>

                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
                      {category.products ?? 0}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </FilterSection>

        <FilterSection title="Sellers">
          {vendorLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-8 animate-pulse rounded-md bg-gray-200"
                />
              ))}
            </div>
          ) : vendors.length === 0 ? (
            <p className="text-sm text-gray-500">No sellers found.</p>
          ) : (
            <div className="max-h-52 space-y-1 overflow-y-auto pr-1">
              {vendors.map((vendor) => {
                const vendorId = String(vendor?.vid ?? vendor?.id ?? "");
                const selected = selectedVendors.includes(vendorId);

                return (
                  <label
                    key={vendorId}
                    className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 transition ${
                      selected ? "bg-orange-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() =>
                        toggleStringValue(setSelectedVendors, vendorId)
                      }
                      className="h-4 w-4 shrink-0 accent-orange-500"
                    />

                    <span className="min-w-0 flex-1 truncate text-sm text-gray-700">
                      {vendor.title || vendor.name || vendor.store_name}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </FilterSection>

        <FilterSection title="Tags">
          {tagLoading ? (
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-8 w-20 animate-pulse rounded-full bg-gray-200"
                />
              ))}
            </div>
          ) : tags.length === 0 ? (
            <p className="text-sm text-gray-500">No tags found.</p>
          ) : (
            <div className="flex max-h-44 flex-wrap gap-2 overflow-y-auto">
              {tags.map((tag) => {
                const tagId = String(
                  tag?.id ?? tag?.slug ?? tag?.title ?? tag?.name ?? "",
                );
                const selected = selectedTags.includes(tagId);

                return (
                  <button
                    key={tagId}
                    type="button"
                    onClick={() =>
                      toggleStringValue(setSelectedTags, tagId)
                    }
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      selected
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-gray-200 bg-gray-50 text-gray-600 hover:border-orange-300 hover:text-orange-600"
                    }`}
                  >
                    {tag.name || tag.title}
                  </button>
                );
              })}
            </div>
          )}
        </FilterSection>

        <FilterSection title="Price">
          <div>
            <input
              type="range"
              min={minPrice}
              max={Math.max(maxPrice, minPrice)}
              value={selectedPrice}
              disabled={maxPrice <= minPrice}
              onChange={(event) =>
                setSelectedPrice(Number(event.target.value))
              }
              className="h-1.5 w-full cursor-pointer accent-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <div className="mt-2 flex items-center justify-between gap-2 text-xs">
              <span className="text-gray-400">
                ${formatPrice(minPrice)}
              </span>
              <span className="rounded bg-orange-50 px-2 py-1 font-semibold text-orange-600">
                Up to ${formatPrice(selectedPrice)}
              </span>
              <span className="text-gray-400">
                ${formatPrice(maxPrice)}
              </span>
            </div>
          </div>

          {priceRanges.length > 0 && (
            <div className="mt-4 space-y-1.5">
              {priceRanges.map(([from, to], index) => {
                const rangeId = String(index);
                const selected = selectedPriceRanges.includes(rangeId);

                return (
                  <label
                    key={`${from}-${to}`}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() =>
                        toggleStringValue(
                          setSelectedPriceRanges,
                          rangeId,
                        )
                      }
                      className="h-4 w-4 accent-orange-500"
                    />

                    <span>
                      ${formatPrice(from)} – ${formatPrice(to)}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </FilterSection>

        <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-5">
          <button
            type="button"
            onClick={clearFilters}
            disabled={activeFilterCount === 0}
            className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 transition hover:border-red-400 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Clear
          </button>

          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-md bg-orange-500 px-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  );

  const renderPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    return pages;
  };

  return (
    <PublicLayout>
      <main className="min-h-screen overflow-x-hidden bg-[#f5f5f5] text-gray-700">
        <div className="mx-auto w-full max-w-[1600px] px-2.5 py-4 sm:px-4 md:px-6 lg:py-6 2xl:px-8">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl lg:text-3xl">
              All products
            </h1>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Browse products and refine results using filters.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="hidden xl:block">
              <div className="sticky top-20 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
                <FilterContent />
              </div>
            </aside>

            <div className="min-w-0">
              <div className="mb-4 rounded-lg border border-gray-100 bg-white px-3 py-3 shadow-sm sm:px-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowMobileFilters(true)}
                      className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 transition hover:border-orange-500 hover:text-orange-500 xl:hidden"
                    >
                      <FaFilter />
                      Filters
                      {activeFilterCount > 0 && (
                        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                          {activeFilterCount}
                        </span>
                      )}
                    </button>

                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold text-orange-500">
                          {filteredAndSortedProducts.length}
                        </span>{" "}
                        product
                        {filteredAndSortedProducts.length === 1 ? "" : "s"} found
                      </p>
                    </div>

                    {activeFilterCount > 0 && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="text-xs font-medium text-red-500 hover:text-red-600"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex">
                    <div className="inline-flex h-10 items-center gap-2 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-600">
                      <FaTh className="text-gray-400" />
                      <span>{PAGE_SIZE} per page</span>
                    </div>

                    <select
                      value={sortBy}
                      onChange={(event) => setSortBy(event.target.value)}
                      className="h-10 min-w-0 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500 sm:min-w-[190px]"
                    >
                      <option value="default">Default sorting</option>
                      <option value="newest">Newest first</option>
                      <option value="price-low">Price: low to high</option>
                      <option value="price-high">Price: high to low</option>
                      <option value="name-az">Name: A to Z</option>
                      <option value="name-za">Name: Z to A</option>
                    </select>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:gap-3 lg:grid-cols-4 2xl:grid-cols-5">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <ProductSkeleton key={index} />
                  ))}
                </div>
              ) : visibleProducts.length === 0 ? (
                <div className="rounded-lg border border-gray-100 bg-white px-4 py-16 text-center shadow-sm">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-orange-50 text-2xl text-orange-500">
                    <FaSearch />
                  </div>

                  <h2 className="mt-5 text-lg font-semibold text-gray-900 sm:text-xl">
                    No products found
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                    Try changing or clearing some filters.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 rounded-md bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:gap-3 lg:grid-cols-4 2xl:grid-cols-5">
                  {visibleProducts.map((product) => {
                    const reviews = Array.isArray(product?.reviews)
                      ? product.reviews
                      : [];
                    const averageRating =
                      reviews.length > 0
                        ? reviews.reduce(
                            (sum, review) =>
                              sum + Number(review?.rating || 0),
                            0,
                          ) / reviews.length
                        : 0;

                    return (
                      <article
                        key={product.id}
                        onClick={() =>
                          navigate(`/product-detail/${product.id}`)
                        }
                        className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-100 bg-white p-2.5 transition duration-200 hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-lg sm:p-3"
                      >
                        {Number(product?.discount) > 0 && (
                          <span className="absolute left-2 top-2 z-20 rounded bg-orange-500 px-1.5 py-1 text-[10px] font-semibold text-white sm:left-3 sm:top-3 sm:px-2 sm:text-xs">
                            -{product.discount}%
                          </span>
                        )}

                        <button
                          type="button"
                          aria-label="Add to wishlist"
                          onClick={(event) => event.stopPropagation()}
                          className="absolute right-2 top-2 z-20 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-gray-500 shadow-sm transition hover:bg-orange-500 hover:text-white sm:right-3 sm:top-3"
                        >
                          <FaHeart className="text-sm" />
                        </button>

                        <div className="pointer-events-none absolute right-3 top-12 z-20 hidden flex-col gap-2 opacity-0 transition duration-200 group-hover:opacity-100 md:flex">
                          <button
                            type="button"
                            aria-label="Compare product"
                            onClick={(event) => event.stopPropagation()}
                            className="pointer-events-auto grid h-8 w-8 place-items-center rounded-full bg-white text-gray-500 shadow transition hover:bg-orange-500 hover:text-white"
                          >
                            <FaExchangeAlt className="text-xs" />
                          </button>

                          <button
                            type="button"
                            aria-label="Quick view"
                            onClick={(event) => event.stopPropagation()}
                            className="pointer-events-auto grid h-8 w-8 place-items-center rounded-full bg-white text-gray-500 shadow transition hover:bg-orange-500 hover:text-white"
                          >
                            <FaSearch className="text-xs" />
                          </button>
                        </div>

                        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-md bg-white p-2 sm:p-3">
                          <img
                            src={product?.image}
                            alt={product?.title || "Product"}
                            loading="lazy"
                            className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                          />
                        </div>

                        <div className="flex flex-1 flex-col pt-2.5">
                          <p className="mb-1 truncate text-[10px] text-gray-400 sm:text-xs">
                            {product?.category?.title || "Uncategorized"}
                          </p>

                          <h2
                            title={product?.title}
                            className="min-h-[34px] overflow-hidden text-xs font-medium leading-[17px] text-gray-800 transition group-hover:text-orange-600 sm:min-h-[40px] sm:text-sm sm:leading-5"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {product?.title || "Untitled product"}
                          </h2>

                          <div className="mt-1.5 flex items-center gap-1">
                            <Stars value={averageRating} />
                            <span className="text-[10px] text-gray-400">
                              ({reviews.length})
                            </span>
                          </div>

                          <p className="mt-1.5 truncate text-[10px] text-gray-400 sm:text-xs">
                            By{" "}
                            <span className="text-orange-600">
                              {product?.vendor?.title || "Unknown seller"}
                            </span>
                          </p>

                          <div className="mt-auto pt-2.5">
                            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                              <span className="text-base font-bold text-orange-500 sm:text-lg">
                                ${formatPrice(product?.price)}
                              </span>

                              {product?.old_price && (
                                <span className="text-[10px] text-gray-400 line-through sm:text-xs">
                                  ${formatPrice(product.old_price)}
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                addToCartGlobal(product.id, 1);
                              }}
                              className="mt-2.5 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-orange-50 px-2 py-2 text-[11px] font-semibold text-orange-600 transition hover:bg-orange-500 hover:text-white active:scale-[0.99] sm:text-xs"
                            >
                              <FaShoppingCart />
                              Add to cart
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              {!loading && filteredAndSortedProducts.length > PAGE_SIZE && (
                <nav
                  aria-label="Product pagination"
                  className="mt-8 flex flex-wrap items-center justify-center gap-2"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className="grid h-10 w-10 place-items-center rounded-md border border-gray-300 bg-white text-gray-600 transition hover:border-orange-500 hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FaChevronLeft className="text-xs" />
                  </button>

                  {currentPage > 3 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setCurrentPage(1)}
                        className="grid h-10 min-w-10 place-items-center rounded-md border border-gray-300 bg-white px-2 text-sm text-gray-600 transition hover:border-orange-500 hover:text-orange-500"
                      >
                        1
                      </button>

                      {currentPage > 4 && (
                        <span className="px-1 text-gray-400">…</span>
                      )}
                    </>
                  )}

                  {renderPageNumbers().map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      aria-current={currentPage === page ? "page" : undefined}
                      className={`grid h-10 min-w-10 place-items-center rounded-md border px-2 text-sm font-medium transition ${
                        currentPage === page
                          ? "border-orange-500 bg-orange-500 text-white"
                          : "border-gray-300 bg-white text-gray-600 hover:border-orange-500 hover:text-orange-500"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <span className="px-1 text-gray-400">…</span>
                      )}

                      <button
                        type="button"
                        onClick={() => setCurrentPage(totalPages)}
                        className="grid h-10 min-w-10 place-items-center rounded-md border border-gray-300 bg-white px-2 text-sm text-gray-600 transition hover:border-orange-500 hover:text-orange-500"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(totalPages, page + 1),
                      )
                    }
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    className="grid h-10 w-10 place-items-center rounded-md border border-gray-300 bg-white text-gray-600 transition hover:border-orange-500 hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FaChevronRight className="text-xs" />
                  </button>
                </nav>
              )}
            </div>
          </div>
        </div>

        {showMobileFilters && (
          <div className="fixed inset-0 z-[100] xl:hidden">
            <button
              type="button"
              aria-label="Close filter overlay"
              onClick={() => setShowMobileFilters(false)}
              className="absolute inset-0 bg-black/45"
            />

            <div className="absolute bottom-0 left-0 top-0 w-[90%] max-w-sm shadow-2xl">
              <FilterContent
                onClose={() => setShowMobileFilters(false)}
              />
            </div>
          </div>
        )}
      </main>
    </PublicLayout>
  );
};

export default Products;
