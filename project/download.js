const fs = require('fs');
const path = require('path');
const https = require('https');

// Function to download a file
async function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(filePath);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else {
        reject(`Failed to download ${url}`);
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Function to ensure directory exists
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Create a zip file with all project files
async function createProjectZip() {
  const JSZip = require('jszip');
  const zip = new JSZip();

  // Add all project files to zip
  function addFilesToZip(dir, zipFolder) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      // Skip node_modules and .git
      if (file === 'node_modules' || file === '.git' || file === 'dist') {
        return;
      }

      if (stat.isDirectory()) {
        addFilesToZip(filePath, zipFolder.folder(file));
      } else {
        const fileContent = fs.readFileSync(filePath);
        zipFolder.file(file, fileContent);
      }
    });
  }

  addFilesToZip('.', zip);

  // Generate zip file
  const content = await zip.generateAsync({ type: 'nodebuffer' });
  fs.writeFileSync('project.zip', content);
  console.log('Project files have been zipped to project.zip');
}

// Main execution
async function main() {
  try {
    // Add jszip as a dependency
    const packageJson = JSON.parse(fs.readFileSync('package.json'));
    if (!packageJson.devDependencies) {
      packageJson.devDependencies = {};
    }
    packageJson.devDependencies.jszip = "^3.10.1";
    fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

    console.log('Installing required dependencies...');
    require('child_process').execSync('npm install', { stdio: 'inherit' });

    console.log('Creating project zip...');
    await createProjectZip();
    
    console.log('\nProject successfully prepared for VSCode!');
    console.log('\nInstructions to import in VSCode:');
    console.log('1. Download the generated project.zip file');
    console.log('2. Extract the zip file to your desired location');
    console.log('3. Open VSCode');
    console.log('4. Go to File > Open Folder');
    console.log('5. Select the extracted project folder');
    console.log('6. Run npm install to install dependencies');
    console.log('7. Run npm run dev to start the development server');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();