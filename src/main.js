let $siteList = $(".siteList")
let $lastLi = $(".lastLi")
let siteStr = localStorage.getItem("site")
let siteObj = JSON.parse(siteStr)
//要多学习||后面是保底值
let hashMap = siteObj || [
    {logo: 'A', logType: 'text', url: 'https://www.acfun.cn'},
    {logo: 'B', logoType: 'image', url: 'https://www.bilibili.com'}
]
console.log(hashMap)

// 有了哈希表之后 ,就没有必要直接把内容写在html上, 可以用哈希表生成html

let simplifyUrl = (url) => {
    return url.replace("https://", "")
        .replace("http://")
        .replace("www.", "")
        .replace(/\/.*/, "/*")
}
let saveHash = (hashMap) => {
    let siteStr = JSON.stringify(hashMap)
    localStorage.setItem("site", siteStr)
    console.log("url已保存到localStorage")
}

let render = () => {
    $siteList.find("li:not(.lastLi)").remove()
    hashMap.forEach((site, index) => {
        // console.log(index)
        let simpleUrl = simplifyUrl(site.url)
        let $li = $(`<li>
            <div class="site">
                <div class="logo">${simpleUrl[0].toUpperCase()}</div>
                <div class="link">${simpleUrl}</div>
                <div class="delete">
                    <svg class="icon">
                        <use xlink:href="#icon-deleteX"></use>
                    </svg>
                </div>
            </div>
        </li>`).insertBefore($lastLi)
        $li.on("click", () => {
            window.open(site.url, "_self")
        })
        $li.on("click", ".delete", (e) => {
            //阻止冒泡
            e.stopPropagation()
            //删除
            hashMap.splice(index, 1)
            render()
            saveHash()
        })
    })
}

render()



$(".addButton")
    .on("click", () => {
        console.log(1)
        let url = window.prompt("输入你要添加的网址:")
        if (url.indexOf("http") !== 0) {
            url = "https://" + url
        }
        hashMap.push({
            'logo': simplifyUrl(url)[0],
            'logoType': 'text',
            'url': url
        })
        // console.log(hashMap)  
        render()

        //每次添加url，哈希表保存到localStorage
        saveHash(hashMap)
    })

//用户关闭页面之前保存localStorage    
 window.onbeforeunload = () => {
    saveHash(hashMap)
}   


//监听用户的键盘事件
$(document).on("keypress", (e) => {
    //e.key就是按下的按键 小写a b c ...

    //当变量名与对象的属性名相同的时候，let key = e.key可以简写如下，
    let {key} = e
    console.log(key)
    hashMap.forEach(site => {
        if(site.logo.toLocaleLowerCase() === key) {
            window.open(site.url, "_self")
        }
    })

})