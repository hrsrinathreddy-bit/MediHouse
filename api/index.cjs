const app = require('../backend/server');
const { connectDB } = require('../backend/config/db');

module.exports = async (req, res) => {
    if (connectDB) {
        try {
            await connectDB();
        } catch (e) {
            console.error('Database connection failed in serverless handler:', e);
        }
    }
    return app(req, res);
};