import React, { useEffect } from "react";

export type FormValue = string | number | boolean | null | File;

export type FormColumns = {
    name: string;
    label: string;
    inputType: 'input' | 'textarea' | 'select' | 'checkbox' | 'radio';
    value?: FormValue;
    type?: string;
    placeholder?: string;
    required?: boolean;
    options?: { value: string | number; label: string }[];
    position?: 'right' | 'left' | 'center';
    render?: (props: {
        value: FormValue;
        onChange: (value: FormValue) => void;
        error: string | undefined;
        column: FormColumns;
    }) => React.ReactNode;


};

type FormProps = {
    isOpen: boolean;
    type: 'create' | 'edit';
    title: string;
    onClose: () => void;
    onSubmit: (data: Record<string, FormValue>) => void;
    columns: FormColumns[];
};

export const Form: React.FC<FormProps> = ({
    isOpen,
    type,
    title,
    onClose,
    onSubmit,
    columns,
}) => {
    const [formData, setFormData] = React.useState<Record<string, FormValue>>({});
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const baseInputClasses = "w-full px-3 py-2 text-sm transition-colors border rounded-lg shadow-sm bg-white text-gray-900 placeholder-gray-400 border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:border-gray-700";
    const errorInputClasses = "border-red-300 focus:ring-red-400 focus:border-red-400 dark:border-red-500 dark:focus:ring-red-500";

    // ریست فرم و پر کردن با مقادیر اولیه (از value یا itemName)
    useEffect(() => {
        if (!isOpen) return;

        const initialData = columns.reduce<Record<string, FormValue>>((acc, col) => {
            if (col.value !== undefined && col.value !== null) {
                acc[col.name] = col.value;
            } else if (type === 'edit' && col.name === 'name') {
                acc[col.name] = '';
            } else {
                acc[col.name] = col.inputType === 'checkbox' ? false : '';
            }
            return acc;
        }, {});

        setFormData(initialData);
        setErrors({});
    }, [isOpen, type, columns]);

    if (!isOpen) return null;

    const handleChange = (name: string, value: FormValue) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        columns.forEach((col) => {
            const val = formData[col.name];
            if (col.required) {
                if (col.inputType === 'checkbox') {
                    if (val !== true) {
                        newErrors[col.name] = `${col.label} الزامی است.`;
                    }
                } else if (!val || (Array.isArray(val) && val.length === 0)) {
                    newErrors[col.name] = `${col.label} الزامی است.`;
                }
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit(formData);
    };

    const renderInput = (col: FormColumns) => {
        const error = errors[col.name];
        const currentValue = formData[col.name];

        // ✅ اولویت با render سفارشی
        if (col.render) {
            return col.render({
                value: currentValue,
                onChange: (value) => handleChange(col.name, value),
                error,
                column: col
            });
        }

        // رندر پیش‌فرض بر اساس inputType
        switch (col.inputType) {
            case 'input':
                return (
                    <input
                        type={col.type || 'text'}
                        name={col.name}
                        id={col.name}
                        value={(currentValue ?? '') as string | number | readonly string[] | undefined}
                        onChange={(e) => handleChange(col.name, e.target.value)}
                        placeholder={col.placeholder}
                        className={`${baseInputClasses} ${error ? errorInputClasses : ''}`}
                    />
                );

            case 'textarea':
                return (
                    <textarea
                        name={col.name}
                        id={col.name}
                        value={(currentValue ?? '') as string | number | readonly string[] | undefined}
                        onChange={(e) => handleChange(col.name, e.target.value)}
                        placeholder={col.placeholder}
                        rows={3}
                        className={`${baseInputClasses} ${error ? errorInputClasses : ''}`}
                    />
                );

            case 'select':
                return (
                    <select
                        name={col.name}
                        id={col.name}
                        value={(currentValue ?? '') as string | number | readonly string[] | undefined}
                        onChange={(e) => handleChange(col.name, e.target.value)}
                        className={`${baseInputClasses} ${error ? errorInputClasses : ''}`}
                    >
                        <option value="">{col.placeholder || 'انتخاب کنید...'}</option>
                        {col.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                );

            case 'checkbox':
                return (
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name={col.name}
                            id={col.name}
                            checked={!!currentValue}
                            onChange={(e) => handleChange(col.name, e.target.checked)}
                            className={`w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 dark:bg-gray-800 dark:border-gray-600 ${error ? 'border-red-400 focus:ring-red-500 dark:border-red-500' : ''}`}
                        />
                        <label htmlFor={col.name} className="text-sm text-gray-600 dark:text-gray-300">
                            {col.label}
                        </label>
                    </div>
                );

            case 'radio':
                return (
                    <div className="space-y-2">
                        {col.options?.map((opt) => (
                            <div key={opt.value} className="flex items-center">
                                <input
                                    type="radio"
                                    name={col.name}
                                    id={`${col.name}-${opt.value}`}
                                    checked={currentValue === opt.value}
                                    onChange={() => handleChange(col.name, opt.value)}
                                    className={`w-4 h-4 border-gray-300 text-teal-600 focus:ring-teal-500 dark:bg-gray-800 dark:border-gray-600 ${error ? 'border-red-400 focus:ring-red-500 dark:border-red-500' : ''}`}
                                />
                                <label htmlFor={`${col.name}-${opt.value}`} className="mr-2 text-sm text-gray-600 dark:text-gray-300">
                                    {opt.label}
                                </label>
                            </div>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl border bg-white/95 p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900/95">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {columns.map((col) => (
                        <div key={col.name}
                            className={`flex w-full flex-col items-stretch ${col.position === 'left' ? 'items-start' : col.position === 'center' ? 'items-center' : 'items-stretch'} ${col.inputType === 'checkbox' ? 'md:flex-row md:items-center md:gap-2' : ''}`}
                        >
                            {col.inputType !== 'checkbox' && col.inputType !== 'radio' && (
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor={col.name}>
                                    {col.label} {col.required && <span className="text-red-500">*</span>}
                                </label>
                            )}

                            {renderInput(col)}

                            {errors[col.name] && (
                                <p className="mt-2 text-sm text-red-500 dark:text-red-400">{errors[col.name]}</p>
                            )}
                        </div>
                    ))}

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
                        >
                            انصراف
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                        >
                            {type === 'create' ? 'ایجاد' : 'ذخیره'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};