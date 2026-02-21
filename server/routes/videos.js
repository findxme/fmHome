import express from 'express';
import axios from 'axios';

const router = express.Router();

// 搜索B站视频
router.get('/bilibili', async (req, res) => {
  try {
    const { keyword } = req.query;

    // B站搜索API (使用非官方API)
    const response = await axios.get(`https://api.bilibili.com/x/web-interface/search/type`, {
      params: {
        keyword: keyword,
        search_type: 'video',
        order: 'totalrank',
        duration: 2,
        limit: 10
      },
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const videos = response.data.data?.result?.map(item => ({
      title: item.title,
      author: item.author,
      bvid: item.bvid,
      pic: item.pic,
      duration: item.duration,
      play: item.play,
      description: item.description,
      url: `https://www.bilibili.com/video/${item.bvid}`
    })) || [];

    res.json({ success: true, data: videos });
  } catch (error) {
    // 如果API失败，返回模拟数据
    res.json({
      success: true,
      data: getMockVideos(req.query.keyword)
    });
  }
});

// 搜索YouTube视频
router.get('/youtube', async (req, res) => {
  try {
    const { keyword } = req.query;

    // 返回模拟数据（实际需要YouTube API Key）
    res.json({
      success: true,
      data: getMockVideos(keyword, 'youtube')
    });
  } catch (error) {
    res.json({
      success: true,
      data: getMockVideos(req.query.keyword, 'youtube')
    });
  }
});

// 获取菜谱相关视频推荐
router.get('/recipe/:dishName', (req, res) => {
  const { dishName } = req.params;
  const videos = [
    ...getMockVideos(`${dishName} 做法`),
    ...getMockVideos(`${dishName} 教程`)
  ];

  res.json({ success: true, data: videos.slice(0, 6) });
});

// 模拟视频数据
function getMockVideos(keyword, source = 'bilibili') {
  if (!keyword) return [];

  return [
    {
      title: `${keyword} 最正宗的做法`,
      author: '美食达人',
      pic: `https://via.placeholder.com/320x180?text=${encodeURIComponent(keyword)}`,
      duration: '10:30',
      play: '10万+',
      description: '详细讲解制作步骤',
      url: source === 'youtube'
        ? `https://www.youtube.com/results?search_query=${encodeURIComponent(keyword)}`
        : `https://www.bilibili.com/search?keyword=${encodeURIComponent(keyword)}`
    },
    {
      title: `新手必学 ${keyword}`,
      author: '厨房新手教程',
      pic: `https://via.placeholder.com/320x180?text=${encodeURIComponent(keyword)}`,
      duration: '8:45',
      play: '5万+',
      description: '简单易学',
      url: source === 'youtube'
        ? `https://www.youtube.com/results?search_query=${encodeURIComponent(keyword)}`
        : `https://www.bilibili.com/search?keyword=${encodeURIComponent(keyword)}`
    }
  ];
}

export default router;
