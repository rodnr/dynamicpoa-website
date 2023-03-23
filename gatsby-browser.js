import "lazysizes";
import './src/css/tailwind.css';


export const onClientEntry = () => {
    // Google tag (gtag.js)
    const script = document.createElement("script")
    script.src = "https://www.googletagmanager.com/gtag/js?id=AW-11059828868"
    script.async = true
    document.body.appendChild(script)

    window.dataLayer = window.dataLayer || []
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());

    gtag('config', 'AW-11059828868')

    // HubSpot Embed Code
    const hsScript = document.createElement("script")
    hsScript.type = "text/javascript"
    hsScript.id = "hs-script-loader"
    hsScript.async = true
    hsScript.defer = true
    hsScript.src = "//js.hs-scripts.com/22189317.js"
    document.body.appendChild(hsScript)
}