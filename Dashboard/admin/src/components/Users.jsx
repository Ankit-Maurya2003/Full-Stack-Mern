import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  Search,
  Pencil,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";


const API = "http://localhost:4005/users";


const Users = () => {

  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingUser, setEditingUser] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(false);


  const itemsPerPage = 10;


  // =========================
  // FORM
  // =========================

  const [form, setForm] = useState({
    oldEmail: "",
    name: "",
    email: "",
    password: "",
  });


  // =========================
  // GET TOKEN
  // =========================

  const getToken = () => {
    return localStorage.getItem("token");
  };


  // =========================
  // FETCH USERS
  // =========================

  const fetchUsers = async () => {

    try {

      setLoading(true);

      const token = getToken();

      const response = await axios.get(
        `${API}/fetch`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      console.log(
        "FETCH USERS:",
        response.data
      );


      if (
        Array.isArray(response.data.users)
      ) {

        setUsers(response.data.users);

      } else if (
        Array.isArray(response.data.list)
      ) {

        setUsers(response.data.list);

      } else if (
        Array.isArray(response.data)
      ) {

        setUsers(response.data);

      } else {

        setUsers([]);

      }

    } catch (error) {

      console.log(
        "FETCH ERROR:",
        error.response?.data ||
        error.message
      );


      alert(
        error.response?.data?.message ||
        "Users fetch nahi ho paaye"
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================
  // FETCH ON PAGE LOAD
  // =========================

  useEffect(() => {

    fetchUsers();

  }, []);


  // =========================
  // SEARCH FILTER
  // =========================

  const filteredUsers = useMemo(() => {

    const value = search.toLowerCase();


    return users.filter((user) => {

      const name = user.name || "";

      const email = user.email || "";


      return (
        name
          .toLowerCase()
          .includes(value) ||

        email
          .toLowerCase()
          .includes(value)
      );

    });

  }, [users, search]);


  // =========================
  // TOTAL PAGES
  // =========================

  const totalPages = Math.ceil(
    filteredUsers.length /
      itemsPerPage
  );


  // =========================
  // PAGINATED USERS
  // =========================

  const paginatedUsers = useMemo(() => {

    const startIndex =
      (currentPage - 1) *
      itemsPerPage;


    return filteredUsers.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  }, [
    filteredUsers,
    currentPage,
  ]);


  // =========================
  // SEARCH
  // =========================

  const handleSearch = (e) => {

    setSearch(e.target.value);

    setCurrentPage(1);

  };


  // =========================
  // OPEN ADD MODAL
  // =========================

  const openAddModal = () => {

    setEditingUser(null);


    setForm({
      oldEmail: "",
      name: "",
      email: "",
      password: "",
    });


    setShowModal(true);

  };


  // =========================
  // OPEN EDIT MODAL
  // =========================

  const openEditModal = (user) => {

    setEditingUser(user);


    setForm({

      oldEmail: user.email || "",

      name: user.name || "",

      email: user.email || "",

      password: "",

    });


    setShowModal(true);

  };


  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;


    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  // =========================
  // ADD USER
  // =========================

  const addUser = async () => {

    try {

      const token = getToken();


      const response = await axios.post(
        `${API}/signup`,
        {
          name: form.name,
          email: form.email,
          password: form.password,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      console.log(
        "ADD USER:",
        response.data
      );


      alert(
        "User added successfully"
      );


      setShowModal(false);


      setForm({
        oldEmail: "",
        name: "",
        email: "",
        password: "",
      });


      await fetchUsers();

    } catch (error) {

      console.log(
        "ADD ERROR:",
        error.response?.data ||
        error.message
      );


      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "User add nahi hua"
      );

    }

  };


  // =========================
  // UPDATE USER
  // =========================

  const updateUser = async () => {

    try {

      const token = getToken();


      const response = await axios.put(
        `${API}/update`,
        {
          oldEmail: form.oldEmail,
          name: form.name,
          email: form.email,
          password: form.password,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      console.log(
        "UPDATE USER:",
        response.data
      );


      alert(
        "User updated successfully"
      );


      setShowModal(false);

      setEditingUser(null);


      setForm({
        oldEmail: "",
        name: "",
        email: "",
        password: "",
      });


      await fetchUsers();

    } catch (error) {

      console.log(
        "UPDATE ERROR:",
        error.response?.data ||
        error.message
      );


      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "User update nahi hua"
      );

    }

  };


  // =========================
  // FORM SUBMIT
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();


    // ADD USER

    if (!editingUser) {

      if (
        !form.name ||
        !form.email ||
        !form.password
      ) {

        alert(
          "Name, Email aur Password required hain"
        );

        return;

      }


      await addUser();

      return;

    }


    // UPDATE USER

    if (
      !form.oldEmail ||
      !form.name ||
      !form.email ||
      !form.password
    ) {

      alert(
        "Old Email, Name, Email aur Password required hain"
      );

      return;

    }


    await updateUser();

  };


  // =========================
  // DELETE USER
  // =========================

  const deleteUser = async (user) => {

    const confirmDelete =
      window.confirm(
        `Kya aap ${user.name} ko delete karna chahte ho?`
      );


    if (!confirmDelete) {
      return;
    }


    try {

      const token = getToken();


      const response = await axios.delete(
        `${API}/delete`,
        {
          data: {
            oldEmail: user.email,
          },

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      console.log(
        "DELETE USER:",
        response.data
      );


      alert(
        "User deleted successfully"
      );


      await fetchUsers();

    } catch (error) {

      console.log(
        "DELETE ERROR:",
        error.response?.data ||
        error.message
      );


      alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "User delete nahi hua"
      );

    }

  };


  // =========================
  // PREVIOUS PAGE
  // =========================

  const handlePrevious = () => {

    setCurrentPage((prev) =>
      Math.max(prev - 1, 1)
    );

  };


  // =========================
  // NEXT PAGE
  // =========================

  const handleNext = () => {

    setCurrentPage((prev) =>
      Math.min(
        prev + 1,
        totalPages
      )
    );

  };


  // =========================
  // PAGE CHANGE
  // =========================

  const handlePageChange = (page) => {

    setCurrentPage(page);

  };


  // =========================
  // UI
  // =========================

  return (

    <div className="min-h-screen p-2 md:p-6">


      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
            User Management
          </h1>


          <p className="mt-1 text-sm text-gray-500">
            Manage your store customers
          </p>

        </div>


        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white hover:bg-green-700"
        >

          <Plus size={18} />

          Add User

        </button>

      </div>


      {/* =========================
          STATS
      ========================= */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">


        {/* TOTAL USERS */}

        <div className="rounded-xl border bg-white p-5">

          <p className="text-sm text-gray-500">
            Total Users
          </p>


          <h2 className="mt-2 text-2xl font-bold">
            {users.length}
          </h2>

        </div>


        {/* SEARCH RESULT */}

        <div className="rounded-xl border bg-white p-5">

          <p className="text-sm text-gray-500">
            Search Result
          </p>


          <h2 className="mt-2 text-2xl font-bold text-green-600">
            {filteredUsers.length}
          </h2>

        </div>

      </div>


      {/* =========================
          TABLE CARD
      ========================= */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">


        {/* SEARCH BOX */}

        <div className="border-b p-4 md:p-5">

          <div className="flex items-center gap-2 rounded-lg border bg-gray-50 px-4 py-2.5">

            <Search
              size={18}
              className="text-gray-400"
            />


            <input
              value={search}
              onChange={handleSearch}
              placeholder="Search user by name or email..."
              className="w-full bg-transparent text-sm outline-none"
            />

          </div>

        </div>


        {/* =========================
            TABLE
        ========================= */}

        <div className="overflow-x-auto">

          {loading ? (

            <div className="py-12 text-center text-gray-500">
              Loading users...
            </div>

          ) : (

            <table className="w-full min-w-[650px] text-sm">


              {/* TABLE HEADER */}

              <thead>

                <tr className="border-b bg-gray-50 text-left">


                  <th className="px-5 py-4 text-gray-500">
                    User
                  </th>


                  <th className="px-5 py-4 text-gray-500">
                    Email
                  </th>


                  <th className="px-5 py-4 text-center text-gray-500">
                    Actions
                  </th>


                </tr>

              </thead>


              {/* TABLE BODY */}

              <tbody>

                {paginatedUsers.map(
                  (user) => (

                    <tr
                      key={user._id}
                      className="border-b transition hover:bg-gray-50"
                    >


                      {/* USER */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">


                          {/* AVATAR */}

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">

                            {user.name
                              ?.charAt(0)
                              ?.toUpperCase()}

                          </div>


                          {/* NAME */}

                          <div>

                            <p className="font-medium text-gray-800">
                              {user.name}
                            </p>


                            <p className="text-xs text-gray-400">
                              ID: {user._id}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* EMAIL */}

                      <td className="px-5 py-4 text-gray-600">
                        {user.email}
                      </td>


                      {/* ACTIONS */}

                      <td className="px-5 py-4">

                        <div className="flex justify-center gap-4">


                          {/* EDIT */}

                          <button
                            onClick={() =>
                              openEditModal(
                                user
                              )
                            }
                            className="text-gray-400 hover:text-green-600"
                            title="Edit"
                          >

                            <Pencil
                              size={18}
                            />

                          </button>


                          {/* DELETE */}

                          <button
                            onClick={() =>
                              deleteUser(
                                user
                              )
                            }
                            className="text-gray-400 hover:text-red-500"
                            title="Delete"
                          >

                            <Trash2
                              size={18}
                            />

                          </button>


                        </div>

                      </td>


                    </tr>

                  )
                )}

              </tbody>

            </table>

          )}


          {/* NO USERS */}

          {!loading &&
            paginatedUsers.length ===
              0 && (

              <div className="py-12 text-center text-sm text-gray-400">

                No users found

              </div>

            )}

        </div>


        {/* =========================
            PAGINATION
        ========================= */}

        <div className="flex flex-col gap-4 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between">


          {/* SHOWING */}

          <p className="text-sm text-gray-500">

            Showing{" "}


            <span className="font-medium text-gray-700">

              {filteredUsers.length ===
              0
                ? 0
                : (currentPage -
                    1) *
                    itemsPerPage +
                  1}

            </span>


            {" "}to{" "}


            <span className="font-medium text-gray-700">

              {Math.min(
                currentPage *
                  itemsPerPage,
                filteredUsers.length
              )}

            </span>


            {" "}of{" "}


            <span className="font-medium text-gray-700">

              {filteredUsers.length}

            </span>


            {" "}users

          </p>


          {/* PAGINATION BUTTONS */}

          {totalPages > 1 && (

            <div className="flex items-center gap-1">


              {/* PREVIOUS */}

              <button
                onClick={
                  handlePrevious
                }
                disabled={
                  currentPage === 1
                }
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 disabled:opacity-40"
              >

                <ChevronLeft
                  size={16}
                />

                Previous

              </button>


              {/* PAGE NUMBERS */}

              {Array.from(
                {
                  length:
                    totalPages,
                },
                (_, index) =>
                  index + 1
              ).map(
                (page) => (

                  <button
                    key={page}
                    onClick={() =>
                      handlePageChange(
                        page
                      )
                    }
                    className={`min-w-9 rounded-lg px-3 py-1.5 text-sm ${
                      currentPage ===
                      page
                        ? "bg-green-600 text-white"
                        : "border border-gray-200 text-gray-600"
                    }`}
                  >

                    {page}

                  </button>

                )
              )}


              {/* NEXT */}

              <button
                onClick={handleNext}
                disabled={
                  currentPage ===
                  totalPages
                }
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 disabled:opacity-40"
              >

                Next

                <ChevronRight
                  size={16}
                />

              </button>


            </div>

          )}

        </div>

      </div>


      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      {showModal && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() =>
            setShowModal(false)
          }
        >


          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            className="w-full max-w-lg rounded-2xl bg-white p-6"
          >


            {/* MODAL HEADER */}

            <div className="mb-5 flex items-center justify-between">


              <h2 className="text-xl font-bold">

                {editingUser
                  ? "Edit User"
                  : "Add New User"}

              </h2>


              <button
                onClick={() =>
                  setShowModal(false)
                }
              >

                <X size={20} />

              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
            >

              <div className="space-y-4">


                {/* OLD EMAIL */}

                {editingUser && (

                  <div>

                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Old Email
                    </label>


                    <input
                      name="oldEmail"
                      value={
                        form.oldEmail
                      }
                      onChange={
                        handleChange
                      }
                      type="email"
                      placeholder="Old Email"
                      className="w-full rounded-lg border bg-gray-100 px-4 py-3 outline-none focus:border-green-500"
                    />

                  </div>

                )}


                {/* NAME */}

                <div>

                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Full Name
                  </label>


                  <input
                    name="name"
                    value={
                      form.name
                    }
                    onChange={
                      handleChange
                    }
                    type="text"
                    placeholder="Full Name"
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-500"
                  />

                </div>


                {/* EMAIL */}

                <div>

                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email
                  </label>


                  <input
                    name="email"
                    value={
                      form.email
                    }
                    onChange={
                      handleChange
                    }
                    type="email"
                    placeholder="Email"
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-500"
                  />

                </div>


                {/* PASSWORD */}

                <div>

                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {editingUser
                      ? "New Password"
                      : "Password"}
                  </label>


                  <input
                    name="password"
                    value={
                      form.password
                    }
                    onChange={
                      handleChange
                    }
                    type="password"
                    placeholder={
                      editingUser
                        ? "New Password"
                        : "Password"
                    }
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-500"
                  />

                </div>


              </div>


              {/* EDIT INFO */}

              {editingUser && (

                <p className="mt-3 text-xs text-gray-500">

                  Old Email database ke email
                  se match hona chahiye.

                </p>

              )}


              {/* BUTTONS */}

              <div className="mt-6 flex gap-3">


                {/* CANCEL */}

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(
                      false
                    )
                  }
                  className="flex-1 rounded-lg border py-3"
                >

                  Cancel

                </button>


                {/* SUBMIT */}

                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-green-600 py-3 text-white hover:bg-green-700"
                >

                  {editingUser
                    ? "Update User"
                    : "Add User"}

                </button>


              </div>


            </form>

          </div>

        </div>

      )}

    </div>

  );

};


export default Users;