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
        if (this.questions.length === 0) {
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
                    answers: ['الرباط', 'الدار البيضاء', 'مراكش', 'فاس'],
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
                    question: 'ما هو الحيوان الذي يقول "مواء"؟',
                    answers: ['كلب', 'قطة', 'عصفور', 'فأر'],
                    correctAnswer: 'قطة',
                    points: 10
                }
            ];
            localStorage.setItem('treasureHuntQuestions', JSON.stringify(this.questions));
        }
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
        
        welcomeScreen.classList.remove('active');
        gameScreen.classList.add('active');
        
        // Cacher le fond gradient
        document.body.classList.add('game-active');
        
        document.getElementById('player-name').textContent = `👤 ${this.playerName}`;
        
        this.showInstructions();
        this.updateScore();
        this.updateProgress();
        this.initAR();
        
        // Pas de musique de fond pour l'instant
    }

    showInstructions() {
        const overlay = document.getElementById('instructions-overlay');
        const startBtn = document.getElementById('start-scanning');
        
        if (!overlay || !startBtn) return;
        
        overlay.classList.remove('hidden');
        
        startBtn.addEventListener('click', () => {
            overlay.classList.add('hidden');
            
            // Activer la caméra AR
            const arContainer = document.getElementById('ar-container');
            const scene = document.querySelector('a-scene');
            
            if (arContainer) {
                arContainer.style.display = 'block';
            }
            
            // Attendre que la scène soit prête
            if (scene) {
                if (scene.hasLoaded) {
                    this.onARReady();
                } else {
                    scene.addEventListener('loaded', () => {
                        this.onARReady();
                    }, { once: true });
                }
            }
        }, { once: true });
    }
    
    onARReady() {
        const encouragementMsg = this.getRandomPhrase('encouragement');
        this.kenziSpeak(encouragementMsg);
        this.showKenziMessage(`لنبدأ ${this.playerName}!`);
        this.showMarkerHint();
    }

    showMarkerHint() {
        const hint = document.getElementById('marker-hint');
        const nextMarkerNum = document.getElementById('next-marker-number');
        
        if (!hint || !nextMarkerNum) return;
        
        const unansweredQuestions = this.questions.filter(q => !this.answeredQuestions.has(q.id));
        if (unansweredQuestions.length > 0) {
            const nextQuestion = unansweredQuestions.sort((a, b) => a.markerId - b.markerId)[0];
            nextMarkerNum.textContent = nextQuestion.markerId;
            hint.classList.remove('hidden');
            
            setTimeout(() => {
                hint.classList.add('hidden');
            }, 5000);
        }
    }

    initAR() {
        const scene = document.querySelector('a-scene');
        const arContainer = document.getElementById('ar-container');
        
        // Cacher la caméra au début
        if (arContainer) {
            arContainer.style.display = 'none';
        }
        
        // Préparer les marqueurs quand la scène est chargée
        if (scene.hasLoaded) {
            this.createMarkers();
        } else {
            scene.addEventListener('loaded', () => {
                this.createMarkers();
            });
        }
    }

    createMarkers() {
        const scene = document.querySelector('a-scene');
        console.log('🎨 Création des marqueurs AR...');
        
        // Pour chaque question, créer un marqueur AR
        // For each question, create an AR marker
        // لكل سؤال، إنشاء علامة AR
        this.questions.forEach(question => {
            if (!this.markersCreated.has(question.markerId)) {
                // Créer un marqueur AR.js de type "barcode"
                // Create an AR.js marker of type "barcode"
                // إنشاء علامة AR.js من نوع "barcode"
                const marker = document.createElement('a-marker');
                marker.setAttribute('type', 'barcode');
                
                // ⭐ IMPORTANT: Le numéro du marqueur (0-63)
                // Ce numéro DOIT correspondre au marqueur imprimé !
                // This number MUST match the printed marker!
                // هذا الرقم يجب أن يطابق العلامة المطبوعة!
                marker.setAttribute('value', question.markerId);
                marker.setAttribute('id', `marker-${question.markerId}`);

                // 🎯 CONTENU AR 3D - Position face à la caméra
                const arContainer = document.createElement('a-entity');
                arContainer.setAttribute('id', `ar-container-${question.markerId}`);
                arContainer.setAttribute('position', '0 0 -1.2');
                arContainer.setAttribute('look-at', '[camera]');
                arContainer.setAttribute('rotation', '0 0 0');
                
                // ✨ Particules magiques - Plus nombreuses et variées
                for (let i = 0; i < 20; i++) {
                    const particleCanvas = document.createElement('canvas');
                    particleCanvas.width = 128;
                    particleCanvas.height = 128;
                    const pCtx = particleCanvas.getContext('2d');
                    pCtx.font = '80px Arial';
                    pCtx.textAlign = 'center';
                    pCtx.textBaseline = 'middle';
                    pCtx.fillText(['✨', '⭐', '🌟', '💫', '🎉', '🎊', '🌈', '💖'][Math.floor(Math.random() * 8)], 64, 64);
                    
                    const particle = document.createElement('a-plane');
                    const x = (Math.random() - 0.5) * 4;
                    const y = Math.random() * 2.5;
                    const z = (Math.random() - 0.5) * 1;
                    particle.setAttribute('position', `${x} ${y} ${z}`);
                    particle.setAttribute('width', '0.2');
                    particle.setAttribute('height', '0.2');
                    particle.setAttribute('material', 'transparent: true; side: double');
                    particle.setAttribute('src', particleCanvas.toDataURL());
                    particle.setAttribute('animation', `property: position; to: ${x} ${y + 2} ${z}; dur: ${1500 + Math.random() * 2000}; loop: true; dir: alternate; easing: easeInOutSine`);
                    particle.setAttribute('animation__scale', `property: scale; to: 1.5 1.5 1; dur: ${800 + Math.random() * 1000}; loop: true; dir: alternate`);
                    particle.setAttribute('animation__rotate', `property: rotation; to: 0 0 ${360 * (Math.random() > 0.5 ? 1 : -1)}; dur: ${3000 + Math.random() * 2000}; loop: true; easing: linear`);
                    arContainer.appendChild(particle);
                }
                
                // ☁️ Nuages animés - Plus dynamiques
                for (let i = 0; i < 8; i++) {
                    const cloudCanvas = document.createElement('canvas');
                    cloudCanvas.width = 256;
                    cloudCanvas.height = 128;
                    const cCtx = cloudCanvas.getContext('2d');
                    cCtx.font = '70px Arial';
                    cCtx.textAlign = 'center';
                    cCtx.textBaseline = 'middle';
                    cCtx.fillText('☁️☁️', 128, 64);
                    
                    const cloud = document.createElement('a-plane');
                    const x = (Math.random() - 0.5) * 4;
                    const y = 1.5 + Math.random() * 1;
                    const z = -0.5 + Math.random() * 0.8;
                    cloud.setAttribute('position', `${x} ${y} ${z}`);
                    cloud.setAttribute('width', '0.6');
                    cloud.setAttribute('height', '0.3');
                    cloud.setAttribute('material', 'transparent: true; side: double; opacity: 0.8');
                    cloud.setAttribute('src', cloudCanvas.toDataURL());
                    cloud.setAttribute('animation__move', `property: position; to: ${x + 0.5} ${y + 0.15} ${z}; dur: ${3500 + i * 400}; loop: true; dir: alternate; easing: easeInOutSine`);
                    cloud.setAttribute('animation__scale', `property: scale; to: 1.15 1.15 1; dur: ${3000 + i * 300}; loop: true; dir: alternate`);
                    arContainer.appendChild(cloud);
                }
                
                // 🎆 Étoiles filantes occasionnelles
                for (let i = 0; i < 3; i++) {
                    const shootingStarCanvas = document.createElement('canvas');
                    shootingStarCanvas.width = 256;
                    shootingStarCanvas.height = 64;
                    const ssCtx = shootingStarCanvas.getContext('2d');
                    ssCtx.font = '40px Arial';
                    ssCtx.fillText('💫✨', 10, 32);
                    
                    const shootingStar = document.createElement('a-plane');
                    const startX = 2 + Math.random();
                    const startY = 2 + Math.random() * 0.5;
                    shootingStar.setAttribute('position', `${startX} ${startY} -0.5`);
                    shootingStar.setAttribute('width', '0.4');
                    shootingStar.setAttribute('height', '0.1');
                    shootingStar.setAttribute('material', 'transparent: true; side: double');
                    shootingStar.setAttribute('src', shootingStarCanvas.toDataURL());
                    shootingStar.setAttribute('animation', `property: position; to: ${-startX} ${startY - 1.5} -0.5; dur: 2000; delay: ${i * 4000}; loop: true; easing: easeInQuad`);
                    shootingStar.setAttribute('animation__fade', `property: components.material.material.opacity; from: 1; to: 0; dur: 2000; delay: ${i * 4000}; loop: true`);
                    arContainer.appendChild(shootingStar);
                }
                
                // 📋 Panneau fond doré - PLUS GRAND
                const border = document.createElement('a-plane');
                border.setAttribute('position', '0 0 -0.02');
                border.setAttribute('width', '2.8');
                border.setAttribute('height', '3.2');
                border.setAttribute('color', '#FFD700');
                border.setAttribute('opacity', '1');
                
                // Panneau fond bleu ciel - PLUS GRAND
                const bgPanel = document.createElement('a-plane');
                bgPanel.setAttribute('position', '0 0 -0.01');
                bgPanel.setAttribute('width', '2.6');
                bgPanel.setAttribute('height', '3');
                bgPanel.setAttribute('color', '#87CEEB');
                bgPanel.setAttribute('opacity', '0.9');
                bgPanel.setAttribute('animation', 'property: position; to: 0 0.03 -0.01; dur: 2000; loop: true; dir: alternate');
                
                // 🦊 Titre - Canvas texture pour texte arabe
                const titleCanvas = document.createElement('canvas');
                titleCanvas.width = 1024;
                titleCanvas.height = 256;
                const titleCtx = titleCanvas.getContext('2d');
                titleCtx.fillStyle = '#FFFFFF';
                titleCtx.fillRect(0, 0, titleCanvas.width, titleCanvas.height);
                titleCtx.fillStyle = '#FF1493';
                titleCtx.font = 'bold 90px Arial';
                titleCtx.textAlign = 'center';
                titleCtx.textBaseline = 'middle';
                titleCtx.direction = 'rtl';
                titleCtx.fillText('🦊 كنزي يسأل:', titleCanvas.width / 2, titleCanvas.height / 2);
                
                const titlePlane = document.createElement('a-plane');
                titlePlane.setAttribute('position', '0 0.5 0.01');
                titlePlane.setAttribute('width', '2.5');
                titlePlane.setAttribute('height', '0.4');
                titlePlane.setAttribute('material', 'transparent: true; side: double');
                titlePlane.setAttribute('src', titleCanvas.toDataURL());
                
                // 📝 Question - Canvas texture pour texte arabe - PLUS GRAND
                const questionCanvas = document.createElement('canvas');
                questionCanvas.width = 2048;
                questionCanvas.height = 512;
                const qCtx = questionCanvas.getContext('2d');
                qCtx.fillStyle = '#FFFFE0';
                qCtx.fillRect(0, 0, questionCanvas.width, questionCanvas.height);
                qCtx.fillStyle = '#000000';
                qCtx.font = 'bold 85px Arial';
                qCtx.textAlign = 'center';
                qCtx.textBaseline = 'middle';
                qCtx.direction = 'rtl';
                
                // Word wrap pour texte arabe
                const words = question.question.split(' ');
                let line = '';
                let y = 180;
                const maxWidth = 1900;
                
                for (let word of words) {
                    const testLine = line + word + ' ';
                    const metrics = qCtx.measureText(testLine);
                    if (metrics.width > maxWidth && line !== '') {
                        qCtx.fillText(line.trim(), questionCanvas.width / 2, y);
                        line = word + ' ';
                        y += 90;
                    } else {
                        line = testLine;
                    }
                }
                qCtx.fillText(line.trim(), questionCanvas.width / 2, y);
                
                const questionPlane = document.createElement('a-plane');
                questionPlane.setAttribute('position', '0 0 0.01');
                questionPlane.setAttribute('width', '2.6');
                questionPlane.setAttribute('height', '0.75');
                questionPlane.setAttribute('material', 'transparent: true; side: double');
                questionPlane.setAttribute('src', questionCanvas.toDataURL());
                
                arContainer.appendChild(border);
                arContainer.appendChild(bgPanel);
                arContainer.appendChild(titlePlane);
                arContainer.appendChild(questionPlane);
                
                // 🎮 Boutons réponse 3D cliquables
                const buttonColors = ['#FF6B9D', '#6BCF7F', '#FFD93D', '#4D96FF'];
                
                question.answers.forEach((answer, index) => {
                    const yPos = -0.6 - (index * 0.4);
                    
                    // Bordure blanche - PLUS GRANDE
                    const btnBorder = document.createElement('a-plane');
                    btnBorder.setAttribute('position', `0 ${yPos} 0.005`);
                    btnBorder.setAttribute('width', '2.45');
                    btnBorder.setAttribute('height', '0.38');
                    btnBorder.setAttribute('color', '#FFFFFF');
                    btnBorder.setAttribute('opacity', '1');
                    btnBorder.setAttribute('animation__appear', `property: scale; from: 0 0 0; to: 1 1 1; dur: 300; delay: ${index * 100}; easing: easeOutBack`);
                    
                    // Bouton coloré - PLUS GRAND
                    const button = document.createElement('a-plane');
                    button.setAttribute('id', `ar-btn-${question.markerId}-${index}`);
                    button.setAttribute('position', `0 ${yPos} 0.01`);
                    button.setAttribute('width', '2.4');
                    button.setAttribute('height', '0.35');
                    button.setAttribute('color', buttonColors[index]);
                    button.setAttribute('opacity', '1');
                    button.setAttribute('class', 'clickable');
                    button.setAttribute('data-answer', answer);
                    button.setAttribute('animation__appear', `property: scale; from: 0 0 0; to: 1 1 1; dur: 300; delay: ${index * 100 + 50}; easing: easeOutBack`);
                    
                    // Texte réponse - Canvas texture pour texte arabe
                    const answerCanvas = document.createElement('canvas');
                    answerCanvas.width = 1536;
                    answerCanvas.height = 256;
                    const aCtx = answerCanvas.getContext('2d');
                    aCtx.fillStyle = buttonColors[index];
                    aCtx.fillRect(0, 0, answerCanvas.width, answerCanvas.height);
                    aCtx.fillStyle = '#FFFFFF';
                    aCtx.font = 'bold 80px Arial';
                    aCtx.textAlign = 'center';
                    aCtx.textBaseline = 'middle';
                    aCtx.direction = 'rtl';
                    aCtx.fillText(answer, answerCanvas.width / 2, answerCanvas.height / 2);
                    
                    const answerTextPlane = document.createElement('a-plane');
                    answerTextPlane.setAttribute('position', `0 ${yPos} 0.02`);
                    answerTextPlane.setAttribute('width', '2.3');
                    answerTextPlane.setAttribute('height', '0.33');
                    answerTextPlane.setAttribute('material', 'transparent: true; side: double');
                    answerTextPlane.setAttribute('src', answerCanvas.toDataURL());
                    
                    // Étoile dorée - PLUS GRANDE
                    const star = document.createElement('a-sphere');
                    star.setAttribute('position', `1.05 ${yPos} 0.02`);
                    star.setAttribute('radius', '0.06');
                    star.setAttribute('color', '#FFD700');
                    star.setAttribute('animation', `property: rotation; to: 0 360 0; dur: ${2000 + index * 200}; loop: true`);
                    
                    arContainer.appendChild(btnBorder);
                    arContainer.appendChild(button);
                    arContainer.appendChild(answerTextPlane);
                    arContainer.appendChild(star);
                });
                
                marker.appendChild(arContainer);

                // 🎯 Quand la caméra DÉTECTE le marqueur
                // When the camera DETECTS the marker
                // عندما تكتشف الكاميرا العلامة
                marker.addEventListener('markerFound', () => {
                    // Afficher la question associée à ce marqueur
                    // Display the question associated with this marker
                    // عرض السؤال المرتبط بهذه العلامة
                    this.onMarkerFound(question);
                });

                // Quand le marqueur n'est plus visible
                // When the marker is no longer visible
                // عندما تختفي العلامة من الكاميرا
                marker.addEventListener('markerLost', () => {
                    this.onMarkerLost(question);
                });

                scene.appendChild(marker);
                this.markersCreated.add(question.markerId);
                console.log('✅ Marqueur créé:', question.markerId, '-', question.question);
            }
        });
        console.log('🎯 Total marqueurs créés:', this.markersCreated.size);
    }

    onMarkerFound(question) {
        console.log('🎯 MARQUEUR DÉTECTÉ:', question.markerId, '-', question.question);
        
        if (!this.answeredQuestions.has(question.id)) {
            this.currentQuestion = question;
            this.currentMarker = question.markerId;
            
            const hint = document.getElementById('marker-hint');
            if (hint) hint.classList.add('hidden');
            
            this.playSound('found');
            
            // Message Kenzi
            this.showKenziMessage('🎯 علامة مكتشفة!');
            
            console.log('✅ Configuration interactions AR 3D');
            
            // Configurer interactions avec boutons AR 3D
            this.setupAR3DInteractions(question);
        }
    }
    
    setupAR3DInteractions(question) {
        console.log('🎮 Configuration interactions AR 3D pour:', question.question);
        
        // Créer overlay transparent avec zones cliquables
        const existingOverlay = document.getElementById('ar-click-overlay');
        if (existingOverlay) existingOverlay.remove();
        
        const overlay = document.createElement('div');
        overlay.id = 'ar-click-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 50;
            pointer-events: none;
        `;
        
        // Créer zones cliquables pour chaque bouton
        // Ajustement responsive selon taille écran
        const screenWidth = window.innerWidth;
        let buttonPositions;
        
        if (screenWidth >= 768 && screenWidth <= 1024) {
            // Tablettes
            buttonPositions = [52, 60, 68, 76];
        } else if (screenWidth > 1024) {
            // Desktop
            buttonPositions = [50, 58, 66, 74];
        } else {
            // Mobile
            buttonPositions = [55, 63, 71, 79];
        }
        
        question.answers.forEach((answer, index) => {
            const clickZone = document.createElement('div');
            let maxWidth, height;
                
                if (screenWidth >= 768 && screenWidth <= 1024) {
                    maxWidth = '600px';
                    height = '10%';
                } else if (screenWidth > 1024) {
                    maxWidth = '500px';
                    height = '9%';
                } else {
                    maxWidth = '450px';
                    height = '11%';
                }
                
                clickZone.style.cssText = `
                    position: absolute;
                    left: 50%;
                    top: ${buttonPositions[index]}%;
                    transform: translateX(-50%);
                    width: 85%;
                    max-width: ${maxWidth};
                    height: ${height};
                    pointer-events: auto;
                    cursor: pointer;
                `;
            
            clickZone.addEventListener('click', () => {
                console.log('🎯 Zone cliquée:', answer);
                const buttonId = `ar-btn-${question.markerId}-${index}`;
                const button = document.getElementById(buttonId);
                if (button) {
                    this.handleAR3DClick(answer, button, question.markerId);
                }
            });
            
            clickZone.addEventListener('touchstart', (e) => {
                e.preventDefault();
                console.log('🎯 Touch détecté:', answer);
                const buttonId = `ar-btn-${question.markerId}-${index}`;
                const button = document.getElementById(buttonId);
                if (button) {
                    this.handleAR3DClick(answer, button, question.markerId);
                }
            }, { passive: false });
            
            overlay.appendChild(clickZone);
        });
        
        document.body.appendChild(overlay);
        console.log('✅ Overlay cliquable créé avec', question.answers.length, 'zones');
    }
    
    handleAR3DClick(answer, buttonElement, markerId) {
        console.log('🎮 Traitement clic AR 3D:', answer);
        
        if (!this.currentQuestion) return;
        
        // Animation clic 3D
        buttonElement.setAttribute('animation__click', 'property: scale; from: 1 1 1; to: 0.9 0.9 0.9; dur: 100; dir: alternate; loop: 1');
        
        // Vérifier réponse
        const isCorrect = answer === this.currentQuestion.correctAnswer;
        
        if (isCorrect) {
            // Animation succès
            buttonElement.setAttribute('animation__success', 'property: scale; to: 1.3 1.3 1; dur: 300; easing: easeOutBack');
            buttonElement.setAttribute('color', '#6BCF7F');
            
            this.score += 10;
            this.answeredQuestions.add(this.currentQuestion.id);
            this.updateScore();
            this.updateProgress();
            this.playSound('correct');
            this.showKenziMessage('🎉 إجابة صحيحة!');
            
            // 🎊 Effet confetti sur bonne réponse
            this.createConfettiExplosion(markerId);
            
            // Masquer le contenu AR et overlay après 1.5s
            setTimeout(() => {
                const arContainer = document.getElementById(`ar-container-${markerId}`);
                if (arContainer) {
                    arContainer.setAttribute('animation__fadeout', 'property: scale; to: 0 0 0; dur: 500; easing: easeInBack');
                }
                const overlay = document.getElementById('ar-click-overlay');
                if (overlay) overlay.remove();
                this.checkGameCompletion();
            }, 1500);
        } else {
            // Animation erreur (shake)
            const currentPos = buttonElement.getAttribute('position');
            const yPos = parseFloat(currentPos.y);
            buttonElement.setAttribute('animation__error', `property: position; from: -0.05 ${yPos} 0.01; to: 0.05 ${yPos} 0.01; dur: 50; dir: alternate; loop: 4`);
            buttonElement.setAttribute('color', '#FF3D6E');
            
            this.playSound('wrong');
            
            // Vibration sur erreur (si disponible)
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 100]);
            }
            this.showKenziMessage('❌ حاول مرة أخرى!');
            
            // Rétablir couleur après 1s
            setTimeout(() => {
                const buttonColors = ['#FF6B9D', '#6BCF7F', '#FFD93D', '#4D96FF'];
                const index = parseInt(buttonElement.id.split('-').pop());
                buttonElement.setAttribute('color', buttonColors[index]);
                buttonElement.setAttribute('position', currentPos);
            }, 1000);
        }
    }
    
    setupARButtonClicks(question) {
        console.log('🔘 Configuration des boutons pour:', question.question);
        
        // Nettoyer l'ancien overlay si présent
        if (this.clickOverlay && this.clickOverlay.parentNode) {
            document.body.removeChild(this.clickOverlay);
            this.clickOverlay = null;
        }
        
        // Créer un overlay pour capturer les clics
        if (!this.clickOverlay) {
            this.clickOverlay = document.createElement('div');
            this.clickOverlay.style.position = 'fixed';
            this.clickOverlay.style.top = '0';
            this.clickOverlay.style.left = '0';
            this.clickOverlay.style.width = '100%';
            this.clickOverlay.style.height = '100%';
            this.clickOverlay.style.zIndex = '150';
            this.clickOverlay.style.background = 'rgba(0, 0, 0, 0.3)';
            this.clickOverlay.style.backdropFilter = 'blur(5px)';
            
            // Afficher la question en haut
            const questionBox = document.createElement('div');
            questionBox.style.position = 'fixed';
            questionBox.style.top = '100px';
            questionBox.style.left = '50%';
            questionBox.style.transform = 'translateX(-50%)';
            questionBox.style.width = '90%';
            questionBox.style.maxWidth = '500px';
            questionBox.style.background = 'linear-gradient(135deg, #FFD93D 0%, #FFA07A 100%)';
            questionBox.style.padding = '20px';
            questionBox.style.borderRadius = '20px';
            questionBox.style.border = '4px solid white';
            questionBox.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
            questionBox.style.textAlign = 'center';
            questionBox.style.animation = 'popIn 0.5s ease-out';
            questionBox.style.zIndex = '152';
            
            const questionTitle = document.createElement('div');
            questionTitle.textContent = '🦊 كنزي يسأل:';
            questionTitle.style.fontSize = '18px';
            questionTitle.style.fontWeight = 'bold';
            questionTitle.style.color = 'white';
            questionTitle.style.marginBottom = '10px';
            questionTitle.style.textShadow = '1px 1px 2px rgba(0,0,0,0.2)';
            
            const questionText = document.createElement('div');
            questionText.textContent = question.question;
            questionText.style.fontSize = '22px';
            questionText.style.fontWeight = 'bold';
            questionText.style.color = '#333';
            questionText.style.lineHeight = '1.4';
            
            questionBox.appendChild(questionTitle);
            questionBox.appendChild(questionText);
            
            // Afficher les boutons de réponse en overlay
            const answersOverlay = document.createElement('div');
            answersOverlay.id = 'ar-answers-overlay';
            answersOverlay.style.position = 'fixed';
            answersOverlay.style.bottom = '20px';
            answersOverlay.style.left = '50%';
            answersOverlay.style.transform = 'translateX(-50%)';
            answersOverlay.style.display = 'flex';
            answersOverlay.style.flexDirection = 'column';
            answersOverlay.style.gap = '10px';
            answersOverlay.style.width = '90%';
            answersOverlay.style.maxWidth = '400px';
            answersOverlay.style.zIndex = '151';
            
            question.answers.forEach((answer, index) => {
                const btn = document.createElement('button');
                btn.className = 'ar-overlay-btn';
                btn.textContent = answer;
                btn.style.padding = '15px';
                btn.style.fontSize = '18px';
                btn.style.fontWeight = 'bold';
                btn.style.border = '4px solid white';
                btn.style.borderRadius = '15px';
                btn.style.cursor = 'pointer';
                btn.style.transition = 'all 0.3s';
                btn.style.background = ['#FF6B9D', '#6BCF7F', '#FFD93D', '#4D96FF'][index % 4];
                btn.style.color = 'white';
                btn.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
                btn.style.animation = `slideUp 0.5s ease-out ${index * 0.1}s both`;
                
                btn.addEventListener('click', () => {
                    this.checkAnswer(answer, btn);
                    // Nettoyer l'overlay après réponse
                    setTimeout(() => {
                        if (this.clickOverlay && this.clickOverlay.parentNode) {
                            document.body.removeChild(this.clickOverlay);
                            this.clickOverlay = null;
                        }
                    }, 500);
                });
                
                answersOverlay.appendChild(btn);
            });
            
            this.clickOverlay.appendChild(questionBox);
            this.clickOverlay.appendChild(answersOverlay);
            document.body.appendChild(this.clickOverlay);
            
            console.log('✅ Overlay de boutons créé avec', question.answers.length, 'réponses');
            
            // Ajouter l'animation CSS
            if (!document.getElementById('ar-animations')) {
                const style = document.createElement('style');
                style.id = 'ar-animations';
                style.textContent = `
                    @keyframes slideUp {
                        from {
                            opacity: 0;
                            transform: translateY(50px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .ar-overlay-btn:hover {
                        transform: scale(1.05);
                        box-shadow: 0 8px 20px rgba(0,0,0,0.4);
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }

    checkGameCompletion() {
        console.log('🎯 Vérification fin de jeu:', this.answeredQuestions.size, '/', this.questions.length);
        
        if (this.answeredQuestions.size === this.questions.length) {
            console.log('🎊 JEU TERMINÉ!');
            
            setTimeout(() => {
                this.showVictoryScreen();
            }, 1000);
        }
    }
    
    showVictoryScreen() {
        // Masquer AR
        const arContainer = document.getElementById('ar-container');
        if (arContainer) arContainer.style.display = 'none';
        
        // Créer écran de victoire spectaculaire
        const victoryScreen = document.createElement('div');
        victoryScreen.id = 'victory-screen';
        victoryScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #FF6B9D 0%, #FFD93D 50%, #6BCF7F 100%);
            z-index: 300;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            animation: victoryFadeIn 0.5s ease-out;
        `;
        
        victoryScreen.innerHTML = `
            <div style="
                background: white;
                padding: 2rem;
                border-radius: 30px;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                border: 5px solid #FFD93D;
                animation: victoryBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                max-width: 90%;
            ">
                <div style="font-size: 80px; margin-bottom: 1rem; animation: victoryRotate 2s ease-in-out infinite;">🏆</div>
                <h1 style="font-size: 2rem; color: #FF6B9D; margin-bottom: 1rem; text-shadow: 2px 2px 0 rgba(0,0,0,0.1);">🎉 مبروك! 🎉</h1>
                <p style="font-size: 1.5rem; color: #333; margin-bottom: 1rem; font-weight: 700;">لقد أنهيت جميع الأسئلة!</p>
                <div style="
                    background: linear-gradient(135deg, #FFD93D 0%, #FFA07A 100%);
                    padding: 1.5rem;
                    border-radius: 20px;
                    margin: 1.5rem 0;
                    border: 4px solid #FF6B9D;
                ">
                    <div style="font-size: 3rem; color: white; font-weight: 900; text-shadow: 3px 3px 0 rgba(0,0,0,0.2);">${this.score}</div>
                    <div style="font-size: 1.2rem; color: white; font-weight: 700;">نقطة</div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 1rem; align-items: stretch; width: 100%; max-width: 300px; margin: 0 auto;">
                    <button onclick="location.reload()" style="
                        padding: 1rem 2rem;
                        font-size: 1.2rem;
                        border-radius: 15px;
                        border: 3px solid #6BCF7F;
                        background: #6BCF7F;
                        color: white;
                        font-weight: 700;
                        cursor: pointer;
                        box-shadow: 0 5px 15px rgba(107, 207, 127, 0.4);
                        width: 100%;
                    ">🔄 العب مرة أخرى</button>
                    <button onclick="window.location.href='/'" style="
                        padding: 1rem 2rem;
                        font-size: 1.2rem;
                        border-radius: 15px;
                        border: 3px solid #4D96FF;
                        background: #4D96FF;
                        color: white;
                        font-weight: 700;
                        cursor: pointer;
                        box-shadow: 0 5px 15px rgba(77, 150, 255, 0.4);
                        width: 100%;
                    ">🏠 العودة للبداية</button>
                </div>
            </div>
        `;
        
        // Ajouter animations CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes victoryFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes victoryBounce {
                0% { transform: scale(0.3); opacity: 0; }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes victoryRotate {
                0%, 100% { transform: rotate(-10deg) scale(1); }
                50% { transform: rotate(10deg) scale(1.2); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(victoryScreen);
        
        // Créer confetti de célébration sur l'écran
        this.createScreenConfetti();
        
        // Sons de victoire
        this.playSound('correct');
        setTimeout(() => this.playSound('correct'), 300);
        setTimeout(() => this.playSound('correct'), 600);
        
        // Message vocal de félicitations
        if (window.speechSynthesis) {
            setTimeout(() => {
                const utterance = new SpeechSynthesisUtterance('مبروك! لقد أنهيت اللعبة بنجاح!');
                utterance.lang = 'ar-SA';
                utterance.rate = 0.9;
                utterance.pitch = 1.2;
                window.speechSynthesis.speak(utterance);
            }, 500);
        }
    }
    
    createScreenConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 301;
        `;
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            const colors = ['#FF6B9D', '#FFD93D', '#6BCF7F', '#4D96FF', '#FF69B4', '#FFA500'];
            const emojis = ['🎉', '🎊', '⭐', '✨', '🌟', '💫', '🎈', '🏆'];
            
            confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            confetti.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: -50px;
                font-size: ${20 + Math.random() * 30}px;
                animation: confettiFall ${3 + Math.random() * 2}s linear ${Math.random() * 2}s infinite;
            `;
            
            confettiContainer.appendChild(confetti);
        }
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes confettiFall {
                to {
                    transform: translateY(100vh) rotate(${360 + Math.random() * 360}deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(confettiContainer);
    }
}

// Musique de fond désactivée pour l'instant

// Fonction pour toggle le score panel avec animation cute
window.toggleScorePanel = function() {
    const content = document.getElementById('score-panel-content');
    const icon = document.getElementById('toggle-icon');
    const scorePanel = document.getElementById('score-panel');
    
    if (content.style.maxHeight === '0px' || content.style.maxHeight === '') {
        // Ouvrir
        content.style.maxHeight = '500px';
        icon.style.transform = 'rotate(0deg)';
        scorePanel.classList.remove('animate__fadeOut');
        scorePanel.classList.add('animate__fadeIn');
    } else {
        // Fermer
        content.style.maxHeight = '0px';
        icon.style.transform = 'rotate(-90deg)';
        scorePanel.classList.remove('animate__fadeIn');
        scorePanel.classList.add('animate__fadeOut');
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

        // Désactiver tous les boutons AR
        const arButtons = document.querySelectorAll('.ar-button');
        arButtons.forEach(btn => {
            btn.classList.remove('clickable');
            btn.removeAttribute('animation__pulse');
        });

        const correct = userAnswer.trim().toLowerCase() === 
                       this.currentQuestion.correctAnswer.trim().toLowerCase();

        const feedback = document.getElementById('feedback');
        feedback.classList.remove('hidden', 'success', 'error');

        if (correct) {
            feedback.classList.add('success');
            const correctMsg = this.getRandomPhrase('correct');
            feedback.textContent = `🎉 ${correctMsg} +${this.currentQuestion.points} نقطة`;
            
            this.playSound('correct');
            this.showCelebration(correctMsg);
            
            // Cacher le contenu AR
            if (this.currentMarker !== null) {
                const arContent = document.getElementById(`ar-content-${this.currentMarker}`);
                if (arContent) {
                    arContent.setAttribute('scale', '0 0 0');
                }
            }
            
            this.score += this.currentQuestion.points;
            this.answeredQuestions.add(this.currentQuestion.id);
            this.updateScore();
            this.updateProgress();

            // Animation de succès sur le bouton AR
            if (element.classList && element.classList.contains('ar-button')) {
                element.setAttribute('animation__success', 'property: rotation; to: -90 360 0; dur: 1000; easing: easeOutBack');
                element.setAttribute('color', '#6BCF7F');
                
                // Particules de célébration
                this.createARConfetti(element);
            }

            setTimeout(() => {
                this.showMarkerHint();
                this.hideQuestion();
                this.hideCelebration();
                if (this.answeredQuestions.size === this.questions.length) {
                    this.gameComplete();
                } else {
                    this.showKenziMessage(this.getRandomPhrase('encouragement'));
                }
            }, 3000);
        } else {
            feedback.classList.add('error');
            const incorrectMsg = this.getRandomPhrase('incorrect');
            feedback.textContent = `❌ ${incorrectMsg}`;
            
            this.playSound('incorrect');
            this.showKenziMessage(incorrectMsg);
            
            // Animation de secousse sur le contenu AR
            if (this.currentMarker !== null) {
                const arContent = document.getElementById(`ar-content-${this.currentMarker}`);
                if (arContent) {
                    arContent.setAttribute('animation__shake', 'property: rotation; from: 0 0 -5; to: 0 0 5; dir: alternate; dur: 100; loop: 3');
                }
            }

            // Animation d'erreur sur le bouton AR
            if (element.classList && element.classList.contains('ar-button')) {
                element.setAttribute('animation__error', 'property: position; from: 0 0 0; to: 0.1 0 0; dir: alternate; dur: 50; loop: 6');
                element.setAttribute('color', '#FF4444');
            }

            setTimeout(() => {
                feedback.classList.add('hidden');
                // Réactiver les boutons AR
                arButtons.forEach(btn => {
                    btn.classList.add('clickable');
                    btn.setAttribute('animation__pulse', 'property: scale; to: 1.05 1.05 1.05; dir: alternate; dur: 1000; loop: true; easing: easeInOutSine');
                });
                // Restaurer la couleur de l'élément incorrect
                if (element.classList && element.classList.contains('ar-button')) {
                    const index = parseInt(element.id.split('-')[2]);
                    const colors = ['#FF6B9D', '#6BCF7F', '#FFD93D', '#4D96FF'];
                    element.setAttribute('color', colors[index % 4]);
                }
            }, 2000);
        }
    }

    createARConfetti(buttonElement) {
        // Créer des particules de célébration autour du bouton
        const position = buttonElement.getAttribute('position');
        const posArray = position.split(' ').map(parseFloat);
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('a-sphere');
            const angle = (i * 45) * Math.PI / 180;
            const distance = 0.3;
            const x = posArray[0] + Math.cos(angle) * distance;
            const y = posArray[1] + Math.sin(angle) * distance;
            
            particle.setAttribute('position', `${x} ${y} ${posArray[2] + 0.1}`);
            particle.setAttribute('radius', '0.05');
            particle.setAttribute('color', ['#FFD93D', '#FF6B9D', '#6BCF7F', '#4D96FF'][i % 4]);
            particle.setAttribute('animation', `property: position; to: ${x + Math.cos(angle) * 0.5} ${y + Math.sin(angle) * 0.5} ${posArray[2] + 0.3}; dur: 1000; easing: easeOutQuad`);
            particle.setAttribute('animation__fade', 'property: opacity; from: 1; to: 0; dur: 1000; easing: easeOutQuad');
            
            buttonElement.parentNode.appendChild(particle);
            
            // Supprimer après l'animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1100);
        }
    }

    updateScore() {
        document.getElementById('score').textContent = `النقاط: ${this.score}`;
    }

    updateProgress() {
        const progress = document.getElementById('progress');
        progress.textContent = `${this.answeredQuestions.size}/${this.questions.length}`;
    }

    gameComplete() {
        const completeMsg = this.getRandomPhrase('complete');
        this.kenziSpeak(`${completeMsg} لقد حصلت على ${this.score} نقطة!`);
        this.playSound('victory');
        
        setTimeout(() => {
            this.showCelebration(`🏆 ${completeMsg}\nالنقاط: ${this.score}`);
            
            setTimeout(() => {
                if (confirm(`🏆 تهانينا ${this.playerName}!\n\nالنقاط النهائية: ${this.score}\n\nهل تريد اللعب مرة أخرى؟`)) {
                    this.resetGame();
                } else {
                    this.exitGame();
                }
            }, 3000);
        }, 1000);
    }

    resetGame() {
        this.score = 0;
        this.answeredQuestions.clear();
        this.updateScore();
        this.updateProgress();
        this.hideQuestion();
        this.hideCelebration();
        this.kenziSpeak(`هيا ${this.playerName}! لعبة جديدة! ابحث عن العلامات!`);
        this.showKenziMessage(`لنبدأ ${this.playerName}!`);
    }

    exitGame() {
        document.getElementById('game-screen').classList.remove('active');
        document.getElementById('welcome-screen').classList.add('active');
        document.getElementById('student-name').value = '';
        this.playerName = '';
        this.score = 0;
        this.answeredQuestions.clear();
        this.hideQuestion();
    }

    kenziSpeak(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            
            // Attendre un peu pour mobile
            setTimeout(() => {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'ar-SA';
                utterance.rate = 0.9;
                utterance.pitch = 1.1;
                
                // Pour mobile: forcer l'interaction utilisateur
                const speak = () => {
                    const voices = window.speechSynthesis.getVoices();
                    console.log('Voix disponibles:', voices.length);
                    
                    // Chercher une voix arabe
                    const arabicVoice = voices.find(voice => 
                        voice.lang.includes('ar') || 
                        voice.lang.includes('AR')
                    );
                    
                    if (arabicVoice) {
                        console.log('Voix arabe trouvée:', arabicVoice.name);
                        utterance.voice = arabicVoice;
                    } else {
                        console.log('Pas de voix arabe, utilisation voix par défaut');
                    }
                    
                    try {
                        window.speechSynthesis.speak(utterance);
                    } catch (e) {
                        console.error('Erreur TTS:', e);
                    }
                };
                
                // Essayer immédiatement
                if (window.speechSynthesis.getVoices().length > 0) {
                    speak();
                } else {
                    // Attendre le chargement des voix
                    window.speechSynthesis.addEventListener('voiceschanged', speak, { once: true });
                    // Timeout de sécurité
                    setTimeout(speak, 1000);
                }
            }, 100);
        }
    }

    getRandomPhrase(category) {
        const phrases = this.kenziPhrases[category];
        const phrase = phrases[Math.floor(Math.random() * phrases.length)];
        return phrase.replace('{name}', this.playerName);
    }

    showKenziMessage(message) {
        const kenziSpeech = document.getElementById('kenzi-speech');
        if (kenziSpeech) {
            kenziSpeech.textContent = message;
            kenziSpeech.style.display = 'block';
            
            if (this.kenziSpeechTimeout) {
                clearTimeout(this.kenziSpeechTimeout);
            }
            
            this.kenziSpeechTimeout = setTimeout(() => {
                kenziSpeech.style.display = 'none';
            }, 4000);
        }
    }

    showCelebration(message) {
        const overlay = document.getElementById('celebration-overlay');
        const text = document.getElementById('celebration-text');
        
        if (overlay && text) {
            text.textContent = message;
            overlay.classList.remove('hidden');
        }
    }

    hideCelebration() {
        const overlay = document.getElementById('celebration-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    playSound(type) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        if (type === 'correct') {
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } else if (type === 'incorrect') {
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } else if (type === 'found') {
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } else if (type === 'victory') {
            const notes = [523.25, 587.33, 659.25, 783.99];
            notes.forEach((freq, i) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.15);
                gain.gain.setValueAtTime(0.2, audioContext.currentTime + i * 0.15);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.15 + 0.3);
                osc.start(audioContext.currentTime + i * 0.15);
                osc.stop(audioContext.currentTime + i * 0.15 + 0.3);
            });
        }
    }
}

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
