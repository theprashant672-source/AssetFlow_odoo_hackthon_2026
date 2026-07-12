import { useState, useEffect } from 'react';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
}

export default function AuthPage({ initialMode = 'login' }: AuthPageProps) {
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const toggleMode = (e: React.MouseEvent) => {
    e.preventDefault();
    setMode(mode === 'login' ? 'signup' : 'login');
    window.history.pushState({}, '', mode === 'login' ? '/signup' : '/login');
  };

  const isLogin = mode === 'login';

  const inputClass = "w-full py-3 pr-4 pl-11 border border-gray-200 rounded-lg text-base outline-none transition-colors focus:border-[#71388b] focus:ring-4 focus:ring-[#71388b]/10";
  const labelClass = "text-sm font-semibold text-gray-700";
  const iconClass = "absolute left-4 text-gray-400";
  const rightIconClass = "absolute right-4 text-gray-400 cursor-pointer";

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white font-sans text-gray-900">
      {/* Left Panel */}
      <div className="flex-1 bg-gradient-to-br from-[#f4ebf8] to-[#ebe0f3] flex flex-col justify-between p-8 lg:p-16 lg:max-w-md w-full">
        <div className="flex flex-col gap-8 my-auto">
          <div className="w-full max-w-[320px] mx-auto block">
            {isLogin ? (
              <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Placeholder for Login Illustration */}
                <rect x="100" y="80" width="200" height="150" rx="16" fill="#D8B4E2" fillOpacity="0.5"/>
                <path d="M150 100 L250 100 L280 140 L120 140 Z" fill="#9C4F96" fillOpacity="0.8"/>
                <rect x="140" y="140" width="120" height="90" fill="#7D3E78"/>
                <circle cx="80" cy="80" r="24" fill="white" />
                <circle cx="320" cy="180" r="24" fill="white" />
                <circle cx="90" cy="220" r="20" fill="white" />
              </svg>
            ) : (
              <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Placeholder for Signup Illustration */}
                <rect x="140" y="50" width="120" height="180" rx="8" fill="white" stroke="#9C4F96" strokeWidth="4"/>
                <path d="M160 90 H240 M160 120 H240 M160 150 H210" stroke="#D8B4E2" strokeWidth="4" strokeLinecap="round"/>
                <circle cx="260" cy="180" r="40" fill="#9C4F96" />
                <path d="M245 180 L255 190 L275 170" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M170 30 H230 V50 H170 V30 Z" fill="#7D3E78" />
              </svg>
            )}
          </div>
          
          <div>
            <h1 className="text-4xl text-[#2d1840] mb-4 font-bold">{isLogin ? 'Welcome Back!' : 'Create Your Account'}</h1>
            <p className="text-[#58416d] text-lg leading-relaxed mb-10">
              {isLogin 
                ? 'Log in to access your asset management dashboard and resources.' 
                : 'Sign up to get started with AssetFlow and streamline your operations.'}
            </p>
            
            <div className="flex flex-col gap-5">
              {isLogin ? (
                <>
                  <div className="flex items-center gap-4 text-[#4a335f] font-medium text-base">
                    <span className="flex items-center justify-center w-6 h-6 bg-[#71388b] text-white rounded-full p-1 text-sm">✓</span>
                    Manage Assets Efficiently
                  </div>
                  <div className="flex items-center gap-4 text-[#4a335f] font-medium text-base">
                    <span className="flex items-center justify-center w-6 h-6 bg-[#71388b] text-white rounded-full p-1 text-sm">✓</span>
                    Track Allocations & Bookings
                  </div>
                  <div className="flex items-center gap-4 text-[#4a335f] font-medium text-base">
                    <span className="flex items-center justify-center w-6 h-6 bg-[#71388b] text-white rounded-full p-1 text-sm">✓</span>
                    Ensure Maintenance & Compliance
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4 text-[#4a335f] font-medium text-base">
                    <span className="flex items-center justify-center w-6 h-6 bg-[#71388b] text-white rounded-full p-1 text-sm">✓</span>
                    Centralized Asset Management
                  </div>
                  <div className="flex items-center gap-4 text-[#4a335f] font-medium text-base">
                    <span className="flex items-center justify-center w-6 h-6 bg-[#71388b] text-white rounded-full p-1 text-sm">✓</span>
                    Smart Allocation & Scheduling
                  </div>
                  <div className="flex items-center gap-4 text-[#4a335f] font-medium text-base">
                    <span className="flex items-center justify-center w-6 h-6 bg-[#71388b] text-white rounded-full p-1 text-sm">✓</span>
                    Real-time Reports & Insights
                  </div>
                  <div className="flex items-center gap-4 text-[#4a335f] font-medium text-base">
                    <span className="flex items-center justify-center w-6 h-6 bg-[#71388b] text-white rounded-full p-1 text-sm">✓</span>
                    Secure & Reliable Platform
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-[1.5] flex justify-center items-center p-8 lg:p-16 w-full">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-3xl text-[#1a1a1a] mb-2 font-bold">{isLogin ? 'Log In' : 'Sign Up'}</h2>
            <p className="text-gray-500">{isLogin ? 'Enter your credentials to continue' : 'Fill in the details to create your account'}</p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
            {!isLogin && (
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Full Name</label>
                <div className="relative flex items-center">
                  <svg className={iconClass} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input type="text" className={inputClass} placeholder="Enter your full name" />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className={labelClass}>Email Address</label>
              <div className="relative flex items-center">
                <svg className={iconClass} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <input type="email" className={inputClass} placeholder="Enter your email" />
              </div>
            </div>

            {!isLogin && (
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Mobile Number</label>
                <div className="flex gap-2">
                  <select className="w-[100px] p-3 border border-gray-200 rounded-lg bg-white outline-none">
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                  </select>
                  <div className="relative flex items-center flex-1">
                    <input type="tel" className={`${inputClass} !pl-4`} placeholder="Enter your mobile number" />
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className={labelClass}>Password</label>
              <div className="relative flex items-center">
                <svg className={iconClass} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className={inputClass} 
                  placeholder={isLogin ? "Enter your password" : "Create a password"} 
                />
                <svg 
                  className={rightIconClass} 
                  onClick={() => setShowPassword(!showPassword)}
                  xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  {showPassword ? (
                    <><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></>
                  ) : (
                    <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>
                  )}
                </svg>
              </div>
            </div>

            {isLogin && (
              <a href="#" className="self-end text-[#71388b] text-sm font-semibold hover:underline">Forgot password?</a>
            )}

            {!isLogin && (
              <>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Confirm Password</label>
                  <div className="relative flex items-center">
                    <svg className={iconClass} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      className={inputClass} 
                      placeholder="Confirm your password" 
                    />
                    <svg 
                      className={rightIconClass} 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                      {showConfirmPassword ? (
                        <><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></>
                      ) : (
                        <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>
                      )}
                    </svg>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-2">
                  <p className="text-sm font-semibold text-slate-600 mb-3">Password must contain:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="flex items-center gap-2 text-xs text-[#10b981]"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> At least 8 characters</span>
                    <span className="flex items-center gap-2 text-xs text-[#10b981]"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> One uppercase letter</span>
                    <span className="flex items-center gap-2 text-xs text-[#10b981]"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> One number</span>
                    <span className="flex items-center gap-2 text-xs text-[#10b981]"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> One special character</span>
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="bg-[#71388b] hover:bg-[#5a2c6f] text-white border-none rounded-lg p-3.5 text-base font-semibold cursor-pointer transition-colors flex justify-center items-center gap-2 mt-4">
              {isLogin ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
                  Log In
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="flex items-center my-6 text-gray-400 text-sm before:content-[''] before:flex-1 before:h-px before:bg-gray-200 before:mr-4 after:content-[''] after:flex-1 after:h-px after:bg-gray-200 after:ml-4">or continue with</div>

          <div className="flex flex-col gap-3">
            <button type="button" className="flex items-center justify-center gap-3 p-3 border border-gray-200 rounded-lg bg-white text-gray-700 font-semibold cursor-pointer hover:bg-gray-50 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            <button type="button" className="flex items-center justify-center gap-3 p-3 border border-gray-200 rounded-lg bg-white text-gray-700 font-semibold cursor-pointer hover:bg-gray-50 transition-colors">
              <svg width="20" height="20" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0H0v10h10V0z" fill="#f25022"/>
                <path d="M21 0H11v10h10V0z" fill="#7fba00"/>
                <path d="M10 11H0v10h10V11z" fill="#00a4ef"/>
                <path d="M21 11H11v10h10V11z" fill="#ffb900"/>
              </svg>
              Continue with Microsoft
            </button>
          </div>

          <div className="text-center mt-8 text-gray-500 text-sm">
            {isLogin ? (
              <>Don't have an account? <a href="/signup" onClick={toggleMode} className="text-[#71388b] font-semibold hover:underline">Sign up</a></>
            ) : (
              <>Already have an account? <a href="/login" onClick={toggleMode} className="text-[#71388b] font-semibold hover:underline">Login</a></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
