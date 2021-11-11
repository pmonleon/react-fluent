# @fluent/react Example

# PARA INICIALIZAR LA APP: npm run start
# los datos los trae de los archivo .flt en public  trabaja con el build rn un servidor creado con el script

This tiny React app demonstrates how `@fluent/react` can integrate with React.

## Running

The example app requires a local build of `@fluent/react`. In the root of
your `fluent.js` clone install the build tools:

    cd fluent.js/
    npm install

Then build and package `@fluent/react`:

    cd fluent.js/fluent-react/
    npm install
    make
    npm pack

Finally, change back to this directory, and build the example:

    cd fluent.js/fluent-react/example/
    npm install
    npm install --no-save ../fluent-react-*.tgz
    npm start

Open http://localhost:1234 to see the example running.

Installing `@fluent/react` via `npm pack` allows to use the in-tree
version of it without picking up the `devDependencies`, which likely
bring a conflicting version of React.
