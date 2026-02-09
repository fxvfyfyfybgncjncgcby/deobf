const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

app.post('/api/deobfuscate', (req, res) => {
    const code = req.body.code;
    
    fs.writeFileSync('temp_input.lua', code);
    
    exec('lua dumper.lua temp_input.lua temp_output.lua', (error, stdout) => {
        if (error) {
            console.error('Erreur:', error);
            return res.json({ 
                success: false, 
                error: error.message 
            });
        }
        
        try {
            const result = fs.readFileSync('temp_output.lua', 'utf8');
            
            fs.unlinkSync('temp_input.lua');
            fs.unlinkSync('temp_output.lua');
            
            res.json({ 
                success: true, 
                result: result 
            });
        } catch (err) {
            res.json({ 
                success: false, 
                error: 'Erreur de lecture' 
            });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
