import React, { useState } from "react";

import Sidebar from "./components/Sidebar";
import MobileNavbar from "./components/MobileNavbar";
import Dashboard from "./components/Dashboard";
import Cate from "./components/Category";
import AddCategory from "./components/AddCategory";
import Products from "./components/Products";
import AddProduct from "./components/AddProduct";
import Orders from "./components/Orders";
import Users from "./components/Users";

const App = () => {
  const [activePage, setActivePage] = useState("Dashboard");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  const [categories, setCategories] = useState([]);

  const [products, setProducts] = useState([]);

  const [editingCategory, setEditingCategory] =
    useState(null);

  const [editingProduct, setEditingProduct] =
    useState(null);

  // =====================================
  // CATEGORY NAVIGATION
  // =====================================

  const openAddCategory = () => {
    setEditingCategory(null);
    setActivePage("Add category");
  };

  const openEditCategory = (category) => {
    setEditingCategory(category);
    setActivePage("Add category");
  };

  // =====================================
  // CATEGORY SAVE
  // API Category.jsx / AddCategory.jsx
  // ME HANDLE HOGI
  // =====================================

  const handleCategorySaved = () => {
    setEditingCategory(null);
    setActivePage("Categories");
  };

  // =====================================
  // PRODUCT NAVIGATION
  // =====================================

  const openAddProduct = () => {
    setEditingProduct(null);
    setActivePage("Add Product");
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setActivePage("Add Product");
  };

  const addProduct = (productData) => {
    console.log("Product:", productData);

    setActivePage("Product");
  };

  const updateProduct = (productData) => {
    console.log("Product update:", productData);

    setEditingProduct(null);
    setActivePage("Product");
  };

  const deleteProduct = (id) => {
    console.log("Product delete:", id);
  };

  // =====================================
  // NAVIGATION
  // =====================================

  const navigate = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  // =====================================
  // UI
  // =====================================

  return (
    <div className="min-h-screen bg-green-200">

      <MobileNavbar
        onMenu={() => setSidebarOpen(true)}
      />

      <div className="flex min-h-screen">

        <Sidebar
          activePage={activePage}
          setActivePage={navigate}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onLogout={() =>
            setShowLogoutModal(true)
          }
        />

        <main className="flex-1 min-w-0 lg:ml-0 pt-16 lg:pt-0">

          <div className="min-h-screen p-4 md:p-6 lg:p-8">

            {/* DASHBOARD */}

            {activePage === "Dashboard" && (
              <Dashboard
                setActivePage={navigate}
                products={products}
                categories={categories}
              />
            )}

            {/* CATEGORIES */}

            {activePage === "Categories" && (
              <Cate
                categories={categories}
                setCategories={setCategories}
                onAdd={openAddCategory}
                onEdit={openEditCategory}
              />
            )}

            {/* ADD / EDIT CATEGORY */}

            {activePage === "Add category" && (
              <AddCategory
                initialData={editingCategory}
                onSave={handleCategorySaved}
                onCancel={() => {
                  setEditingCategory(null);
                  setActivePage("Categories");
                }}
              />
            )}

            {/* PRODUCTS */}

            {activePage === "Product" && (
              <Products
                products={products}
                onAdd={openAddProduct}
                onEdit={openEditProduct}
                onDelete={deleteProduct}
              />
            )}

            {/* ADD / EDIT PRODUCT */}

            {activePage === "Add Product" && (
              <AddProduct
                categories={categories}
                initialData={editingProduct}
                onSave={
                  editingProduct
                    ? updateProduct
                    : addProduct
                }
                onCancel={() => {
                  setEditingProduct(null);
                  setActivePage("Product");
                }}
              />
            )}

            {/* ORDERS */}

            {activePage === "Orders" && (
              <Orders />
            )}

            {/* USERS */}

            {activePage === "Users" && (
              <Users />
            )}

          

          </div>

        </main>

      </div>

     

    </div>
  );
};

export default App;