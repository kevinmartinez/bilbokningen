
### Mikaela Törnlund
 
#### Dokumentation : 
 
##### Server : 
- Express som vi kör på localhost:3030,
- Mongoose för server setup och databas. 
- Vi hostade Databasen på mlab. Den innehåller två olika collections - bilar och användare.  
- Till sist använde vi oss av view engine pug/jade för att rendera clienten. 
 
Routing: sker i routes mappen med alla olika sidor i sin egna fil. Alla sidor är exporterade och används sedan från app.js

 
##### Bilar

Data schema för Bilarna : 
 
var CarSchema = new Schema({

    model: { type: String, required: true },
    seats: { type: Number, required: true },
    isAuto: { type: Boolean, required: true },
    hasRoofrack: { type: Boolean, required: true },
    price: { type: Number, required: true },
    booking: [{
        email: String,
        startDate: String,
        endDate: String,
    }]
 
});
 

- Visar alla bilar i databasen på:
  - landningssidan (/)
  - på /manage-cars (för admin) 
  
- Lägga till bilar 
  - kan admin göra på sidan “manage-cars” och fyller då i en form med all information om bilen. 
  - På submit så skickas en post request till servern som lägger till alla detaljer i en “ny” bil efter bil schemats uppställning. 
- Ta bort alla bilar 
  - görs genom en button “remove” på manage-cars sidan som bara admin kan göra. 
  - På knapptryck så körs en funktion på client-sidans javascript som skickar ett http request till servern med rätt bils id. 
  - På server sidan används delete funktionen och tar bort bilen med det id som sänds.  (eftersom vi använde pug var det enkelt att få id:et som hörde till rätt bil då de både va i samma table row).
- Updatera bilarna med bokningar : 
  - behövs personens email, start datum och slut datum. 
    - om personen är inloggad behövs inte email då den är sparad i ‘session’ när han/hon loggar in
  - Id:et av bilen hämtas från clienten genom att ta id:et från den bilen som tillhör boknings - knappen (samma sak med id gäller här, med hjälp av en loop i pug så kunde id:et lätt kommas åt för rätt bil)och skickar med id:et
  - För att validera datumet så att bilen är ledig den tiden används en callback funktion för att vara säker på att datumet är ledigt innan bokningen sker.
    - först valideras datumet så att inte en bil är bokad det datumet med http request och javascripts filter funktion som går igenom den valda bilens bokningar och ser så att inga av de datum som användaren valde är emellan ett start datum och ett slut datum av bilens  alla bokningar.
    - om datumet är ledigt skickas det tillbaka ett ‘false’ som i sin tur skickar true tillbaka i callback funktionen och låter bokningen fortsätta. Annars skickas en alert till användaren som säger att datumen är upptagna.
    - om datumen är fria: 
      - på client-sidans javascript skickas datumen och email med http request till servern med PATCH request. 
      - Servern hittar bilen med id:et och lägger till bokningen med $push funktionen
- Visar bokade bilar på (/cancel)
    - här kan du se bokade bilar
    - avboka bilar
- Hämta bokade bilar  : 
    - Behövs användarens email i en form med post request (om personen inte är inloggad)
    - om inloggad : GET request när användaren går till sidan , letar efter användarens email i alla bilars bokning efter en matchning.
    - detta sker med aggregations funktionen för att hitta de bokningar som matchar emailen av användaren 
    - För att inte visa alla bokningar för en bil utan bara visa de bokningar för den användare som är på sidan (eller den email som skrevs in) används javascripts map funktion för att ta bort de bokningarna från resultatet som inte är från användaren. 
- Updatera bilar som avbokas : 
    - användaren kan trycka på avboka bil (cancel booking)
    - en PATCH request skickas via http request till servern med bokningens id
    - avbokningen görs med $pull funktionen som raderar bokningen i bookings objektet
 
##### Användare : 
 
Data schema för användarna : 
 
var userSchema = new Schema({

    email: { type: String, required: true },
    password: { type: String, required: true },
    name: String,
});
 

- Användare kan Registrera sig genom att gå till länken Registrera
    - Användaren skriver in sitt email, password och namn
    - skickas som en post request till servern
    - servern kollar så att email:en är ledig 
    - om den är så skapas en ny användare från user schemat
    - användaren skickas vidare till landningsidan och är nu inloggad
    - sessionen för användaren sparas i req.session.user
    - om registreringen misslyckas så händer ingenting(hade velat lägga till någon sorts alert men hade inte tid)
- Användare kan logga in via logga in länken 
  - Användaren skriver in sitt email, password
  - skickas som en post request till servern
  - servern kollar så att en användare med det email och password finns i databasen
  - användaren skickas vidare till landningsidan och är nu inloggad
  - sessionen för användaren sparas i req.session.user
  - om inloggningen misslyckas så händer ingenting(hade velat lägga till någon sorts alert men hade inte tid)
- Logga ut
  - Knappen logga ut (log out) visas när en användare är inloggad
  - tryck på knappen sätter req.session.user till undefined vilket tar bort inloggningen av användaren och den loggas ut
  - användaren skickas till /logout där ett meddelande visas att utloggningen lyckades
- Admin kan lägga till och ta bort bilar samt se alla bilars bokningar
  - för att se sidan “manage-cars” och utföra dessa operationer behöver admin logga in med admin@admin , lösen: admin  endast den inloggningen har möjlighet att se sidan 
- Sessionen är skapad med express-session så att det går att hålla koll på vem som är inloggad  
   - eftersom det bara är två eller tre(för admin) vyer för både användare och admin så använde jag inte cookies för att spara sessionen mellan sidorna utan bara la till “req.session.user = email” för att komma ihåg inloggningen mellan sidorna.  (inte riktigt optimalt).
- Clientens javascript hanterar vilka länkar som ska visas beroende på vem som är inloggad eller om ingen är inloggad
  - log in och sign up länkarna göms när en användare är inloggad
  - log out visas när en användare är inloggad 
  - ‘hantera bilar’ (/manage-cars’)  visas bara om admin är inloggad
  - om en användare är inloggad :
    - avboka bilar - alla bokningar syns direkt 
    - när en bil bokas - email behövs inte skrivas in då det är sparat i sessionen
  - om en användare inte är inloggad :
    - avboka bilar - en form är synlig som användaren kan söka på sin email för att hitta sina bokningar
    - bokning av bil - en input field med email blir synlig så att han/hon kan boka en bil utan att vara inloggad
##### Tester
- Ett test är för att se om landningssidan hämtas som den skall (litet första test)
- Test för bilarna 
  - Ett test är till för att se så att bilar läggs till i databasen när en ny bil skapas
    - De skall bara läggas till om alla fields är ifyllda och de skall ha alla attribut efter att bilen har lagts till
    - Om all information inte är ifylld så skall bilen inte läggas till  
  - Ett test för att hämta bokningar och  ta bort bilar från databasen 
    - Testet skickar en email till /cancel och skickar 200 tillbaka
    - Testet lägger till en ny bil och tar sedan bort bilen med id:et och ge tillbaka 200 response
  - Test för användarna
    - Ett test för en lyckad registrering genom att kolla redirect till landningssidan
    - Ett test för en misslyckad registrering genom att kolla efter errors om fält inte är ifyllda
    - Ett test för en lyckad login genom att kolla redirect till landningssidan
    - Ett test för en misslyckad login genom att kolla om res.send skickar tillbaka false som skickas både vid ofyllda fields och om användarnamnet redan finns
 
 
 
 
 
 
 
 
