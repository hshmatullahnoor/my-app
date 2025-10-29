import API_URL from "./main";
import type { User } from "./auth_api";
import type { City } from "./city_api";
import type { Category } from "./categories_api";

type AdvertisingsResponseData = {
    current_page: number;
    data: Advertising[];
    first_page_url: string;
    from: number;
    last_page: number;
}

export interface AdvertisingsResponse {
    success: boolean;
    data: AdvertisingsResponseData
}

export interface AdvertisingImages {
    id: number;
    advertising_id: number;
    image_path: string;
    created_at: string;
    updated_at: string;
}

export interface AdvertisingFeatures {
    id: number;
    advertising_id: number;
    category_id: number;
    value: string;
    icon: string;
}

export interface Advertising {
    id: number;
    title: string;
    description: string;
    type: 'accepted' | 'rejected' | 'pending';
    status: 'active' | 'inactive' | 'sold';
    price: number;
    discount: number;
    user_id: number;
    province: string;
    category_id: number;
    city: City;
    city_id: number;
    features: AdvertisingFeatures[];
    images: AdvertisingImages[];
    user: User;
    views: number;
    likes_count: number;
    is_liked: boolean;
    is_saved: boolean;
    category: Category;
    created_at: string;
    updated_at: string;
}

export default class AdvertisingsAPI { 
    static readonly PATH = `${API_URL}/advertisings`;

    /**
     * This method returns few records of advertisings using pagination.
     * @param page Page number.
     * @param perPage Number of records per page.
     * @param categoryId Category ID to filter by.
     * @param cityId City ID to filter by.
     * @param fromPrice Price from to filter by.
     * @param toPrice Price to to filter by.
     * @param onlyWithImage
     * @param search Search query to filter by.
     * @returns Advertisings response with success flag and data.
     */
    static async getAdvertisings(page: number = 1, perPage: number = 10, categoryId: number | null = null, cityId: number | null = null, fromPrice: number | null = null, toPrice: number | null = null, onlyWithImage: boolean | null = null, search: string | null, only_accepted: string = 'no', user_id: null | number = null): Promise<AdvertisingsResponse> { 
        let url = `${this.PATH}?page=${page}&per-page=${perPage}`;
        if (categoryId) { url += `&category_id=${categoryId}`; }
        if (cityId) { url += `&city_id=${cityId}`; }
        if (fromPrice) { url += `&from_price=${fromPrice}`; }
        if (toPrice) { url += `&to_price=${toPrice}`; }
        if (search) { url += `&search=${encodeURIComponent(search)}`; }
        if (onlyWithImage) { url += `&only_with_image=${onlyWithImage}`; }
        url += `&user_id=${user_id}`

        url += `&only_accepted=${only_accepted}`

        console.log(url);
        
        
        //'API Request URL:', url); // Debug log to show the URL
        
        const response = await fetch(url);
        const data = await response.json();

        //'API Response:', data);
        return data;
    }

    static async updateType(token: string, id: number, type: string, reason: string) : Promise<{success: boolean; message?: string; data?: Advertising}> {
        const res = await fetch(`${this.PATH}/${id}/update-type`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                type: type,
                reason: reason
            })
        });

        const data = await res.json();

        return data;
    }

    static async updateStatus(token: string, id: number, status: string, reason: string) : Promise<{success: boolean; message?: string; data?: Advertising}> {
        const res = await fetch(`${this.PATH}/${id}/update-status`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                status: status,
                reason: reason
            })
        });

        const data = await res.json();

        return data;
    }

    static async deleteAdvertising(token: string, id: number) : Promise<{success: boolean, message: string}> {
        const res = await fetch(`${this.PATH}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        const data = await res.json();

        console.log(data);

        return data;

    }

    static async incrementView(id: number): Promise<{success: boolean, message?: string, data?: Advertising}> {
        const res = await fetch(`${this.PATH}/${id}`, {
            method: 'POST'
        });

        return await res.json();
    }

    static async userAdvertising(token: string): Promise<{success: boolean, message?: string, data?: Advertising[]}> {
        const res = fetch(`${this.PATH}/user`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        const data = (await res).json()

        console.log(data);
        

        return data;
    }

}