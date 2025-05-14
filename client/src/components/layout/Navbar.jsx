import { useState, useEffect } from 'react';
import { FiSun, FiMoon, FiSettings, FiMenu, FiX } from 'react-icons/fi';
import { IoLogInOutline, IoPersonOutline, IoLogOutOutline, IoHomeOutline, IoDocumentTextOutline, IoListOutline, IoInformationCircleOutline, IoMailOutline, IoNewspaperOutline, IoClipboardOutline, IoCheckmarkDoneOutline } from 'react-icons/io5';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import LazyImage from '../common/LazyImage';
import '../../assets/styles/layout/navbar.scss';

const Navbar = ({ theme, handleThemeChange, showThemeMenu, toggleThemeMenu, themeMenuRef }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      
      // Close mobile menu if screen becomes larger
      if (window.innerWidth > 992 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);
  
  const handleThemeSelection = (newTheme) => {
    handleThemeChange(newTheme);
    toggleThemeMenu(false); // Close the menu after selection
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close theme menu if it's open when toggling mobile menu
    if (showThemeMenu) {
      toggleThemeMenu(false);
    }
  };
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  const handleNavigation = (path) => {
    navigate(path);
    closeMobileMenu();
  };
  
  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };
  
  // Check if user is an editor
  const isEditor = user && user.role === "editor";
  
  // Check if user is a reviewer
  const isReviewer = user && user.role === "reviewer";
  
  // Check if user is an admin
  const isAdmin = user && user.role === "admin";

  // Navigation links component to avoid repetition
  const NavLinks = ({ mobile = false }) => (
    <ul className={mobile ? "nav-tabs-mobile" : "nav-tabs"}>
      <li className="nav-item">
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          onClick={mobile ? closeMobileMenu : undefined}
          title="Home"
        >
          <IoHomeOutline className="nav-icon" /> 
          <span className="nav-text">Home</span>
        </NavLink>
      </li>
      
      {isAuthenticated && (
        <>
          {isAdmin && (
            <>
              <li className="nav-item">
                <NavLink 
                  to="/add-journal" 
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  onClick={mobile ? closeMobileMenu : undefined}
                  title="Add Journal"
                >
                  <IoNewspaperOutline className="nav-icon" /> 
                  <span className="nav-text">Add Journal</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/add-editor" 
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  onClick={mobile ? closeMobileMenu : undefined}
                  title="Add Editor"
                >
                  <IoPersonOutline className="nav-icon" /> 
                  <span className="nav-text">Add Editor</span>
                </NavLink>
              </li>
            </>
          )}
          
          {!isEditor && !isAdmin && (
            <>
              <li className="nav-item">
                <NavLink 
                  to="/add-article" 
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  onClick={mobile ? closeMobileMenu : undefined}
                  title="Add Article"
                >
                  <IoDocumentTextOutline className="nav-icon" /> 
                  <span className="nav-text">Add Article</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/articles" 
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  onClick={mobile ? closeMobileMenu : undefined}
                  title="View Articles"
                >
                  <IoListOutline className="nav-icon" /> 
                  <span className="nav-text">My Articles</span>
                </NavLink>
              </li>
              
              {/* Review tab - only shown for reviewers */}
              {isReviewer && (
                <li className="nav-item">
                  <NavLink 
                    to="/review" 
                    className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                    onClick={mobile ? closeMobileMenu : undefined}
                    title="Review Articles"
                  >
                    <IoCheckmarkDoneOutline className="nav-icon" /> 
                    <span className="nav-text">Review</span>
                  </NavLink>
                </li>
              )}
            </>
          )}
          
          {isEditor && !isAdmin && (
            <>
              <li className="nav-item">
                <NavLink 
                  to="/articles" 
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  onClick={mobile ? closeMobileMenu : undefined}
                  title="Articles"
                >
                  <IoNewspaperOutline className="nav-icon" /> 
                  <span className="nav-text">Articles</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  to="/reviewer" 
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  onClick={mobile ? closeMobileMenu : undefined}
                  title="Reviewer"
                >
                  <IoClipboardOutline className="nav-icon" /> 
                  <span className="nav-text">Reviewer</span>
                </NavLink>
              </li>
            </>
          )}
        </>
      )}
      
      <li className="nav-item">
        <NavLink 
          to="/about" 
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          onClick={mobile ? closeMobileMenu : undefined}
          title="About"
        >
          <IoInformationCircleOutline className="nav-icon" /> 
          <span className="nav-text">About</span>
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink 
          to="/contact" 
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          onClick={mobile ? closeMobileMenu : undefined}
          title="Contact"
        >
          <IoMailOutline className="nav-icon" /> 
          <span className="nav-text">Contact</span>
        </NavLink>
      </li>
    </ul>
  );
  
  // Auth buttons component to avoid repetition
  const AuthButtons = ({ mobile = false }) => (
    <div className={mobile ? "auth-buttons-mobile" : "auth-buttons"}>
      {isAuthenticated ? (
        <>
          <button 
            className="user-button" 
            onClick={() => mobile ? handleNavigation('/profile') : navigate('/profile')}
            title={`Profile: ${user?.firstName || 'User'}`}
          >
            <IoPersonOutline className="button-icon" /> 
            <span className="button-text">{user?.firstName || 'Profile'}</span>
          </button>
          <button 
            className="logout-btn" 
            onClick={mobile ? handleLogout : logout}
            title="Logout"
          >
            <IoLogOutOutline className="button-icon" /> 
            <span className="button-text">Logout</span>
          </button>
        </>
      ) : (
        <button 
          className="login-btn" 
          onClick={() => mobile ? handleNavigation('/login') : navigate('/login')}
          title="Login"
        >
          <IoLogInOutline className="button-icon" /> 
          <span className="button-text">Login</span>
        </button>
      )}
    </div>
  );
  
  return (
    <nav className="navbar">      <div className="navbar__left">
        <Link to="/" className="logo">
          <LazyImage 
            src="/logo.png" 
            alt="Article Submission System" 
            className="logo-image" 
            height="40px" 
            width="40px" 
            showPlaceholder={false}
          />
          <span className="logo-title">Article Submission System</span>
        </Link>
        
        {/* Mobile menu toggle button */}
        <button 
          className="mobile-menu-toggle" 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
      
      {/* Navigation tabs placed in the center */}
      <div className="navbar__center desktop-only">
        <NavLinks />
      </div>
      
      <div className="navbar__right desktop-only">
        <div className="theme-dropdown" ref={themeMenuRef}>
          <button className="theme-toggle-btn" onClick={(e) => {
            e.stopPropagation(); // Prevent event from bubbling up
            toggleThemeMenu();
          }}
          title='Toggle Theme'
          >
            {theme === 'light' ? (
              <FiSun />
            ) : theme === 'dark' ? (
              <FiMoon />
            ) : (
              <FiSettings />
            )}
            <span className="theme-text">{theme.charAt(0).toUpperCase() + theme.slice(1)} Theme</span>
          </button>
          {showThemeMenu && (
            <div className="theme-dropdown-content show">
              <button 
                onClick={() => handleThemeSelection('light')}
                className={theme === 'light' ? 'active' : ''}
                title='Light Theme'
              >
                <FiSun /> Light
              </button>
              <button 
                onClick={() => handleThemeSelection('dark')}
                className={theme === 'dark' ? 'active' : ''}
                title='Dark Theme'
              >
                <FiMoon /> Dark
              </button>
              <button 
                onClick={() => handleThemeSelection('system')}
                className={theme === 'system' ? 'active' : ''}
                title='System Theme'
              >
                <FiSettings /> System
              </button>
            </div>
          )}
        </div>
        
        <AuthButtons />
      </div>
      
      {/* Mobile menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu__content">
          <NavLinks mobile={true} />
          
          <div className="mobile-menu__divider"></div>
          
          <div className="mobile-menu__themes">
            <h3>Theme</h3>
            <div className="theme-options">
              <button 
                onClick={() => handleThemeSelection('light')}
                className={`theme-option ${theme === 'light' ? 'active' : ''}`}
              >
                <FiSun /> Light
              </button>
              <button 
                onClick={() => handleThemeSelection('dark')}
                className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
              >
                <FiMoon /> Dark
              </button>
              <button 
                onClick={() => handleThemeSelection('system')}
                className={`theme-option ${theme === 'system' ? 'active' : ''}`}
              >
                <FiSettings /> System
              </button>
            </div>
          </div>
          
          <div className="mobile-menu__divider"></div>
          
          <AuthButtons mobile={true} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;