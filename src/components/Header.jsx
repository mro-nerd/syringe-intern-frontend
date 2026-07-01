/**
 * Header — app branding and subtitle.
 */
const Header = () => {
  return (
    <header className="header">
      <div className="header__content">
        <div className="header__brand">
          <div className="header__logo">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="36" y2="36">
                  <stop offset="0%" stopColor="#6C63FF" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
              <rect width="36" height="36" rx="10" fill="url(#logoGrad)" />
              <path
                d="M18 8L18 28M12 14L18 8L24 14M12 22L18 28L24 22"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h1 className="header__title">Syringe.ai</h1>
            <p className="header__subtitle">Async Task Processing Dashboard</p>
          </div>
        </div>
        <div className="header__status">
          <span className="header__dot" />
          <span className="header__status-text">System Online</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
