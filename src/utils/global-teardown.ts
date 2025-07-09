import { FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

async function globalTeardown(config: FullConfig) {
  // Clean up any global resources if needed
  console.log('Global teardown completed');
  
  // Automatically fix report paths for better compatibility
  await fixReportPaths();
}

async function fixReportPaths(reportDir = './test-results/playwright-report') {
  console.log(`Fixing report paths in: ${reportDir}`);
  
  if (!fs.existsSync(reportDir)) {
    console.log(`Report directory not found: ${reportDir}`);
    return;
  }

  try {
    // Fix index.html
    const indexPath = path.join(reportDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      let content = fs.readFileSync(indexPath, 'utf8');
      
      // Replace absolute paths with relative paths
      content = content.replace(/file:\/\/\/.*?\/playwright-report\//g, './');
      content = content.replace(/\/.*?\/playwright-report\//g, './');
      
      fs.writeFileSync(indexPath, content);
      console.log('Fixed index.html paths');
    }

    // Fix data files
    const dataDir = path.join(reportDir, 'data');
    if (fs.existsSync(dataDir)) {
      const files = fs.readdirSync(dataDir);
      let fixedCount = 0;
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(dataDir, file);
          let content = fs.readFileSync(filePath, 'utf8');
          
          // Replace absolute paths with relative paths
          const originalContent = content;
          content = content.replace(/file:\/\/\/.*?\/playwright-report\//g, './');
          content = content.replace(/\/.*?\/playwright-report\//g, './');
          
          if (content !== originalContent) {
            fs.writeFileSync(filePath, content);
            fixedCount++;
          }
        }
      }
      
      if (fixedCount > 0) {
        console.log(`Fixed paths in ${fixedCount} data files`);
      }
    }

    console.log('Report paths automatically fixed for better compatibility');
  } catch (error) {
    console.log('Warning: Could not fix report paths:', error);
  }
}

export default globalTeardown; 