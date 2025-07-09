const fs = require('fs');
const path = require('path');

/**
 * Fix Playwright report paths for local viewing
 * Run this script after downloading reports from GitHub Actions
 */
function fixReportPaths(reportDir = './playwright-report') {
  console.log(`Fixing report paths in: ${reportDir}`);
  
  if (!fs.existsSync(reportDir)) {
    console.error(`Report directory not found: ${reportDir}`);
    return;
  }

  // Fix index.html
  const indexPath = path.join(reportDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Replace absolute paths with relative paths
    content = content.replace(/file:\/\/\/.*?\/playwright-report\//g, './');
    content = content.replace(/\/.*?\/playwright-report\//g, './');
    
    fs.writeFileSync(indexPath, content);
    console.log('Fixed index.html');
  }

  // Fix data files
  const dataDir = path.join(reportDir, 'data');
  if (fs.existsSync(dataDir)) {
    const files = fs.readdirSync(dataDir);
    files.forEach(file => {
      if (file.endsWith('.json')) {
        const filePath = path.join(dataDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace absolute paths with relative paths
        content = content.replace(/file:\/\/\/.*?\/playwright-report\//g, './');
        content = content.replace(/\/.*?\/playwright-report\//g, './');
        
        fs.writeFileSync(filePath, content);
        console.log(`Fixed ${file}`);
      }
    });
  }

  console.log('Report paths fixed successfully!');
  console.log('You can now open the report by running: npx playwright show-report');
}

// Run if called directly
if (require.main === module) {
  const reportDir = process.argv[2] || './test-results/playwright-report';
  fixReportPaths(reportDir);
}

module.exports = { fixReportPaths }; 