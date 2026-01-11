import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import "./NotFound.css";

interface NotFoundProps {
  code?: string;
  message?: string;
}

const NotFound = ({ code = "404", message = "We can't find the page that you're looking for :(" }: NotFoundProps) => {
  const location = useLocation();

  useEffect(() => {
    console.error(`${code} Error: User attempted to access route:`, location.pathname);
  }, [location.pathname, code]);

  // Split the code into two digits if it's 3 digits (like 404)
  // If it's not 3 digits, we'll just use the first and last parts
  const codeStr = code.toString();
  const firstDigit = codeStr.charAt(0);
  const lastDigit = codeStr.length > 1 ? codeStr.charAt(codeStr.length - 1) : "";

  return (
    <div className="error-page-container">
      <div className="room">
        <div className="cuboid">
          <div className="side"></div>
          <div className="side"></div>
          <div className="side"></div>
        </div>
        <div className="oops">
          <h2>OOPS!</h2>
          <p>{message}</p>
        </div>
        <div className="center-line">
          <div className="hole">
            <div className="ladder-shadow"></div>
            <div className="ladder"></div>
          </div>
          <div className="four" data-digit={firstDigit}>{firstDigit}</div>
          <div className="four" data-digit={lastDigit}>{lastDigit}</div>
          <div className="btn">
            <Link to="/">BACK TO HOME</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
