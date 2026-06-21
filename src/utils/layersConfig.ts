/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GeologicLayer } from '../types';

export const GEOLOGIC_LAYERS: GeologicLayer[] = [
  {
    id: 'modern',
    name: '现代地表',
    rangeName: '人类文明与全新世',
    targetDepth: 0,
    eraText: '现代 (0米)',
    colorTheme: {
      sky: 'from-sky-400 to-sky-100',
      background: 'bg-emerald-550',
      cardboardBg: 'bg-[#d2b48c]', // Tan cardboard
      caveBorder: 'border-amber-900',
      textAccent: 'text-emerald-700',
      accentGlow: 'shadow-emerald-300'
    },
    description: '这是旅程的起点。白云微风，草长莺飞，脚下的泥土下掩埋着人类千百年的历史，也是考古学家解密地球过去的温床。向下划动开凿地壳吧！',
    fossils: [
      {
        id: 'modern-camp',
        name: '考古发掘站',
        scientificName: 'Archaeological Dig Site',
        depth: 2,
        era: '全新世 (约5000年前)',
        description: '考古学家们在此安营扎寨。在土壤表层，他们发掘出石器时代的陶器残片、早期农耕工具和青铜器时代遗存，这是人类改造地表的证据。',
        unlocked: false,
        type: 'archaeology',
        details: [
          '发现深度：地表以下 1.5 - 5 米',
          '地层含沙量：高，多为腐殖质土壤与细沙',
          '关键文物理论：陶器、燧石箭镞，反映早期人类的定居与农耕进化'
        ],
        graphicType: 'camp'
      },
      {
        id: 'modern-sonar',
        name: '三维透地雷达机',
        scientificName: 'Ground Penetrating Radar',
        depth: 8,
        era: '现代科技',
        description: '高频穿透地学电磁雷达，用于在不动土的前提下扫描下方几十米的地质构造与隐蔽墓穴。雷达电波会反馈出岩层间明显的介电常数差异。',
        unlocked: false,
        type: 'archaeology',
        details: [
          '探测频率：100MHz - 1000MHz',
          '探测极限：最大穿透深度达 30 米',
          '科技价值：非破坏性考古评估的核心仪器，能标绘基岩、地下管道或深藏动物残骸的精准轮廓'
        ],
        graphicType: 'radar'
      }
    ]
  },
  {
    id: 'ice_age',
    name: '第四纪冰期',
    rangeName: '更新世冰河盛世',
    targetDepth: 50,
    eraText: '约 2 万年前 (-50米)',
    colorTheme: {
      sky: 'from-[#e0f2fe] to-[#bae6fd]',
      background: 'bg-sky-100',
      cardboardBg: 'bg-[#e0f2fe]', // Ice blue card
      caveBorder: 'border-sky-300',
      textAccent: 'text-sky-600',
      accentGlow: 'shadow-sky-400'
    },
    description: '四周被粗糙的冰晶纹理包围。猛犸象成群结队地在苔原阔步，巨齿猛兽在冰雪风暴中咆哮，这是地球距离今日最近的一个严寒大世纪。',
    fossils: [
      {
        id: 'mammoth',
        name: '真猛犸象化石骨架',
        scientificName: 'Mammuthus primigenius',
        depth: 50,
        era: '更新世晚期 (约2.5万年前)',
        description: '一只成年真猛犸象的完整骨骼。它拥有长达3米的螺旋状弯曲象牙，身上覆盖着厚重的红褐色御寒刚毛与皮下脂肪，完美适应严酷冰原。',
        unlocked: false,
        type: 'fossil',
        details: [
          '化石保存状况：全骨骼闭合，部分牙齿珐琅质完全矿化',
          '体型参数：肩高 3.2 米，体重估算达 6 吨',
          '食性特征：取食冻原草本植物、落叶松叶片和苔藓。点击化石可以激活骨架3D式自下而上生长！'
        ],
        graphicType: 'mammoth_skeleton'
      },
      {
        id: 'sabertooth',
        name: '毁灭刃齿虎头骨',
        scientificName: 'Smilodon populator',
        depth: 72,
        era: '更新世晚期 (约1.2万年前)',
        description: '著名的“剑齿虎”标志性骨骼。上颚长有一对近18厘米、呈匕首状的弯刀短剑犬齿，边缘带细小锯齿，专门给巨大猎物实施致命封喉咬杀。',
        unlocked: false,
        type: 'fossil',
        details: [
          '关键特征：下颌骨关节可向下张开达 120 度（现代狮子仅 65 度）',
          '食性特征：重点伏击野牛、巨型树懒等厚皮大型草食动物',
          '灭绝原因：冰期结束、大型猎物减少，加之早期人类狩猎竞争'
        ],
        graphicType: 'sabertooth_skull'
      }
    ]
  },
  {
    id: 'cretaceous',
    name: '白垩纪末期',
    rangeName: '恐龙王朝的宏大挽歌',
    targetDepth: 500,
    eraText: '约 6600 万年前 (-500米)',
    colorTheme: {
      sky: 'from-[#2e0804] to-[#120201]', // apocalyptic orange-black
      background: 'bg-orange-950',
      cardboardBg: 'bg-[#5c2d25]', // Ash-red cardboard
      caveBorder: 'border-red-900',
      textAccent: 'text-red-500',
      accentGlow: 'shadow-red-600'
    },
    description: '深褐色与暗红色交错的厚重地层。蕨类植物密布。天空正孕育着一颗决定千万物种命运的超级陨石——那是白垩纪的最后一幕。',
    fossils: [
      {
        id: 'triceratops',
        name: '三角龙 (活体/骨架)',
        scientificName: 'Triceratops horridus',
        depth: 500,
        era: '晚白垩世 (约6600万年前)',
        description: '最负盛名的植食性角龙科。头盾部极为沉重宽阔，额上挺立两根如刺刀般的长角，鼻角较短，能极其傲然地抵御暴龙等大型掠食者的撕咬。',
        unlocked: false,
        type: 'dinosaur',
        details: [
          '御敌法宝：重达2吨的巨大角质头盾与骨质角针复合防线',
          '身躯大小：身长 9 米，高度近 3 米，重约 8-12 吨',
          '灭绝纪实：点击本生物或触发陨石陨落大动效，名片将被悲壮印上“EXTINCT（灭绝）”猩红印章。'
        ],
        graphicType: 'triceratops'
      },
      {
        id: 'tyrannosaurus',
        name: '霸王龙化石残片',
        scientificName: 'Tyrannosaurus rex',
        depth: 530,
        era: '晚白垩世 (约6650万年前)',
        description: '地球历史上已知最强悍的陆地食肉动物。这里保留了它满含香蕉状锯齿牙齿的巨型下颚化石，咬合力最高可惊人地达到 60000 牛顿。',
        unlocked: false,
        type: 'fossil',
        details: [
          '体型估算：体长12-13米，臀高约4米，体重达9吨',
          '前肢特征：极度退化，名声在外的“小短手”，仅配备两个带爪指头',
          '感官系统：具备出色的双目立体视觉和极度发达的嗅觉神经叶'
        ],
        graphicType: 'trex_jaw'
      }
    ]
  },
  {
    id: 'jurassic',
    name: '侏罗纪盛世',
    rangeName: '绿意葱郁的恐龙全盛季',
    targetDepth: 800,
    eraText: '约 1.5 亿年前 (-800米)',
    colorTheme: {
      sky: 'from-amber-600 via-emerald-600 to-[#123524]',
      background: 'bg-emerald-950',
      cardboardBg: 'bg-[#2f5c40]', // Forest-green cardboard
      caveBorder: 'border-emerald-800',
      textAccent: 'text-emerald-400',
      accentGlow: 'shadow-green-500'
    },
    description: '极其温暖湿润，氧气充足。高耸的裸子树木遮天蔽日。几层楼高的腕龙巨兽正悠闲地啃噬着森林顶端的多汁树叶，森林里充斥着空灵共鸣。',
    fossils: [
      {
        id: 'brachiosaurus',
        name: '高耸腕龙',
        scientificName: 'Brachiosaurus altithorax',
        depth: 800,
        era: '晚侏罗世 (约1.5亿年前)',
        description: '一种前肢远长于后肢的蜥脚类恐龙，像长颈鹿一样将脖子伸得极直极高。它们长有勺状牙齿，每日能快速扫除大量的针叶树叶。',
        unlocked: false,
        type: 'dinosaur',
        details: [
          '身高维度：头高可达 13-15 米，身长 26 米',
          '饮水量限制：由于身体极大，每天需要摄取近400千克新鲜干物叶子',
          '互动特技：点击腕龙，将触发它伸长脖子“咀嚼森林树冠”的互动，产生树叶飘落、并伴随低沉胸腔共鸣声波！'
        ],
        graphicType: 'brachiosaurus'
      },
      {
        id: 'pterosaur',
        name: '无齿翼龙',
        scientificName: 'Pteranodon longiceps',
        depth: 850,
        era: '晚侏罗世到白垩纪',
        description: '展翅翱翔在远古风暴上空的滑翔霸主。头骨后方有极长的骨质冠突，用作空中滑翔配重平衡舵。它的翅膀是由皮肤连接延长的第四指构成的。',
        unlocked: false,
        type: 'dinosaur',
        details: [
          '双翼弧度：翼展可跨越 6 - 8 米，但体重极为轻盈（仅约 20 千克）',
          '骨骼构造：骨骼内部多孔中空，极度减重以利于在热气流上乘风滑翔',
          '滑行特技：它飞掠地面的影子让陆地恐龙也为之侧目。点击呼唤翼龙翱翔！'
        ],
        graphicType: 'pterosaur'
      }
    ]
  },
  {
    id: 'precambrian',
    name: '前寒武纪底层',
    rangeName: '地球初生与原始生命脉动',
    targetDepth: 3000,
    eraText: '约 38 亿年前 (-3000米)',
    colorTheme: {
      sky: 'from-orange-950 to-neutral-950',
      background: 'bg-[#1a0808]',
      cardboardBg: 'bg-[#291111]', // Deep lava cardboard
      caveBorder: 'border-red-950',
      textAccent: 'text-red-400',
      accentGlow: 'shadow-red-950'
    },
    description: '深黑的死寂。暴怒的熔岩地幔河流在脚下流淌。这是生命诞生之初的“原始汤”——只有一些发出隐隐微光的单细胞微观泡泡在此孕育。',
    fossils: [
      {
        id: 'luca',
        name: 'LUCA 原始生命体',
        scientificName: 'Last Universal Common Ancestor',
        depth: 3000,
        era: '冥古宙晚期 (约38-40亿年前)',
        description: '“所有生命的共同祖先”。一个在炽热、微量矿物质丰富的深海热泉排气孔旁游荡的、极简单的单细胞生命始祖，掌握了分裂与遗传密码。',
        unlocked: false,
        type: 'origin',
        details: [
          '遗传结构：单链原始核糖核酸(RNA)，利用铁硫复合物进行催化呼吸',
          '微观尺寸：纳米级微小生命结构，依靠双层脂质膜保持与高毒性环境分界',
          '分裂功能：点击本生命祖先会连续发起分裂：细胞核拉长、一分为二，让生命火种在这颗炽热幼星上熊熊燃起！'
        ],
        graphicType: 'luca'
      },
      {
        id: 'primordial-soup',
        name: '原始汤活性气泡',
        scientificName: 'Abiogenesis Organic Drops',
        depth: 3100,
        era: '太古宙 (约35亿年前)',
        description: '在闪电与火山熔岩交加之下，甲烷、氨和水汽反应凝结而成的富含有机物的液滴。这是地球非生物有机分子跨入生命大门前的活性前体。',
        unlocked: false,
        type: 'origin',
        details: [
          '组成部分：富含氨基酸、脂质微球、简单糖类复合水滴',
          '化学演变：由团聚体或微球体在矿物粘土微孔中逐步堆叠出自我复制能动性',
          '声音体验：点击这些汤泡泡会发出“嘟噜”声，并在屏幕边缘激发出一道辉煌的太初金色光芒'
        ],
        graphicType: 'bubble'
      }
    ]
  }
];
