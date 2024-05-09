# Burgerpage API

Burgerpage RESTful API on rakennettu osana Metropolia amk tutkintoa toisella vuosikurssilla. API toimii ytheistyössä [Burgerpagen](https://github.com/teemueka/burgerpage) kanssa.

## Esivaatimukset
Ennen aloittamista varmista, että olet täyttänyt seuraavat vaatimukset:

Node.js: Projekti vaatii Node.js:n asennuksen. Voit ladata sen osoitteesta [nodejs.org](https://nodejs.org/en).

## Asennusohjeet

Kloonaa repositorio ja asenna riippuvuudet seuraavilla komennoilla:

```
git clone https://github.com/JoelPalu/burgers_back.git
cd burgers_back
npm install
```

## Käytetyt työkalut

### Kirjastot:

Seuraavat NPM-kirjastot ovat keskeisiä tässä projektissa:
- **[bcrypt](https://www.npmjs.com/package/bcrypt)**: Käytetään salasanojen hashaukseen.
- **[cors](https://www.npmjs.com/package/cors)**: Mahdollistaa CORS (Cross-Origin Resource Sharing) -asetusten hallinnan.
- **[dotenv](https://www.npmjs.com/package/dotenv)**: Käytetään ympäristömuuttujien hallintaan `.env`-tiedostosta.
- **[express-validator](https://www.npmjs.com/package/express-validator)**: Express.js-sovelluksille tarkoitettu kirjasto syötteen validointiin ja puhdistukseen.
- **[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)**: Käytetään JSON Web Tokenien luomiseen ja varmentamiseen.
- **[multer](https://www.npmjs.com/package/multer)**: Middleware tiedostojen käsittelyyn, joka on tarkoitettu lähinnä multipart/form-data -tyyppisten tiedostojen käsittelyyn.
- **[mysql2](https://www.npmjs.com/package/mysql2)**: MySQL-tietokantayhteys ja suoritus.
- **[nodemon](https://www.npmjs.com/package/nodemon)**: Automaattisesti uudelleenkäynnistää node-sovelluksen, kun projektihakemiston tiedostoissa tapahtuu muutoksia.
- **[sharp](https://www.npmjs.com/package/sharp)**: Kuvien käsittelyyn käytetty kirjasto, joka mahdollistaa suorituskykyisen kuvien muokkauksen.


### Rungot:
- RESTful API rakennettu [Express.js](https://expressjs.com/) avulla.

### Ohjelmointikielet:
- JavaScript
- mySQL

## Documentaatio: 
- [apiDoc](http://10.120.32.60/burgerpage/doc/documentation.html)


## Tekijät:
- [Teemu Kallio](https://github.com/teemueka)
- [Kirill Saveliev](https://github.com/JoelPalu)
