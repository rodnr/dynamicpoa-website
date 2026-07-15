import "lazysizes";
import './src/css/tailwind.css';

export const onClientEntry = () => {
    // Google Ads (AW-11059828868)
    const script = document.createElement("script")
    script.src = "https://www.googletagmanager.com/gtag/js?id=AW-11059828868"
    script.async = true
    document.body.appendChild(script)

    window.dataLayer = window.dataLayer || []
    window.gtag = function() { window.dataLayer.push(arguments); }
    window.gtag('js', new Date())
    window.gtag('config', 'AW-11059828868')

}
