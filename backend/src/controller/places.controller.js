const axios = require("axios");
const { PropertyType } = require("../model");

const propertyList = async (req, res) => {
  try {
    console.log("Fetching properties...", {
      query: req.query,
    });
    const lat = parseFloat(req.query.lat) || 40.7589;
    const lng = parseFloat(req.query.long) || -73.9851;
    const radius = parseFloat(req.query.radius) || 5; // Default radius to 5 miles
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const listingStatus = req.query.listingStatus || "Sold"; // Default to "Sold"
    const propertyType = req.query.propertyType; // Default to "Apartment"
    console.log("Coordinates:", { lat, lng });

    const response = await axios.get(
      "https://zillow-working-api.p.rapidapi.com/search/bycoordinates",
      {
        params: {
          latitude: lat,
          longitude: lng,
          radius: radius,
          page: 1,
          listingStatus: listingStatus,
          homeType: propertyType || null,
        },
        headers: {
          "x-rapidapi-host": "zillow-working-api.p.rapidapi.com",
          "x-rapidapi-key":
            "4fdbde75c1msh8f2f71bd26245c7p153e40jsn7f62e28bb370",
        },
      }
    );

    const props = response.data.searchResults || [];
    const transformed = props.map((item) => {
      const p = item.property;
      return {
        id: p.zpid,
        title: `${p.propertyType?.toUpperCase() || "UNKNOWN"} - Built in ${
          p.yearBuilt || "N/A"
        }`,
        attomId: p.zpid,
        type: p.propertyType || "N/A",
        area: `${p.livingArea || "N/A"} sq ft`,
        address: `${p.address?.streetAddress || ""}, ${
          p.address?.city || ""
        }, ${p.address?.state || ""} ${p.address?.zipcode || ""}`,
        lat: p.location?.latitude,
        lng: p.location?.longitude,
        bannerImage:
          p.media.propertyPhotoLinks.highResolutionLink ||
          "https://via.placeholder.com/150",
      };
    });

    res.status(200).json({
      message: "Properties fetched successfully",
      status: true,
      data: transformed,
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
    const response = await axios.get(
      "https://zillow-working-api.p.rapidapi.com/pro/byzpid?zpid=" + propertyId,
      {
        headers: {
          "x-rapidapi-host": "zillow-working-api.p.rapidapi.com",
          "x-rapidapi-key":
            "4fdbde75c1msh8f2f71bd26245c7p153e40jsn7f62e28bb370",
        },
      }
    );

    const priceResponse = await axios.get(
      "https://zillow-working-api.p.rapidapi.com/pricehistory?byzpid=" + propertyId,
      {
        headers: {
          "x-rapidapi-host": "zillow-working-api.p.rapidapi.com",
          "x-rapidapi-key":
            "4fdbde75c1msh8f2f71bd26245c7p153e40jsn7f62e28bb370",
        },
      }
    );

    const ownerResponse = await axios.get(
      "https://zillow-working-api.p.rapidapi.com/ownerinfo?byzpid=" + propertyId,
      {
        headers: {
          "x-rapidapi-host": "zillow-working-api.p.rapidapi.com",
          "x-rapidapi-key":
            "4fdbde75c1msh8f2f71bd26245c7p153e40jsn7f62e28bb370",
        },
      }
    );
    console.log("Zillow property details response:", priceResponse.data);
    const propertyDetails = response.data.propertyDetails || {};
    /// call all 5 apis to get all details at once, can use Promise.all for parallel requests
    const propertyData = {
      resoFacts: propertyDetails.resoFacts || {},
      price: propertyDetails.price || {},
      address: propertyDetails.address || {},
      yearBuilt: propertyDetails.yearBuilt || "N/A",
      county: propertyDetails.county || "N/A",
      zestimate: propertyDetails.zestimate || {},
      rentZestimate: propertyDetails.rentZestimate || {},
      media: propertyDetails.media || {},
      originalPhotos: propertyDetails.originalPhotos,
      taxHistory: propertyDetails.taxHistory || [],
      homeStatus: propertyDetails.homeStatus || "N/A",
      schools: propertyDetails.schools || [],
      description: propertyDetails.description || "No description available",
      priceHistory: priceResponse.data.priceHistory || [],
      ownerInfo: ownerResponse.data
    }
    

    res.status(200).json({
      message: "Property details fetched successfully",
      status: true,
      data: propertyData,
    });
  } catch (error) {
    console.error(
      "Error fetching property details:",
      error?.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch property details" });
  }
};

/**
 * Get all property types
 */
const getPropertyTypes = async (req, res) => {
  try {
    const propertyTypes = await PropertyType.find();
    console.log("Fetched property types:", propertyTypes);
    if (!propertyTypes || propertyTypes.length === 0) {
      return res.status(404).json({
        message: "No property types found",
        status: false,
      });
    }
    res.status(200).json({
      message: "Property types fetched successfully",
      status: true,
      data: propertyTypes,
    });
  } catch (error) {
    console.error("Error fetching property types:", error.message);
    res.status(500).json({ error: "Failed to fetch property types" });
  }
};

module.exports = {
  propertyList,
  propertyDetails,
  getPropertyTypes,
};
