const { exec } = require('child_process');
const path = require('path');

const scripts = [
  'createTables.js',
  'createAdmin.js',
  'createCourts.js',
  'createTimeSlots.js',
  'createClients.js',
];

const runScript = (script) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(__dirname, script);
    exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ${script}:`, error);
        reject(error);
      } else {
        console.log(`Output of ${script}:`, stdout);
        if (stderr) {
          console.error(`Error output of ${script}:`, stderr);
        }
        resolve();
      }
    });
  });
};

const runScriptsInOrder = async () => {
  for (const script of scripts) {
    try {
      await runScript(script);
    } catch (error) {
      console.error(`Failed to execute ${script}:`, error);
      process.exit(1);
    }
  }
  console.log('All scripts executed successfully');
};

runScriptsInOrder();
