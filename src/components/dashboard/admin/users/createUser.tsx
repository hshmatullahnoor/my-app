import React from "react";
import CitySelector from "../../../CitySelector";
import Checkbox from "../../shared/data-table/checkbox";
import UsersApi from "../../../../api/admin/users";
import toast from "react-hot-toast";

export type CreateUserProps = {
  modelOpen: boolean;
  onClose?: () => void;
};

export const CreateUser: React.FC<CreateUserProps> = ({ modelOpen = false, onClose }) => {
  type FormData = {
    name: string;
    email: string;
    phone?: string;
    role: "admin" | "user";
    telegram?: string;
    show_phone: boolean;
    show_telegram: boolean;
    password: string;
    password_confirmation: string;
    city_id: number;
    avatar?: File | null;
    email_verified: boolean;
  };

  const [error, setError] = React.useState<[string, string] | null>(null);
  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    email: "",
    phone: "",
    role: "user",
    telegram: "",
    show_phone: false,
    show_telegram: false,
    password: "",
    password_confirmation: "",
    city_id: 0,
    avatar: null,
    email_verified: false,
  });

  // کلاس پایه برای inputها
  const baseInputClass =
    "appearance-none peer w-full px-3 pt-5 pb-2 text-sm text-white dark:bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200";

  // اعتبارسنجی فرم
  const validateForm = () => {
    if (!formData.name) return setError(["name", "نام الزامی است"]), false;
    if (formData.name.length < 3) return setError(["name", "نام باید حداقل ۳ کاراکتر باشد"]), false;
    if (!formData.email) return setError(["email", "ایمیل الزامی است"]), false;
    if (!/\S+@\S+\.\S+/.test(formData.email)) return setError(["email", "ایمیل معتبر نیست"]), false;
    if (formData.telegram && !/^[a-zA-Z0-9_]{5,32}$/.test(formData.telegram))
      return setError(["telegram", "نام کاربری تلگرام معتبر نیست"]), false;
    if (formData.phone && !/^\+?[0-9]{10,15}$/.test(formData.phone))
      return setError(["phone", "شماره تلفن معتبر نیست"]), false;
    if (!formData.city_id) return setError(["city_id", "انتخاب شهر الزامی است"]), false;
    if (!formData.password) return setError(["password", "رمز عبور الزامی است"]), false;
    if (formData.password.length < 8)
      return setError(["password", "رمز عبور باید حداقل ۸ کاراکتر باشد"]), false;
    if (formData.password !== formData.password_confirmation)
      return setError(["password_confirmation", "رمزهای عبور مطابقت ندارند"]), false;

    setError(null);
    return true;
  };

  const onSubmit = async () => {
    if (!validateForm()) return;
    const res = await UsersApi.createUser(
        localStorage.getItem("access_token") || "",
        formData.name,
        formData.email,
        formData.password,
        formData.password_confirmation,
        formData.role,
        formData.phone,
        formData.telegram,
        formData.show_phone,
        formData.show_telegram,
        formData.city_id,
        formData.email_verified,
        formData.avatar || undefined
    );

    if(!res.success) {
        toast.error("خطا در ایجاد کاربر: ");
        console.error("Error creating user:", res.message);
        return;
    }

    toast.success("کاربر با موفقیت ایجاد شد!");
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "user",
      telegram: "",
      show_phone: false,
      show_telegram: false,
      password: "",
      password_confirmation: "",
      city_id: 0,
      avatar: null,
      email_verified: false,
    });
    setError(null);
    if (onClose) onClose();
  };

  return (
    <>
      {modelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-200 bg-opacity-50 dark:bg-black pt-52 md:pt-0">
          <div className="relative w-full max-w-2xl p-6 overflow-y-auto text-gray-600 bg-gray-100 shadow-xl dark:text-white dark:bg-gray-800 rounded-xl">
            {/* دکمه بستن */}
            <button
              className="absolute font-bold text-gray-800 dark:text-white top-2 right-2 hover:text-red-500"
              onClick={resetForm}
            >
              &#10005;
            </button>

            <h2 className="mb-6 text-2xl font-bold text-center text-teal-400">
              ساخت کاربر جدید
            </h2>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">

              {/* آپلود آواتار */}
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="relative group">
                  <div className="w-32 h-32 overflow-hidden transition-all duration-300 border-4 border-gray-600 rounded-full shadow-lg group-hover:shadow-teal-500/40 group-hover:border-teal-500">
                    {formData.avatar ? (
                      <img
                        src={URL.createObjectURL(formData.avatar)}
                        alt="Avatar"
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-gray-400 bg-gray-700">
                        بدون تصویر
                      </div>
                    )}
                    <label
                      htmlFor="avatar"
                      className="absolute inset-0 flex items-center justify-center text-sm text-white transition-opacity duration-300 bg-black rounded-full opacity-0 cursor-pointer bg-opacity-60 group-hover:opacity-100"
                    >
                      تغییر تصویر
                    </label>
                  </div>
                </div>
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFormData({ ...formData, avatar: e.target.files[0] });
                    }
                  }}
                  className="hidden"
                />
              </div>

              {/* نام و ایمیل */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    placeholder=" "
                    className={`${baseInputClass} ${
                      error && error[0] === "name"
                        ? "border-red-500"
                        : "border-teal-500 focus:ring-blue-500"
                    }`}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onBlur={validateForm}
                  />
                  <label
                    htmlFor="name"
                    className="absolute text-sm text-gray-400 duration-200 transform -translate-y-3 scale-90 top-2 right-3 origin-[0] peer-placeholder-shown:translate-y-2.5 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-90 peer-focus:text-blue-400"
                  >
                    نام و نام خانوادگی
                  </label>
                  {error && error[0] === "name" && (
                    <p className="mt-1 text-sm text-red-500">{error[1]}</p>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    placeholder=" "
                    className={`${baseInputClass} ${
                      error && error[0] === "email"
                        ? "border-red-500"
                        : "border-teal-500 focus:ring-blue-500"
                    }`}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onBlur={validateForm}
                  />
                  <label
                    htmlFor="email"
                    className="absolute text-sm text-gray-400 duration-200 transform -translate-y-3 scale-90 top-2 right-3 origin-[0] peer-placeholder-shown:translate-y-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-500 peer-focus:-translate-y-3 peer-focus:scale-90 peer-focus:text-blue-400"
                  >
                    ایمیل
                  </label>
                  {error && error[0] === "email" && (
                    <p className="mt-1 text-sm text-red-500">{error[1]}</p>
                  )}
                </div>
              </div>

              {/* شماره تلفن و تلگرام */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    placeholder=" "
                    className={`${baseInputClass} ${
                      error && error[0] === "phone"
                        ? "border-red-500"
                        : "border-teal-500 focus:ring-blue-500"
                    }`}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    onBlur={validateForm}
                  />
                  <label
                    htmlFor="phone"
                    className="absolute text-sm text-gray-400 duration-200 transform -translate-y-3 scale-90 top-2 right-3 origin-[0] peer-placeholder-shown:translate-y-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-500 peer-focus:-translate-y-3 peer-focus:scale-90 peer-focus:text-blue-400"
                  >
                    شماره تلفن
                  </label>
                  {error && error[0] === "phone" && (
                    <p className="mt-1 text-sm text-red-500">{error[1]}</p>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    id="telegram"
                    placeholder=" "
                    className={`${baseInputClass} ${
                      error && error[0] === "telegram"
                        ? "border-red-500"
                        : "border-teal-500 focus:ring-blue-500"
                    }`}
                    value={formData.telegram}
                    onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                    onBlur={validateForm}
                  />
                  <label
                    htmlFor="telegram"
                    className="absolute text-sm text-gray-400 duration-200 transform -translate-y-3 scale-90 top-2 right-3 origin-[0] peer-placeholder-shown:translate-y-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-500 peer-focus:-translate-y-3 peer-focus:scale-90 peer-focus:text-blue-400"
                  >
                    نام کاربری تلگرام
                  </label>
                  {error && error[0] === "telegram" && (
                    <p className="mt-1 text-sm text-red-500">{error[1]}</p>
                  )}
                </div>
              </div>

              {/* نقش و شهر */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="role" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                    نقش
                  </label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value as "admin" | "user" })
                    }
                    className="w-full px-3 py-2 text-sm border border-teal-500 rounded-lg dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">کاربر عادی</option>
                    <option value="admin">مدیر</option>
                  </select>
                </div>

                <div>
                  <CitySelector
                    value={formData.city_id}
                    onChange={(city_id) => setFormData({ ...formData, city_id: city_id as number })}
                  />
                  {error && error[0] === "city_id" && (
                    <p className="mt-1 text-sm text-red-500">{error[1]}</p>
                  )}
                </div>
              </div>

              {/* رمز عبور */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    placeholder=" "
                    className={`${baseInputClass} ${
                      error && error[0] === "password"
                        ? "border-red-500"
                        : "border-teal-500 focus:ring-blue-500"
                    }`}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    onBlur={validateForm}
                  />
                  <label
                    htmlFor="password"
                    className="absolute text-sm text-gray-400 duration-200 transform -translate-y-3 scale-90 top-2 right-3 origin-[0] peer-placeholder-shown:translate-y-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-500 peer-focus:-translate-y-3 peer-focus:scale-90 peer-focus:text-blue-400"
                  >
                    رمز عبور
                  </label>
                  {error && error[0] === "password" && (
                    <p className="mt-1 text-sm text-red-500">{error[1]}</p>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="password"
                    id="password_confirmation"
                    placeholder=" "
                    className={`${baseInputClass} ${
                      error && error[0] === "password_confirmation"
                        ? "border-red-500"
                        : "border-teal-500 focus:ring-blue-500"
                    }`}
                    value={formData.password_confirmation}
                    onChange={(e) =>
                      setFormData({ ...formData, password_confirmation: e.target.value })
                    }
                    onBlur={validateForm}
                  />
                  <label
                    htmlFor="password_confirmation"
                    className="absolute text-sm text-gray-400 duration-200 transform -translate-y-3 scale-90 top-2 right-3 origin-[0] peer-placeholder-shown:translate-y-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-500 peer-focus:-translate-y-3 peer-focus:scale-90 peer-focus:text-blue-400"
                  >
                    تکرار رمز عبور
                  </label>
                  {error && error[0] === "password_confirmation" && (
                    <p className="mt-1 text-sm text-red-500">{error[1]}</p>
                  )}
                </div>
              </div>

              {/* چک‌باکس‌ها */}
              <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
                <Checkbox
                  id="show_phone"
                  label="نمایش شماره تلفن"
                  checked={formData.show_phone}
                  onChange={(checked) => setFormData({ ...formData, show_phone: checked })}
                />
                <Checkbox
                  id="show_telegram"
                  label="نمایش تلگرام"
                  checked={formData.show_telegram}
                  onChange={(checked) => setFormData({ ...formData, show_telegram: checked })}
                />
                <Checkbox
                  id="email_verified"
                  label="ایمیل تأیید شده"
                  checked={formData.email_verified}
                  onChange={(checked) => setFormData({ ...formData, email_verified: checked })}
                />
              </div>

              {/* دکمه‌ها */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-sm font-medium text-black transition border-2 border-black rounded-lg dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 hover:text-white hover:bg-black"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  onClick={onSubmit}
                  className="px-4 py-2 text-sm font-medium text-white transition bg-teal-600 rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500"
                >
                  ساخت کاربر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
