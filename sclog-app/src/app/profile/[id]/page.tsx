import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface UserProfilePageProps {
  params: {
    id: string;
  };
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ params }) => {
  const { id } = params;
  const supabase = createClient();

  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || user.id !== id) {
        setError('접근 권한이 없거나 사용자를 찾을 수 없습니다.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('nickname, bio, profile_image_url')
        .eq('id', id)
        .single();

      if (error) {
        setError(error.message);
      } else if (data) {
        setNickname(data.nickname || '');
        setBio(data.bio || '');
        setProfileImageUrl(data.profile_image_url || null);
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [id, supabase]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImageFile(file);
      setProfileImageUrl(URL.createObjectURL(file)); // 미리보기 URL 생성
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let newProfileImageUrl = profileImageUrl;

    if (profileImageFile) {
      const fileExt = profileImageFile.name.split('.').pop();
      const fileName = `${id}.${fileExt}`;
      const filePath = `profile_images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars') // Supabase Storage 버킷 이름 (예: 'avatars')
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
      .eq('id', id);

    if (updateError) {
      setError(updateError.message);
    } else {
      alert('프로필 정보가 성공적으로 업데이트되었습니다.');
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="container mx-auto p-4">로딩 중...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">오류: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">사용자 프로필</h1>
      <p className="mb-6">사용자 ID: {id}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">닉네임</label>
          <input
            type="text"
            id="nickname"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">자기소개</label>
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
          <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">프로필 이미지</label>
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
            <div className="mt-4">
              <img src={profileImageUrl} alt="프로필 미리보기" className="w-24 h-24 rounded-full object-cover" />
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
