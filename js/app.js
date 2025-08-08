// JavaScript principale per il sito Ibidem

// Configurazione
const CONFIG = {
    APP_SCHEME: 'ibidem://',
    PLAY_STORE_URL: 'https://play.google.com/store/apps/details?id=com.ibidem.app',
    APP_STORE_URL: 'https://apps.apple.com/app/ibidem/id123456789',
    SUPABASE_URL: 'https://your-project.supabase.co', // Sostituire con vero URL
    SUPABASE_ANON_KEY: 'your-anon-key' // Sostituire con vera chiave
};

// Utility Functions
const utils = {
    // Formatta data in italiano
    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            return date.toLocaleDateString('it-IT', options);
        } catch (e) {
            return dateString;
        }
    },

    // Rileva tipo di device
    getDeviceType() {
        const userAgent = navigator.userAgent;
        if (/Android/i.test(userAgent)) return 'android';
        if (/iPhone|iPad|iPod/i.test(userAgent)) return 'ios';
        return 'desktop';
    },

    // Genera URL per aprire app
    generateAppUrl(type, id) {
        return `${CONFIG.APP_SCHEME}${type}/${id}`;
    },

    // Ottieni URL store appropriato
    getStoreUrl() {
        const deviceType = this.getDeviceType();
        return deviceType === 'ios' ? CONFIG.APP_STORE_URL : CONFIG.PLAY_STORE_URL;
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// App Controller
class IbidemApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupSmoothScrolling();
        this.# 🌐 Ibidem Website - Repository GitHub

## 📁 Struttura File del Repository
