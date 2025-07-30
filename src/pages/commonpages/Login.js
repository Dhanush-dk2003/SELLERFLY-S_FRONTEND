import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaLock, FaEnvelope } from "react-icons/fa";
import logo from "../../assets/Sellerfly.png";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [emailOrId, setEmailOrId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [validation, setValidation] = useState({ emailOrId: "", password: "" });
  const navigate = useNavigate();

  const validate = () => {
    let isValid = true;
    const val = { emailOrId: "", password: "" };

    const isEmail = /^\S+@\S+\.\S+$/.test(emailOrId);
    const isEmployeeId = /^SKSY\d{3,}$/.test(emailOrId); // Adjust format to your employee ID pattern

    if (!isEmail && !isEmployeeId) {
      val.emailOrId = "Enter a valid email or ID";
      isValid = false;
    }

    if (password.length < 6) {
      val.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setValidation(val);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const loggedInUser = await login(emailOrId, password);
    if (loggedInUser) {
      if (loggedInUser.role === "ADMIN") navigate("/admindashboard");
      else if (loggedInUser.role === "MANAGER") navigate("/managerdashboard");
      else navigate("/userdashboard");
    } else {
      setError("Invalid login credentials");
    }
  };

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.go(1);
    };
  }, []);

  return (
  <>
  <div className="position-absolute top-0 start-0 p-5">
    <img src={logo} alt="Logo" style={{ height: "80px" }} />
  </div>

  
    <div className="container d-flex justify-content-center align-items-center min-vh-100 min-vw-100 bg-body-secondary">
      <div className="p-4 bg-white rounded-4 shadow-sm w-100 mx-3" style={{ maxWidth: "400px" }}>
      

        <h4 className="text-center text-primary fw-bold mb-4">Welcome Back</h4>
        {error && <div className="alert alert-danger text-center py-2 px-3">{error}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">Email or ID</label>
            <div className="input-group">
              <span className="input-group-text"><FaEnvelope /></span>
              <input
                type="text"
                className={`form-control ${validation.emailOrId ? "is-invalid" : ""}`}
                placeholder="Enter your Email or ID"
                value={emailOrId}
                onChange={(e) => setEmailOrId(e.target.value)}
              />
            </div>
            {validation.emailOrId && <small className="text-danger">{validation.emailOrId}</small>}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text"><FaLock /></span>
              <input
                type="password"
                className={`form-control ${validation.password ? "is-invalid" : ""}`}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {validation.password && <small className="text-danger">{validation.password}</small>}
          </div>

          <button type="submit" className="btn btn-primary w-100 rounded-4 fw-semibold">Login</button>
        </form>

        <p className="mt-3 text-center small">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
    </>
  );
};

export default Login;
