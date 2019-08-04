/**
 *  TransCode	是	string	请求码 ：030111表示获取今日内容，030112 表示获取一周内容
	OpenId		是	string	固定值 123456789
	请求方式： POST
 * */
const url = "https://api.hibai.cn/api/index/index";
const data = {
	TransCode: "030112",
	OpenId: "123456789",
};
let oneData = [];
//遍历参数放入到fromData
for (let key in data) {
	let temp = `${key}=${data[key]}`
	oneData.push(temp);
}
console.log(oneData)

function getOneData() {
	let element = document.querySelector(".one-scroll");
	fetch(url, {
		method: "POST",
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: oneData.join("&")
	}).then(function(res) {
		if (res.ok) {
			return res.json()
		}
	}).then(function(res) {
		if (res.ResultCode == 1) {
			let tempHtml = '<div class="one-text mui-card-content-inner">由于我能力有限，暂时只能显示最近一周的图文</div>';
			for (let i = 0; i < res.Body.length; i++) {
				let temp = res.Body[i];
				let time = temp.date.split(" ")[0].split("-").join("/");
				tempHtml +=
					`<a href="javascript:void(0);">
								<div class="mui-card">
									<!--页眉，放置标题-->
									<div class="mui-card-header one-card-header">
										<time>${time}</time>
										<span>${temp.vol}</span>
									</div>
									<!--内容区-->
									<div class="mui-card-content">
										<img src=${temp.img_url}>
									</div>
									<!--页脚，放置补充信息或支持的操作-->
									<div class="mui-card-media mui-text-center one-item-info">
										<p>${temp.img_kind}|${temp.img_author}</p>
										<p>${temp.word}</p>
										<h2>${temp.word_from}</h2>
										<p class="save">
											<!--<span class="save-tip">保存</span> -->
											<i class="mui-icon mui-icon-paperplane save-icon"></i>
										</p>
									</div>
								</div>
							</a>`
			}
			element.innerHTML = tempHtml;
		} else {
			element.innerHTML=`<div class="mui-card">信息获取失败</div>`
		}
	}).catch(function(e) {
		console.log(e)
	});
}
window.onload = function() {
	getOneData()
}