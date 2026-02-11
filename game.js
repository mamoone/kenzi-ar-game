class TreasureHuntGame {
    constructor() {
        this.playerName = '';
        this.score = 0;
        this.answeredQuestions = new Set();
        this.questions = [];
        this.currentQuestion = null;
        this.currentMarker = null;
        this.markersCreated = new Set();
        this.kenziSpeechTimeout = null;
        this.audioContext = null;
        this.backgroundMusicPlaying = false;
        
        this.kenziPhrases = {
            welcome: [
                "مرحباً! أنا كنزي، مرشدك!",
                "هل أنت مستعد للمغامرة؟",
                "سأرافقك في الرحلة!"
            ],
            encouragement: [
                "هيا {name}! أنت تستطيع!",
                "استمر {name}، أنت رائع!",
                "تقدم {name}! أنا أؤمن بك!",
                "برافو {name}! أنت مذهل!"
            ],
            correct: [
                "رائع {name}! هذا صحيح!",
                "برافو {name}! أنت بطل!",
                "ممتاز {name}! استمر هكذا!",
                "مثالي {name}! أنت قوي جداً!",
                "عظيم {name}! أنت مبدع!"
            ],
            incorrect: [
                "عفواً {name}! حاول مرة أخرى!",
                "لا بأس {name}! أعد المحاولة!",
                "تقريباً {name}! حاول مجدداً!",
                "ليس هذا {name}، لكن لا تقلق!"
            ],
            markerFound: [
                "أوه! سؤال لك {name}!",
                "انظر {name}! تحدي جديد!",
                "انتبه {name}! سؤال!"
            ],
            complete: [
                "لا يصدق {name}! نجحت في كل شيء!",
                "بطل {name}! برافو!",
                "رائع جداً {name}! أنت الأفضل!"
            ]
        };
        
        this.init();
    }

    init() {
        this.loadQuestions();
        this.setupWelcomeScreen();
        this.setupGameScreen();
        this.loadDefaultQuestions();
    }

    loadQuestions() {
        const stored = localStorage.getItem('treasureHuntQuestions');
        if (stored) {
            this.questions = JSON.parse(stored);
        }
    }

    loadDefaultQuestions() {
        // Forcer les questions arabes - écraser localStorage
        this.questions = [
            {
                id: Date.now() + 1,
                markerId: 0,
                type: 'qcm',
                question: 'كم يساوي 5 + 3 ؟',
                answers: ['6', '7', '8', '9'],
                correctAnswer: '8',
                points: 10
            },
            {
                id: Date.now() + 2,
                markerId: 1,
                type: 'qcm',
                question: 'ما هي عاصمة المغرب؟',
                answers: ['الرباط', 'الدار البيضاء', 'فاس', 'مراكش'],
                correctAnswer: 'الرباط',
                points: 10
            },
            {
                id: Date.now() + 3,
                markerId: 2,
                type: 'qcm',
                question: 'كم يساوي 12 - 7 ؟',
                answers: ['3', '4', '5', '6'],
                correctAnswer: '5',
                points: 10
            },
            {
                id: Date.now() + 4,
                markerId: 3,
                type: 'qcm',
                question: 'ما هو الحيوان الذي يقول مواء؟',
                answers: ['كلب', 'قطة', 'عصفور', 'فأر'],
                correctAnswer: 'قطة',
                points: 10
            }
        ];
        localStorage.setItem('treasureHuntQuestions', JSON.stringify(this.questions));
        console.log('✅ Questions arabes chargées:', this.questions.map(q => q.question));
    }

    setupWelcomeScreen() {
        console.log('🔧 Setup Welcome Screen...');
        const startBtn = document.getElementById('start-game');
        const nameInput = document.getElementById('student-name');
        const adminBtn = document.getElementById('admin-btn');
        
        console.log('Boutons trouvés:', { startBtn, nameInput, adminBtn });

        if (startBtn) {
            startBtn.addEventListener('click', (e) => {
                console.log('🚀 Bouton start cliqué!');
                e.preventDefault();
                e.stopPropagation();
                const name = nameInput.value.trim();
                console.log('Nom saisi:', name);
                if (name) {
                    this.playerName = name;
                    this.kenziSpeak(`مرحباً ${name}! أنا كنزي! هيا ${name}، لنبدأ المغامرة معاً!`);
                    this.startGame();
                } else {
                    alert('اكتب اسمك للبدء!');
                    this.kenziSpeak('اكتب اسمك للبدء!');
                }
            }, { capture: true });
            console.log('✅ Event listener start-game attaché');
        }

        if (nameInput) {
            nameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    console.log('Enter pressé');
                    startBtn.click();
                }
            });
        }

        if (adminBtn) {
            adminBtn.addEventListener('click', (e) => {
                console.log('⚙️ Bouton admin cliqué!');
                e.preventDefault();
                e.stopPropagation();
                window.location.href = 'admin.html';
            }, { capture: true });
            console.log('✅ Event listener admin-btn attaché');
        }
    }

    setupGameScreen() {
        const exitBtn = document.getElementById('exit-game');
        exitBtn.addEventListener('click', () => {
            if (confirm('هل تريد الخروج من اللعبة؟')) {
                this.exitGame();
            }
        });
    }

    startGame() {
        console.log('🎮 Démarrage du jeu...');
        
        const welcomeScreen = document.getElementById('welcome-screen');
        const gameScreen = document.getElementById('game-screen');
        const playerNameEl = document.getElementById('player-name');
        
        console.log('Elements trouvés:', { welcomeScreen, gameScreen, playerNameEl });
        
        if (welcomeScreen) {
            welcomeScreen.classList.remove('active');
            console.log('✅ Welcome screen caché');
        }
        
        if (gameScreen) {
            gameScreen.classList.add('active');
            console.log('✅ Game screen affiché');
        }
        
        document.body.classList.add('game-active');
        console.log('✅ Body game-active ajouté');
        
        if (playerNameEl) {
            playerNameEl.textContent = this.playerName;
            console.log('✅ Nom joueur affiché:', this.playerName);
        }
        
        this.updateScore();
        this.updateProgress();
        console.log('✅ Score et progrès mis à jour');
        
        this.showInstructions();
        console.log('✅ Instructions affichées');
        
        setTimeout(() => {
            console.log('⏱️ Timeout 500ms écoulé - Initialisation AR...');
            this.initAR();
            this.forceVideoFullscreen();
        }, 500);
    }
    
    showInstructions() {
        const overlay = document.getElementById('instructions-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            // S'assurer que l'overlay est bien au-dessus
            overlay.style.display = 'flex';
            
            const startBtn = document.getElementById('start-scanning');
            if (startBtn) {
                // Cloner pour supprimer les anciens listeners
                const newBtn = startBtn.cloneNode(true);
                startBtn.parentNode.replaceChild(newBtn, startBtn);
                
                newBtn.addEventListener('click', () => {
                    overlay.classList.add('hidden');
                    overlay.style.display = 'none';
                    this.kenziSpeak('ابحث عن العلامات الآن!');
                    
                    // Re-forcer le plein écran vidéo au cas où
                    this.forceVideoFullscreen();
                    
                    // Démarrer la musique de fond si nécessaire (interaction utilisateur requise)
                    if (!this.backgroundMusicPlaying && this.audioContext) {
                        this.audioContext.resume();
                    }
                });
            }
        } else {
            console.error('❌ Instructions overlay non trouvé!');
        }
    }

    showInstructions() {
        console.log('📖 Affichage des instructions...');
        const overlay = document.getElementById('instructions-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            overlay.style.display = 'flex';
            
            const startBtn = document.getElementById('start-scanning');
            if (startBtn) {
                // Cloner pour supprimer les anciens listeners
                const newBtn = startBtn.cloneNode(true);
                startBtn.parentNode.replaceChild(newBtn, startBtn);
                
                newBtn.addEventListener('click', () => {
                    console.log('✨ Bouton Start Scanning cliqué');
                    overlay.classList.add('hidden');
                    overlay.style.display = 'none';
                    this.kenziSpeak('ابحث عن العلامات الآن!');
                    
                    // Re-forcer le plein écran vidéo au cas où
                    this.forceVideoFullscreen();
                    
                    // Démarrer la musique de fond si nécessaire
                    if (!this.backgroundMusicPlaying && this.audioContext) {
                        try {
                            this.audioContext.resume();
                        } catch(e) { console.log('Audio resume error', e); }
                    }
                });
            }
        } else {
            console.error('❌ Instructions overlay non trouvé!');
        }
    }

    forceVideoFullscreen() {
        // Fonction pour forcer la video à 100% de l'écran
        const forceVideo = () => {
            const videos = document.querySelectorAll('#ar-container video, a-scene video, video');
            const canvas = document.querySelectorAll('#ar-container canvas, a-scene canvas, canvas');
            const body = document.body;
            
            // Forcer body
            body.style.width = '100vw';
            body.style.height = '100vh';
            body.style.margin = '0';
            body.style.marginLeft = '0';
            body.style.marginTop = '0';
            body.style.padding = '0';
            body.style.overflow = 'hidden';
            
            // Forcer toutes les videos avec 'fill' pour aligner le raycaster
            videos.forEach(video => {
                video.style.position = 'fixed';
                video.style.top = '0';
                video.style.left = '0';
                video.style.right = '0';
                video.style.bottom = '0';
                video.style.width = '100vw';
                video.style.height = '100vh';
                // ... (autres styles)
                video.style.objectFit = 'fill'; // CRITIQUE: 'fill' garantit l'alignement 1:1 Clic/Vidéo (pas de crop)
            });
            
            // Forcer tous les canvas
            canvas.forEach(c => {
                c.style.position = 'fixed';
                c.style.top = '0';
                c.style.left = '0';
                c.style.width = '100vw';
                c.style.height = '100vh';
                c.style.margin = '0';
                c.style.transform = 'none';
                
                // RESTAURATION DU FIX RAYCASTER (Sync Resolution)
                // Indispensable pour aligner le clic avec la vidéo étirée
                if (c.width !== window.innerWidth || c.height !== window.innerHeight) {
                    const sceneEl = document.querySelector('a-scene');
                    if (sceneEl && sceneEl.renderer) {
                        sceneEl.renderer.setSize(window.innerWidth, window.innerHeight, false);
                    }
                }
            });
        };
        
        // Forcer immédiatement
        forceVideo();
        
        // Forcer toutes les 100ms pour contrer AR.js et corriger le Raycaster
        setInterval(() => {
            forceVideo();
            this.updateCameraAspect();
        }, 100);
        
        console.log('🎥 Force video fullscreen activé (Mode FILL pour précision clic)');
    }
    
    updateCameraAspect() {
        // Corriger l'aspect ratio de la caméra pour aligner le Raycaster avec l'écran étiré
        const scene = document.querySelector('a-scene');
        if (scene && scene.camera) {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const aspect = width / height;
            
            if (scene.camera.aspect !== aspect) {
                scene.camera.aspect = aspect;
                scene.camera.updateProjectionMatrix();
            }
        }
    }

    initAR() {
        console.log('🎯 Initialisation AR...');
        const scene = document.querySelector('a-scene');
        
        if (!scene) {
            console.error('❌ A-Scene introuvable!');
            return;
        }
        
        this.createMarkers();
        console.log('✅ Marqueurs créés');
    }

    createMarkers() {
        console.log('🎨 Attachement des event listeners aux marqueurs HTML...');
        
        this.questions.forEach(question => {
            const marker = document.getElementById(`marker-${question.markerId}`);
            if (marker) {
                // Event listeners pour markerFound/Lost
                marker.addEventListener('markerFound', () => {
                    this.onMarkerFound(question);
                });

                marker.addEventListener('markerLost', () => {
                    this.onMarkerLost(question);
                });
                
                // Event listeners pour les réponses
                question.answers.forEach((answer, index) => {
                    // Le bouton visuel (défini dans le HTML)
                    const visualBox = document.querySelector(`.answer-${question.markerId}-${index}`);
                    
                    if (visualBox) {
                        // 1. Configuration Visuelle
                        const texture = this.generateAnswerSVG(answer);
                        visualBox.setAttribute('src', texture);
                        visualBox.setAttribute('color', 'white');
                        
                        // IMPORTANT : On retire la classe clickable du visuel pour éviter les conflits
                        visualBox.classList.remove('clickable');
                        
                        // 2. Création de la "Hitbox Fantôme" (Zone de clic agrandie et avancée)
                        // Correction Parallaxe : Profondeur REDUITE pour éviter les occlusions en vue de biais
                        const hitbox = document.createElement('a-box');
                        hitbox.setAttribute('width', '3.0');  // Largeur maintenue
                        hitbox.setAttribute('height', '0.45'); // Hauteur stricte (pas de chevauchement Y)
                        hitbox.setAttribute('depth', '0.1');  // Profondeur FINE (Correction décalage)
                        hitbox.setAttribute('material', 'opacity: 0; transparent: true'); 
                        hitbox.setAttribute('position', '0 0 0.05'); // Juste devant le visuel
                        hitbox.classList.add('clickable'); 
                        
                        // Ajouter la hitbox comme ENFANT du bouton visuel
                        visualBox.appendChild(hitbox);
                        
                        // 3. Gestion du Clic sur la Hitbox
                        hitbox.addEventListener('click', (evt) => {
                            // On arrête la propagation pour éviter les doubles clics
                            evt.stopPropagation();
                            
                            console.log('🖱️ Réponse cliquée (via Hitbox):', answer);
                            this.playClickSound();
                            
                            // Animation sur le bouton VISUEL (le parent de la hitbox)
                            // Reset échelle
                            visualBox.setAttribute('scale', '1 1 1');
                            
                            // Effet de pression
                            visualBox.setAttribute('animation__click', {
                                property: 'scale',
                                to: '0.9 0.9 0.9',
                                dur: 100,
                                easing: 'easeOutQuad',
                                dir: 'alternate',
                                loop: 1
                            });
                            
                            this.checkAnswer(answer, question, visualBox);
                        });
                    }
                });
                
                this.markersCreated.add(question.markerId);
            }
        });
    }

    generateAnswerSVG(text) {
        // Design "Bouton 3D" plus marqué
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="512" height="128" viewBox="0 0 512 128">
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#FFF59D;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#FFD54F;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#FFB300;stop-opacity:1" />
                </linearGradient>
                <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                    <feOffset dx="0" dy="4" result="offsetblur"/>
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.5"/>
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <rect width="500" height="116" x="6" y="6" rx="30" ry="30" fill="url(#grad1)" stroke="#F57F17" stroke-width="6" filter="url(#shadow)"/>
            <text x="256" y="80" font-family="Arial, sans-serif" font-size="60" font-weight="900" fill="rgba(0,0,0,0.15)" text-anchor="middle" dominant-baseline="middle">${text}</text>
            <text x="253" y="77" font-family="Arial, sans-serif" font-size="60" font-weight="900" fill="#3E2723" text-anchor="middle" dominant-baseline="middle">${text}</text>
        </svg>`;
        return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
    }

    generateQuestionSVG(text) {
        // Design "Panneau Question" (Fond Bleu Kenzi)
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="200" viewBox="0 0 800 200">
            <rect width="800" height="200" fill="#4D96FF" rx="20" ry="20"/>
            <text x="400" y="100" font-family="Arial, sans-serif" font-size="50" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text>
        </svg>`;
        return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
    }

    onMarkerFound(question) {
        console.log('🎯 Marqueur détecté:', question.markerId);
        
        // Cacher l'indice de recherche s'il est visible
        const hint = document.getElementById('marker-hint');
        if (hint) hint.classList.add('hidden');

        this.playSFX('appear');
        
        const marker = document.getElementById(`marker-${question.markerId}`);
        if (marker) {
            // Animation "Pop-in" Stable et Claire
            const contentEntity = marker.querySelector('a-entity');
            if (contentEntity) {
                // 1. Mise à jour DYNAMIQUE de la question (Fix bug image manquante)
                // On cherche le premier a-box qui est le panneau question
                const questionBox = contentEntity.querySelector('a-box:not(.clickable)'); 
                if (questionBox) {
                    const texture = this.generateQuestionSVG(question.question);
                    questionBox.setAttribute('src', texture);
                    questionBox.setAttribute('color', 'white'); // Reset couleur
                    questionBox.setAttribute('material', 'shader: flat; opacity: 1'); // Force visibilité
                }

                // Reset propre
                contentEntity.setAttribute('scale', '0 0 0');
                contentEntity.setAttribute('rotation', '-90 0 0'); // Rotation fixe, face caméra
                
                // Animation principale : Scale Up propre (sans rebond excessif)
                contentEntity.setAttribute('animation__popin', {
                    property: 'scale',
                    to: '2.5 2.5 2.5',
                    dur: 600, // Plus rapide
                    easing: 'easeOutBack' // Plus sec, moins "gelée"
                });
                
                // Failsafe : Forcer l'affichage si l'animation bug
                setTimeout(() => {
                    contentEntity.setAttribute('scale', '2.5 2.5 2.5');
                }, 650);
                
                // Suppression de l'animation de Tilt pour la stabilité de lecture
                contentEntity.removeAttribute('animation__tilt');
                
                this.spawnMagicEffects(marker);
            }
        }
        
        if (this.answeredQuestions.has(question.id)) {
            this.kenziSpeak('لقد أجبت على هذا السؤال من قبل!');
            return;
        }
        
        this.currentQuestion = question;
        this.kenziSpeak(question.question);
    }
    
    spawnMagicEffects(marker) {
        // 1. Onde de choc au sol (Anneau propre qui ne cache pas le texte)
        const ring = document.createElement('a-ring');
        ring.setAttribute('color', '#FFD93D');
        ring.setAttribute('radius-inner', '0.1');
        ring.setAttribute('radius-outer', '0.2');
        ring.setAttribute('rotation', '-90 0 0');
        ring.setAttribute('position', '0 0.1 0');
        ring.setAttribute('opacity', '0.8');
        ring.setAttribute('material', 'shader: flat; transparent: true');
        
        // Expansion rapide
        ring.setAttribute('animation__expand', {
            property: 'radius-outer',
            to: '3.0',
            dur: 800,
            easing: 'easeOutQuad'
        });
        ring.setAttribute('animation__inner', {
            property: 'radius-inner',
            to: '2.8',
            dur: 800,
            easing: 'easeOutQuad'
        });
        ring.setAttribute('animation__fade', {
            property: 'opacity',
            to: '0',
            dur: 800,
            easing: 'easeOutQuad'
        });
        
        marker.appendChild(ring);
        setTimeout(() => { if(ring.parentNode) ring.parentNode.removeChild(ring); }, 1000);

        // 2. Étoiles flottantes sur les côtés (Pas devant le texte)
        const colors = ['#FFD93D', '#FF6B9D', '#4D96FF'];
        for(let i=0; i<8; i++) {
            const star = document.createElement('a-dodecahedron');
            star.setAttribute('radius', '0.1');
            star.setAttribute('color', colors[i % colors.length]);
            
            // Départ du sol
            star.setAttribute('position', '0 0 0');
            
            // Trajectoire vers l'extérieur et le haut (autour de la question)
            const angle = (i / 8) * Math.PI * 2;
            const radius = 2.0; // Assez large pour ne pas cacher le texte
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius; // Z est Y dans l'espace du marker tourné, mais ici on veut Y vers le haut
            // Attention: marker est souvent tourné. Si marker contient a-entity rot -90, le repère local est aligné.
            // Ici on attache au marker brut. Marker brut est à plat sur l'image. Y est la normale (vers la caméra).
            
            star.setAttribute('animation__move', {
                property: 'position',
                to: `${x} 2.5 ${z}`, // Monte vers le ciel (Y) et s'écarte (X/Z)
                dur: 1500,
                easing: 'easeOutExpo'
            });
            
            // Rotation douce
            star.setAttribute('animation__spin', {
                property: 'rotation',
                to: '360 360 0',
                dur: 1500,
                easing: 'linear'
            });
            
            star.setAttribute('animation__fade', {
                property: 'scale',
                to: '0 0 0',
                dur: 500,
                delay: 1000,
                easing: 'easeInQuad'
            });
            
            marker.appendChild(star);
            setTimeout(() => { if(star.parentNode) star.parentNode.removeChild(star); }, 1500);
        }
    }
    
    // Ajout d'un son de clic pour feedback immédiat
    playClickSound() {
        this.playSFX('click');
    }

    onMarkerLost(question) {
        console.log('❌ Marqueur perdu:', question.markerId);
    }
    
    checkAnswer(answer, question, answerBox) {
        if (this.answeredQuestions.has(question.id)) return;
        
        console.log(`Réponse choisie: ${answer}, Correcte: ${question.correctAnswer}`);
        
        if (answer === question.correctAnswer) {
            // Bonne réponse
            this.answeredQuestions.add(question.id);
            this.score += question.points;
            this.updateScore();
            this.updateProgress();
            
            // Feedback Visuel : Vert
            answerBox.setAttribute('color', '#4CAF50');
            
            // Son et encouragement
            this.playSFX('correct');
            const phrase = this.getRandomPhrase('correct').replace('{name}', this.playerName);
            this.kenziSpeak(phrase);
            
            // Animation de célébration locale (sur le marqueur)
            this.spawnCelebration(answerBox.object3D.position, document.getElementById(`marker-${question.markerId}`));

            // Vérifier victoire
            if (this.answeredQuestions.size === this.questions.length) {
                setTimeout(() => this.showVictoryScreen(), 2000);
            } else {
                // Guidance pour la prochaine question après un court délai
                setTimeout(() => {
                    this.showNextMarkerHint();
                    this.kenziSpeak("ممتاز! ابحث عن العلامة التالية!");
                }, 2500);
            }
        } else {
            // Mauvaise réponse
            // Feedback Visuel : Rouge temporaire
            const originalColor = answerBox.getAttribute('color');
            answerBox.setAttribute('color', '#F44336'); // Rouge
            
            setTimeout(() => {
                answerBox.setAttribute('color', originalColor);
            }, 1000);
            
            this.playSFX('incorrect');
            const phrase = this.getRandomPhrase('incorrect').replace('{name}', this.playerName);
            this.kenziSpeak(phrase);
        }
    }
    
    spawnCelebration(position, marker) {
        // Confettis simples (Sphères colorées qui explosent)
        const colors = ['#FFD93D', '#FF6B9D', '#6BCF7F', '#4D96FF'];
        for(let i=0; i<20; i++) {
            const confetti = document.createElement('a-sphere');
            confetti.setAttribute('radius', '0.05');
            confetti.setAttribute('color', colors[Math.floor(Math.random() * colors.length)]);
            confetti.setAttribute('position', position);
            
            const destX = (Math.random() - 0.5) * 2;
            const destY = (Math.random() - 0.5) * 2 + 1;
            const destZ = (Math.random() - 0.5) * 2;
            
            confetti.setAttribute('animation', {
                property: 'position',
                to: `${destX} ${destY} ${destZ}`,
                dur: 1000,
                easing: 'easeOutQuad'
            });
            
            confetti.setAttribute('animation__fade', {
                property: 'opacity',
                to: '0',
                dur: 1000,
                easing: 'linear'
            });
            
            marker.appendChild(confetti);
            setTimeout(() => { if(confetti.parentNode) confetti.parentNode.removeChild(confetti); }, 1000);
        }
    }

    showNextMarkerHint() {
        const hint = document.getElementById('marker-hint');
        if (hint) {
            hint.classList.remove('hidden');
            // Animation d'entrée
            hint.style.animation = 'none';
            hint.offsetHeight; /* trigger reflow */
            hint.style.animation = 'bounce 2s ease-in-out infinite';
            
            // Masquer automatiquement après 8 secondes
            setTimeout(() => {
                hint.classList.add('hidden');
            }, 8000);
        }
    }

    getRandomPhrase(type) {
        const phrases = this.kenziPhrases[type];
        return phrases[Math.floor(Math.random() * phrases.length)];
    }

    showVictoryScreen() {
        this.playSFX('victory');
        const phrase = this.getRandomPhrase('complete').replace('{name}', this.playerName);
        this.kenziSpeak(phrase);
        
        // Afficher un overlay de victoire simple si nécessaire, ou juste Kenzi qui célèbre
        alert(`🎉 Mabrouk ${this.playerName} ! Tu as gagné ! Score: ${this.score}`);
    }

    playSFX(type) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        const playTone = (freq, type, duration, delay=0, vol=0.2) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.value = freq;
            osc.connect(gain);
            gain.connect(ctx.destination);
            const now = ctx.currentTime + delay;
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(vol, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
            osc.start(now);
            osc.stop(now + duration + 0.1);
        };
        
        if (type === 'correct') {
            playTone(523.25, 'sine', 0.6, 0);   // C5
            playTone(659.25, 'sine', 0.6, 0.1); // E5
            playTone(783.99, 'sine', 0.8, 0.2); // G5
        } 
        else if (type === 'incorrect') {
            playTone(150, 'sawtooth', 0.4, 0, 0.15);
            playTone(145, 'sawtooth', 0.4, 0.05, 0.15);
        } 
        else if (type === 'victory') {
            playTone(523.25, 'square', 0.2, 0, 0.1);
            playTone(523.25, 'square', 0.2, 0.15, 0.1);
            playTone(523.25, 'square', 0.2, 0.3, 0.1);
            playTone(783.99, 'square', 1.0, 0.45, 0.1);
        } 
        else if (type === 'appear') {
            // "Sexy" Pop / Ding Sound
            // 1. Un "Ding" brillant (Onde sinus haute fréquence)
            playTone(880, 'sine', 0.8, 0, 0.15); // A5
            playTone(1760, 'sine', 0.6, 0.05, 0.05); // A6 (harmonique)
            
            // 2. Un "Pop" percussif (Bruit court et décroissant rapide)
            playTone(200, 'triangle', 0.1, 0, 0.3);
            
            // 3. Petit effet "glissando" rapide vers le haut
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            const now = ctx.currentTime;
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.2);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        }
        else if (type === 'click') {
            // Son de clic sec et satisfaisant (bruit blanc ou click court)
            playTone(800, 'sine', 0.05, 0, 0.3); // "Blip" très court
            playTone(1200, 'triangle', 0.02, 0, 0.2); // Attaque aigue
        }
    }

    updateScore() {
        document.getElementById('score').textContent = `النقاط: ${this.score}`;
    }

    updateProgress() {
        document.getElementById('progress').textContent = `${this.answeredQuestions.size}/${this.questions.length}`;
    }

    kenziSpeak(message) {
        console.log('Kenzi:', message);
        const speechBubble = document.getElementById('kenzi-speech');
        if (speechBubble) {
            speechBubble.textContent = message;
            speechBubble.style.display = 'block';
        }
        
        // Synthèse vocale avec pauses
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            
            // Découper le message par ponctuation (., !, ?, ،)
            // On garde la ponctuation dans le segment précédent
            let phrases = message.match(/[^.!?،]+[.!?،]*/g) || [message];
            phrases = phrases.map(p => p.trim()).filter(p => p.length > 0);
            
            this.speakPhrasesSequentially(phrases, 0);
        }
    }
    
    speakPhrasesSequentially(phrases, index) {
        if (index >= phrases.length) return;
        
        const text = phrases[index];
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.9;
        utterance.pitch = 1.2;
        utterance.volume = 1.0;
        
        utterance.onend = () => {
            // Pause de 500ms entre les phrases
            setTimeout(() => {
                this.speakPhrasesSequentially(phrases, index + 1);
            }, 500);
        };
        
        // Gérer les erreurs pour ne pas bloquer la file
        utterance.onerror = () => {
            console.error('Erreur TTS, passage à la phrase suivante');
            this.speakPhrasesSequentially(phrases, index + 1);
        };
        
        window.speechSynthesis.speak(utterance);
    }

    exitGame() {
        window.location.reload();
    }
}

