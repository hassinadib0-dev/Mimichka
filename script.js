// helper functions
const PI2 = Math.PI * 2
const random = (min, max) => Math.random() * (max - min + 1) + min | 0
const timestamp = _ => new Date().getTime()

// container
class Birthday {
  constructor() {
    this.resize()
    this.fireworks = []
    this.counter = 0
  }
  
  resize() {
    this.width = canvas.width = window.innerWidth
    let center = this.width / 2 | 0
    this.spawnA = center - center / 4 | 0
    this.spawnB = center + center / 4 | 0
    
    this.height = canvas.height = window.innerHeight
    this.spawnC = this.height * .1
    this.spawnD = this.height * .5
  }
  
  onClick(evt) {
     let x = evt.clientX || evt.touches && evt.touches[0].pageX
     let y = evt.clientY || evt.touches && evt.touches[0].pageY
     
     let count = random(3,5)
     for(let i = 0; i < count; i++) this.fireworks.push(new Firework(
        random(this.spawnA, this.spawnB),
        this.height,
        x,
        y,
        random(0, 260),
        random(30, 110)))
          
     this.counter = -1
  }
  
  update(delta) {
    ctx.globalCompositeOperation = 'hard-light'
    ctx.fillStyle = `rgba(20,20,20,${ 7 * delta })`
    ctx.fillRect(0, 0, this.width, this.height)

    ctx.globalCompositeOperation = 'lighter'
    for (let firework of this.fireworks) firework.update(delta)

    this.counter += delta * 3 
    if (this.counter >= 1) {
      this.fireworks.push(new Firework(
        random(this.spawnA, this.spawnB),
        this.height,
        random(0, this.width),
        random(this.spawnC, this.spawnD),
        random(0, 360),
        random(30, 110)))
      this.counter = 0
    }

    if (this.fireworks.length > 1000) this.fireworks = this.fireworks.filter(firework => !firework.dead)
  }
}

class Firework {
  constructor(x, y, targetX, targetY, shade, offsprings) {
    this.dead = false
    this.offsprings = offsprings
    this.x = x
    this.y = y
    this.targetX = targetX
    this.targetY = targetY
    this.shade = shade
    this.history = []
  }
  update(delta) {
    if (this.dead) return

    let xDiff = this.targetX - this.x
    let yDiff = this.targetY - this.y
    if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) { // is still moving
      this.x += xDiff * 2 * delta
      this.y += yDiff * 2 * delta

      this.history.push({
        x: this.x,
        y: this.y
      })

      if (this.history.length > 20) this.history.shift()

    } else {
      if (this.offsprings && !this.madeChilds) {
        
        let babies = this.offsprings / 2
        for (let i = 0; i < babies; i++) {
          let targetX = this.x + this.offsprings * Math.cos(PI2 * i / babies) | 0
          let targetY = this.y + this.offsprings * Math.sin(PI2 * i / babies) | 0

          birthday.fireworks.push(new Firework(this.x, this.y, targetX, targetY, this.shade, 0))

        }

      }
      this.madeChilds = true
      this.history.shift()
    }
    
    if (this.history.length === 0) this.dead = true
    else if (this.offsprings) { 
        for (let i = 0; this.history.length > i; i++) {
          let point = this.history[i]
          ctx.beginPath()
          ctx.fillStyle = 'hsl(' + this.shade + ',100%,' + i + '%)'
          ctx.arc(point.x, point.y, 1, 0, PI2, false)
          ctx.fill()
        } 
      } else {
      ctx.beginPath()
      ctx.fillStyle = 'hsl(' + this.shade + ',100%,50%)'
      ctx.arc(this.x, this.y, 1, 0, PI2, false)
      ctx.fill()
    }

  }
}

let canvas = document.getElementById('birthday')
let ctx = canvas.getContext('2d')

let then = timestamp()

let birthday = new Birthday
window.onresize = () => birthday.resize()

// العناصر الأساسية
const pageTitle = document.getElementById('pageTitle');
const clickTracker1 = document.getElementById('clickTracker1'); 
const clickTracker2 = document.getElementById('clickTracker2'); 
const toggleButton = document.getElementById('toggleButton');

// عناصر القصة والإجابة للمرحلة 3
const storyContainer = document.getElementById('storyContainer');
const storyTextElement = document.getElementById('storyText');
const answerSection = document.getElementById('answerSection');
const answerInput = document.getElementById('answerInput');
const checkButton = document.getElementById('checkButton');
const messageElement = document.getElementById('message');

