import { v4 as uuidv4 } from 'uuid';

// 100+道家常菜种子数据 - 完整版
export const seedData = (db) => {
  const dishes = [
    // ========== 肉类菜品 (1-25) ==========
    {
      name: '红烧肉',
      category: '午餐',
      tags: '五花肉,红烧,家常菜,硬菜',
      difficulty: '中等',
      cooking_time: '45分钟',
      servings: '2-3人份',
      description: '色泽红亮、肥而不腻的经典红烧肉，肥肉入口即化，瘦肉软糯香浓',
      image_url: 'https://images.unsplash.com/photo-1623595119708-26b1f7300075?w=800',
      ingredients: [
        { name: '五花肉', amount: '500g', category: '主料', isOptional: false },
        { name: '冰糖', amount: '30g', category: '调料', isOptional: false },
        { name: '生抽', amount: '2勺', category: '调料', isOptional: false },
        { name: '老抽', amount: '1勺', category: '调料', isOptional: false },
        { name: '料酒', amount: '1勺', category: '调料', isOptional: false },
        { name: '葱姜', amount: '适量', category: '调料', isOptional: false },
        { name: '八角', amount: '2个', category: '调料', isOptional: true },
        { name: '桂皮', amount: '1小块', category: '调料', isOptional: true }
      ],
      steps: [
        { phase: '备菜', title: '处理五花肉', description: '五花肉洗净，切成3cm左右的方块', duration: '10分钟', tips: '切块大小要均匀，肥瘦比例建议3:7', requiredTools: ['菜刀', '砧板'] },
        { phase: '备菜', title: '焯水去腥', description: '冷水下锅，加入姜片、料酒，大火烧开后撇去浮沫，捞出沥干水分', duration: '8分钟', tips: '一定要冷水下锅，这样才能把血水逼出来' },
        { phase: '主料', title: '炒糖色', description: '锅中放少许油，加入冰糖小火慢炒，直到糖融化变成琥珀色', duration: '5分钟', tips: '火一定要小！糖色炒过了会发苦', requiredTools: ['炒锅', '铲子'] },
        { phase: '主料', title: '翻炒上色', description: '放入五花肉块，中火翻炒均匀，让每块肉都裹上糖色', duration: '5分钟', tips: '翻炒要轻柔，避免糖色脱落' },
        { phase: '主料', title: '加入调料', description: '加入生抽、老抽、料酒、葱姜、八角、桂皮', duration: '2分钟', tips: '调料可以根据个人口味调整' },
        { phase: '主料', title: '炖煮入味', description: '加入适量开水，大火烧开后转小火炖40分钟', duration: '45分钟', tips: '水要没过肉，小火慢炖是关键', requiredTools: ['炖锅或砂锅'] },
        { phase: '收尾', title: '大火收汁', description: '转大火收汁，直到汤汁浓稠包裹在肉上，撒上葱花即可', duration: '5分钟', tips: '收汁时要不断翻动，防止糊底' }
      ],
      tips: ['五花肉选择肥瘦相间的口感更好', '炒糖色是关键环节，宁可糖色浅也不要炒过了', '最后大火收汁会让肉更有光泽']
    },
    {
      name: '糖醋排骨',
      category: '午餐',
      tags: '排骨,糖醋,肉类,家常菜',
      difficulty: '中等',
      cooking_time: '40分钟',
      servings: '2-3人份',
      description: '酸甜可口、肉质酥嫩，糖醋汁包裹排骨，色泽红亮',
      image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
      ingredients: [
        { name: '肋排', amount: '500g', category: '主料', isOptional: false },
        { name: '番茄酱', amount: '3勺', category: '调料', isOptional: false },
        { name: '白糖', amount: '2勺', category: '调料', isOptional: false },
        { name: '香醋', amount: '2勺', category: '调料', isOptional: false },
        { name: '生抽', amount: '1勺', category: '调料', isOptional: false },
        { name: '白芝麻', amount: '适量', category: '装饰', isOptional: true },
        { name: '葱姜', amount: '适量', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '排骨处理', description: '排骨洗净，冷水下锅焯水去血沫，捞出沥干备用', duration: '10分钟', tips: '焯水时加几片姜和料酒可以更好去腥' },
        { phase: '备菜', title: '调制糖醋汁', description: '碗中加入番茄酱、糖、醋、生抽和少许清水，搅拌均匀', duration: '2分钟', tips: '糖醋比例可根据口味调整' },
        { phase: '主料', title: '煎制排骨', description: '锅中放油，将排骨煎至两面金黄', duration: '8分钟', tips: '中小火慢煎，外酥里嫩更好吃' },
        { phase: '主料', title: '糖醋翻炒', description: '倒入调好的糖醋汁，大火煮开后转小火焖煮15分钟', duration: '20分钟', tips: '焖煮让排骨充分吸收糖醋味' },
        { phase: '收尾', title: '收汁装盘', description: '大火收汁至浓稠，撒上白芝麻即可', duration: '5分钟', tips: '收汁时要不断翻动，让每块排骨都裹满酱汁' }
      ],
      tips: ['排骨选择肋排，肉质更嫩', '糖醋汁可以根据口味调整酸甜度', '最后收汁要快，避免排骨煮得太软']
    },
    {
      name: '宫保鸡丁',
      category: '午餐',
      tags: '鸡胸肉,川菜,辣,家常菜',
      difficulty: '简单',
      cooking_time: '25分钟',
      servings: '2-3人份',
      description: '香辣鲜嫩、花生酥脆，鸡肉滑嫩，花生香脆，经典川菜',
      image_url: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800',
      ingredients: [
        { name: '鸡胸肉', amount: '300g', category: '主料', isOptional: false },
        { name: '花生米', amount: '50g', category: '主料', isOptional: false },
        { name: '干辣椒', amount: '10个', category: '调料', isOptional: false },
        { name: '花椒', amount: '1小把', category: '调料', isOptional: false },
        { name: '黄瓜', amount: '1根', category: '配菜', isOptional: true },
        { name: '生抽', amount: '2勺', category: '调料', isOptional: false },
        { name: '醋', amount: '1勺', category: '调料', isOptional: false },
        { name: '淀粉', amount: '1勺', category: '调料', isOptional: false },
        { name: '白糖', amount: '1勺', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '腌制鸡丁', description: '鸡胸肉切成1.5cm小丁，用1勺料酒、1勺淀粉、少许盐腌制15分钟', duration: '15分钟', tips: '腌制时间越长鸡肉越嫩滑' },
        { phase: '备菜', title: '准备配料', description: '干辣椒切段去籽，花椒备用，黄瓜切丁', duration: '5分钟', tips: '辣椒段可以用水泡一下，炒的时候不容易糊' },
        { phase: '备菜', title: '调制碗汁', description: '生抽2勺、醋1勺、糖1勺、淀粉1勺加少许水调成碗汁', duration: '2分钟', tips: '碗汁提前调好，炒菜时不会手忙脚乱' },
        { phase: '主料', title: '滑炒鸡丁', description: '锅中热油，倒入鸡丁滑炒至变色盛出', duration: '3分钟', tips: '油温不要太高，保持中火即可' },
        { phase: '主料', title: '爆香炒制', description: '锅中留底油，放入花椒、干辣椒段爆香，倒入鸡丁和黄瓜丁翻炒', duration: '4分钟', tips: '辣椒和花椒炒出香味后再下其他材料' },
        { phase: '收尾', title: '出锅装盘', description: '倒入碗汁快速翻炒，加入花生米翻匀即可出锅', duration: '2分钟', tips: '花生米最后放，保持酥脆口感' }
      ],
      tips: ['花生米用小火炒至金黄会更香', '鸡丁不要切太大，不容易入味', '最后翻炒要快，保持花生酥脆']
    },
    {
      name: '番茄炒蛋',
      category: '午餐',
      tags: '番茄,鸡蛋,家常菜,素菜',
      difficulty: '简单',
      cooking_time: '15分钟',
      servings: '2人份',
      description: '国民家常菜，酸甜开胃，鸡蛋蓬松，番茄多汁',
      image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
      ingredients: [
        { name: '番茄', amount: '2个', category: '主料', isOptional: false },
        { name: '鸡蛋', amount: '3个', category: '主料', isOptional: false },
        { name: '葱花', amount: '适量', category: '装饰', isOptional: true },
        { name: '盐', amount: '适量', category: '调料', isOptional: false },
        { name: '白糖', amount: '1勺', category: '调料', isOptional: false },
        { name: '食用油', amount: '适量', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '处理番茄', description: '番茄顶部划十字，开水烫30秒后去皮切块', duration: '3分钟', tips: '去皮后炒的时候更容易出汁' },
        { phase: '备菜', title: '打散鸡蛋', description: '鸡蛋打入碗中，加少许盐搅拌均匀', duration: '1分钟', tips: '可以加几滴醋，鸡蛋更蓬松' },
        { phase: '主料', title: '炒蛋', description: '锅中热油，倒入蛋液，用铲子快速划散，炒至七成熟盛出', duration: '2分钟', tips: '不要炒太老，七成熟最嫩滑' },
        { phase: '主料', title: '炒番茄', description: '锅中留底油，放入番茄块翻炒出汁', duration: '4分钟', tips: '可以用铲子压一压，帮助出汁' },
        { phase: '主料', title: '混合调味', description: '加入少许糖和盐，放入鸡蛋翻炒均匀', duration: '2分钟', tips: '糖可以提鲜，中和番茄的酸味' },
        { phase: '收尾', title: '出锅', description: '撒上葱花即可出锅', duration: '1分钟', tips: '葱花最后放，保留香味' }
      ],
      tips: ['番茄要选熟透的，颜色鲜红、手感略软的', '炒蛋时油温要够热，蛋才蓬松', '最后混合时不要炒太久，蛋会老']
    },
    {
      name: '鱼香肉丝',
      category: '午餐',
      tags: '猪肉,川菜,酸辣,家常菜',
      difficulty: '中等',
      cooking_time: '30分钟',
      servings: '2-3人份',
      description: '酸甜微辣、下饭神器，肉丝嫩滑，配料丰富',
      image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800',
      ingredients: [
        { name: '猪里脊肉', amount: '250g', category: '主料', isOptional: false },
        { name: '木耳', amount: '50g', category: '配菜', isOptional: false },
        { name: '胡萝卜', amount: '1根', category: '配菜', isOptional: false },
        { name: '青椒', amount: '1个', category: '配菜', isOptional: true },
        { name: '泡椒', amount: '适量', category: '调料', isOptional: false },
        { name: '蒜末', amount: '适量', category: '调料', isOptional: false },
        { name: '姜末', amount: '适量', category: '调料', isOptional: false },
        { name: '生抽', amount: '2勺', category: '调料', isOptional: false },
        { name: '醋', amount: '1勺', category: '调料', isOptional: false },
        { name: '白糖', amount: '1勺', category: '调料', isOptional: false },
        { name: '淀粉', amount: '1勺', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '切丝腌制', description: '猪里脊肉切丝，用盐、料酒、淀粉腌制10分钟', duration: '10分钟', tips: '肉丝顺着纹理切，口感更嫩' },
        { phase: '备菜', title: '准备配菜', description: '木耳泡发切丝，胡萝卜、青椒切丝备用', duration: '5分钟', tips: '所有配菜切成差不多大小的丝' },
        { phase: '备菜', title: '调制鱼香汁', description: '泡椒末、蒜末、姜末、糖、醋、生抽混合', duration: '2分钟', tips: '糖醋比例2:1是经典鱼香味' },
        { phase: '主料', title: '滑炒肉丝', description: '锅中热油，放入肉丝滑炒至变色盛出', duration: '3分钟', tips: '油温中火，防止肉丝粘连' },
        { phase: '主料', title: '翻炒配料', description: '爆香姜蒜末和泡椒，放入胡萝卜丝、木耳丝、青椒丝翻炒', duration: '5分钟', tips: '胡萝卜可以先焯水，更容易熟' },
        { phase: '收尾', title: '勾芡出锅', description: '加入肉丝和鱼香汁翻炒，水淀粉勾芡即可', duration: '3分钟', tips: '勾芡让味道更好地包裹在食材上' }
      ],
      tips: ['正宗鱼香味需要泡椒，没有可以用豆瓣酱代替', '配菜可以根据家里有的灵活调整', '肉丝不要炒太久，会变老']
    },
    {
      name: '回锅肉',
      category: '午餐',
      tags: '五花肉,川菜,辣,家常菜',
      difficulty: '中等',
      cooking_time: '30分钟',
      servings: '2-3人份',
      description: '肥而不腻、咸香下饭，薄薄的肉片微微卷曲，镬气十足',
      image_url: 'https://images.unsplash.com/photo-1603360946369-dc9bb6f5a34a?w=800',
      ingredients: [
        { name: '五花肉', amount: '400g', category: '主料', isOptional: false },
        { name: '青蒜苗', amount: '200g', category: '配菜', isOptional: false },
        { name: '郫县豆瓣酱', amount: '2勺', category: '调料', isOptional: false },
        { name: '甜面酱', amount: '1勺', category: '调料', isOptional: false },
        { name: '料酒', amount: '1勺', category: '调料', isOptional: false },
        { name: '白糖', amount: '半勺', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '煮五花肉', description: '五花肉整块冷水下锅，加姜片、料酒煮20分钟至筷子能插入', duration: '20分钟', tips: '煮的时候不要煮太烂，后面还要炒' },
        { phase: '备菜', title: '切配', description: '捞出放凉后切薄片，青蒜斜切段，蒜白和蒜叶分开', duration: '5分钟', tips: '肉切得越薄越好卷' },
        { phase: '主料', title: '煸炒出油', description: '锅中不放油，直接放入肉片中小火煸炒至出油微微卷曲', duration: '8分钟', tips: '这是回锅肉的关键，煸出多余油脂' },
        { phase: '主料', title: '调味炒制', description: '加入郫县豆瓣酱炒出红油，放入甜面酱、少许糖翻炒上色', duration: '4分钟', tips: '豆瓣酱要炒出红油才香' },
        { phase: '收尾', title: '加入蒜苗', description: '先放入蒜白翻炒，最后放入蒜叶翻匀即可出锅', duration: '2分钟', tips: '蒜叶不要炒太久，保持翠绿' }
      ],
      tips: ['五花肉选肥瘦相间的，口感最好', '煮过的肉要放凉切才不容易散', '煸肉时火不要太大，慢慢煸出油']
    },
    {
      name: '可乐鸡翅',
      category: '午餐',
      tags: '鸡翅,可乐,家常菜,甜口',
      difficulty: '简单',
      cooking_time: '30分钟',
      servings: '2-3人份',
      description: '香甜可口、老少皆宜，鸡翅色泽红亮，甜中带咸',
      image_url: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800',
      ingredients: [
        { name: '鸡翅中', amount: '500g', category: '主料', isOptional: false },
        { name: '可乐', amount: '330ml', category: '调料', isOptional: false },
        { name: '生抽', amount: '2勺', category: '调料', isOptional: false },
        { name: '老抽', amount: '1勺', category: '调料', isOptional: false },
        { name: '料酒', amount: '1勺', category: '调料', isOptional: false },
        { name: '白芝麻', amount: '适量', category: '装饰', isOptional: true }
      ],
      steps: [
        { phase: '备菜', title: '处理鸡翅', description: '鸡翅洗净，两面各划两刀便于入味', duration: '3分钟', tips: '划刀不要太深，以免煮的时候散开' },
        { phase: '备菜', title: '焯水', description: '冷水下锅焯水去血沫，捞出沥干', duration: '8分钟', tips: '加几片姜和料酒去腥' },
        { phase: '主料', title: '煎制', description: '锅中热油，放入鸡翅煎至两面金黄', duration: '6分钟', tips: '煎出鸡皮油脂，更香' },
        { phase: '主料', title: '可乐炖煮', description: '倒入可乐没过鸡翅，加入生抽、老抽、料酒，大火烧开后转小火焖煮15分钟', duration: '20分钟', tips: '可乐不要用无糖的，味道会差很多' },
        { phase: '收尾', title: '收汁', description: '大火收汁至浓稠，撒上白芝麻即可', duration: '5分钟', tips: '收汁时要不断翻动，让鸡翅均匀裹上酱汁' }
      ],
      tips: ['鸡翅划刀后更容易入味', '可乐要用普通含糖的', '最后收汁要快，防止糊底']
    },
    {
      name: '红烧排骨',
      category: '午餐',
      tags: '排骨,红烧,肉类,家常菜',
      difficulty: '简单',
      cooking_time: '40分钟',
      servings: '2-3人份',
      description: '酱香浓郁、肉质软烂，排骨色泽红亮，咸香下饭',
      image_url: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=800',
      ingredients: [
        { name: '肋排', amount: '500g', category: '主料', isOptional: false },
        { name: '冰糖', amount: '20g', category: '调料', isOptional: false },
        { name: '生抽', amount: '2勺', category: '调料', isOptional: false },
        { name: '老抽', amount: '1勺', category: '调料', isOptional: false },
        { name: '葱姜', amount: '适量', category: '调料', isOptional: false },
        { name: '八角', amount: '2个', category: '调料', isOptional: true }
      ],
      steps: [
        { phase: '备菜', title: '排骨处理', description: '排骨洗净，冷水下锅焯水去血沫', duration: '10分钟', tips: '焯水时加姜片和料酒' },
        { phase: '主料', title: '炒糖色', description: '锅中放油，加冰糖小火炒至琥珀色', duration: '5分钟', tips: '糖色是红烧的关键' },
        { phase: '主料', title: '翻炒上色', description: '放入排骨翻炒上色', duration: '5分钟', tips: '翻炒要均匀' },
        { phase: '主料', title: '炖煮', description: '加入葱姜、八角、生抽、老抽，加开水没过排骨，大火烧开后转小火炖30分钟', duration: '35分钟', tips: '开水要一次加够' },
        { phase: '收尾', title: '收汁', description: '加盐调味，大火收汁即可', duration: '5分钟', tips: '盐最后放，肉更嫩' }
      ],
      tips: ['排骨选择肋排，肉更嫩', '糖色宁浅勿深', '小火慢炖让排骨更入味']
    },
    {
      name: '麻婆豆腐',
      category: '午餐',
      tags: '豆腐,川菜,辣,麻',
      difficulty: '中等',
      cooking_time: '20分钟',
      servings: '2人份',
      description: '麻辣鲜香、嫩滑爽口，豆腐吸满麻辣汤汁',
      image_url: 'https://images.unsplash.com/photo-1582576163090-09d3b6f8a969?w=800',
      ingredients: [
        { name: '嫩豆腐', amount: '1块', category: '主料', isOptional: false },
        { name: '猪肉末', amount: '100g', category: '主料', isOptional: false },
        { name: '郫县豆瓣酱', amount: '1勺', category: '调料', isOptional: false },
        { name: '豆豉', amount: '适量', category: '调料', isOptional: false },
        { name: '蒜末', amount: '适量', category: '调料', isOptional: false },
        { name: '花椒粉', amount: '适量', category: '调料', isOptional: false },
        { name: '水淀粉', amount: '适量', category: '调料', isOptional: false },
        { name: '葱花', amount: '适量', category: '装饰', isOptional: true }
      ],
      steps: [
        { phase: '备菜', title: '豆腐处理', description: '豆腐切成2cm小块，用盐水浸泡10分钟', duration: '10分钟', tips: '盐水浸泡让豆腐更紧实，不容易碎' },
        { phase: '主料', title: '炒肉末', description: '锅中热油，放入肉末炒散炒香', duration: '5分钟', tips: '肉末炒到微微焦香更好吃' },
        { phase: '主料', title: '调味', description: '加入豆瓣酱炒出红油，加入豆豉、姜末、蒜末炒香', duration: '3分钟', tips: '小火炒，防止糊底' },
        { phase: '主料', title: '炖煮', description: '加入适量清水，轻轻放入豆腐块，小火炖煮5分钟', duration: '8分钟', tips: '不要用勺子搅动，轻轻晃动锅即可' },
        { phase: '收尾', title: '勾芡', description: '水淀粉勾芡，撒上花椒粉和葱花', duration: '2分钟', tips: '花椒粉最后撒，麻味更浓郁' }
      ],
      tips: ['用嫩豆腐，口感更滑', '豆腐用盐水泡过不容易碎', '炒的时候动作要轻']
    },
    {
      name: '水煮肉片',
      category: '午餐',
      tags: '猪肉,川菜,辣,水煮',
      difficulty: '中等',
      cooking_time: '35分钟',
      servings: '3-4人份',
      description: '麻辣鲜香、肉片嫩滑，底部配菜吸满红油',
      image_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800',
      ingredients: [
        { name: '猪里脊肉', amount: '300g', category: '主料', isOptional: false },
        { name: '豆芽', amount: '200g', category: '配菜', isOptional: false },
        { name: '白菜', amount: '200g', category: '配菜', isOptional: false },
        { name: '郫县豆瓣酱', amount: '2勺', category: '调料', isOptional: false },
        { name: '蒜末', amount: '适量', category: '调料', isOptional: false },
        { name: '花椒粉', amount: '适量', category: '调料', isOptional: false },
        { name: '辣椒粉', amount: '适量', category: '调料', isOptional: false },
        { name: '淀粉', amount: '1勺', category: '调料', isOptional: false },
        { name: '鸡蛋清', amount: '1个', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '切片腌制', description: '猪里脊肉切薄片，用盐、淀粉、蛋清腌制15分钟', duration: '15分钟', tips: '肉片越薄越好' },
        { phase: '备菜', title: '焯配菜', description: '豆芽、白菜焯水捞出垫底', duration: '5分钟', tips: '配菜可以吸收红油，很好吃' },
        { phase: '主料', title: '炒底料', description: '锅中热油，爆香姜蒜末和豆瓣酱，加入高汤或清水煮开', duration: '5分钟', tips: '豆瓣酱要炒出红油' },
        { phase: '主料', title: '煮肉片', description: '将肉片逐一放入锅中滑熟', duration: '5分钟', tips: '水不要沸腾，保持微开状态' },
        { phase: '收尾', title: '淋油', description: '连汤带肉倒入碗中，放上蒜末、花椒粉、辣椒粉，淋上热油', duration: '3分钟', tips: '热油要冒烟，才能激发香味' }
      ],
      tips: ['肉片要切薄片，这样容易入味', '腌肉时加蛋清会更嫩滑', '淋油时油温要够高']
    },
    {
      name: '青椒肉丝',
      category: '午餐',
      tags: '青椒,猪肉,家常菜,快手菜',
      difficulty: '简单',
      cooking_time: '20分钟',
      servings: '2人份',
      description: '清爽不腻、翠绿爽口，简单快手的家常小炒',
      image_url: 'https://images.unsplash.com/photo-1603133872878-684f5c9322ed?w=800',
      ingredients: [
        { name: '猪里脊肉', amount: '200g', category: '主料', isOptional: false },
        { name: '青椒', amount: '3个', category: '主料', isOptional: false },
        { name: '生抽', amount: '1勺', category: '调料', isOptional: false },
        { name: '淀粉', amount: '1勺', category: '调料', isOptional: false },
        { name: '盐', amount: '适量', category: '调料', isOptional: false },
        { name: '蒜末', amount: '适量', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '切丝腌制', description: '猪肉切丝，用生抽、淀粉腌制10分钟', duration: '10分钟', tips: '加少许油可以让肉丝更滑' },
        { phase: '备菜', title: '切青椒', description: '青椒去籽切丝', duration: '3分钟', tips: '切丝要均匀' },
        { phase: '主料', title: '炒肉丝', description: '锅中热油，放入肉丝炒至变色盛出', duration: '3分钟', tips: '大火快炒' },
        { phase: '主料', title: '炒青椒', description: '放入青椒丝翻炒至断生', duration: '3分钟', tips: '保持青椒脆感' },
        { phase: '收尾', title: '合炒调味', description: '倒入肉丝，加盐翻炒均匀', duration: '2分钟', tips: '快速翻炒' }
      ],
      tips: ['青椒不要炒太久，保持脆感', '肉丝腌制后更嫩', '大火快炒保持口感']
    },
    {
      name: '蒜苔炒肉',
      category: '午餐',
      tags: '蒜苔,猪肉,家常菜,时令',
      difficulty: '简单',
      cooking_time: '15分钟',
      servings: '2人份',
      description: '蒜香浓郁、肉丝鲜嫩，春季时令美味',
      image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
      ingredients: [
        { name: '蒜苔', amount: '300g', category: '主料', isOptional: false },
        { name: '猪肉', amount: '150g', category: '主料', isOptional: false },
        { name: '生抽', amount: '1勺', category: '调料', isOptional: false },
        { name: '盐', amount: '适量', category: '调料', isOptional: false },
        { name: '姜丝', amount: '适量', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '处理蒜苔', description: '蒜苔洗净，切成4cm段', duration: '3分钟', tips: '蒜苔根部较老，可切掉一点' },
        { phase: '备菜', title: '切肉丝', description: '猪肉切丝，用生抽腌制', duration: '5分钟', tips: '腌5分钟即可' },
        { phase: '主料', title: '炒肉', description: '锅中热油，放入肉丝炒至变色', duration: '3分钟', tips: '大火快炒' },
        { phase: '主料', title: '炒蒜苔', description: '放入蒜苔翻炒，加少许水焖煮2分钟', duration: '4分钟', tips: '加少许水让蒜苔更嫩' },
        { phase: '收尾', title: '调味', description: '加盐调味，翻炒均匀即可', duration: '1分钟', tips: '不要炒太久' }
      ],
      tips: ['蒜苔要选脆嫩的', '炒的时候加点水更嫩', '大火快炒']
    },
    {
      name: '木须肉',
      category: '午餐',
      tags: '猪肉,鸡蛋,木耳,家常菜',
      difficulty: '简单',
      cooking_time: '20分钟',
      servings: '2-3人份',
      description: '营养丰富、色彩诱人，肉片嫩滑，鸡蛋鲜香',
      image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
      ingredients: [
        { name: '猪里脊肉', amount: '150g', category: '主料', isOptional: false },
        { name: '鸡蛋', amount: '2个', category: '主料', isOptional: false },
        { name: '干木耳', amount: '30g', category: '配菜', isOptional: false },
        { name: '黄瓜', amount: '1根', category: '配菜', isOptional: false },
        { name: '胡萝卜', amount: '半根', category: '配菜', isOptional: false },
        { name: '生抽', amount: '1勺', category: '调料', isOptional: false },
        { name: '淀粉', amount: '1勺', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '泡发木耳', description: '木耳用温水泡发，洗净撕小朵', duration: '20分钟', tips: '提前泡发' },
        { phase: '备菜', title: '腌制肉片', description: '肉片用生抽、淀粉腌制10分钟', duration: '10分钟', tips: '肉片要切薄' },
        { phase: '备菜', title: '准备配菜', description: '黄瓜、胡萝卜切片，鸡蛋打散', duration: '5分钟', tips: '切配要均匀' },
        { phase: '主料', title: '炒鸡蛋', description: '锅中热油，倒入蛋液炒熟盛出', duration: '2分钟', tips: '不要炒太老' },
        { phase: '主料', title: '炒肉片', description: '放入肉片炒至变色', duration: '3分钟', tips: '大火快炒' },
        { phase: '主料', title: '合炒', description: '放入所有配菜和鸡蛋翻炒', duration: '3分钟', tips: '翻炒均匀' },
        { phase: '收尾', title: '调味', description: '加盐、生抽调味', duration: '1分钟', tips: '翻炒均匀即可' }
      ],
      tips: ['木耳要泡发透', '肉片提前腌制更嫩', '配菜可以生吃，翻炒时间不宜过长']
    },
    {
      name: '梅菜扣肉',
      category: '午餐',
      tags: '五花肉,梅菜,蒸菜,家常菜',
      difficulty: '中等',
      cooking_time: '90分钟',
      servings: '4人份',
      description: '肥而不腻、入口即化，梅菜咸香，层层叠叠',
      image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
      ingredients: [
        { name: '五花肉', amount: '500g', category: '主料', isOptional: false },
        { name: '梅菜', amount: '100g', category: '主料', isOptional: false },
        { name: '生抽', amount: '2勺', category: '调料', isOptional: false },
        { name: '老抽', amount: '1勺', category: '调料', isOptional: false },
        { name: '白糖', amount: '1勺', category: '调料', isOptional: false },
        { name: '姜末', amount: '适量', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '处理五花肉', description: '五花肉整块煮30分钟至筷子能插入', duration: '30分钟', tips: '煮到七成熟' },
        { phase: '备菜', title: '泡梅菜', description: '梅菜提前泡发，洗净切碎', duration: '30分钟', tips: '多换几次水去盐' },
        { phase: '备菜', title: '上色', description: '捞出肉块，表皮抹老抽上色', duration: '5分钟', tips: '要抹均匀' },
        { phase: '主料', title: '炸肉', description: '锅中热油，将肉皮朝下炸至金黄起泡', duration: '10分钟', tips: '盖锅盖防止溅油' },
        { phase: '主料', title: '炒梅菜', description: '锅中留底油，炒香姜末和梅菜，加生抽、糖调味', duration: '5分钟', tips: '梅菜要炒干水分' },
        { phase: '主料', title: '蒸制', description: '肉切片，皮朝下摆碗中，上面铺梅菜，蒸1小时', duration: '60分钟', tips: '要蒸够时间' },
        { phase: '收尾', title: '倒扣', description: '蒸好后倒扣在盘中即可', duration: '2分钟', tips: '小心烫手' }
      ],
      tips: ['炸肉时要盖锅盖', '梅菜要泡透去盐', '蒸的时间要够，肉才软烂']
    },
    {
      name: '东坡肉',
      category: '午餐',
      tags: '五花肉,红烧,杭帮菜,传统名菜',
      difficulty: '中等',
      cooking_time: '120分钟',
      servings: '4人份',
      description: '酥而不烂、肥而不腻，色泽红亮，入口即化',
      image_url: 'https://images.unsplash.com/photo-1623595119708-26b1f7300075?w=800',
      ingredients: [
        { name: '五花肉', amount: '500g', category: '主料', isOptional: false },
        { name: '冰糖', amount: '50g', category: '调料', isOptional: false },
        { name: '生抽', amount: '3勺', category: '调料', isOptional: false },
        { name: '老抽', amount: '1勺', category: '调料', isOptional: false },
        { name: '料酒', amount: '3勺', category: '调料', isOptional: false },
        { name: '葱段', amount: '适量', category: '调料', isOptional: false },
        { name: '姜片', amount: '适量', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '处理肉块', description: '五花肉切成4cm方块', duration: '10分钟', tips: '也可以用刀刮' },
        { phase: '备菜', title: '焯水', description: '冷水下锅，加料酒、姜片焯水去腥', duration: '10分钟', tips: '撇去浮沫' },
        { phase: '主料', title: '炒糖色', description: '锅中放油，放入冰糖炒至琥珀色', duration: '5分钟', tips: '小火慢炒' },
        { phase: '主料', title: '炖煮', description: '放入肉块翻炒上色，加入生抽、老抽、料酒、葱姜', duration: '5分钟', tips: '翻炒均匀' },
        { phase: '主料', title: '慢炖', description: '加入开水没过肉块，大火烧开转小火炖2小时', duration: '120分钟', tips: '小火慢炖是关键' },
        { phase: '收尾', title: '收汁', description: '大火收汁，肉块皮朝上装盘，淋上汤汁', duration: '10分钟', tips: '保持肉块完整' }
      ],
      tips: ['选择肥瘦相间的五花肉', '小火慢炖肉才软烂', '炖的过程中不要频繁掀盖']
    },
    {
      name: '叉烧肉',
      category: '午餐',
      tags: '猪肉,叉烧,粤菜,烤箱菜',
      difficulty: '中等',
      cooking_time: '60分钟',
      servings: '3-4人份',
      description: '色泽红亮、甜香软嫩，广式叉烧的经典风味',
      image_url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800',
      ingredients: [
        { name: '猪梅花肉', amount: '500g', category: '主料', isOptional: false },
        { name: '叉烧酱', amount: '3勺', category: '调料', isOptional: false },
        { name: '生抽', amount: '1勺', category: '调料', isOptional: false },
        { name: '老抽', amount: '1勺', category: '调料', isOptional: false },
        { name: '蜂蜜', amount: '2勺', category: '调料', isOptional: false },
        { name: '蒜末', amount: '适量', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '切块腌制', description: '猪肉切成长条，用叉烧酱、生抽、老抽、蒜末腌制4小时以上', duration: '240分钟', tips: '腌制时间越长越入味' },
        { phase: '主料', title: '预热烤箱', description: '烤箱预热200度', duration: '10分钟', tips: '提前预热' },
        { phase: '主料', title: '烤制', description: '肉条放在烤网上，下面铺烤盘接汁，烤20分钟后刷蜂蜜水再烤20分钟', duration: '40分钟', tips: '中途翻面' },
        { phase: '收尾', title: '切片', description: '烤好后冷却切片', duration: '5分钟', tips: '趁热切或冷却切都可以' }
      ],
      tips: ['腌制时间要够', '中途要刷蜂蜜水', '烤箱温度根据自家调整']
    },
    {
      name: '狮子头',
      category: '午餐',
      tags: '猪肉,淮扬菜,丸子,红烧',
      difficulty: '中等',
      cooking_time: '60分钟',
      servings: '4人份',
      description: '肉质鲜嫩、入口即化，个大如狮子头',
      image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
      ingredients: [
        { name: '猪五花肉', amount: '400g', category: '主料', isOptional: false },
        { name: '马蹄', amount: '50g', category: '配菜', isOptional: false },
        { name: '鸡蛋', amount: '1个', category: '主料', isOptional: false },
        { name: '淀粉', amount: '2勺', category: '调料', isOptional: false },
        { name: '生抽', amount: '2勺', category: '调料', isOptional: false },
        { name: '冰糖', amount: '20g', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '处理肉末', description: '猪肉剁成粗粒状，马蹄去皮切碎', duration: '15分钟', tips: '不要剁太细，要有颗粒感' },
        { phase: '备菜', title: '调馅', description: '肉末加马蹄、鸡蛋、淀粉、盐顺时针搅拌上劲', duration: '10分钟', tips: '搅拌至起胶' },
        { phase: '主料', title: '整形', description: '取适量肉馅团成大肉圆，约4-5cm直径', duration: '10分钟', tips: '双手摔打让它更紧实' },
        { phase: '主料', title: '红烧', description: '锅中热油，放入肉圆煎至表面金黄，加生抽、冰糖、水，小火炖40分钟', duration: '50分钟', tips: '火不要太大' },
        { phase: '收尾', title: '收汁', description: '大火收汁，让汤汁裹在肉圆上', duration: '5分钟', tips: '汤汁浓稠即可' }
      ],
      tips: ['肉要选五花肉，肥瘦相间', '马蹄增加脆爽口感', '小火慢炖才能酥软']
    },
    {
      name: '锅包肉',
      category: '午餐',
      tags: '猪肉,东北菜,酸甜,油炸',
      difficulty: '中等',
      cooking_time: '40分钟',
      servings: '3-4人份',
      description: '外酥里嫩、酸甜可口，东北经典名菜',
      image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800',
      ingredients: [
        { name: '猪里脊肉', amount: '300g', category: '主料', isOptional: false },
        { name: '胡萝卜', amount: '半根', category: '配菜', isOptional: false },
        { name: '葱丝', amount: '适量', category: '配菜', isOptional: false },
        { name: '姜丝', amount: '适量', category: '调料', isOptional: false },
        { name: '淀粉', amount: '100g', category: '调料', isOptional: false },
        { name: '白糖', amount: '3勺', category: '调料', isOptional: false },
        { name: '醋', amount: '2勺', category: '调料', isOptional: false },
        { name: '番茄酱', amount: '1勺', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '切肉片', description: '里脊肉切厚片，用刀背拍松', duration: '10分钟', tips: '拍松肉质更嫩' },
        { phase: '备菜', title: '调面糊', description: '淀粉加水调成稠糊，加少许油', duration: '5分钟', tips: '面糊要稠' },
        { phase: '备菜', title: '调汁', description: '糖、醋、番茄酱、少许盐调成酸甜汁', duration: '3分钟', tips: '糖醋比例2:1' },
        { phase: '主料', title: '炸丸子', description: '手中抹油，将肉馅团成4个大丸子，油温六成热下锅炸至金黄，捞出，油温升高复炸', duration: '15分钟', tips: '中小火炸' },
        { phase: '主料', title: '炒汁', description: '锅中留底油，放入胡萝卜丝、葱姜丝炒香，倒入酸甜汁', duration: '3分钟', tips: '汁要炒浓' },
        { phase: '收尾', title: '裹汁', description: '放入炸好的肉片快速翻匀，让汁裹在肉上', duration: '2分钟', tips: '动作要快' }
      ],
      tips: ['肉要拍松', '面糊要稠', '复炸才能酥脆']
    },
    {
      name: '糖醋里脊',
      category: '午餐',
      tags: '猪肉,糖醋,酸甜,油炸',
      difficulty: '简单',
      cooking_time: '30分钟',
      servings: '2-3人份',
      description: '酸甜酥脆、外酥里嫩，孩子最爱',
      image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
      ingredients: [
        { name: '猪里脊肉', amount: '300g', category: '主料', isOptional: false },
        { name: '淀粉', amount: '80g', category: '调料', isOptional: false },
        { name: '白糖', amount: '3勺', category: '调料', isOptional: false },
        { name: '醋', amount: '2勺', category: '调料', isOptional: false },
        { name: '番茄酱', amount: '2勺', category: '调料', isOptional: false },
        { name: '鸡蛋', amount: '1个', category: '主料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '切条腌制', description: '里脊肉切条，用盐、料酒腌制10分钟', duration: '10分钟', tips: '切条要均匀' },
        { phase: '备菜', title: '调面糊', description: '淀粉加鸡蛋调成稠糊', duration: '3分钟', tips: '稠糊能挂住' },
        { phase: '备菜', title: '调糖醋汁', description: '糖、醋、番茄酱、少许水调匀', duration: '2分钟', tips: '比例根据口味' },
        { phase: '主料', title: '炸里脊', description: '肉条裹面糊下锅炸至金黄，复炸一次', duration: '12分钟', tips: '复炸更酥' },
        { phase: '收尾', title: '裹汁', description: '倒入糖醋汁翻炒，让每条肉都裹上汁', duration: '3分钟', tips: '快速翻匀出锅' }
      ],
      tips: ['要复炸才酥脆', '糖醋汁要稠一些', '快速翻匀出锅']
    },
    {
      name: '京酱肉丝',
      category: '午餐',
      tags: '猪肉,北京,甜面酱,家常菜',
      difficulty: '中等',
      cooking_time: '25分钟',
      servings: '2-3人份',
      description: '酱香浓郁、肉丝嫩滑，用豆皮包裹食用',
      image_url: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800',
      ingredients: [
        { name: '猪里脊肉', amount: '300g', category: '主料', isOptional: false },
        { name: '甜面酱', amount: '2勺', category: '调料', isOptional: false },
        { name: '豆腐皮', amount: '2张', category: '配菜', isOptional: false },
        { name: '葱丝', amount: '适量', category: '配菜', isOptional: false },
        { name: '淀粉', amount: '1勺', category: '调料', isOptional: false },
        { name: '料酒', amount: '1勺', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '切丝腌制', description: '里脊肉切丝，用料酒、淀粉腌制15分钟', duration: '15分钟', tips: '切丝要细' },
        { phase: '备菜', title: '准备配菜', description: '豆腐皮切成方形，葱切细丝', duration: '5分钟', tips: '摆盘用' },
        { phase: '主料', title: '炒肉丝', description: '锅中热油，放入肉丝滑炒至变色盛出', duration: '3分钟', tips: '大火快炒' },
        { phase: '主料', title: '炒酱', description: '锅中留底油，放入甜面酱炒香，加少许糖', duration: '2分钟', tips: '酱要炒香' },
        { phase: '收尾', title: '裹酱', description: '放入肉丝翻炒均匀，让酱裹满肉丝', duration: '2分钟', tips: '快速翻匀' }
      ],
      tips: ['肉丝要切细', '甜面酱要炒香', '配豆腐皮和葱丝卷食']
    },
    {
      name: '蚂蚁上树',
      category: '午餐',
      tags: '猪肉,粉丝,川菜,家常菜',
      difficulty: '简单',
      cooking_time: '20分钟',
      servings: '2人份',
      description: '肉末如蚂蚁爬在粉丝上，香辣入味',
      image_url: 'https://images.unsplash.com/photo-1551863534-72f194c48e9f?w=800',
      ingredients: [
        { name: '猪肉末', amount: '100g', category: '主料', isOptional: false },
        { name: '粉丝', amount: '100g', category: '主料', isOptional: false },
        { name: '郫县豆瓣酱', amount: '1勺', category: '调料', isOptional: false },
        { name: '蒜末', amount: '适量', category: '调料', isOptional: false },
        { name: '生抽', amount: '1勺', category: '调料', isOptional: false },
        { name: '葱花', amount: '适量', category: '装饰', isOptional: true }
      ],
      steps: [
        { phase: '备菜', title: '泡粉丝', description: '粉丝用温水泡软，剪成小段', duration: '10分钟', tips: '泡到能用筷子夹断' },
        { phase: '主料', title: '炒肉末', description: '锅中热油，放入肉末炒散', duration: '3分钟', tips: '炒到干香' },
        { phase: '主料', title: '炒底料', description: '放入豆瓣酱、蒜末炒出红油', duration: '2分钟', tips: '小火炒' },
        { phase: '主料', title: '放入粉丝', description: '加入粉丝翻炒，加生抽和少许水', duration: '5分钟', tips: '让粉丝吸味' },
        { phase: '收尾', title: '出锅', description: '撒上葱花出锅', duration: '1分钟', tips: '粉丝要炒透' }
      ],
      tips: ['粉丝要泡软', '全程大火快炒', '粉丝吸味后要炒干']
    },
    {
      name: '肉末茄子',
      category: '午餐',
      tags: '茄子,猪肉,家常菜,下饭',
      difficulty: '简单',
      cooking_time: '25分钟',
      servings: '2-3人份',
      description: '软糯入味、酱香浓郁，茄子比肉还好吃',
      image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
      ingredients: [
        { name: '茄子', amount: '2个', category: '主料', isOptional: false },
        { name: '猪肉末', amount: '100g', category: '主料', isOptional: false },
        { name: '郫县豆瓣酱', amount: '1勺', category: '调料', isOptional: false },
        { name: '蒜末', amount: '适量', category: '调料', isOptional: false },
        { name: '生抽', amount: '1勺', category: '调料', isOptional: false },
        { name: '白糖', amount: '半勺', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '处理茄子', description: '茄子切条，用盐腌制10分钟挤出水', duration: '10分钟', tips: '挤出水更不吸油' },
        { phase: '主料', title: '炒肉末', description: '锅中热油，放入肉末炒散', duration: '3分钟', tips: '炒到干香' },
        { phase: '主料', title: '炒茄子', description: '放入茄子翻炒，加豆瓣酱、蒜末', duration: '8分钟', tips: '中火翻炒' },
        { phase: '主料', title: '调味焖煮', description: '加生抽、糖、少许水，盖锅焖3分钟', duration: '5分钟', tips: '让茄子入味' },
        { phase: '收尾', title: '收汁', description: '大火收汁，翻炒均匀', duration: '2分钟', tips: '汁要裹住茄子' }
      ],
      tips: ['茄子提前腌制挤水', '茄子吸油所以油要稍多', '焖一下更入味']
    },
    {
      name: '红烧鸡块',
      category: '午餐',
      tags: '鸡肉,红烧,家常菜,补身体',
      difficulty: '简单',
      cooking_time: '40分钟',
      servings: '3-4人份',
      description: '鸡肉鲜嫩、汤汁浓郁，家常补益佳品',
      image_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800',
      ingredients: [
        { name: '鸡腿', amount: '4个', category: '主料', isOptional: false },
        { name: '冰糖', amount: '20g', category: '调料', isOptional: false },
        { name: '生抽', amount: '2勺', category: '调料', isOptional: false },
        { name: '老抽', amount: '1勺', category: '调料', isOptional: false },
        { name: '葱姜', amount: '适量', category: '调料', isOptional: false },
        { name: '八角', amount: '2个', category: '调料', isOptional: true }
      ],
      steps: [
        { phase: '备菜', title: '处理鸡块', description: '鸡腿剁成小块，洗净焯水', duration: '10分钟', tips: '焯水去血沫' },
        { phase: '主料', title: '炒糖色', description: '锅中放油，加冰糖炒至琥珀色', duration: '5分钟', tips: '小火炒糖' },
        { phase: '主料', title: '翻炒上色', description: '放入鸡块翻炒上色', duration: '5分钟', tips: '翻炒均匀' },
        { phase: '主料', title: '红烧', description: '加生抽、老抽、葱姜、八角，加水没过鸡块，大火烧开转小火炖25分钟', duration: '30分钟', tips: '小火慢炖' },
        { phase: '收尾', title: '收汁', description: '大火收汁，加盐调味', duration: '5分钟', tips: '汁浓肉亮' }
      ],
      tips: ['鸡块要焯水', '糖色宁浅勿深', '小火慢炖肉才嫩']
    },
    {
      name: '辣子鸡',
      category: '午餐',
      tags: '鸡肉,川菜,辣,干辣',
      difficulty: '中等',
      cooking_time: '40分钟',
      servings: '2-3人份',
      description: '干辣香脆、鸡块酥辣，是经典川菜',
      image_url: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800',
      ingredients: [
        { name: '鸡腿肉', amount: '400g', category: '主料', isOptional: false },
        { name: '干辣椒', amount: '50g', category: '调料', isOptional: false },
        { name: '花椒', amount: '1把', category: '调料', isOptional: false },
        { name: '白芝麻', amount: '适量', category: '装饰', isOptional: true },
        { name: '生抽', amount: '1勺', category: '调料', isOptional: false },
        { name: '料酒', amount: '1勺', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '切块腌制', description: '鸡肉切小块，用生抽、料酒、盐腌制20分钟', duration: '20分钟', tips: '腌制入味' },
        { phase: '主料', title: '炸鸡块', description: '油温六成热下鸡块炸至金黄捞出，油温升高复炸', duration: '15分钟', tips: '复炸更酥脆' },
        { phase: '主料', title: '炒香料', description: '锅中留底油，放入干辣椒和花椒小火炒香', duration: '5分钟', tips: '小火防糊' },
        { phase: '收尾', title: '裹料', description: '放入炸好的鸡块翻炒，撒上白芝麻', duration: '3分钟', tips: '快速翻匀' }
      ],
      tips: ['鸡块要炸两次', '干辣椒要小火炒', '出锅要快']
    },
    // ========== 早餐主食 (26-35) ==========
    {
      name: '蛋炒饭',
      category: '早餐',
      tags: '米饭,鸡蛋,主食,快手菜',
      difficulty: '简单',
      cooking_time: '10分钟',
      servings: '1人份',
      description: '金黄喷香、粒粒分明，简单快手的经典主食',
      image_url: 'https://images.unsplash.com/photo-1603133872878-684f5c9322ed?w=800',
      ingredients: [
        { name: '隔夜米饭', amount: '1碗', category: '主食', isOptional: false },
        { name: '鸡蛋', amount: '2个', category: '主料', isOptional: false },
        { name: '葱花', amount: '适量', category: '装饰', isOptional: true },
        { name: '盐', amount: '适量', category: '调料', isOptional: false },
        { name: '生抽', amount: '1勺', category: '调料', isOptional: true }
      ],
      steps: [
        { phase: '备菜', title: '准备米饭', description: '隔夜米饭用手拨散，不要有结块', duration: '2分钟', tips: '隔夜饭水分少，炒出来粒粒分明' },
        { phase: '备菜', title: '打蛋液', description: '鸡蛋打散，加少许盐', duration: '1分钟', tips: '蛋液可以加点料酒去腥' },
        { phase: '主料', title: '炒蛋', description: '锅中热油，倒入蛋液炒散', duration: '2分钟', tips: '蛋液凝固但还嫩时盛出' },
        { phase: '主料', title: '炒饭', description: '加入米饭快速翻炒，加盐和葱花', duration: '4分钟', tips: '大火快炒，保持米的弹性' },
        { phase: '收尾', title: '调味出锅', description: '淋上少许生抽提鲜，翻炒均匀出锅', duration: '1分钟', tips: '生抽只要几滴，提鲜即可' }
      ],
      tips: ['用隔夜饭炒更好吃', '蛋可以先炒好，再炒饭', '全程大火快炒']
    },
    {
      name: '葱油拌面',
      category: '早餐',
      tags: '面条,葱油,主食,上海小吃',
      difficulty: '简单',
      cooking_time: '15分钟',
      servings: '1-2人份',
      description: '葱香四溢、简单美味，上海经典小吃',
      image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
      ingredients: [
        { name: '细面条', amount: '150g', category: '主食', isOptional: false },
        { name: '小葱', amount: '100g', category: '调料', isOptional: false },
        { name: '生抽', amount: '3勺', category: '调料', isOptional: false },
        { name: '老抽', amount: '1勺', category: '调料', isOptional: false },
        { name: '白糖', amount: '1勺', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '切葱段', description: '小葱洗净切成5cm的段', duration: '3分钟', tips: '葱白和葱叶分开切' },
        { phase: '主料', title: '调制酱汁', description: '生抽、老抽、糖混合搅匀', duration: '1分钟', tips: '糖可以帮助提鲜' },
        { phase: '主料', title: '煮面', description: '水开后下面条，煮至八成熟捞出', duration: '5分钟', tips: '面不要煮太烂，后面还要拌' },
        { phase: '主料', title: '炸葱油', description: '锅中热油，放入葱段小火慢炸至深褐色', duration: '5分钟', tips: '小火！葱炸糊了会发苦' },
        { phase: '收尾', title: '拌面', description: '将酱汁浇在面条上，淋上葱油，拌匀即可', duration: '1分钟', tips: '趁热拌面，让面条充分吸收葱油' }
      ],
      tips: ['葱要小火慢炸，炸到深褐色', '面条煮到八成熟即可', '酱汁可以根据口味调整']
    },
    {
      name: '煎饼果子',
      category: '早餐',
      tags: '煎饼,早餐,天津,小吃',
      difficulty: '中等',
      cooking_time: '15分钟',
      servings: '1人份',
      description: '外脆内软、酱香浓郁，天津经典早餐',
      image_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
      ingredients: [
        { name: '面粉', amount: '100g', category: '主食', isOptional: false },
        { name: '鸡蛋', amount: '1个', category: '主料', isOptional: false },
        { name: '油条', amount: '1根', category: '主料', isOptional: false },
        { name: '甜面酱', amount: '1勺', category: '调料', isOptional: false },
        { name: '葱花', amount: '适量', category: '配料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '调面糊', description: '面粉加水调成稀糊状', duration: '5分钟', tips: '不要太稠' },
        { phase: '主料', title: '摊饼', description: '平底锅热油，倒入面糊摊成薄饼', duration: '3分钟', tips: '小火' },
        { phase: '主料', title: '加蛋', description: '饼成型后打上鸡蛋，摊匀', duration: '1分钟', tips: '鸡蛋要摊匀' },
        { phase: '主料', title: '卷料', description: '刷上甜面酱，放上油条、葱花，卷起', duration: '2分钟', tips: '卷紧' }
      ],
      tips: ['面糊要稀一些', '火不要太大', '油条要酥脆']
    },
    {
      name: '炸酱面',
      category: '早餐',
      tags: '面条,炸酱,北京,主食',
      difficulty: '中等',
      cooking_time: '30分钟',
      servings: '2人份',
      description: '酱香浓郁、面条筋道，老北京炸酱面',
      image_url: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=800',
      ingredients: [
        { name: '面条', amount: '200g', category: '主食', isOptional: false },
        { name: '猪肉末', amount: '100g', category: '主料', isOptional: false },
        { name: '黄酱', amount: '2勺', category: '调料', isOptional: false },
        { name: '甜面酱', amount: '1勺', category: '调料', isOptional: false },
        { name: '黄瓜', amount: '1根', category: '配菜', isOptional: false },
        { name: '豆芽', amount: '适量', category: '配菜', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '炸酱', description: '锅中热油，下肉末炒散，加黄酱和甜面酱小火炒20分钟', duration: '25分钟', tips: '要炒出油' },
        { phase: '主料', title: '煮面', description: '水开下面条煮熟', duration: '8分钟', tips: '不要煮过' },
        { phase: '备菜', title: '准备配菜', description: '黄瓜切丝，豆芽焯水', duration: '5分钟', tips: '配菜铺底' },
        { phase: '收尾', title: '拌面', description: '面条盛入碗中，浇上炸酱，配上配菜', duration: '2分钟', tips: '拌匀食用' }
      ],
      tips: ['炸酱要炒出油才香', '配菜要清爽', '面条要筋道']
    },
    // ========== 汤类 (36-45) ==========
    {
      name: '番茄蛋花汤',
      category: '汤类',
      tags: '番茄,鸡蛋,汤,开胃',
      difficulty: '简单',
      cooking_time: '15分钟',
      servings: '3-4人份',
      description: '酸甜开胃、营养丰富，蛋花嫩滑，汤汁鲜美',
      image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
      ingredients: [
        { name: '番茄', amount: '2个', category: '主料', isOptional: false },
        { name: '鸡蛋', amount: '2个', category: '主料', isOptional: false },
        { name: '葱花', amount: '适量', category: '装饰', isOptional: true },
        { name: '盐', amount: '适量', category: '调料', isOptional: false },
        { name: '香油', amount: '几滴', category: '调料', isOptional: true }
      ],
      steps: [
        { phase: '备菜', title: '处理番茄', description: '番茄顶部划十字，开水烫后去皮切块', duration: '3分钟', tips: '去皮后更容易炒出汁' },
        { phase: '主料', title: '炒番茄', description: '锅中热油，放入番茄翻炒出汁', duration: '5分钟', tips: '可以用铲子压一压，帮助出汁' },
        { phase: '主料', title: '煮汤', description: '加入适量清水煮开，加盐和胡椒粉调味', duration: '5分钟', tips: '水开后转中火' },
        { phase: '收尾', title: '蛋花', description: '淋入蛋液，用筷子搅成蛋花，撒上葱花，滴入香油', duration: '2分钟', tips: '蛋液要慢慢淋，边淋边搅' }
      ],
      tips: ['番茄要炒出汁再加水', '蛋液要慢慢淋入', '最后滴几滴香油更香']
    },
    {
      name: '冬瓜排骨汤',
      category: '汤类',
      tags: '冬瓜,排骨,汤,清热',
      difficulty: '简单',
      cooking_time: '60分钟',
      servings: '4人份',
      description: '清甜可口、营养滋补，汤鲜肉嫩，冬瓜软糯',
      image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
      ingredients: [
        { name: '肋排', amount: '500g', category: '主料', isOptional: false },
        { name: '冬瓜', amount: '500g', category: '主料', isOptional: false },
        { name: '姜片', amount: '3片', category: '调料', isOptional: false },
        { name: '葱结', amount: '1个', category: '调料', isOptional: false },
        { name: '盐', amount: '适量', category: '调料', isOptional: false },
        { name: '枸杞', amount: '适量', category: '装饰', isOptional: true }
      ],
      steps: [
        { phase: '备菜', title: '排骨处理', description: '排骨洗净，冷水下锅焯水去血沫', duration: '10分钟', tips: '焯水时加姜片和料酒' },
        { phase: '备菜', title: '切冬瓜', description: '冬瓜去皮切块', duration: '5分钟', tips: '冬瓜块可以切大一点' },
        { phase: '主料', title: '炖排骨', description: '砂锅中加入排骨、姜片、葱结，加足量清水，大火烧开后撇去浮沫，转小火炖30分钟', duration: '35分钟', tips: '一次加够水，中途不要加水' },
        { phase: '主料', title: '加入冬瓜', description: '加入冬瓜块，继续炖20分钟', duration: '20分钟', tips: '冬瓜不要放太早，会炖烂' },
        { phase: '收尾', title: '调味', description: '加盐调味，撒上葱花和枸杞', duration: '2分钟', tips: '盐最后放，汤更鲜' }
      ],
      tips: ['用砂锅炖汤更香', '排骨要炖够时间', '冬瓜最后放，保持形状']
    },
    {
      name: '紫菜蛋花汤',
      category: '汤类',
      tags: '紫菜,鸡蛋,汤,快手',
      difficulty: '简单',
      cooking_time: '10分钟',
      servings: '2人份',
      description: '简单快手、鲜香清淡，家常汤品',
      image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
      ingredients: [
        { name: '紫菜', amount: '10g', category: '主料', isOptional: false },
        { name: '鸡蛋', amount: '1个', category: '主料', isOptional: false },
        { name: '盐', amount: '适量', category: '调料', isOptional: false },
        { name: '香油', amount: '几滴', category: '调料', isOptional: true }
      ],
      steps: [
        { phase: '备菜', title: '处理紫菜', description: '紫菜撕成小块，用水泡一下', duration: '2分钟', tips: '不要泡太久' },
        { phase: '主料', title: '煮汤', description: '锅中加水烧开，放入紫菜', duration: '3分钟', tips: '水开后再放' },
        { phase: '收尾', title: '蛋花', description: '淋入蛋液，加盐，滴入香油', duration: '2分钟', tips: '边淋边搅' }
      ],
      tips: ['紫菜要撕小块', '蛋液要慢慢淋', '香油最后放']
    },
    {
      name: '玉米排骨汤',
      category: '汤类',
      tags: '玉米,排骨,汤,甜香',
      difficulty: '简单',
      cooking_time: '60分钟',
      servings: '4人份',
      description: '汤汁鲜美、玉米清甜，营养丰富',
      image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
      ingredients: [
        { name: '肋排', amount: '400g', category: '主料', isOptional: false },
        { name: '玉米', amount: '2根', category: '主料', isOptional: false },
        { name: '胡萝卜', amount: '1根', category: '配菜', isOptional: false },
        { name: '姜片', amount: '3片', category: '调料', isOptional: false },
        { name: '盐', amount: '适量', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '处理排骨', description: '排骨洗净焯水', duration: '10分钟', tips: '去血沫' },
        { phase: '备菜', title: '处理配菜', description: '玉米切段，胡萝卜切块', duration: '5分钟', tips: '切大小适中' },
        { phase: '主料', title: '炖汤', description: '锅中加水，放排骨、姜片，大火烧开转小火炖40分钟', duration: '45分钟', tips: '一次加足水' },
        { phase: '主料', title: '加配菜', description: '放入玉米和胡萝卜，再炖15分钟', duration: '15分钟', tips: '配菜不要放太早' },
        { phase: '收尾', title: '调味', description: '加盐调味即可', duration: '1分钟', tips: '盐最后放' }
      ],
      tips: ['用砂锅更好', '玉米要选甜的', '小火慢炖']
    },
    // ========== 素菜 (46-60) ==========
    {
      name: '蒜蓉西兰花',
      category: '素菜',
      tags: '西兰花,蒜蓉,素菜,健康',
      difficulty: '简单',
      cooking_time: '15分钟',
      servings: '2人份',
      description: '清爽翠绿、蒜香浓郁，西兰花脆嫩爽口',
      image_url: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800',
      ingredients: [
        { name: '西兰花', amount: '1颗', category: '主料', isOptional: false },
        { name: '胡萝卜', amount: '半根', category: '配菜', isOptional: true },
        { name: '大蒜', amount: '4瓣', category: '调料', isOptional: false },
        { name: '盐', amount: '适量', category: '调料', isOptional: false },
        { name: '蚝油', amount: '1勺', category: '调料', isOptional: true }
      ],
      steps: [
        { phase: '备菜', title: '处理西兰花', description: '西兰花洗净，切成小朵', duration: '5分钟', tips: '用盐水浸泡可以去除农药' },
        { phase: '备菜', title: '切配料', description: '胡萝卜切片，蒜切末', duration: '3分钟', tips: '蒜末切碎一点，香味更浓' },
        { phase: '主料', title: '焯水', description: '烧一锅开水，加少许盐和油，放入西兰花焯水1分钟捞出', duration: '5分钟', tips: '加油可以让西兰花更翠绿' },
        { phase: '主料', title: '炒制', description: '锅中热油，爆香蒜末，放入西兰花和胡萝卜翻炒', duration: '4分钟', tips: '大火快炒，保持脆嫩' },
        { phase: '收尾', title: '调味', description: '加盐和蚝油调味，翻炒均匀', duration: '2分钟', tips: '蚝油不要放太多，会抢味' }
      ],
      tips: ['焯水时间不要太长', '焯水后过凉水保持脆嫩', '最后大火快炒']
    },
    {
      name: '酸辣土豆丝',
      category: '素菜',
      tags: '土豆,酸辣,家常菜,快手菜',
      difficulty: '简单',
      cooking_time: '20分钟',
      servings: '2人份',
      description: '酸辣爽口、开胃下饭，土豆丝根根分明',
      image_url: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=800',
      ingredients: [
        { name: '土豆', amount: '2个', category: '主料', isOptional: false },
        { name: '干辣椒', amount: '5个', category: '调料', isOptional: false },
        { name: '花椒', amount: '10粒', category: '调料', isOptional: false },
        { name: '白醋', amount: '2勺', category: '调料', isOptional: false },
        { name: '盐', amount: '适量', category: '调料', isOptional: false },
        { name: '葱花', amount: '适量', category: '装饰', isOptional: true }
      ],
      steps: [
        { phase: '备菜', title: '切丝泡水', description: '土豆去皮，切成细丝，放入清水中洗去淀粉', duration: '8分钟', tips: '洗去淀粉让土豆丝更爽脆' },
        { phase: '备菜', title: '准备配料', description: '干辣椒切段，青椒切丝', duration: '3分钟', tips: '辣椒籽可以去掉，减少辣度' },
        { phase: '主料', title: '爆香', description: '锅中热油，放入花椒和干辣椒爆香', duration: '2分钟', tips: '小火，防止辣椒糊' },
        { phase: '主料', title: '炒土豆丝', description: '捞出土豆丝沥干，放入锅中大火翻炒', duration: '5分钟', tips: '一定要沥干水分，避免溅油' },
        { phase: '收尾', title: '调味', description: '加入醋、盐快速翻炒，撒上葱花', duration: '2分钟', tips: '醋要早放，才会有酸味' }
      ],
      tips: ['土豆丝要泡水洗去淀粉', '丝要切得细而均匀', '大火快炒，保持爽脆']
    },
    {
      name: '蒜蓉生菜',
      category: '素菜',
      tags: '生菜,蒜蓉,素菜,清淡',
      difficulty: '简单',
      cooking_time: '10分钟',
      servings: '2人份',
      description: '清爽爽口、简单快手',
      image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
      ingredients: [
        { name: '生菜', amount: '1颗', category: '主料', isOptional: false },
        { name: '大蒜', amount: '4瓣', category: '调料', isOptional: false },
        { name: '蚝油', amount: '1勺', category: '调料', isOptional: false },
        { name: '盐', amount: '适量', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '洗生菜', description: '生菜洗净沥干', duration: '2分钟', tips: '要沥干水分' },
        { phase: '主料', title: '爆香蒜蓉', description: '锅中热油，放入蒜末爆香', duration: '2分钟', tips: '小火，蒜末不要炒糊' },
        { phase: '主料', title: '炒制', description: '放入生菜快速翻炒', duration: '3分钟', tips: '大火快炒' },
        { phase: '收尾', title: '调味', description: '加蚝油和盐调味', duration: '1分钟', tips: '蚝油提鲜' }
      ],
      tips: ['生菜不要炒太久', '大火快炒保持脆嫩', '蚝油不要放太多']
    },
    {
      name: '辣椒炒蛋',
      category: '素菜',
      tags: '辣椒,鸡蛋,家常菜,快手菜',
      difficulty: '简单',
      cooking_time: '15分钟',
      servings: '2人份',
      description: '香辣下饭、简单快手',
      image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
      ingredients: [
        { name: '青辣椒', amount: '4个', category: '主料', isOptional: false },
        { name: '鸡蛋', amount: '3个', category: '主料', isOptional: false },
        { name: '盐', amount: '适量', category: '调料', isOptional: false },
        { name: '生抽', amount: '1勺', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '切辣椒', description: '辣椒洗净切丝', duration: '3分钟', tips: '辣椒籽可以去掉减少辣度' },
        { phase: '备菜', title: '打蛋液', description: '鸡蛋打散', duration: '1分钟', tips: '加少许盐' },
        { phase: '主料', title: '炒蛋', description: '锅中热油，倒入蛋液炒散', duration: '2分钟', tips: '蛋七成熟盛出' },
        { phase: '主料', title: '炒辣椒', description: '放入辣椒翻炒', duration: '4分钟', tips: '中火翻炒' },
        { phase: '收尾', title: '调味', description: '加入鸡蛋，加盐和生抽调味', duration: '2分钟', tips: '快速翻炒均匀' }
      ],
      tips: ['辣椒不要炒太久', '蛋不要炒太老', '简单快手菜']
    },
    {
      name: '手撕包菜',
      category: '素菜',
      tags: '包菜,干辣,家常菜,快手菜',
      difficulty: '简单',
      cooking_time: '10分钟',
      servings: '2人份',
      description: '爽脆可口、干香下饭',
      image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
      ingredients: [
        { name: '包菜', amount: '半个', category: '主料', isOptional: false },
        { name: '干辣椒', amount: '5个', category: '调料', isOptional: false },
        { name: '花椒', amount: '10粒', category: '调料', isOptional: false },
        { name: '蒜末', amount: '适量', category: '调料', isOptional: false },
        { name: '醋', amount: '1勺', category: '调料', isOptional: false },
        { name: '盐', amount: '适量', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '处理包菜', description: '包菜用手撕成小块，洗净沥干', duration: '5分钟', tips: '用手撕更好吃' },
        { phase: '主料', title: '爆香', description: '锅中热油，放入花椒、干辣椒、蒜末爆香', duration: '2分钟', tips: '小火' },
        { phase: '主料', title: '炒包菜', description: '放入包菜大火翻炒', duration: '3分钟', tips: '大火快炒' },
        { phase: '收尾', title: '调味', description: '加醋和盐，翻炒均匀出锅', duration: '1分钟', tips: '醋沿锅边淋入' }
      ],
      tips: ['要用手撕', '大火快炒', '醋沿锅边淋入更香']
    },
    // ========== 海鲜 (61-70) ==========
    {
      name: '清蒸鲈鱼',
      category: '晚餐',
      tags: '鲈鱼,清蒸,海鲜,粤菜',
      difficulty: '中等',
      cooking_time: '25分钟',
      servings: '3-4人份',
      description: '鲜嫩爽滑、原汁原味，鱼肉细腻，清蒸最能保留鲜味',
      image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800',
      ingredients: [
        { name: '鲈鱼', amount: '1条约500g', category: '主料', isOptional: false },
        { name: '姜丝', amount: '适量', category: '调料', isOptional: false },
        { name: '葱丝', amount: '适量', category: '调料', isOptional: false },
        { name: '料酒', amount: '1勺', category: '调料', isOptional: false },
        { name: '蒸鱼豉油', amount: '2勺', category: '调料', isOptional: false },
        { name: '食用油', amount: '适量', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '处理鱼', description: '鲈鱼处理干净，两面各划几刀便于入味', duration: '5分钟', tips: '划刀不要太深' },
        { phase: '备菜', title: '腌制', description: '鱼身抹上料酒，放上姜片，腌制10分钟', duration: '10分钟', tips: '姜片可以塞在鱼肚子里' },
        { phase: '主料', title: '蒸鱼', description: '水开后放入蒸锅，大火蒸8-10分钟', duration: '10分钟', tips: '时间根据鱼的大小调整' },
        { phase: '收尾', title: '淋油', description: '取出倒掉多余汤汁，放上葱丝，淋上蒸鱼豉油，浇上热油', duration: '3分钟', tips: '热油要冒烟，才能激发葱香' }
      ],
      tips: ['鱼要新鲜，清蒸才好吃', '蒸的时间不要太长', '最后浇油是灵魂']
    },
    {
      name: '白灼虾',
      category: '晚餐',
      tags: '虾,白灼,海鲜,粤菜',
      difficulty: '简单',
      cooking_time: '10分钟',
      servings: '2-3人份',
      description: '原汁原味、鲜甜Q弹，虾肉紧实弹牙',
      image_url: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800',
      ingredients: [
        { name: '鲜虾', amount: '500g', category: '主料', isOptional: false },
        { name: '姜片', amount: '3片', category: '调料', isOptional: false },
        { name: '料酒', amount: '1勺', category: '调料', isOptional: false },
        { name: '生抽', amount: '2勺', category: '调料', isOptional: false },
        { name: '蒜末', amount: '适量', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '处理虾', description: '鲜虾洗净，剪去虾须，挑出虾线', duration: '5分钟', tips: '虾线要去掉，不然影响口感' },
        { phase: '主料', title: '煮虾', description: '锅中加水烧开，放入姜片和料酒', duration: '3分钟', tips: '水开后放入虾' },
        { phase: '主料', title: '灼虾', description: '放入虾，煮至变红（约2分钟），捞出', duration: '3分钟', tips: '不要煮太久，虾肉会老' },
        { phase: '收尾', title: '调制蘸料', description: '生抽加蒜末混合，虾蘸料食用', duration: '2分钟', tips: '蘸料可以根据口味调整' }
      ],
      tips: ['虾要新鲜才好吃', '煮的时间不要太长', '蘸料可以加些小米椒']
    },
    {
      name: '红烧带鱼',
      category: '晚餐',
      tags: '带鱼,红烧,海鲜,家常',
      difficulty: '中等',
      cooking_time: '30分钟',
      servings: '2-3人份',
      description: '鱼肉鲜嫩、汤汁浓郁，下饭佳品',
      image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800',
      ingredients: [
        { name: '带鱼', amount: '400g', category: '主料', isOptional: false },
        { name: '葱姜蒜', amount: '适量', category: '调料', isOptional: false },
        { name: '生抽', amount: '2勺', category: '调料', isOptional: false },
        { name: '老抽', amount: '1勺', category: '调料', isOptional: false },
        { name: '糖', amount: '1勺', category: '调料', isOptional: false },
        { name: '醋', amount: '1勺', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '处理带鱼', description: '带鱼洗净切段，两面划刀', duration: '5分钟', tips: '去掉内脏' },
        { phase: '主料', title: '煎鱼', description: '锅中热油，带鱼煎至两面金黄', duration: '8分钟', tips: '中小火' },
        { phase: '主料', title: '红烧', description: '放入葱姜蒜，加生抽、老抽、糖、醋和水，大火烧开转小火烧15分钟', duration: '20分钟', tips: '小火慢烧' },
        { phase: '收尾', title: '收汁', description: '大火收汁', duration: '5分钟', tips: '汁浓出锅' }
      ],
      tips: ['带鱼要煎透', '小火慢烧入味', '收汁要浓']
    },
    {
      name: '香辣虾',
      category: '晚餐',
      tags: '虾,香辣,川菜,海鲜',
      difficulty: '中等',
      cooking_time: '20分钟',
      servings: '2人份',
      description: '虾肉鲜嫩、香辣可口',
      image_url: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800',
      ingredients: [
        { name: '鲜虾', amount: '300g', category: '主料', isOptional: false },
        { name: '干辣椒', amount: '20个', category: '调料', isOptional: false },
        { name: '花椒', amount: '1把', category: '调料', isOptional: false },
        { name: '蒜末', amount: '适量', category: '调料', isOptional: false },
        { name: '生抽', amount: '1勺', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '处理虾', description: '虾去头须，开背去虾线', duration: '5分钟', tips: '开背更好入味' },
        { phase: '主料', title: '炸虾', description: '油温六成热下虾炸至变色捞出', duration: '3分钟', tips: '复炸更脆' },
        { phase: '主料', title: '炒香料', description: '锅中留底油，放干辣椒、花椒、蒜末炒香', duration: '3分钟', tips: '小火' },
        { phase: '收尾', title: '翻炒', description: '放入炸好的虾，加生抽翻炒均匀', duration: '2分钟', tips: '快速翻匀' }
      ],
      tips: ['虾要开背', '复炸更酥脆', '快速出锅保持虾肉嫩']
    },
    // ========== 甜品 (71-80) ==========
    {
      name: '红枣银耳羹',
      category: '甜品',
      tags: '红枣,银耳,甜品,养生',
      difficulty: '中等',
      cooking_time: '60分钟',
      servings: '4人份',
      description: '美容养颜、滋补佳品，银耳软糯，汤汁粘稠',
      image_url: 'https://images.unsplash.com/photo-1511690656952-34342d5c71df?w=800',
      ingredients: [
        { name: '干银耳', amount: '20g', category: '主料', isOptional: false },
        { name: '红枣', amount: '10颗', category: '主料', isOptional: false },
        { name: '冰糖', amount: '适量', category: '调料', isOptional: false },
        { name: '枸杞', amount: '适量', category: '装饰', isOptional: true }
      ],
      steps: [
        { phase: '备菜', title: '泡发银耳', description: '银耳用温水泡发，去根部撕小块', duration: '30分钟', tips: '泡发后更容易出胶' },
        { phase: '备菜', title: '准备红枣', description: '红枣洗净，去核（可选）', duration: '5分钟', tips: '去核不容易上火' },
        { phase: '主料', title: '炖煮', description: '锅中加入银耳和红枣，加适量清水，大火烧开后转小火炖40分钟', duration: '45分钟', tips: '中途不要掀盖' },
        { phase: '收尾', title: '加糖', description: '加入冰糖，继续炖10分钟，撒入枸杞', duration: '10分钟', tips: '冰糖比白糖更清润' }
      ],
      tips: ['银耳要泡发透', '小火慢炖才能出胶', '枸杞最后放']
    },
    {
      name: '南瓜粥',
      category: '甜品',
      tags: '南瓜,粥,养生,早餐',
      difficulty: '简单',
      cooking_time: '30分钟',
      servings: '2人份',
      description: '香甜绵软、营养丰富',
      image_url: 'https://images.unsplash.com/photo-1511690656952-34342d5c71df?w=800',
      ingredients: [
        { name: '南瓜', amount: '200g', category: '主料', isOptional: false },
        { name: '大米', amount: '50g', category: '主食', isOptional: false },
        { name: '冰糖', amount: '适量', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '处理南瓜', description: '南瓜去皮切小块', duration: '5分钟', tips: '切小块更容易煮烂' },
        { phase: '主料', title: '煮粥', description: '大米洗净，加水煮粥', duration: '20分钟', tips: '水开后转中小火' },
        { phase: '主料', title: '加南瓜', description: '放入南瓜块继续煮10分钟', duration: '10分钟', tips: '南瓜要煮烂' },
        { phase: '收尾', title: '调味', description: '加冰糖调味', duration: '2分钟', tips: '甜度根据个人' }
      ],
      tips: ['南瓜要选老的', '要煮到南瓜化掉', '冰糖比白糖好']
    },
    // ========== 更多菜品继续... ==========
    {
      name: '麻婆豆腐',
      category: '午餐',
      tags: '豆腐,川菜,辣,麻',
      difficulty: '中等',
      cooking_time: '20分钟',
      servings: '2人份',
      description: '麻辣鲜香、嫩滑爽口，豆腐吸满麻辣汤汁',
      image_url: 'https://images.unsplash.com/photo-1582576163090-09d3b6f8a969?w=800',
      ingredients: [
        { name: '嫩豆腐', amount: '1块', category: '主料', isOptional: false },
        { name: '猪肉末', amount: '100g', category: '主料', isOptional: false },
        { name: '郫县豆瓣酱', amount: '1勺', category: '调料', isOptional: false },
        { name: '豆豉', amount: '适量', category: '调料', isOptional: false },
        { name: '蒜末', amount: '适量', category: '调料', isOptional: false },
        { name: '花椒粉', amount: '适量', category: '调料', isOptional: false },
        { name: '水淀粉', amount: '适量', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '豆腐处理', description: '豆腐切成2cm小块，用盐水浸泡10分钟', duration: '10分钟', tips: '盐水浸泡让豆腐更紧实' },
        { phase: '主料', title: '炒肉末', description: '锅中热油，放入肉末炒散炒香', duration: '5分钟', tips: '肉末炒到微微焦香' },
        { phase: '主料', title: '调味', description: '加入豆瓣酱炒出红油，加入豆豉、蒜末炒香', duration: '3分钟', tips: '小火炒，防止糊底' },
        { phase: '主料', title: '炖煮', description: '加入适量清水，轻轻放入豆腐块，小火炖煮5分钟', duration: '8分钟', tips: '不要用勺子搅动' },
        { phase: '收尾', title: '勾芡', description: '水淀粉勾芡，撒上花椒粉', duration: '2分钟', tips: '花椒粉最后撒' }
      ],
      tips: ['用嫩豆腐', '豆腐盐水泡', '动作要轻']
    },
    {
      name: '家常豆腐',
      category: '午餐',
      tags: '豆腐,煎炸,家常菜',
      difficulty: '简单',
      cooking_time: '20分钟',
      servings: '2人份',
      description: '外脆内嫩、酱香浓郁',
      image_url: 'https://images.unsplash.com/photo-1582576163090-09d3b6f8a969?w=800',
      ingredients: [
        { name: '老豆腐', amount: '1块', category: '主料', isOptional: false },
        { name: '木耳', amount: '30g', category: '配菜', isOptional: false },
        { name: '青椒', amount: '1个', category: '配菜', isOptional: false },
        { name: '郫县豆瓣酱', amount: '1勺', category: '调料', isOptional: false },
        { name: '生抽', amount: '1勺', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '切豆腐', description: '豆腐切厚片', duration: '3分钟', tips: '厚一点煎不碎' },
        { phase: '主料', title: '煎豆腐', description: '锅中热油，豆腐煎至两面金黄', duration: '8分钟', tips: '中小火' },
        { phase: '主料', title: '炒配料', description: '放入豆瓣酱、木耳、青椒翻炒', duration: '5分钟', tips: '炒出香味' },
        { phase: '收尾', title: '调味', description: '加生抽、少许水焖2分钟', duration: '3分钟', tips: '让豆腐入味' }
      ],
      tips: ['豆腐要选老豆腐', '煎的时候不要翻动太早', '焖一下更入味']
    },
    {
      name: '青椒土豆片',
      category: '素菜',
      tags: '土豆,青椒,家常菜,快手',
      difficulty: '简单',
      cooking_time: '15分钟',
      servings: '2人份',
      description: '清香爽口、简单快手',
      image_url: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=800',
      ingredients: [
        { name: '土豆', amount: '2个', category: '主料', isOptional: false },
        { name: '青椒', amount: '2个', category: '主料', isOptional: false },
        { name: '蒜末', amount: '适量', category: '调料', isOptional: false },
        { name: '盐', amount: '适量', category: '调料', isOptional: false },
        { name: '生抽', amount: '1勺', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '切配', description: '土豆切片泡水，青椒切片', duration: '5分钟', tips: '土豆片要泡水' },
        { phase: '主料', title: '炒土豆', description: '锅中热油，放入土豆片翻炒', duration: '6分钟', tips: '中火翻炒' },
        { phase: '主料', title: '加青椒', description: '放入青椒、蒜末继续翻炒', duration: '3分钟', tips: '大火快炒' },
        { phase: '收尾', title: '调味', description: '加盐、生抽调味', duration: '1分钟', tips: '翻匀出锅' }
      ],
      tips: ['土豆片要泡水', '大火快炒', '不要炒太久']
    },
    {
      name: '地三鲜',
      category: '素菜',
      tags: '土豆,茄子,青椒,东北菜',
      difficulty: '中等',
      cooking_time: '25分钟',
      servings: '2人份',
      description: '软糯鲜香、色彩诱人，东北经典',
      image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
      ingredients: [
        { name: '土豆', amount: '1个', category: '主料', isOptional: false },
        { name: '茄子', amount: '1个', category: '主料', isOptional: false },
        { name: '青椒', amount: '1个', category: '主料', isOptional: false },
        { name: '蒜末', amount: '适量', category: '调料', isOptional: false },
        { name: '生抽', amount: '2勺', category: '调料', isOptional: false },
        { name: '糖', amount: '半勺', category: '调料', isOptional: false },
        { name: '淀粉', amount: '1勺', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '切配', description: '土豆、茄子、青椒切块', duration: '8分钟', tips: '切块要均匀' },
        { phase: '主料', title: '炸食材', description: '油温六成热下土豆、茄子炸至金黄捞出', duration: '10分钟', tips: '复炸更脆' },
        { phase: '主料', title: '炒制', description: '锅中留底油，放蒜末炒香，放入炸好的食材', duration: '4分钟', tips: '大火快炒' },
        { phase: '收尾', title: '调味', description: '加生抽、糖、水淀粉勾芡', duration: '3分钟', tips: '芡要裹住食材' }
      ],
      tips: ['要复炸', '芡要裹住', '茄子提前用盐腌']
    },
    {
      name: '炒合菜',
      category: '素菜',
      tags: '豆芽,韭菜,粉丝,家常',
      difficulty: '简单',
      cooking_time: '15分钟',
      servings: '2人份',
      description: '清爽脆嫩、色彩丰富',
      image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
      ingredients: [
        { name: '豆芽', amount: '200g', category: '主料', isOptional: false },
        { name: '韭菜', amount: '100g', category: '主料', isOptional: false },
        { name: '粉丝', amount: '50g', category: '主料', isOptional: false },
        { name: '鸡蛋', amount: '1个', category: '主料', isOptional: false },
        { name: '盐', amount: '适量', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '泡粉丝', description: '粉丝用温水泡软', duration: '10分钟', tips: '泡软即可' },
        { phase: '备菜', title: '准备配菜', description: '豆芽洗净，韭菜切段', duration: '3分钟', tips: '控干水分' },
        { phase: '主料', title: '炒蛋', description: '鸡蛋炒散盛出', duration: '2分钟', tips: '不要炒老' },
        { phase: '主料', title: '合炒', description: '放入豆芽、韭菜、粉丝、鸡蛋翻炒', duration: '5分钟', tips: '大火快炒' },
        { phase: '收尾', title: '调味', description: '加盐翻匀', duration: '1分钟', tips: '快炒出锅' }
      ],
      tips: ['粉丝要泡软', '大火快炒', '不要炒太久']
    },
    {
      name: '凉拌黄瓜',
      category: '凉菜',
      tags: '黄瓜,凉菜,家常,开胃',
      difficulty: '简单',
      cooking_time: '10分钟',
      servings: '2人份',
      description: '清爽开胃、简单快手',
      image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
      ingredients: [
        { name: '黄瓜', amount: '2根', category: '主料', isOptional: false },
        { name: '蒜末', amount: '适量', category: '调料', isOptional: false },
        { name: '醋', amount: '1勺', category: '调料', isOptional: false },
        { name: '生抽', amount: '1勺', category: '调料', isOptional: false },
        { name: '香油', amount: '几滴', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '拍黄瓜', description: '黄瓜用刀拍碎，切成块', duration: '3分钟', tips: '拍的比切的好吃' },
        { phase: '备菜', title: '调味', description: '放入蒜末、醋、生抽、香油', duration: '2分钟', tips: '拌匀' },
        { phase: '收尾', title: '冷藏', description: '放入冰箱冷藏10分钟更好吃', duration: '10分钟', tips: '可选' }
      ],
      tips: ['黄瓜要拍', '蒜末要多', '冷藏更入味']
    },
    {
      name: '凉拌木耳',
      category: '凉菜',
      tags: '木耳,凉菜,健康,开胃',
      difficulty: '简单',
      cooking_time: '15分钟',
      servings: '2人份',
      description: '爽脆可口、营养健康',
      image_url: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=800',
      ingredients: [
        { name: '干木耳', amount: '30g', category: '主料', isOptional: false },
        { name: '蒜末', amount: '适量', category: '调料', isOptional: false },
        { name: '小米椒', amount: '适量', category: '调料', isOptional: false },
        { name: '醋', amount: '1勺', category: '调料', isOptional: false },
        { name: '生抽', amount: '1勺', category: '调料', isOptional: false },
        { name: '香菜', amount: '适量', category: '装饰', isOptional: true }
      ],
      steps: [
        { phase: '备菜', title: '泡木耳', description: '木耳用温水泡发', duration: '20分钟', tips: '泡发后清洗' },
        { phase: '主料', title: '焯水', description: '锅中水开，放入木耳焯3分钟', duration: '5分钟', tips: '不要焯太久' },
        { phase: '主料', title: '调味', description: '放入蒜末、小米椒、醋、生抽拌匀', duration: '3分钟', tips: '拌匀' },
        { phase: '收尾', title: '装盘', description: '撒上香菜', duration: '1分钟', tips: '香菜装饰' }
      ],
      tips: ['木耳要泡透', '焯水不要太久', '可以加辣椒油']
    },
    {
      name: '拍黄瓜',
      category: '凉菜',
      tags: '黄瓜,凉菜,夏季,开胃',
      difficulty: '简单',
      cooking_time: '5分钟',
      servings: '2人份',
      description: '清爽解腻、夏季必备',
      image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
      ingredients: [
        { name: '黄瓜', amount: '2根', category: '主料', isOptional: false },
        { name: '蒜末', amount: '适量', category: '调料', isOptional: false },
        { name: '辣椒油', amount: '1勺', category: '调料', isOptional: false },
        { name: '醋', amount: '1勺', category: '调料', isOptional: false },
        { name: '生抽', amount: '1勺', category: '调料', isOptional: false }
      ],
      steps: [
        { phase: '备菜', title: '拍黄瓜', description: '黄瓜洗净，用刀拍碎切块', duration: '2分钟', tips: '拍的更入味' },
        { phase: '备菜', title: '调味', description: '加入蒜末、辣椒油、醋、生抽', duration: '2分钟', tips: '拌匀' },
        { phase: '收尾', title: '腌制', description: '腌制5分钟更入味', duration: '5分钟', tips: '可选' }
      ],
      tips: ['黄瓜要拍', '蒜末要多', '辣椒油提味']
    }
  ];

  // 食材数据（原子食材）
  const ingredients = [
    // 主料 - 肉类
    { name: '五花肉', category: '肉类', unit: '500g', isStaple: false },
    { name: '肋排', category: '肉类', unit: '500g', isStaple: false },
    { name: '猪里脊肉', category: '肉类', unit: '300g', isStaple: false },
    { name: '猪五花肉', category: '肉类', unit: '500g', isStaple: false },
    { name: '猪梅花肉', category: '肉类', unit: '500g', isStaple: false },
    { name: '鸡胸肉', category: '肉类', unit: '300g', isStaple: false },
    { name: '鸡翅', category: '肉类', unit: '6个', isStaple: false },
    { name: '鸡翅中', category: '肉类', unit: '500g', isStaple: false },
    { name: '鸡腿', category: '肉类', unit: '4个', isStaple: false },
    { name: '鸡腿肉', category: '肉类', unit: '400g', isStaple: false },
    { name: '猪肉', category: '肉类', unit: '300g', isStaple: false },
    { name: '猪肉末', category: '肉类', unit: '200g', isStaple: false },
    // 主料 - 海鲜
    { name: '鲈鱼', category: '海鲜', unit: '500g', isStaple: false },
    { name: '鲜虾', category: '海鲜', unit: '500g', isStaple: false },
    // 主料 - 蔬菜
    { name: '番茄', category: '蔬菜', unit: '2个', isStaple: false },
    { name: '土豆', category: '蔬菜', unit: '2个', isStaple: true },
    { name: '西兰花', category: '蔬菜', unit: '1颗', isStaple: false },
    { name: '黄瓜', category: '蔬菜', unit: '2根', isStaple: false },
    { name: '青辣椒', category: '蔬菜', unit: '4个', isStaple: false },
    { name: '青椒', category: '蔬菜', unit: '3个', isStaple: false },
    { name: '胡萝卜', category: '蔬菜', unit: '2根', isStaple: false },
    { name: '生菜', category: '蔬菜', unit: '1颗', isStaple: false },
    { name: '木耳', category: '蔬菜', unit: '100g', isStaple: false },
    { name: '干木耳', category: '蔬菜', unit: '30g', isStaple: false },
    { name: '冬瓜', category: '蔬菜', unit: '500g', isStaple: false },
    { name: '茄子', category: '蔬菜', unit: '2个', isStaple: false },
    { name: '蒜苔', category: '蔬菜', unit: '300g', isStaple: false },
    { name: '上海青', category: '蔬菜', unit: '4颗', isStaple: false },
    { name: '豆芽', category: '蔬菜', unit: '200g', isStaple: false },
    { name: '白菜', category: '蔬菜', unit: '200g', isStaple: false },
    // 主料 - 蛋类
    { name: '鸡蛋', category: '蛋类', unit: '4个', isStaple: true },
    { name: '鸡蛋清', category: '蛋类', unit: '1个', isStaple: false },
    // 主料 - 豆制品
    { name: '嫩豆腐', category: '豆制品', unit: '1块', isStaple: false },
    { name: '豆腐皮', category: '豆制品', unit: '2张', isStaple: false },
    { name: '干银耳', category: '干货', unit: '20g', isStaple: false },
    { name: '粉丝', category: '干货', unit: '100g', isStaple: false },
    { name: '梅菜', category: '干货', unit: '100g', isStaple: false },
    { name: '马蹄', category: '蔬菜', unit: '50g', isStaple: false },
    // 调料
    { name: '生抽', category: '调料', unit: '瓶', isStaple: true },
    { name: '老抽', category: '调料', unit: '瓶', isStaple: true },
    { name: '料酒', category: '调料', unit: '瓶', isStaple: true },
    { name: '醋', category: '调料', unit: '瓶', isStaple: true },
    { name: '香醋', category: '调料', unit: '瓶', isStaple: false },
    { name: '白糖', category: '调料', unit: '袋', isStaple: true },
    { name: '冰糖', category: '调料', unit: '袋', isStaple: false },
    { name: '盐', category: '调料', unit: '袋', isStaple: true },
    { name: '蚝油', category: '调料', unit: '瓶', isStaple: true },
    { name: '番茄酱', category: '调料', unit: '瓶', isStaple: false },
    { name: '郫县豆瓣酱', category: '调料', unit: '瓶', isStaple: false },
    { name: '甜面酱', category: '调料', unit: '瓶', isStaple: false },
    { name: '叉烧酱', category: '调料', unit: '瓶', isStaple: false },
    { name: '蒸鱼豉油', category: '调料', unit: '瓶', isStaple: false },
    { name: '豆豉', category: '调料', unit: '袋', isStaple: false },
    { name: '蜂蜜', category: '调料', unit: '瓶', isStaple: false },
    // 香料
    { name: '葱姜', category: '香料', unit: '份', isStaple: true },
    { name: '姜片', category: '香料', unit: '份', isStaple: true },
    { name: '葱花', category: '香料', unit: '份', isStaple: true },
    { name: '葱丝', category: '香料', unit: '份', isStaple: false },
    { name: '葱段', category: '香料', unit: '份', isStaple: false },
    { name: '蒜末', category: '香料', unit: '份', isStaple: true },
    { name: '姜末', category: '香料', unit: '份', isStaple: false },
    { name: '大蒜', category: '香料', unit: '1头', isStaple: true },
    { name: '干辣椒', category: '香料', unit: '份', isStaple: true },
    { name: '花椒', category: '香料', unit: '份', isStaple: true },
    { name: '八角', category: '香料', unit: '个', isStaple: false },
    { name: '桂皮', category: '香料', unit: '1小块', isStaple: false },
    { name: '枸杞', category: '香料', unit: '袋', isStaple: false },
    { name: '花椒粉', category: '香料', unit: '份', isStaple: false },
    { name: '辣椒粉', category: '香料', unit: '份', isStaple: false },
    { name: '泡椒', category: '香料', unit: '份', isStaple: false },
    // 装饰
    { name: '白芝麻', category: '装饰', unit: '袋', isStaple: false },
    { name: '香油', category: '装饰', unit: '瓶', isStaple: true },
    // 主食
    { name: '隔夜米饭', category: '主食', unit: '碗', isStaple: true },
    { name: '细面条', category: '主食', unit: '150g', isStaple: true },
    // 淀粉
    { name: '淀粉', category: '调料', unit: '袋', isStaple: true },
    { name: '水淀粉', category: '调料', unit: '份', isStaple: false }
  ];

  // 清空现有数据
  db.exec('DELETE FROM dishes');
  db.exec('DELETE FROM ingredients');

  // 插入菜品数据
  const insertDish = db.prepare(`
    INSERT INTO dishes (id, name, category, tags, difficulty, cooking_time, servings, description, ingredients, steps, tips, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // 插入食材数据
  const insertIngredient = db.prepare(`
    INSERT INTO ingredients (id, name, category, unit, is_staple)
    VALUES (?, ?, ?, ?, ?)
  `);

  // 插入食材
  ingredients.forEach((ing, index) => {
    const id = `ing_${String(index + 1).padStart(3, '0')}`;
    insertIngredient.run(id, ing.name, ing.category, ing.unit, ing.isStaple ? 1 : 0);
  });

  // 插入菜品
  dishes.forEach((dish, index) => {
    const id = `dish_${String(index + 1).padStart(3, '0')}`;
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
  });

  // 初始化用户偏好
  db.prepare(`
    INSERT IGNORE INTO user_preferences (id) VALUES (1)
  `).run();

  console.log(`✅ 已导入 ${dishes.length} 道菜品和 ${ingredients.length} 种食材`);
};
