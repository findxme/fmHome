import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { dishApi } from '@/api'

// 初始化示例菜品数据
const initSampleDishes = () => {
  const existing = localStorage.getItem('fmhome_sample_dishes')
  if (existing) {
    return JSON.parse(existing)
  }

  const sampleDishes = [
    {
      id: 'sample_1',
      name: '红烧肉',
      category: '午餐',
      difficulty: '中等',
      cooking_time: '45分钟',
      servings: '3-4人份',
      description: '肥而不腻，入口即化的经典家常菜',
      tags: '红烧,五花肉,家常菜',
      image_url: 'https://images.unsplash.com/photo-1623689046286-01c506123f26?w=400',
      images: ['https://images.unsplash.com/photo-1623689046286-01c506123f26?w=400'],
      rating: '4.8',
      isSample: true,
      ingredients: [
        { name: '五花肉', amount: '500g', category: '肉类' },
        { name: '冰糖', amount: '30g', category: '调料' },
        { name: '生抽', amount: '2勺', category: '调料' },
        { name: '老抽', amount: '1勺', category: '调料' },
        { name: '料酒', amount: '1勺', category: '调料' },
        { name: '八角', amount: '2个', category: '香料' },
        { name: '姜片', amount: '3片', category: '蔬菜' }
      ],
      steps: [
        { title: '焯水', description: '五花肉切块，冷水下锅加料酒焯水去腥' },
        { title: '炒糖色', description: '锅中放冰糖，小火炒至融化变成琥珀色' },
        { title: '红烧', description: '放入五花肉翻炒上色，加调料和水，小火炖40分钟' }
      ]
    },
    {
      id: 'sample_2',
      name: '番茄炒蛋',
      category: '午餐',
      difficulty: '简单',
      cooking_time: '15分钟',
      servings: '2人份',
      description: '酸甜可口，简单易做的家常快手菜',
      tags: '快手菜,番茄,鸡蛋',
      image_url: 'https://images.unsplash.com/photo-1482049016gy-87c7b0a0dce7?w=400',
      images: ['https://images.unsplash.com/photo-1482049016gy-87c7b0a0dce7?w=400'],
      rating: '4.9',
      isSample: true,
      ingredients: [
        { name: '番茄', amount: '2个', category: '蔬菜' },
        { name: '鸡蛋', amount: '3个', category: '蛋类' },
        { name: '盐', amount: '适量', category: '调料' },
        { name: '糖', amount: '少许', category: '调料' },
        { name: '葱花', amount: '适量', category: '蔬菜' }
      ],
      steps: [
        { title: '打蛋', description: '鸡蛋打散，加少许盐' },
        { title: '炒蛋', description: '油热后倒入鸡蛋，快速炒散盛出' },
        { title: '炒番茄', description: '番茄切块下锅炒出汁' },
        { title: '混合', description: '放入炒好的鸡蛋，加盐糖调味，翻炒均匀' }
      ]
    },
    {
      id: 'sample_3',
      name: '青椒土豆丝',
      category: '午餐',
      difficulty: '简单',
      cooking_time: '20分钟',
      servings: '2人份',
      description: '清爽脆口的下饭神器',
      tags: '快手菜,土豆,青椒',
      image_url: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=400',
      images: ['https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=400'],
      rating: '4.6',
      isSample: true,
      ingredients: [
        { name: '土豆', amount: '1个', category: '蔬菜' },
        { name: '青椒', amount: '1个', category: '蔬菜' },
        { name: '干辣椒', amount: '2个', category: '调料' },
        { name: '盐', amount: '适量', category: '调料' },
        { name: '醋', amount: '1勺', category: '调料' }
      ],
      steps: [
        { title: '切丝', description: '土豆、青椒切细丝，土豆丝泡水去淀粉' },
        { title: '焯水', description: '土豆丝开水焯10秒捞出' },
        { title: '爆炒', description: '干辣椒爆香，放入青椒土豆丝大火快炒' },
        { title: '调味', description: '加盐醋调味，翻炒均匀出锅' }
      ]
    },
    {
      id: 'sample_4',
      name: '可乐鸡翅',
      category: '晚餐',
      difficulty: '中等',
      cooking_time: '35分钟',
      servings: '3人份',
      description: '甜香软嫩，孩子最爱的美味',
      tags: '鸡翅,可乐,小朋友爱',
      image_url: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400',
      images: ['https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400'],
      rating: '4.7',
      isSample: true,
      ingredients: [
        { name: '鸡翅', amount: '500g', category: '禽类' },
        { name: '可乐', amount: '330ml', category: '饮料' },
        { name: '生抽', amount: '2勺', category: '调料' },
        { name: '老抽', amount: '1勺', category: '调料' },
        { name: '姜片', amount: '3片', category: '蔬菜' },
        { name: '葱段', amount: '2根', category: '蔬菜' }
      ],
      steps: [
        { title: '腌制', description: '鸡翅划刀，加姜片葱段腌制10分钟' },
        { title: '煎制', description: '鸡翅下锅煎至两面金黄' },
        { title: '焖煮', description: '倒入可乐和调料，大火烧开转小火焖20分钟' },
        { title: '收汁', description: '大火收汁至浓稠即可' }
      ]
    },
    {
      id: 'sample_5',
      name: '蒜蓉西兰花',
      category: '素菜',
      difficulty: '简单',
      cooking_time: '10分钟',
      servings: '2人份',
      description: '清脆爽口，营养丰富的健康素菜',
      tags: '素菜,快手菜,健康',
      image_url: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400',
      images: ['https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400'],
      rating: '4.5',
      isSample: true,
      ingredients: [
        { name: '西兰花', amount: '1颗', category: '蔬菜' },
        { name: '大蒜', amount: '4瓣', category: '蔬菜' },
        { name: '盐', amount: '适量', category: '调料' },
        { name: '蚝油', amount: '1勺', category: '调料' },
        { name: '食用油', amount: '适量', category: '调料' }
      ],
      steps: [
        { title: '处理', description: '西兰花切成小朵，用盐水浸泡洗净' },
        { title: '焯水', description: '开水加盐油，放入西兰花焯1分钟捞出' },
        { title: '炒蒜', description: '蒜末下锅爆香' },
        { title: '翻炒', description: '放入西兰花翻炒，加蚝油调味即可' }
      ]
    },
    {
      id: 'sample_6',
      name: '玉米排骨汤',
      category: '汤类',
      difficulty: '简单',
      cooking_time: '60分钟',
      servings: '4人份',
      description: '清甜滋补，老少皆宜的养生汤品',
      tags: '汤,排骨,养生',
      image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
      images: ['https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400'],
      rating: '4.8',
      isSample: true,
      ingredients: [
        { name: '排骨', amount: '500g', category: '肉类' },
        { name: '玉米', amount: '1根', category: '蔬菜' },
        { name: '胡萝卜', amount: '1根', category: '蔬菜' },
        { name: '姜片', amount: '3片', category: '蔬菜' },
        { name: '盐', amount: '适量', category: '调料' },
        { name: '料酒', amount: '1勺', category: '调料' }
      ],
      steps: [
        { title: '焯水', description: '排骨冷水下锅，加料酒姜片焯水去腥' },
        { title: '炖煮', description: '排骨放入砂锅，加足量水大火烧开' },
        { title: '加菜', description: '放入玉米胡萝卜，转小火炖40分钟' },
        { title: '调味', description: '加盐调味即可' }
      ]
    },
    {
      id: 'sample_7',
      name: '糖醋排骨',
      category: '午餐',
      difficulty: '中等',
      cooking_time: '40分钟',
      servings: '3人份',
      description: '酸甜可口，外酥里嫩',
      tags: '糖醋,排骨,酸甜',
      image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
      images: ['https://images.unsplash.com/photo-1544025162-d76694265947?w=400'],
      rating: '4.8',
      isSample: true,
      ingredients: [
        { name: '排骨', amount: '500g', category: '肉类' },
        { name: '糖', amount: '30g', category: '调料' },
        { name: '醋', amount: '3勺', category: '调料' },
        { name: '番茄酱', amount: '2勺', category: '调料' },
        { name: '生抽', amount: '1勺', category: '调料' },
        { name: '淀粉', amount: '适量', category: '调料' }
      ],
      steps: [
        { title: '腌制', description: '排骨加盐、料酒腌制20分钟' },
        { title: '炸制', description: '排骨裹淀粉下锅炸至金黄' },
        { title: '炒汁', description: '糖醋汁调好下锅炒至浓稠' },
        { title: '裹汁', description: '放入排骨翻炒均匀裹上糖醋汁' }
      ]
    },
    {
      id: 'sample_8',
      name: '宫保鸡丁',
      category: '午餐',
      difficulty: '中等',
      cooking_time: '25分钟',
      servings: '2人份',
      description: '麻辣鲜香，花生脆爽',
      tags: '川菜,鸡肉,花生',
      image_url: 'https://images.unsplash.com/photo-1525755662778-989d0524087?w=400',
      images: ['https://images.unsplash.com/photo-1525755662778-989d0524087?w=400'],
      rating: '4.7',
      isSample: true,
      ingredients: [
        { name: '鸡胸肉', amount: '300g', category: '禽类' },
        { name: '花生米', amount: '50g', category: '干货' },
        { name: '干辣椒', amount: '5个', category: '调料' },
        { name: '花椒', amount: '10粒', category: '调料' },
        { name: '豆瓣酱', amount: '1勺', category: '调料' },
        { name: '葱姜蒜', amount: '适量', category: '蔬菜' }
      ],
      steps: [
        { title: '切丁', description: '鸡肉切丁，加盐料酒淀粉腌制' },
        { title: '滑炒', description: '鸡丁滑炒至变色盛出' },
        { title: '炒料', description: '干辣椒花椒豆瓣酱炒香' },
        { title: '混合', description: '放入鸡丁和花生快速翻炒' }
      ]
    },
    {
      id: 'sample_9',
      name: '麻婆豆腐',
      category: '午餐',
      difficulty: '中等',
      cooking_time: '20分钟',
      servings: '2人份',
      description: '麻辣鲜香，豆腐嫩滑',
      tags: '川菜,豆腐,麻辣',
      image_url: 'https://images.unsplash.com/photo-1582452919408-53c12f8e0621?w=400',
      images: ['https://images.unsplash.com/photo-1582452919408-53c12f8e0621?w=400'],
      rating: '4.8',
      isSample: true,
      ingredients: [
        { name: '嫩豆腐', amount: '1块', category: '豆制品' },
        { name: '肉末', amount: '100g', category: '肉类' },
        { name: '郫县豆瓣酱', amount: '2勺', category: '调料' },
        { name: '花椒粉', amount: '1勺', category: '调料' },
        { name: '蒜末', amount: '适量', category: '蔬菜' },
        { name: '葱花', amount: '适量', category: '蔬菜' }
      ],
      steps: [
        { title: '切块', description: '豆腐切小块，用盐水焯一下' },
        { title: '炒肉', description: '肉末炒散，加豆瓣酱炒出红油' },
        { title: '烧豆腐', description: '加水放入豆腐烧几分钟' },
        { title: '勾芡', description: '水淀粉勾芡，撒花椒粉葱花' }
      ]
    },
    {
      id: 'sample_10',
      name: '酸辣土豆丝',
      category: '午餐',
      difficulty: '简单',
      cooking_time: '15分钟',
      servings: '2人份',
      description: '酸辣爽口，开胃下饭',
      tags: '快手菜,土豆,酸辣',
      image_url: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=400',
      images: ['https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=400'],
      rating: '4.6',
      isSample: true,
      ingredients: [
        { name: '土豆', amount: '2个', category: '蔬菜' },
        { name: '干辣椒', amount: '3个', category: '调料' },
        { name: '醋', amount: '2勺', category: '调料' },
        { name: '盐', amount: '适量', category: '调料' },
        { name: '蒜片', amount: '适量', category: '蔬菜' }
      ],
      steps: [
        { title: '切丝', description: '土豆切细丝，泡水去淀粉' },
        { title: '焯水', description: '土豆丝焯水10秒捞出' },
        { title: '爆炒', description: '蒜片干辣椒爆香' },
        { title: '调味', description: '放入土豆丝，醋盐翻炒均匀' }
      ]
    },
    {
      id: 'sample_11',
      name: '清蒸鲈鱼',
      category: '晚餐',
      difficulty: '中等',
      cooking_time: '25分钟',
      servings: '2人份',
      description: '鱼肉鲜嫩，清淡健康',
      tags: '蒸鱼,海鲜,清淡',
      image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400',
      images: ['https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400'],
      rating: '4.9',
      isSample: true,
      ingredients: [
        { name: '鲈鱼', amount: '1条', category: '海鲜' },
        { name: '姜丝', amount: '适量', category: '蔬菜' },
        { name: '葱丝', amount: '适量', category: '蔬菜' },
        { name: '蒸鱼豉油', amount: '2勺', category: '调料' },
        { name: '热油', amount: '适量', category: '调料' }
      ],
      steps: [
        { title: '处理', description: '鱼身划几刀，用盐料酒腌制' },
        { title: '摆盘', description: '鱼身放姜丝葱丝' },
        { title: '蒸制', description: '开水上锅蒸10分钟' },
        { title: '淋油', description: '取出淋上蒸鱼豉油，热油浇香' }
      ]
    },
    {
      id: 'sample_12',
      name: '凉拌黄瓜',
      category: '素菜',
      difficulty: '简单',
      cooking_time: '10分钟',
      servings: '2人份',
      description: '清脆爽口，夏日必备',
      tags: '凉菜,黄瓜,快手',
      image_url: 'https://images.unsplash.com/photo-1564093497595-593b96d80180?w=400',
      images: ['https://images.unsplash.com/photo-1564093497595-593b96d80180?w=400'],
      rating: '4.5',
      isSample: true,
      ingredients: [
        { name: '黄瓜', amount: '2根', category: '蔬菜' },
        { name: '蒜末', amount: '适量', category: '蔬菜' },
        { name: '醋', amount: '1勺', category: '调料' },
        { name: '酱油', amount: '1勺', category: '调料' },
        { name: '辣椒油', amount: '1勺', category: '调料' },
        { name: '花生米', amount: '适量', category: '干货' }
      ],
      steps: [
        { title: '拍瓜', description: '黄瓜用刀拍碎切段' },
        { title: '加盐', description: '黄瓜加盐腌制5分钟' },
        { title: '调味', description: '放入蒜末醋酱油辣椒油' },
        { title: '拌匀', description: '撒上花生米拌匀即可' }
      ]
    },
    {
      id: 'sample_13',
      name: '蛋炒饭',
      category: '午餐',
      difficulty: '简单',
      cooking_time: '15分钟',
      servings: '2人份',
      description: '粒粒分明，蛋香四溢',
      tags: '炒饭,鸡蛋,快手',
      image_url: 'https://images.unsplash.com/photo-1603133872878-684f5c9322ed?w=400',
      images: ['https://images.unsplash.com/photo-1603133872878-684f5c9322ed?w=400'],
      rating: '4.7',
      isSample: true,
      ingredients: [
        { name: '米饭', amount: '2碗', category: '主食' },
        { name: '鸡蛋', amount: '2个', category: '蛋类' },
        { name: '火腿肠', amount: '1根', category: '肉类' },
        { name: '葱花', amount: '适量', category: '蔬菜' },
        { name: '盐', amount: '适量', category: '调料' }
      ],
      steps: [
        { title: '炒蛋', description: '鸡蛋打散炒熟盛出' },
        { title: '炒饭', description: '米饭下锅炒散' },
        { title: '加料', description: '放入火腿肠鸡蛋翻炒' },
        { title: '调味', description: '加盐撒葱花翻炒均匀' }
      ]
    },
    {
      id: 'sample_14',
      name: '葱油拌面',
      category: '早餐',
      difficulty: '简单',
      cooking_time: '20分钟',
      servings: '2人份',
      description: '香气扑鼻，简单美味',
      tags: '面条,早餐,快手',
      image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
      images: ['https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400'],
      rating: '4.6',
      isSample: true,
      ingredients: [
        { name: '细面条', amount: '300g', category: '主食' },
        { name: '小葱', amount: '100g', category: '蔬菜' },
        { name: '食用油', amount: '50ml', category: '调料' },
        { name: '生抽', amount: '2勺', category: '调料' },
        { name: '老抽', amount: '1勺', category: '调料' }
      ],
      steps: [
        { title: '熬葱油', description: '小葱切段，油锅熬至焦黄' },
        { title: '煮面', description: '面条煮熟捞出沥干' },
        { title: '调味', description: '面条加生抽老抽葱油拌匀' },
        { title: '装盘', description: '撒上葱花即可享用' }
      ]
    },
    {
      id: 'sample_15',
      name: '酸菜鱼',
      category: '晚餐',
      difficulty: '中等',
      cooking_time: '35分钟',
      servings: '4人份',
      description: '酸辣鲜香，鱼肉嫩滑',
      tags: '川菜,鱼,酸辣',
      image_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400',
      images: ['https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400'],
      rating: '4.8',
      isSample: true,
      ingredients: [
        { name: '草鱼', amount: '1条', category: '海鲜' },
        { name: '酸菜', amount: '200g', category: '蔬菜' },
        { name: '泡椒', amount: '5个', category: '调料' },
        { name: '豆瓣酱', amount: '1勺', category: '调料' },
        { name: '蒜末', amount: '适量', category: '蔬菜' },
        { name: '淀粉', amount: '适量', category: '调料' }
      ],
      steps: [
        { title: '片鱼', description: '鱼肉片成薄片，加盐淀粉腌制' },
        { title: '炒酸菜', description: '酸菜泡椒豆瓣酱炒香' },
        { title: '煮汤', description: '加水烧开放入鱼头鱼骨' },
        { title: '烫鱼片', description: '放入鱼片烫熟盛出，淋热油' }
      ]
    },
    {
      id: 'sample_16',
      name: '水煮肉片',
      category: '晚餐',
      difficulty: '中等',
      cooking_time: '30分钟',
      servings: '3人份',
      description: '麻辣鲜香，肉片嫩滑',
      tags: '川菜,猪肉,麻辣',
      image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'],
      rating: '4.7',
      isSample: true,
      ingredients: [
        { name: '猪里脊', amount: '300g', category: '肉类' },
        { name: '豆芽', amount: '200g', category: '蔬菜' },
        { name: '郫县豆瓣酱', amount: '2勺', category: '调料' },
        { name: '干辣椒', amount: '10个', category: '调料' },
        { name: '花椒', amount: '1勺', category: '调料' },
        { name: '淀粉', amount: '适量', category: '调料' }
      ],
      steps: [
        { title: '切片', description: '肉切片，加盐料酒淀粉腌制' },
        { title: '炒底', description: '豆瓣酱炒出红油，加水烧开' },
        { title: '烫肉', description: '放入豆芽烫熟铺碗底，肉片烫熟铺上面' },
        { title: '淋油', description: '放干辣椒花椒，淋热油激发香味' }
      ]
    },
    {
      id: 'sample_17',
      name: '地三鲜',
      category: '素菜',
      difficulty: '中等',
      cooking_time: '25分钟',
      servings: '2人份',
      description: '软糯鲜香，健康美味',
      tags: '素菜,土豆,茄子',
      image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
      images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400'],
      rating: '4.6',
      isSample: true,
      ingredients: [
        { name: '茄子', amount: '1个', category: '蔬菜' },
        { name: '土豆', amount: '1个', category: '蔬菜' },
        { name: '青椒', amount: '1个', category: '蔬菜' },
        { name: '蒜末', amount: '适量', category: '蔬菜' },
        { name: '酱油', amount: '2勺', category: '调料' },
        { name: '淀粉', amount: '适量', category: '调料' }
      ],
      steps: [
        { title: '切块', description: '茄子土豆青椒切滚刀块' },
        { title: '炸制', description: '茄子土豆分别炸至金黄' },
        { title: '炒制', description: '蒜末爆香，放入青椒翻炒' },
        { title: '汇合', description: '放入茄子和土豆，酱油勾芡' }
      ]
    },
    {
      id: 'sample_18',
      name: '西红柿鸡蛋汤',
      category: '汤类',
      difficulty: '简单',
      cooking_time: '15分钟',
      servings: '2人份',
      description: '酸甜开胃，简单快手',
      tags: '汤,番茄,快手',
      image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
      images: ['https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400'],
      rating: '4.9',
      isSample: true,
      ingredients: [
        { name: '西红柿', amount: '2个', category: '蔬菜' },
        { name: '鸡蛋', amount: '2个', category: '蛋类' },
        { name: '葱花', amount: '适量', category: '蔬菜' },
        { name: '盐', amount: '适量', category: '调料' },
        { name: '香油', amount: '少许', category: '调料' }
      ],
      steps: [
        { title: '切块', description: '西红柿切块' },
        { title: '煮汤', description: '加水烧开放入西红柿' },
        { title: '打蛋', description: '鸡蛋打散，慢慢倒入锅中' },
        { title: '调味', description: '加盐，淋香油撒葱花' }
      ]
    }
  ]

  localStorage.setItem('fmhome_sample_dishes', JSON.stringify(sampleDishes))
  return sampleDishes
}

