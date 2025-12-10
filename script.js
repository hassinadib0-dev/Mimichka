// helper functions
const PI2 = Math.PI * 2
const random = (min, max) => Math.random() * (max - min + 1) + min | 0
const timestamp = _ => new Date().getTime()

// container
class Birthday {
// ... (Birthday class methods remain unchanged)
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

// Firework class remains unchanged
class Firework {
// ... (Constructor and update methods remain unchanged)
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

// العناصر
const pageTitle = document.getElementById('pageTitle');
const clickTracker1 = document.getElementById('clickTracker1'); 
const clickTracker2 = document.getElementById('clickTracker2'); 
const toggleButton = document.getElementById('toggleButton');

let stage = 1;
let tapCount = 0; 

// إعداد الحالة الأولية
clickTracker2.textContent = 'TAP HERE 5 TIMES';
clickTracker2.style.pointerEvents = 'auto';


// --- وظيفة معالجة النقر على العناوين ---
function handleTrackerClick(evt) {
    
    // منع النقر إذا لم يكن العنصر المستهدف هو العنوان النشط
    if (stage === 1 && evt.currentTarget.id !== 'clickTracker2') return;
    if (stage === 2 && evt.currentTarget.id !== 'clickTracker1') return;
    
    // 1. تشغيل الألعاب النارية في موقع النقر
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
            
            // 1. إخفاء clickTracker2
            clickTracker2.classList.add('hidden');
            // 2. إظهار العنوان الرئيسي و clickTracker1
            pageTitle.classList.remove('hidden');
            clickTracker1.classList.remove('hidden');
            clickTracker1.textContent = 'tap here 3 times';
            
            // 3. جعل clickTracker1 قابلاً للنقر، وإلغاء clickTracker2
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
            
            // 1. إخفاء كل من العنوان الرئيسي و clickTracker1
            
            clickTracker1.classList.add('hidden');
            
            // 2. إظهار الزر المخفي مع النص المطلوب وجعله قابلاً للنقر
            toggleButton.classList.remove('hidden');
            toggleButton.textContent = 'click here now';
            // إزالة pointerEvents من هنا ليعتمد على CSS (والذي أصبح pointer: auto)
        }
    }
}

// --- وظيفة إخفاء الزر عند النقر عليه ---
function handleFinalButtonClick(evt) {
    // 1. تشغيل الألعاب النارية
    birthday.onClick(evt);
    
    // 2. إخفاء الزر بعد النقر عليه مرة واحدة
    toggleButton.classList.add('hidden');
  pageTitle.classList.add('hidden');
}

// --- تعيين مستمعي الأحداث للعناوين والزر النهائي ---

// نقرات المراحل 1 و 2
clickTracker2.addEventListener('click', handleTrackerClick);
clickTracker1.addEventListener('click', handleTrackerClick);

// نقرة المرحلة النهائية (على الزر نفسه)
toggleButton.addEventListener('click', handleFinalButtonClick);


  ;(function loop(){
  	requestAnimationFrame(loop)

  	let now = timestamp()
  	let delta = now - then

    then = now
    birthday.update(delta / 1000)

  })()
