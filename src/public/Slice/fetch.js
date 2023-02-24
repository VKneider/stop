export default class Fetch {
    constructor(baseUrl, timeout) {
        if(baseUrl != undefined){
            this.url = baseUrl;
        }
        this.methods = ["GET", "POST", "PUT", "DELETE"];
        
        if(timeout != undefined){
            this.timeout = timeout;
        } else {this.timeout=5000}
    }

    async request(method, data, endpoint) {

        if (!this.methods.includes(method)) throw new Error("Invalid method");
        if(data && typeof data !== "object") throw new Error("Invalid data, not json");
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

        if(this.baseUrl != undefined){
        let response = await fetch(this.url + endpoint, options);
        }else{
        let response = await fetch(endpoint, options);
        }
        loading.stop();

        return response;
    }
        
}