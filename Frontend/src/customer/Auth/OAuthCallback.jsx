import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginSuccess } from "../../State/Auth/Action";
import { lOGIN_SUCCESS } from "../../State/Auth/ActionType";
import { getUser } from "../../State/Auth/Action";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // Store JWT in localStorage — SAME as email/password login!
      localStorage.setItem("jwt", token);

      // Dispatch login success to Redux — SAME action
      dispatch({ type: lOGIN_SUCCESS, payload: token });

      // Fetch user profile — SAME as email/password login!
      dispatch(getUser(token));

      // Redirect to home page
      navigate("/");
    } else {
      // No token — something went wrong
      navigate("/");
    }
  }, [searchParams, dispatch, navigate]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <p>Signing you in...</p>
    </div>
  );
};

export default OAuthCallback;