// Fonction globale simple pour toggle le score panel
window.toggleScorePanel = function() {
    const content = document.getElementById('score-panel-content');
    const icon = document.getElementById('toggle-icon');
    const scorePanel = document.getElementById('score-panel');
    
    const currentMaxHeight = window.getComputedStyle(content).maxHeight;
    
    if (currentMaxHeight === '0px') {
        // Ouvrir
        content.style.maxHeight = '500px';
        icon.style.transform = 'rotate(0deg)';
        if (scorePanel) {
            scorePanel.classList.remove('animate__fadeOut');
            scorePanel.classList.add('animate__fadeIn');
        }
    } else {
        // Fermer
        content.style.maxHeight = '0px';
        icon.style.transform = 'rotate(-90deg)';
        if (scorePanel) {
            scorePanel.classList.remove('animate__fadeIn');
            scorePanel.classList.add('animate__fadeOut');
        }
    }
};

let gameInstance = null;

// Fonction globale simple pour démarrer le jeu
window.startGameNow = function() {
    console.log('🚀 startGameNow appelée!');
    const nameInput = document.getElementById('student-name');
    const name = nameInput ? nameInput.value.trim() : '';
    console.log('Nom saisi:', name);
    
    if (!name) {
        alert('اكتب اسمك للبدء!');
        return false;
    }
    
    if (!window.game) {
        alert('Jeu en cours de chargement...');
        return false;
    }
    
    window.game.playerName = name;
    window.game.startGame();
    return false;
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 DOM Loaded - Initializing game...');
    gameInstance = new TreasureHuntGame();
    window.game = gameInstance;
    console.log('✅ Game instance created:', gameInstance);
});
