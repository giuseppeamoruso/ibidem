// 🔧 AGGIORNA js/app.js con le tue credenziali Supabase REALI

// Configurazione AGGIORNATA con i tuoi dati
// 🔧 AGGIORNA la configurazione con il TUO URL Netlify
const CONFIG = {
    APP_SCHEME: 'ibidem://',
    PLAY_STORE_URL: 'https://play.google.com/store/apps/details?id=com.example.flutter_projects', // 🔧 Sostituisci con il tuo
    APP_STORE_URL: 'https://apps.apple.com/app/ibidem/id123456789', // 🔧 Sostituisci con il tuo
    SUPABASE_URL: 'https://chvjgriyinbbowtavdrj.supabase.co', // ✅ Già corretto
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNodmpncml5aW5iYm93dGF2ZHJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMzc4MzMsImV4cCI6MjA2MzkxMzgzM30.m6Lr9ZrT8Gkp00zWOmcYA4DnZfBC0wyuZf46VBTYsb8'
};

// 🆕 NUOVA CLASSE: API Handler con Supabase REALE
class SupabaseAPI {
    constructor() {
        this.baseUrl = CONFIG.SUPABASE_URL;
        this.apiKey = CONFIG.SUPABASE_ANON_KEY;
        this.headers = {
            'apikey': this.apiKey,
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
        };
    }

