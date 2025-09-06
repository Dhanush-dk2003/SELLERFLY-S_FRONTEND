import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import logo from "../../assets/Sellerfly.png";
import icon from "../../assets/is-greater-than.png";
import { MessageStatusContext } from "../../contexts/MessageStatusContext";

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isSmallScreen = useMediaQuery({ maxWidth: 999 });

  const [activeItem, setActiveItem] = useState("");
  const { hasPendingMessageDot } = useContext(MessageStatusContext);

  useEffect(() => {
    if (location.pathname.includes("projects")) {
      setActiveItem("projects");
    } else if (location.pathname.includes("managerstatus")) {
      setActiveItem("status");
    } else if (location.pathname.includes("invoice")) {
      setActiveItem("invoice");
    } else if (location.pathname.includes("profile")) {
      setActiveItem("profile");
    } else if (location.pathname.includes("tasks")) {
      setActiveItem("tasks");
    } else if (location.pathname.includes("message")) {
      setActiveItem("message");
    } else if (location.pathname.includes("client-registration")) {
      setActiveItem("client-registration");
    } else if (location.pathname.includes("portal-registration")) {
      setActiveItem("portal-registration");
    } else if (location.pathname.includes("catalog-registration")) {
      setActiveItem("catalog-registration");
    } else if (location.pathname.includes("growth-management")) {
      setActiveItem("growth-management");
    }
  }, [location.pathname]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      navigate("/logout");
    }
  };

  return (
    <>
      {isSmallScreen && (
        <button
          className="btn btn-light position-absolute top-0 start-0 m-2 z-1030 shadow"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebarOffcanvas"
          aria-controls="sidebarOffcanvas"
        >
          ☰
        </button>
      )}

      {!isSmallScreen && (
        <div
          className="d-flex flex-column p-3 position-fixed"
          style={{
            width: "240px",
            height: "100vh",
            backgroundColor: "#dddedf",
            top: 0,
            left: 0,
          }}
        >
          <SidebarContent
            user={user}
            handleLogout={handleLogout}
            activeItem={activeItem}
            setActiveItem={setActiveItem}
            navigate={navigate}
            hasPendingMessageDot={hasPendingMessageDot}
          />
        </div>
      )}

      {isSmallScreen && (
        <div
          className="offcanvas offcanvas-start"
          tabIndex="-1"
          id="sidebarOffcanvas"
          aria-labelledby="sidebarOffcanvasLabel"
          style={{ width: "220px" }}
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="sidebarOffcanvasLabel">
              Menu
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            />
          </div>
          <div className="offcanvas-body p-0">
            <SidebarContent
              user={user}
              handleLogout={handleLogout}
              activeItem={activeItem}
              setActiveItem={setActiveItem}
              navigate={navigate}
              hasPendingMessageDot={hasPendingMessageDot}
            />
          </div>
        </div>
      )}
    </>
  );
};

