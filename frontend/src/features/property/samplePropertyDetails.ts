export const samplePropertyDetails = {
  id: '1',
  title: 'Luxury Family House',
  address: '123 Palm Street, Los Angeles, CA',
  price: '$1,200,000',
  image: 'https://source.unsplash.com/800x400/?house',
  summary:
    'A spacious and modern family home with a large backyard and swimming pool.',
  owner: {
    name: 'John Doe',
    contact: 'john@example.com',
    phone: '+1 555 123 4567',
  },
  details: {
    type: 'House',
    bedrooms: 4,
    bathrooms: 3,
    area: '2800 sqft',
    yearBuilt: 2015,
  },
  saleHistory: [
    { date: '2022-03-01', price: '$1,050,000' },
    { date: '2018-08-15', price: '$800,000' },
  ],
  marketValues: {
    estimatedValue: '$1,180,000',
    pricePerSqft: '$421',
    appreciation: '6% YoY',
  },
}