    // 🎯 CARICA EVENTO REALE con tutte le relazioni
    async fetchEvento(id) {
        try {
            console.log(`🔍 Caricamento evento ID: ${id}`);
            
            const response = await fetch(
                `${this.baseUrl}/rest/v1/EVENTI?id=eq.${id}&select=*,LUOGHI(*),ORGANIZZAZIONI(*)`,
                { headers: this.headers }
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(`✅ Evento trovato:`, data);
            
            if (data.length === 0) {
                console.log('❌ Evento non trovato');
                return null;
            }
            
            const evento = data[0];
            
            // 🖼️ CARICA IMMAGINI EVENTO
            try {
                const immaginiResponse = await fetch(
                    `${this.baseUrl}/rest/v1/EVENTI_IMMAGINI?evento_id=eq.${id}&select=url&limit=1`,
                    { headers: this.headers }
                );
                
                if (immaginiResponse.ok) {
                    const immagini = await immaginiResponse.json();
                    evento.immagine = immagini.length > 0 ? immagini[0].url : null;
                }
            } catch (e) {
                console.warn('⚠️ Errore caricamento immagini:', e);
                evento.immagine = null;
            }
            
            return evento;
            
        } catch (error) {
            console.error('❌ Errore fetch evento:', error);
            return null;
        }
    }

    // 🏢 CARICA ORGANIZZAZIONE REALE
    async fetchOrganizzazione(id) {
        try {
            console.log(`🏢 Caricamento organizzazione ID: ${id}`);
            
            const response = await fetch(
                `${this.baseUrl}/rest/v1/ORGANIZZAZIONI?id=eq.${id}&select=*`,
                { headers: this.headers }
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(`✅ Organizzazione trovata:`, data);
            
            if (data.length === 0) {
                return null;
            }
            
            const org = data[0];
            
            // 🖼️ CARICA LOGO ORGANIZZAZIONE
            try {
                const logoResponse = await fetch(
                    `${this.baseUrl}/rest/v1/ORGANIZZAZIONI_IMMAGINI?organizzazioni_id=eq.${id}&select=url&limit=1`,
                    { headers: this.headers }
                );
                
                if (logoResponse.ok) {
                    const logos = await logoResponse.json();
                    org.logo_url = logos.length > 0 ? logos[0].url : null;
                }
            } catch (e) {
                console.warn('⚠️ Errore caricamento logo:', e);
                org.logo_url = null;
            }
            
            // 📊 CONTA EVENTI DELL'ORGANIZZAZIONE
            try {
                const eventiResponse = await fetch(
                    `${this.baseUrl}/rest/v1/EVENTI?organizzazioni_id=eq.${id}&select=id`,
                    { headers: this.headers }
                );
                
                if (eventiResponse.ok) {
                    const eventi = await eventiResponse.json();
                    org.eventi_count = eventi.length;
                }
            } catch (e) {
                console.warn('⚠️ Errore conteggio eventi:', e);
                org.eventi_count = 0;
            }
            
            return org;
            
        } catch (error) {
            console.error('❌ Errore fetch organizzazione:', error);
            return null;
        }
    }

    // 🔍 CARICA EVENTI DI UN'ORGANIZZAZIONE
    async fetchEventiOrganizzazione(orgId, limit = 10) {
        try {
            console.log(`📋 Caricamento eventi organizzazione ID: ${orgId}`);
            
            const response = await fetch(
                `${this.baseUrl}/rest/v1/EVENTI?organizzazioni_id=eq.${orgId}&select=id,titolo,descrizione,data_evento,ora_da&order=data_evento.desc&limit=${limit}`,
                { headers: this.headers }
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const eventi = await response.json();
            console.log(`✅ Trovati ${eventi.length} eventi per organizzazione ${orgId}`);
            
            // 🖼️ CARICA IMMAGINI per ogni evento
            for (const evento of eventi) {
                try {
                    const immaginiResponse = await fetch(
                        `${this.baseUrl}/rest/v1/EVENTI_IMMAGINI?evento_id=eq.${evento.id}&select=url&limit=1`,
                        { headers: this.headers }
                    );
                    
                    if (immaginiResponse.ok) {
                        const immagini = await immaginiResponse.json();
                        evento.immagine = immagini.length > 0 ? immagini[0].url : null;
                    }
                } catch (e) {
                    evento.immagine = null;
                }
            }
            
            return eventi;
            
        } catch (error) {
            console.error('❌ Errore fetch eventi organizzazione:', error);
            return [];
        }
    }

    // 🔍 RICERCA EVENTI (per future implementazioni)
    async searchEventi(query, limit = 20) {
        try {
            const response = await fetch(
                `${this.baseUrl}/rest/v1/EVENTI?or=(titolo.ilike.*${query}*,descrizione.ilike.*${query}*)&select=*,LUOGHI(*),ORGANIZZAZIONI(*)&limit=${limit}&order=data_evento.desc`,
                { headers: this.headers }
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
            
        } catch (error) {
            console.error('❌ Errore ricerca eventi:', error);
            return [];
        }
    }
}

// 🆕 AGGIORNA le funzioni globali per usare Supabase REALE

// Istanza globale API
const supabaseAPI = new SupabaseAPI();

// 🔧 AGGIORNA la funzione di caricamento evento nella pagina evento
async function loadEventoDetails(id) {
    try {
        console.log(`🚀 Caricamento evento REALE ID: ${id}`);
        
        // 🆕 USA API REALE invece dei mock
        const evento = await supabaseAPI.fetchEvento(id);
        
        if (evento) {
            currentEvento = evento;
            populateEventoPage(evento);
            showEvento();
        } else {
            showError();
        }
        
    } catch (error) {
        console.error('❌ Errore caricamento evento:', error);
        showError();
    }
}

// 🔧 AGGIORNA la funzione di caricamento organizzazione
async function loadOrganizzazioneDetails(id) {
    try {
        console.log(`🏢 Caricamento organizzazione REALE ID: ${id}`);
        
        // 🆕 USA API REALE
        const org = await supabaseAPI.fetchOrganizzazione(id);
        
        if (org) {
            currentOrganizzazione = org;
            populateOrganizzazionePage(org);
            // 📋 CARICA EVENTI REALI dell'organizzazione
            loadOrganizzazioneEventi(org.id);
            showOrganizzazione();
        } else {
            showError();
        }
        
    } catch (error) {
        console.error('❌ Errore caricamento organizzazione:', error);
        showError();
    }
}

// 🔧 AGGIORNA caricamento eventi organizzazione
async function loadOrganizzazioneEventi(orgId) {
    try {
        const eventi = await supabaseAPI.fetchEventiOrganizzazione(orgId);
        const eventiContainer = document.getElementById('org-eventi');
        
        if (!eventiContainer) return;
        
        if (eventi.length === 0) {
            eventiContainer.innerHTML = `
                <div class="no-eventi">
                    <p>Nessun evento disponibile al momento per questa organizzazione.</p>
                </div>
            `;
            return;
        }
        
        eventiContainer.innerHTML = eventi.map(evento => `
            <div class="evento-card-small">
                <div class="evento-image-small">
                    ${evento.immagine ? 
                        `<img src="${evento.immagine}" alt="${evento.titolo}" loading="lazy">` :
                        `<div class="placeholder-image"><span class="material-icons">event</span></div>`
                    }
                </div>
                <div class="evento-info-small">
                    <h4>${evento.titolo}</h4>
                    <p>${formatDate(evento.data_evento)}</p>
                    ${evento.ora_da ? `<small>dalle ${evento.ora_da}</small>` : ''}
                    <a href="../evento/?id=${evento.id}" class="btn-small">Vedi Dettagli</a>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('❌ Errore caricamento eventi organizzazione:', error);
        const eventiContainer = document.getElementById('org-eventi');
        if (eventiContainer) {
            eventiContainer.innerHTML = '<p>Errore nel caricamento degli eventi.</p>';
        }
    }
}

// 🔧 AGGIORNA la funzione di popolamento evento
function populateEventoPage(evento) {
    // Meta tags
    document.getElementById('page-title').textContent = `${evento.titolo} - Ibidem`;
    document.getElementById('page-description').setAttribute('content', evento.descrizione || 'Scopri questo evento su Ibidem');
    document.getElementById('og-title').setAttribute('content', evento.titolo);
    document.getElementById('og-description').setAttribute('content', evento.descrizione || 'Scopri questo evento su Ibidem');
    document.getElementById('og-image').setAttribute('content', evento.immagine || '../images/logo.png');
    document.getElementById('og-url').setAttribute('content', window.location.href);
    
    // Contenuto pagina
    document.getElementById('evento-titolo').textContent = evento.titolo;
    document.getElementById('evento-data').textContent = formatDate(evento.data_evento);
    document.getElementById('evento-ora').textContent = evento.ora_da ? `dalle ${evento.ora_da}` : 'Orario da definire';
    document.getElementById('evento-luogo').textContent = evento.LUOGHI?.nome || 'Luogo da definire';
    document.getElementById('evento-descrizione').textContent = evento.descrizione || 'Nessuna descrizione disponibile.';
    
    // Immagine
    const imgElement = document.getElementById('evento-image');
    if (evento.immagine) {
        imgElement.src = evento.immagine;
        imgElement.alt = evento.titolo;
        imgElement.style.display = 'block';
    } else {
        imgElement.style.display = 'none';
    }
    
    // Organizzatore
    const orgContainer = document.getElementById('evento-organizzatore');
    if (evento.ORGANIZZAZIONI?.denominazione) {
        orgContainer.innerHTML = `
            <div class="organizzatore-card">
                <div class="organizzatore-icon">
                    <span class="material-icons">business</span>
                </div>
                <div class="organizzatore-info">
                    <h4>${evento.ORGANIZZAZIONI.denominazione}</h4>
                    <p>Organizzatore dell'evento</p>
                    ${evento.ORGANIZZAZIONI.email ? `<small>${evento.ORGANIZZAZIONI.email}</small>` : ''}
                </div>
            </div>
        `;
    }
    
    // Badge evento passato (migliora logica)
    const now = new Date();
    const eventoDate = new Date(evento.data_evento);
    const badge = document.getElementById('evento-badge');
    
    if (eventoDate < now) {
        badge.innerHTML = '<span class="material-icons">history</span><span>Evento Passato</span>';
        badge.classList.add('evento-passato');
    } else {
        badge.innerHTML = '<span class="material-icons">event</span><span>Evento</span>';
        badge.classList.remove('evento-passato');
    }
}

// 🔧 AGGIORNA la funzione di popolamento organizzazione
function populateOrganizzazionePage(org) {
    // Meta tags
    document.getElementById('page-title').textContent = `${org.denominazione} - Ibidem`;
    document.getElementById('page-description').setAttribute('content', org.descrizione || `Organizzazione ${org.denominazione} su Ibidem`);
    document.getElementById('og-title').setAttribute('content', org.denominazione);
    document.getElementById('og-description').setAttribute('content', org.descrizione || `Organizzazione ${org.denominazione} su Ibidem`);
    document.getElementById('og-image').setAttribute('content', org.logo_url || '../images/logo.png');
    
    // Contenuto pagina
    document.getElementById('org-nome').textContent = org.denominazione;
    document.getElementById('org-email').textContent = org.email || 'Email non disponibile';
    document.getElementById('org-telefono').textContent = org.telefono || 'Telefono non disponibile';
    document.getElementById('org-eventi-count').textContent = `${org.eventi_count || 0} eventi organizzati`;
    
    // Descrizione
    const descrizioneContainer = document.getElementById('org-descrizione');
    if (org.descrizione) {
        descrizioneContainer.innerHTML = `<p>${org.descrizione}</p>`;
    } else {
        descrizioneContainer.innerHTML = `<p>Questa organizzazione si occupa di creare eventi memorabili per la community.</p>`;
    }
    
    // Logo
    const logoElement = document.getElementById('org-logo');
    if (org.logo_url) {
        logoElement.src = org.logo_url;
        logoElement.alt = org.denominazione;
        logoElement.style.display = 'block';
    } else {
        // Mostra iniziale se non c'è logo
        logoElement.style.display = 'none';
        const logoContainer = logoElement.parentElement;
        logoContainer.innerHTML = `
            <div class="org-logo-placeholder">
                <span class="org-initial">${org.denominazione.charAt(0).toUpperCase()}</span>
            </div>
            <div class="org-badge">
                <span class="material-icons">business</span>
                <span>Organizzazione</span>
            </div>
        `;
    }
}

// 🆕 AGGIUNGI CSS per miglioramenti UI
const additionalCSS = `
<style>
.no-eventi {
    text-align: center;
    padding: 40px 20px;
    color: var(--gray-600);
}

.placeholder-image {
    width: 100%;
    height: 100%;
    background: var(--gray-200);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius);
}

.placeholder-image .material-icons {
    color: var(--gray-400);
    font-size: 32px;
}

.evento-card-small {
    background: white;
    border-radius: var(--radius-lg);
    padding: var(--spacing-4);
    box-shadow: var(--shadow);
    margin-bottom: var(--spacing-4);
    border: 1px solid var(--gray-200);
    transition: var(--transition-normal);
}

.evento-card-small:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

.evento-image-small {
    width: 100%;
    height: 120px;
    border-radius: var(--radius);
    overflow: hidden;
    margin-bottom: var(--spacing-3);
}

.evento-image-small img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.evento-info-small h4 {
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin-bottom: var(--spacing-2);
    color: var(--gray-900);
}

.evento-info-small p {
    color: var(--gray-600);
    margin-bottom: var(--spacing-2);
}

.evento-info-small small {
    color: var(--gray-500);
    font-size: var(--font-size-sm);
    display: block;
    margin-bottom: var(--spacing-3);
}

.btn-small {
    display: inline-block;
    padding: var(--spacing-2) var(--spacing-4);
    background: var(--primary-color);
    color: white;
    text-decoration: none;
    border-radius: var(--radius);
    font-size: var(--font-size-sm);
    font-weight: 600;
    transition: var(--transition-fast);
}

.btn-small:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
}

.org-logo-placeholder {
    width: 80px;
    height: 80px;
    background: var(--primary-color);
    border-radius: var(--radius-xl);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--spacing-4);
}

.org-initial {
    font-size: 32px;
    font-weight: 700;
    color: white;
}

.eventi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--spacing-6);
    margin-top: var(--spacing-6);
}

@media (max-width: 768px) {
    .eventi-grid {
        grid-template-columns: 1fr;
    }
}
</style>
`;

// Aggiungi CSS addizionale al documento
if (document.head) {
    document.head.insertAdjacentHTML('beforeend', additionalCSS);
}

console.log('🚀 Supabase API integrato con successo!');
console.log('📊 Database URL:', CONFIG.SUPABASE_URL);
console.log('🔑 API Key configurata');
