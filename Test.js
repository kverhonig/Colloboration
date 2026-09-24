const fs = require("fs");

// CSV-Datei einlesen
const csvText = fs.readFileSync("fahrradverleih.csv", "utf8");

// Zeilen aufteilen und leere Zeilen entfernen
const zeilen = csvText
    .trim()
    .split(/\r?\n/);

// Erste Zeile enthält die Spaltennamen
const spalten = zeilen[0].split(";");

// Restliche Zeilen in Objekte umwandeln
const fahrraeder = zeilen.slice(1).map((zeile) => {
    const werte = zeile.split(";");
    const datensatz = {};

    spalten.forEach((spalte, index) => {
        datensatz[spalte] = werte[index];
    });

    return datensatz;
});

// Gesamten Datensatz ausgeben
console.log(fahrraeder);
