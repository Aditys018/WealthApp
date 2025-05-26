export interface IPlacesListPayload {
  page: number
  pageSize: number
  lat?: number
  long?: number
  radius?: number
  propertyType?: string
  listingStatus?: string
}

export interface IPlacesListResponse {
  data: {
    id: number
    title: string
    attomId: number
    type: string
    area: string
    address: string
    lat: number
    lng: number
  }[]
  status: boolean
  message: string
}

export interface IPlaceDetailsQuery {
  id: string
}

/**
 * "rentalListingContact": {
        "displayName": null,
        "businessName": null,
        "phoneNumber": null,
        "agentBadgeType": null,
        "photoUrl": "",
        "reviewsReceivedCount": null,
        "reviewsUrl": null,
        "ratingAverage": null,
        "isBrokerLocalCompliance": null
    },
    "forSaleOrSold_ListingContact": {
        "trueStatus": null,
        "listingAgreement": "Exclusive Right To Sell",
        "mlsName": "Fresno MLS",
        "agentEmail": null,
        "agentLicenseNumber": "DRE #01846587",
        "agentName": "Matthew A. Henderson",
        "agentPhoneNumber": null,
        "attributionTitle": null,
        "brokerName": "London Properties, Ltd.",
        "brokerPhoneNumber": "559-683-3400",
        "buyerAgentMemberStateLicense": "DRE #02061249",
        "buyerAgentName": "Luz Lopez",
        "buyerBrokerageName": "Luz Lopez Real Estate",
        "coAgentLicenseNumber": null,
        "coAgentName": null,
        "coAgentNumber": null,
        "lastChecked": "2025-05-26 06:17:18",
        "lastUpdated": "2024-03-11 12:45:56",
        "listingOffices": [
            {
                "associatedOfficeType": "listOffice",
                "officeName": "London Properties, Ltd."
            },
            {
                "associatedOfficeType": "coListOffice",
                "officeName": null
            },
            {
                "associatedOfficeType": "buyerOffice",
                "officeName": "Luz Lopez Real Estate"
            },
            {
                "associatedOfficeType": "coBuyerOffice",
                "officeName": null
            }
        ],
        "listingAgents": [
            {
                "associatedAgentType": "listAgent",
                "memberFullName": "Matthew A. Henderson",
                "memberStateLicense": "DRE #01846587"
            },
            {
                "associatedAgentType": "coListAgent",
                "memberFullName": null,
                "memberStateLicense": null
            },
            {
                "associatedAgentType": "buyerAgent",
                "memberFullName": "Luz Lopez",
                "memberStateLicense": "DRE #02061249"
            },
            {
                "associatedAgentType": "coBuyerAgent",
                "memberFullName": null,
                "memberStateLicense": null
            }
        ],
        "mlsDisclaimer": null,
        "mlsId": "605715",
        "providerLogo": null,
        "listingAttributionContact": null,
        "listingAgentAttributionContact": null,
        "infoString3": null,
        "infoString5": null,
        "infoString10": null,
        "infoString16": null
 */
export interface IOwnerInformation {
  isListedByOwner: boolean
  rentalListingContact: {
    displayName: string | null
    businessName: string | null
    phoneNumber: string | null
    agentBadgeType: string | null
    photoUrl: string
    reviewsReceivedCount: number | null
    reviewsUrl: string | null
    ratingAverage: number | null
    isBrokerLocalCompliance: boolean | null
  }
  forSaleOrSold_ListingContact: {
    trueStatus: string | null
    listingAgreement: string
    mlsName: string
    agentEmail: string | null
    agentLicenseNumber: string | null
    agentName: string
    agentPhoneNumber: string | null
    attributionTitle: string | null
    brokerName: string
    brokerPhoneNumber: string | null
    buyerAgentMemberStateLicense: string | null
    buyerAgentName: string | null
    buyerBrokerageName: string | null
    coAgentLicenseNumber: string | null
    coAgentName: string | null
    coAgentNumber: string | null
    lastChecked: string
    lastUpdated: string
    listingOffices: {
      associatedOfficeType: string
      officeName: string | null
    }[]
    listingAgents: {
      associatedAgentType: string
      memberFullName: string | null
      memberStateLicense: string | null
    }[]
    mlsDisclaimer: string | null
    mlsId: string | null
    providerLogo: Record<string, unknown> | null // Adjust based on actual structure if needed.
    listingAttributionContact?: Record<string, unknown> // Optional, adjust as needed.
    listingAgentAttributionContact?: Record<string, unknown> // Optional, adjust as needed.
  }
}

