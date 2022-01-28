const axios = require('axios')
const cron = require('node-cron')

const postMsg = data => {
    const url = '' // url webhook disocrd
    axios.post(url, data)
        .then(res => {
            console.log(`${new Date().toLocaleString('th-TH')} => ${data.embeds[0].title}`)
        })
        .catch(error => console.log(error))
}

const sendMsg = (title, teacher) => {
    const data = {
        content: '<@&826793795273097237>',
        embeds: [{ color: 9699539, }]
    }

    const embed = data.embeds[0]
    if (title && teacher) {             // แจ้งเวลาเรียน
        Object.assign(embed, {
            title: `วิชา ${title}`,
            description: teacher
        })
    } else if (title && !teacher) {     // มีเรียน
        Object.assign(embed, {
            title: `วันนี้มีเรียนหวะ`,
            description: title
        })
    } else if (!title && !teacher) {    // ไม่มีเรียน
        Object.assign(embed, {
            title: `วันนี้ไม่มีเรียนเด้อออ`
        })
    }
    return postMsg(data)
}

const schedules = {
    MON: [
        { time: '09:00', title: 'Seminar in Computer Science', teacher: '' },
        { time: '13:00', title: 'Human-Computer Interaction', teacher: '' },
        { time: '17:00', title: 'Preparation for Professional Experience in Computer Science', teacher: '' }
    ],
    TUE: [
        { time: '13:00', title: 'Data Mining', teacher: '' }
    ],
    WED: [
        { time: '09:00', title: 'Application of Software for Modern Offices', teacher: '' },
        { time: '13:00', title: 'Mobile Application Development', teacher: '' },
        { time: '17:00', title: 'Computer Science Project 1', teacher: '' }
    ],
    FRI: [
        { time: '13:00', title: 'Artificial Intelligence', teacher: '' }
    ]
}

const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

days.forEach(day => {
    if (Object.keys(schedules).includes(day)) {
        const scdDay = schedules[day]
        const titles = []
        scdDay.forEach(scd => {
            titles.push(`${scd.time} | ${scd.title}`)
        })
        scdDay.push({
            time: '00:00', title: titles.join('\n')
        })
    } else {
        schedules[day] = [
            { time: '00:00' }
        ]
    }
})

const strTime = time => time.split(':').map(x => +x)

Object.keys(schedules).forEach(day => {
    schedules[day].forEach(scd => {
        const [hour, minute] = strTime(scd.time)
        cron.schedule(`${minute} ${hour} * * ${day}`, () => {
            sendMsg(scd.title, scd.teacher)
        })
    })
})
