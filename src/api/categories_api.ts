// src/api/categories_api.ts
import API_URL from "./main";

export interface Category {
  id: number;
  name: string;
  slug: string | null;
  description: string | null;
  icon: string | null;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryResponse {
  success: boolean;
  data: Category[];
}

export type CategoryRequestBody = {
  name: string;
  slug: string | null;
  description: string | null;
  parent_id: number | null;
};

export class CategoriesApi {
  static async getCategories(): Promise<CategoryResponse> {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  }

  static async addCategory(token: string, category: CategoryRequestBody): Promise<CategoryResponse> {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(category),
    });
    if (!response.ok) throw new Error('Failed to add category');
    return response.json();
  }

  static async updateCategory(token: string, id: number, category: CategoryRequestBody): Promise<CategoryResponse> {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(category),
    });
    //"Update Category Response:", response);
    if (!response.ok) throw new Error('Failed to update category');
    return response.json();
  }

  static async deleteCategory(token: string, id: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete category');
    return response.json();
  }
}