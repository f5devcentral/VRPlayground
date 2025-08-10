import jsonpath from "jsonpath";



const resolveResponseComponent = (type) => {
    // resolve the response component based on the type of the response
    const componentMap = {
        html: "HtmlComponent",
        table: "TableComponent",
        string: "StringComponent",
        object: "ObjectComponent",
        octetstream: "OctetStreamComponent",
        image: "ImageComponent",
        boolean: "BooleanComponent",
    };
    return componentMap[type.toLowerCase()] || "ObjectComponent";
};

const getResponseSchemaType = (vulnerabilityConfig) => {
    return jsonpath.query(vulnerabilityConfig, `$..responses['200']..schema..description`)[0] || "octetstream";
};

export const getResponseComponent = (vulnerabilityConfig) => {
    const responseType = getResponseSchemaType(vulnerabilityConfig);
    return resolveResponseComponent(responseType);
};

