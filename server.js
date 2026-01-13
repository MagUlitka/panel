const express = require('express');
const { spawn } = require('child_process');
const path = require('path');

// 1. Initialize the App
const app = express();
const PORT = 5000;

// 2. Serve Static Files (Your React App)
// Make sure 'dist' matches your actual build folder name!
const DIST_DIR = path.join(__dirname, 'panel/dist');
app.use(express.static(DIST_DIR));

// 3. API Endpoint: Start Bluetooth Service
app.post('/api/start-bluetooth', (req, res) => {
    console.log('Attempting to start Bluetooth Service...');

    // --- CONFIGURATION ---
    const WORK_DIR = '/home/orangepi/Desktop/Leafcore-IoT/Leafcore';
    const PYTHON_EXEC = path.join(WORK_DIR, 'Leafcore/bin/python');
    const SCRIPT_FILE = path.join(WORK_DIR, 'bluetooth_service.py');
    // ---------------------

    console.log(`Running: sudo ${PYTHON_EXEC} ${SCRIPT_FILE}`);

    try {
        const pythonProcess = spawn('sudo', [PYTHON_EXEC, SCRIPT_FILE], {
            cwd: WORK_DIR,
            detached: true,
            stdio: ['ignore', 'inherit', 'inherit'] // Logs errors to PM2 logs
        });

        pythonProcess.unref();
        res.status(200).json({ message: 'Bluetooth Service Started' });
    } catch (error) {
        console.error("Spawn error:", error);
        res.status(500).json({ error: 'Failed to spawn process' });
    }
});

// 4. Fallback Route (Required for React Router)
// Redirects any unknown request back to index.html so React can handle it
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
});

// 5. Start the Server
app.listen(PORT, () => {
    console.log(`Smart Server running at http://localhost:${PORT}`);
});
