"use client"

import { Modal } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { closePostModal } from "@/lib/redux/slices/modalSlice";
import Composer from "@/components/feed/Composer";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function PostModal() {
    const open = useSelector((state: RootState) => state.modals.postModalOpen);
    const dispatch = useDispatch();

    return (
        <Modal
            open={open}
            onClose={() => dispatch(closePostModal())}
            className="flex justify-center items-center z-50"
        >
            <div className="w-full h-full sm:w-[600px] sm:h-fit bg-white sm:rounded-2xl outline-none relative p-4">
                {/* Close Button */}
                <div
                    className="p-2 hover:bg-gray-100 rounded-full w-fit cursor-pointer mb-2"
                    onClick={() => dispatch(closePostModal())}
                >
                    <XMarkIcon className="w-6 h-6 text-gray-700" />
                </div>

                <div className="max-h-[80vh] overflow-y-auto">
                    <Composer
                        type="post"
                        insideModal={true}
                        onSuccess={() => dispatch(closePostModal())} // Close after success
                    />
                </div>
            </div>
        </Modal>
    )
}