export const useDishStore = defineStore('dishes', () => {
  const dishes = ref([])
  const dailyRecommend = ref([])
  const categories = ref([])
  const loading = ref(false)
  const currentDish = ref(null)
  const cart = ref([])
  const preferences = ref({
    taste: '不限',
    difficulty: '不限'
  })

  // 从本地存储恢复购物车
  const savedCart = localStorage.getItem('fmhome_cart')
  if (savedCart) {
    cart.value = JSON.parse(savedCart)
  }

  // 加载菜品列表
  const loadDishes = async () => {
    loading.value = true
    try {
      // 加载示例菜品
      const sampleDishes = initSampleDishes()

      // 从本地存储加载自定义菜品
      const customDishes = JSON.parse(localStorage.getItem('fmhome_custom_dishes') || '[]')

      // 尝试从API加载
      let apiDishes = []
      try {
        const res = await dishApi.getAll()
        apiDishes = res.data.data || []
      } catch (e) {
        console.log('API加载失败，使用本地数据')
      }

      // 合并：示例菜品 -> 自定义菜品 -> API菜品
      dishes.value = [...sampleDishes, ...customDishes, ...apiDishes]
    } catch (e) {
      console.error('加载菜品失败:', e)
      dishes.value = []
    } finally {
      loading.value = false
    }
  }

  // 删除自定义菜品
  const deleteCustomDish = (dishId) => {
    if (dishId.startsWith('custom_')) {
      const customDishes = JSON.parse(localStorage.getItem('fmhome_custom_dishes') || '[]')
      const filtered = customDishes.filter(d => d.id !== dishId)
      localStorage.setItem('fmhome_custom_dishes', JSON.stringify(filtered))

      // 同时从 dishes 中移除
      dishes.value = dishes.value.filter(d => d.id !== dishId)
    } else if (dishId.startsWith('sample_')) {
      // 示例菜品标记为已删除
      const sampleDishes = JSON.parse(localStorage.getItem('fmhome_sample_dishes') || '[]')
      const filtered = sampleDishes.filter(d => d.id !== dishId)
      localStorage.setItem('fmhome_sample_dishes', JSON.stringify(filtered))
      dishes.value = dishes.value.filter(d => d.id !== dishId)
    }
  }

  // 更新菜品
  const updateDish = (dishId, updatedData) => {
    if (dishId.startsWith('custom_')) {
      const customDishes = JSON.parse(localStorage.getItem('fmhome_custom_dishes') || '[]')
      const index = customDishes.findIndex(d => d.id === dishId)
      if (index !== -1) {
        customDishes[index] = { ...customDishes[index], ...updatedData }
        localStorage.setItem('fmhome_custom_dishes', JSON.stringify(customDishes))
        // 更新 store
        const storeIndex = dishes.value.findIndex(d => d.id === dishId)
        if (storeIndex !== -1) {
          dishes.value[storeIndex] = { ...dishes.value[storeIndex], ...updatedData }
        }
      }
    }
  }

  // 加载每日推荐
  const loadDailyRecommend = async () => {
    try {
      const res = await dishApi.getDailyRecommend()
      dailyRecommend.value = res.data.data || []
    } catch (e) {
      console.error('加载推荐失败:', e)
      dailyRecommend.value = []
    }
  }

  // 添加自定义菜品
  const addCustomDish = (dish) => {
    dishes.value.unshift(dish)
  }

  // 保存购物车到本地存储
  const saveCart = () => {
    localStorage.setItem('fmhome_cart', JSON.stringify(cart.value))
  }

  const addToCart = (dish) => {
    const existing = cart.value.find(item => item.id === dish.id)
    if (existing) {
      existing.quantity++
    } else {
      cart.value.push({ ...dish, quantity: 1 })
    }
    saveCart()
  }

  const removeFromCart = (dishId) => {
    const index = cart.value.findIndex(item => item.id === dishId)
    if (index > -1) {
      cart.value.splice(index, 1)
      saveCart()
    }
  }

  const updateQuantity = (dishId, quantity) => {
    const item = cart.value.find(item => item.id === dishId)
    if (item) {
      item.quantity = Math.max(0, quantity)
      if (item.quantity === 0) {
        removeFromCart(dishId)
      } else {
        saveCart()
      }
    }
  }

  const clearCart = () => {
    cart.value = []
    saveCart()
  }

  // 计算购物车中的食材汇总
  const ingredientsSummary = computed(() => {
    const summary = {}
    cart.value.forEach(item => {
      // 简化处理，实际应从菜品详情获取
      if (item.ingredients) {
        item.ingredients.forEach(ing => {
          if (summary[ing]) {
            summary[ing]++
          } else {
            summary[ing] = 1
          }
        })
      }
    })
    return summary
  })

  return {
    dishes,
    dailyRecommend,
    categories,
    loading,
    currentDish,
    cart,
    preferences,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    ingredientsSummary,
    loadDishes,
    loadDailyRecommend,
    addCustomDish,
    deleteCustomDish,
    updateDish
  }
})
