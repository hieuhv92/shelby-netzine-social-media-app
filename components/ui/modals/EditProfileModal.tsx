"use client";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeEditProfileModal } from "@/lib/redux/slices/modalSlice";
import { XMarkIcon, CameraIcon } from "@heroicons/react/24/outline";
import { setProfileLoading, setProfileUser } from "@/lib/redux/slices/profileSlice";
import { supabase } from "@/lib/supabase";

export default function EditProfileModal() {
    const dispatch = useDispatch();
    const { editProfileModalOpen } = useSelector((state: any) => state.modals);
    const { viewingUser } = useSelector((state: any) => state.profile);

    // Refs for hidden file inputs
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        display_name: "",
        bio: "",
        location: "",
        website: "",
        avatar_url: "",
        banner_url: "",
    });

    // File states for uploading
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);

    useEffect(() => {
        if (editProfileModalOpen && viewingUser?.user) {
            // Use setTimeout to push the state update to the end of the execution queue
            // This prevents the "cascading renders" error by running after the render cycle
            const timer = setTimeout(() => {
                setFormData({
                    display_name: viewingUser.user.display_name || "",
                    bio: viewingUser.user.bio || "",
                    location: viewingUser.user.location || "",
                    website: viewingUser.user.website || "",
                    avatar_url: viewingUser.user.avatar_url || "",
                    banner_url: viewingUser.user.banner_url || "",
                });
            }, 0);

            return () => clearTimeout(timer); // Clean up the timer if the component unmounts
        }
    }, [viewingUser, editProfileModalOpen]);

    if (!editProfileModalOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle image selection and preview
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, [`${type}_url`]: reader.result as string }));
            };
            reader.readAsDataURL(file);
            if (type === 'avatar') setAvatarFile(file);
            else setBannerFile(file);
        }
    };

    const uploadImage = async (file: File, folder: string) => {
        // 1. Create a unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `${viewingUser.user.id}-${Math.random()}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;

        // 2. Upload file to Supabase Storage
        const { data, error } = await supabase.storage
            .from('profile_assets') // The bucket name you just created
            .upload(filePath, file, {
                upsert: true // Overwrite if file exists
            });

        if (error) throw error;

        // 3. Get the Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('profile_assets')
            .getPublicUrl(filePath);

        return publicUrl;
    };

    const handleSave = async () => {
        try {
            let finalAvatarUrl = formData.avatar_url;
            let finalBannerUrl = formData.banner_url;

            // Upload new files if selected
            if (avatarFile) {
                finalAvatarUrl = await uploadImage(avatarFile, 'avatars');
            }
            if (bannerFile) {
                finalBannerUrl = await uploadImage(bannerFile, 'banners');
            }

            const response = await fetch(`/api/users/${viewingUser.user.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    avatar_url: finalAvatarUrl,
                    banner_url: finalBannerUrl
                }),
            });

            if (response.ok) {
                const updatedUser = await response.json();

                // 1. Update the profile data in Redux to reflect changes immediately
                dispatch(setProfileUser({
                    ...viewingUser,
                    user: updatedUser.user
                }));

                // 2. CLOSE THE MODAL
                dispatch(closeEditProfileModal());

                // 3. Optional: Reset file states
                setAvatarFile(null);
                setBannerFile(null);
            } else {
                const errorData = await response.json();
                console.error("Failed to update profile:", errorData.error);
            }
        } catch (err) {
            console.error("Save error:", err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
            <div className="bg-white w-full max-w-[600px] h-full sm:h-auto sm:max-h-[90vh] rounded-2xl overflow-hidden flex flex-col shadow-xl">

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2 sticky top-0 bg-white z-20">
                    <div className="flex items-center gap-6">
                        <button onClick={() => dispatch(closeEditProfileModal())} className="p-2 hover:bg-gray-200 rounded-full transition">
                            <XMarkIcon className="w-5 h-5 text-gray-900 font-bold" />
                        </button>
                        <h2 className="text-xl font-bold text-gray-900">Edit profile</h2>
                    </div>
                    <button onClick={handleSave} className="bg-black text-white px-4 py-1.5 rounded-full font-bold hover:bg-gray-800 transition">
                        Save
                    </button>
                </div>

                <div className="overflow-y-auto">
                    {/* Banner Section */}
                    <div className="relative h-48 bg-gray-200 group">
                        <img
                            src={formData.banner_url || "/assets/default-banner.jpg"}
                            className="w-full h-full object-cover brightness-75"
                            alt="banner"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <button
                                onClick={() => bannerInputRef.current?.click()}
                                className="p-3 bg-black/50 hover:bg-black/40 rounded-full text-white transition"
                            >
                                <CameraIcon className="w-6 h-6" />
                            </button>
                            <input type="file" ref={bannerInputRef} hidden accept="image/*" onChange={(e) => handleImageChange(e, 'banner')} />
                        </div>
                    </div>

                    {/* Avatar Section */}
                    <div className="px-4 relative mb-14">
                        <div className="absolute -top-16 left-4">
                            <div className="relative w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                                <img
                                    src={formData.avatar_url || "/assets/avatar.jpg"}
                                    className="w-full h-full object-cover brightness-75"
                                    alt="avatar"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button
                                        onClick={() => avatarInputRef.current?.click()}
                                        className="p-3 bg-black/50 hover:bg-black/40 rounded-full text-white transition"
                                    >
                                        <CameraIcon className="w-6 h-6" />
                                    </button>
                                    <input type="file" ref={avatarInputRef} hidden accept="image/*" onChange={(e) => handleImageChange(e, 'avatar')} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="p-4 space-y-6">
                        {/* Name Input */}
                        <div className="relative border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-[#F4AF01] focus-within:border-transparent">
                            <label className="block text-xs text-gray-500">Name</label>
                            <input name="display_name" type="text" value={formData.display_name} onChange={handleChange} className="block w-full border-0 p-0 text-gray-900 focus:ring-0 sm:text-sm bg-transparent outline-none" />
                        </div>

                        {/* Bio TextArea */}
                        <div className="relative border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-[#F4AF01] focus-within:border-transparent">
                            <label className="block text-xs text-gray-500">Bio</label>
                            <textarea name="bio" rows={3} value={formData.bio} onChange={handleChange} className="block w-full border-0 p-0 text-gray-900 focus:ring-0 sm:text-sm bg-transparent resize-none outline-none" />
                        </div>

                        {/* Location Input */}
                        <div className="relative border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-[#F4AF01] focus-within:border-transparent transition-all">
                            <label className="block text-xs text-gray-500">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Add your location"
                                className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 outline-none sm:text-sm bg-transparent"
                            />
                        </div>

                        {/* Website Input */}
                        <div className="relative border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-[#F4AF01] focus-within:border-transparent transition-all">
                            <label className="block text-xs text-gray-500">Website</label>
                            <input
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="Add your website"
                                className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 outline-none sm:text-sm bg-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}