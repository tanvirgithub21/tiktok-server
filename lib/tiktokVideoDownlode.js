export const tiktokVideoDownlode = async (req, res) => {
  const { url } = req?.body || {};

  let failed = 0;
  let success = 0;

  if (url) {
    const regex = /https:\/\/www\.tiktok\.com\/@[^/]+\/video\/\d+/g;


    const validLinks = url?.split("https://");

    console.log(validLinks)

    if (validLinks) {
      try {
        const data = await Promise.all(
          validLinks.map(async (singleUrl, index) => {
            await new Promise((resolve) => setTimeout(resolve, index * 1500));

            let domain = "https://www.tikwm.com/";
            let apiUrl = domain + "api/";
            let params = new URLSearchParams({
              url: singleUrl,
              count: 12,
              cursor: 0,
              web: 1,
              hd: 1,
            });
            console.log(apiUrl + "?" + params.toString())
            const res = await fetch("https://www.tikwm.com/api/?url=https://www.tiktok.com/@reinita_4/video/7152672969037237547&count=12&cursor=0&web=1&hd=1", {
              method: "POST",
              headers: {
                accept: "application/json, text/javascript, */*; q=0.01",
                "content-type":
                  "application/x-www-form-urlencoded; charset=UTF-8",
                // 'cookie': 'current_language=en; _ga=GA1.1.115940210.1660795490; _gcl_au=1.1.669324151.1660795490; _ga_5370HT04Z3=GS1.1.1660795489.1.1.1660795513.0.0.0',
                "sec-ch-ua":
                  '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
                "user-agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
              },
            });
            
            if (!res.ok) {
              return;
            }
            console.log("clg")
            const responseData = await res.json();

            if (responseData.msg != "success") {
              return;
            }

            return {
              video: domain + responseData?.data?.play,
              wm: domain + responseData?.data?.wmplay,
              music: domain + responseData?.data?.music,
              cover: domain + responseData?.data?.cover,
            };
          })
        );

        failed = 0;
        success = 0;

        const filteredData = data?.filter((item) => {
          if (item !== undefined) {
            success = success + 1;
            return item;
          } else failed = failed + 1;
        });
        res.json({
          success: true,
          videoCount: success,
          failed,
          data: filteredData,
        });
      } catch (error) {
        console.error("Fetch Error:", error);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Link not found",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Link not found",
    });
  }
};
