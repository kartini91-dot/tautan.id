/**
 * Database Seeding Script
 * Populate database dengan ~100 entries supplier/buyer untuk testing
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker/locale/id_ID');
const User = require('./models/User');
const Product = require('./models/Product');

const SUPPLIER_COUNT = 50;
const BUYER_COUNT = 50;
const PRODUCTS_PER_SUPPLIER = 3;

// Connect ke database
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_LOCAL || 'mongodb://localhost:27017/tautan-id';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ MongoDB connected for seeding');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Generate supplier data
const generateSupplier = (index) => {
  const businessTypes = ['Manufacturer', 'Distributor', 'Retailer', 'Service Provider'];
  const cities = [
    'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang',
    'Makassar', 'Palembang', 'Tangerang', 'Depok', 'Bekasi',
    'Yogyakarta', 'Malang', 'Cirebon', 'Samarinda', 'Manado'
  ];

  const name = faker.company.name();
  
  return {
    fullName: faker.person.fullName(),
    email: `supplier${index}@tautan-id.com`,
    phoneNumber: faker.phone.number('08##########'),
    password: 'SecurePass123!',
    role: 'supplier',
    businessName: name,
    businessType: faker.helpers.arrayElement(businessTypes),
    businessAddress: faker.location.streetAddress(),
    businessCity: faker.helpers.arrayElement(cities),
    businessProvince: 'Province ' + faker.location.state(),
    businessPostalCode: faker.location.zipCode('#####'),
    businessPhone: faker.phone.number('08##########'),
    taxId: `TAX${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    profileImage: faker.image.avatar(),
    profileDescription: faker.lorem.paragraph(),
    isEmailVerified: true,
    isPhoneVerified: true,
    isBusinessVerified: faker.datatype.boolean(0.8), // 80% verified
    membership: faker.helpers.arrayElement(['Basic', 'Premium', 'Premium+']),
    averageRating: parseFloat((Math.random() * 5).toFixed(1)),
    totalReviews: Math.floor(Math.random() * 200),
    totalSales: Math.floor(Math.random() * 1000),
    totalEarnings: Math.floor(Math.random() * 50000000),
    isActive: faker.datatype.boolean(0.95) // 95% active
  };
};

// Generate buyer data
const generateBuyer = (index) => {
  const cities = [
    'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang',
    'Makassar', 'Palembang', 'Tangerang', 'Depok', 'Bekasi',
    'Yogyakarta', 'Malang', 'Cirebon', 'Samarinda', 'Manado'
  ];

  return {
    fullName: faker.person.fullName(),
    email: `buyer${index}@tautan-id.com`,
    phoneNumber: faker.phone.number('08##########'),
    password: 'SecurePass123!',
    role: 'buyer',
    membership: faker.helpers.arrayElement(['Basic', 'Premium', 'Premium+']),
    profileImage: faker.image.avatar(),
    profileDescription: faker.lorem.sentence(),
    isEmailVerified: true,
    isPhoneVerified: true,
    averageRating: parseFloat((Math.random() * 5).toFixed(1)),
    totalReviews: Math.floor(Math.random() * 100),
    referralPoints: Math.floor(Math.random() * 1000),
    totalReferrals: Math.floor(Math.random() * 20),
    addresses: [
      {
        label: 'Rumah',
        street: faker.location.streetAddress(),
        city: faker.helpers.arrayElement(cities),
        province: 'Province ' + faker.location.state(),
        postalCode: faker.location.zipCode('#####'),
        country: 'Indonesia',
        isDefault: true
      }
    ],
    isActive: faker.datatype.boolean(0.95)
  };
};

// Generate product data
const generateProduct = (supplierId, supplierName, index) => {
  const categories = [
    'Elektronik',
    'Fashion',
    'Makanan & Minuman',
    'Furniture',
    'Otomotif',
    'Peralatan Industri',
    'Tekstil',
    'Peralatan Rumah Tangga'
  ];

  const basePrice = Math.floor(Math.random() * 5000000) + 50000; // 50K - 5M
  const discountPercentage = faker.datatype.boolean(0.3) ? Math.floor(Math.random() * 30) : 0;

  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    category: faker.helpers.arrayElement(categories),
    basePrice,
    discountPercentage,
    stock: Math.floor(Math.random() * 1000) + 1,
    minimumOrder: Math.floor(Math.random() * 10) + 1,
    supplierId,
    supplierName,
    images: [
      {
        url: faker.image.url(),
        altText: faker.commerce.productName(),
        isPrimary: true
      }
    ],
    tags: [
      faker.word.adjective(),
      faker.word.noun(),
      faker.word.verb()
    ],
    weight: {
      value: Math.floor(Math.random() * 1000),
      unit: 'g'
    },
    dimensions: {
      length: Math.floor(Math.random() * 100),
      width: Math.floor(Math.random() * 100),
      height: Math.floor(Math.random() * 100),
      unit: 'cm'
    },
    estimatedDeliveryDays: {
      min: Math.floor(Math.random() * 3) + 1,
      max: Math.floor(Math.random() * 7) + 3
    },
    seoTitle: faker.commerce.productName(),
    seoDescription: faker.lorem.sentence(),
    seoKeywords: [
      faker.word.noun(),
      faker.word.adjective(),
      faker.word.verb()
    ],
    isVisible: faker.datatype.boolean(0.9),
    visibility: faker.helpers.arrayElement(['public', 'premium', 'public']),
    averageRating: parseFloat((Math.random() * 5).toFixed(1)),
    totalReviews: Math.floor(Math.random() * 100),
    totalSales: Math.floor(Math.random() * 500),
    status: faker.helpers.arrayElement(['active', 'inactive']),
    approvalStatus: 'approved'
  };
};

// Main seeding function
const seedDatabase = async () => {
  try {
    // Connect to DB
    await connectDB();

    // Clear existing data
    console.log('\n🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('✓ Database cleared');

    // Seed suppliers
    console.log(`\n👷 Seeding ${SUPPLIER_COUNT} suppliers...`);
    const suppliers = [];
    for (let i = 0; i < SUPPLIER_COUNT; i++) {
      const supplierData = generateSupplier(i);
      const supplier = await User.create(supplierData);
      suppliers.push(supplier);
      
      // Progress indicator
      if ((i + 1) % 10 === 0) {
        console.log(`  ✓ Created ${i + 1} suppliers`);
      }
    }
    console.log(`✓ Successfully created ${SUPPLIER_COUNT} suppliers`);

    // Seed buyers
    console.log(`\n🛍️  Seeding ${BUYER_COUNT} buyers...`);
    for (let i = 0; i < BUYER_COUNT; i++) {
      const buyerData = generateBuyer(i);
      await User.create(buyerData);
      
      // Progress indicator
      if ((i + 1) % 10 === 0) {
        console.log(`  ✓ Created ${i + 1} buyers`);
      }
    }
    console.log(`✓ Successfully created ${BUYER_COUNT} buyers`);

    // Seed products
    console.log(`\n📦 Seeding products for suppliers...`);
    let productCount = 0;
    for (const supplier of suppliers) {
      for (let i = 0; i < PRODUCTS_PER_SUPPLIER; i++) {
        const productData = generateProduct(
          supplier._id,
          supplier.businessName || supplier.fullName,
          i
        );
        await Product.create(productData);
        productCount++;
      }
      
      // Progress indicator
      if ((productCount / PRODUCTS_PER_SUPPLIER) % 5 === 0) {
        console.log(`  ✓ Created ${productCount} products`);
      }
    }
    console.log(`✓ Successfully created ${productCount} products`);

    // Statistics
    console.log('\n📊 Seeding Statistics:');
    const userCount = await User.countDocuments();
    const supplierCount = await User.countDocuments({ role: 'supplier' });
    const buyerCount = await User.countDocuments({ role: 'buyer' });
    const productCount2 = await Product.countDocuments();

    console.log(`  • Total Users: ${userCount}`);
    console.log(`  • Suppliers: ${supplierCount}`);
    console.log(`  • Buyers: ${buyerCount}`);
    console.log(`  • Products: ${productCount2}`);

    // Membership distribution
    const basicCount = await User.countDocuments({ membership: 'Basic' });
    const premiumCount = await User.countDocuments({ membership: 'Premium' });
    const premiumPlusCount = await User.countDocuments({ membership: 'Premium+' });

    console.log('\n💳 Membership Distribution:');
    console.log(`  • Basic: ${basicCount}`);
    console.log(`  • Premium: ${premiumCount}`);
    console.log(`  • Premium+: ${premiumPlusCount}`);

    // Category distribution
    console.log('\n📂 Product Categories:');
    const categories = await Product.collection.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray();

    categories.forEach(cat => {
      console.log(`  • ${cat._id}: ${cat.count}`);
    });

    console.log('\n✅ Seeding completed successfully!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

// Run seeding
seedDatabase();
