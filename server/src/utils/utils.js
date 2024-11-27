import { Validator } from 'jsonschema';

const validator = new Validator();

export const validateSchema = (data, schema) => {
    const validationResult = validator.validate(data, schema);
    if (!validationResult.valid) {
        return validationResult.errors.map(err => err.stack);
    }
    return null;
};

export const findById = (list, id) => {
    return list.find(item => item.id === id);
};

export const filterListByQuery = (list, query, keys) => {
    return list.filter(item =>
        keys.every(key =>
            !query[key] || item[key].toLowerCase().includes(query[key].toLowerCase())
        )
    );
};
    