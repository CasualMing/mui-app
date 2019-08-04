/**
 *  cat:	    string 指定source 为「0」时的分类	任意分类  /a	Anime - 动画、b	Comic - 漫画、c	Game - 游戏、d	Novel - 小说、e	原创、f	来自网络、g	其他、
	charset:	string 返回字符集，支持 gbk/utf-8	utf-8
	length:	int 返回一句话的长度限制，超出则打断并添加省略号	不限制
	encode:	string 返回数据格式	json
	fun:	    string 异步调用时，指定 CallBack 的函数名	无
	source:	int 值为 0 获取「系统收录」，为 1 获取「我的一言」为空则随机选择
 * */
let baseUrl = "https://api.imjad.cn/hitokoto/";
var config = {
	cat: "e",
	charset: "utf-8",
	length: "1000000000000000000000000000000000",
	encode: "json",
	fun: "",
	source: "",
}
let url = '';
for (let key in config) {
	url += `&${key}=${config[key]}`
}
url = baseUrl + '?' + url.slice(1);

function getOneTalkData() {
	let element = document.querySelector(".one-talk");
	// console.log(config.formData())
	fetch(url, {
		method: "get",
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		// body: oneData.join("&")
	}).then(function(res) {
		if (res.ok) {
			return res.json()
		}
	}).then(function(res) {
		if (res) {
			let time = res.date.split(" ")[0].split(".").join("-")
			let tempHtml =
				`<h4 class="talk-title">
								<span>主题：${res.catname}</span>
								<time>收录时间：${time}</time>
							</h4>
							<img src="https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture" class="talk-cover">
							<p class="talk-cover-anchor">摄影|来源必应</p>
							<p>${res.source}</p>
							<p class="talk-content">${res.hitokoto}</p>
							<h2 class="talk-anchor">作者：${res.author}</h2>`;
			element.innerHTML = tempHtml;
		} else {
			element.innerHTML = `<div class="mui-card">信息获取失败</div>`
		}
	}).catch(function(e) {
		console.log(e)
	});
}


/*
baseurl  https://api.apiopen.top/getImages
page	起始的页数
count	请求的具体数量
*/
const imageBaseUrl = "https://api.pexels.com/v1/curated";
let imgConfig = {
	per_page: 15, // 每页请求的图片数量
	page: 0 // 请求的页数
}
let imageUrl = '';
for (let key in imgConfig) {
	imageUrl += `&${key}=${imgConfig[key]}`
}
imageUrl = imageBaseUrl + "?" + imageUrl.slice(1);

function getImgs() {
	const element = document.querySelector(".talk-imgs");
	console.log(imageUrl)
	fetch(imageUrl, {
		headers: {
			'Authorization': "563492ad6f91700001000001d122a5c948fa4e7891e05b4f2a6e4685"
		}
	}).then(function(res) {
		if (res.ok) {
			return res.json()
		}
	}).then(function(res) {
		let tempArr = [];
		let tempHtml = ``;
		if (res.photos) {
			res.photos.map(item => {
				let imgItemInfo = {
					width: item.width,
					height: item.height,
					src: item.src.landscape,
					originalSizeSrc: item.src.original,
					mobileSizeSrc: item.src.large2x,
					author: item.photographer,
					imgId: item.id,
				};
				tempArr.push(imgItemInfo);
			});
			tempArr.map(item => {
				let imgAuthor;
				if (item.author.indexOf(" ") == -1) {
					imgAuthor = item.author
				} else {
					imgAuthor = item.author.replace(/\s+/g, "·");
				}
				tempHtml +=
					`<div class="talk-item mui-card mui-text-center photo-item">
								<img  dataWidth=${item.width} dataHeight=${item.height} author=${imgAuthor} src=${item.src} id=${item.imgId} originalSizeSrc=${item.originalSizeSrc} mobileSizeSrc=${item.mobileSizeSrc}>
								<h2 class="talk-anchor">摄影师-${imgAuthor}</h2>
							</div>`
			});
			element.innerHTML = tempHtml;
		} else {
			element.innerHTML = `<div class="mui-card">信息获取失败</div>`
		}
	}).catch(function(e) {
		console.log(e)
	});
}

window.onload = function() {
	getOneTalkData();
	getImgs();
}
var picker = new muin.PopPicker();

function getSize(value) {
	let strArr = value.split("&");
	let endStr = {};
	for (let i = 0; i < strArr.length; i++) {
		strArr[i]
		if (strArr[i].includes("w=")) {
			endStr.width = strArr[i].split("=")[1];
		} else if (strArr[i].includes("h=")) {
			endStr.height = strArr[i].split("=")[1];
		}
	}
	return endStr;
}
mui(".talk-imgs").on("click", "img", function() {
	let that = this;
	picker.setData([{
		value: 0,
		text: `原画-宽：${that.getAttribute("dataWidth")},高：${that.getAttribute("dataHeight")}`,
	}, {
		value: 1,
		text: `中-宽：${getSize(that.getAttribute("mobilesizesrc")).width},高：${getSize(that.getAttribute("mobilesizesrc")).height}`,
	}, {
		value: 2,
		text: `大-宽：${getSize(that.getAttribute("src")).width},高：${getSize(that.getAttribute("src")).height}`,
	}])
	picker.show(function(item) { //弹出列表并在里面写业务代码
		var itemCallback = picker.getSelectedItems();
		console.log(itemCallback);
		let downUrl;
		switch (itemCallback[0].value) {
			case 0:
				downUrl = that.getAttribute("originalSizeSrc");
				break;
			case 1:
				downUrl = that.getAttribute("mobileSizeSrc");
				break;
			case 2:
				downUrl = that.getAttribute("src");
				break;
		}
		if (downUrl) {
			// console.log(saveAs)
			let time = new Date().toLocaleDateString().split("/").join("-");
			let timeStr = new Date().getTime();
			console.log(time, timeStr)
			saveAs(downUrl, "无心阅读" + time + timeStr + ".jpg");
		} else {
			return console.log("下载错误")
		}
	});
})