const SidebarContent = ({
  user,
  handleLogout,
  activeItem,
  setActiveItem,
  navigate,
  hasPendingMessageDot,
}) => {
  const handleItemClick = (item, path) => {
    setActiveItem(item);
    navigate(path);
  };

  return (
    <div className="d-flex flex-column h-100 px-3 pt-3">
      {/* Logo */}
      <div className="text-center mb-4">
        <img
          src={logo}
          alt="Logo"
          className="img-fluid"
          style={{ maxHeight: "70px" }}
        />
      </div>

      {/* Menu Items */}
      <div className="flex-grow-1 text-center mt-1">
        <ul className="nav flex-column w-100 mt-2">
          {/* ADMIN & MANAGER */}
          {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
            <>
              <li className="nav-item mb-3">
                <button
                  className={`nav-link w-100 rounded ${
                    activeItem === "projects"
                      ? "bg-dark text-white fw-bold"
                      : "bg-light text-dark"
                  }`}
                  onClick={() => handleItemClick("projects", "/projects")}
                >
                  Projects
                </button>
              </li>
              

              {user?.role === "MANAGER" && (
                <li className="nav-item mb-3">
                  <button
                    className={`nav-link w-100 rounded ${
                      activeItem === "status"
                        ? "bg-dark text-white fw-bold"
                        : "bg-light text-dark"
                    }`}
                    onClick={() => handleItemClick("status", "/managerstatus")}
                  >
                    Status
                  </button>
                </li>
              )}

              {(user?.role === "MANAGER") && (
                <>
                  <li className="nav-item mb-3">
                    <button
                      className={`nav-link w-100 rounded ${
                        activeItem === "profile"
                          ? "bg-dark text-white fw-bold"
                          : "bg-light text-dark"
                      }`}
                      onClick={() => handleItemClick("profile", "/profile")}
                    >
                      Profile
                    </button>
                  </li>
                  <li className="nav-item mb-3">
                    <button
                      className={`nav-link w-100 rounded ${
                        activeItem === "invoice"
                          ? "bg-dark text-white fw-bold"
                          : "bg-light text-dark"
                      }`}
                      onClick={() => handleItemClick("invoice", "/invoice")}
                    >
                      Invoice
                    </button>
                  </li>
                </>
              )}
            </>
          )}
          <li className="nav-item mb-3">
                <button
                  className={`nav-link w-100 rounded ${
                    activeItem === "tasks"
                      ? "bg-dark text-white fw-bold"
                      : "bg-light text-dark"
                  }`}
                  onClick={() => handleItemClick("tasks", "/tasks")}
                >
                  Tasks
                </button>
              </li>

          {/* REGISTRATION TEAM */}
          {(user?.department === "REGISTRATION TEAM" || user?.department === "MANAGEMENT") && (
            <>
              <li className="nav-item mb-3">
                <button
                  className={`nav-link w-100 rounded ${
                    activeItem === "client-registration"
                      ? "bg-dark text-white fw-bold"
                      : "bg-light text-dark"
                  }`}
                  onClick={() =>
                    handleItemClick(
                      "client-registration",
                      "/client-registration"
                    )
                  }
                >
                  Client Registration
                </button>
              </li>
              <li className="nav-item mb-3">
                <button
                  className={`nav-link w-100 rounded ${
                    activeItem === "portal-registration"
                      ? "bg-dark text-white fw-bold"
                      : "bg-light text-dark"
                  }`}
                  onClick={() =>
                    handleItemClick(
                      "portal-registration",
                      "/portal-registration"
                    )
                  }
                >
                  Portal Registration
                </button>
              </li>
            </>
          )}

          {/* KEY ACCOUNT MANAGEMENT */}
          {(user?.department === "KEY ACC MANAGEMENT" || user?.department === "MANAGEMENT") && (
            <li className="nav-item mb-3">
              <button
                className={`nav-link w-100 rounded ${
                  activeItem === "catalog-registration"
                    ? "bg-dark text-white fw-bold"
                    : "bg-light text-dark"
                }`}
                onClick={() =>
                  handleItemClick(
                    "catalog-registration",
                    "/catalog-registration"
                  )
                }
              >
                Catalog
              </button>
            </li>
          )}
          {/* KEY ACCOUNT MANAGEMENT */}
          {(user?.department === "GROWTH MANAGEMENT" || user?.department === "MANAGEMENT") && (
            <li className="nav-item mb-3">
              <button
                className={`nav-link w-100 rounded ${
                  activeItem === "growth-management"
                    ? "bg-dark text-white fw-bold"
                    : "bg-light text-dark"
                }`}
                onClick={() =>
                  handleItemClick("growth-management", "/growth-management")
                }
              >
                Growth Manage
              </button>
            </li>
          )}

          {/* MESSAGE */}
          <li className="nav-item mb-3 position-relative">
            <button
              className={`nav-link w-100 rounded ${
                activeItem === "message"
                  ? "bg-dark text-white fw-bold"
                  : "bg-light text-dark"
              }`}
              onClick={() => handleItemClick("message", "/message")}
            >
              Message
              {hasPendingMessageDot && (
                <span
                  className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                  style={{ width: "10px", height: "10px" }}
                ></span>
              )}
            </button>
          </li>
        </ul>
      </div>

      {/* Logout */}
      <div className="text-center mt-auto pb-3">
        <button
          className="btn btn-outline-danger d-flex align-items-center justify-content-center w-100"
          onClick={handleLogout}
        >
          Logout{" "}
          <img
            src={icon}
            alt="Logout Icon"
            className="ms-2"
            style={{ width: "16px" }}
          />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
