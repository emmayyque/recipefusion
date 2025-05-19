import React, { useState } from "react";
import "./Login.css";
import * as Icons from "react-icons/fa6";
import loginImage from "../../assets/Images/login.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Loader from "../Loader";
const baseURL =  import.meta.env.VITE_NODE_URL 

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpStep, setOtpStep] = useState(1); 
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${baseURL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      const {
        role,
        username,
        gender,
        phone,
        userId,
        message,
        email: returnedEmail,
      } = res.data;

      localStorage.setItem("username", username);
      localStorage.setItem("userId", userId);
      localStorage.setItem("email", returnedEmail);
      localStorage.setItem("phone", phone);
      localStorage.setItem("gender", gender);
      localStorage.setItem("role", role);

      setLoading(false); 

      await Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: message || "You are now logged in",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate(role === 1 ? "/admindashboard" : "/userdashboard");
    } catch (err) {
      setLoading(false); 
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          err.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  return (
    <div id="logsign" className="login-signup-container">
      {loading && <Loader />}

      <header className="navbar">
        <h1 className="nav-heading">
          <span>Recipe</span>Fusion
        </h1>
        <div className="nav-button">
          <button className="btn-login" onClick={() => navigate("/home")}>
            Home
          </button>
        </div>
      </header>

      <div className="auth-container">
        <div className="leftSection">
          <h2 className="section-title">Welcome Back</h2>
          <form onSubmit={handleLogin}>
            <div className="input-container">
              <Icons.FaEnvelope className="icons-colored" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-container">
              <Icons.FaLockOpen className="icons-colored" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="forgot-password">
              <button
                type="button"
                className="forgot-btn"
                onClick={() => setShowForgotModal(true)}
              >
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="btn-login">
              Login
            </button>
          </form>

          <p className="form-text">
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>

        <div className="rightSection">
          <div className="logo-container">
            <h1 className="section-title">Recipe Fusion</h1>
          </div>
          <img src={loginImage} alt="Login Illustration" />
        </div>
      </div>

      {/* forgot pass  */}
      {showForgotModal && (
        <div className="modal-overlay">
          <div className="modal">
            {/* enter email to send OTP form */}
            {otpStep === 1 && (
              <>
                <h2>Forgot Password</h2>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    try {
                      await axios.post(
                        `${baseURL}/api/auth/forgot-password`,
                        {
                          email: forgotEmail,
                        }
                      );

                      Swal.fire({
                        icon: "success",
                        title: "Email Sent",
                        text: "OTP sent to your email.",
                      });

                      setOtpStep(2);
                    } catch (err) {
                      setLoading(false); 
                      Swal.fire({
                        icon: "error",
                        title: "Failed",
                        text:
                          err.response?.data?.message || "Could not send OTP.",
                      });
                      console.log(err);
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  <p>Enter your email to receive OTP</p>
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                  <div className="modal-actions">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => {
                        setShowForgotModal(false);
                        setOtpStep(1);
                        setOtp(new Array(6).fill(""));
                        setForgotEmail("");
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-submit">
                      Send OTP
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* enter the otp form */}
            {otpStep === 2 && (
              <>
                <div className="flex flex-col gap-4 w-full">
                  <label
                    htmlFor="otp"
                    className="text-sm font-medium text-gray-700"
                  >
                    Enter 6-digit OTP
                  </label>
                  <div className="otp-container">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        id={`otp-${index}`}
                        className="otp-input"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        onFocus={(e) => e.target.select()}
                      />
                    ))}
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    className="btn-cancel"
                    onClick={() => {
                      setOtpStep(1);
                      setOtp(new Array(6).fill(""));
                    }}
                  >
                    Back
                  </button>
                  <button
                    className="btn-submit"
                    onClick={async () => {
                      const enteredOtp = otp.join("");
                      if (enteredOtp.length !== 6) {
                        return Swal.fire({
                          icon: "warning",
                          title: "Invalid OTP",
                          text: "Please enter a 6-digit OTP.",
                        });
                      }

                      setLoading(true);
                      try {
                        await axios.post(
                          `${baseURL}/api/auth/verify-otp`,
                          {
                            email: forgotEmail,
                            otp: enteredOtp,
                          }
                        );

                        setOtpStep(3);
                      } catch (err) {
                        setLoading(false); 
                        Swal.fire({
                          icon: "error",
                          title: "OTP Verification Failed",
                          text:
                            err.response?.data?.message ||
                            "Invalid or expired OTP.",
                        });
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    Verify OTP
                  </button>
                </div>
              </>
            )}

            {/* reset pass form */}
            {otpStep === 3 && (
              <>
                <h2>Reset Password</h2>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();

                    if (newPassword !== confirmPassword) {
                      setLoading(false); 
                      return Swal.fire({
                        icon: "warning",
                        title: "Password Mismatch",
                        text: "Passwords do not match.",
                      });
                    }

                    setLoading(true);
                    try {
                      await axios.post(
                        `${baseURL}/api/auth/reset-password`,
                        {
                          email: forgotEmail,
                          newPassword,
                          confirmPassword,
                        }
                      );
                      setLoading(false); 
                      Swal.fire({
                        icon: "success",
                        title: "Password Updated",
                        text: "You can now log in with your new password.",
                      });

                      setShowForgotModal(false);
                      setOtpStep(1);
                      setOtp(new Array(6).fill(""));
                      setForgotEmail("");
                      setNewPassword("");
                      setConfirmPassword("");
                    } catch (err) {
                      setLoading(false); 
                      Swal.fire({
                        icon: "error",
                        title: "Reset Failed",
                        text:
                          err.response?.data?.message ||
                          "Could not reset password. Try again.",
                      });
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  <input type="email" value={forgotEmail} readOnly />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <div className="modal-actions">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => setShowForgotModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-submit">
                      Submit
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
