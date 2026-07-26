const axios = require('axios');

const PAYSTACK_BASE_URL = 'https://api.paystack.co';
const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

const paystackApi = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  headers: {
    Authorization: `Bearer ${SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Initialize a transaction
const initializePayment = async ({ email, amount, reference, metadata = {} }) => {
  try {
    const response = await paystackApi.post('/transaction/initialize', {
      email,
      amount: amount * 100, // Paystack expects amount in kobo
      reference,
      callback_url: `${process.env.FRONTEND_URL}/payment/verify`,
      metadata,
    });

    return {
      success: true,
      authorizationUrl: response.data.data.authorization_url,
      reference: response.data.data.reference,
      accessCode: response.data.data.access_code,
    };
  } catch (error) {
    console.error('Paystack Initialize Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to initialize payment.',
    };
  }
};

// Verify a transaction
const verifyPayment = async (reference) => {
  try {
    const response = await paystackApi.get(`/transaction/verify/${reference}`);
    
    return {
      success: true,
      status: response.data.data.status, // "success", "failed", "abandoned"
      amount: response.data.data.amount / 100,
      reference: response.data.data.reference,
      paidAt: response.data.data.paid_at,
      channel: response.data.data.channel,
      customer: response.data.data.customer,
      metadata: response.data.data.metadata,
    };
  } catch (error) {
    console.error('Paystack Verify Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to verify payment.',
    };
  }
};

// Create a refund
const createRefund = async (transactionReference, amount = null) => {
  try {
    const payload = { transaction: transactionReference };
    if (amount) payload.amount = amount * 100;

    const response = await paystackApi.post('/refund', payload);

    return {
      success: true,
      refund: response.data.data,
    };
  } catch (error) {
    console.error('Paystack Refund Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to process refund.',
    };
  }
};

// Fetch all transactions
const listTransactions = async (perPage = 50, page = 1) => {
  try {
    const response = await paystackApi.get(`/transaction?perPage=${perPage}&page=${page}`);
    
    return {
      success: true,
      transactions: response.data.data,
      meta: response.data.meta,
    };
  } catch (error) {
    console.error('Paystack List Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch transactions.',
    };
  }
};

module.exports = {
  initializePayment,
  verifyPayment,
  createRefund,
  listTransactions,
};