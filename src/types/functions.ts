import AdvertisingsAPI from "../api/advertisings_api";
import CityAPI from "../api/city_api";

import CryptoJS from "crypto-js";

const SECRET_KEY = "my-secret-key";

export function encrypt(text: string | null): string | null {
    if (text === null) return null;
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

export function decrypt(cipherText: string): string {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export type City = {
    id: number;
    name: string;
};

export const getCities = async () => {
    const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    const CITY_CACHE_KEY = 'cities_cache';

    const citiesData = {
        cities: [] as City[],
        errors: [] as string[],
        success: false
    };

    try {
        // Check cache first
        const cachedData = localStorage.getItem(CITY_CACHE_KEY);

        if (cachedData) {
            try {
                const { data, timestamp } = JSON.parse(cachedData);
                const now = Date.now();

                // Check if cache is still valid (less than 30 days old)
                if (now - timestamp < CACHE_DURATION) {
                    // Validate cached data structure
                    if (Array.isArray(data)) {
                        citiesData.cities = data;
                        citiesData.success = true;
                        return citiesData; // Return cached data
                    } else {
                        console.warn('Cached cities data is not an array:', data);
                        citiesData.errors.push('خطا در فرمت داده‌های کش شده');
                    }
                }
            } catch (parseError) {
                console.error('Error parsing cached cities data:', parseError);
                citiesData.errors.push('خطا در خواندن داده‌های کش شده');
            }
        }

        // Fetch fresh data from API
        const apiResponse = await CityAPI.getInstance().getCities();

        // Handle Laravel API response format {success: true, data: Array}
        if (apiResponse.success && Array.isArray(apiResponse.data)) {
            citiesData.cities = apiResponse.data;
            citiesData.success = true;

            // Save with timestamp
            const cacheData = {
                data: apiResponse.data,
                timestamp: Date.now()
            };

            localStorage.setItem(CITY_CACHE_KEY, JSON.stringify(cacheData));
        } else {
            console.error('Unexpected cities data format:', apiResponse);
            citiesData.errors.push('خطا در دریافت داده‌ها - فرمت نامعتبر');
        }
    } catch (error) {
        console.error('Error loading cities:', error);
        citiesData.errors.push('خطا در بارگذاری فهرست شهرها');
    }
    
    return citiesData;
}

export const findNameByCityID = async (cityId: number | null) => {
    let cityName = 'N/A';

    const citiesResponse = await getCities();

    if (citiesResponse.success && Array.isArray(citiesResponse.cities)) {
        const cities = citiesResponse.cities;

        if (cityId && cities.length > 0) {
            const foundCity = cities.find(city => city.id === cityId);

            if (foundCity) {
                cityName = foundCity.name;
            }
        }
    } else {
        console.error('Failed to load cities or invalid format:', citiesResponse.errors);
    }
    
    return cityName;
}

type AdvertisingID = {
    ID:number;
}

type ViewedAdvertisings = {
    viewed: AdvertisingID[]
}

export const getFindAdvertisingView = (): ViewedAdvertisings | null => {
    const viewObg = localStorage.getItem('viewObg');

    if(viewObg !== null) {
        const obg = JSON.parse(viewObg);
        return obg;
    }

    return null;
}

export const checkAdvertisingViewed = (id: number): boolean => {
    const obg = getFindAdvertisingView();

    if (obg === null) return false;
    if (!obg.viewed) return false;
    if (obg.viewed.length < 1) return false;

    return obg.viewed.some(item => item.ID === id);
}

export const saveAdertisingView = async (id: number) => {
   
    if(!checkAdvertisingViewed(id)) {
        const obg = getFindAdvertisingView();
        
        if(obg === null) {
            // console.log('obg is null');

            const row: ViewedAdvertisings = {viewed:[{ID: id}]};

            const rowToSave = JSON.stringify(row);

            // console.log('new row: ', rowToSave);

            localStorage.setItem('viewObg', rowToSave)

            const res = await AdvertisingsAPI.incrementView(id);
            if(!res.success) {
                console.log('Failed incrementView:', res.message);
            }

            return true

        } else {
            // console.log(Array.isArray(obg.viewed))
        
            obg.viewed.push({ID: id})
            localStorage.setItem('viewObg', JSON.stringify(obg))
            const res = await AdvertisingsAPI.incrementView(id);
            if(!res.success) {
                console.log('Failed incrementView:', res.message);
            }
            return true
        }

    }
}