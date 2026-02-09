class AdminPanel {
    constructor() {
        this.questions = [];
        this.editingId = null;
        this.init();
    }

    init() {
        this.loadQuestions();
        this.setupEventListeners();
        this.renderQuestionsList();
        this.setupDynamicAnswers();
    }

    loadQuestions() {
        const stored = localStorage.getItem('treasureHuntQuestions');
        if (stored) {
            this.questions = JSON.parse(stored);
        }
    }

    saveQuestions() {
        localStorage.setItem('treasureHuntQuestions', JSON.stringify(this.questions));
    }

    setupEventListeners() {
        document.getElementById('back-to-game').addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        document.getElementById('question-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveQuestion();
        });

        document.getElementById('cancel-edit').addEventListener('click', () => {
            this.cancelEdit();
        });

        document.getElementById('export-data').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('import-data').addEventListener('click', () => {
            document.getElementById('import-file').click();
        });

        document.getElementById('import-file').addEventListener('change', (e) => {
            this.importData(e);
        });

        document.getElementById('reset-data').addEventListener('click', () => {
            this.resetData();
        });

        document.getElementById('add-answer').addEventListener('click', () => {
            this.addAnswerField();
        });
    }

    setupDynamicAnswers() {
        const container = document.getElementById('answers-inputs');
        container.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-answer')) {
                const row = e.target.closest('.answer-row');
                if (container.children.length > 2) {
                    row.remove();
                    this.updateRemoveButtons();
                }
            }
        });
        this.updateRemoveButtons();
    }

    addAnswerField() {
        const container = document.getElementById('answers-inputs');
        const count = container.children.length;
        
        if (count >= 10) {
            alert('الحد الأقصى 10 إجابات!');
            return;
        }

        const row = document.createElement('div');
        row.className = 'answer-row';
        row.innerHTML = `
            <input type="text" class="answer-input form-control" placeholder="الإجابة ${count + 1}">
            <button type="button" class="remove-answer">❌</button>
        `;
        container.appendChild(row);
        this.updateRemoveButtons();
    }

    updateRemoveButtons() {
        const container = document.getElementById('answers-inputs');
        const buttons = container.querySelectorAll('.remove-answer');
        buttons.forEach(btn => {
            btn.style.display = container.children.length > 2 ? 'inline-block' : 'none';
        });
    }


    saveQuestion() {
        const markerId = parseInt(document.getElementById('marker-id').value);
        const question = document.getElementById('question-input').value.trim();
        const correctAnswer = document.getElementById('correct-answer').value.trim();
        const points = parseInt(document.getElementById('points').value);
        const editId = document.getElementById('edit-id').value;

        if (!question || !correctAnswer) {
            alert('يرجى ملء جميع الحقول المطلوبة!');
            return;
        }

        const existingMarker = this.questions.find(q => 
            q.markerId === markerId && (!editId || q.id !== parseInt(editId))
        );

        if (existingMarker) {
            alert(`العلامة رقم ${markerId} مستخدمة بالفعل في سؤال آخر!`);
            return;
        }

        const answerInputs = document.querySelectorAll('.answer-input');
        const answers = Array.from(answerInputs)
            .map(input => input.value.trim())
            .filter(val => val !== '');

        if (answers.length < 2) {
            alert('يرجى إدخال إجابتين على الأقل!');
            return;
        }

        if (!answers.some(a => a.toLowerCase() === correctAnswer.toLowerCase())) {
            alert('يجب أن تطابق الإجابة الصحيحة أحد الخيارات المقترحة!');
            return;
        }

        const questionData = {
            id: editId ? parseInt(editId) : Date.now(),
            markerId,
            type: 'qcm',
            question,
            answers,
            correctAnswer,
            points
        };

        if (editId) {
            const index = this.questions.findIndex(q => q.id === parseInt(editId));
            if (index !== -1) {
                this.questions[index] = questionData;
            }
        } else {
            this.questions.push(questionData);
        }

        this.saveQuestions();
        this.renderQuestionsList();
        this.resetForm();
        
        alert('✅ تم حفظ السؤال بنجاح!');
    }

    editQuestion(id) {
        const question = this.questions.find(q => q.id === id);
        if (!question) return;

        this.editingId = id;
        document.getElementById('edit-id').value = id;
        document.getElementById('marker-id').value = question.markerId;
        document.getElementById('question-input').value = question.question;
        document.getElementById('correct-answer').value = question.correctAnswer;
        document.getElementById('points').value = question.points;

        const answerInputs = document.querySelectorAll('.answer-input');
        answerInputs.forEach((input, index) => {
            input.value = question.answers[index] || '';
        });

        document.getElementById('question-form').scrollIntoView({ behavior: 'smooth' });
    }

    deleteQuestion(id) {
        if (!confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
            return;
        }

        this.questions = this.questions.filter(q => q.id !== id);
        this.saveQuestions();
        this.renderQuestionsList();
        
        alert('تم حذف السؤال بنجاح!');
    }

    cancelEdit() {
        this.resetForm();
    }

    resetForm() {
        this.editingId = null;
        document.getElementById('edit-id').value = '';
        document.getElementById('question-form').reset();
        document.getElementById('points').value = 10;
    }

    renderQuestionsList() {
        const container = document.getElementById('questions-list');
        
        if (this.questions.length === 0) {
            container.innerHTML = '<p style="color: #666;">لا توجد أسئلة حالياً. أضف سؤالاً أدناه!</p>';
            return;
        }

        const sortedQuestions = [...this.questions].sort((a, b) => a.markerId - b.markerId);

        container.innerHTML = sortedQuestions.map(q => `
            <div class="question-item">
                <div class="question-item-header">
                    <h3 class="question-item-title">🎯 Marker ${q.markerId} - ${this.getTypeLabel(q.type)}</h3>
                </div>
                <div class="question-item-body">
                    <p class="m-0 mb-1"><strong>السؤال:</strong> ${q.question}</p>
                    <p class="m-0 mb-1"><strong>الإجابة:</strong> ${q.correctAnswer}</p>
                    ${q.type === 'qcm' ? `<p class="m-0 mb-1"><strong>الخيارات:</strong> ${q.answers.join(' ، ')}</p>` : ''}
                    <p class="m-0"><strong>النقاط:</strong> ${q.points}</p>
                </div>
                <div class="question-item-actions">
                    <button class="btn btn-secondary btn-sm" onclick="admin.editQuestion(${q.id})">✏️ تعديل</button>
                    <button class="btn btn-danger btn-sm" onclick="admin.deleteQuestion(${q.id})">🗑️ حذف</button>
                </div>
            </div>
        `).join('');
    }

    getTypeLabel(type) {
        return 'QCM';
    }

    exportData() {
        const data = {
            questions: this.questions,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `treasure-hunt-questions-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        alert('تم تصدير البيانات بنجاح!');
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (!data.questions || !Array.isArray(data.questions)) {
                    throw new Error('Format de fichier invalide');
                }

                if (confirm('هل تريد استبدال جميع الأسئلة الموجودة؟')) {
                    this.questions = data.questions;
                } else {
                    const newQuestions = data.questions.filter(newQ => 
                        !this.questions.some(existingQ => existingQ.markerId === newQ.markerId)
                    );
                    this.questions = [...this.questions, ...newQuestions];
                }

                this.saveQuestions();
                this.renderQuestionsList();
                alert('تم استيراد البيانات بنجاح!');
            } catch (error) {
                alert('خطأ في الاستيراد: ' + error.message);
            }
        };
        reader.readAsText(file);

        event.target.value = '';
    }

    resetData() {
        if (!confirm('⚠️ تحذير! سيتم حذف جميع الأسئلة. هل أنت متأكد؟')) {
            return;
        }

        if (!confirm('تأكيد أخير: حذف جميع البيانات؟')) {
            return;
        }

        this.questions = [];
        this.saveQuestions();
        this.renderQuestionsList();
        this.resetForm();
        
        alert('تم حذف جميع البيانات!');
    }
}

let admin;
document.addEventListener('DOMContentLoaded', () => {
    admin = new AdminPanel();
});
