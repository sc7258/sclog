'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

interface UserProfilePageProps {
  params?: Promise<{ id: string }>;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ params }) => {
  const supabase = useMemo(() => createClient(), []);
  const [routeId, setRouteId] = useState<string | null>(null);

  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const resolveParams = async () => {
      try {
        const resolved = await (params ?? Promise.resolve(undefined));
        if (cancelled) {
          return;
        }

        if (!resolved?.id) {
          setError('잘못된 프로필 요청입니다.');
          setLoading(false);
          return;
        }

        setRouteId(resolved.id);
      } catch {
        if (cancelled) {
          return;
        }
        setError('프로필 경로를 확인할 수 없습니다.');
        setLoading(false);
      }
    };

    resolveParams();

    return () => {
      cancelled = true;
    };
  }, [params]);

  useEffect(() => {
    if (!routeId) {
      return;
    }

    let cancelled = false;

    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) {
        return;
      }

      if (!user || user.id !== routeId) {
        setError('로그인 정보가 없거나 사용자를 찾을 수 없습니다.');
        setLoading(false);
        return;
      }

      const { data, error: profileError } = await supabase
        .from('users')
        .select('nickname, bio, profile_image_url')
        .eq('id', routeId)
        .single();

      if (cancelled) {
        return;
      }

      if (profileError) {
        setError(profileError.message);
      } else if (data) {
        setNickname(data.nickname || '');
        setBio(data.bio || '');
        setProfileImageUrl(data.profile_image_url || null);
      }

      setLoading(false);
    };

    fetchUserProfile();

    return () => {
      cancelled = true;
    };
  }, [routeId, supabase]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      setProfileImageUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!routeId) {
      setError('프로필 경로를 확인할 수 없습니다.');
      return;
    }

    setLoading(true);
    setError(null);

    let newProfileImageUrl = profileImageUrl;

    if (profileImageFile) {
      const fileExt = profileImageFile.name.split('.').pop();
      const fileName = `${routeId}.${fileExt}`;
      const filePath = `profile_images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, profileImageFile, { upsert: true });

      if (uploadError) {
        setError(uploadError.message);
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      newProfileImageUrl = publicUrlData.publicUrl;
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ nickname, bio, profile_image_url: newProfileImageUrl })
      .eq('id', routeId);

    if (updateError) {
      setError(updateError.message);
    } else {
      alert('회원 정보가 성공적으로 업데이트되었습니다.');
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="container mx-auto p-4">로딩 중...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">오류: {error}</div>;
  }

  if (!routeId) {
    return <div className="container mx-auto p-4">프로필 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">회원 정보 관리</h1>
      <p className="mb-6">회원 ID: {routeId}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
            닉네임
          </label>
          <input
            type="text"
            id="nickname"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력해주세요"
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            자기소개
          </label>
          <textarea
            id="bio"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="자신을 소개해주세요"
          ></textarea>
        </div>

        <div>
          <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">
            프로필 이미지
          </label>
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
            onChange={handleImageChange}
          />
          {profileImageUrl && (
            <div className="mt-4 h-24 w-24 overflow-hidden rounded-full">
              <Image
                src={profileImageUrl}
                alt="프로필 이미지"
                width={96}
                height={96}
                className="h-24 w-24 rounded-full object-cover"
                unoptimized
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={loading}
        >
          {loading ? '저장 중...' : '저장'}
        </button>
      </form>
    </div>
  );
};

export default UserProfilePage;
