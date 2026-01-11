'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();

    // 1. Lakehead 이메일 검증
    if (!email.endsWith('@lakeheadu.ca')) {
      alert('Lakehead University 이메일만 사용 가능합니다.');
      setLoading(false);
      return;
    }

    // 2. 대소문자 구분 없는 닉네임 중복 체크 (lower_nickname 컬럼 활용)
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('lower_nickname')
      .eq('lower_nickname', nickname.toLowerCase())
      .maybeSingle();

    if (existingUser) {
      alert('이미 사용 중인 닉네임입니다. (대소문자 구분 없음)');
      setLoading(false);
      return;
    }

    // 3. Supabase Auth 회원가입 진행
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: nickname }, 
      },
    });

    if (signUpError) {
      alert(signUpError.message);
    } else if (data.user) {
      // 4. profiles 테이블에 닉네임 정보 저장
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: data.user.id,
          nickname: nickname, // 원래 닉네임 (표시용)
          lower_nickname: nickname.toLowerCase(), // 중복 체크용 (소문자)
          email: email
        },
      ]);

      if (profileError) {
        console.error('Profile Error:', profileError);
      } else {
        alert('회원가입 성공! 메일함에서 인증 링크를 확인해주세요.');
        router.push('/');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-mono">
      <img src="https://voidspaceplan.vercel.app/icon.png" alt="Void Logo" className="w-16 h-16 mb-6" />
      
      <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl shadow-[0_0_20px_rgba(236,72,153,0.1)] text-center">
        <h1 className="text-2xl font-bold mb-6 tracking-tighter">
          JOIN <span className="text-[#ec4899]">VOID STATION</span>
        </h1>

        <form onSubmit={handleSignUp} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="text-xs text-zinc-500 uppercase ml-1">Lakehead Email</label>
            <input
              type="email"
              placeholder="id@lakeheadu.ca"
              className="w-full bg-black border border-zinc-700 p-3 rounded-lg focus:outline-none focus:border-[#ec4899] transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-500 uppercase ml-1">Nickname</label>
            <input
              type="text"
              placeholder="Your Call Sign"
              className="w-full bg-black border border-zinc-700 p-3 rounded-lg focus:outline-none focus:border-[#ec4899] transition-all"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-500 uppercase ml-1">Access Key</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-black border border-zinc-700 p-3 rounded-lg focus:outline-none focus:border-[#ec4899] transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ec4899] hover:bg-pink-600 text-white font-bold py-4 rounded-lg mt-4 shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all disabled:opacity-50"
          >
            {loading ? 'SYNCING...' : 'INITIALIZE STATION LINK'}
          </button>
        </form>
      </div>
    </div>
  );
}
