import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import "./NotFound.css";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

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
          <p>We can't find the page that you're looking for :(</p>
        </div>
        <div className="center-line">
          <div className="hole">
            <div className="ladder-shadow"></div>
            <div className="ladder"></div>
          </div>
          <div className="four">4</div>
          <div className="four">4</div>
          <div className="btn">
            <Link to="/">BACK TO HOME</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
