require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Village = require('../models/Village');
const { connectDB, getMongoConnected, JsonStore } = require('../config/db');

const VILLAGES = [
    { name: "Lakhan", district: "Hapur", tehsil: "Simbhawali", population: "1,520", problems: "Jal Jeevan Mission RO Drinking Water & Pipe Leakage", status: "Completed", progress: 100, latitude: 28.7300, longitude: 77.7800 },
    { name: "Hindalpur", district: "Hapur", tehsil: "Hapur", population: "2,240", problems: "Primary School Classroom Infrastructure & STEM Lab", status: "In Progress", progress: 70, latitude: 28.7050, longitude: 77.7550 },
    { name: "Galand", district: "Hapur", tehsil: "Dhaulana", population: "3,150", problems: "Solid Waste Segregation & Solar Streetlighting Grid", status: "Completed", progress: 100, latitude: 28.6900, longitude: 77.7100 },
    { name: "Sapnawat", district: "Hapur", tehsil: "Dhaulana", population: "3,810", problems: "Primary Health Sub-Center & Emergency Ambulance Access", status: "Under Assessment", progress: 25, latitude: 28.6700, longitude: 77.7400 },
    { name: "Basatpur", district: "Hapur", tehsil: "Hapur", population: "1,180", problems: "Village Solar Micro-Grid Electrification", status: "Completed", progress: 100, latitude: 28.7150, longitude: 77.7900 },
    { name: "Masota", district: "Hapur", tehsil: "Dhaulana", population: "940", problems: "Amrit Sarovar Pond Rejuvenation & Rainwater Filtration", status: "Under Assessment", progress: 15, latitude: 28.7400, longitude: 77.7200 },
    { name: "Anwarpur", district: "Hapur", tehsil: "Simbhawali", population: "1,760", problems: "Digital Anganwadi & Child Nutrition Center", status: "Completed", progress: 100, latitude: 28.7500, longitude: 77.7600 },
    { name: "Atrolli", district: "Hapur", tehsil: "Hapur", population: "1,320", problems: "Solar Powered Drip Irrigation Pump Set", status: "Under Assessment", progress: 30, latitude: 28.6800, longitude: 77.8100 },
    { name: "Sikhera", district: "Hapur", tehsil: "Hapur", population: "2,890", problems: "Renewable Biomass & Solar Power Grid", status: "In Progress", progress: 75, latitude: 28.7600, longitude: 77.7100 },
    { name: "Garhmukteshwar", district: "Hapur", tehsil: "Garhmukteshwar", population: "8,450", problems: "Ganges Riverfront Sewage Treatment & Water Sanitation", status: "Completed", progress: 100, latitude: 28.7833, longitude: 78.0833 },
    { name: "Brajghat", district: "Hapur", tehsil: "Garhmukteshwar", population: "4,200", problems: "Eco-Tourism Streetlighting & Ghat Sanitation", status: "In Progress", progress: 80, latitude: 28.7900, longitude: 78.1000 },
    { name: "Simbhawali", district: "Hapur", tehsil: "Simbhawali", population: "6,700", problems: "Sugar Belt Farmers Agro-Tech & Soil Testing Hub", status: "In Progress", progress: 65, latitude: 28.7167, longitude: 77.9000 },
    { name: "Bhowapur", district: "Ghaziabad", tehsil: "Ghaziabad", population: "4,500", problems: "Underground Drainage System & Sewer Line Upgrade", status: "Completed", progress: 100, latitude: 28.6500, longitude: 77.3800 },
    { name: "Chijjarsi", district: "Ghaziabad", tehsil: "Ghaziabad", population: "6,200", problems: "Public Digital Library & Youth Vocational Skills Center", status: "In Progress", progress: 85, latitude: 28.6320, longitude: 77.3750 },
    { name: "Dasna Rural", district: "Ghaziabad", tehsil: "Ghaziabad", population: "8,900", problems: "Community Water ATM & Historic Pond Desilting", status: "Completed", progress: 100, latitude: 28.6800, longitude: 77.5300 },
    { name: "Muradnagar Rural", district: "Ghaziabad", tehsil: "Modi Nagar", population: "9,200", problems: "Upper Ganges Canal Water Filtration & Bio-Filter", status: "In Progress", progress: 70, latitude: 28.7800, longitude: 77.5000 },
    { name: "Modinagar Rural", district: "Ghaziabad", tehsil: "Modi Nagar", population: "11,500", problems: "Women Self-Help Group (SHG) Handloom Training Center", status: "Completed", progress: 100, latitude: 28.8333, longitude: 77.5833 },
    { name: "Loni Rural", district: "Ghaziabad", tehsil: "Loni", population: "14,200", problems: "Air Pollution Dust Barrier & Green Belt Plantation", status: "Under Assessment", progress: 40, latitude: 28.7500, longitude: 77.2833 },
    { name: "Patla", district: "Ghaziabad", tehsil: "Modi Nagar", population: "4,900", problems: "Model Anganwadi Infrastructure & Infant Care Unit", status: "Completed", progress: 100, latitude: 28.8600, longitude: 77.5200 },
    { name: "Behta Hajipur", district: "Ghaziabad", tehsil: "Loni", population: "12,400", problems: "Municipal Solid Waste Management Plant", status: "Completed", progress: 100, latitude: 28.7200, longitude: 77.2900 },
    { name: "Khera", district: "Meerut", tehsil: "Meerut", population: "2,400", problems: "Rural Youth Sports Complex & Skill Center", status: "Completed", progress: 100, latitude: 28.9800, longitude: 77.7000 },
    { name: "Hastinapur Rural", district: "Meerut", tehsil: "Mawana", population: "8,200", problems: "Wildlife Sanctuary Buffer Road & Eco-Sanitation", status: "In Progress", progress: 75, latitude: 29.1700, longitude: 78.0200 },
    { name: "Sardhana Rural", district: "Meerut", tehsil: "Sardhana", population: "9,600", problems: "Handloom Weavers Power Backup & Solar Grid", status: "Completed", progress: 100, latitude: 29.1500, longitude: 77.6200 },
    { name: "Jani Khurd", district: "Meerut", tehsil: "Meerut", population: "5,400", problems: "Panchayat Bhawan Computer Center & Broadband", status: "In Progress", progress: 60, latitude: 28.9300, longitude: 77.5500 },
    { name: "Daurala Rural", district: "Meerut", tehsil: "Daurala", population: "6,800", problems: "Sugar Mill Effluent Treatment & Groundwater Testing", status: "Under Assessment", progress: 35, latitude: 29.1100, longitude: 77.7300 },
    { name: "Mawana Rural", district: "Meerut", tehsil: "Mawana", population: "7,900", problems: "Cattle Disease Diagnostic Lab & Milk Chilling Center", status: "In Progress", progress: 80, latitude: 29.1000, longitude: 77.9200 },
    { name: "Partapur", district: "Meerut", tehsil: "Meerut", population: "6,100", problems: "Industrial Drainage Linkage & PMGSY Road Repair", status: "Completed", progress: 100, latitude: 28.9000, longitude: 77.6700 },
    { name: "Kithore", district: "Meerut", tehsil: "Mawana", population: "5,300", problems: "Mango Belt Cold Storage & Agri-Market Link", status: "In Progress", progress: 65, latitude: 28.8700, longitude: 77.9300 },
    { name: "Khurja Rural", district: "Bulandshahr", tehsil: "Khurja", population: "11,200", problems: "Ceramic Cluster Effluent Filter & Solar Street Lighting", status: "Completed", progress: 100, latitude: 28.2500, longitude: 77.8500 },
    { name: "Siyana Rural", district: "Bulandshahr", tehsil: "Siyana", population: "7,400", problems: "Fruit Belt Cold Chain & Rural Fire Sub-Station", status: "In Progress", progress: 70, latitude: 28.6200, longitude: 78.0500 },
    { name: "Shikarpur", district: "Bulandshahr", tehsil: "Shikarpur", population: "6,900", problems: "Jal Jeevan Mission Overhead Water Tank", status: "Completed", progress: 100, latitude: 28.2800, longitude: 78.0100 },
    { name: "Anupshahr Rural", district: "Bulandshahr", tehsil: "Anupshahr", population: "8,700", problems: "Ganges Riverbank Soil Erosion Barrier & Clean Ghats", status: "In Progress", progress: 80, latitude: 28.3600, longitude: 78.2700 },
    { name: "Gulaothi", district: "Bulandshahr", tehsil: "Bulandshahr", population: "9,100", problems: "Connecting Highway Bypass Road & Veterinary Clinic", status: "Completed", progress: 100, latitude: 28.5800, longitude: 77.7800 },
    { name: "Jahangirabad", district: "Bulandshahr", tehsil: "Anupshahr", population: "7,800", problems: "Primary Girls School Science Lab & Sanitation", status: "Under Assessment", progress: 45, latitude: 28.4000, longitude: 78.1000 },
    { name: "Pahasu", district: "Bulandshahr", tehsil: "Shikarpur", population: "4,800", problems: "Community Health Center Oxygen Plant & Solar Power", status: "In Progress", progress: 65, latitude: 28.1700, longitude: 78.0500 },
    { name: "Gejha Tilapat", district: "Noida", tehsil: "Noida", population: "6,500", problems: "Urban-Rural Fringe Stormwater Drainage & CCTV Grid", status: "Completed", progress: 100, latitude: 28.5300, longitude: 77.3700 },
    { name: "Wajidpur", district: "Noida", tehsil: "Noida", population: "4,200", problems: "Yamuna Floodplain Embankment & Clean Drinking Water", status: "In Progress", progress: 75, latitude: 28.5000, longitude: 77.3800 },
    { name: "Chhaproli Khadar", district: "Noida", tehsil: "Noida", population: "5,100", problems: "Primary Health Wellness Sub-Center & LED Lighting", status: "Completed", progress: 100, latitude: 28.4800, longitude: 77.4000 },
    { name: "Nagli Wazidpur", district: "Noida", tehsil: "Noida", population: "3,900", problems: "Pond Restoration under Amrit Sarovar Scheme", status: "Under Assessment", progress: 30, latitude: 28.5100, longitude: 77.3900 },
    { name: "Sorkha", district: "Noida", tehsil: "Noida", population: "7,800", problems: "Solid Waste Processing Unit & Internal Paved Roads", status: "Completed", progress: 100, latitude: 28.5800, longitude: 77.3900 },
    { name: "Surajpur Rural", district: "Greater Noida", tehsil: "Dadri", population: "8,900", problems: "Surajpur Bird Sanctuary Buffer Eco-Sanitation & Sewage", status: "Completed", progress: 100, latitude: 28.5200, longitude: 77.4900 },
    { name: "Ecotech Rural / Milk Lachi", district: "Greater Noida", tehsil: "Dadri", population: "4,600", problems: "Industrial Effluent Barrier & Solar Streetlight Grid", status: "In Progress", progress: 80, latitude: 28.4700, longitude: 77.5000 },
    { name: "Knowledge Park Rural / Tughalpur", district: "Greater Noida", tehsil: "Greater Noida", population: "6,300", problems: "Student Community Housing Water Purification ATM", status: "Completed", progress: 100, latitude: 28.4600, longitude: 77.5300 },
    { name: "Kasna", district: "Greater Noida", tehsil: "Greater Noida", population: "9,400", problems: "Community Health Center Emergency Unit Upgrade", status: "In Progress", progress: 70, latitude: 28.4300, longitude: 77.5400 },
    { name: "Dankaur Rural", district: "Greater Noida", tehsil: "Dankaur", population: "10,200", problems: "Yamuna Expressway Feeder Road & Farmers Market Hub", status: "Completed", progress: 100, latitude: 28.3500, longitude: 77.5500 },
    { name: "Bhadol", district: "Greater Noida", tehsil: "Dankaur", population: "3,200", problems: "Solar Drip Irrigation & Dairy Cold Chain", status: "Under Assessment", progress: 35, latitude: 28.4000, longitude: 77.5200 }
];

async function seedDatabase() {
    try {
        await connectDB();
        
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@villagehub.in';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@VillageHub2024';

        if (getMongoConnected()) {
            await Village.deleteMany({});
            await User.deleteMany({});

            await Village.insertMany(VILLAGES);
            console.log(`Successfully seeded ${VILLAGES.length} villages into MongoDB.`);

            await User.create({
                name: 'Village Hub Admin',
                email: adminEmail,
                password: adminPassword,
                role: 'admin'
            });
            console.log('Successfully created admin user in MongoDB.');
        } else {
            const villageStore = new JsonStore('villages');
            const userStore = new JsonStore('users');

            villageStore.clear();
            userStore.clear();

            for (const village of VILLAGES) {
                villageStore.create(village);
            }
            console.log(`Successfully seeded ${VILLAGES.length} villages into JSON store.`);

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);

            userStore.create({
                name: 'Village Hub Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Successfully created admin user in JSON store.');
        }

        console.log('\n--- Seeding Complete ---');
        console.log(`Admin Email: ${adminEmail}`);
        console.log(`Admin Password: ${adminPassword}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
