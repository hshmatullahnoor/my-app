import type React from "react";
import { useState } from "react";

type ChangePasswordProps = {
    OnChange: (oldPassword: string, newPassword: string, passwordConfirmition: string) => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ OnChange }) => {

    const [formData, setFormData] = useState<{ oldPass?: string | null, newPass?: string | null, passConfirm?: string | null }>({
        oldPass: null,
        newPass: null,
        passConfirm: null
    });

    const [error, setError] = useState<{ field: string | null, value: string | null }>({ field: null, value: null });

    const validate = () => {

        if (formData.oldPass == null) {
            setError({ field: 'oldPass', value: 'رمز عبور فعلی اجباریست' })
        }else if (formData.oldPass && formData.oldPass.length < 8) {
            setError({ field: 'oldPass', value: 'رمز عبور فعلی نباید کمتر از 8 کارکتر باشد' })
        }else if (formData.newPass == null) {
            setError({ field: 'newPass', value: 'رمز عبور جدید اجباریست' })
        }else if (formData.newPass && formData.newPass.length < 8) {
            setError({ field: 'newPass', value: 'رمز عبور جدید نباید کمتر از 8 کارکتر باشد' })
        }else if (formData.passConfirm == null) {
            setError({ field: 'passConfirm', value: 'تایید رمز عبور جدید اجباریست' })
        }else if (formData.passConfirm && formData.passConfirm.length < 8) {
            setError({ field: 'passConfirm', value: 'تایید رمز عبور جدید نباید کمتر از 8 کارکتر باشد' })
        }else if (formData.newPass !== formData.passConfirm) {
            setError({ field: 'passConfirm', value: 'رمز عبور و تکرار آن یکی نیستن' })
        }else {
            OnChange(formData.oldPass ?? '', formData.newPass ?? '', formData.passConfirm ?? '');
        }
    }

    return (
        <div className="flex shadow-lg w-[95%] flex-col items-center justify-start mx-auto mt-10 rounded-lg p-4 gap-2 dark:shadow-sm dark:shadow-white">
            <p className="font-bold text-gray-600 text-start dark:text-gray-300">تغییر رمز عبور</p>
            <div className="">
                <input
                    type="password"
                    name="old"
                    id="old"
                    className="w-full p-2 pr-8 mt-3 text-sm font-medium text-gray-900 transition-colors bg-white border border-gray-300 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                    placeholder="رمز عبور فعلی خود را وارد کنید"
                    onBlur={(e) => {
                        setFormData({ oldPass: e.target.value, newPass: formData.newPass, passConfirm: formData.passConfirm })
                    }}
                />

                {error && error.field == "oldPass" && (
                    <span className="text-sm text-red-500">{error.value}</span>
                )}

                <input
                    type="password"
                    name="new"
                    id="new"
                    className="w-full p-2 pr-8 mt-3 text-sm font-medium text-gray-900 transition-colors bg-white border border-gray-300 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                    placeholder="رمز عبور جدید خود را وارد کنید"
                    onBlur={(e) => {
                        setFormData({ newPass: e.target.value, oldPass: formData.oldPass, passConfirm: formData.passConfirm })
                    }}
                />

                {error && error.field == 'newPass' && (
                    <span className="text-sm text-red-500">{error.value}</span>
                )}

                <input
                    type="password"
                    name="confi
                    rm" id="confirm"
                    className="w-full p-2 pr-8 mt-3 text-sm font-medium text-gray-900 transition-colors bg-white border border-gray-300 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                    placeholder="رمز عبور جدید را تایید کنید"
                    onBlur={(e) => {
                        setFormData({ passConfirm: e.target.value, newPass: formData.newPass, oldPass: formData.oldPass })
                    }}
                />

                {error && error.field === 'passConfirm' && (
                    <span className="text-sm text-red-500">{error.value}</span>
                )}



            </div>
            <button
                onClick={() => {
                    validate()
                }}
                className="w-[60%] px-4 py-2 text-sm font-semibold text-white transition-colors bg-teal-600 rounded-lg shadow-md hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
            >
                ذخیره
            </button>
        </div>
    )
}

export default ChangePassword;