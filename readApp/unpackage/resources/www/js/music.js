/* 
	id:2809513713（欧美飙升榜） 19723756（云音乐飙升榜）3778678（云音乐热歌榜）2250011882（抖音排行榜）71384707（云音乐古典音乐榜）
	baseUrl=c
*/
let id = 2809513713;
let type = "playlist"
fetch(`https://api.fczbl.vip/163/?type=${type}&id=${id}`).then(function(res) {
	if (res.ok) {
		return res.json()
	}
}).then(function(res) {
	let element = document.querySelector(".music-view")
	let htmlStr = '';
	if (res) {
		for (let i = 0; i < res.length; i++) {
			let item = res[i];
			htmlStr +=
				`<li class="mui-table-view-cell mui-media" dataMusic=${item.url}>
							<img class="mui-media-object mui-pull-left puase" src=${item.cover}>
							<img class="mui-media-object mui-pull-left play" src="../images/yuantiao.jpg">
							<div class="mui-media-body">
								${item.name}
								<p class="mui-ellipsis">${item.artist}-${item.name}</p>
							</div>
					</li>`
		}
		element.innerHTML = htmlStr;
		let ap = new APlayer({
			container: document.querySelector(".music-control"),
			audio: [{
				name: res[0].name,
				artist: res[0].artist,
				url: res[0].url,
				cover: res[0].cover
			}]
		});
		let flag = true;
		mui(".music-control").on("tap", "div.aplayer-pic", function(e) {
			// 清理当前列表的歌曲
			ap.list.clear();
			// 将请求的数据放在播放列表里
			ap.list.add(res);
			if (flag) {
				ap.play();
				flag = !flag;
			} else {
				ap.pause();
				flag = !flag;
			}
		});
		mui(".music-view").on("tap", "li", function(e) {
			let index;
			for (let i = 0; i < mui(".music-view li").length; i++) {
				let element = mui(".music-view li")[i];
				if (element === this) {
					index = i;
				}
			}
			// 清理当前列表的歌曲
			ap.list.clear();
			// 将请求的数据放在播放列表里
			ap.list.add(res);
			// 切换到点击的那一条音乐
			ap.list.switch(index);
			// 播放音乐
			ap.play();
		})
	}
})
