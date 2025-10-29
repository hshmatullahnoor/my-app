import API_URL from "../main";


type ReportType = {
    id: number;
    reported_advertising_id: number;
    reported_by_id: number;
    report_reason: string;
    created_at: Date
}

export default class ReportAPI {

    public static async report(token: string, ad_id: number, reason: string): Promise<{success: boolean; data?:ReportType; error?:string}> {
        const res = await fetch(`${API_URL}/report`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                ad_id: ad_id,
                report_reason: reason
            })
        });

        const data = await res.json();

        console.log(data);
        
        return data;
    }

}