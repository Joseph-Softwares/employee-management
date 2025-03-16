/**
 * setup-mongodb-atlas.js
 * A utility script to help test the MongoDB Atlas connection
 * 
 * Usage:
 * 1. Replace the connection string with your MongoDB Atlas connection string
 * 2. Run: node setup-mongodb-atlas.js
 */

const mongoose = require('mongoose');

// Replace with your MongoDB Atlas connection string
const MONGODB_URI = 'mongodb+srv://username:password@cluster.mongodb.net/employee-management-system?retryWrites=true&w=majority';

// Connect to MongoDB Atlas
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('✅ Successfully connected to MongoDB Atlas!');

        // Create a simple test document
        const TestSchema = new mongoose.Schema({
            name: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        });

        const Test = mongoose.model('Test', TestSchema);

        return Test.create({ name: 'Test Connection' });
    })
    .then(doc => {
        console.log('✅ Successfully created test document:');
        console.log(doc);

        // Clean up - delete the test document
        return doc.deleteOne();
    })
    .then(() => {
        console.log('✅ Successfully cleaned up test document');
        console.log('✅ Your MongoDB Atlas connection is working correctly!');

        // Disconnect from MongoDB
        return mongoose.disconnect();
    })
    .then(() => {
        console.log('✅ Disconnected from MongoDB Atlas');
        console.log('\n📝 Next steps:');
        console.log('1. Update your .env.production file with this connection string');
        console.log('2. Make sure to replace username, password, and cluster with your actual values');
        console.log('3. Proceed with your deployment process');
    })
    .catch(error => {
        console.error('❌ MongoDB Atlas connection error:', error);
        console.log('\n🔍 Troubleshooting tips:');
        console.log('1. Check if your IP address is whitelisted in MongoDB Atlas');
        console.log('2. Verify your username and password');
        console.log('3. Ensure your cluster is running');
        console.log('4. Check network connectivity to MongoDB Atlas');

        // Disconnect from MongoDB if connected
        mongoose.disconnect();
    });
