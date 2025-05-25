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

/**
 * https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/detail?attomid=156575314
 * https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/expandedprofile?id=156575314
 * https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/detailowner?id=156575314
 * https://api.gateway.attomdata.com/propertyapi/v1.0.0/saleshistory/expandedhistory?id=156575314
 * https://api.gateway.attomdata.com/propertyapi/v1.0.0/assessmenthistory/detail?attomid=184713191
 */
const propertyDetails = async (req, res) => {
  try {
    const propertyId = req.params.id;
    console.log("Fetching property details for ID:", propertyId);

    const attomResponse = await axios.get(
      `https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/detail?id=${propertyId}`,
      {
        headers: {
          Accept: "application/json",
          apikey: ATTOM_API_KEY,
        },
      }
    );
    console.log("Property details response:", attomResponse.data);
    /// call all 5 apis to get all details at once, can use Promise.all for parallel requests

    const expandedProfileResponse = await axios.get(
      `https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/expandedprofile?id=${propertyId}`,
      {
        headers: {
          Accept: "application/json",
          apikey: ATTOM_API_KEY,
        },
      }
    );

    console.log("Expanded profile response:", expandedProfileResponse.data);
    const detailOwnerResponse = await axios.get(
      `https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/detailowner?id=${propertyId}`,
      {
        headers: {
          Accept: "application/json",
          apikey: ATTOM_API_KEY,
        },
      }
    );

    console.log("Detail owner response:", detailOwnerResponse.data);
    const salesHistoryResponse = await axios.get(
      `https://api.gateway.attomdata.com/propertyapi/v1.0.0/saleshistory/expandedhistory?id=${propertyId}`,
      {
        headers: {
          Accept: "application/json",
          apikey: ATTOM_API_KEY,
        },
      }
    );

    // console.log("Sales history response:", salesHistoryResponse.data);

    const assessmentHistoryResponse = await axios.get(
      `https://api.gateway.attomdata.com/propertyapi/v1.0.0/assessmenthistory/detail?attomid=${propertyId}`,
      {
        headers: {
          Accept: "application/json",
          apikey: ATTOM_API_KEY,
        },
      }
    );

    // console.log("Assessment history response:", assessmentHistoryResponse.data);

    const propertyDetails = attomResponse.data.property;
    // const expandedProfile = expandedProfileResponse.data.property;
    // const detailOwner = detailOwnerResponse.data.property;
    // const salesHistory = salesHistoryResponse.data.salesHistory;
    // const assessmentHistory = assessmentHistoryResponse.data.assessmentHistory;

  

    if (!propertyDetails || propertyDetails.length === 0) {
      return res.status(404).json({
        message: "Property not found",
        status: false,
      });
    }

    if (!propertyDetails[0].identifier || !propertyDetails[0].identifier.attomId) {
      return res.status(404).json({
        message: "Property ID not found",
        status: false,
      });
    }
    // Prepare the response data
    const utilities = propertyDetails[0].utilities || {};
    const buildingInfo = propertyDetails[0].building || {};
    const ownerInfo = detailOwnerResponse.data.property[0].owner || {};
    const salesHistory = salesHistoryResponse.data.property[0].saleHistory || [];
    const assessmentHistory = assessmentHistoryResponse.data.property[0].assessmentHistory || [];
    console.log("Owner Info:", ownerInfo);

    const responseData = {
      id: propertyDetails[0].identifier.attomId,
      address: propertyDetails[0].address || "Address not available",
      type: propertyDetails[0].summary?.propclass || "Apartment",
      area: `${
        buildingInfo.size?.universalsize
          ? buildingInfo.size.universalsize.toLocaleString()
          : "N/A"
      } sq ft`,
      yearBuilt: propertyDetails[0].summary?.yearbuilt || "N/A",
      bedrooms: propertyDetails[0].summary?.bedrooms || "N/A",
      bathrooms: propertyDetails[0].summary?.bathrooms || "N/A",
      stories: buildingInfo.stories || "N/A",
      heatingType: utilities.heatingType || "N/A",
      coolingType: utilities.coolingType || "N/A",
      ownerInfo,
      salesHistory,
    };

    res.status(200).json({
      message: "Property details fetched successfully",
      status: true,
      data: responseData,
    });
  } catch (error) {
    console.error(
      "Error fetching property details:",
      error?.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch property details" });
  }
};

module.exports = {
  propertyList,
  propertyDetails
};
