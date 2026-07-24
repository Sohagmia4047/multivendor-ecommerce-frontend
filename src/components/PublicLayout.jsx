import React, { useEffect, useRef, useState } from "react";
import {
  FaBars,
  FaChevronDown,
  FaExchangeAlt,
  FaHeart,
  FaPhoneAlt,
  FaSearch,
  FaShoppingCart,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import logo from "../assets/logo.jpg";
import { useCart } from "../hooks/useCart";
import categoryService from "../utils/categoryService";

const PublicLayout = ({ children }) => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [accountMenu, setAccountMenu] = useState(false);
  const [stickyHeader, setStickyHeader] = useState(false);
  const [mobileSections, setMobileSections] = useState({
    categories: false,
    home: false,
    vendors: false,
    megaMenu: false,
    account: false,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const accountRef = useRef(null);
  const { cartCount, setCartCount, toggleCart, clearCart } = useCart();

  const closeMobileMenu = () => {
    setMobileMenu(false);
    setMobileSections({
      categories: false,
      home: false,
      vendors: false,
      megaMenu: false,
      account: false,
    });
  };

  const toggleMobileSection = (section) => {
    setMobileSections((previousSections) => ({
      ...previousSections,
      [section]: !previousSections[section],
    }));
  };

  const goToPage = (path) => {
    closeMobileMenu();
    navigate(path);
  };

  const handleSearch = () => {
    const query = search.trim();

    if (query) {
      navigate(`/?search=${encodeURIComponent(query)}`);
    } else {
      navigate("/");
    }

    closeMobileMenu();
  };

  const handleLogout = () => {
    clearCart();
    localStorage.clear();
    setCartCount(0);
    setAccountMenu(false);
    closeMobileMenu();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Unable to load categories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const triggerPoint = window.innerHeight * 0.2;
      setStickyHeader(window.scrollY > triggerPoint);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    closeMobileMenu();
    setAccountMenu(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.body.style.overflow = mobileMenu ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenu]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        closeMobileMenu();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-white text-gray-700">
      {/* TOP HEADER */}
      <div className="hidden border-b xl:block">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-6 py-2 text-xs 2xl:px-12">
          <div className="flex items-center gap-5 whitespace-nowrap">
            <button
              type="button"
              className="cursor-pointer transition hover:text-green-500"
            >
              About Us
            </button>

            <button
              type="button"
              className="cursor-pointer transition hover:text-green-500"
            >
              My Account
            </button>

            <button
              type="button"
              className="cursor-pointer transition hover:text-green-500"
            >
              Wishlist
            </button>

            <NavLink
              to="/dashboard/orders/track-all"
              className="cursor-pointer transition hover:text-green-500"
            >
              Order Tracking
            </NavLink>
          </div>

          <p className="min-w-0 text-center text-gray-500">
            100% Secure delivery without contacting the courier
          </p>

          <div className="flex items-center gap-5 whitespace-nowrap">
            <p>
              Need help?{" "}
              <span className="font-bold text-green-500">+1800 900</span>
            </p>

            <button
              type="button"
              className="cursor-pointer hover:text-green-500"
            >
              English
            </button>

            <button
              type="button"
              className="cursor-pointer hover:text-green-500"
            >
              USD
            </button>
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-[1600px] px-4 py-3 sm:px-5 md:px-6 2xl:px-12">
          <div className="flex items-center justify-between gap-3">
            {/* LOGO */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex shrink-0 items-center"
              aria-label="Go to home page"
            >
              <img
                src={logo}
                alt="Nest logo"
                className="h-10 w-auto max-w-[150px] object-contain sm:h-12 md:h-14"
              />
            </button>

            {/* DESKTOP SEARCH */}
            <div className="mx-4 hidden max-w-2xl flex-1 overflow-hidden rounded-lg border border-green-500 lg:flex">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="Search for items..."
                className="min-w-0 flex-1 px-4 py-3 text-sm outline-none"
                aria-label="Search products"
              />

              <button
                type="button"
                onClick={handleSearch}
                className="shrink-0 bg-green-500 px-5 text-white transition hover:bg-green-600"
                aria-label="Submit search"
              >
                <FaSearch />
              </button>
            </div>

            {/* DESKTOP ACTIONS */}
            <div className="hidden items-center gap-4 xl:gap-6 lg:flex">
              <button
                type="button"
                className="relative flex cursor-pointer items-center gap-2"
              >
                <span className="relative">
                  <FaExchangeAlt className="text-lg xl:text-xl" />
                  <span className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[10px] text-white">
                    0
                  </span>
                </span>
                <span className="hidden text-sm xl:inline">Compare</span>
              </button>

              <button
                type="button"
                className="relative flex cursor-pointer items-center gap-2"
              >
                <span className="relative">
                  <FaHeart className="text-lg xl:text-xl" />
                  <span className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[10px] text-white">
                    0
                  </span>
                </span>
                <span className="hidden text-sm xl:inline">Wishlist</span>
              </button>

              <button
                type="button"
                onClick={toggleCart}
                className="relative flex cursor-pointer items-center gap-2"
              >
                <span className="relative">
                  <FaShoppingCart className="text-lg xl:text-xl" />
                  <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-500 px-1 text-[10px] text-white">
                    {cartCount}
                  </span>
                </span>
                <span className="hidden text-sm xl:inline">Cart</span>
              </button>

              <div className="relative z-[70]" ref={accountRef}>
                <button
                  type="button"
                  className="flex cursor-pointer items-center gap-2"
                  onClick={() => setAccountMenu((previous) => !previous)}
                  aria-expanded={accountMenu}
                  aria-label="Open account menu"
                >
                  <FaUser className="text-lg xl:text-xl" />
                  <span className="hidden text-sm xl:inline">Account</span>
                </button>

                {accountMenu && (
                  <div className="absolute right-0 top-10 z-[80] w-48 rounded-xl border bg-white p-2 shadow-xl">
                    <ul className="text-sm">
                      <li>
                        <button
                          type="button"
                          onClick={() => navigate("/dashboard/orders/")}
                          className="w-full border-b border-gray-200 px-3 py-2 text-left transition hover:bg-green-50 hover:text-green-600"
                        >
                          My Order
                        </button>
                      </li>

                      <li>
                        <button
                          type="button"
                          onClick={() =>
                            navigate("/dashboard/orders/track-all")
                          }
                          className="w-full border-b border-gray-200 px-3 py-2 text-left transition hover:bg-green-50 hover:text-green-600"
                        >
                          Order Tracking
                        </button>
                      </li>

                      <li>
                        <button
                          type="button"
                          className="w-full border-b border-gray-200 px-3 py-2 text-left transition hover:bg-green-50 hover:text-green-600"
                        >
                          My Voucher
                        </button>
                      </li>

                      <li>
                        <button
                          type="button"
                          className="w-full border-b border-gray-200 px-3 py-2 text-left transition hover:bg-green-50 hover:text-green-600"
                        >
                          My Wishlist
                        </button>
                      </li>

                      <li>
                        <button
                          type="button"
                          className="w-full border-b border-gray-200 px-3 py-2 text-left transition hover:bg-green-50 hover:text-green-600"
                        >
                          Settings
                        </button>
                      </li>

                      <li>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full px-3 py-2 text-left transition hover:bg-red-50 hover:text-red-500"
                        >
                          Sign Out
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* MOBILE/TABLET ACTIONS */}
            <div className="flex items-center gap-4 lg:hidden">
              <button
                type="button"
                onClick={toggleCart}
                className="relative p-1"
                aria-label="Open cart"
              >
                <FaShoppingCart className="text-xl" />
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-500 px-1 text-[10px] text-white">
                  {cartCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMobileMenu(true)}
                className="rounded-lg border p-2 text-xl transition hover:border-green-500 hover:text-green-500"
                aria-label="Open navigation menu"
                aria-expanded={mobileMenu}
              >
                <FaBars />
              </button>
            </div>
          </div>

          {/* MOBILE/TABLET SEARCH */}
          <div className="pt-3 lg:hidden">
            <div className="flex overflow-hidden rounded-xl border-2 border-green-500">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="Search products..."
                className="min-w-0 flex-1 px-4 py-3 text-sm outline-none"
                aria-label="Search products"
              />

              <button
                type="button"
                onClick={handleSearch}
                className="shrink-0 bg-green-500 px-5 text-white"
                aria-label="Submit search"
              >
                <FaSearch />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* DESKTOP NAVBAR */}
      <div
        className={`z-[60] hidden border-b bg-white transition-shadow duration-300 lg:block ${
          stickyHeader ? "fixed left-0 top-0 w-full shadow-lg" : "relative"
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-5 px-6 2xl:px-12">
          <nav className="flex min-w-0 items-center gap-5 text-[14px] font-medium xl:gap-7 xl:text-[15px]">
            {/* CATEGORY */}
            <div
              className="relative shrink-0 py-3"
              onMouseEnter={() => setShowCategory(true)}
              onMouseLeave={() => setShowCategory(false)}
            >
              <button
                type="button"
                onClick={() => setShowCategory((previous) => !previous)}
                className="flex items-center gap-3 rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600 xl:px-5"
                aria-expanded={showCategory}
              >
                <FaBars />
                <span>Browse All Categories</span>
              </button>

              {showCategory && (
                <div className="absolute left-0 top-full z-[80] mt-1 w-[280px] rounded-2xl border border-t-4 border-gray-200 border-t-green-500 bg-white p-5 shadow-2xl">
                  <ul className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <li key={category.id ?? category.cid ?? category.title}>
                          <button
                            type="button"
                            onClick={() => {
                              setShowCategory(false);
                              navigate(`/category/${category.cid}`);
                            }}
                            className="flex w-full items-center gap-1 text-left transition hover:text-green-500"
                          >
                            {category.title}
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-400">
                        No categories found
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            <button
              type="button"
              className="shrink-0 transition hover:text-green-500"
            >
              Deals
            </button>

            {/* HOME */}
            <div className="group relative shrink-0 py-5">
              <button
                type="button"
                className="flex items-center gap-2 transition hover:text-green-500"
              >
                Home <FaChevronDown size={12} />
              </button>

              <div className="invisible absolute left-0 top-full z-[70] w-64 translate-y-2 rounded-2xl border bg-white p-5 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <ul className="space-y-4">
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate("/")}
                      className="transition hover:text-green-500"
                    >
                      Home Default
                    </button>
                  </li>

                  <li>
                    <button
                      type="button"
                      className="transition hover:text-green-500"
                    >
                      Home Modern
                    </button>
                  </li>

                  <li>
                    <button
                      type="button"
                      className="transition hover:text-green-500"
                    >
                      Organic Store
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <button
              type="button"
              className="shrink-0 transition hover:text-green-500"
            >
              About
            </button>

            <button
              type="button"
              onClick={() => navigate("/product-page/")}
              className="shrink-0 py-5 transition hover:text-green-500"
            >
              Shop
            </button>

            {/* VENDORS */}
            <div className="group relative shrink-0 py-5">
              <button
                type="button"
                className="flex items-center gap-2 transition hover:text-green-500"
              >
                Vendors <FaChevronDown size={12} />
              </button>

              <div className="invisible absolute left-0 top-full z-[70] w-64 translate-y-2 rounded-2xl border bg-white p-5 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <ul className="space-y-3 text-sm">
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate("/vendors")}
                      className="transition hover:text-green-500"
                    >
                      Vendor List
                    </button>
                  </li>

                  <li>
                    <button
                      type="button"
                      onClick={() => navigate("/vendor-store")}
                      className="transition hover:text-green-500"
                    >
                      Vendor Store
                    </button>
                  </li>

                  <li>
                    <button
                      type="button"
                      onClick={() => navigate("/vendor-dashboard")}
                      className="transition hover:text-green-500"
                    >
                      Vendor Dashboard
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* MEGA MENU */}
            <div className="group relative shrink-0 py-5">
              <button
                type="button"
                className="flex items-center gap-2 transition hover:text-green-500"
              >
                Mega Menu <FaChevronDown size={12} />
              </button>

              <div className="invisible absolute left-1/2 top-full z-[75] -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <div className="w-[900px] max-w-[calc(100vw-3rem)] rounded-3xl border bg-white p-8 shadow-2xl">
                  <div className="grid grid-cols-4 gap-8">
                    <div>
                      <h2 className="mb-5 text-xl font-bold text-green-500">
                        Fruit &amp; Vegetables
                      </h2>

                      <ul className="space-y-3 text-sm text-gray-600">
                        <li>Meat &amp; Poultry</li>
                        <li>Fresh Vegetables</li>
                        <li>Herbs &amp; Seasonings</li>
                        <li>Cuts &amp; Sprouts</li>
                        <li>Exotic Fruits</li>
                        <li>Packaged Produce</li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="mb-5 text-xl font-bold text-green-500">
                        Breakfast &amp; Dairy
                      </h2>

                      <ul className="space-y-3 text-sm text-gray-600">
                        <li>Milk &amp; Flavoured Milk</li>
                        <li>Butter and Margarine</li>
                        <li>Eggs Substitutes</li>
                        <li>Marmalades</li>
                        <li>Sour Cream</li>
                        <li>Cheese</li>
                      </ul>
                    </div>

                    <div>
                      <h2 className="mb-5 text-xl font-bold text-green-500">
                        Meat &amp; Seafood
                      </h2>

                      <ul className="space-y-3 text-sm text-gray-600">
                        <li>Breakfast Sausage</li>
                        <li>Dinner Sausage</li>
                        <li>Chicken</li>
                        <li>Sliced Deli Meat</li>
                        <li>Wild Caught Fillets</li>
                        <li>Crab and Shellfish</li>
                      </ul>
                    </div>

                    <div className="relative min-h-[330px] overflow-hidden rounded-3xl bg-[#f7ece9] p-6">
                      <p className="mb-2 text-xs uppercase text-gray-500">
                        Hot Deals
                      </p>

                      <h2 className="text-3xl font-bold leading-tight">
                        Don&apos;t miss Trending
                      </h2>

                      <h3 className="mt-2 text-3xl font-bold text-green-500">
                        Save to 50%
                      </h3>

                      <button
                        type="button"
                        className="relative z-10 mt-5 rounded-full bg-green-500 px-6 py-3 text-white transition hover:bg-green-600"
                      >
                        Shop now
                      </button>

                      <div className="absolute right-5 top-5 flex h-20 w-20 flex-col items-center justify-center rounded-full bg-yellow-300 font-bold">
                        <span className="text-2xl">25%</span>
                        <span className="text-sm">off</span>
                      </div>

                      <img
                        src="https://i.imgur.com/TN2nC6v.png"
                        alt="Special grocery offer"
                        className="absolute bottom-0 right-0 w-44 max-w-[70%]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="shrink-0 transition hover:text-green-500"
            >
              Blog
            </button>

            <button
              type="button"
              className="shrink-0 transition hover:text-green-500"
            >
              Pages
            </button>

            <button
              type="button"
              className="shrink-0 transition hover:text-green-500"
            >
              Contact
            </button>
          </nav>

          {/* SUPPORT */}
          <div className="hidden shrink-0 items-center gap-3 2xl:flex">
            <FaPhoneAlt className="text-2xl text-green-500" />

            <div>
              <h2 className="text-xl font-bold text-green-500">1900 - 888</h2>
              <p className="text-sm text-gray-500">24/7 Support Center</p>
            </div>
          </div>
        </div>
      </div>

      {stickyHeader && <div className="hidden h-[65px] lg:block" />}

      {/* MOBILE/TABLET DRAWER */}
      {mobileMenu && (
        <div
          className="fixed inset-0 z-[100] bg-black/45 lg:hidden"
          onClick={closeMobileMenu}
          role="presentation"
        >
          <aside
            className="ml-auto h-full w-[88vw] max-w-[420px] overflow-y-auto bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-4">
              <button
                type="button"
                onClick={() => goToPage("/")}
                className="flex items-center"
                aria-label="Go to home page"
              >
                <img
                  src={logo}
                  alt="Nest logo"
                  className="h-10 w-auto max-w-[140px] object-contain"
                />
              </button>

              <button
                type="button"
                onClick={closeMobileMenu}
                className="rounded-lg border p-2 text-xl transition hover:border-red-400 hover:text-red-500"
                aria-label="Close navigation menu"
              >
                <FaTimes />
              </button>
            </div>

            <div className="px-4 py-5">
              <nav className="space-y-1 font-medium">
                {/* MOBILE CATEGORIES */}
                <div className="border-b">
                  <button
                    type="button"
                    onClick={() => toggleMobileSection("categories")}
                    className="flex w-full items-center justify-between py-3 text-left"
                    aria-expanded={mobileSections.categories}
                  >
                    <span className="flex items-center gap-3">
                      <FaBars className="text-green-500" />
                      Browse All Categories
                    </span>

                    <FaChevronDown
                      size={13}
                      className={`transition-transform ${
                        mobileSections.categories ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {mobileSections.categories && (
                    <div className="pb-3 pl-8">
                      <ul className="max-h-64 space-y-1 overflow-y-auto rounded-lg bg-gray-50 p-2 text-sm">
                        {categories.length > 0 ? (
                          categories.map((category) => (
                            <li
                              key={
                                category.id ?? category.cid ?? category.title
                              }
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  goToPage(`/category/${category.cid}`)
                                }
                                className="w-full rounded px-3 py-2 text-left transition hover:bg-green-100 hover:text-green-600"
                              >
                                {category.title}
                              </button>
                            </li>
                          ))
                        ) : (
                          <li className="px-3 py-2 text-gray-400">
                            No categories found
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="w-full border-b py-3 text-left transition hover:text-green-500"
                >
                  Deals
                </button>

                {/* MOBILE HOME */}
                <div className="border-b">
                  <button
                    type="button"
                    onClick={() => toggleMobileSection("home")}
                    className="flex w-full items-center justify-between py-3 text-left"
                    aria-expanded={mobileSections.home}
                  >
                    <span>Home</span>

                    <FaChevronDown
                      size={13}
                      className={`transition-transform ${
                        mobileSections.home ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {mobileSections.home && (
                    <ul className="space-y-1 pb-3 pl-4 text-sm text-gray-600">
                      <li>
                        <button
                          type="button"
                          onClick={() => goToPage("/")}
                          className="w-full rounded px-3 py-2 text-left transition hover:bg-green-50 hover:text-green-600"
                        >
                          Home Default
                        </button>
                      </li>

                      <li>
                        <button
                          type="button"
                          className="w-full rounded px-3 py-2 text-left transition hover:bg-green-50 hover:text-green-600"
                        >
                          Home Modern
                        </button>
                      </li>

                      <li>
                        <button
                          type="button"
                          className="w-full rounded px-3 py-2 text-left transition hover:bg-green-50 hover:text-green-600"
                        >
                          Organic Store
                        </button>
                      </li>
                    </ul>
                  )}
                </div>

                <button
                  type="button"
                  className="w-full border-b py-3 text-left transition hover:text-green-500"
                >
                  About
                </button>

                <button
                  type="button"
                  onClick={() => goToPage("/product-page/")}
                  className="w-full border-b py-3 text-left transition hover:text-green-500"
                >
                  Shop
                </button>

                {/* MOBILE VENDORS */}
                <div className="border-b">
                  <button
                    type="button"
                    onClick={() => toggleMobileSection("vendors")}
                    className="flex w-full items-center justify-between py-3 text-left"
                    aria-expanded={mobileSections.vendors}
                  >
                    <span>Vendors</span>

                    <FaChevronDown
                      size={13}
                      className={`transition-transform ${
                        mobileSections.vendors ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {mobileSections.vendors && (
                    <ul className="space-y-1 pb-3 pl-4 text-sm text-gray-600">
                      <li>
                        <button
                          type="button"
                          onClick={() => goToPage("/vendors")}
                          className="w-full rounded px-3 py-2 text-left transition hover:bg-green-50 hover:text-green-600"
                        >
                          Vendor List
                        </button>
                      </li>

                      <li>
                        <button
                          type="button"
                          onClick={() => goToPage("/vendor-store")}
                          className="w-full rounded px-3 py-2 text-left transition hover:bg-green-50 hover:text-green-600"
                        >
                          Vendor Store
                        </button>
                      </li>

                      <li>
                        <button
                          type="button"
                          onClick={() => goToPage("/vendor-dashboard")}
                          className="w-full rounded px-3 py-2 text-left transition hover:bg-green-50 hover:text-green-600"
                        >
                          Vendor Dashboard
                        </button>
                      </li>
                    </ul>
                  )}
                </div>

                {/* MOBILE MEGA MENU */}
                <div className="border-b">
                  <button
                    type="button"
                    onClick={() => toggleMobileSection("megaMenu")}
                    className="flex w-full items-center justify-between py-3 text-left"
                    aria-expanded={mobileSections.megaMenu}
                  >
                    <span>Mega Menu</span>

                    <FaChevronDown
                      size={13}
                      className={`transition-transform ${
                        mobileSections.megaMenu ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {mobileSections.megaMenu && (
                    <div className="space-y-5 pb-4 pl-2 text-sm">
                      <div className="rounded-xl bg-gray-50 p-4">
                        <h3 className="mb-3 font-bold text-green-500">
                          Fruit &amp; Vegetables
                        </h3>
                        <ul className="grid grid-cols-1 gap-2 text-gray-600 min-[380px]:grid-cols-2">
                          <li>Meat &amp; Poultry</li>
                          <li>Fresh Vegetables</li>
                          <li>Herbs &amp; Seasonings</li>
                          <li>Cuts &amp; Sprouts</li>
                          <li>Exotic Fruits</li>
                          <li>Packaged Produce</li>
                        </ul>
                      </div>

                      <div className="rounded-xl bg-gray-50 p-4">
                        <h3 className="mb-3 font-bold text-green-500">
                          Breakfast &amp; Dairy
                        </h3>
                        <ul className="grid grid-cols-1 gap-2 text-gray-600 min-[380px]:grid-cols-2">
                          <li>Milk &amp; Flavoured Milk</li>
                          <li>Butter and Margarine</li>
                          <li>Eggs Substitutes</li>
                          <li>Marmalades</li>
                          <li>Sour Cream</li>
                          <li>Cheese</li>
                        </ul>
                      </div>

                      <div className="rounded-xl bg-gray-50 p-4">
                        <h3 className="mb-3 font-bold text-green-500">
                          Meat &amp; Seafood
                        </h3>
                        <ul className="grid grid-cols-1 gap-2 text-gray-600 min-[380px]:grid-cols-2">
                          <li>Breakfast Sausage</li>
                          <li>Dinner Sausage</li>
                          <li>Chicken</li>
                          <li>Sliced Deli Meat</li>
                          <li>Wild Caught Fillets</li>
                          <li>Crab and Shellfish</li>
                        </ul>
                      </div>

                      <div className="rounded-xl bg-[#f7ece9] p-4">
                        <p className="text-xs uppercase text-gray-500">
                          Hot Deals
                        </p>
                        <h3 className="mt-1 text-lg font-bold">
                          Don&apos;t miss Trending
                        </h3>
                        <p className="mt-1 text-xl font-bold text-green-500">
                          Save to 50%
                        </p>
                        <button
                          type="button"
                          className="mt-3 rounded-full bg-green-500 px-5 py-2 text-white"
                        >
                          Shop now
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="w-full border-b py-3 text-left transition hover:text-green-500"
                >
                  Blog
                </button>

                <button
                  type="button"
                  className="w-full border-b py-3 text-left transition hover:text-green-500"
                >
                  Pages
                </button>

                <button
                  type="button"
                  className="w-full border-b py-3 text-left transition hover:text-green-500"
                >
                  Contact
                </button>
              </nav>

              {/* MOBILE QUICK ACTIONS */}
              <div className="mt-6">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                  Quick actions
                </h3>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-xs transition hover:border-green-500 hover:text-green-500"
                  >
                    <FaExchangeAlt className="text-lg" />
                    Compare
                  </button>

                  <button
                    type="button"
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-xs transition hover:border-green-500 hover:text-green-500"
                  >
                    <FaHeart className="text-lg" />
                    Wishlist
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      closeMobileMenu();
                      toggleCart();
                    }}
                    className="relative flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-xs transition hover:border-green-500 hover:text-green-500"
                  >
                    <span className="relative">
                      <FaShoppingCart className="text-lg" />
                      <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-500 px-1 text-[10px] text-white">
                        {cartCount}
                      </span>
                    </span>
                    Cart
                  </button>
                </div>
              </div>

              {/* MOBILE ACCOUNT */}
              <div className="mt-5 rounded-xl border">
                <button
                  type="button"
                  onClick={() => toggleMobileSection("account")}
                  className="flex w-full items-center justify-between px-4 py-3 text-left font-medium"
                  aria-expanded={mobileSections.account}
                >
                  <span className="flex items-center gap-3">
                    <FaUser className="text-green-500" />
                    My Account
                  </span>

                  <FaChevronDown
                    size={13}
                    className={`transition-transform ${
                      mobileSections.account ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {mobileSections.account && (
                  <ul className="border-t p-2 text-sm">
                    <li>
                      <button
                        type="button"
                        onClick={() => goToPage("/dashboard/orders/")}
                        className="w-full rounded px-3 py-2 text-left transition hover:bg-green-50 hover:text-green-600"
                      >
                        My Order
                      </button>
                    </li>

                    <li>
                      <button
                        type="button"
                        onClick={() =>
                          goToPage("/dashboard/orders/track-all")
                        }
                        className="w-full rounded px-3 py-2 text-left transition hover:bg-green-50 hover:text-green-600"
                      >
                        Order Tracking
                      </button>
                    </li>

                    <li>
                      <button
                        type="button"
                        className="w-full rounded px-3 py-2 text-left transition hover:bg-green-50 hover:text-green-600"
                      >
                        My Voucher
                      </button>
                    </li>

                    <li>
                      <button
                        type="button"
                        className="w-full rounded px-3 py-2 text-left transition hover:bg-green-50 hover:text-green-600"
                      >
                        My Wishlist
                      </button>
                    </li>

                    <li>
                      <button
                        type="button"
                        className="w-full rounded px-3 py-2 text-left transition hover:bg-green-50 hover:text-green-600"
                      >
                        Settings
                      </button>
                    </li>

                    <li>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full rounded px-3 py-2 text-left transition hover:bg-red-50 hover:text-red-500"
                      >
                        Sign Out
                      </button>
                    </li>
                  </ul>
                )}
              </div>

              {/* MOBILE SUPPORT/UTILITY */}
              <div className="mt-6 rounded-xl bg-green-50 p-4">
                <div className="flex items-center gap-3">
                  <FaPhoneAlt className="text-2xl text-green-500" />
                  <div>
                    <h3 className="font-bold text-green-600">1900 - 888</h3>
                    <p className="text-xs text-gray-500">24/7 Support Center</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    className="rounded-full bg-white px-3 py-2"
                  >
                    English
                  </button>
                  <button
                    type="button"
                    className="rounded-full bg-white px-3 py-2"
                  >
                    USD
                  </button>
                  <button
                    type="button"
                    onClick={() => goToPage("/dashboard/orders/track-all")}
                    className="rounded-full bg-white px-3 py-2"
                  >
                    Track Order
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      <main className="min-w-0">{children}</main>

      {/* FOOTER */}
      <footer className="mt-10 border-t">
        <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-5 md:px-6 md:py-12 2xl:px-12">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
            {/* COMPANY INFO */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500 text-2xl font-bold text-white">
                  N
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-green-500">Nest</h1>
                  <p className="text-[10px] tracking-[3px]">MART &amp; GROCERY</p>
                </div>
              </div>

              <p className="leading-7 text-gray-600">
                Awesome grocery store website template
              </p>

              <div className="mt-6 space-y-3 break-words text-sm text-gray-600">
                <p>
                  <span className="font-semibold">Address:</span> 5171 W Campbell
                  Ave Kent, Utah
                </p>

                <p>
                  <span className="font-semibold">Call:</span>{" "}
                  (+91)-540-025-124553
                </p>

                <p>
                  <span className="font-semibold">Email:</span> sale@Nest.com
                </p>

                <p>
                  <span className="font-semibold">Hours:</span> 10:00 - 18:00
                </p>
              </div>

              <div className="mt-8">
                <h2 className="mb-4 text-xl font-bold">Install App</h2>

                <div className="flex flex-wrap gap-3">
                  <img
                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                    alt="Download on the App Store"
                    className="h-auto w-32 max-w-full"
                  />

                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Get it on Google Play"
                    className="h-auto w-32 max-w-full"
                  />
                </div>

                <div className="mt-8">
                  <h3 className="mb-4 font-bold">Secured Payment Gateways</h3>

                  <div className="flex flex-wrap gap-3">
                    {[
                      "https://cdn-icons-png.flaticon.com/512/196/196578.png",
                      "https://cdn-icons-png.flaticon.com/512/196/196561.png",
                      "https://cdn-icons-png.flaticon.com/512/349/349221.png",
                      "https://cdn-icons-png.flaticon.com/512/825/825454.png",
                    ].map((image, index) => (
                      <img
                        key={image}
                        src={image}
                        alt={`Payment method ${index + 1}`}
                        className="h-auto w-12"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {[
              {
                title: "Company",
                items: [
                  "About Us",
                  "Delivery Information",
                  "Privacy Policy",
                  "Terms & Conditions",
                  "Contact Us",
                  "Support Center",
                  "Careers",
                ],
              },
              {
                title: "Account",
                items: [
                  "Sign In",
                  "View Cart",
                  "My Wishlist",
                  "Track My Order",
                  "Help Ticket",
                  "Shipping Details",
                  "Compare Products",
                ],
              },
              {
                title: "Corporate",
                items: [
                  "Become a Vendor",
                  "Affiliate Program",
                  "Farm Business",
                  "Farm Careers",
                  "Our Suppliers",
                  "Accessibility",
                  "Promotions",
                ],
              },
              {
                title: "Popular Products",
                items: [
                  "Milk & Flavoured Milk",
                  "Butter and Margarine",
                  "Eggs Substitutes",
                  "Marmalades",
                  "Sour Cream",
                  "Tea & Kombucha",
                  "Cheese",
                ],
              },
            ].map((section) => (
              <div key={section.title}>
                <h2 className="mb-5 text-xl font-bold md:text-2xl">
                  {section.title}
                </h2>

                <ul className="space-y-3 text-sm text-gray-600 md:space-y-4 md:text-base">
                  {section.items.map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        className="text-left transition hover:text-green-500"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* BOTTOM FOOTER */}
          <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t pt-6 xl:flex-row">
            <p className="text-center text-sm text-gray-500 xl:text-left">
              © 2025 Nest - Grocery Store React Template. All rights reserved
            </p>

            <div className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row sm:gap-6">
              <div className="flex items-center gap-3">
                <FaPhoneAlt className="shrink-0 text-2xl text-green-500" />

                <div>
                  <h2 className="text-lg font-bold text-green-500">
                    1900 - 6666
                  </h2>
                  <p className="text-sm text-gray-500">Working 8:00 - 22:00</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaPhoneAlt className="shrink-0 text-2xl text-green-500" />

                <div>
                  <h2 className="text-lg font-bold text-green-500">
                    1900 - 8888
                  </h2>
                  <p className="text-sm text-gray-500">24/7 Support Center</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
