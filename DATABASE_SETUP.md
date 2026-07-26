# De gedeelde boekenkast activeren

De app blijft zonder database lokaal werken. Volg deze stappen om verhalen
tussen verschillende toestellen te synchroniseren.

## 1. Maak een Supabase-project

Ga naar `https://database.new`, maak een project en open daarna de SQL Editor.

## 2. Maak de tabellen

Open `supabase/schema.sql`, kopieer de volledige inhoud naar de SQL Editor en
voer ze één keer uit.

## 3. Voeg de sleutels toe aan Vercel

Open in Vercel:

`Project → Settings → Environment Variables`

Voeg toe:

```text
SUPABASE_URL=https://jouw-project.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...
```

De secret key staat in Supabase onder:

`Project Settings → API Keys`

Gebruik de nieuwe **secret key**, niet de publishable key. Deze sleutel mag
nooit in een variabele staan die met `NEXT_PUBLIC_` begint.

## 4. Deploy opnieuw

Start na het bewaren van de variabelen een nieuwe Vercel-deployment.

## Controleren

1. Maak op toestel A een kort verhaal.
2. Open op toestel B dezelfde boekenplank.
3. Het verhaal hoort daar automatisch te verschijnen.
4. Open handmatig `/pluis-kantoor` om het volwassenenoverzicht te bekijken.

## Belangrijke tijdelijke beperking

Er is nog geen aanmelding. De app behandelt de vier kindprofielen daarom als
één vertrouwde gezinsomgeving. De database is niet rechtstreeks vanuit de
browser bereikbaar, maar de app-routes en `/pluis-kantoor` hebben nog geen
persoonlijke toegangscontrole. Voeg vóór een schooltest ouder- en kindtoegang
toe.
