import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/userauths/SignUp";
import Login from "./pages/userauths/Login";
import PublicRoute from "./components/PublicRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Products from "./pages/Products";
import Category from "./pages/Category";
import CategoryProductsList from "./pages/CategoryProductsList";
import Vendors from "./pages/Vendors";
import VendorDetails from "./pages/VendorDetails";
import ProductsDetails from "./pages/ProductsDetails";
import TagProducts from "./pages/TagProducts";
import ScrollToTop from "./pages/ScrollToTop";
import { CartProvider } from "./contexts/CartProvider";
import MiniCart from "./pages/MiniCart";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFail from "./pages/PaymentFail";
import PaymentCancel from "./pages/PaymentCancel";
import Invoice from "./pages/Invoice";
import ViewOrder from "./pages/ViewOrder";
import TrackOrder from "./pages/TrackOrder";
import ViewTracking from "./pages/ViewTracking";
import DashboardLayout from "./components/DashboardLayout";
import OrderDashboard from "./pages/OrderDashboard";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <CartProvider>
    <BrowserRouter>
    <ScrollToTop />
    <ToastContainer position="top-right" autoClose={1000} />
    <MiniCart />
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={ <PublicRoute> <SignUp /> </PublicRoute>}/>
        <Route path="/login" element={ <PublicRoute> <Login /> </PublicRoute> }/>
        <Route path="/product-page" element={ <Products />}/>
        <Route path="/product-detail/:pid" element={ <ProductsDetails />}/>
        <Route path="/category" element={ <Category />}/>
        <Route path="/category/:cid" element={<CategoryProductsList />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/vendor-details/:vid" element={<VendorDetails />} />
        <Route path="/tag/:slug" element={<TagProducts />} />
        <Route path="/cart-page" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment/online" element={<Payment />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFail />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
        <Route path="/invoice/:invoiceNo" element={<Invoice />} />
        {/* <Route path="/dashboard/orders" element={<Dashboard />}/>
        <Route path="/dashboard/orders/:invoiceNo" element={<ViewOrder />}/>
        <Route path="/dashboard/orders/track-all" element={<TrackOrder />} />
        <Route path="/dashboard/orders/track/:invoiceNo" element={<ViewTracking />}/> */}
        {/* 🟢 DASHBOARD (ONLY ONE SYSTEM) */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<OrderDashboard />} />
            <Route path="orders/track-all" element={<TrackOrder />} />
            <Route path="orders/track/:invoiceNo" element={<ViewTracking />} />
            <Route path="orders/:invoiceNo" element={<ViewOrder />} />
          </Route>
      </Routes>
    </BrowserRouter>
    </CartProvider>
  );
};

export default App;
