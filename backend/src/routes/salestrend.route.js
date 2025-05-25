const express = require('express');
const axios = require('axios');
const router = express.Router();

const ATTOM_API_KEY = process.env.ATTOM_API_KEY;
const ATTOM_URL = 'https://api.gateway.attomdata.com/v4/transaction/salestrend';

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(ATTOM_URL, {
      headers: {
        'Accept': 'application/json',
        'apikey': ATTOM_API_KEY,
      },
      params: {
        geoIdV4: '6828b00047035292dd47fe020e636bb3',
        interval: 'yearly',
        startyear: 2018,
        endyear: 2022,
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error('Salestrend API error:', err.message);
    res.status(err.response?.status || 500).json({
      error: err.response?.data || 'Something went wrong',
    });
  }
});

module.exports = router;
