# Godot Asset Store Website

## Requirements

- Node 16.15.1 or later
- Yarn package manager
- Visual Studio Code (Recommended code editor)

## How to run the project

1. Open terminal or powershell in the main folder of gas_website project (gas_website folder, where all config files like package.json and  yarn.lock are located).

2. If you don't have Yarn installed run the following command:

    `npm install --global yarn`

3. Install husky with yarn package manager using:

    `yarn add --dev husky` or `yarn global add husky`

4. Install required packages using yarn:

    `yarn install`

5. Create .env file in the main folder of gas_website. Example .env configuration:

NEXT_PUBLIC_REST_API_ENDPOINT="http://localhost:5200/api"

NEXT_PUBLIC_WEBSITE_URL=http://localhost:3000

NEXT_PUBLIC_ADMIN_URL=http://localhost:3002

APPLICATION_BUILD_MODE=production

NEXT_PUBLIC_DEFAULT_LANGUAGE=en

NEXT_PUBLIC_ENABLE_MULTI_LANG=false

NEXT_PUBLIC_AVAILABLE_LANGUAGES=en


NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_12345

NEXT_PUBLIC_PAYPAL_CLIENT_TOKEN=


Variable description:

- NEXT_PUBLIC_REST_API_ENDPOINT - base url of the api, if HTTPS is used, the certificate for backend cannot be self signed, because otherwise Next JS won't connect to the backend, so for developement purposes HTTP should be used instead
- NEXT_PUBLIC_WEBSITE_URL - url of the gas website
- NEXT_PUBLIC_ADMIN_URL - url of admin content management panel
- APPLICATION_BUILD_MODE - production or developement
- NEXT_PUBLIC_DEFAULT_LANGUAGE - default language
- NEXT_PUBLIC_ENABLE_MULTI_LANG - is multilanguage mode enabled
- NEXT_PUBLIC_AVAILABLE_LANGUAGES - supported languages
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY - public api key for Stripe - payment service provider
- NEXT_PUBLIC_PAYPAL_CLIENT_TOKEN - public key for PayPal - one of the payment methods supported by Stripe

6. To run the project in developement mode run yarn dev command:

    `yarn dev`

7. To start app in production mode run following commands:

    `yarn build`

    `yarn start`


**Important - to run the project in production mode gas_backend has to be running during the build and start process of gas_website and .env file needs to be configured properly. Next JS will refuse connection to backend over HTTPS if certificate is self signed (for example self signed certificate created by Visual Studio) so for developement purposes HTTP should be used instead.**