export interface IPropertyDetails {
  description: string | null
  resoFacts: {
    bathrooms: number
    bathroomsFull: number
    bathroomsThreeQuarter: number
    bathroomsHalf: number
    bathroomsOneQuarter: number
    bedrooms: number
    aboveGradeFinishedArea: string | null
    accessibilityFeatures: string | null
    additionalFeeInfo: string | null
    additionalParcelsDescription: string | null
    architecturalStyle: string
    associations: string[]
    associationFee: number | null
    associationAmenities: string | null
    associationFee2: number | null
    associationFeeIncludes: string | null
    associationName: string | null
    associationName2: string | null
    associationPhone: string | null
    associationPhone2: string | null
    basementYN: boolean | null
    buildingFeatures: string | null
    buildingName: string | null
    appliances: string[]
    atAGlanceFacts: {
      factLabel: string
      factValue: string | null
    }[]
    attic: string | null
    availabilityDate: string | null
    basement: string | null
    bathroomsPartial: number | null
    bathroomsFloat: number
    belowGradeFinishedArea: string | null
    bodyType: string | null
    builderModel: string | null
    builderName: string | null
    buildingArea: string
    buildingAreaSource: string | null
    canRaiseHorses: boolean
    carportParkingCapacity: number | null
    cityRegion: string
    commonWalls: string | null
    communityFeatures: string | null
    compensationBasedOn: string | null
    constructionMaterials: string[]
    contingency: string | null
    cooling: string[]
    coveredParkingCapacity: number | null
    cropsIncludedYN: boolean | null
    cumulativeDaysOnMarket: string
    developmentStatus: string | null
    doorFeatures: string | null
    electric: string | null
    elevation: string | null
    elevationUnits: string | null
    entryLevel: string | null
    entryLocation: string | null
    exclusions: string | null
    exteriorFeatures: string[]
    feesAndDues: {
      type: string
      fee: number | null
      name: string | null
      phone: string | null
    }[]
    fencing: string
    fireplaceFeatures: string[]
    fireplaces: number
    flooring: string[]
    foundationArea: string | null
    foundationDetails: string[]
    frontageLength: string | null
    frontageType: string | null
    furnished: boolean
    garageParkingCapacity: number | null
    gas: string | null
    greenBuildingVerificationType: string | null
    greenEnergyEfficient: string | null
    greenEnergyGeneration: string | null
    greenIndoorAirQuality: string | null
    greenSustainability: string | null
    greenWaterConservation: string | null
    hasAdditionalParcels: boolean
    hasAssociation: boolean | null
    hasAttachedGarage: boolean
    hasAttachedProperty: boolean
    hasCooling: boolean
    hasCarport: boolean
    hasElectricOnProperty: boolean | null
    hasFireplace: boolean
    hasGarage: boolean
    hasHeating: boolean
    hasHomeWarranty: boolean
    hasLandLease: boolean
    hasOpenParking: boolean | null
    hasRentControl: boolean | null
    hasSpa: boolean
    hasPetsAllowed: boolean | null
    hasPrivatePool: boolean | null
    hasView: boolean
    hasWaterfrontView: boolean | null
    heating: string[]
    highSchool: string
    highSchoolDistrict: string
    hoaFee: number | null
    hoaFeeTotal: number | null
    homeType: string
    horseAmenities: string[]
    horseYN: boolean
    inclusions: string | null
    incomeIncludes: string | null
    interiorFeatures: string[]
    irrigationWaterRightsAcres: string | null
    irrigationWaterRightsYN: boolean | null
    isNewConstruction: boolean | null
    isSeniorCommunity: boolean | null
    landLeaseAmount: number | null
    landLeaseExpirationDate: string | null
    laundryFeatures: string[]
    leaseTerm: string | null
    levels: string
    listingId: string | null
    listingTerms: string
    lotFeatures: string[]
    lotSize: string
    lotSizeDimensions: string
    livingArea: string
    livingAreaRange: string | null
    livingAreaRangeUnits: string | null
    livingQuarters: string[]
    mainLevelBathrooms: number | null
    mainLevelBedrooms: number | null
    marketingType: string | null
    media: string[]
    middleOrJuniorSchool: string
    middleOrJuniorSchoolDistrict: string
    municipality: string | null
    numberOfUnitsInCommunity: number | null
    numberOfUnitsVacant: number | null
    offerReviewDate: string | null
    onMarketDate: number
    openParkingCapacity: number | null
    otherEquipment: string[]
    otherFacts: string[]
    otherParking: string | null
    otherStructures: string[]
    ownership: string | null
    ownershipType: string | null
    parcelNumber: string
    parkingCapacity: number
    parkingFeatures: string[]
    parkName: string | null
    patioAndPorchFeatures: string[]
    petsMaxWeight: number | null
    poolFeatures: string | null
    pricePerSquareFoot: number
    propertyCondition: string | null
    propertySubType: string[]
    roadSurfaceType: string | null
    roofType: string
    rooms: {
      area: string | null
      description: string | null
      dimensions: string | null
      level: string | null
      features: string | null
      roomArea: string
      roomAreaSource: string | null
      roomAreaUnits: string | null
      roomDescription: string | null
      roomDimensions: string | null
      roomFeatures: string[]
      roomLength: string | null
      roomLengthWidthSource: string | null
      roomLengthWidthUnits: string | null
      roomLevel: string | null
      roomType: string
      roomWidth: string | null
    }[]
    roomTypes: string | null
    securityFeatures: string | null
    sewer: string[]
    spaFeatures: string[]
    specialListingConditions: string | null
    stories: number
    storiesDecimal: number
    storiesTotal: number | null
    structureType: string | null
    subdivisionName: string | null
    taxAnnualAmount: number
    taxAssessedValue: number
    tenantPays: string | null
    topography: string | null
    totalActualRent: number
    utilities: string[]
    vegetation: string | null
    view: string[]
    virtualTour: string | null
    waterSource: string[]
    waterBodyName: string | null
    waterfrontFeatures: string | null
    waterView: string | null
    waterViewYN: boolean | null
    windowFeatures: string[]
    woodedArea: string | null
    yearBuilt: number
    yearBuiltEffective: string | null
    zoning: string
    zoningDescription: string | null
    elementarySchool: string
    elementarySchoolDistrict: string
    listAOR: string
  }
  price: number
  address: {
    streetAddress: string
    city: string
    state: string
    zipcode: string
    neighborhood: string | null
    community: string | null
    subdivision: string | null
  }
  yearBuilt: number
  county: string
  zestimate: number
  rentZestimate: number
  media: Record<string, unknown>
  originalPhotos: {
    caption: string
    mixedSources: {
      jpeg: {
        url: string
        width: number
      }[]
      webp: {
        url: string
        width: number
      }[]
    }
  }[]
  taxHistory: {
    time: number
    taxPaid: number | null
    taxIncreaseRate: number
    value: number
    valueIncreaseRate: number
  }[]
  homeStatus: string
  schools: {
    distance: number
    name: string
    rating: number
    level: string
    studentsPerTeacher: number | null
    assigned: boolean | null
    grades: string
    link: string
    type: string
    size: number | null
    totalCount: number | null
    isAssigned: boolean | null
  }[]
  ownerInfo: IOwnerInformation
}

export interface IPropertyDetailsResponse {
  data: IPropertyDetails
  status: boolean
  message: string
}
