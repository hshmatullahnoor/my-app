import React from "react";
import type { User } from "../../api/auth_api";
import { InfoIcon, MessageCircle, Phone, X } from "lucide-react";
import { BsTelegram } from "react-icons/bs";

const AdvertisingCallModal: React.FC<{ user: User; open: boolean; onClose: () => void }> = ({ user, open, onClose }) => {

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
            onClick={onClose}
        >
            <div
                className="dark:bg-gray-800 rounded-lg p-4 shadow-xl max-w-2xl w-full mx-4 min-h-80 max-h-[90vh] overflow-y-auto border border-gray-700 bg-white"
                onClick={(e) => e.stopPropagation()}
            >
                
                <div className="relative">
                    <button
                        className="absolute text-red-400 hover:text-red-600"
                        onClick={onClose}
                    >
                        <X />
                    </button>
                </div>

                {/* info */}
                <div className="p-4 mt-10 bg-teal-300 rounded-xl">
                    <span className="w-full mb-3 text-center text-black"><InfoIcon size={30} /></span>
                    <p className="text-gray-600 dark:text-gray-400">شما در حال تماشا اطلاعات تماس {user.name} هستید.</p>
                    <p className="text-gray-600 dark:text-gray-400">رفتار محترمانه و مودبانه وظیفه انسانی و نشانه شخصیت شماست</p>
                    <span className="text-xs text-gray-400 dark:text-gray-600">همچنین در صورت رفتار بد و گذارش شدن دسترسی به حساب کاربری تان محدود خواهد شد</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-5 mt-8">
                    <div className="p-6 flex items-center justify-between h-10 gap-2 text-white bg-blue-400 rounded-xl w-[45%]">
                        <Phone />
                        <span
                            onClick={() => {
                                
                            }}
                        >{user.show_phone ? user.phone ?? 'وارد نشده' : 'مخفی شده'}</span>
                    </div>

                    <div className="p-6 flex items-center justify-between h-10 gap-2 text-white bg-gray-400 rounded-xl w-[45%]">
                        <BsTelegram size={24} />
                        <span>{user.show_telegram ? user.telegram ?? 'وارد نشده' : 'مخفی شده'}</span>
                    </div>

                    <div className="p-6 flex items-center justify-center w-[80%] h-10 gap-5 text-teal-200 bg-teal-500 rounded-xl">
                        <MessageCircle />
                        <span>پیام داخلی</span>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default AdvertisingCallModal;