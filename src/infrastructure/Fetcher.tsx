export async function fetchAPIRequestInterceptor(endPoint: string, token: string, config: any): Promise<any> {
    const {fetch: originalFetch} = window;
    window.fetch = async (...args) => {
        //setting the api token for the header
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${token}`;
        try {
            console.log(config);
            const response = await originalFetch(endPoint, config);
            console.log(response);
            return response;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    };
}