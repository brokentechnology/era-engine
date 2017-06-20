const isTest = process.env.NODE_ENV === 'test';

export default {
    port: isTest ? 3001 : 3000,
    database: {
        url: isTest ? 'mongodb://localhost/test' : 'mongodb://localhost/app'
    }
};
