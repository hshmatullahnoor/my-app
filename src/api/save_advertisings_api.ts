import API_URL from "./main";
import type { Advertising } from "./advertisings_api";


export type SaveAdvertisingResponse =
  | { success: true; data: Advertising; message?: string }
  | { success: false; errors?: Record<string, string[]>; message?: string };


export interface SaveAdvertisingPayload {
    title: string,
    description: string,
    category_id: number,
    price: number,
    status?: 'active' | 'inactive' | 'sold',
    type?: 'accepted' | 'pending' | 'rejected',
    city_id: number,
    province: string,
    features?: SaveAdvertisingFeaturePayload[],
    images?: SaveAdvertisingImagePayload[],
}

export interface SaveAdvertisingImagePayload {
    file: File,
}

export interface SaveAdvertisingFeaturePayload {
    feature_id: number,
    value: string,
}


export default async function saveAdvertising(toke: string, payload: SaveAdvertisingPayload): Promise<SaveAdvertisingResponse> {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('description', payload.description);
    formData.append('category_id', payload.category_id.toString());
    formData.append('price', payload.price.toString());
    formData.append('city_id', payload.city_id.toString());
    formData.append('province', payload.province);
    if (payload.status) {
        formData.append('status', payload.status);
    }
    if (payload.type) {
        formData.append('type', payload.type);
    }
    if (payload.features) {
        payload.features.forEach((feature, index) => {
        formData.append(`features[${index}][feature_id]`, feature.feature_id.toString());
        formData.append(`features[${index}][value]`, feature.value);
    });

    }
    if (payload.images) {
        payload.images.forEach((image, index) => {
            formData.append(`images[${index}]`, image.file);
        });
    }

    try {
        const response = await fetch(`${API_URL}/advertisings`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${toke}`,
            },
            body: formData,
        });
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error('Error saving advertising:', error);
        return { success: false, message: 'Network error or server is unreachable.' };
    }

}