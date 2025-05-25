const axios = require("axios");

const ATTOM_API_KEY = "283129a21a7f8361fee7404e88463f15";

const getSalesTrend = async (req, res) => {
  try {
    const {startYear, endYear, geoId, interval='yearly'} = req.query;
    console.log("Fetching sales trend for:", {
      startYear,
      endYear,
      geoId,
      interval
    });
    const response = await axios.get(
      "https://api.gateway.attomdata.com/v4/transaction/salestrend",
      {
        headers: {
          Accept: "application/json",
          apikey: ATTOM_API_KEY,
        },
        params: {
          geoIdV4: geoId,
          interval,
          startyear: startYear,
          endyear: endYear,
        },
      }
    );

    res.status(200).json({
      message: "Sales trend data fetched successfully",
      status: true,
      data: response.data,
    });
  } catch (error) {
    console.error(
      "Error fetching sales trend:",
      error?.response?.data || error.message
    );
    res.status(error?.response?.status || 500).json({
      error: "Failed to fetch sales trend data",
    });
  }
};

module.exports = { getSalesTrend };
