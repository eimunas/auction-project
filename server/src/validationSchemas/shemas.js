export const legoSchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        price: { type: 'number', multipleOf: 0.01 },
        deadline: { type: 'string', format: 'date' },
        interestTheme: { type: 'string'},
        url: { type: 'string'}
    },
    required: ['name', 'price', 'deadline'],
    additionalProperties: false
};

export const userSchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6 },
        isAdmin: { type: 'boolean' }
    },
    required: ['name', 'email', 'password'],
    additionalProperties: false
};
