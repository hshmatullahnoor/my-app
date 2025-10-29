import API_URL from "../main";
import { type User } from "../auth_api";

export interface getAllUsersResponse {
    success: boolean;
    data?: dataInterface;
    message?: string;
}

export interface dataInterface {
    current_page: number;
    data: User[];
    first_page_url: string;
    from: number;
    last_page: number;
}

export interface updateUserRequest {
    name: string;
    email: string;
    phone: string | null;
    role: 'user' | 'admin' | null;
    avatar: File | null;
    telegram: string | null;
    show_phone: boolean | null;
    show_telegram: boolean | null;
    city_id: number | null;
    email_verified: boolean;
    password: string | null | undefined;
    password_confirmation: string | null | undefined;
}

export interface updateUserResponse {
    success: boolean;
    data?: User;
    message?: string;
    errors?: Record<string, string[]>;
}

export interface deleteUserResponse {
    success: boolean;
    message?: string;
}

export type updateUserAvatarResponse = {
    success: boolean;
    data?: User;
    message?: string;
    errors?: Record<string, string[]>;
}

type CreateUserPayload = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: 'user' | 'admin';
    phone?: string;
    telegram?: string;
    show_phone?: boolean;
    show_telegram?: boolean;
    city_id?: number;
    email_verified?: boolean;
};

export default class UsersApi {

    // 🟢 Get all users
    static async getAllUsers(
        token: string | null,
        page: number,
        perPage: number,
        search: string
    ): Promise<getAllUsersResponse> {

        const params = new URLSearchParams({
            page: page.toString(),
            perPage: perPage.toString(),
        });
        if (search) params.append("search", search);

        const url = `${API_URL}/admin/users?${params.toString()}`;

        //url);

        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.setRequestHeader("Content-Type", "application/json");

        return new Promise((resolve, reject) => {
            xhr.onload = () => {
                switch (xhr.status) {
                    case 200:
                        resolve(JSON.parse(xhr.responseText));
                        break;
                    case 401:
                        reject({
                            success: false,
                            message: 'Unauthorized',
                        });
                        break;
                    case 403:
                        //xhr.responseText);
                        reject({
                            success: false,
                            message: 'Forbidden',
                        });
                        break;
                    default:
                        reject({
                            success: false,
                            message: `Request failed with status ${xhr.status}`,
                        });
                }
            };
            xhr.onerror = () => {
                reject({
                    success: false,
                    message: 'Network error',
                });
            }
            xhr.send();
        });
    }

    // 🟢 Update user
    public static async updateUser(
        token: string,
        id: number,
        name: string,
        email: string,
        phone: string | null,
        role: 'user' | 'admin' | null,
        telegram: string | null,
        show_phone: boolean | null,
        show_telegram: boolean | null,
        city_id: number | null,
        avatar: File | null,
        email_verified: boolean,
        password: string | null | undefined,
        password_confirmation: string | null | undefined
    ): Promise<updateUserResponse> {

        const url = `${API_URL}/admin/users/${id}`;

        const body = { name, email, phone, role, telegram, show_phone, show_telegram, city_id, password, password_confirmation, email_verified };

        console.warn("sending body:", body);

        const res = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        const updateRes: updateUserResponse = await res.json();

        // اگر آپدیت با موفقیت انجام شد و آواتار ارسال شده بود، آواتار را آپدیت کن
        if (updateRes.success && avatar) {
            const avatarRes = await this.updateUserAvatar(token, id, avatar);
            if (!avatarRes.success) {
                console.warn('Avatar upload failed', avatarRes.message);
            } else {

                if (updateRes.data) {
                    updateRes.data.avatar = avatarRes.data?.avatar ?? null;
                }
            }
        }

        return updateRes;

    }

    public static async updateUserAvatar(
        token: string,
        id: number,
        avatar: File
    ): Promise<updateUserAvatarResponse> {
        const url = `${API_URL}/admin/users/${id}/avatar`;

        const formData = new FormData();
        formData.append("avatar", avatar);
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        return res.json();
    }

    // Create user without avatar first, then update avatar
public static async createUser(
    token: string,
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
    role: 'user' | 'admin',
    phone?: string,
    telegram?: string,
    show_phone?: boolean,
    show_telegram?: boolean,
    city_id?: number,
    email_verified?: boolean,
    avatar?: File
): Promise<updateUserResponse> {

    // 1️⃣ ابتدا کاربر بدون آواتار ایجاد شود
    const url = `${API_URL}/admin/users`;

    const body: CreateUserPayload = {
        name,
        email,
        password,
        password_confirmation,
        role,
    };
    if (phone) body.phone = phone;
    if (telegram) body.telegram = telegram;
    if (show_phone !== undefined) body.show_phone = show_phone;
    if (show_telegram !== undefined) body.show_telegram = show_telegram;
    if (city_id !== undefined) body.city_id = city_id;
    if (email_verified !== undefined) body.email_verified = email_verified;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
    });

    const createdUser: updateUserResponse = await res.json();

    if (!createdUser.success || !createdUser.data) {
        return createdUser; // خطا در ایجاد کاربر
    }

    // 2️⃣ اگر آواتار ارسال شده بود، از تابع آپدیت آواتار استفاده کن
    if (avatar) {
        const avatarRes = await this.updateUserAvatar(token, createdUser.data.id, avatar);
        if (!avatarRes.success) {
            console.warn('Avatar upload failed', avatarRes.message);
        } else {
            // آپدیت avatar در داده‌ی کاربر
            createdUser.data.avatar = avatarRes.data?.avatar ?? null;
        }
    }

    return createdUser;
}



    // 🟢 Delete user
    public static async deleteUser(id: number, token: string): Promise<deleteUserResponse> {
        const res = await fetch(`${API_URL}/admin/users/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        return res.json();
    }
}
