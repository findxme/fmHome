// 扩展菜品数据脚本 - 运行此脚本添加更多菜品
import { getDatabase } from './database.js';

const additionalDishes = [
  // 继续添加更多菜品...
  {
    name: '辣子鸡',
    category: '午餐',
    tags: '鸡肉,辣子鸡,川菜,干辣',
    difficulty: '中等',
    cooking_time: '40分钟',
    servings: '2-3人份',
    description: '干辣香脆、鸡肉酥辣',
    image_url: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800',
    ingredients: [
      { name: '鸡腿肉', amount: '400g', category: '主料', isOptional: false },
      { name: '干辣椒', amount: '50g', category: '调料', isOptional: false },
      { name: '花椒', amount: '1把', category: '调料', isOptional: false },
      { name: '白芝麻', amount: '适量', category: '装饰', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '腌制', description: '鸡块用盐料酒腌制20分钟', duration: '20分钟', tips: '入味' },
      { phase: '主料', title: '炸鸡', description: '炸至金黄复炸', duration: '15分钟', tips: '复炸更脆' },
      { phase: '主料', title: '炒香料', description: '干辣椒花椒炒香', duration: '5分钟', tips: '小火' },
      { phase: '收尾', title: '裹料', description: '放入鸡块翻炒撒芝麻', duration: '3分钟', tips: '快炒' }
    ],
    tips: ['要复炸', '小火炒椒', '快速出锅']
  },
  {
    name: '宫保鸡丁',
    category: '午餐',
    tags: '鸡肉,宫保,川菜,花生',
    difficulty: '简单',
    cooking_time: '25分钟',
    servings: '2人份',
    description: '香辣鲜嫩、花生酥脆',
    image_url: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800',
    ingredients: [
      { name: '鸡胸肉', amount: '200g', category: '主料', isOptional: false },
      { name: '花生米', amount: '50g', category: '主料', isOptional: false },
      { name: '干辣椒', amount: '10个', category: '调料', isOptional: false },
      { name: '生抽', amount: '2勺', category: '调料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '切丁腌制', description: '鸡肉切丁腌制15分钟', duration: '15分钟', tips: '腌制入味' },
      { phase: '主料', title: '炒鸡', description: '鸡丁滑炒变色盛出', duration: '3分钟', tips: '大火' },
      { phase: '主料', title: '炒制', description: '调料炒香，放鸡丁和花生', duration: '4分钟', tips: '快速' },
      { phase: '收尾', title: '裹汁', description: '倒入汁翻匀', duration: '2分钟', tips: '汁裹住' }
    ],
    tips: ['鸡丁要嫩', '花生后放', '汁要裹住']
  },
  {
    name: '香菇滑鸡',
    category: '午餐',
    tags: '鸡肉,香菇,蒸菜,嫩滑',
    difficulty: '简单',
    cooking_time: '30分钟',
    servings: '2-3人份',
    description: '鸡肉嫩滑、香菇鲜美',
    image_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800',
    ingredients: [
      { name: '鸡腿', amount: '2个', category: '主料', isOptional: false },
      { name: '香菇', amount: '5朵', category: '主料', isOptional: false },
      { name: '生抽', amount: '2勺', category: '调料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理食材', description: '鸡腿切块，香菇切片', duration: '8分钟', tips: '切块' },
      { phase: '备菜', title: '腌制', description: '加调料腌制15分钟', duration: '15分钟', tips: '入味' },
      { phase: '主料', title: '蒸制', description: '上锅蒸20分钟', duration: '20分钟', tips: '大火' },
      { phase: '收尾', title: '出锅', description: '撒葱花', duration: '1分钟', tips: '可撒葱花' }
    ],
    tips: ['鸡腿肉嫩', '要腌制', '蒸够时间']
  },
  {
    name: '冬笋炒肉',
    category: '午餐',
    tags: '冬笋,猪肉,时令,家常',
    difficulty: '简单',
    cooking_time: '20分钟',
    servings: '2人份',
    description: '冬笋鲜嫩、脆爽可口',
    image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
    ingredients: [
      { name: '冬笋', amount: '200g', category: '主料', isOptional: false },
      { name: '猪肉', amount: '100g', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理冬笋', description: '冬笋切片焯水', duration: '10分钟', tips: '去涩味' },
      { phase: '主料', title: '炒制', description: '炒香蒜末，放肉片翻炒', duration: '5分钟', tips: '大火' },
      { phase: '收尾', title: '合炒', description: '放入冬笋，加调料翻炒', duration: '3分钟', tips: '快速' }
    ],
    tips: ['冬笋要焯水', '大火快炒', '保持脆感']
  },
  {
    name: '莴笋炒肉',
    category: '午餐',
    tags: '莴笋,猪肉,家常,清爽',
    difficulty: '简单',
    cooking_time: '15分钟',
    servings: '2人份',
    description: '莴笋脆爽、清香扑鼻',
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
    ingredients: [
      { name: '莴笋', amount: '1根', category: '主料', isOptional: false },
      { name: '猪肉', amount: '100g', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理食材', description: '莴笋切片，猪肉切片', duration: '5分钟', tips: '切薄片' },
      { phase: '主料', title: '炒肉', description: '炒香蒜末，放肉片', duration: '3分钟', tips: '大火' },
      { phase: '主料', title: '炒莴笋', description: '放入莴笋翻炒', duration: '4分钟', tips: '保持脆感' },
      { phase: '收尾', title: '调味', description: '加盐翻匀', duration: '1分钟', tips: '快炒' }
    ],
    tips: ['莴笋要切薄', '大火快炒', '保持脆']
  },
  {
    name: '西芹炒百合',
    category: '素菜',
    tags: '西芹,百合,清淡,健康',
    difficulty: '简单',
    cooking_time: '15分钟',
    servings: '2人份',
    description: '清脆爽口、营养健康',
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
    ingredients: [
      { name: '西芹', amount: '200g', category: '主料', isOptional: false },
      { name: '鲜百合', amount: '1个', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理食材', description: '西芹切段，百合洗净', duration: '5分钟', tips: '西芹要斜切' },
      { phase: '主料', title: '焯水', description: '西芹焯水备用', duration: '3分钟', tips: '不要太久' },
      { phase: '主料', title: '炒制', description: '炒香蒜末，放入食材翻炒', duration: '4分钟', tips: '大火' },
      { phase: '收尾', title: '调味', description: '加盐翻匀', duration: '1分钟', tips: '快速' }
    ],
    tips: ['西芹要焯水', '保持脆感', '百合易熟']
  },
  {
    name: '荷兰豆炒腊肠',
    category: '素菜',
    tags: '荷兰豆,腊肠,清淡,快手',
    difficulty: '简单',
    cooking_time: '15分钟',
    servings: '2人份',
    description: '荷兰豆脆嫩、腊肠香浓',
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
    ingredients: [
      { name: '荷兰豆', amount: '200g', category: '主料', isOptional: false },
      { name: '腊肠', amount: '2根', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理食材', description: '荷兰豆去筋，腊肠切片', duration: '5分钟', tips: '去筋口感好' },
      { phase: '主料', title: '炒腊肠', description: '腊肠炒出油', duration: '3分钟', tips: '小火' },
      { phase: '主料', title: '炒荷兰豆', description: '放入荷兰豆翻炒', duration: '4分钟', tips: '大火' },
      { phase: '收尾', title: '调味', description: '加盐翻匀', duration: '1分钟', tips: '快炒' }
    ],
    tips: ['荷兰豆去筋', '腊肠炒出油', '保持脆']
  },
  {
    name: '清炒菜心',
    category: '素菜',
    tags: '菜心,清淡,快手,健康',
    difficulty: '简单',
    cooking_time: '10分钟',
    servings: '2人份',
    description: '清爽脆嫩、简单快手',
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
    ingredients: [
      { name: '菜心', amount: '300g', category: '主料', isOptional: false },
      { name: '蒜末', amount: '适量', category: '调料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理菜心', description: '菜心洗净，切段', duration: '3分钟', tips: '控干水' },
      { phase: '主料', title: '炒制', description: '炒香蒜末，放入菜心大火翻炒', duration: '5分钟', tips: '大火快炒' },
      { phase: '收尾', title: '调味', description: '加盐、蚝油翻匀', duration: '1分钟', tips: '快速' }
    ],
    tips: ['控干水', '大火快炒', '不要炒太久']
  },
  {
    name: '蒜蓉空心菜',
    category: '素菜',
    tags: '空心菜,蒜蓉,快手,清淡',
    difficulty: '简单',
    cooking_time: '10分钟',
    servings: '2人份',
    description: '翠绿爽口、蒜香浓郁',
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
    ingredients: [
      { name: '空心菜', amount: '300g', category: '主料', isOptional: false },
      { name: '大蒜', amount: '4瓣', category: '调料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理空心菜', description: '空心菜洗净，切段', duration: '3分钟', tips: '控干水' },
      { phase: '主料', title: '炒制', description: '炒香蒜末，放入空心菜', duration: '5分钟', tips: '大火快炒' },
      { phase: '收尾', title: '调味', description: '加盐翻匀', duration: '1分钟', tips: '快速' }
    ],
    tips: ['要控干水', '大火快炒', '保持翠绿']
  },
  {
    name: '清炒茼蒿',
    category: '素菜',
    tags: '茼蒿,清淡,快手,健康',
    difficulty: '简单',
    cooking_time: '10分钟',
    servings: '2人份',
    description: '清香爽口、春季佳品',
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
    ingredients: [
      { name: '茼蒿', amount: '300g', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理茼蒿', description: '茼蒿洗净，切段', duration: '3分钟', tips: '控干' },
      { phase: '主料', title: '炒制', description: '炒香蒜末，放入茼蒿', duration: '5分钟', tips: '大火' },
      { phase: '收尾', title: '调味', description: '加盐翻匀', duration: '1分钟', tips: '快炒' }
    ],
    tips: ['大火快炒', '不要炒太久', '保持脆感']
  },
  {
    name: '香干炒芹菜',
    category: '素菜',
    tags: '香干,芹菜,家常,快手',
    difficulty: '简单',
    cooking_time: '15分钟',
    servings: '2人份',
    description: '芹菜脆爽、香干香浓',
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
    ingredients: [
      { name: '芹菜', amount: '200g', category: '主料', isOptional: false },
      { name: '香干', amount: '100g', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理食材', description: '芹菜切段，香干切片', duration: '5分钟', tips: '切均匀' },
      { phase: '主料', title: '炒制', description: '炒香蒜末，放入香干翻炒', duration: '5分钟', tips: '中火' },
      { phase: '主料', title: '加芹菜', description: '放入芹菜翻炒', duration: '3分钟', tips: '大火' },
      { phase: '收尾', title: '调味', description: '加盐翻匀', duration: '1分钟', tips: '快炒' }
    ],
    tips: ['香干先炒', '芹菜后放', '保持脆感']
  },
  {
    name: '豆皮炒青菜',
    category: '素菜',
    tags: '豆皮,青菜,家常,营养',
    difficulty: '简单',
    cooking_time: '15分钟',
    servings: '2人份',
    description: '豆皮柔软、青菜清爽',
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
    ingredients: [
      { name: '豆皮', amount: '100g', category: '主料', isOptional: false },
      { name: '青菜', amount: '200g', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理食材', description: '豆皮切条，青菜洗净', duration: '5分钟', tips: '切条' },
      { phase: '主料', title: '炒制', description: '炒香蒜末，放入豆皮翻炒', duration: '5分钟', tips: '中火' },
      { phase: '主料', title: '加青菜', description: '放入青菜翻炒', duration: '3分钟', tips: '大火' },
      { phase: '收尾', title: '调味', description: '加盐翻匀', duration: '1分钟', tips: '快炒' }
    ],
    tips: ['豆皮要炒软', '青菜后放', '保持颜色']
  },
  {
    name: '腐竹炒木耳',
    category: '素菜',
    tags: '腐竹,木耳,家常,营养',
    difficulty: '简单',
    cooking_time: '20分钟',
    servings: '2人份',
    description: '腐竹柔软、木耳脆爽',
    image_url: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800',
    ingredients: [
      { name: '腐竹', amount: '100g', category: '主料', isOptional: false },
      { name: '木耳', amount: '50g', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '泡发', description: '腐竹木耳泡发', duration: '20分钟', tips: '提前泡' },
      { phase: '备菜', title: '切配', description: '腐竹切段，青椒切片', duration: '5分钟', tips: '切均匀' },
      { phase: '主料', title: '炒制', description: '炒香蒜末，放入食材翻炒', duration: '8分钟', tips: '中火' },
      { phase: '收尾', title: '调味', description: '加生抽、盐', duration: '2分钟', tips: '翻匀' }
    ],
    tips: ['要泡透', '大火快炒', '保持口感']
  },
  {
    name: '红烧茄子',
    category: '素菜',
    tags: '茄子,红烧,家常,下饭',
    difficulty: '简单',
    cooking_time: '20分钟',
    servings: '2人份',
    description: '软糯入味、酱香浓郁',
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
    ingredients: [
      { name: '茄子', amount: '2个', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理茄子', description: '茄子切块，用盐腌制', duration: '10分钟', tips: '去水' },
      { phase: '主料', title: '炒制', description: '炒香豆瓣酱蒜末，放入茄子', duration: '8分钟', tips: '中火' },
      { phase: '主料', title: '红烧', description: '加生抽糖和水，焖5分钟', duration: '8分钟', tips: '焖入味' },
      { phase: '收尾', title: '收汁', description: '大火收汁', duration: '3分钟', tips: '汁浓' }
    ],
    tips: ['茄子要腌制', '少放油', '收汁要浓']
  },
  {
    name: '鱼香茄子',
    category: '素菜',
    tags: '茄子,鱼香,川菜,下饭',
    difficulty: '中等',
    cooking_time: '25分钟',
    servings: '2人份',
    description: '酸甜微辣、茄子软糯',
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
    ingredients: [
      { name: '茄子', amount: '2个', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理茄子', description: '茄子切条，用盐腌制', duration: '10分钟', tips: '去水' },
      { phase: '主料', title: '炒制', description: '茄子炒软盛出', duration: '8分钟', tips: '少油' },
      { phase: '主料', title: '调汁', description: '调料调成鱼香汁', duration: '2分钟', tips: '提前调好' },
      { phase: '主料', title: '裹汁', description: '放入茄子和汁翻炒', duration: '5分钟', tips: '裹匀' },
      { phase: '收尾', title: '勾芡', description: '水淀粉勾芡', duration: '2分钟', tips: '芡要薄' }
    ],
    tips: ['茄子要腌制', '提前调汁', '勾芡要薄']
  },
  {
    name: '家常炒面',
    category: '早餐',
    tags: '面条,炒面,主食,快手',
    difficulty: '简单',
    cooking_time: '20分钟',
    servings: '2人份',
    description: '面条筋道、酱香浓郁',
    image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
    ingredients: [
      { name: '面条', amount: '200g', category: '主食', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '煮面', description: '面条煮至八成熟', duration: '8分钟', tips: '不要煮太软' },
      { phase: '主料', title: '炒蛋', description: '鸡蛋炒散盛出', duration: '2分钟', tips: '炒散' },
      { phase: '主料', title: '炒面', description: '放入面条翻炒，加调料', duration: '8分钟', tips: '大火快炒' }
    ],
    tips: ['面要过冷水', '大火快炒', '油要够']
  },
  {
    name: '热干面',
    category: '早餐',
    tags: '面条,热干面,武汉,小吃',
    difficulty: '中等',
    cooking_time: '20分钟',
    servings: '1人份',
    description: '芝麻酱香、面条筋道',
    image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
    ingredients: [
      { name: '碱水面', amount: '150g', category: '主食', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '煮面', description: '水开下面条煮至断生', duration: '8分钟', tips: '不要煮太软' },
      { phase: '备菜', title: '调酱', description: '芝麻酱加水调稀，加生抽老抽', duration: '3分钟', tips: '调稀' },
      { phase: '主料', title: '拌面', description: '面条沥干加酱料拌匀', duration: '5分钟', tips: '要拌匀' }
    ],
    tips: ['要用碱水面', '芝麻酱要调稀', '要趁热拌']
  },
  {
    name: '担担面',
    category: '早餐',
    tags: '面条,担担面,四川,小吃',
    difficulty: '中等',
    cooking_time: '25分钟',
    servings: '1人份',
    description: '麻辣鲜香、面条筋道',
    image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
    ingredients: [
      { name: '面条', amount: '150g', category: '主食', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '炒肉臊', description: '肉末炒香，加调料', duration: '8分钟', tips: '炒干' },
      { phase: '备菜', title: '调汁', description: '碗中放辣椒油、花椒粉、生抽', duration: '2分钟', tips: '调匀' },
      { phase: '主料', title: '煮面', description: '水开下面条煮熟', duration: '8分钟', tips: '煮透' },
      { phase: '收尾', title: '拌面', description: '面条放入调汁碗中，撒肉臊', duration: '3分钟', tips: '拌匀' }
    ],
    tips: ['肉臊要炒干', '调料要调匀', '花生碎增香']
  },
  {
    name: '牛肉面',
    category: '早餐',
    tags: '面条,牛肉,汤面,家常',
    difficulty: '中等',
    cooking_time: '40分钟',
    servings: '2人份',
    description: '汤鲜肉嫩、面条爽滑',
    image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
    ingredients: [
      { name: '面条', amount: '200g', category: '主食', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '炖汤', description: '牛骨牛肉加姜片炖1小时', duration: '60分钟', tips: '一次加足水' },
      { phase: '主料', title: '煮面', description: '另锅煮面', duration: '8分钟', tips: '煮透' },
      { phase: '收尾', title: '装碗', description: '面放碗中，浇上牛肉汤和肉', duration: '3分钟', tips: '趁热' }
    ],
    tips: ['牛骨要炖久', '萝卜后放', '汤要浓郁']
  },
  {
    name: '酸汤面',
    category: '早餐',
    tags: '面条,酸汤,开胃,快手',
    difficulty: '简单',
    cooking_time: '15分钟',
    servings: '1人份',
    description: '酸辣开胃、简单快手',
    image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
    ingredients: [
      { name: '面条', amount: '150g', category: '主食', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '调汤', description: '碗中放醋、生抽、紫菜', duration: '2分钟', tips: '调匀' },
      { phase: '主料', title: '煮面', description: '水开下面条', duration: '8分钟', tips: '煮透' },
      { phase: '收尾', title: '冲汤', description: '面汤冲入碗中，放面条', duration: '2分钟', tips: '趁热' }
    ],
    tips: ['汤要烫', '蛋要煎', '香菜提味']
  },
  {
    name: '阳春面',
    category: '早餐',
    tags: '面条,阳春面,上海,清淡',
    difficulty: '简单',
    cooking_time: '15分钟',
    servings: '1人份',
    description: '汤清味鲜、面条爽滑',
    image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
    ingredients: [
      { name: '细面条', amount: '150g', category: '主食', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '调汤', description: '碗中放猪油、生抽、盐', duration: '2分钟', tips: '猪油是关键' },
      { phase: '主料', title: '煮面', description: '水开下面条煮熟', duration: '8分钟', tips: '不要过' },
      { phase: '收尾', title: '冲汤', description: '面汤冲入碗中，放面条，撒葱花', duration: '2分钟', tips: '趁热' }
    ],
    tips: ['猪油提香', '汤要烫', '葱花多点']
  },
  {
    name: '皮蛋瘦肉粥',
    category: '早餐',
    tags: '粥,皮蛋,瘦肉,养生',
    difficulty: '简单',
    cooking_time: '30分钟',
    servings: '2人份',
    description: '粥香绵滑、皮蛋Q弹',
    image_url: 'https://images.unsplash.com/photo-1511690656952-34342d5c71df?w=800',
    ingredients: [
      { name: '大米', amount: '100g', category: '主食', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理食材', description: '皮蛋切丁，瘦肉切丝', duration: '5分钟', tips: '切小丁' },
      { phase: '主料', title: '煮粥', description: '米加水煮成粥', duration: '20分钟', tips: '要搅动' },
      { phase: '主料', title: '加料', description: '放入皮蛋、肉丝、姜丝', duration: '8分钟', tips: '后放' },
      { phase: '收尾', title: '调味', description: '加盐调味', duration: '1分钟', tips: '搅匀' }
    ],
    tips: ['米要提前泡', '皮蛋后放', '肉丝要嫩']
  },
  {
    name: '排骨粥',
    category: '早餐',
    tags: '粥,排骨,海鲜,营养',
    difficulty: '中等',
    cooking_time: '60分钟',
    servings: '3人份',
    description: '粥香肉嫩、营养丰富',
    image_url: 'https://images.unsplash.com/photo-1511690656952-34342d5c71df?w=800',
    ingredients: [
      { name: '大米', amount: '150g', category: '主食', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理排骨', description: '排骨焯水', duration: '10分钟', tips: '去血沫' },
      { phase: '主料', title: '煮粥', description: '米、排骨、姜片、干贝加水煮1小时', duration: '60分钟', tips: '小火' },
      { phase: '收尾', title: '调味', description: '加盐', duration: '1分钟', tips: '搅匀' }
    ],
    tips: ['要一次加足水', '小火慢熬', '干贝提鲜']
  },
  {
    name: '鸡肉粥',
    category: '早餐',
    tags: '粥,鸡肉,清淡,营养',
    difficulty: '简单',
    cooking_time: '30分钟',
    servings: '2人份',
    description: '粥香鸡肉嫩、营养早餐',
    image_url: 'https://images.unsplash.com/photo-1511690656952-34342d5c71df?w=800',
    ingredients: [
      { name: '大米', amount: '100g', category: '主食', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理鸡肉', description: '鸡肉切丝', duration: '5分钟', tips: '切细丝' },
      { phase: '主料', title: '煮粥', description: '米煮成粥', duration: '20分钟', tips: '搅动' },
      { phase: '主料', title: '加鸡肉', description: '放入鸡肉丝和姜丝', duration: '8分钟', tips: '后放' },
      { phase: '收尾', title: '调味', description: '加盐', duration: '1分钟', tips: '搅匀' }
    ],
    tips: ['鸡肉要切丝', '后放鸡肉', '保持嫩']
  },
  {
    name: '玉米粥',
    category: '早餐',
    tags: '粥,玉米,甜香,养胃',
    difficulty: '简单',
    cooking_time: '20分钟',
    servings: '2人份',
    description: '香甜绵软、养胃佳品',
    image_url: 'https://images.unsplash.com/photo-1511690656952-34342d5c71df?w=800',
    ingredients: [
      { name: '玉米面', amount: '100g', category: '主食', isOptional: false }
    ],
    steps: [
      { phase: '主料', title: '调面糊', description: '玉米面加水调成糊', duration: '5分钟', tips: '调匀' },
      { phase: '主料', title: '煮粥', description: '锅中水开，边倒面糊边搅', duration: '10分钟', tips: '要搅动' },
      { phase: '收尾', title: '调味', description: '加糖', duration: '1分钟', tips: '搅匀' }
    ],
    tips: ['要边倒边搅', '小火', '糖最后放']
  },
  {
    name: '小米粥',
    category: '早餐',
    tags: '粥,小米,养胃,清淡',
    difficulty: '简单',
    cooking_time: '30分钟',
    servings: '2人份',
    description: '养胃佳品、绵软香滑',
    image_url: 'https://images.unsplash.com/photo-1511690656952-34342d5c71df?w=800',
    ingredients: [
      { name: '小米', amount: '100g', category: '主食', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '浸泡', description: '小米提前浸泡30分钟', duration: '30分钟', tips: '提前泡' },
      { phase: '主料', title: '煮粥', description: '加水煮30分钟', duration: '30分钟', tips: '小火' },
      { phase: '收尾', title: '加红枣', description: '红枣去核放入', duration: '5分钟', tips: '后放' }
    ],
    tips: ['要提前泡', '小火慢熬', '红枣后放']
  },
  {
    name: '土豆烧牛肉',
    category: '午餐',
    tags: '土豆,牛肉,炖菜,家常',
    difficulty: '中等',
    cooking_time: '90分钟',
    servings: '4人份',
    description: '牛肉软烂、土豆绵软',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    ingredients: [
      { name: '牛肉', amount: '500g', category: '主料', isOptional: false },
      { name: '土豆', amount: '2个', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理牛肉', description: '牛肉切块，焯水', duration: '10分钟', tips: '去血沫' },
      { phase: '主料', title: '炖牛肉', description: '加葱姜、生抽，小火炖1小时', duration: '60分钟', tips: '一次加足水' },
      { phase: '主料', title: '加土豆', description: '土豆切块放入', duration: '5分钟', tips: '后半程放' },
      { phase: '收尾', title: '调味', description: '加盐调味', duration: '2分钟', tips: '盐后放' }
    ],
    tips: ['牛肉要选带筋的', '土豆后放', '一次加足水']
  },
  {
    name: '黄焖鸡',
    category: '午餐',
    tags: '鸡肉,黄焖,砂锅,家常',
    difficulty: '中等',
    cooking_time: '40分钟',
    servings: '2-3人份',
    description: '鸡肉鲜嫩、汤汁浓郁',
    image_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800',
    ingredients: [
      { name: '鸡腿', amount: '3个', category: '主料', isOptional: false },
      { name: '香菇', amount: '5朵', category: '配菜', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理食材', description: '鸡腿剁块，香菇泡发', duration: '10分钟', tips: '香菇要泡发' },
      { phase: '主料', title: '炒制', description: '锅中炒香调料，加鸡块翻炒', duration: '8分钟', tips: '炒到变色' },
      { phase: '主料', title: '焖煮', description: '加水和香菇，小火焖20分钟', duration: '25分钟', tips: '砂锅更好' },
      { phase: '收尾', title: '加青椒', description: '放入青椒，收汁', duration: '5分钟', tips: '青椒后放' }
    ],
    tips: ['用砂锅', '香菇提鲜', '青椒后放保持脆']
  },
  {
    name: '三杯鸡',
    category: '午餐',
    tags: '鸡肉,三杯,台湾,家常',
    difficulty: '中等',
    cooking_time: '40分钟',
    servings: '2-3人份',
    description: '香气浓郁、鸡肉嫩滑',
    image_url: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800',
    ingredients: [
      { name: '鸡腿', amount: '3个', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理鸡块', description: '鸡腿剁块', duration: '5分钟', tips: '大小适中' },
      { phase: '主料', title: '炒制', description: '锅中热油，放入鸡块翻炒', duration: '8分钟', tips: '炒到金黄' },
      { phase: '主料', title: '三杯焖煮', description: '加入三杯调料和冰糖，小火焖20分钟', duration: '25分钟', tips: '没过鸡块' },
      { phase: '收尾', title: '加九层塔', description: '放入九层塔，翻匀出锅', duration: '2分钟', tips: '最后放' }
    ],
    tips: ['三杯比例1:1:1', '九层塔最后放', '小米酒更香']
  },
  {
    name: '大盘鸡',
    category: '午餐',
    tags: '鸡肉,土豆,辣,新疆',
    difficulty: '中等',
    cooking_time: '50分钟',
    servings: '4人份',
    description: '麻辣鲜香、鸡肉嫩滑',
    image_url: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800',
    ingredients: [
      { name: '鸡腿', amount: '4个', category: '主料', isOptional: false },
      { name: '土豆', amount: '2个', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理食材', description: '鸡块土豆切块', duration: '10分钟', tips: '土豆切块' },
      { phase: '主料', title: '炒制', description: '炒香调料，加鸡块翻炒', duration: '10分钟', tips: '炒到变色' },
      { phase: '主料', title: '焖煮', description: '加水没过鸡块，小火焖20分钟', duration: '25分钟', tips: '土豆后放' },
      { phase: '收尾', title: '加配菜', description: '放入青椒，收汁', duration: '5分钟', tips: '青椒保持脆' }
    ],
    tips: ['土豆后放', '青椒最后放', '汤汁拌面']
  },
  {
    name: '盐焗鸡',
    category: '午餐',
    tags: '鸡肉,盐焗,广东,嫩滑',
    difficulty: '中等',
    cooking_time: '60分钟',
    servings: '4人份',
    description: '皮脆肉嫩、鲜香入味',
    image_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800',
    ingredients: [
      { name: '三黄鸡', amount: '1只', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理鸡', description: '鸡洗净，擦干水分', duration: '10分钟', tips: '要擦干' },
      { phase: '备菜', title: '腌制', description: '鸡身擦盐和调料，腌制1小时', duration: '60分钟', tips: '按摩入味' },
      { phase: '主料', title: '盐焗', description: '粗盐炒热，埋入鸡，焗40分钟', duration: '45分钟', tips: '盐要热' },
      { phase: '收尾', title: '拆肉', description: '拆肉装盘', duration: '5分钟', tips: '小心烫' }
    ],
    tips: ['鸡要擦干', '盐要炒热', '焗够时间']
  },
  {
    name: '白切鸡',
    category: '午餐',
    tags: '鸡肉,白切,广东,清淡',
    difficulty: '中等',
    cooking_time: '40分钟',
    servings: '4人份',
    description: '鸡肉鲜嫩、原汁原味',
    image_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800',
    ingredients: [
      { name: '三黄鸡', amount: '1只', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理鸡', description: '鸡洗净', duration: '5分钟', tips: '去内脏' },
      { phase: '主料', title: '煮鸡', description: '水中加姜葱，烧开后放入鸡，小火煮20分钟', duration: '25分钟', tips: '不要大开' },
      { phase: '主料', title: '冰镇', description: '捞出放入冰水', duration: '10分钟', tips: '皮更脆' },
      { phase: '收尾', title: '切块', description: '斩件装盘，配蘸料', duration: '5分钟', tips: '要磨刀' }
    ],
    tips: ['水不要大开', '冰水镇凉', '蘸料根据口味']
  },
  {
    name: '口水鸡',
    category: '凉菜',
    tags: '鸡肉,口水,麻辣,四川',
    difficulty: '中等',
    cooking_time: '30分钟',
    servings: '2-3人份',
    description: '麻辣鲜香、鸡肉嫩滑',
    image_url: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800',
    ingredients: [
      { name: '鸡腿', amount: '2个', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '煮鸡腿', description: '鸡腿煮熟，放入冰水', duration: '20分钟', tips: '煮15分钟' },
      { phase: '主料', title: '调汁', description: '辣椒油、花椒粉、蒜末、酱油调成汁', duration: '5分钟', tips: '调匀' },
      { phase: '收尾', title: '浇汁', description: '鸡腿切块，浇上料汁，撒花生碎芝麻', duration: '5分钟', tips: '拌匀' }
    ],
    tips: ['鸡腿要煮熟', '料汁要调好', '花生碎增香']
  },
  {
    name: '蒸酿豆腐',
    category: '素菜',
    tags: '豆腐,蒸菜,清淡,营养',
    difficulty: '中等',
    cooking_time: '30分钟',
    servings: '2人份',
    description: '豆腐嫩滑、肉馅鲜美',
    image_url: 'https://images.unsplash.com/photo-1582576163090-09d3b6f8a969?w=800',
    ingredients: [
      { name: '嫩豆腐', amount: '1块', category: '主料', isOptional: false },
      { name: '猪肉末', amount: '100g', category: '主料', isOptional: false }
    ],
    steps: [
      { phase: '备菜', title: '处理豆腐', description: '豆腐切块，中间挖洞', duration: '10分钟', tips: '挖洞不挖穿' },
      { phase: '备菜', title: '调馅', description: '肉末加香菇碎、盐拌匀', duration: '5分钟', tips: '拌匀' },
      { phase: '主料', title: '酿豆腐', description: '肉馅塞入豆腐孔中', duration: '10分钟', tips: '塞紧' },
      { phase: '主料', title: '蒸制', description: '上锅蒸15分钟', duration: '15分钟', tips: '大火' },
      { phase: '收尾', title: '勾芡', description: '蒸出的汤汁勾芡淋上', duration: '3分钟', tips: '芡要薄' }
    ],
    tips: ['豆腐要嫩', '肉馅要塞紧', '蒸够时间']
  }
];

// 插入额外菜品
const db = getDatabase();
const insertDish = db.prepare(`
  INSERT INTO dishes (id, name, category, tags, difficulty, cooking_time, servings, description, ingredients, steps, tips, image_url)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const existingCount = db.prepare('SELECT COUNT(*) as count FROM dishes').get().count;
let idNum = existingCount + 1;

additionalDishes.forEach((dish) => {
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
