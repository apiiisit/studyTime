const axios = require('axios')
const cron = require('node-cron')

const postMsg = data => {
    const url = 'https://discord.com/api/webhooks/889810261605752863/a62GCMrZL3Fe0HdZgeCwdfheuvVTAVA039vF3dOcgHI6nC5Yvt5vHDeCv-fU9BzkNvh8'
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
        { time: '09:00', title: 'Seminar in Computer Science', teacher: 'นายวรพันธ์ สาระสุรีย์ภรณ์' },
        { time: '13:00', title: 'Human-Computer Interaction', teacher: 'ผู้ช่วยศาสตราจารย์ ดร.จุฬาลักษณ์ วัฒนานนท์' },
        { time: '17:00', title: 'Preparation for Professional Experience in Computer Science', teacher: 'นางสาวสิริณา ช่วยเต็ม' }
    ],
    TUE: [
        { time: '13:00', title: 'Data Mining', teacher: 'ผู้ช่วยศาสตราจารย์ ดร.อุไรวรรณ อินทร์แหยม' }
    ],
    WED: [
        { time: '09:00', title: 'Application of Software for Modern Offices', teacher: 'นางสาวสิริณา ช่วยเต็ม' },
        { time: '13:00', title: 'Mobile Application Development', teacher: 'ผู้ช่วยศาสตราจารย์ปองพล นิลพฤกษ์' },
        { time: '17:00', title: 'Computer Science Project 1', teacher: 'นางสาวปิยนันท์ เทียบศรไชย' }
    ],
    FRI: [
        { time: '13:00', title: 'Artificial Intelligence', teacher: 'นายวรพันธ์ สาระสุรีย์ภรณ์' }
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
