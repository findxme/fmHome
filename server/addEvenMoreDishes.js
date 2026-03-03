// 继续添加更多菜品
import { getDatabase } from './database.js';

const moreDishes = [
  {
    name: '萝卜炖羊肉',
    category: '午餐',
    tags: '羊肉,萝卜,炖菜,冬季',
    difficulty: '中等',
    cooking_time: '90分钟',
    servings: '4人份',
    description: '羊肉鲜美、萝卜清甜',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    ingredients: [
      { name: '羊肉', amount: '500g', category: '主料', isOptional: false },
      { name: '白萝卜', amount: '1个', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理羊肉', description: '羊肉切块焯水', duration: '10分钟', tips: '去血沫' },
      { phase: '主料', title: '炖煮', description: '加调料和水，小火炖1小时', duration: '60分钟', tips: '小火' },
      { phase: '主料', title: '加萝卜', description: '萝卜切块放入', duration: '5分钟', tips: '后半程放' },
      { phase: '收尾', title: '调味', description: '加盐', duration: '2分钟', tips: '盐后放' }
    ],
    tips: ['要选带皮的', '萝卜后放', '炖久一点']
  },
  {
    name: '红烧羊肉',
    category: '午餐',
    tags: '羊肉,红烧,冬季,暖身',
    difficulty: '中等',
    cooking_time: '90分钟',
    servings: '4人份',
    description: '羊肉软烂、酱香浓郁',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    ingredients: [
      { name: '羊肉', amount: '500g', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理羊肉', description: '羊肉切块焯水', duration: '10分钟', tips: '去血沫' },
      { phase: '主料', title: '红烧', description: '炒糖色，加调料和水，小火炖1小时', duration: '70分钟', tips: '小火' },
      { phase: '收尾', title: '收汁', description: '大火收汁', duration: '5分钟', tips: '汁浓出锅' }
    ],
    tips: ['要选带筋的', '糖色炒好', '小火炖']
  },
  {
    name: '葱爆羊肉',
    category: '午餐',
    tags: '羊肉,葱,快手,清香',
    difficulty: '简单',
    cooking_time: '15分钟',
    servings: '2人份',
    description: '羊肉鲜嫩、葱香浓郁',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    ingredients: [
      { name: '羊肉片', amount: '300g', category: '主料', isOptional: false },
      { name: '大葱', amount: '2根', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '切配', description: '大葱切段', duration: '3分钟', tips: '切斜段' },
      { phase: '主料', title: '爆炒', description: '锅中热油，放入羊肉片和大葱爆炒', duration: '8分钟', tips: '大火快炒' },
      { phase: '收尾', title: '调味', description: '加盐和酱油', duration: '2分钟', tips: '快炒出锅' }
    ],
    tips: ['要大火快炒', '葱要多', '不要炒太久']
  },
  {
    name: '手抓羊肉',
    category: '午餐',
    tags: '羊肉,手抓,西北,豪放',
    difficulty: '中等',
    cooking_time: '90分钟',
    servings: '4人份',
    description: '羊肉原味、豪爽吃法',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    ingredients: [
      { name: '羊排', amount: '1000g', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理羊排', description: '羊排洗净', duration: '10分钟', tips: '不要切' },
      { phase: '主料', title: '煮羊排', description: '加姜葱料酒，小火煮1小时', duration: '60分钟', tips: '小火' },
      { phase: '收尾', title: '装盘', description: '捞出装盘，配蘸料', duration: '5分钟', tips: '热吃' }
    ],
    tips: ['要选带肉的', '小火慢煮', '配蒜泥']
  },
  {
    name: '红烧牛腩',
    category: '午餐',
    tags: '牛肉,牛腩,红烧,软烂',
    difficulty: '中等',
    cooking_time: '120分钟',
    servings: '4人份',
    description: '牛腩软烂、汤汁浓郁',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    ingredients: [
      { name: '牛腩', amount: '500g', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理牛腩', description: '牛腩切块焯水', duration: '15分钟', tips: '去血沫' },
      { phase: '主料', title: '红烧', description: '炒糖色，加调料和水，小火炖2小时', duration: '120分钟', tips: '要炖烂' },
      { phase: '收尾', title: '收汁', description: '大火收汁', duration: '10分钟', tips: '汁浓' }
    ],
    tips: ['要选带筋的', '炖久一点', '收汁要浓']
  },
  {
    name: '番茄牛腩',
    category: '午餐',
    tags: '牛肉,牛腩,番茄,酸甜',
    difficulty: '中等',
    cooking_time: '120分钟',
    servings: '4人份',
    description: '酸甜开胃、牛腩软烂',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    ingredients: [
      { name: '牛腩', amount: '500g', category: '主料', isOptional: false },
      { name: '番茄', amount: '3个', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理牛腩', description: '牛腩切块焯水', duration: '15分钟', tips: '去血沫' },
      { phase: '备菜', title: '处理番茄', description: '番茄切块', duration: '5分钟', tips: '去皮' },
      { phase: '主料', title: '炖煮', description: '牛腩番茄一起炖2小时', duration: '120分钟', tips: '小火' },
      { phase: '收尾', title: '调味', description: '加盐', duration: '2分钟', tips: '盐后放' }
    ],
    tips: ['番茄要选熟的', '要炖烂', '汤好喝']
  },
  {
    name: '小炒牛肉',
    category: '午餐',
    tags: '牛肉,小炒,快手,家常',
    difficulty: '简单',
    cooking_time: '15分钟',
    servings: '2人份',
    description: '牛肉鲜嫩、快手小炒',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    ingredients: [
      { name: '牛肉', amount: '200g', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '切配腌制', description: '牛肉切片，加生抽淀粉腌制', duration: '10分钟', tips: '腌制入味' },
      { phase: '主料', title: '炒制', description: '大火快炒', duration: '5分钟', tips: '快炒' },
      { phase: '收尾', title: '调味', description: '加盐出锅', duration: '1分钟', tips: '快炒' }
    ],
    tips: ['要大火快炒', '牛肉要嫩', '不要炒太久']
  },
  {
    name: '芹菜牛肉',
    category: '午餐',
    tags: '牛肉,芹菜,家常,营养',
    difficulty: '简单',
    cooking_time: '15分钟',
    servings: '2人份',
    description: '牛肉鲜嫩、芹菜脆爽',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    ingredients: [
      { name: '牛肉', amount: '200g', category: '主料', isOptional: false },
      { name: '芹菜', amount: '200g', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '切配', description: '牛肉切片，芹菜切段', duration: '5分钟', tips: '切好' },
      { phase: '主料', title: '炒制', description: '牛肉炒变色，放芹菜', duration: '8分钟', tips: '大火' },
      { phase: '收尾', title: '调味', description: '加盐', duration: '1分钟', tips: '快炒' }
    ],
    tips: ['芹菜后放', '保持脆感', '快炒']
  },
  {
    name: '苦瓜炒牛肉',
    category: '午餐',
    tags: '苦瓜,牛肉,清热,营养',
    difficulty: '简单',
    cooking_time: '20分钟',
    servings: '2人份',
    description: '苦瓜清爽、牛肉鲜嫩',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    ingredients: [
      { name: '苦瓜', amount: '1根', category: '主料', isOptional: false },
      { name: '牛肉', amount: '150g', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理苦瓜', description: '苦瓜切片，用盐腌一下', duration: '10分钟', tips: '去苦味' },
      { phase: '备菜', title: '切配', description: '牛肉切片腌制', duration: '10分钟', tips: '腌制' },
      { phase: '主料', title: '炒制', description: '牛肉炒变色，放苦瓜', duration: '8分钟', tips: '大火' },
      { phase: '收尾', title: '调味', description: '加盐', duration: '1分钟', tips: '快炒' }
    ],
    tips: ['苦瓜要腌', '牛肉要嫩', '快炒']
  },
  {
    name: '萝卜干炒腊肉',
    category: '午餐',
    tags: '萝卜干,腊肉,下饭,家常',
    difficulty: '简单',
    cooking_time: '20分钟',
    servings: '2人份',
    description: '腊肉香浓、萝卜干脆',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    ingredients: [
      { name: '萝卜干', amount: '100g', category: '主料', isOptional: false },
      { name: '腊肉', amount: '100g', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理食材', description: '萝卜干泡发，腊肉切片', duration: '10分钟', tips: '泡发' },
      { phase: '主料', title: '炒制', description: '腊肉炒出油，放萝卜干', duration: '10分钟', tips: '大火' },
      { phase: '收尾', title: '调味', description: '加蒜苗', duration: '2分钟', tips: '翻匀' }
    ],
    tips: ['萝卜干要泡发', '腊肉要炒出油', '配蒜苗']
  },
  {
    name: '藜蒿炒腊肉',
    category: '午餐',
    tags: '藜蒿,腊肉,江西,时令',
    difficulty: '简单',
    cooking_time: '15分钟',
    servings: '2人份',
    description: '藜蒿清香、腊肉咸香',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    ingredients: [
      { name: '藜蒿', amount: '300g', category: '主料', isOptional: false },
      { name: '腊肉', amount: '100g', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理食材', description: '藜蒿切段，腊肉切片', duration: '5分钟', tips: '切好' },
      { phase: '主料', title: '炒制', description: '腊肉炒出油，放藜蒿', duration: '8分钟', tips: '大火' },
      { phase: '收尾', title: '调味', description: '加盐翻匀', duration: '1分钟', tips: '快炒' }
    ],
    tips: ['藜蒿要选嫩的', '大火快炒', '保持绿色']
  },
  {
    name: '冬笋炒腊肉',
    category: '午餐',
    tags: '冬笋,腊肉,时令,家常',
    difficulty: '简单',
    cooking_time: '20分钟',
    servings: '2人份',
    description: '冬笋鲜嫩、腊肉香浓',
    image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
    ingredients: [
      { name: '冬笋', amount: '200g', category: '主料', isOptional: false },
      { name: '腊肉', amount: '100g', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理食材', description: '冬笋切片焯水，腊肉切片', duration: '10分钟', tips: '去涩' },
      { phase: '主料', title: '炒制', description: '腊肉炒出油，放冬笋', duration: '8分钟', tips: '大火' },
      { phase: '收尾', title: '调味', description: '加蒜苗', duration: '2分钟', tips: '翻匀' }
    ],
    tips: ['冬笋要焯水', '腊肉要炒出油', '保持脆感']
  },
  {
    name: '蒜苔炒腊肉',
    category: '午餐',
    tags: '蒜苔,腊肉,家常,清香',
    difficulty: '简单',
    cooking_time: '15分钟',
    servings: '2人份',
    description: '蒜苔清脆、腊肉香浓',
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
    ingredients: [
      { name: '蒜苔', amount: '300g', category: '主料', isOptional: false },
      { name: '腊肉', amount: '100g', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理食材', description: '蒜苔切段，腊肉切片', duration: '5分钟', tips: '切好' },
      { phase: '主料', title: '炒制', description: '腊肉炒出油，放蒜苔', duration: '8分钟', tips: '大火' },
      { phase: '收尾', title: '调味', description: '加盐', duration: '1分钟', tips: '快炒' }
    ],
    tips: ['蒜苔要选嫩的', '大火快炒', '保持脆感']
  },
  {
    name: '雪菜炒毛豆',
    category: '素菜',
    tags: '雪菜,毛豆,家常,清淡',
    difficulty: '简单',
    cooking_time: '15分钟',
    servings: '2人份',
    description: '雪菜咸香、毛豆清甜',
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
    ingredients: [
      { name: '雪菜', amount: '100g', category: '主料', isOptional: false },
      { name: '毛豆', amount: '100g', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理食材', description: '毛豆焯水', duration: '5分钟', tips: '去皮' },
      { phase: '主料', title: '炒制', description: '炒香雪菜，放毛豆', duration: '8分钟', tips: '大火' },
      { phase: '收尾', title: '调味', description: '加糖提鲜', duration: '1分钟', tips: '翻匀' }
    ],
    tips: ['毛豆要焯水', '雪菜要炒香', '加糖提鲜']
  },
  {
    name: '雪菜肉丝',
    category: '午餐',
    tags: '雪菜,猪肉,家常,下饭',
    difficulty: '简单',
    cooking_time: '20分钟',
    servings: '2人份',
    description: '雪菜咸香、肉丝鲜嫩',
    image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
    ingredients: [
      { name: '雪菜', amount: '100g', category: '主料', isOptional: false },
      { name: '猪肉', amount: '100g', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '切配', description: '肉切丝，雪菜洗净', duration: '5分钟', tips: '切好' },
      { phase: '主料', title: '炒肉丝', description: '肉丝炒变色', duration: '5分钟', tips: '大火' },
      { phase: '主料', title: '合炒', description: '放雪菜翻炒', duration: '5分钟', tips: '大火' },
      { phase: '收尾', title: '调味', description: '加糖提鲜', duration: '1分钟', tips: '翻匀' }
    ],
    tips: ['雪菜要洗净', '大火快炒', '加糖提鲜']
  },
  {
    name: '外婆菜炒蛋',
    category: '午餐',
    tags: '外婆菜,鸡蛋,家常,下饭',
    difficulty: '简单',
    cooking_time: '15分钟',
    servings: '2人份',
    description: '外婆菜香、鸡蛋鲜嫩',
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    ingredients: [
      { name: '外婆菜', amount: '100g', category: '主料', isOptional: false },
      { name: '鸡蛋', amount: '2个', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理外婆菜', description: '外婆菜洗净切碎', duration: '5分钟', tips: '切碎' },
      { phase: '主料', title: '炒蛋', description: '鸡蛋炒散盛出', duration: '3分钟', tips: '炒散' },
      { phase: '主料', title: '合炒', description: '放外婆菜和鸡蛋翻炒', duration: '5分钟', tips: '大火' },
      { phase: '收尾', title: '调味', description: '加盐', duration: '1分钟', tips: '翻匀' }
    ],
    tips: ['外婆菜要洗净', '大火快炒', '很下饭']
  },
  {
    name: '梅菜毛豆',
    category: '素菜',
    tags: '梅菜,毛豆,家常,清淡',
    difficulty: '简单',
    cooking_time: '15分钟',
    servings: '2人份',
    description: '梅菜香浓、毛豆清甜',
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
    ingredients: [
      { name: '梅菜', amount: '50g', category: '主料', isOptional: false },
      { name: '毛豆', amount: '100g', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理食材', description: '毛豆焯水，梅菜洗净', duration: '8分钟', tips: '去皮' },
      { phase: '主料', title: '炒制', description: '炒香梅菜，放毛豆', duration: '8分钟', tips: '大火' },
      { phase: '收尾', title: '调味', description: '加糖', duration: '1分钟', tips: '翻匀' }
    ],
    tips: ['毛豆要焯水', '梅菜要炒香', '加糖提鲜']
  },
  {
    name: '酸菜炒粉丝',
    category: '素菜',
    tags: '酸菜,粉丝,家常,快手',
    difficulty: '简单',
    cooking_time: '15分钟',
    servings: '2人份',
    description: '酸菜爽口、粉丝Q弹',
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
    ingredients: [
      { name: '酸菜', amount: '100g', category: '主料', isOptional: false },
      { name: '粉丝', amount: '50g', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理食材', description: '酸菜切碎，粉丝泡软', duration: '10分钟', tips: '泡软' },
      { phase: '主料', title: '炒制', description: '炒香酸菜，放粉丝', duration: '8分钟', tips: '大火' },
      { phase: '收尾', title: '调味', description: '加酱油', duration: '1分钟', tips: '翻匀' }
    ],
    tips: ['粉丝要泡软', '大火快炒', '加酱油上色']
  },
  {
    name: '酸菜炒饭',
    category: '早餐',
    tags: '酸菜,米饭,炒饭,家常',
    difficulty: '简单',
    cooking_time: '15分钟',
    servings: '1人份',
    description: '酸菜开胃、炒饭喷香',
    image_url: 'https://images.unsplash.com/photo-1603133872878-684f5c9322ed?w=800',
    ingredients: [
      { name: '隔夜米饭', amount: '1碗', category: '主食', isOptional: false },
      { name: '酸菜', amount: '50g', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理食材', description: '酸菜切碎', duration: '5分钟', tips: '切碎' },
      { phase: '主料', title: '炒制', description: '炒香酸菜，放米饭', duration: '8分钟', tips: '大火' },
      { phase: '收尾', title: '调味', description: '加盐和葱花', duration: '2分钟', tips: '翻匀' }
    ],
    tips: ['要用隔夜饭', '大火快炒', '加葱花']
  },
  {
    name: '酱油炒饭',
    category: '早餐',
    tags: '酱油,米饭,炒饭,快手',
    difficulty: '简单',
    cooking_time: '10分钟',
    servings: '1人份',
    description: '酱油香浓、粒粒分明',
    image_url: 'https://images.unsplash.com/photo-1603133872878-684f5c9322ed?w=800',
    ingredients: [
      { name: '隔夜米饭', amount: '1碗', category: '主食', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '准备米饭', description: '米饭拨散', duration: '2分钟', tips: '拨散' },
      { phase: '主料', title: '炒制', description: '锅中热油，放米饭翻炒', duration: '5分钟', tips: '大火' },
      { phase: '收尾', title: '调味', description: '加酱油翻匀', duration: '2分钟', tips: '翻匀' }
    ],
    tips: ['要用隔夜饭', '大火快炒', '酱油要够']
  },
  {
    name: '蛋饼卷油条',
    category: '早餐',
    tags: '蛋饼,油条,早餐,小吃',
    difficulty: '简单',
    cooking_time: '10分钟',
    servings: '1人份',
    description: '蛋饼香软、油条酥脆',
    image_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
    ingredients: [
      { name: '面粉', amount: '50g', category: '主食', isOptional: false },
      { name: '鸡蛋', amount: '1个', category: '主料', isOptional: false },
      { name: '油条', amount: '1根', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '调面糊', description: '面粉加水调成糊', duration: '5分钟', tips: '调稀' },
      { phase: '主料', title: '摊饼', description: '平底锅摊成饼', duration: '3分钟', tips: '小火' },
      { phase: '收尾', title: '卷油条', description: '饼上打鸡蛋，卷油条', duration: '2分钟', tips: '卷紧' }
    ],
    tips: ['面糊要稀', '小火摊饼', '油条要脆']
  },
  {
    name: '鸡蛋灌饼',
    category: '早餐',
    tags: '鸡蛋,灌饼,早餐,小吃',
    difficulty: '中等',
    cooking_time: '15分钟',
    servings: '1人份',
    description: '饼皮酥脆、鸡蛋香嫩',
    image_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
    ingredients: [
      { name: '面粉', amount: '100g', category: '主食', isOptional: false },
      { name: '鸡蛋', amount: '1个', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '和面', description: '面粉加水活成面团', duration: '10分钟', tips: '和匀' },
      { phase: '主料', title: '做饼', description: '擀成薄饼，煎至起泡', duration: '8分钟', tips: '中小火' },
      { phase: '收尾', title: '灌蛋', description: '挑开饼皮，灌入鸡蛋', duration: '3分钟', tips: '要快' }
    ],
    tips: ['面要活软', '火不要太大', '灌蛋要快']
  },
  {
    name: '手抓饼',
    category: '早餐',
    tags: '手抓饼,早餐,小吃,酥脆',
    difficulty: '中等',
    cooking_time: '15分钟',
    servings: '1人份',
    description: '层层酥脆、香气扑鼻',
    image_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
    ingredients: [
      { name: '面粉', amount: '200g', category: '主食', isOptional: false },
      { name: '黄油', amount: '30g', category: '调料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '和面', description: '面粉加水活成面团，醒20分钟', duration: '25分钟', tips: '要醒' },
      { phase: '备菜', title: '做油酥', description: '面粉加黄油调成油酥', duration: '5分钟', tips: '调匀' },
      { phase: '主料', title: '做饼', description: '擀开抹油酥，叠起来再擀', duration: '10分钟', tips: '要多叠' },
      { phase: '主料', title: '煎饼', description: '平底锅煎至两面金黄', duration: '8分钟', tips: '中小火' }
    ],
    tips: ['面要醒', '油酥要抹匀', '要叠多层']
  }
];

// 插入更多菜品
const db = getDatabase();
const insertDish = db.prepare(`
  INSERT INTO dishes (id, name, category, tags, difficulty, cooking_time, servings, description, ingredients, steps, tips, image_url)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const existingCount = db.prepare('SELECT COUNT(*) as count FROM dishes').get().count;
let idNum = existingCount + 1;

moreDishes.forEach((dish) => {
  const id = `dish_${String(idNum).padStart(3, '0')}`;
  try {
    insertDish.run(
      id,
      dish.name,
      dish.category,
      dish.tags,
      dish.difficulty,
      dish.cooking_time,
      dish.servings,
      dish.description,
      JSON.stringify(dish.ingredients),
      JSON.stringify(dish.steps),
      JSON.stringify(dish.tips),
      dish.image_url
    );
    idNum++;
  } catch (e) {
    console.log(`Error adding ${dish.name}: ${e.message}`);
  }
});

const newCount = db.prepare('SELECT COUNT(*) as count FROM dishes').get().count;
console.log(`✅ 已添加 ${newCount - existingCount} 道菜品，总计 ${newCount} 道菜`);
