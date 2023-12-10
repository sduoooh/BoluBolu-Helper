/*************************************************************************************************************************************************** */


let userID = 0
let banner_list = []
let ads = !!localStorage.getItem("ads") || true
let ban = !!localStorage.getItem("ban") || true



const idTarget = document.body
const idObserver = new MutationObserver(
    () => {
        userID = document.querySelector(".header-entry-mini")?.href.split('/')[3] || 0
        banner_list = localStorage.getItem(userID)?.split(',') || []
        ads = localStorage.getItem("ads") || true
        ban = localStorage.getItem("ban") || true
        console.log("初始化完毕，id : ", userID, ", 当前封禁列表： ", banner_list)
        idObserver.disconnect()
    }
)
const idConfig = { attributeFilter: [".right-entry"], childList: true }
idObserver.observe(idTarget, idConfig)


const btnTarget = document.body
const btnObserver = new MutationObserver(
    () => {
        let update = document.querySelector(".feed-roll-btn")?.querySelector("button")
        // let next = update.cloneNode(true)
        // let last = update.cloneNode(true)

        //document.querySelector(".feed-roll-btn").querySelector("button").querySelector("span").innerText = "更新"

        // next.querySelector("span").innerText = "下一页"
        // last.querySelector("span").innerText = "上一页"

        // next.style.marginTop = "1rem"
        // last.style.marginTop = "1rem"

        // document.querySelector(".feed-roll-btn").addEventListener("click", ()=> {
        //     console.log(cbHistory)
        // })
        update?.addEventListener("click", () => {
            handle()
            // memory();
            // backIndex = 0
        })
        // next.addEventListener("click", cbNext)
        // last.addEventListener("click", cbLast)

        // document.querySelector(".feed-roll-btn").appendChild(next)
        // document.querySelector(".feed-roll-btn").appendChild(last)
        btnObserver.disconnect()
    }
)
const btnConfig = { attributeFilter: [".feed-roll-btn button"], childList: true, subtree: true }
btnObserver.observe(btnTarget, btnConfig)


/**************************************************************************************************************************************************** */

// 精力有限，先不做回溯功能了，以后有空再说吧
console.log("精力有限，先不做回溯功能了，以后有空再说吧")

// let cbHistory = []
// let backIndex = 0
let lasted = null

// const cbNext = () => {
//     if (backIndex === 0){
//         return
//     }

//     console.log("当前回溯次数为： ", --backIndex)
//     replace(cbHistory[backIndex])
// }

// const cbLast = () => {
//     if (backIndex === cbHistory.length - 1){
//         return
//     }

//     console.log("当前回溯次数为： ", ++backIndex, " ,回溯次数剩余： ", cbHistory.length - backIndex - 1)
//     replace(cbHistory[backIndex])
// }

// // 把所有视频卡片替换为a
// const replace = (a) => {
//     let parent = document.querySelector(".container")
//     document.querySelectorAll(".feed-card").forEach((b, index) => {
//         parent.replaceChild(a[index], b)
//     })
//     exec()
// }

// const memory = () => {
//     let temp = []
//     document.querySelectorAll(".feed-card").forEach((a) => {
//         temp.push(document.importNode(a, true))
//     })
//     cbHistory.unshift(temp)
// }

/**************************************************************************************************************************************************** */

let timer = null

const check_ad = (a) => {
    return ban && !!a.querySelectorAll(".bili-video-card__info--ad").length || ads && !!a.querySelectorAll(".bili-video-card__info--creative-ad").length
}

const check_banned = (a) => {
    return ban && banner_list.includes(a.querySelector(".bili-video-card__info--author").title)
}

const check = (a) => {
    if (check_ad(a)) {
        console.log("已拦截由 [ " + a.querySelector(".bili-video-card__info--author").title + " ] 投放的广告 < " + a.querySelector(".bili-video-card__info--tit").title + " >")
        return true
    } else if (check_banned(a)) {
        console.log("已拦截up主 [ " + a.querySelector(".bili-video-card__info--author").title + " ] 视频 < " + a.querySelector(".bili-video-card__info--tit").title + " >")
        return true
    }
    return false
}

const heal = (num, parent, clone, after) => {
    for (let i = 0; i < num; i++) {
        parent.insertBefore(clone[i], after)
    }
}


const exec = () => {
    let number = 0
    let parent = document.querySelector(".container")
    let after = document.querySelector(".floor-single-card")
    let clone = []

    document.querySelectorAll(".feed-card").forEach((a) => {
        if (check(a)) {
            console.log(a.querySelector(".bili-video-card__info--author").title, a,ban && !!a.querySelectorAll(".bili-video-card__info--ad").length, ads && !!a.querySelectorAll(".bili-video-card__info--creative-ad").length)
            number++
            a.style.visibility = "hidden"
            clone.push(a)
        }
    })
    console.log("结束")
    heal(number, parent, clone, after)
}

const handle = () => {
    const target = document.getElementsByClassName("container is-version8")[0]
    const callback = (mutationList, observer) => {
        if (mutationList.length > 20) {
            exec()
            observer.disconnect()
            return
        }
    }
    const observer = new MutationObserver(callback);
    const config = { attributeFilter: [".feed-card"], childList: true, subtree: true }
    observer.observe(target, config)
    console.log("已启动", observer)
}

handle()

oncontextmenu = (event) => {
    if (event.target.classList[0] === "bili-video-card__info--author") {
        if (banner_list.includes(event.target.title)) {
            console.warn("漏网之鱼！！！", event.target)
        } else {
            banner_list.push(event.target.title)
            exec()
            lasted = document.querySelector(".feed-card")

            localStorage.setItem(userID, banner_list.toString())
            console.log("封禁： ", event.target.title)
            console.log("当前封禁列表： ", banner_list)
        }
        event.preventDefault()
    }
}