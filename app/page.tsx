'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import SignalWidget from '@/components/SignalWidget';

export default function LoginPage() {
  const router = useRouter();
  
  const [showForm, setShowForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [checkingNickname, setCheckingNickname] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Email validation (실시간)
  const validateEmail = useCallback((value: string) => {
    if (!value) {
      setEmailError('');
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('⚠ Invalid email format');
      return;
    }

    // 회원가입 모드에서는 @lakeheadu.ca만 허용
    if (isSignUp) {
      if (!value.endsWith('@lakeheadu.ca')) {
        setEmailError('⚠ Lakehead University email required');
        return;
      }
    } else {
      // 로그인 모드: @lakeheadu.ca와 @gmail.com 허용
      if (!value.endsWith('@lakeheadu.ca') && !value.endsWith('@gmail.com')) {
        setEmailError('⚠ Invalid email domain');
        return;
      }
    }

    setEmailError('');
  }, [isSignUp]);

  // 닉네임 로컬 검증 (길이, 특수문자)
  const validateNicknameLocal = useCallback((value: string) => {
    if (!value) {
      setNicknameError((prev) => {
        if (prev === '⚠ Nickname must be 2-10 characters' || 
            prev === '⚠ Unauthorized characters detected') {
          return '';
        }
        return prev;
      });
      return false;
    }

    // 길이 검증 (2-10자)
    if (value.length < 2 || value.length > 10) {
      setNicknameError('⚠ Nickname must be 2-10 characters');
      return false;
    }

    // 특수문자 검증 (영문자, 숫자, 언더스코어만 허용)
    const nicknameRegex = /^[a-zA-Z0-9_]+$/;
    if (!nicknameRegex.test(value)) {
      setNicknameError('⚠ Unauthorized characters detected');
      return false;
    }

    // 로컬 검증 통과 시 로컬 검증 관련 에러만 지움
    setNicknameError((prev) => {
      if (prev === '⚠ Nickname must be 2-10 characters' || 
          prev === '⚠ Unauthorized characters detected') {
        return '';
      }
      return prev;
    });
    return true;
  }, []);

  // Password validation (실시간)
  const validatePassword = useCallback((value: string) => {
    if (!value) {
      setPasswordError('');
      return;
    }

    if (value.length < 6) {
      setPasswordError('⚠ Password too short (min 6)');
      return;
    }

    setPasswordError('');
  }, []);

  // 이메일 실시간 검증
  useEffect(() => {
    validateEmail(email);
  }, [email, validateEmail]);

  // 닉네임 로컬 검증 (실시간)
  useEffect(() => {
    if (isSignUp) {
      validateNicknameLocal(nickname);
    }
  }, [nickname, isSignUp, validateNicknameLocal]);

  // 닉네임 중복 체크 (Debounce) - 회원가입 모드에서만
  useEffect(() => {
    if (!isSignUp || !nickname) {
      setCheckingNickname(false);
      return;
    }

    // 로컬 검증 통과 여부 확인
    const isLengthValid = nickname.length >= 2 && nickname.length <= 10;
    const nicknameRegex = /^[a-zA-Z0-9_]+$/;
    const hasValidChars = nicknameRegex.test(nickname);

    // 로컬 검증 실패 시 중복 체크하지 않음
    if (!isLengthValid || !hasValidChars) {
      setCheckingNickname(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      console.log('Checking Nickname:', nickname);
      setCheckingNickname(true);
      const supabase = createClient();
      
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('lower_nickname')
        .eq('lower_nickname', nickname.toLowerCase())
        .maybeSingle();

      if (existingUser) {
        setNicknameError('⚠ Nickname already in use');
      } else {
        setNicknameError((prev) => {
          if (prev === '⚠ Nickname already in use') {
            return '';
          }
          return prev;
        });
      }
      
      setCheckingNickname(false);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [nickname, isSignUp]);

  // 비밀번호 실시간 검증
  useEffect(() => {
    if (isSignUp || password) {
      validatePassword(password);
    }
  }, [password, isSignUp, validatePassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // 최종 검증
    validateEmail(email);
    if (isSignUp) {
      validateNicknameLocal(nickname);
    }
    validatePassword(password);
    
    // 회원가입 모드에서 비밀번호 확인 검증
    if (isSignUp && password !== confirmPassword) {
      setPasswordError('⚠ Passwords do not match');
      return;
    }
    
    if (emailError || (isSignUp && nicknameError) || passwordError) {
      return;
    }
    
    setIsPending(true);
    
    try {
      const supabase = createClient();
      
      let result;
      if (isSignUp) {
        result = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { nickname },
          },
        });
      } else {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      }
      
      if (result.error) {
        // 이메일 중복 체크
        if (result.error.message.includes('already registered') || 
            result.error.message.includes('User already registered')) {
          setEmailError('⚠ Email already registered');
        } else {
          setError(result.error.message);
        }
        setIsPending(false);
        return;
      }
      
      if (!result.data.session) {
        if (isSignUp) {
          // Signup successful but email verification required
          // profiles 테이블에 데이터 insert
          if (result.data.user) {
            const { error: profileError } = await supabase.from('profiles').insert([
              {
                id: result.data.user.id,
                nickname: nickname,
                lower_nickname: nickname.toLowerCase(),
                email: email
              },
            ]);

            if (profileError) {
              console.error('Profile Error:', profileError);
              setError('Failed to create profile');
              setIsPending(false);
              return;
            }
          }
          
          setShowSuccessModal(true);
          setIsPending(false);
        } else {
          setError('Session creation failed');
        }
        setIsPending(false);
        return;
      }
      
      // Trigger transition animation
      setIsTransitioning(true);
      
      // Wait for animation to complete before redirecting
      setTimeout(() => {
        window.location.href = '/station';
      }, 1500);
      
    } catch (err: any) {
      setError('An unexpected error occurred');
      setIsPending(false);
    }
  };

  const handleDotClick = () => {
    setShowForm(!showForm);
    if (showForm) {
      // Reset form on close
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setNickname('');
      setError('');
      setEmailError('');
      setPasswordError('');
      setNicknameError('');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white overflow-hidden">
      
      {/* Signal Widget */}
      <SignalWidget />
      
      {/* Transition Animation Overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
          <div 
            className="w-3 h-3 bg-gray-800 rounded-full"
            style={{
              animation: 'expandToScreen 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            }}
          />
        </div>
      )}

      {/* The Breathing Dot */}
      {!showForm && (
        <button
          onClick={handleDotClick}
          className="relative group focus:outline-none"
        >
          <div className="w-3 h-3 bg-gray-800 rounded-full animate-pulse shadow-lg hover:scale-110 transition-transform" />
        </button>
      )}

      {/* The Login/Signup Form */}
      {showForm && (
        <div className="w-full max-w-sm px-8 animate-fade-in">
          
          {/* Close Button (Dot) */}
          <div className="flex justify-center mb-8">
            <button
              onClick={handleDotClick}
              className="w-2 h-2 bg-gray-400 rounded-full hover:bg-gray-600 transition-colors"
            />
          </div>

          {/* Form Title - Removed for Login, keep for Signup */}
          {isSignUp && (
            <h1 className="text-center text-2xl font-light tracking-[0.4em] text-gray-800 mb-8">
              CREATE SIGNAL
            </h1>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            
            {/* Email */}
            <div>
              <label className="block text-xs font-light text-gray-600 tracking-wide mb-2">
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@lakeheadu.ca"
                className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-800 focus:outline-none focus:border-gray-600 transition-colors"
                required
                suppressHydrationWarning
              />
              {emailError && (
                <p className="text-xs text-[#ec4899] font-light mt-1">
                  {emailError}
                </p>
              )}
              {isSignUp && !emailError && (
                <p className="text-xs text-gray-400 font-light mt-1">
                  Must use @lakeheadu.ca email
                </p>
              )}
            </div>

            {/* Nickname (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label className="block text-xs font-light text-gray-600 tracking-wide mb-2">
                  NICKNAME
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Anonymous ID"
                  className={`w-full px-4 py-3 border text-sm text-gray-800 focus:outline-none transition-colors ${
                    nicknameError ? 'border-[#ec4899]' : 'border-gray-300 focus:border-gray-600'
                  }`}
                  required
                  suppressHydrationWarning
                />
                {nicknameError && (
                  <p className="text-xs text-[#ec4899] font-light mt-1">
                    {nicknameError}
                  </p>
                )}
                {!nicknameError && (
                  <p className="text-xs text-gray-400 font-light mt-1">
                    Anonymous, but offensive names will be forcibly changed by DCEK.
                  </p>
                )}
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-light text-gray-600 tracking-wide mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-10 border border-gray-300 text-sm text-gray-800 focus:outline-none focus:border-gray-600 transition-colors"
                  required
                  minLength={6}
                  suppressHydrationWarning
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label className="block text-xs font-light text-gray-600 tracking-wide mb-2">
                  CONFIRM PASSWORD
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-10 border border-gray-300 text-sm text-gray-800 focus:outline-none focus:border-gray-600 transition-colors"
                    required
                    minLength={6}
                    suppressHydrationWarning
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Password Error */}
            {passwordError && (
              <p className="text-xs text-[#ec4899] font-light mt-1">
                {passwordError}
              </p>
            )}

            {/* General Error Message */}
            {error && (
              <p className="text-xs text-[#ec4899] font-light">
                ⚠ {error}
              </p>
            )}

            {/* Submit Button - Four Blocks */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-6 mt-4 flex items-center justify-center gap-2 disabled:opacity-50 group"
            >
              <div className={`w-3 h-3 bg-gray-800 transition-all duration-300 ${
                isPending ? 'animate-pulse' : 'group-hover:shadow-[0_0_10px_rgba(0,0,0,0.5)]'
              }`} />
              <div className={`w-3 h-3 bg-gray-800 transition-all duration-300 ${
                isPending ? 'animate-pulse' : 'group-hover:shadow-[0_0_10px_rgba(0,0,0,0.5)]'
              }`} style={{ animationDelay: '0.1s' }} />
              <div className={`w-3 h-3 bg-gray-800 transition-all duration-300 ${
                isPending ? 'animate-pulse' : 'group-hover:shadow-[0_0_10px_rgba(0,0,0,0.5)]'
              }`} style={{ animationDelay: '0.2s' }} />
              <div className={`w-3 h-3 bg-gray-800 transition-all duration-300 ${
                isPending ? 'animate-pulse' : 'group-hover:shadow-[0_0_10px_rgba(0,0,0,0.5)]'
              }`} style={{ animationDelay: '0.3s' }} />
            </button>

            {/* Toggle Sign Up / Login */}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setEmailError('');
                setPasswordError('');
                setNicknameError('');
                setConfirmPassword('');
              }}
              className="w-full text-xs text-gray-500 hover:text-gray-800 transition-colors font-light tracking-wide mt-6"
            >
              {isSignUp ? 'RETURN' : 'CREATE'}
            </button>
          </form>
        </div>
      )}

      <style jsx>{`
        @keyframes expandToScreen {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(200);
          }
        }
      `}</style>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white border border-gray-300 p-8 shadow-lg text-center">
            <h2 className="text-xl font-light tracking-[0.3em] text-gray-800 mb-4">
              INITIALIZATION SUCCESSFUL
            </h2>
            <p className="text-xs text-gray-600 font-light mb-6">
              Account created successfully! Please check your email to verify your account before logging in.
            </p>
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 border border-gray-800 text-xs font-light tracking-wide text-gray-800 hover:bg-gray-800 hover:text-white transition-colors"
            >
              CONFIRM
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
