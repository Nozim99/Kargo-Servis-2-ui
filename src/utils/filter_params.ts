export const filter_params = (params: any) => {
    let myObject = {};

    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
            myObject[key] = value;
        }
    });

    return myObject;
};