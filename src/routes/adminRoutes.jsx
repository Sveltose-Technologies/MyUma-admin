import { lazy } from "react";


// Lazy loading all components
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Categories = lazy(() => import("../pages/Categories"));
const Home = lazy(() => import("../pages/Home"));
const EditProfile = lazy(() => import("../pages/EditProfile"));
const BlogCategories = lazy(() => import("../pages/BlogCategories"));
const Blogs = lazy(() => import("../pages/Blogs"));
const LegalDocs = lazy(()=>import("../pages/LegalDocs"));
const AboutUs = lazy(()=>import("../pages/AboutUs"))
const NewListings = lazy(() => import("../pages/NewListings"));
const Pricing = lazy(() => import("../pages/Pricing"));
const Comments = lazy(() => import("../pages/Comments"));
const FooterText = lazy(() => import("../pages/FooterText"));
const ContactUs = lazy(()=>import("../pages/ContactUs"))
const Rating = lazy(() => import("../pages/Rating"));
const Booknow = lazy(() => import("../pages/Booknow"));
export const adminRoutes = [
  {
    path: "",
    element: <Dashboard />,
    title: "Dashboard",
  },
  {
    path: "categories",
    element: <Categories />,
    title: "Categories",
  },
  {
    path: "home",
    element: <Home />,
    title: "Home",
  },
  {
    path: "listings",
    element: <NewListings />,
    title: "Properties & Listings",
  },
  {
    path: "edit-profile",
    element: <EditProfile />,
    title: "Edit Profile",
  },
  {
    path: "blogs",
    element: <Blogs />,
    title: "Blogs",
  },
  {
    path: "blog-categories",
    element: <BlogCategories />,
    title: "Blog Categories",
  },
  {
    path: "about-us",
    element: <AboutUs />,
    title: "AboutUS",
  },
  {
    path: "rating",
    element: <Rating />,
    title: "Rating",
  },
  {
    path: "book-now",
    element: <Booknow />,
    title: "Booknow",
  },
  {
    path: "pricing",
    element: <Pricing />,
    title: "Pricing Plans",
  },
  {
    path: "comments",
    element: <Comments />,
    title: "User Comments",
  },
  {
    path: "/admin/legal-docs",
    element: <LegalDocs />,
    title: "LegalDocs",
  },
  {
    path: "contact-us",
    element: <ContactUs />,
    title: "ContactUs",
  },
  {
    path: "footer-text",
    element: <FooterText />,
    title: "Footer Text",
  },
];
