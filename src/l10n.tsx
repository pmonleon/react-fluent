import React, { Children, useEffect, useState, ReactNode } from "react";

import { negotiateLanguages } from "@fluent/langneg";
import { FluentBundle, FluentResource } from "@fluent/bundle";
import { ReactLocalization, LocalizationProvider } from "@fluent/react";

// Parcel decorates filenames with cache-busting hashes.
const ftl = require("../public/*.ftl");


const DEFAULT_LOCALE = "en-US";
const AVAILABLE_LOCALES = {
    "en-US": "English",
    "es": "Spanish",
};

const MESSAGES = {
    es : ` 
    hello = Hola { $userName }!
    hello-no-name = Hola, Sin nombre!
    type-name =
        .placeholder = Tu nombre

    # $date (Date) - Current date, formatted as month and day.
    today-date = Hoy es {$date}.

    # Commented out to demonstrate fallback.
    # $date (Date) - Current date, formatted as weekday.
    today-weekday = Es {$date}.

    sign-in-or-cancel = <signin>Identificate</signin> o <cancel>Deshacer</cancel>.
    clicked-sign-in = te has identificado correctamente!
    clicked-cancel = OK, cancelado.
    ` ,

}

async function fetchMessages(locale: string): Promise<[string, string]> {
    let response = await fetch(ftl[locale]);
    console.log(response)
    let messages = await response.text();
    console.log(messages)
   // let messages = MESSAGES['es']

    return [locale, messages];
}


function* lazilyParsedBundles(fetchedMessages: Array<[string, string]>) {
    for (let [locale, messages] of fetchedMessages) {
        console.log(messages)
        let resource = new FluentResource(messages);
        let bundle = new FluentBundle(locale);
        bundle.addResource(resource);
        yield bundle;
    }
}

interface AppLocalizationProviderProps {
  children: ReactNode;
}

export function AppLocalizationProvider(props: AppLocalizationProviderProps) {
    let [currentLocales, setCurrentLocales] = useState([DEFAULT_LOCALE]);
    let [l10n, setL10n] = useState<ReactLocalization | null>(null);

    useEffect(() => {
        changeLocales(navigator.languages as Array<string>);
    }, []);

    async function changeLocales(userLocales: Array<string>) {
        let currentLocales = negotiateLanguages(
            userLocales,
            Object.keys(AVAILABLE_LOCALES),
            { defaultLocale: DEFAULT_LOCALE }
        );
        setCurrentLocales(currentLocales);

        let fetchedMessages = await Promise.all(
            currentLocales.map(fetchMessages)
        );
        console.log(fetchedMessages)
        let bundles = lazilyParsedBundles(fetchedMessages);
        setL10n(new ReactLocalization(bundles));
    }

    if (l10n === null) {
        return <div>Loading…</div>;
    }

    return <>
        <LocalizationProvider l10n={l10n}>
            {Children.only(props.children)}
        </LocalizationProvider>

        <hr />

        <select
            onChange={event => changeLocales([event.target.value])}
            value={currentLocales[0]}>
            {Object.entries(AVAILABLE_LOCALES).map(
                ([code, name]) => <option key={code} value={code}>{name}</option>
            )}
        </select>
    </>;
}
