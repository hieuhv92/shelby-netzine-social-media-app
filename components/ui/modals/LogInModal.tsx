"use client"

import { ArrowUpTrayIcon, ChartBarIcon, ChatBubbleOvalLeftEllipsisIcon, EyeIcon, EyeSlashIcon, HeartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { Modal } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { closeLogInModal, openLoginModal } from "@/lib/redux/slices/modalSlice";

export default function LogInModal() {
    const [showPassword, setShowPassword] = useState(false);

    const isOpen = useSelector(
        (state: RootState) => state.modals.logInModalOpen
    );

    const dispatch: AppDispatch = useDispatch()

    return (
        <>
            <button
                className="w-full h-[48px] md:w-[88px] md:h-[40px] text-md md:text-sm border border-2 border-gray-100
                        rounded-full text-white font-bold hover:bg-white hover:bg-opacity-25 transition cursor-pointer"
                onClick={() => dispatch(openLoginModal())}>
                Log in
            </button>
            <Modal
                open={isOpen}
                onClose={() => dispatch(closeLogInModal())}
                className="flex justify-center items-center"
            >
                <div className="w-full h-full sm:w-[600px] sm:h-fit bg-white sm:rounded-full-xl outline-none">
                    <XMarkIcon
                        className="w-7 mt-5 ms-5 cursor-pointer"
                        onClick={() => dispatch(closeLogInModal())}
                    />
                    <div className="pt-10 pb-20 px-4 sm:px-20">
                        <h1 className="text-3xl font-bold mb-10">Log in to OpenHub</h1>
                        <div className="w-full space-y-5 mb-10">
                            <input
                                type="text"
                                className="w-full h-[54px] border border-gray-200 outline-none pl-3 rounded-[4px]
                             focus:border-[#F4AF01] transition"
                                placeholder="Name"
                            />
                            <input
                                type="email"
                                className="w-full h-[54px] border
                                 border-gray-200 outline-none pl-3 rounded-[4px]
                                 focus:border-[#F4AF01] transition"
                                placeholder="Email"
                            />
                            <div className="w-full h-[54px] border border-gray-200 
                                outline-none rounded-[4px] focus-within:border-[#F4AF01] 
                                transition flex items-center overflow-hidden pr-3">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full h-full ps-3 outline-none"
                                    placeholder="Password"
                                />
                                <div
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="w-7 h-7 text-gray-400 cursor-pointer">
                                    {!showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                                </div>
                            </div>
                        </div>
                        <button className="bg-[#F4AF01] text-white h-[48px]
                         rounded-full shadow-md mb-5 w-full">
                            Log In
                        </button>
                        <span className="mb-5 text-sm text-center block">Or</span>
                        <button className="bg-[#F4AF01] text-white h-[48px]
                         rounded-full shadow-md w-full">
                            Log In as Guest
                        </button>
                    </div>
                </div>
            </Modal >
        </>
    )
}
