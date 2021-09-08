const start = document.querySelector('.start') //элемент для запуска игры
const move_section = document.querySelector('.move_section')
const score = document.querySelector('.score') //элемент для выведения очков игры
const track = document.querySelector('.track') //игровое поле
const car = document.createElement('div') //создаем новый элемент с авто
car.classList.add('car') //добавляем класс car

var left = document.querySelector('#button_left')
var up = document.querySelector('#button_up')
var down = document.querySelector('#button_down')
var right = document.querySelector('#button_right')

const keys = {
    // создаем коллекцию используемых клавиш и присваиваем им значение отключено
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false,
    Enter: false,
}

const setting = {
    // коллекция настроек игры
    start: false,
    score: 0,
    speed: 6,
    traffic: 3,
    x: 0,
    y: 0,
}

const enemyBackground = [
    // колекция скинов для машин enemy
    'enemy.png',
    'enemy2.png',
    'enemy3.png',
    'enemy4.png',
]

function getQuantityElements(heightElement) {
    // Расчитываем кол-во элементов на дорогу: высоту окна делим на высоту элемента и + 1
    return track.clientHeight / heightElement
}

function generateEnemySkin(enemy) {
    // Генерация случайных скинов для машин
    let randNumber = Math.round(Math.random() * (enemyBackground.length - 1))
    return (enemy.style.background =
        'transparent url("./img/' +
        enemyBackground[randNumber] +
        '") 50% 50% / cover no-repeat')
}

function startGame() {
    start.classList.add('hide') // прячем кнопку старта
    track.innerHTML = ''
    move_section.classList.remove('hide')

    // Линии на дороге
    for (let i = 0; i < getQuantityElements(100); i++) {
        const line = document.createElement('div') //создаем новый элемент
        line.classList.add('line') //добавляем ему класс
        line.style.top = i * 100 + 'px' //задаем отступ сверху
        line.y = i * 100
        track.appendChild(line) //  добавляем элемент в игровую область
    }

    //Машины врагов
    for (let i = 1; i < getQuantityElements(50 * setting.traffic); i++) {
        const enemy = document.createElement('div')
        enemy.classList.add('enemy')
        enemy.y = -100 * setting.traffic * i
        enemy.style.top = enemy.y + 'px'
        enemy.style.left =
            Math.floor(Math.random() * (track.offsetWidth - 50)) + 'px'
        generateEnemySkin(enemy)
        track.appendChild(enemy)
    }

    setting.start = true
    setting.score = 0
    setting.speed = 6

    track.appendChild(car)

    car.style.background =
        'transparent url("./img/car.png") 50% 50% / cover no-repeat'
    car.style.top = ''
    car.style.bottom = '25px'
    car.style.left = track.offsetWidth / 2 - car.offsetWidth / 2 + 'px'
    setting.x = car.offsetLeft
    setting.y = car.offsetTop

    playGame()
}

function playGame() {
    if (setting.start) {
        setting.score += setting.speed
        score.textContent = setting.score

        moveRoad()
        moveEnemies()

        if (keys.ArrowLeft && setting.x > 0) setting.x -= setting.speed
        if (keys.ArrowRight && setting.x < track.offsetWidth - car.offsetWidth)
            setting.x += setting.speed
        if (keys.ArrowUp && setting.y > 0) setting.y -= setting.speed
        if (keys.ArrowDown && setting.y < track.offsetHeight - car.offsetHeight)
            setting.y += setting.speed

        //
        car.style.left = setting.x + 'px' // передаем значение в стили автомобиля
        car.style.top = setting.y + 'px'

        //
        if (setting.score % 2000 <= 10) {
            setting.speed++
        }

        requestAnimationFrame(playGame)
    }
}

function moveRoad() {
    let lines = document.querySelectorAll('.line')
    lines.forEach(function(line) {
        // Перебираем все элементы
        line.y += setting.speed // добавляем скорость движения линииям
        line.style.top = line.y + 'px' // меняем расположение по вертикали
        if (line.y >= track.clientHeight) {
            // убираем элементы за вверхний край дороги
            line.y = -100
        }
    })
}

function moveEnemies() {
    let enemies = document.querySelectorAll('.enemy')
    enemies.forEach((enemy) => {
        let carRect = car.getBoundingClientRect() //объекы с 8-ми свойствами:
        let enemyRect = enemy.getBoundingClientRect() //left, top, right, bottom, x, y, width, height
        if (
            carRect.top <= enemyRect.bottom &&
            carRect.bottom >= enemyRect.top &&
            carRect.left <= enemyRect.right &&
            carRect.right >= enemyRect.left
        ) {
            setting.start = false
            start.classList.remove('hide')
            move_section.classList.add('hide')
            saveScore()
        }

        enemy.y += setting.speed / 1.5 // меняем скорость что бы не казалось что они стоят на месте
        enemy.style.top = enemy.y + 'px'

        if (enemy.y >= track.clientHeight) {
            enemy.y = -100 * setting.traffic
            enemy.style.left =
                Math.floor(Math.random() * (track.offsetWidth - 50)) + 'px' // добавляем RND для расстановки авто по горизонтали
            generateEnemySkin(enemy)
        }
    })
}

function startMove(event) {
    event.preventDefault()
    keys[event.key] = true
}

function stopMove(event) {
    event.preventDefault()
    keys[event.key] = false
}

function saveScore() {
    prompt(`Вы набрали ${setting.score} очков, оставьте Ваше имя`)
}

start.addEventListener('click', startGame)
document.addEventListener('keydown', startMove)
document.addEventListener('keyup', stopMove)

left.addEventListener('mousedown', function() {
    if (setting.x > 0) setting.x -= setting.speed
})