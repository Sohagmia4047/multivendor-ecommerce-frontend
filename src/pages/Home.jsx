import React, { useEffect, useMemo, useState } from "react";
import { FaFilter, FaTimes } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import SingleProductCard from "./SingleProductCart";
import background from "../assets/background.jpg";
import PublicLayout from "../components/PublicLayout";
import productService from "../utils/productService";
import categoryService from "../utils/categoryService";

const getSavedCategories = () => {
  try {
    const saved = localStorage.getItem("selectedCategories");
    const parsed = saved ? JSON.parse(saved) : [];

    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch (error) {
    console.error("Unable to read selected categories:", error);
    return [];
  }
};

const FilterPanel = ({ onClose }) => {
  return (
    <aside className="h-full overflow-y-auto bg-white">
      <div className="flex items-center justify-between border-b px-4 py-4">
        <h2 className="text-base font-semibold text-gray-900">Filters</h2>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="grid h-9 w-9 place-items-center rounded-full text-gray-600 transition hover:bg-gray-100"
          >
            <FaTimes />
          </button>
        )}
      </div>

      <div className="space-y-6 p-4">
        <section>
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            Price range
          </h3>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-2/3 rounded-full bg-green-500" />
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-gray-500">
            <span className="rounded border bg-gray-50 px-2 py-1.5">
              From: $500
            </span>
            <span className="rounded border bg-gray-50 px-2 py-1.5">
              To: $1,000
            </span>
          </div>
        </section>

        <section className="border-t pt-5">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Color</h3>

          <div className="space-y-3">
            {["Red (56)", "Green (78)", "Blue (54)"].map((item) => (
              <label
                key={item}
                className="flex cursor-pointer items-center gap-3 text-sm text-gray-600"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 accent-green-500"
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="border-t pt-5">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">
            Item condition
          </h3>

          <div className="space-y-3">
            {["New (1506)", "Refurbished (27)", "Used (45)"].map((item) => (
              <label
                key={item}
                className="flex cursor-pointer items-center gap-3 text-sm text-gray-600"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 accent-green-500"
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </section>

        <button
          type="button"
          className="w-full rounded-lg bg-green-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-600 active:scale-[0.99]"
        >
          Apply filters
        </button>

        <img
          src="https://cdn-icons-png.flaticon.com/512/2909/2909763.png"
          alt=""
          aria-hidden="true"
          className="mx-auto w-20 opacity-60"
        />
      </div>
    </aside>
  );
};

const ProductSkeleton = () => {
  return (
    <div className="animate-pulse overflow-hidden rounded-lg border border-gray-100 bg-white p-2.5">
      <div className="aspect-square rounded-md bg-gray-200" />
      <div className="mt-3 h-3 w-1/3 rounded bg-gray-200" />
      <div className="mt-2 h-4 w-full rounded bg-gray-200" />
      <div className="mt-2 h-4 w-4/5 rounded bg-gray-200" />
      <div className="mt-4 h-9 rounded bg-gray-200" />
    </div>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] =
    useState(getSavedCategories);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.trim() || "";

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();

        if (isMounted) {
          setCategories(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Category Fetch Error:", error);
      } finally {
        if (isMounted) {
          setCategoryLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();

        if (isMounted) {
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Product Fetch Error:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "selectedCategories",
      JSON.stringify(selectedCategories),
    );
  }, [selectedCategories]);

  useEffect(() => {
    document.body.style.overflow = showMobileFilters ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [showMobileFilters]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return products.filter((product) => {
      const title = product?.title?.toLowerCase() || "";
      const categoryTitle = product?.category?.title?.toLowerCase() || "";
      const vendorTitle = product?.vendor?.title?.toLowerCase() || "";
      const productCategoryId = String(product?.category?.cid ?? "");

      const searchMatch =
        !query ||
        title.includes(query) ||
        categoryTitle.includes(query) ||
        vendorTitle.includes(query);

      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(productCategoryId);

      return searchMatch && categoryMatch;
    });
  }, [products, searchQuery, selectedCategories]);

  return (
    <PublicLayout>
      <main className="min-h-screen overflow-x-hidden bg-[#f5f5f5] text-gray-700">
        <div className="mx-auto w-full max-w-[1600px] px-2.5 py-3 sm:px-4 md:px-6 lg:py-5 2xl:px-8">
          {/* Mobile and tablet categories */}
          <div className="mb-3 xl:hidden">
            <CategoryCard
              variant="horizontal"
              categories={categories}
              categoryLoading={categoryLoading}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              navigate={navigate}
            />
          </div>

          {/* Hero */}
          <section className="grid grid-cols-1 gap-3 xl:grid-cols-[260px_minmax(0,1fr)]">
            <div className="hidden xl:block">
              <CategoryCard
                categories={categories}
                categoryLoading={categoryLoading}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                navigate={navigate}
              />
            </div>

            <div className="relative min-h-[220px] overflow-hidden rounded-xl bg-gray-200 sm:min-h-[280px] lg:min-h-[360px] xl:min-h-[390px]">
              <img
                src={background}
                alt="Fresh grocery collection"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/10 to-transparent" />

              <div className="relative z-10 flex min-h-[220px] items-end p-4 sm:min-h-[280px] sm:p-6 lg:min-h-[360px] lg:p-9 xl:min-h-[390px]">
                <div className="w-full max-w-xl">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 sm:text-sm">
                    Fresh deals every day
                  </p>

                  <h1 className="max-w-lg text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-5xl">
                    Quality products at prices you will love
                  </h1>

                  <div className="mt-5 flex w-full max-w-md overflow-hidden rounded-lg bg-white shadow-lg">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      aria-label="Email address"
                      className="min-w-0 flex-1 px-3 py-3 text-sm text-gray-800 outline-none sm:px-4"
                    />

                    <button
                      type="button"
                      className="shrink-0 bg-green-500 px-4 text-xs font-semibold text-white transition hover:bg-green-600 sm:px-6 sm:text-sm"
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Products */}
          <section className="mt-4 lg:mt-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white px-3 py-3 shadow-sm sm:px-4">
              <div>
                <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                  {searchQuery ? `Results for “${searchQuery}”` : "Featured products"}
                </h2>
                <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                  {loading
                    ? "Loading products..."
                    : `${filteredProducts.length} product${
                        filteredProducts.length === 1 ? "" : "s"
                      } found`}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowMobileFilters(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-green-500 hover:text-green-600 xl:hidden"
              >
                <FaFilter />
                Filter
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[230px_minmax(0,1fr)]">
              <div className="hidden h-fit overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm xl:sticky xl:top-20 xl:block">
                <FilterPanel />
              </div>

              <div className="min-w-0">
                {loading ? (
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:gap-3 lg:grid-cols-4 2xl:grid-cols-5">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <ProductSkeleton key={index} />
                    ))}
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="rounded-lg bg-white px-4 py-16 text-center shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 sm:text-xl">
                      No product found
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Try another search or remove some category filters.
                    </p>

                    {selectedCategories.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedCategories([])}
                        className="mt-5 rounded-lg bg-green-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-600"
                      >
                        Clear category filters
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:gap-3 lg:grid-cols-4 2xl:grid-cols-5">
                    {filteredProducts.map((product) => (
                      <SingleProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Mobile filter drawer */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-[100] xl:hidden">
            <button
              type="button"
              aria-label="Close filter overlay"
              onClick={() => setShowMobileFilters(false)}
              className="absolute inset-0 bg-black/45"
            />

            <div className="absolute bottom-0 left-0 top-0 w-[88%] max-w-sm shadow-2xl">
              <FilterPanel onClose={() => setShowMobileFilters(false)} />
            </div>
          </div>
        )}
      </main>
    </PublicLayout>
  );
};

export default Home;
