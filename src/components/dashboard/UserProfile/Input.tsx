import type React from "react";
import { useState } from "react";

export type InputModalProps = {
    props: {
        name?: string;
        title?: string
        onClose?: () => void;
        onChange: (value?: string, record?: string) => void;
        record?: string;
        value: string;
    }
}

const InputModal: React.FC<InputModalProps> = ({props}) => {

    const [value, setValue] = useState<string | null>(null);

    // if(!props.open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md p-6 space-y-4 border border-gray-200 shadow-2xl rounded-2xl bg-white/95 dark:border-gray-700 dark:bg-gray-900/95">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">ویرایش کاربر {props.name}</h2>
                <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                    لطفا مقدار {props.title} جدید را وارد کنید
                </p>

                <input type="text" name="input" id="input" defaultValue={props.value}
                    className="w-full p-2 pr-8 mt-3 text-sm font-medium text-gray-900 transition-colors bg-white border border-gray-300 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                    placeholder={`لطفا ${props.name} را وارد کنید`}
                    onBlur={(e) => { setValue(e.target.value) }}
                />

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        onClick={props.onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors border border-gray-200 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
                    >
                        انصراف
                    </button>
                    <button
                        onClick={() => {
                            props.onChange(value ?? '', props.record)
                        }}
                        className="px-4 py-2 text-sm font-semibold text-white transition-colors bg-teal-600 rounded-lg shadow-md hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                    >
                        ذخیره
                    </button>
                </div>
            </div>
        </div>
    )
}

export default InputModal;