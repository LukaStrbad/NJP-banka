# NJP-banka

## Upute za pokretanje

1. Stvoriti MySQL bazu podataka pomoću "dbdump.sql" (popunjena baza) ili "dbinit.sql" (prazna baza) datoteka.
    + Promijeniti ime baze ukoliko već postoji takva baza.
2. Promijeniti postavke za spajanje na bazu u datoteci *server/src/config.ts*
3. Pokrenuti `npm install` u *server* i *client* direktorijima
4. Pokrenuti projekt
    + Production
        1. U *client* direktoriju pokrenuti `ng build`
        2. Kopirati sve datoteka iz direktorija *client/dist/client* u direktorij *server/src/public/app*
        3. U *server* direktoriju pokrenuti `npm run start`
    + Development
        1. U *server* direktoriju pokrenuti `npm run start:dev`
        2. U *client* direktoriju pokrenuti `ng serve`
        
## Postojeći računi
1. Admin
    + email: admin@tvz.hr
    + lozinka: "12345678"
2. Ivan Horvat
    + email: ivan.horvat@gmail.com
    + lozinka: "12345678"
