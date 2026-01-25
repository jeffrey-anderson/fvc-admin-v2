// Simple test script to verify FVC API integration
const FVC_API_URL = 'https://fg732tgz9j.execute-api.us-east-2.amazonaws.com/Devl';

async function testApiEndpoints() {
  console.log('🧪 Testing FVC API endpoints...\n');

  // Test season endpoint (public)
  try {
    console.log('📅 Testing GET /season (public)...');
    const seasonResponse = await fetch(`${FVC_API_URL}/season`);
    console.log(`   Status: ${seasonResponse.status}`);
    
    if (seasonResponse.ok) {
      const seasonData = await seasonResponse.json();
      console.log(`   ✅ Season data retrieved`);
      console.log(`   📊 Website opens: ${new Date(seasonData.WebsiteOpenOn).toLocaleDateString()}`);
      console.log(`   📊 First checkin: ${new Date(seasonData.FirstCheckinDate).toLocaleDateString()}`);
      console.log(`   📊 Last checkout: ${new Date(seasonData.LastCheckoutDate).toLocaleDateString()}`);
    } else {
      console.log(`   ❌ Failed to get season data`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  console.log('');

  // Test out-of-office endpoint (public)
  try {
    console.log('🏖️  Testing GET /events/ooo (public)...');
    const oooResponse = await fetch(`${FVC_API_URL}/events/ooo`);
    console.log(`   Status: ${oooResponse.status}`);
    
    if (oooResponse.status === 200) {
      const oooData = await oooResponse.json();
      console.log(`   ✅ Out-of-office data retrieved`);
      console.log(`   📊 Raw data:`, JSON.stringify(oooData, null, 2));
      console.log(`   📊 Start: ${new Date(oooData.StartDate).toLocaleDateString()}`);
      console.log(`   📊 End: ${new Date(oooData.EndDate).toLocaleDateString()}`);
    } else if (oooResponse.status === 404) {
      console.log(`   ✅ No out-of-office period set (404 is expected)`);
    } else {
      console.log(`   ❌ Unexpected status: ${oooResponse.status}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  console.log('');
  console.log('🎉 API connectivity test completed!');
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Visit http://localhost:3000 in your browser');
  console.log('2. Log in with your FVC Cognito credentials');
  console.log('3. Test the FVC API Management interface');
  console.log('4. Try updating season or out-of-office data');
}

// Run the test
testApiEndpoints().catch(console.error);