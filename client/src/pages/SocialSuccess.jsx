import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const SocialSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const userId = searchParams.get("userId");
    if (token && userId) {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      toast.success("Social login successful!");
      navigate("/");
    } else {
      toast.error("Social login failed. Please try again.");
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <h2 className="text-xl font-bold">Processing social login...</h2>
    </div>
  );
};

export default SocialSuccess;
