import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-lg text-gray-700 mb-6">The page you are looking for does not exist.</p>
      <Button>
        <Link to="/">Return to home page</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
