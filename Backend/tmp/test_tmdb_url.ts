const testUrl = 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=500&auto=format&fit=crop';

fetch(testUrl, { method: 'HEAD' })
  .then(res => {
    console.log(`Status: ${res.status}`);
    console.log(`Content-Type: ${res.headers.get('content-type')}`);
    
    if (res.ok) {
      console.log('\n✓ Unsplash image URL is accessible and working!');
    } else {
      console.log('\n✗ Image returned status:', res.status);
    }
  })
  .catch((err: any) => {
    console.error('\n✗ Error accessing image:', err.message);
  });
