import axios from "axios";

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

export async function getTecaj(): Promise<Tecaj[]> {
    let response = await axios.get(TECAJ_URL);
    return response.data as Tecaj[];
}