

async function runAllFeatureTests() {
  console.log('====================================================');
  console.log('  STARTING COMPREHENSIVE END-TO-END FEATURE TEST   ');
  console.log('====================================================\n');

  const BASE_URL = 'http://localhost:3000';
  let passedCount = 0;
  let totalTests = 0;

  function assert(condition, testName, details = '') {
    totalTests++;
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passedCount++;
    } else {
      console.error(`  [FAIL] ${testName} ${details ? '- ' + details : ''}`);
      throw new Error(`Assertion failed for: ${testName}`);
    }
  }

  console.log('--- 1. Testing Page Routes (GET) ---');
  const pages = ['/', '/assessment', '/dashboard', '/report'];
  for (const page of pages) {
    const res = await fetch(`${BASE_URL}${page}`);
    assert(res.status === 200, `Page ${page} returns HTTP 200 OK`);
    const html = await res.text();
    assert(html.length > 500, `Page ${page} returns valid HTML body (${html.length} bytes)`);

    if (page === '/assessment') {
     
      assert(!html.includes('start-voice-input'), 'Assessment page has no start-voice-input buttons');
      assert(!html.includes('voice-input-btn'), 'Assessment page has no voice-input-btn elements');
    }

    if (page === '/report') {
      
      assert(!html.includes('Listen to Audio Advisory'), 'Report page has no "Listen to Audio Advisory"');
      assert(!html.includes('Audio Advisory'), 'Report page has no Audio Advisory buttons');
    }
  }

  
  console.log('\n--- 2. Testing Scheme Router API (/api/scheme) ---');
 
  const resSchemeSmall = await fetch(`${BASE_URL}/api/scheme`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectCost: 100000 })
  });
  const dataSchemeSmall = await resSchemeSmall.json();
  assert(resSchemeSmall.status === 200, 'Scheme API (₹1,00,000) returns HTTP 200');
  assert(dataSchemeSmall.result.name.includes('Micro Finance'), `Scheme is Micro Finance Scheme for ₹1,00,000 (received: ${dataSchemeSmall.result.name})`);

 
  const resSchemeLarge = await fetch(`${BASE_URL}/api/scheme`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectCost: 250000 })
  });
  const dataSchemeLarge = await resSchemeLarge.json();
  assert(resSchemeLarge.status === 200, 'Scheme API (₹2,50,000) returns HTTP 200');
  assert(dataSchemeLarge.result.name.includes('Term Loan'), `Scheme is Term Loan Scheme for ₹2,50,000 (received: ${dataSchemeLarge.result.name})`);

 
  console.log('\n--- 3. Testing Viability Scoring API (/api/viability) ---');
  const resViability = await fetch(`${BASE_URL}/api/viability`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      marketDemand: 80,
      competition: 30,
      budgetFit: 85,
      seasonalRisk: 20,
      profitPotential: 75,
      experienceYears: 4,
      hasLandOrShop: true,
      monthlyRevenue: 35000,
      operatingExpenses: 15000,
      monthlyEMI: 4500,
      category: 'Agro Processing / Flour Mill',
      marginCapital: 25000,
      projectCost: 250000,
      competitorCount: 2
    })
  });
  const dataViability = await resViability.json();
  assert(resViability.status === 200, 'Viability API returns HTTP 200');
  assert(typeof dataViability.result.score === 'number' && dataViability.result.score > 0, `Viability score calculated (${dataViability.result.score}/100)`);
  assert(['HIGH', 'MODERATE', 'LOW'].includes(dataViability.result.rating), `Rating is valid: ${dataViability.result.rating}`);
  assert(dataViability.result.factors !== undefined, 'Viability breakdown factors returned');


  console.log('\n--- 4. Testing Assessment Analysis API (/api/assessment) ---');
  const testAssessmentPayload = {
    fullName: 'Suresh Patil',
    age: 35,
    mobileNumber: '9876543210',
    businessName: 'Patil Agro Center',
    category: 'Agro Processing / Flour Mill',
    village: 'Ralegan',
    block: 'Parner',
    district: 'Ahmednagar',
    state: 'Maharashtra',
    marginCapital: 25000,
    experienceYears: 4,
    hasLandOrShop: true,
    monthlyRevenue: 40000,
    operatingExpenses: 18000
  };

  const resAssess = await fetch(`${BASE_URL}/api/assessment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assessment: testAssessmentPayload })
  });
  const dataAssess = await resAssess.json();
  assert(resAssess.status === 200, 'Assessment API returns HTTP 200');
  assert(dataAssess.success === true, 'Assessment returned success: true');
  assert(dataAssess.result.finance.monthlyEMI > 0, `Monthly EMI calculated: ₹${Math.round(dataAssess.result.finance.monthlyEMI)}`);
  assert(dataAssess.result.finance.projectCost > 0, `Project cost calculated: ₹${dataAssess.result.finance.projectCost}`);
  assert(dataAssess.result.finance.scheme.tenureYears > 0, `Scheme tenure is positive (${dataAssess.result.finance.scheme.tenureYears} yrs)`);
  assert(dataAssess.result.viability.score >= 50, `Viability score is healthy: ${dataAssess.result.viability.score}`);

  
  console.log('\n--- 5. Testing Market Analysis API (/api/market) ---');
  const resMarket = await fetch(`${BASE_URL}/api/market`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      village: 'Ralegan',
      block: 'Parner',
      district: 'Ahmednagar',
      state: 'Maharashtra',
      businessType: 'Agro Processing',
      radiusKm: 5
    })
  });
  const dataMarket = await resMarket.json();
  assert(resMarket.status === 200, 'Market API returns HTTP 200');
  assert(dataMarket.success === true, 'Market API success: true');
  assert(dataMarket.location !== undefined, 'Geocoded location coordinates returned');
  assert(dataMarket.market !== undefined, 'Market analytics returned');


  console.log('\n--- 6. Testing AI Advisory API (/api/ai) ---');
  const resAdvisory = await fetch(`${BASE_URL}/api/ai`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      assessment: testAssessmentPayload,
      finance: dataAssess.result.finance,
      market: dataMarket.market,
      language: 'en'
    })
  });
  const dataAdvisory = await resAdvisory.json();
  assert(resAdvisory.status === 200, 'AI Advisory API returns HTTP 200');
  assert(dataAdvisory.success === true, 'AI Advisory success: true');
  assert(dataAdvisory.advisory.recommendation !== undefined, `Recommendation: ${dataAdvisory.advisory.recommendation}`);
  assert(dataAdvisory.advisory.keyReasons.length > 0, 'Advisory contains key reasons');

 
  console.log('\n--- 7. Testing Conversational AI Agent (/api/chat) ---');
  const chatContext = {
    assessment: testAssessmentPayload,
    result: dataAssess.result
  };

  const testChatQueries = [
    { text: 'Explain my loan scheme & monthly EMI', lang: 'en', expectSubstrings: ['₹', 'EMI', 'Loan'] },
    { text: 'Why is my viability score only this much?', lang: 'en', expectSubstrings: ['Viability Score', 'Patil Agro Center'] },
    { text: 'What documents should I take to the bank?', lang: 'en', expectSubstrings: ['Aadhaar', 'PAN', 'Report'] },
    { text: 'How can I reduce risks in my village?', lang: 'en', expectSubstrings: ['risk', 'Patil'] },
    { text: 'मेरी ऋण योजना और मासिक ईएमआई समझाएं', lang: 'hi', expectSubstrings: ['ऋण', 'ईएमआई'] },
    { text: 'माझा व्यवहार्यता स्कोअर इतकाच का आहे?', lang: 'mr', expectSubstrings: ['व्यवहार्यता', 'स्कोअर'] }
  ];

  for (const q of testChatQueries) {
    const resChat = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: q.text }],
        context: chatContext,
        language: q.lang
      })
    });
    const dataChat = await resChat.json();
    assert(resChat.status === 200, `Chat query [${q.lang}]: "${q.text.slice(0, 35)}..." returns HTTP 200`);
    assert(dataChat.success === true, `Chat response success is true for [${q.lang}]`);
    assert(!dataChat.message.includes('higher than normal network traffic'), `Query [${q.lang}] did NOT return generic fallback error`);
    
    const hasExpectedKeyword = q.expectSubstrings.some(sub => 
      dataChat.message.toLowerCase().includes(sub.toLowerCase())
    );
    assert(hasExpectedKeyword, `Query [${q.lang}] contains grounded context keywords (${q.expectSubstrings.join(', ')})`);
    console.log(`    Provider used: ${dataChat.provider} | Response snippet: ${dataChat.message.slice(0, 90).replace(/\n/g, ' ')}...`);
  }

  console.log('\n====================================================');
  console.log(`  ALL TESTS COMPLETED SUCCESSFULLY! (${passedCount}/${totalTests} Passed) `);
  console.log('====================================================\n');
}

runAllFeatureTests().catch(err => {
  console.error('\nTest execution failed:', err);
  process.exit(1);
});
