import React from "react";

type CreateAdvertisingFormProps = {
    onClose: () => void;
    loginURL: string;
};

const TokenNotAllowed: React.FC<CreateAdvertisingFormProps> = ({ onClose, loginURL }) => {
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full p-6 transition-colors bg-white border border-gray-200 rounded-2xl shadow-2xl text-gray-900 max-w-[98%] md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100">
            <h2 className="flex items-center gap-4 mb-4 text-2xl font-bold">
                دسترسی غیرمجاز

                <svg xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="text-orange-500 bi bi-exclamation-triangle size-8"
                    viewBox="0 0 16 16">
                    <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z" />
                    <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
                </svg>

            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
                برای ایجاد آگهی جدید باید وارد شوید.
            </p>
            <div className="flex justify-end gap-4">
                <button type="button" className="px-4 py-2 font-medium text-white transition-colors bg-orange-500 border border-orange-500 rounded-md hover:bg-transparent hover:text-orange-500 dark:bg-orange-600 dark:border-orange-600 dark:hover:text-orange-400" onClick={onClose}>بستن</button>
                <button type="button" className="px-4 py-2 mr-2 font-medium text-white transition-colors bg-teal-500 border border-teal-500 rounded-md hover:bg-transparent hover:text-teal-500 dark:bg-teal-600 dark:border-teal-600 dark:hover:text-teal-400" onClick={() => window.location.href = loginURL}>ورود</button>
            </div>
        </div>
    </div>
    );
}

export default TokenNotAllowed;