// عناصر المرحلة الانتقالية/4 (1 :)
const stageTitle2 = document.getElementById('stageTitle2');
const cipherContainer = document.getElementById('cipherContainer');
const cipherText = document.getElementById('cipherText');
const cipherImage = document.getElementById('cipherImage');
const cipherAnswerSection = document.getElementById('cipherAnswerSection');
const cipherAnswerInput = document.getElementById('cipherAnswerInput');
const cipherCheckButton = document.getElementById('cipherCheckButton');
const cipherMessage = document.getElementById('cipherMessage');

// عناصر المرحلة 5 الجديدة (2 :)
const stageTitle3 = document.getElementById('stageTitle3'); 
const dateContainer = document.getElementById('dateContainer'); 
const dateText = document.getElementById('dateText'); 
const dateAnswerSection = document.getElementById('dateAnswerSection'); 
const dateAnswerInput = document.getElementById('dateAnswerInput'); 
const dateCheckButton = document.getElementById('dateCheckButton'); 
const dateMessage = document.getElementById('dateMessage');


let stage = 1;
let tapCount = 0; 

// القصة والسؤال والإجابة الصحيحة للمرحلة 3
const STORY_TEXT = "Lw9t ,\nWnti ta9ra fi El klem hedha ena mnich bjnbk , kolou bsbb lwa9t , taaref Mariem netwa7chek w brcha w nesstanek \nbel theweni w El d9aya9 w El sweye3";
const ACCEPTED_ANSWERS_STAGE_1 = ["1026"]; 


// النص والسؤال والإجابة الصحيحة للمرحلة 4
const TRANSITION_TEXT = "Okey \nmt3rfch 9dch metwa7chek w nheb net9ablou , wlh habit njik l Sousse w net9ablou ema mnjmtch devoirat w wa9t , l7assl a partir de cette question, Sajel les reponses te3k ta3rfch 3al denya Belek tsst79hm men hnee lin net9ablou ...\nY9oulou ' fi el i3ada ifeda ' ";
const ACCEPTED_ANSWERS_STAGE_2 = ["net9ablou"]; 

// نص وإجابة المرحلة 5 الجديدة
const DATE_STORY_TEXT = "11 decembre 2005 , \nQuel jour ! \nKima lyoum 20 snee lteli touldt \nQuel jour !\nBa3d'hom b 5 Ayem khlatet ena , vendredi nharet'ha w chtee mizebet mel smee .\nW nti Quel jour ?";
const ACCEPTED_ANSWERS_STAGE_3 = ["dimanche"]; 


// إعداد الحالة الأولية
clickTracker2.textContent = 'TAP HERE 5 TIMES';
clickTracker2.style.pointerEvents = 'auto';


// --- وظيفة الطباعة الحرفية (Typing Effect) للمرحلة 3 ---
function startTypingEffect(text) {
    let i = 0;
    storyContainer.classList.remove('hidden');
    answerSection.classList.add('hidden'); 
    storyTextElement.textContent = ''; 
    
    const typingInterval = setInterval(() => {
        if (i < text.length) {
            storyTextElement.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typingInterval);
            // إظهار قسم الإجابة بعد الانتهاء
            answerSection.classList.remove('hidden'); 
            answerInput.style.pointerEvents = 'auto'; 
            checkButton.style.pointerEvents = 'auto';
        }
    }, 40); 
}

// --- وظيفة الطباعة الحرفية (Typing Effect) للمرحلة 4 ---
function startTypingEffectStage2(text) {
    let i = 0;
    cipherText.textContent = ''; 
    cipherAnswerSection.classList.add('hidden'); // إخفاء الإدخال أثناء الكتابة
    
    const typingInterval = setInterval(() => {
        if (i < text.length) {
            cipherText.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typingInterval);
            
            // إظهار قسم الإجابة بعد الانتهاء
            cipherAnswerSection.classList.remove('hidden'); 
            cipherAnswerInput.style.pointerEvents = 'auto'; 
            cipherCheckButton.style.pointerEvents = 'auto';
        }
    }, 40); 
}

