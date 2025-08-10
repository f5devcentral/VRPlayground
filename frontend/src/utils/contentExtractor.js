export const getContent = async (response, resType, json_result_key='result') => {
    if (response.ok) {
        if (resType === 'application/json') {
            let result = await response.json();
            if(Object.keys(result).includes(json_result_key)) {
                return result[json_result_key];
            }
            throw new Error(`expected key "${json_result_key}" from Swagger not found in response
            ${JSON.stringify(result)}`)
        } else if (resType === 'text/html') {
            return await response.text();
        }
        else if (resType === 'application/octet-stream') {
            return await response.blob();
        }
        else if (resType === 'image/*') {
            return await response.blob();
        }
    } else {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
}
