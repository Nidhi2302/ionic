export const ENV = {
    "environment": "QA_client",
    "development": {
        APP_URL: "http://192.168.1.166:6500/api/v1",//VM's System
        AMOUNT:20, //plan amount for vendor
        PUBLIC_STRIPE_KEY:"pk_test_UsPdd3tGc7LIbwGitOTNXb4E"
    },
    "production": {
        APP_URL: "" //production's System
    },
    "QA_client": {
        APP_URL: "http://52.8.177.12:6500/api/v1", //QA's System
        AMOUNT:20, //plan amount for vendor
        PUBLIC_STRIPE_KEY:"pk_live_kHrQBUqLF4yNja08vhZyVhnp"
    },
    "QA": {
        APP_URL: "http://52.8.177.12:6501/api/v1", //QA's System
        AMOUNT:20, //plan amount for vendor
        STRIPE_KEY:"pk_test_4D64QLMfw4sNyvJV2VuYpbYJ",
        PUBLIC_STRIPE_KEY:"pk_test_UsPdd3tGc7LIbwGitOTNXb4E"
    }
}
export let data = {
    "LogLevel": "OFF"
}
