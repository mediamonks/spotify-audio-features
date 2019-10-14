# Installatie
## Lokaal opzetten
- Installeer `nvm` als je dit nog niet hebt geïnstalleerd. Deze template is gebouwd en getest vanaf node v9.x t/m node v11.x.
- Gebruik `pnpm` in plaats van `npm`. Installatie: https://github.com/pnpm/pnpm#install. In alle commando's die je normaal gesproken uitvoert met `npm` vervang je `npm` met `pnpm`.
- Voer `gulp -v` uit. Bij geen resultaat of CLI version lager dan 2.0.0: `pnpm i -g gulp-cli`
- `pnpm i`
- Zet `filemode = false` in je .git/config
- Draai `gulp serve` om te serveren (lokale ontwikkeling), de app zou nu moeten werken
- Draai `gulp compile` om te compileren naar de dist map.
- Om op productie te debuggen, voer je in dat tabje in de console het volgende in: `localStorage.setItem('debug', true)`. Ververs daarna de pagina.

## Opmerking
Bij het serveren van de app wordt `/node_modules` opengesteld door browser-sync. Hierdoor kunnen we, zonder files van node_modules te kopieren naar de `src` map, ESM modules importeren. Rollup zorgt er dan tijdens het compilatieproces voor dat de paden naar de geimporteerde modules geresolved worden naar de `node_modules` map en voegt de inhoud van deze modules allemaal samen in 1 gebundeld JavaScript bestand.

# Key components
- ...
- ...
- ...

## Deployment/Fonkel dist server info
Dit project wordt d.m.v. de Fonkel dist server (dist.fonkel.io) gedeployed. Je dient de code zelf te compileren alvorens je pusht (`gulp compile`).

Het bestand **CNAME** geeft aan wat het gewenste domein is waarop deze applicatie moet draaien. Bij pushen naar de dist server wordt de applicatie (afhankelijk van de instellingen in de vhost files) bereikbaar op een URL in de vorm van: ***[branch.][CNAME].dist.fonkel.io***, waarbij *branch* alleen wordt ingevuld bij niet-master branches. Op moment van schrijven staat de dist server alleen de branches *staging* en *master* toe.

Het **vhost** bestand kan gebruikt worden voor een algemene nginx setup (non-branch specifiek). Mocht dat de voorkeur hebben, dan kunnen de bestanden `vhost-master` en `vhost-staging` worden verwijderd. Deze laatste bestanden zijn branch-specifieke nginx setups en staan toe dat je staging domein zich anders gedraagt dan master. Voorbeeld: *staging.[CNAME].dist.fonkel.io* wordt gebruikt om de applicatie te testen, maar *[CNAME].dist.fonkel.io* moet redirecten naar het productiedomein. Verwijder **nooit** het bestand `vhost`.