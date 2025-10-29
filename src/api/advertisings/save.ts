import API_URL from "../main";



type SaveAd = {
    success: boolean;
    message: string;
}

export default class SaveAPI {

    static async auto(user_id: number, advertising_id: number): Promise<SaveAd> {
        const res = await fetch(`${API_URL}/ad_actions/save`, {
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

        return data;
        
    }

}