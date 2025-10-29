import API_URL from "../main";

export interface CategoryFeatures {
    id: number;
    category_id: number;
    feature_name: string;
    feature_type: "json" | "string";
    options: string | null;
    icon: string | null; // svg string
    created_at: string;
    updated_at: string | null;
}

export type CategoryFeaturePayload = {
    category_id: number;
    feature_name: string;
    feature_type: "json" | "string";
    options?: string[] | null;
    icon?: string | null;
};

export type GetAllCategoryFeaturesResponse = {
    success: boolean;
    data: CategoryFeatures[];
    message?: string;
};

export type CategoryFeatureResponse = {
    success: boolean;
    data?: CategoryFeatures;
    message?: string;
    errors?: Record<string, string[]>;
};

export type DeleteCategoryFeatureResponse = {
    success: boolean;
    message?: string;
};

export default class CategoryFeaturesAPI {
    private static baseURL = API_URL + "/category-features";

    public static async GrtAllCategoryFeatures(): Promise<GetAllCategoryFeaturesResponse> {
        const response = await fetch(this.baseURL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }

    public static async getCategoryFeature(id: number): Promise<CategoryFeatureResponse> {
        const response = await fetch(`${this.baseURL}/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }

    public static async createCategoryFeature(
        token: string,
        payload: CategoryFeaturePayload,
    ): Promise<CategoryFeatureResponse> {
        const response = await fetch(this.baseURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        return response.json();
    }

    public static async updateCategoryFeature(
        token: string,
        id: number,
        payload: CategoryFeaturePayload,
    ): Promise<CategoryFeatureResponse> {
        const response = await fetch(`${this.baseURL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        return response.json();
    }

    public static async deleteCategoryFeature(
        token: string,
        id: number,
    ): Promise<DeleteCategoryFeatureResponse> {
        const response = await fetch(`${this.baseURL}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.json();
    }
}