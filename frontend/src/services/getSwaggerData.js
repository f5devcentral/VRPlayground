import YAML from "js-yaml";

/// Fetch the swagger data from the server
const fetchSwaggerData = async () => {
    const swaggerPath = '/swagger.yaml'
    try {
        // Use Promise.all to wait for all fetch requests to complete
        try {
            const response = await fetch(swaggerPath);
            if (!response.ok) {
                throw new Error(`Failed to fetch data from ${swaggerPath}: ${response.statusText}`);
            }
            return response.text();
        } catch (error) {
            // Handle individual fetch errors
            console.error(`Error fetching data from ${swaggerPath}:`, error);
            return "";
        }
    } catch (error) {
        // Handle errors that occurred during any of the fetch operations
        console.error('Error fetching data:', error);
    }
}

/// Convert YAML to JSON
const convertSwaggerYamlToJson = (yamlString) => {
    return YAML.load(yamlString);
}
/// Convert dictionary to array of objects with key as a new key
const arrayFromDict = (dict, newKeyName) => {
    return Object.entries(dict).map(([key, value]) => {
        value[newKeyName] = key;
        return value;
    }
    );
}
/// Get the swagger data
export const getSwaggerData = async () => {
    const swaggerText = await fetchSwaggerData();
    if (swaggerText === "") {
        return {};
    }
    let swagger = convertSwaggerYamlToJson(swaggerText);
    swagger.paths = arrayFromDict(swagger.paths, "path");
    return swagger;
}