// --- وظيفة الطباعة الحرفية (Typing Effect) للمرحلة 5 ---
function startTypingEffectStage3(text) {
    let i = 0;
    dateText.textContent = ''; 
    dateAnswerSection.classList.add('hidden'); // إخفاء الإدخال أثناء الكتابة
    
    const typingInterval = setInterval(() => {
        if (i < text.length) {
            dateText.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typingInterval);
            
            // إظهار قسم الإجابة بعد الانتهاء
            dateAnswerSection.classList.remove('hidden'); 
            dateAnswerInput.style.pointerEvents = 'auto'; 
            dateCheckButton.style.pointerEvents = 'auto';
        }
    }, 40); 
}


// --- وظيفة معالجة النقر على العناوين (المرحلة 1 و 2) ---
function handleTrackerClick(evt) {
    
    // منع النقر إذا لم يكن العنصر المستهدف هو العنوان النشط
    if (stage === 1 && evt.currentTarget.id !== 'clickTracker2') return;
    if (stage === 2 && evt.currentTarget.id !== 'clickTracker1') return;
    
    birthday.onClick(evt);
    
    tapCount++;

    if (stage === 1) {
        const required = 5;
        const remaining = required - tapCount;
        
        clickTracker2.textContent = `TAP HERE ${remaining} TIMES`;

        if (tapCount === required) {
            // الانتقال للمرحلة الثانية
            stage = 2;
            tapCount = 0; 
            
            clickTracker2.classList.add('hidden');
            pageTitle.classList.remove('hidden'); // إظهار العنوان الرئيسي
            clickTracker1.classList.remove('hidden');
            clickTracker1.textContent = 'tap here 3 times';
            
            clickTracker2.style.pointerEvents = 'none';
            clickTracker1.style.pointerEvents = 'auto';
        }
    } else if (stage === 2) {
        const required = 3;
        const remaining = required - tapCount;
        
        clickTracker1.textContent = `tap here ${remaining} times`;

        if (tapCount === required) {
            // الانتقال للمرحلة الثالثة
            stage = 3;
            
            pageTitle.classList.add('hidden');
            clickTracker1.classList.add('hidden');
            
            toggleButton.classList.remove('hidden');
            toggleButton.textContent = 'click here now';
        }
    }
}

// --- وظيفة إخفاء الزر وبدء القصة (المرحلة 3) ---
function handleFinalButtonClick(evt) {
    // 1. تشغيل الألعاب النارية
    birthday.onClick(evt);
    
    // 2. إخفاء الزر
    toggleButton.classList.add('hidden');
    
    // 3. بدء تأثير الطباعة للقصة
    startTypingEffect(STORY_TEXT);
    
    // إزالة مستمع الحدث بعد النقر الأول لضمان عمله مرة واحدة فقط
    toggleButton.removeEventListener('click', handleFinalButtonClick);
}


// --- وظيفة إخفاء جميع عناصر القصة ---
function hideAllStoryElements() {
    // إخفاء حاوية القصة بالكامل (بما في ذلك الرسالة والعد التنازلي)
    storyContainer.classList.add('hidden');
    storyContainer.style.pointerEvents = 'none'; 
}


// --- وظيفة العد التنازلي ---
function startCountdown() {
    let count = 10;
    
    // إخفاء نص القصة والسؤال بمجرد بدء العد
    storyTextElement.classList.add('hidden');
    
    const countdownInterval = setInterval(() => {
        
        if (count >= 0) {
            // عرض الرقم الحالي في نفس عنصر الرسالة (للحفاظ على التنسيق والموقع)
            messageElement.textContent = count;
        }
        
        if (count < 0) {
            clearInterval(countdownInterval);
            
            // 1. إخفاء جميع العناصر المكتوبة بالكامل
            hideAllStoryElements();
            
            // 2. بدء المرحلة الجديدة (المرحلة الانتقالية/4)
            startTransitionStage(); 
        }
        
        count--;
        
    }, 1000);
}


// --- وظيفة التحقق من الإجابة (المرحلة 3) ---
function checkAnswer() {
    const userAnswer = answerInput.value.trim();
    
    const isCorrect = ACCEPTED_ANSWERS_STAGE_1.some(accepted => 
        accepted === userAnswer
    );

    if (isCorrect) {
        messageElement.textContent = "BRAVOO ,wlh hak tala3t'ha \n taw najmou nebdew";
        messageElement.style.color = '#00ff00';
        
        // إخفاء حقل الإدخال والزر
        answerInput.classList.add('hidden');
        checkButton.classList.add('hidden');
        answerInput.style.pointerEvents = 'none';
        checkButton.style.pointerEvents = 'none';

        // البدء بالعد التنازلي بعد 3 ثوانٍ
        setTimeout(startCountdown, 3000);
        
    } else {
        messageElement.textContent ="khamem mariem win tnjm tal9a el theweni w el d9aye9 w el sweye3...";
        messageElement.style.color = '#ff0000';
    }
}


