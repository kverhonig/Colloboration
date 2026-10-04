# Smart Grocery – Abschlussprojekt

## 1. Projektidee

Smart Grocery ist eine interaktive Web-App, mit der Nutzer einen Einkauf planen und die günstigste Kombination aus Billa, Hofer und Spar finden können.

Der Nutzer wählt Produkte und Mengen aus, legt ein Budget fest und kann optional Rabatte pro Supermarkt angeben. Die App vergleicht die Preise und berechnet die günstigste erlaubte Kombination aus maximal 1–3 Supermärkten.

Die ursprüngliche Java-Idee aus Exercise 3 wird damit als Web-App weiterentwickelt.

## 2. Was sieht der Benutzer?

Die Startseite besteht aus:
1. Budget und maximaler Anzahl an Supermärkten
2. optionalen Rabatten
3. Produktauswahl
4. eigener Produkteingabe
5. aktueller Einkaufsliste
6. Button „Günstigsten Einkauf berechnen“
7. Ergebnis mit empfohlenen Supermärkten, Preisen, Gesamtpreis, Ersparnis und Budgetstatus
8. Statistik über bereits abgeschlossene Einkäufe

## 3. Technologien

- HTML: Struktur und Inhalte
- CSS: Layout und Gestaltung
- JavaScript: Interaktion, Berechnungen und Validierung
- JSON: Produktdaten
- localStorage: aktueller Einkauf und lokale Statistik
- Netlify: Veröffentlichung der statischen Website

## 4. Datenhandling

Die Produktstammdaten liegen in `products.json`. JavaScript lädt diese Daten beim Öffnen der Website mit `fetch()`.

Ein Produkt enthält:
- ID
- Name
- Kategorie
- Preis bei Billa
- Preis bei Hofer
- Preis bei Spar

Der aktuelle Einkauf und die Statistik werden lokal im Browser mit `localStorage` gespeichert. Dadurch muss der Nutzer seine aktuelle Liste nicht bei jedem Seitenaufruf neu eingeben.

Es gibt keine Benutzerkonten und keine Übertragung personenbezogener Daten.

## 5. Algorithmus

Der zentrale Algorithmus ist nicht nur eine Addition.

1. Für jeden gewählten Artikel werden die Preise der verfügbaren Supermärkte betrachtet.
2. Auf die Preise werden die eingegebenen Rabatte angewendet.
3. Es werden alle erlaubten Supermarkt-Kombinationen erzeugt:
   - 1 Markt
   - 2 Märkte
   - 3 Märkte
4. Für jede Kombination wird für jedes Produkt der günstigste Preis innerhalb dieser Kombination ausgewählt.
5. Preis × Menge wird zum Gesamtpreis addiert.
6. Die Kombination mit dem niedrigsten Gesamtpreis wird als beste Kombination ausgewählt.
7. Das Ergebnis wird inklusive Zuordnung der Produkte zu den Supermärkten angezeigt.
8. Zusätzlich wird geprüft, ob das Budget eingehalten wird.

## 6. Beispiel

Budget: €50  
Maximal 2 Supermärkte

Milch:
- Billa €1,79
- Hofer €1,39
- Spar €1,69

Reis:
- Billa €2,29
- Hofer €1,89
- Spar €1,99

Die App vergleicht:
- nur Billa
- nur Hofer
- nur Spar
- Billa + Hofer
- Billa + Spar
- Hofer + Spar

Anschließend wird die günstigste erlaubte Variante gewählt.

## 7. Functional Requirements

F1: Der Benutzer kann Produkte auswählen.

F2: Der Benutzer kann die Menge eines Produkts angeben.

F3: Der Benutzer kann eigene Produkte mit Preisen für Billa, Hofer und Spar eintragen.

F4: Die Website berechnet automatisch den Gesamtpreis.

F5: Der Benutzer kann ein Budget festlegen.

F6: Die Website warnt bei Überschreitung des Budgets.

F7: Der Benutzer kann die maximal erlaubte Anzahl an Supermärkten festlegen.

F8: Die Website vergleicht Supermarktpreise.

F9: Die Website berücksichtigt Rabatte.

F10: Die Website zeigt die günstigste Supermarkt-Kombination.

F11: Die Website zeigt durchschnittlichen Einkaufswert und durchschnittliche Produktanzahl aus dem lokalen Verlauf.

F12: Der Benutzer kann Produkte entfernen und die Einkaufsliste leeren.

## 8. Non-Functional Requirements

NF1: Maximal 200 Produkte pro Einkauf.

NF2: Ein Produktpreis darf maximal €200 betragen.

NF3: Negative Preise werden nicht akzeptiert.

NF4: Nach 3 Stunden ohne Aktivität wird die aktuelle Sitzung zurückgesetzt.

NF5: Die Website ist auf Desktop und Smartphone verwendbar.

NF6: Die Berechnung erfolgt ohne manuelles Neuladen der Seite.

NF7: Produktstammdaten sind von der Programmlogik getrennt.

## 9. Warum kein „nächster Nutzer“?

Die frühere Formulierung „den Durchschnittswert dem nächsten Nutzer anzeigen“ wurde nicht übernommen.

Es gibt keine unterschiedlichen Benutzerkonten. Die Statistik wird nur lokal im Browser gespeichert. Damit werden Daten eines vorherigen Nutzers nicht unbeabsichtigt an andere Personen weitergegeben.

## 10. Aufteilung im Team

Person A:
- HTML-Struktur
- Eingabefelder
- Ergebnisbereich

Person B:
- CSS
- Responsive Design
- Gestaltung und Benutzerfreundlichkeit

Person C:
- JavaScript
- Algorithmus
- JSON-Anbindung
- Validierung

Wichtig: Alle drei sollten die Gesamtlogik kennen und gemeinsam testen.

## 11. Testfälle

1. Ein Produkt, ein Supermarkt
2. Mehrere Produkte
3. Maximal 1 Supermarkt
4. Maximal 2 Supermärkte
5. Maximal 3 Supermärkte
6. Rabatt bei einem Markt
7. Rabatt bei mehreren Märkten
8. Budget wird eingehalten
9. Budget wird überschritten
10. Preis über €200
11. negative Preise
12. mehr als 200 Produkte
13. Produkt löschen
14. Einkaufsliste leeren
15. Seite neu laden und gespeicherte Liste prüfen
16. nach 3 Stunden Inaktivität prüfen, ob die aktuelle Liste zurückgesetzt wird
17. Smartphone-Darstellung prüfen

## 12. Veröffentlichung

Die Dateien `index.html`, `style.css`, `app.js` und `products.json` werden gemeinsam hochgeladen, z. B. auf Netlify. Danach erhält das Team einen Link, den es an den Professor und andere Studierende schicken kann.

## 13. Kurzbeschreibung für die Abgabe

Smart Grocery ist eine interaktive Einkaufs-Web-App. Nutzer können Produkte und Mengen auswählen, ein Budget festlegen und optional Rabatte für Billa, Hofer und Spar eingeben. Die Anwendung vergleicht die Preise und berechnet unter Berücksichtigung der maximal erlaubten Anzahl an Supermärkten die günstigste Einkaufskombination. Produktdaten werden aus einer JSON-Datei geladen. Die aktuelle Einkaufsliste und lokale Einkaufsstatistiken werden im Browser gespeichert. Die Anwendung informiert den Nutzer über den Gesamtpreis, mögliche Ersparnisse und eine Überschreitung des Budgets.
