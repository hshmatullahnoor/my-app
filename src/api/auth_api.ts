import type { Advertising } from "./advertisings_api";
import API_URL from "./main";

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: 'user' | 'admin';
    avatar: string | null;
    telegram: string | null;
    show_phone: boolean | null;
    show_telegram: boolean | null;
    city_id: number | null;
    email_verified_at: Date | null;
    created_at: string;
    updated_at: Date | null;
    ads?: Advertising[];
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    user?: User;
    access_token?: string;
    token_type?: string;
    errors?: Record<string, string[]>;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    user?: User;
    access_token?: string;
    token_type?: string;
    errors?: Record<string, string[]>;
}

export interface getUserInfoResponse {
    success: boolean;
    user?: User;
    errors?: Record<string, string[]>;
}

export interface updateUserRequest {
    name?: string;
    email?: string;
    phone?: string | null;
    telegram?: string | null;
    show_phone?: boolean | null;
    show_telegram?: boolean | null;
}

export default class AuthAPI {

    static readonly PATH = `${API_URL}/auth`;

    public static async register(name: string, email: string, password: string, password_confirmation: string, city_id: number): Promise<RegisterResponse>
    {
       return await fetch(`${this.PATH}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password,
                password_confirmation,
                city_id
            })
        }).then(res => res.json());
    }

    public static async login(email: string, password: string) {
        const login = await fetch(`${this.PATH}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        }).then(res => res.json());

        // console.log(login);
        return login;
    }

    public static async getUser(token: string, withADS?: null | string): Promise<getUserInfoResponse> {
        const url = `${this.PATH}/user?with_ads=${withADS ? 'yes' : 'no'}`;
        console.log(url);
        
        return await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => res.json());
    }

    public static async updateUser(
        token: string, 
        id: number,
        name: string | null,
        email: string | null,
        phone: string | null,
        telegram: string | null,
        city_id: string | null,
        show_phone: boolean | null,
        show_telegram: boolean | null,
        password?: string,
        password_confirmation?: string,
        old_password?: string
    ): Promise<{success: boolean; message?:string; error?: string; data?: User}> {
        const res = await fetch(`${this.PATH}/${id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name:name,
                email:email,
                phone: phone,
                telegram: telegram,
                city_id: city_id,
                show_phone: show_phone,
                show_telegram: show_telegram,
                password: password,
                password_confirmation: password_confirmation,
                oldPassword: old_password
            })
        })

        const result = await res.json();
        
        console.log(result);

        return result;
        
    }

    public static async logout(token: string): Promise<{success: boolean; message: string}> {
        const res = fetch(`${this.PATH}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return (await res).json();
    }


}
