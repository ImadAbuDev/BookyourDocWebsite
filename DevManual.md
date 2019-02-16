# CI/Buildschritte für Frontend:

Anzupassen ist im Quellcode:

src/app/services/data.service.ts Zeile 62: API-Url)


Benötigte Pakete/Installationen

- Node.JS >=8 mit npm, für CI und Betrieb
- Angular-CLI global (`npm install -g @angular/cli`), ggf. mit Root-rechten ausführen

Buildschritte (im Directory mit aktuellem git-clone)

1. `npm ci` Installiert alle Abhängigkeiten
2. `npm run-script build` Baut Typescript
3. `ng test --progress=false` Führt tests aus
4. `ng build --prod --build-optimizer --progress=false` Baut die Applikation für eine Produktivumgebung
5. `ng lint` Führt lint aus (wenn fail -> UNSTABLE)
6. `echo "jenkins-build=$BUILD_NUMBER" > dist/bookyourdoc.tk/build.txt` Gibt die Jenkins-Build-Nummer aus (der aktuelle Build kann unter https://bookyourdoc.tk/build.txt eingesehen werden)
7. Versende Benachrichtigungsmails, lade dist/ per SCP auf den Server

Der Ordner dist/ kann direkt als via HTTP ausgegeben werden (z.B. in /var/www/ oder /var/www/html).
