import * as fs from 'fs'
import { convertPaperback } from './converter'
const decompress = require("decompress");

if (require.main === module) {
    main().catch((err) => console.log(`Uncaught exception: \n\n${err}`))
}

Date.prototype.toJSON = function () {
    return this.toISOString().slice(0,-5)+"Z"
}

// yarn build; yarn start;
async function main() {
    console.log('Converting...')

    // Importing backup
    const pas4file = fs.readdirSync('./input-output/').filter(fn => fn.startsWith('Paperback') && fn.endsWith('.pas4'))[0]
    let fileNames: string[] = []
    console.log(pas4file)
    await decompress('./input-output//' + pas4file, './input-output')
        .then((files: any) => {
            fileNames = files.map((x: any) => './input-output/' + x.path)
            console.log(fileNames);
        })
        .catch((error: any) => {
            console.log(error);
        });

    // Suwatte Backup JSON Object returned
    const suwatteObject = convertPaperback(fileNames)

    // Write to file
    const data = JSON.stringify(suwatteObject, )
    const date_str = new Date(Date.now()).toISOString().split('T')[0]
    fs.writeFileSync(`./input-output/suwatte_${date_str}.json`, data)

    console.log(`Done!\nCheck ./input-output/suwatte_${date_str}.json`)
}