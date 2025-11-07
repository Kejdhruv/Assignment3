import { useState } from "react";
import { FaShoppingCart, FaBoxOpen } from "react-icons/fa";
import Login from "./Login";
import SignUp from "./SignUp";
import "./Auth.css";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Left Side */}
        <div className="auth-left">
          <h1 className="auth-title">Nexora</h1>
          <p className="auth-subtitle">
            Discover and manage your orders seamlessly in one place.
          </p>

          <div className="auth-icons">
            <div className="icon-wrapper">
              <FaShoppingCart size={60} color="#2c3eaa" />
              <p>Shop</p>
            </div>
            <div className="icon-wrapper">
              <FaBoxOpen size={60} color="#2c3eaa" />
              <p>Orders</p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="auth-right">
          <div className="auth-header">
            <h2>{isLogin ? "Login" : "Sign Up"}</h2>
            <p>{isLogin ? "Welcome back! Please login." : "Create your account."}</p>
          </div>

          {isLogin ? (
            <Login />
          ) : (
            <SignUp onSignupSuccess={() => setIsLogin(true)} />
          )}

          <p className="auth-toggle">
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <button onClick={() => setIsLogin(false)}>Sign Up</button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={() => setIsLogin(true)}>Login</button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}