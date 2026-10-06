import {
  createContext,
  useContext,
  useState,
} from "react";

const Supplier = createContext();

export const CartProvider = ({ children }) => {
  const [activePage, setActivePage] =
    useState("Dashboard");

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  const [dash, setDash] = useState(false);

  const [cart, setCart] = useState([]);

  const [item, setItem] = useState([]);

  const [count, setCount] = useState({});

  const [search, setSearch] = useState("");

  const [visible, setVisible] = useState(false);

  const [select, setSelect] = useState("");

  const [myCart, setMyCart] = useState(false);

  const [role, setRole] = useState(
    localStorage.getItem("role") || ""
  );

  const [name, setName] = useState(() => {
    return (
      localStorage.getItem("userName") || ""
    );
  });

  const [token, setToken] = useState(() => {
    return (
      localStorage.getItem("token") || null
    );
  });

  // ==========================================
  // LOGIN
  // ==========================================

  const login = (newToken, userRole) => {
    localStorage.setItem("token", newToken);

    localStorage.setItem("role", userRole);

    setRole(userRole);

    setToken(newToken);
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("userName");

    localStorage.removeItem("role");

    setToken(null);

    setName("");

    setRole("");
  };

  // ==========================================
  // SAVE NAME
  // ==========================================

  const saveName = (value) => {
    setName(value);

    localStorage.setItem(
      "userName",
      value
    );
  };

  // ==========================================
  // INCREASE
  // ==========================================

  const increase = (id) => {
    setCount((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  // ==========================================
  // DECREASE
  // ==========================================

  const decrease = (id) => {
    setCount((prev) => {
      const newCount = {
        ...prev,
        [id]: (prev[id] || 0) - 1,
      };

      if (newCount[id] <= 0) {
        delete newCount[id];

        setCart((prevCart) =>
          prevCart.filter(
            (cartItem) =>
              cartItem.id !== id
          )
        );
      }

      return newCount;
    });
  };

  // ==========================================
  // REMOVE ITEM
  // ==========================================

  const removeItem = () => {
    setItem([]);
  };

  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = (product) => {
    console.log(
      "PRODUCT ADDED TO CART:",
      product
    );

    const mongoProductId =
      product?._id ||
      product?.productId ||
      null;

    const cartId =
      product?.id ||
      product?._id ||
      product?.productId;

    const cartProduct = {
      // Frontend cart id
      id: cartId,

      // MongoDB Product ID
      productId: mongoProductId
        ? String(mongoProductId)
        : null,

      // Product name
      name:
        product?.name ||
        product?.productName ||
        "Product",

      // Original mrp
      mrp:
        Number(product?.mrp) ||
        Number(product?.price) ||
        0,

      // Price bhi save karo
      price:
        Number(product?.price) ||
        Number(product?.mrp) ||
        0,

      // Image
      image:
        product?.image ||
        product?.imageUrl ||
        product?.img ||
        "",

      // Other useful fields
      category:
        product?.category || "",

      weight:
        product?.weight || "",

      description:
        product?.description || "",
    };

    console.log(
      "NORMALIZED CART PRODUCT:",
      cartProduct
    );

    setCart((prevCart) => [
      ...prevCart,
      cartProduct,
    ]);
  };

  // ==========================================
  // ADD ITEM
  // ==========================================

  const addToItem = (product) => {
    setItem(product);
  };

  // ==========================================
  // TOTAL PRICE
  // ==========================================

  const totalPrice = () => {
    return cart.reduce(
      (total, cartItem) => {
        const quantity =
          count[cartItem.id] || 0;

        const price =
          Number(cartItem.mrp) ||
          Number(cartItem.price) ||
          0;

        return (
          total +
          price * quantity
        );
      },
      0
    );
  };

  // ==========================================
  // EMPTY CART
  // ==========================================

  const emptyCart = () => {
    setCart([]);

    setCount({});
  };

  // ==========================================
  // TOTAL COUNT
  // ==========================================

  const totalCount = () => {
    return Object.values(count).reduce(
      (total, quantity) =>
        total + quantity,
      0
    );
  };

  return (
    <Supplier.Provider
      value={{
        role,
        setRole,

        login,
        logout,

        token,

        cart,

        setName: saveName,

        name,

        showLogoutModal,
        setShowLogoutModal,

        activePage,
        setActivePage,

        myCart,

        dash,

        setDash,

        setMyCart,

        item,

        addToItem,

        select,

        setSelect,

        removeItem,

        addToCart,

        visible,

        setVisible,

        totalPrice,

        emptyCart,

        totalCount,

        setCount,

        increase,

        decrease,

        count,

        search,

        setSearch,
      }}
    >
      {children}
    </Supplier.Provider>
  );
};

export const useCart = () => {
  return useContext(Supplier);
};