// --- وظيفة بدء المرحلة الانتقالية / المرحلة 4 الفعلية ---
function startTransitionStage() {
    stage = 4;
    
    // إظهار العناصر ذات الصلة
    stageTitle2.classList.remove('hidden');
    cipherContainer.classList.remove('hidden');
    
    // إخفاء العناصر غير المطلوبة في هذه المرحلة
    cipherImage.classList.add('hidden');
    
    // إعادة تعيين حقل الإجابة
    cipherAnswerInput.value = '';
    cipherMessage.textContent = '';
    
    // بدء تأثير الطباعة للنص الجديد
    startTypingEffectStage2(TRANSITION_TEXT);
}

// --- وظيفة التحقق من إجابة المرحلة الجديدة (المرحلة 4) ---
function checkAnswerStage2() {
    const userAnswer = cipherAnswerInput.value.trim();
    
    const isCorrect = ACCEPTED_ANSWERS_STAGE_2.some(accepted => 
        accepted === userAnswer
    );

    if (isCorrect) {
        cipherMessage.textContent = "behi brcha , net3adew..";
        cipherMessage.style.color = '#00ff00';
        
        // إخفاء عناصر المرحلة 4 
        cipherContainer.classList.add('hidden');
        stageTitle2.classList.add('hidden');
        
        // البدء بالمرحلة 5 بعد 3 ثوانٍ
        setTimeout(startStage5, 3000); 
        
    } else {
        cipherMessage.textContent ="kelma t3awdet 3 marrat , ektebha kima tl9aha...";
        cipherMessage.style.color = '#ff0000';
    }
}

// --- وظيفة بدء المرحلة 5 الجديدة ---
function startStage5() {
    stage = 5;
    
    // إظهار عناصر المرحلة 5 ذات الصلة
    stageTitle3.classList.remove('hidden');
    dateContainer.classList.remove('hidden');
    
    // إخفاء العناصر غير المطلوبة في هذه المرحلة
    dateAnswerInput.value = '';
    dateMessage.textContent = '';
    
    // بدء تأثير الطباعة للنص الجديد
    startTypingEffectStage3(DATE_STORY_TEXT);
}


// --- وظيفة التحقق من إجابة المرحلة 5 الجديدة ---
function checkAnswerStage5() {
    const userAnswer = dateAnswerInput.value.trim().toLowerCase(); // تحويل إلى أحرف صغيرة لتسهيل التحقق
    
    const isCorrect = ACCEPTED_ANSWERS_STAGE_3.some(accepted => 
        accepted === userAnswer
    );

    if (isCorrect) {
        dateMessage.textContent = " sa7it , choft el story mte3i ?...";
        dateMessage.style.color = '#00ff00';
        
        // هنا يمكنك إضافة دالة للمرحلة التالية 
        // setTimeout(startNextStage, 3000); 
        
    } else {
        dateMessage.textContent =" taw hedhi me tala3t'hech ? 11 decembre 2005 b ema nhar jee ? ( en francais ) ...";
        dateMessage.style.color = '#ff0000';
    }
}


// --- تعيين مستمعي الأحداث ---
clickTracker2.addEventListener('click', handleTrackerClick);
clickTracker1.addEventListener('click', handleTrackerClick);
toggleButton.addEventListener('click', handleFinalButtonClick);

// مستمع أحداث المرحلة 3
checkButton.addEventListener('click', checkAnswer);
answerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

// مستمع أحداث المرحلة 4 (الانتقالية)
cipherCheckButton.addEventListener('click', checkAnswerStage2);
cipherAnswerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        checkAnswerStage2();
    }
});

// مستمع أحداث المرحلة 5 الجديدة
dateCheckButton.addEventListener('click', checkAnswerStage5);
dateAnswerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        checkAnswerStage5();
    }
});


  ;(function loop(){
  	requestAnimationFrame(loop)

  	let now = timestamp()
  	let delta = now - then

    then = now
    birthday.update(delta / 1000)

  })()
