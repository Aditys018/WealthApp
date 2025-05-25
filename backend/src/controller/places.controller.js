const express = require("express");
const axios = require("axios");

// Replace with your actual ATTOM API key
const ATTOM_API_KEY = "283129a21a7f8361fee7404e88463f15";

const propertyList = async (req, res) => {
  try {
    console.log("Fetching properties...", {
      query: req.query,
    });
    const lat = parseFloat(req.query.lat) || 40.7589;
    const lng = parseFloat(req.query.long) || -73.9851;
    console.log("Coordinates:", { lat, lng });

    const attomResponse = await axios.get(
      "https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/snapshot",
      {
        params: {
          latitude: lat,
          longitude: lng,
          radius: 10,
          pagesize: 50,
          page: 1,
          // propertyType: "APARTMENT",
        },
        headers: {
          Accept: "application/json",
          apikey: ATTOM_API_KEY,
        },
      }
    );

    const properties = attomResponse.data.property.map((p, idx) => ({
      id: p.identifier?.Id || idx + 1,
      title: `${p.summary?.propertyType || "Apartment"} - Built in ${
        p.summary?.yearbuilt || "N/A"
      }`,
      attomId: p.identifier?.attomId || "N/A",
      type: p.summary?.propclass || "Apartment",
      area: `${
        p.building?.size?.universalsize?.toLocaleString() || "N/A"
      } sq ft`,
      address: p.address?.oneLine || "Address not available",
      lat: parseFloat(p.location?.latitude),
      lng: parseFloat(p.location?.longitude),
    }));

    res.status(200).json({
      message: "Properties fetched successfully",
      status: true,
      data: properties,
    });
  } catch (error) {
    console.error(
      "Error fetching properties:",
      error?.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch properties" });
  }
};

module.exports = {
  propertyList,
};
