# CI/Buildschritte für Backend:

Anzupassen ist im Quellcode:

src/index.ts Zeile 5: URL, unter der MongoDB zu erreichen ist (siehe https://docs.mongodb.com/manual/reference/connection-string/)

src/index.ts Zeile 786 Port, auf dem die Applikation mit HTTP hört.

Für HTTPS etc. wird gegebenenfalls ein HTTPS-Reverse-Proxy, z.B. NGINX, benötigt.

Alternativ wird als API direkt http://localhost:8081 verwendet.



Benötigte Pakete/Installationen

- Node.JS >=8 mit npm, für CI und Betrieb
- MongoDB für Betrieb
- Typescript und tslint global (`npm install -g typescript tslint `), ggf. mit Root-rechten ausführen

Buildschritte (im Directory mit aktuellem git-clone)

1. `npm run-script setup` Installiert alle Abhängigkeiten
2. `npm run-script build` Baut Typescript
3. `npm run-script test` Führt tests aus
4. `npm run-script lint` Führt tslint aus (wenn fail -> UNSTABLE)
5. `echo "{\"build\": $BUILD_NUMBER }" > build.json` Gibt die Jenkins-Build-Nummer aus
6. Versende Benachrichtigungsmails, lade per SCP auf den Server

Start: `npm run-script debug` oder `npm run-script start`
