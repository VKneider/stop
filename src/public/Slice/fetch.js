export default class Fetch {
    constructor(baseUrl, timeout) {
        if(baseUrl != undefined){
            this.url = baseUrl;
        }
        this.methods = ["GET", "POST", "PUT", "DELETE"];
        this.timeout = timeout;
    }

    async request(method, data, endpoint) {

        if (!this.methods.includes(method)) throw new Error("Invalid method");
        if(data && typeof data !== "object") throw new Error("Invalid data");
        const controller = new AbortController()

        
        let options = {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            signal: controller.signal,
            
        }
        if(data!=null){
            options.body = JSON.stringify(data);
        }
        let loading = await slice.getInstance("Loading");
        loading.start();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout || 10000)
        let response = await fetch(this.url + endpoint, options);
            loading.stop();
            let result = await response.json();

        return result;
    }
        
}