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
            
            // Forcer toutes les videos
            videos.forEach(video => {
                video.style.position = 'fixed';
                video.style.top = '0';
                video.style.left = '0';
                video.style.right = '0';
                video.style.bottom = '0';
                video.style.width = '100vw';
                video.style.height = '100vh';
                video.style.minWidth = '100vw';
                video.style.minHeight = '100vh';
                video.style.maxWidth = '100vw';
                video.style.maxHeight = '100vh';
                video.style.margin = '0';
                video.style.marginLeft = '0';
                video.style.marginTop = '0';
                video.style.marginRight = '0';
                video.style.marginBottom = '0';
                video.style.padding = '0';
                video.style.transform = 'none';
                video.style.objectFit = 'cover';
            });
            
            // Forcer tous les canvas
            canvas.forEach(c => {
                c.style.position = 'fixed';
                c.style.top = '0';
                c.style.left = '0';
                c.style.width = '100vw';
                c.style.height = '100vh';
                c.style.margin = '0';
                c.style.marginLeft = '0';
                c.style.marginTop = '0';
                c.style.transform = 'none';
            });
        };
        
        // Forcer immédiatement
        forceVideo();
        
        // Forcer toutes les 100ms pour contrer AR.js
        setInterval(forceVideo, 100);
        
        console.log('🎥 Force video fullscreen activé');
    }

    initAR() {
        console.log('🎯 Initialisation AR...');
        const scene = document.querySelector('a-scene');
        console.log('A-Scene trouvée:', scene);
        
        if (!scene) {
            console.error('❌ A-Scene introuvable!');
            return;
        }
        
        this.createMarkers();
        console.log('✅ Marqueurs créés');
    }

    createMarkers() {
        console.log('🎨 Attachement des event listeners aux marqueurs HTML...');
        
        // Les marqueurs sont maintenant dans le HTML, on attache juste les event listeners
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
                
                // Event listeners pour les cubes de réponses
                question.answers.forEach((answer, index) => {
                    const answerBox = document.querySelector(`.answer-${question.markerId}-${index}`);
                    if (answerBox) {
                        answerBox.addEventListener('click', () => {
                            console.log('🖱️ Réponse cliquée:', answer);
                            this.checkAnswer(answer, question);
                        });
                    }
                });
                
                this.markersCreated.add(question.markerId);
                console.log('✅ Event listeners attachés au marqueur:', question.markerId, '-', question.question);
            } else {
                console.error('❌ Marqueur HTML introuvable:', question.markerId);
            }
        });
        console.log('🎯 Total marqueurs configurés:', this.markersCreated.size);
    }

    onMarkerFound(question) {
        console.log('🎯 Marqueur détecté:', question.markerId, '-', question.question);
        
        // Vérifier si les éléments 3D existent dans le DOM
        const marker = document.getElementById(`marker-${question.markerId}`);
        if (marker) {
            console.log('✅ Marqueur HTML trouvé:', marker);
            const children = marker.querySelectorAll('*');
            console.log(`📦 Nombre d'enfants dans le marqueur: ${children.length}`);
            children.forEach((child, index) => {
                console.log(`  ${index + 1}. ${child.tagName} - visible: ${child.object3D ? child.object3D.visible : 'N/A'}`);
            });
            
            // Vérifier spécifiquement le panneau question
            const questionPanel = marker.querySelector('a-box[src]');
            if (questionPanel) {
                console.log('📋 Panneau question trouvé:', questionPanel);
                console.log('   Position:', questionPanel.getAttribute('position'));
                console.log('   Width:', questionPanel.getAttribute('width'));
                console.log('   Height:', questionPanel.getAttribute('height'));
                console.log('   Src:', questionPanel.getAttribute('src'));
                if (questionPanel.object3D) {
                    console.log('   Object3D visible:', questionPanel.object3D.visible);
                    console.log('   Object3D position:', questionPanel.object3D.position);
                }
            } else {
                console.error('❌ Panneau question NON trouvé dans le marqueur!');
            }
        } else {
            console.error('❌ Marqueur HTML NON trouvé:', `marker-${question.markerId}`);
        }
        
        if (this.answeredQuestions.has(question.id)) {
            console.log('⚠️ Question déjà répondue');
            this.kenziSpeak('لقد أجبت على هذا السؤال من قبل!');
            return;
        }
        
        this.currentQuestion = question;
        this.kenziSpeak(question.question);
    }

    onMarkerLost(question) {
        console.log('❌ Marqueur perdu:', question.markerId);
    }
    
    
    checkAnswer(selectedAnswer, question) {
        console.log('✅ Vérification réponse:', selectedAnswer, 'vs', question.correctAnswer);
        const isCorrect = selectedAnswer === question.correctAnswer;
        
        if (isCorrect) {
            this.score += question.points || 10;
            this.answeredQuestions.add(question.id);
            this.updateScore();
            this.updateProgress();
            
            const encouragements = [
                'أحسنت! إجابة صحيحة! 🎉',
                'ممتاز! واصل! ⭐',
                'رائع جداً! 🌟',
                'عظيم! أنت بطل! 🏆'
            ];
            const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
            this.kenziSpeak(randomEncouragement);
            this.playSFX('correct');
            this.createConfetti();
        } else {
            this.kenziSpeak('حاول مرة أخرى! 💪');
            this.playSFX('incorrect');
        }
        
        if (this.answeredQuestions.size === this.questions.length) {
            setTimeout(() => this.showVictory(), 1000);
        }
    }

    showInstructions() {
        console.log('📋 Instructions affichées');
        const overlay = document.getElementById('instructions-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            
            // Fermer les instructions au clic du bouton
            const startScanningBtn = document.getElementById('start-scanning');
            if (startScanningBtn) {
                startScanningBtn.onclick = () => {
                    overlay.classList.add('hidden');
                };
            }
        }
    }
    
    showVictory() {
        console.log('🎊 VICTOIRE!');
        this.kenziSpeak(`مبروك ${this.playerName}! لقد أنهيت اللعبة! نقاطك: ${this.score}`);
        const overlay = document.getElementById('celebration-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            const finalScore = overlay.querySelector('#final-score');
            if (finalScore) {
                finalScore.textContent = this.score;
            }
        }
        this.createConfetti();
        this.playSFX('victory');
    }
    
    createConfetti() {
        console.log('🎉 Confettis!');
        // Confetti simple avec CSS
        const confettiContainer = document.createElement('div');
        confettiContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: hsl(${Math.random() * 360}, 100%, 50%);
                top: -10%;
                left: ${Math.random() * 100}%;
                animation: fall ${Math.random() * 3 + 2}s linear forwards;
                border-radius: 50%;
            `;
            confettiContainer.appendChild(confetti);
        }
        
        document.body.appendChild(confettiContainer);
        setTimeout(() => confettiContainer.remove(), 5000);
    }
    
    playSFX(type) {
        console.log('🔊 Son:', type);
        // Sons simples avec Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        if (type === 'correct') {
            oscillator.frequency.value = 523.25; // C5
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } else if (type === 'incorrect') {
            oscillator.frequency.value = 200;
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } else if (type === 'victory') {
            oscillator.frequency.value = 659.25; // E5
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 1);
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
        
        // Synthèse vocale
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = 'ar-SA';
            utterance.rate = 0.9;
            utterance.pitch = 1.2;
            utterance.volume = 1.0;
            
            setTimeout(() => {
                window.speechSynthesis.speak(utterance);
            }, 100);
        }
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
