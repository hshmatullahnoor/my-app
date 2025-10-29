import API_URL from "../main";


type LikeInsert = {
    success: boolean;
    message?: string;
    data?: {id: number; advertising_id: number, user_id:number};
}

type LikeDelete = {
    success: boolean;
    message: string;
}

export default class LikeAPI {

    static async insert(user_id: number, advertising_id: number): Promise<LikeInsert> {
        const res = await fetch(`${API_URL}/ad_likes`, {
            method: 'POST',
            body: JSON.stringify({
                advertising_id: advertising_id,
                user_id: user_id
            })
        });

        const data = await res.json();

        console.log(data);

        return data;
        
    }

    static async delete(user_id: number, advertising_id: number): Promise<LikeDelete> {
        const res = await fetch(`${API_URL}/ad_likes`, {
            method: 'DELETE',
            body: JSON.stringify({
                advertising_id: advertising_id,
                user_id: user_id
            })
        });

        const data = await res.json();

        console.log(data);

        return data;
        
    }

    static async auto(user_id: number, advertising_id: number): Promise<LikeInsert> {
        const res = await fetch(`${API_URL}/ad_actions/like`, {
            method: 'POST',
            body: JSON.stringify({
                advertising_id: advertising_id,
                user_id: user_id
            }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });

        const data = await res.json();

        console.log(data);

        console.log(data);

        return data;
        
    }

}