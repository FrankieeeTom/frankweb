# Návod k použití

## init
- naklonuj si repozitář
- nainstaluj `pnpm`
- `pnpm install`
- můžeš `pnpm update`
- založ si free účet na [Cloudinary](https://cloudinary.com)
- otevři soubor `eleventy.config.js`
- na první řádce nastav proměnnou `CLOUDINARY_ACC` na id svého účtu

## přidávání obrázků / videí
- nahraj obrázek/video do Cloudinary
- klikni u na tři tečky > Open
- zkopíruj si *Public ID*. Můžeš ho předtím upravit.
- otevři soubor `art-pieces.json` ve složce `content/_data/`
- můžeš smazat to co jsem tam dal já
- teď tam přdáš nový obrázek nebo video:

## art-pieces.json
Toto je JSON soubor, který je Array - `[]`.

Array obsahuje Objekty - `{}`.

Každý objekt je jeden obrázek nebo video. Vypadá takto:

```json
{
    "title": "Stage",
    "desc": "my animatronic Terry on the stage",
    "alt": "Animatronický medvěd s otevřenou pusou stojí v šeru",
    "date": "2067-01-01",
    "type": "image",
    "cloudinaryId": "terry-9257",
}
```

`title` je název, `desc` je popis, `alt` je alt-text pro screen readery (slepý lidi) a boty a tak.
`date` je datum, na webu je řazení od nejnovějšího.
`type` je buď `"image"` nebo `"video"`. musí být správně nastavený, jinak to nebude fungovat.
`cloudinaryId` je to id co sis zkopírovával. Pokud chceš dát na web soubor co je jinde než na Cloudinary, dej tam místo `cloudinaryId` `url`, kam dáš celou url adresu souboru. takže `"url": "https://example.com/mojevideo.mp4"`

pak je ještě `customDetails`. ten je defaultně false, a nemusíš ho tam dávat. když tam dáš `"customDetails": true`, tak se pro to nevytvoři samostatná stránka, ale pořád bude v galerii na hlavní stránce. pak bys mohl vytvořit vlastní html stránku pro deatily. to kdyžtak dovysvětlim.

## preview změn
kdyžs to přidal do `art-pieces.json`, tak se můžeš podívat, jak to bude vypadat.

spusť `pnpm exec eleventy --serve`. musíš být ve vrchní složce webu.
napíše se ti `localhost` adresa, kterou když otevřeš, tak uvidíš svůj web.
jestli seš spoko, tak vypni preview webu (ctrl-C). smaž projistotu build soubory - `rm _site/* -r`. teď buildni svůj web - `pnpm exec eleventy`

ve složce `_site/` je teď buildnutý statický web z html souborů a tak. obsah složky nahraješ na hosting a je hotovo.

## TODO
- favicon
- metadata v `<head>`
- komentáře
- mobilní layout detailu obrázku
- lepší optimalizace maybe
- hezčí font možná
- víc ikonek na sociální sítě mby
- *about me* stránka
- zničit flash of unstyled content
- jít spát
