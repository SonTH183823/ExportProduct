const arr = []
const dm = 'https://shopee.vn/product/'

    function getLink() {
        const links = []
        arr.forEach((item, index) => {
            if(index && index % 100 === 0) {
                links.push('')
                links.push('')
                links.push('')
                links.push('')
                links.push('')
            }
            links.push(dm + item.shop_id + "/" + item.item_id)
        })
        return links
    }

    function downloadLink(link) {
        const now = new Date();
        const formattedDate = now.toLocaleString('vi-VN');
        const data = link.join('\n');
        const file = new Blob([data], {type: 'text/plain'});
        const url = window.URL.createObjectURL(file);
        const b = document.createElement("a");
        b.style.display = "none";
        b.href = url;
        b.setAttribute("download", `ListSp_${formattedDate}.txt`);
        b.download = `ListSp_${formattedDate}.txt`;
        document.body.appendChild(b);
        b.click();
        window.URL.revokeObjectURL(url);
    }

    downloadLink(getLink())
