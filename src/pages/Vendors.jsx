import React, { useEffect, useState, useMemo } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaStar, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PublicLayout from "../components/PublicLayout";
import vendorService from "../utils/vendorService";
import productService from "../utils/productService";

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("all");
  const [showCount, setShowCount] = useState(50);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const v = await vendorService.getAllVendors(sortBy);
        const p = await productService.getAllProducts();

        setVendors(v);
        setProducts(p);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sortBy]);

  // 🔥 FIX: vendor-wise product count map
  const productCountMap = useMemo(() => {
    const map = {};

    (products || []).forEach((p) => {
      const vid = p?.vendor?.id; // 🔥 FIX HERE

      if (vid) {
        map[vid] = (map[vid] || 0) + 1;
      }
    });

    return map;
  }, [products]);

  // FILTER + SORT + SHOW LIMIT
  const filteredVendors = useMemo(() => {
    return (vendors || [])
      .filter((v) => {
        const title = (v?.title || "").toLowerCase();
        const vid = (v?.vid || "").toLowerCase();
        const q = search.toLowerCase();

        return title.includes(q) || vid.includes(q);
      })
      .sort((a, b) => {
        if (sortBy === "name_asc") {
          return (a?.title || "").localeCompare(b?.title || "");
        }
        if (sortBy === "name_desc") {
          return (b?.title || "").localeCompare(a?.title || "");
        }
        return 0;
      })
      .slice(0, showCount);
  }, [vendors, search, sortBy, showCount]);

  return (
    <PublicLayout>
      <div className="px-4 md:px-6 2xl:px-12 py-3">
        {/* TITLE */}
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
          Vendor List
        </h1>

        {/* SEARCH */}
        <div className="mt-4 flex justify-center">
          <div className="flex items-center border border-gray-700 rounded-xl overflow-hidden w-full max-w-2xl">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by vendor name or ID..."
              className="w-full px-4 py-3 outline-none text-sm"
            />
            <button className="text-black px-5">
              <FaSearch />
            </button>
          </div>
        </div>

        {/* SHOW + SORT */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-4 text-center">
          <div className="text-gray-700 font-medium">
            We have{" "}
            <span className="text-green-500 font-bold">{vendors.length}</span>{" "}
            vendors
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <select
              value={showCount}
              onChange={(e) => setShowCount(Number(e.target.value))}
              className="bg-white border rounded-lg px-3 py-2 text-xs sm:text-sm shadow-sm hover:border-green-500 transition outline-none"
            >
              <option value={10}>Show: 10</option>
              <option value={20}>Show: 20</option>
              <option value={50}>Show: 50</option>
              <option value={100}>Show: 100</option>
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border rounded-lg px-3 py-2 text-xs sm:text-sm shadow-sm hover:border-green-500 transition outline-none">
              <option value="all">All Products</option>
              <option value="draft">Draft</option>
              <option value="in_review">In Review</option>
              <option value="published">Published</option>
              <option value="rejected">Rejected</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center py-20">
            <h2 className="text-green-500 font-semibold">Loading Vendors...</h2>
          </div>
        )}

        {/* EMPTY */}
        {!loading && filteredVendors.length === 0 && (
          <div className="text-center py-20 text-gray-600">
            No Vendors Found
          </div>
        )}

        {/* GRID */}
        {!loading && filteredVendors.length > 0 && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVendors.map((vendor) => {
              const vid = vendor.id || vendor.vid;

              return (
                <div
                  key={vid}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row"
                >
                  {/* LEFT IMAGE SECTION */}
                  <div className="sm:w-32 w-full p-3 shrink-0">
                    <div className="relative group">
                      <img
                        src={vendor.image}
                        alt={vendor.title}
                        className="w-full h-32 sm:h-28 object-cover rounded-xl group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-md shadow">
                        Verified
                      </div>
                    </div>

                    {/* PRODUCT COUNT */}
                    <div className="mt-3 flex items-center justify-center">
                      <div className="flex items-center gap-1 bg-green-50 border border-green-100 px-3 py-1 rounded-full">
                        <span className="text-sm text-gray-500">Products:</span>
                        <span className="text-sm font-bold text-green-600">
                          {productCountMap[vid] || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT CONTENT */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    {/* TITLE + RATING */}
                    <div className="flex justify-between items-start gap-2">
                      <h2 className="text-base font-semibold text-gray-800 line-clamp-1">
                        {vendor.title}
                      </h2>

                      <div className="flex items-center gap-1 text-yellow-400 text-sm shrink-0">
                        <FaStar />
                        <span className="text-gray-700 font-medium">4.8</span>
                      </div>
                    </div>

                    {/* DESCRIPTION */}
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                      {vendor.description}
                    </p>

                    {/* INFO */}
                    <div className="mt-3 space-y-2 text-xs text-gray-600">
                      <div className="flex items-start gap-2">
                        <FaMapMarkerAlt className="text-green-500 mt-0.5" />
                        <span className="line-clamp-1">
                          {vendor.address || "No Address Available"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FaPhoneAlt className="text-green-500" />
                        <span>{vendor.contact || "No Contact"}</span>
                      </div>
                    </div>

                    {/* BUTTON */}
                    <button
                      onClick={() =>
                        navigate(`/vendor-details/${vendor.vid || vendor.id}`)
                      }
                      className="mt-3 inline-flex items-center gap-1 bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white py-2 px-5 rounded-xl text-sm font-semibold shadow-sm transition-all duration-300"
                    >
                      Visit Store
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default Vendors;
