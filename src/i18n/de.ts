import type { ToolContent } from './types';

export const de: ToolContent = {
  htmlLang: 'de',

  meta: {
    title: 'Excel Viewer — XLSX im Browser öffnen, ohne Upload | runlocally',
    description:
      'XLSX-, XLSM- und XLS-Arbeitsmappen im Browser öffnen. Tabellenblätter wechseln und Zellen in einer schreibgeschützten Tabelle ansehen, ohne die Datei hochzuladen.',
    ogTitle: 'Excel Viewer — Arbeitsmappen im Browser ansehen',
    ogDescription:
      'XLSX-, XLSM- und XLS-Tabellen lokal im Browser ansehen. Die Arbeitsmappe wird nicht hochgeladen.',
  },

  hero: {
    h1: 'Excel-Arbeitsmappen anzeigen',
    tagline:
      'XLSX-, XLSM- oder XLS-Dateien im Browser öffnen, Tabellenblätter wechseln und Zellen ansehen – ohne Upload.',
  },

  intro: {
    h2: 'Excel-Arbeitsmappen im Browser lesen',
    paras: [
      'Der Viewer öffnet jeweils eine Excel-Arbeitsmappe und zeigt jedes Tabellenblatt als schreibgeschützte Tabelle. Über die Reiter oberhalb der Tabelle wechselst du das Blatt; Zeilen- und Spaltenköpfe helfen bei der Orientierung.',
      'Bei großen Tabellenblättern werden nur die Zeilen und Spalten nahe dem sichtbaren Bereich in die Seite eingefügt. Das Einlesen der Arbeitsmappe benötigt weiterhin Gerätespeicher. Welche Dateigröße möglich ist, hängt daher von Browser und Gerät ab.',
    ],
  },

  privacy: {
    h2: 'Arbeitsmappendaten bleiben im Browser',
    lead:
      'Die ausgewählte Datei wird mit SheetJS Community Edition im Browser gelesen. Es gibt weder einen Upload noch eine serverseitige Verarbeitung der Arbeitsmappe:',
    points: [
      'Der Browser liest die Daten aus der Datei auf deinem Gerät.',
      'Die Werte der Tabellenblätter werden in eine Tabelle auf der Seite übertragen.',
      'Keine Netzwerkanfrage enthält Daten aus deiner Arbeitsmappe.',
      'Der Quellcode ist unter der MIT-Lizenz verfügbar.',
    ],
    note:
      'Im Netzwerk-Panel des Browsers kannst du beim Öffnen prüfen, dass keine Anfrage die Datei überträgt.',
    sourceLinkText: 'Quellcode ansehen.',
  },

  howto: {
    h2: 'So verwendest du den Viewer',
    steps: [
      {
        h3: 'Eine Arbeitsmappe auswählen',
        p: 'Wähle eine XLSX-, XLSM- oder XLS-Datei aus oder lege eine Datei auf der Seite ab.',
      },
      {
        h3: 'Tabellenblatt wählen',
        p: 'Wechsle über die Reiter oberhalb der Tabelle zum gewünschten Blatt.',
      },
      {
        h3: 'Zellen ansehen',
        p: 'Scrolle in der schreibgeschützten Tabelle horizontal und vertikal. Schließe die Ansicht, um eine andere Arbeitsmappe zu öffnen.',
      },
    ],
  },

  faqHeading: 'Häufige Fragen',
  faq: [
    {
      q: 'Wird meine Arbeitsmappe hochgeladen?',
      a: 'Nein. Die Arbeitsmappe wird im Browser eingelesen, und der Viewer sendet ihren Inhalt nicht an einen Server. Das lässt sich im Netzwerk-Panel des Browsers prüfen.',
    },
    {
      q: 'Welche Excel-Formate kann ich öffnen?',
      a: 'Der Dateidialog akzeptiert XLSX, XLSM und das ältere XLS-Format. Passwortgeschützte, beschädigte oder nicht unterstützte Strukturen lassen sich unter Umständen nicht öffnen.',
    },
    {
      q: 'Wie werden Formeln dargestellt?',
      a: 'Der Viewer zeigt das in der Arbeitsmappe gespeicherte Berechnungsergebnis. Formeln werden nicht neu berechnet. Fehlt beim Speichern ein aktueller Cachewert, kann das Ergebnis leer oder veraltet sein.',
    },
    {
      q: 'Kann ich die Arbeitsmappe bearbeiten oder speichern?',
      a: 'Nein. Der Viewer dient nur zum Lesen. Er bearbeitet keine Zellen, führt keine Makros aus und schreibt keine Arbeitsmappendatei.',
    },
    {
      q: 'Werden eingebettete Bilder angezeigt?',
      a: 'Nein. SheetJS Community Edition verarbeitet keine eingebetteten Bilder aus Arbeitsmappen, daher kann der Viewer sie nicht darstellen.',
    },
    {
      q: 'Wie werden große Tabellenblätter angezeigt?',
      a: 'Die Tabelle rendert nur Zeilen und Spalten nahe dem sichtbaren Ausschnitt, statt alle Zellen gleichzeitig in die Seite einzufügen. Das Einlesen benötigt dennoch Gerätespeicher.',
    },
  ],

  footer: {
    openSourceLabel: 'Open Source (MIT)',
    partOf: 'Teil von',
    brandTail: '— kleine Tools, die lokal auf deinem Gerät laufen.',
    colophon:
      'Erstellt und gepflegt von Geppetto; bei Teilen von Code und Text kam KI-Unterstützung zum Einsatz.',
    securityText: 'Sicherheit',
  },
};
