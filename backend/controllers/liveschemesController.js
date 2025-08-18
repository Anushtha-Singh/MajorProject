const { spawn } = require('child_process');
const path = require('path');

function fetchLiveSchemes(req, res) {
    const limit = req.query.limit || 5; // default 5
    const pythonScript = path.join(__dirname, '../scraper.py');
    
    const pythonProcess = spawn('python', [pythonScript, limit]);

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: 'Python script failed', details: errorOutput });
        }
        try {
            const schemes = JSON.parse(output);
            res.json({
                source: 'Live Scraper',
                total: schemes.length,
                data: schemes
            });
        } catch (err) {
            res.status(500).json({ error: 'Failed to parse scraper output', details: err.message });
        }
    });
}

module.exports = { fetchLiveSchemes };
