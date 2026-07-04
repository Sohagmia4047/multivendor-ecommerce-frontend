import React, { useState, useRef, useEffect } from "react";
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
import categoryService from "../utils/categoryService";
// import vendorService from "../utils/vendorService";
import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import {
  FaCheese,
  FaTshirt,
  FaBone,
  FaCoffee,
  FaBreadSlice,
  FaAppleAlt,
} from "react-icons/fa";
import logo from "../assets/logo.jpg";

const PublicLayout = ({ children }) => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [categories, setCategories] = useState([]);
  // const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [accountMenu, setAccountMenu] = useState(false);
  const navigate = useNavigate();
  const accountRef = useRef(null);
  const [stickyHeader, setStickyHeader] = useState(false);
  const { cartCount, setCartCount, toggleCart, clearCart } = useCart();
  const handleSearch = () => {
    navigate(`/?search=${encodeURIComponent(search)}`);
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
        setCategories(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  // useEffect(() => {
  //   const fetchVendors = async () => {
  //     try {
  //       const data = await vendorService.getAllVendors();
  //       // setVendors(data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchVendors();
  // }, []);

  useEffect(() => {
    const handleScroll = () => {
      const triggerPoint = window.innerHeight * 0.2;
      setStickyHeader(window.scrollY > triggerPoint);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    clearCart();
    localStorage.clear();
    setCartCount(0);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="w-full overflow-visible bg-white text-gray-700">
      {/* TOP HEADER */}
      <div className="hidden xl:flex items-center justify-between border-b px-6 2xl:px-12 py-2 text-xs">
        <div className="flex items-center gap-5">
          <p className="hover:text-green-500 cursor-pointer transition">
            About Us
          </p>

          <p className="hover:text-green-500 cursor-pointer transition">
            My Account
          </p>

          <p className="hover:text-green-500 cursor-pointer transition">
            Wishlist
          </p>

          <NavLink to="/dashboard/orders/track-all" className="hover:text-green-500 cursor-pointer transition">
            Order Tracking
          </NavLink> 
        </div>

        <p className="text-gray-500 text-center">
          100% Secure delivery without contacting the courier
        </p>

        <div className="flex items-center gap-5">
          <p>
            Need help?{" "}
            <span className="text-green-500 font-bold">+1800 900</span>
          </p>

          <p className="cursor-pointer hover:text-green-500">English</p>

          <p className="cursor-pointer hover:text-green-500">USD</p>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="border-b">
        <div className="flex items-center justify-between gap-3 px-4 md:px-6 2xl:px-12 py-3">
          {/* LOGO */}
          <div className="flex items-center shrink-0">
            <img
              src={logo}
              alt="logo"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain"
            />
          </div>

          {/* SEARCH */}
          <div className="hidden lg:flex flex-1 mx-4 border border-green-500 rounded overflow-hidden max-w-2xl">
            <input
              type="text"
              value={search}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for items..."
              className="w-full px-4 py-3 outline-none text-sm"
            />

            <button
              onClick={handleSearch}
              className="bg-green-500 hover:bg-green-600 transition px-5 text-white"
            >
              <FaSearch />
            </button>
          </div>

          {/* RIGHT ICONS (DESKTOP/TABLET) */}
          {/* RIGHT ICONS */}
          <div className="hidden md:flex items-center gap-6">
            {/* COMPARE */}
            <div className="relative cursor-pointer flex items-center gap-2">
              <div className="relative">
                <FaExchangeAlt className="text-lg md:text-xl" />

                <span className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-green-500 text-white text-[10px] flex items-center justify-center">
                  0
                </span>
              </div>

              <span className="text-sm">Compare</span>
            </div>

            {/* WISHLIST */}
            <div className="relative cursor-pointer flex items-center gap-2">
              <div className="relative">
                <FaHeart className="text-lg md:text-xl" />

                <span className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-green-500 text-white text-[10px] flex items-center justify-center">
                  0
                </span>
              </div>

              <span className="text-sm">Wishlist</span>
            </div>

            {/* CART */}
            <div onClick={toggleCart} className="relative cursor-pointer flex items-center gap-2">
              <div className="relative">
                <FaShoppingCart className="text-lg md:text-xl" />

                <span className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-green-500 text-white text-[10px] flex items-center justify-center">
                  {cartCount}
                </span>
              </div>

              <span className="text-sm">Cart</span>
            </div>

            <div className="relative z-9999" ref={accountRef}>
              <div
                className="cursor-pointer flex items-center gap-2"
                onClick={() => setAccountMenu(!accountMenu)}
              >
                <FaUser className="text-lg md:text-xl" />
                <span className="text-sm">Account</span>
              </div>

              {/* DROPDOWN MENU */}
              {accountMenu && (
                <div className="absolute right-0 top-10 w-40 bg-white border shadow-xl rounded-xl p-2 z-50">
                  <ul className="text-sm">
                    <li onClick={() => navigate("/dashboard/orders/")}  className="px-3 py-2 border-b border-gray-300 hover:bg-green-100 hover:text-green-600 cursor-pointer transition">
                      My Order
                    </li>

                    <li onClick={() => navigate("/dashboard/orders/track-all")}  className="px-3 py-2 border-b border-gray-300 hover:bg-green-100 hover:text-green-600 cursor-pointer transition">
                      Order Tracking
                    </li>

                    <li className="px-3 py-2 border-b border-gray-300 hover:bg-green-100 hover:text-green-600 cursor-pointer transition">
                      My Voucher
                    </li>

                    <li className="px-3 py-2 border-b border-gray-300 hover:bg-green-100 hover:text-green-600 cursor-pointer transition">
                      My Wishlist
                    </li>

                    <li className="px-3 py-2 border-b border-gray-300 hover:bg-green-100 hover:text-green-600 cursor-pointer transition">
                      Settings
                    </li>

                    <li
                      onClick={handleLogout}
                      className="px-3 py-2 hover:bg-red-50 hover:text-red-500 cursor-pointer transition"
                    >
                      Sign Out
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden text-2xl"
          >
            {mobileMenu ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* MOBILE SEARCH */}
        <div className="md:hidden px-4 pb-4">
          <div className="flex border-2 border-green-500 rounded-xl overflow-hidden">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-3 outline-none text-sm"
            />
            <button className="bg-green-500 text-white px-5">
              <FaSearch />
            </button>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <div
        className={`hidden lg:flex items-center justify-between border-b px-6 2xl:px-12 py-1 z-50 bg-white transition-all duration-300 ${
          stickyHeader ? "fixed top-0 left-0 w-full shadow-lg" : "relative"
        }`}
      >
        <div className="flex items-center gap-7 text-[15px] font-medium">
          {/* CATEGORY */}
          <div
            className="relative"
            onMouseEnter={() => setShowCategory(true)}
            onMouseLeave={() => setShowCategory(false)}
          >
            <button className="bg-green-500 hover:bg-green-600 transition text-white px-5 py-2 rounded flex items-center gap-3">
              <FaBars />
              Browse All Categories
            </button>

            {showCategory && (
              <div className="absolute top-full left-0 mt-1 bg-white shadow-2xl rounded-2xl border border-gray-300 border-t-4 border-t-green-500 w-45 p-5 z-50 transition-all duration-300">
                <ul className="space-y-3">
                  {categories.map((category) => (
                    <li
                      key={category.id}
                      onClick={() => navigate(`/category/${category.cid}`)}
                      className="hover:text-green-500 cursor-pointer transition flex items-center gap-1"
                    >
                      {category.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <a href="#" className="hover:text-green-500 transition">
            Deals
          </a>

          {/* HOME */}
          <div className="relative group py-5">
            <button className="flex items-center gap-2 hover:text-green-500 transition">
              Home <FaChevronDown size={12} />
            </button>

            <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-2xl rounded-2xl border w-64 p-5">
              <ul className="space-y-4">
                <li className="hover:text-green-500 cursor-pointer">
                  Home Default
                </li>

                <li className="hover:text-green-500 cursor-pointer">
                  Home Modern
                </li>

                <li className="hover:text-green-500 cursor-pointer">
                  Organic Store
                </li>
              </ul>
            </div>
          </div>

          <a href="#" className="hover:text-green-500 transition">
            About
          </a>

          {/* SHOP */}
          <div className="relative group py-5">
            <button
              onClick={() => navigate(`/product-page/`)}
              className="flex items-center gap-2 hover:text-green-500 transition"
            >
              Shop
            </button>
          </div>

          {/* VENDORS */}
          <div className="relative group py-5">
            <button className="flex items-center gap-2 hover:text-green-500 transition">
              Vendors <FaChevronDown size={12} />
            </button>

            <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-2xl rounded-2xl border w-64 p-5 z-50">
              <ul className="space-y-3 text-sm">
                <li
                  onClick={() => navigate("/vendors")}
                  className="hover:text-green-500 cursor-pointer transition"
                >
                  Vendor List
                </li>

                <li
                  onClick={() => navigate("/vendor-store")}
                  className="hover:text-green-500 cursor-pointer transition"
                >
                  Vendor Store
                </li>

                <li
                  onClick={() => navigate("/vendor-dashboard")}
                  className="hover:text-green-500 cursor-pointer transition"
                >
                  Vendor Dashboard
                </li>
              </ul>
            </div>
          </div>

          {/* MEGA MENU */}
          <div className="relative group py-5">
            <button className="flex items-center gap-2 hover:text-green-500 transition">
              Mega menu <FaChevronDown size={12} />
            </button>

            <div className="absolute top-full -left-90 hidden group-hover:block z-999">
              <div className="bg-white shadow-2xl rounded-3xl border p-8 w-225 max-w-[95vw]">
                <div className="grid grid-cols-4 gap-8">
                  {/* COL 1 */}
                  <div>
                    <h2 className="text-xl font-bold text-green-500 mb-5">
                      Fruit & Vegetables
                    </h2>

                    <ul className="space-y-3 text-gray-600 text-sm">
                      <li className="hover:text-green-500 cursor-pointer">
                        Meat & Poultry
                      </li>

                      <li className="hover:text-green-500 cursor-pointer">
                        Fresh Vegetables
                      </li>

                      <li className="hover:text-green-500 cursor-pointer">
                        Herbs & Seasonings
                      </li>

                      <li className="hover:text-green-500 cursor-pointer">
                        Cuts & Sprouts
                      </li>

                      <li className="hover:text-green-500 cursor-pointer">
                        Exotic Fruits
                      </li>

                      <li className="hover:text-green-500 cursor-pointer">
                        Packaged Produce
                      </li>
                    </ul>
                  </div>

                  {/* COL 2 */}
                  <div>
                    <h2 className="text-xl font-bold text-green-500 mb-5">
                      Breakfast & Dairy
                    </h2>

                    <ul className="space-y-3 text-gray-600 text-sm">
                      <li>Milk & Flavoured Milk</li>
                      <li>Butter and Margarine</li>
                      <li>Eggs Substitutes</li>
                      <li>Marmalades</li>
                      <li>Sour Cream</li>
                      <li>Cheese</li>
                    </ul>
                  </div>

                  {/* COL 3 */}
                  <div>
                    <h2 className="text-xl font-bold text-green-500 mb-5">
                      Meat & Seafood
                    </h2>

                    <ul className="space-y-3 text-gray-600 text-sm">
                      <li>Breakfast Sausage</li>
                      <li>Dinner Sausage</li>
                      <li>Chicken</li>
                      <li>Sliced Deli Meat</li>
                      <li>Wild Caught Fillets</li>
                      <li>Crab and Shellfish</li>
                    </ul>
                  </div>

                  {/* OFFER */}
                  <div className="bg-[#f7ece9] rounded-3xl p-6 relative overflow-hidden min-h-82.5">
                    <p className="uppercase text-gray-500 text-xs mb-2">
                      Hot Deals
                    </p>

                    <h2 className="text-3xl font-bold leading-tight">
                      Don't miss Trending
                    </h2>

                    <h3 className="text-green-500 font-bold text-3xl mt-2">
                      Save to 50%
                    </h3>

                    <button className="mt-5 bg-green-500 hover:bg-green-600 transition text-white px-6 py-3 rounded-full">
                      Shop now
                    </button>

                    <div className="absolute top-5 right-5 bg-yellow-300 w-20 h-20 rounded-full flex flex-col items-center justify-center font-bold">
                      <span className="text-2xl">25%</span>
                      <span className="text-sm">off</span>
                    </div>

                    <img
                      src="https://i.imgur.com/TN2nC6v.png"
                      alt="offer"
                      className="absolute bottom-0 right-0 w-44"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <a href="#" className="hover:text-green-500 transition">
            Blog
          </a>

          <a href="#" className="hover:text-green-500 transition">
            Pages
          </a>

          <a href="#" className="hover:text-green-500 transition">
            Contact
          </a>
        </div>

        {/* SUPPORT */}
        <div className="hidden xl:flex items-center gap-3">
          <FaPhoneAlt className="text-green-500 text-2xl" />

          <div>
            <h2 className="text-green-500 text-xl font-bold">1900 - 888</h2>
            <p className="text-sm text-gray-500">24/7 Support Center</p>
          </div>
        </div>
      </div>
      {stickyHeader && <div className="h-15"></div>}

      {/* MOBILE MENU */}
      {mobileMenu && (
        <div className="lg:hidden border-b px-4 py-5 bg-white">
          <div className="flex flex-col gap-4 font-medium">
            <p>Home</p>
            <p>About</p>
            <p>Shop</p>
            <p>Vendors</p>
            <p>Mega Menu</p>
            <p>Blog</p>
            <p>Pages</p>
            <p>Contact</p>
          </div>
        </div>
      )}

      {children}

      {/* FOOTER */}
      <footer className="border-t mt-10">
        <div className="px-4 md:px-6 2xl:px-12 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-10">
            {/* COMPANY INFO */}
            <div className="sm:col-span-2 xl:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white text-2xl font-bold">
                  N
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-green-500">Nest</h1>

                  <p className="text-[10px] tracking-[3px]">MART & GROCERY</p>
                </div>
              </div>

              <p className="text-gray-600 leading-7">
                Awesome grocery store website template
              </p>

              <div className="space-y-3 text-sm text-gray-600 mt-6">
                <p>
                  <span className="font-semibold">Address:</span> 5171 W
                  Campbell Ave Kent, Utah
                </p>

                <p>
                  <span className="font-semibold">Call:</span>
                  (+91)-540-025-124553
                </p>

                <p>
                  <span className="font-semibold">Email:</span> sale@Nest.com
                </p>

                <p>
                  <span className="font-semibold">Hours:</span> 10:00 - 18:00
                </p>
              </div>

              {/* APP */}
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Install App</h2>

                <div className="flex flex-wrap gap-3">
                  <img
                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                    alt="app"
                    className="w-32"
                  />

                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="playstore"
                    className="w-32"
                  />
                </div>

                {/* PAYMENT */}
                <div className="mt-8">
                  <h3 className="font-bold mb-4">Secured Payment Gateways</h3>

                  <div className="flex flex-wrap gap-3">
                    {[
                      "https://cdn-icons-png.flaticon.com/512/196/196578.png",
                      "https://cdn-icons-png.flaticon.com/512/196/196561.png",
                      "https://cdn-icons-png.flaticon.com/512/349/349221.png",
                      "https://cdn-icons-png.flaticon.com/512/825/825454.png",
                    ].map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt="payment"
                        className="w-12"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER MENUS */}
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
            ].map((section, index) => (
              <div key={index}>
                <h2 className="text-2xl font-bold mb-6">{section.title}</h2>

                <ul className="space-y-4 text-gray-600">
                  {section.items.map((item, i) => (
                    <li
                      key={i}
                      className="hover:text-green-500 cursor-pointer transition"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* BOTTOM FOOTER */}
          <div className="border-t mt-12 pt-6 flex flex-col xl:flex-row items-center justify-between gap-6">
            <p className="text-gray-500 text-center xl:text-left text-sm">
              © 2025 Nest - Grocery Store React Template. All rights reserved
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex items-center gap-3">
                <FaPhoneAlt className="text-green-500 text-2xl" />

                <div>
                  <h2 className="text-green-500 font-bold text-lg">
                    1900 - 6666
                  </h2>

                  <p className="text-sm text-gray-500">Working 8:00 - 22:00</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaPhoneAlt className="text-green-500 text-2xl" />

                <div>
                  <h2 className="text-green-500 font-bold text-lg">
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
