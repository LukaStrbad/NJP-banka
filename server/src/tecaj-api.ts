import axios from "axios";
import fs from "node:fs/promises";
import fsSync from "node:fs";

export interface Tecaj {
    drzava: string,
    drzava_iso: string,
    sifra_valute: string,
    valuta: string,
    kupovni_tecaj: string,
    srednji_tecaj: string,
    prodajni_tecaj: string,
}

const TECAJ_URL = "https://api.hnb.hr/tecajn-eur/v3";
const SAVE_DIR = __dirname + "/data"
const SAVE_PATH = SAVE_DIR + "/tecaj.json";

export async function getTecaj(): Promise<Tecaj[]> {
    try {
        let data = await fs.stat(SAVE_PATH);
        let fileDate = data.birthtime.toISOString().split("T")[0];
        let today = new Date().toISOString().split("T")[0];
        // If saved file is up to date return this
        if (fileDate == today) {
            let fileContents = await fs.readFile(SAVE_PATH, "utf8");
            return JSON.parse(fileContents) as Tecaj[];
        }
    }
    catch (e) {
        console.log("File doesn't exist, creating a new one.");
    }
    let response = await axios.get(TECAJ_URL);
    let tecajArr = response.data as Tecaj[];
    if (!fsSync.existsSync(SAVE_DIR)) {
        await fs.mkdir(SAVE_DIR);
    }
    fs.writeFile(SAVE_PATH, JSON.stringify(tecajArr));

    return tecajArr;
}