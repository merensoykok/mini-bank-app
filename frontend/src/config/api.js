// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const apiEndpoints = {
    // User endpoints
    register: `${API_BASE_URL}/api/user/register`,
    login: `${API_BASE_URL}/api/user/login`,

    // Account endpoints
    accounts: `${API_BASE_URL}/api/account`,
    createAccount: `${API_BASE_URL}/api/account/create`,
    deleteAccount: `${API_BASE_URL}/api/account/delete`,

    // Money transfer endpoint (backend route: /api/account/money-transfer)
    moneyTransfer : `${API_BASE_URL}/api/account/money-transfer`,

    // Credit card endpoints (backend mounts /api/credit-card)
    creditCards: `${API_BASE_URL}/api/credit-card`,
    payCreditCard: `${API_BASE_URL}/api/credit-card/pay-credit-card`
};

export default API_BASE_URL;
