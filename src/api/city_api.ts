import API_URL from "./main";


export interface City {
    name: string;
    id: number;
}

export interface CitiesResponse {
    success: boolean;
    data: City[];
}

export default class CityAPI {
    private static instance: CityAPI;

    private constructor() {}

    public static getInstance(): CityAPI {
        if (!CityAPI.instance) {
            CityAPI.instance = new CityAPI();
        }

        return CityAPI.instance;
    }

    public async getCities(): Promise<CitiesResponse> {
        const response = await fetch(`${API_URL}/cities`);
        const data = await response.json();

        return data;
    }

}