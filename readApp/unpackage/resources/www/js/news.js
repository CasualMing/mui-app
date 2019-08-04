window.onload = function() {
	document.querySelector(".news-view").setAttribute("id", "item1");
	getNews(1);
	mui(".news-tab").on("tap", "a", function() {
		document.querySelector(".news-view").setAttribute("id", this.getAttribute("href"));
		getNews(this.getAttribute("id"))
	})

	function getNews(id) {
		/*
		baseUrl:http://api.dagoogle.cn/news/nlist;
		get/post请求都可以
		cid		是	int	获取新闻类型(说明如下)
		page	否	int	当前页（从1开始）
		psize	否	int	每页显示数目(最大20)
		callback	否	string	如果要求jsonp请求，主添加回调函数
		*/
		fetchJsonp(`http://api.dagoogle.cn/news/nlist?cid=${id}&page=1&psize=20&callback=one`, {
			jsonpCallback: 'callback',
			mode: "no-cors",
		}).then(res => {
			if (res.ok) {
				return res.json();
			}
		}).then(res => {
			let element = document.querySelector(".news-tab-box");
			let htmlStr = "";
			if (res.data.total) {
				for (let i = 0; i < res.data.list.length; i++) {
					let item = res.data.list[i];
					htmlStr +=`<li class="mui-table-view-cell">
									<h2 class="news-item-title">${item.title}</h2>
									<input type="image" src=${item.headpic} />
									<span class="source">#${item.source}</span>
								</li>`
				}
			} else {
				htmlStr+=`<li class="mui-table-view-cell">
									<p>暂无数据</p>
							</li>`
			}


			element.innerHTML = htmlStr;
		}).catch(e => {
			console.log(e)
		})

	}
}
