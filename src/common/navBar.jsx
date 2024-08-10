import React from "react";
import { Link, NavLink } from "react-router-dom";
const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand" to="/">
        vidly
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse " id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <NavLink rel="stylesheet" to="/movies" className="nav-item nav-link ">
            Movies
          </NavLink>

          <NavLink
            rel="stylesheet"
            to="/customers"
            className="nav-item nav-link "
          >
            customers
          </NavLink>
          <NavLink rel="stylesheet" to="/rental" className="nav-item nav-link ">
            rentals
          </NavLink>

          <NavLink rel="stylesheet" to="/login" className="nav-item nav-link ">
            login
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
