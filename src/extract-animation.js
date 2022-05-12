import fs from 'fs';
import path from 'path';
import set from 'lodash-es/set.js';
import get from 'lodash-es/get.js';


function readCharactersData(directoryPath, characters) {
    try {
        const rawdata = fs.readFileSync(`${directoryPath}/characters.json`);
        return JSON.parse(rawdata);
    } catch (e) {
        return {};
    }
}

function main() {
    const __dirname = path.resolve();
    const characters = {};
    const directoryPath = path.join(__dirname, 'assets');
    fs.unlinkSync(`${directoryPath}/characters.json`);
    //passsing directoryPath and callback function
    fs.readdir(directoryPath,  (err, files) => {
        files
            .filter((file) => file.endsWith('.json'))
            .map((file) => {
                const content = fs.readFileSync(`${directoryPath}/${file}`);
                const spineData = JSON.parse(content.toString());
                if (get(spineData, 'skeleton.spine') === '3.8.75') {
                    set(spineData, 'skeleton.spine', '3.8.75-beta'); // simple trick - to prevent runtime error.
                }
                characters[file] = spineData;
            });

        const existingCharacters = {...readCharactersData(), ...characters}; // merge new animation with existing
        fs.writeFileSync(`${directoryPath}/characters.json`, JSON.stringify(existingCharacters, null, 2));
    });
}

main();
