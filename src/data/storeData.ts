import heroReviveDupattaImg from '../assets/images/hero_revive_dupatta_1790397131397.jpg';
import heroBhimbetkaMotifsImg from '../assets/images/hero_bhimbetka_motifs_1790397150064.jpg';
import heroWoodenBlocksImg from '../assets/images/hero_wooden_blocks_1790397165507.jpg';
import productClothesHoodieImg from '../assets/images/product_clothes_hoodie_1790397183670.jpg';
import bannerFashionModelImg from '../assets/images/banner_fashion_model_1790397199817.jpg';
import heroCraftBgImg from '../assets/images/hero_craft_bg_1790398896866.jpg';

export interface FloatingCallout {
  id: string;
  title: string;
  subtitle: string;
  priceOrMetric: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'mid-left';
  productId: string;
  image?: string;
}

export interface HeroCreation {
  id: string;
  slug: string;
  tag: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  heroImage: string;
  blogHeroImage?: string;
  readTime: string;
  cluster: string;
  category: string;
  floatingCallouts: FloatingCallout[];
  blogPost: {
    author: string;
    role: string;
    date: string;
    lead: string;
    specs: { label: string; value: string }[];
    chapters: { title: string; body: string; craftTip: string }[];
    relatedProductIds: string[];
    relatedWorkGroupIds: string[];
  };
}

export interface SmallTask {
  id: string;
  code: string;
  title: string;
  detail: string;
  duration: string;
  completed: boolean;
}

export interface WorkGroup {
  id: string;
  groupNumber: string;
  title: string;
  categoryName: string;
  image: string;
  summary: string;
  smallTasks: SmallTask[];
}

export interface ProductReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: 'Clothes & Patterns' | 'Revive Dupatta' | 'Bhimbetka Motifs' | 'Wooden Blocks';
  workGroupId: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  badgeType?: 'new' | 'discount' | 'bestseller';
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  image: string;
  gallery?: string[];
  material: string;
  dye: string;
  origin: string;
  description: string;
  sizes: string[];
  features?: string[];
  careInstructions?: string;
  artisanName?: string;
  artisanCluster?: string;
  dimensions?: string;
  inStock?: boolean;
  stockCount?: number;
  highlights?: { label: string; value: string }[];
  customerReviewsList?: ProductReview[];
}

export const formatINR = (amount: number): string => {
  return '₹' + Math.round(amount).toLocaleString('en-IN');
};

export const HERO_CREATIONS: HeroCreation[] = [
  {
    id: 'creation-revive-dupatta',
    slug: 'revive-dupatta',
    tag: 'TRENDING CREATION',
    title: 'Revive Dupatta — Heirloom Drapes Reborn in Natural Dye',
    shortTitle: 'Revive Dupatta',
    subtitle: 'Giving second life to heritage Chanderi and Mulmul dupattas through Harda tannin baths, zari darning, and layered hand-block over-printing.',
    heroImage: bannerFashionModelImg,
    blogHeroImage: heroReviveDupattaImg,
    readTime: '5 min read',
    cluster: 'Bagh & Chanderi Weavers, MP',
    category: 'Revive Dupatta',
    floatingCallouts: [
      {
        id: 'fc-1',
        title: 'Chanderi Silk Drape',
        subtitle: '100s Count Weave',
        priceOrMetric: '₹2,999',
        position: 'top-left',
        productId: 'prod-1',
      },
      {
        id: 'fc-2',
        title: 'Botanical Madder Vat',
        subtitle: 'Zero Synthetic Azo',
        priceOrMetric: '100% Eco Dye',
        position: 'mid-left',
        productId: 'prod-2',
      },
      {
        id: 'fc-3',
        title: 'Zari Selvedge Repair',
        subtitle: 'Hand-darned borders',
        priceOrMetric: '₹3,799',
        position: 'top-right',
        productId: 'prod-3',
      },
      {
        id: 'fc-4',
        title: 'Bhimbetka Overprint',
        subtitle: 'Sandstone pigment block',
        priceOrMetric: '₹2,499',
        position: 'bottom-right',
        productId: 'prod-1',
      },
    ],
    blogPost: {
      author: 'Rupal Joshi',
      role: 'Textile Research & Craft Preservation',
      date: 'Autumn Collection 2026',
      lead: 'The Revive Dupatta initiative restores vintage handloom textiles that have suffered minor water marks, sun-faded folds, or frayed zari selvedges. By strategically hand-stamping prehistoric motifs over imperfections, we honor the original weaver while producing an entirely new heirloom drape.',
      specs: [
        { label: 'Substrate', value: 'Vintage Chanderi Silk-Cotton & Organza Mulmul' },
        { label: 'Tannin Mordant', value: 'Sun-dried Myrobalan (Harda) + Alum' },
        { label: 'Dye Palette', value: 'Alizarin Madder Red, Fermented Iron Kasim, Natural Indigo' },
        { label: 'Dimensions', value: '2.5 Meters × 92 cm with hand-twisted tassels' },
      ],
      chapters: [
        {
          title: '1. Diagnostic Mapping of Vintage Weaves',
          body: 'Each incoming dupatta is stretched across a backlit inspection lightbox. Areas of vintage oxidation, discoloration, or weakened silk threads are marked with basting stitches. We wash each piece in cold soapnut (reetha) water to degrease without stripping natural silk luster.',
          craftTip: 'Cold soapnut bath preserves 98% of aged metallic zari brightness while prepping cotton fibers for tannin bonding.',
        },
        {
          title: '2. The Harda Mordant Ground Bath',
          body: 'Rather than chemical bleaching, the dupatta is submerged in a warm Harda (myrobalan) bath. This gives the background a warm ivory-ecru tooth and creates the chemical anchor needed for iron and madder dye molecules to form permanent bonds.',
          craftTip: 'Sundrying the Harda-treated cloth over clean riverbed sands develops even warmth across the entire 2.5-meter drape.',
        },
        {
          title: '3. Hand-Block Over-Printing with Bhimbetka Motifs',
          body: 'Master printers position hand-carved teakwood blocks directly over the former fade lines. The prehistoric stick figures, dancing troupes, and archers camouflage age marks into purposeful graphic rhythm.',
          craftTip: 'Every revived piece saves up to 2,700 liters of water compared to newly woven industrial yardage.',
        },
      ],
      relatedProductIds: ['prod-1', 'prod-3', 'prod-5'],
      relatedWorkGroupIds: ['wg-4', 'wg-5', 'wg-6'],
    },
  },
  {
    id: 'creation-bhimbetka-motifs',
    slug: 'bhimbetka-motifs',
    tag: 'HERITAGE PATTERNS',
    title: 'Bhimbetka Motifs — 10,000-Year Cave Art on Modern Cloth',
    shortTitle: 'Bhimbetka Motifs',
    subtitle: 'Translating Mesolithic rock paintings of communal dancers, spirited wild horses, and geometric symbols into contemporary wearable cloth patterns.',
    heroImage: bannerFashionModelImg,
    blogHeroImage: heroBhimbetkaMotifsImg,
    readTime: '6 min read',
    cluster: 'Bhopal & Raisen Craft Guild, MP',
    category: 'Bhimbetka Motifs',
    floatingCallouts: [
      {
        id: 'fc-b1',
        title: 'Dancing Tribe Repeat',
        subtitle: 'Shelter III-F-23 Motif',
        priceOrMetric: '₹1,499',
        position: 'top-left',
        productId: 'prod-4',
      },
      {
        id: 'fc-b2',
        title: 'Red Hematite Geru',
        subtitle: 'Natural iron mineral pigment',
        priceOrMetric: 'Mineral Fast',
        position: 'mid-left',
        productId: 'prod-2',
      },
      {
        id: 'fc-b3',
        title: 'Equus Wild Horse',
        subtitle: 'Running border print',
        priceOrMetric: '₹2,799',
        position: 'top-right',
        productId: 'prod-5',
      },
      {
        id: 'fc-b4',
        title: 'Raw Mulmul Fabric',
        subtitle: 'Unbleached breathable cotton',
        priceOrMetric: '₹499 / Yd',
        position: 'bottom-right',
        productId: 'prod-6',
      },
    ],
    blogPost: {
      author: 'Rupal Joshi',
      role: 'Pattern Designer & Rock Art Chronicler',
      date: 'Summer / Fall 2026',
      lead: 'Hidden within the Vindhyan sandstone cliffs of Madhya Pradesh lie the Bhimbetka rock shelters—holding unbroken visual records of human expression. We spent months tracing these dynamic figures to develop modern textile patterns suitable for hoodies, stoles, and yardage.',
      specs: [
        { label: 'Origin Source', value: 'Bhimbetka Caves (Zoo Rock & Auditorium Shelter)' },
        { label: 'Geometry', value: 'Half-drop repeating grid with 1.2mm minimum line relief' },
        { label: 'Pigments', value: 'Red Hematite (Geru), Burnt Ochre, Fermented Carbon Black' },
        { label: 'Fabrics', value: 'Organic Khadi, 100s Count Mulmul, Raw Linen' },
      ],
      chapters: [
        {
          title: '1. Converting Ancient Rock Strokes to Block Geometry',
          body: 'Cave paintings were spontaneously brushed onto rough sandstone. To chisel these figures into teakwood blocks, our studio standardized line weights to 1.2mm while retaining the expressive kinetic gesture of the Mesolithic hunters and dancers.',
          craftTip: 'Preserving open negative space around figures prevents visual crowding on tailored garments.',
        },
        {
          title: '2. Earth Mineral & Fermented Dye Formulations',
          body: 'The prehistoric painters mixed powdered hematite and chalcedony with plant resin. On cloth, we achieve the identical deep sienna and charcoal tones using fermented iron-jaggery paste (Kasim) and natural madder roots.',
          craftTip: 'Fermented iron reacts with fabric tannins to produce deep indelible blacks that never wash out.',
        },
        {
          title: '3. Rhythm Across Contemporary Silhouettes',
          body: 'Rather than treating the motifs as static prints, we arrange them in rhythmic linear bands along sleeves, hemlines, and necklines—giving modern streetwear a connection to ancient human art.',
          craftTip: 'Pairing primitive rock figures with minimal clean tailoring creates high-fashion contrast.',
        },
      ],
      relatedProductIds: ['prod-4', 'prod-2', 'prod-6'],
      relatedWorkGroupIds: ['wg-1', 'wg-3', 'wg-5'],
    },
  },
  {
    id: 'creation-wooden-blocks',
    slug: 'wooden-blocks',
    tag: 'ARTISAN MATRICES',
    title: 'Wooden Blocks — Hand-Carved Sagwan Teak Printing Matrices',
    shortTitle: 'Wooden Blocks',
    subtitle: 'Precision-chiseled seasoned teakwood blocks (Thappa) engineered with 6mm relief walls and air-release vents for crisp hand stamping on textiles.',
    heroImage: bannerFashionModelImg,
    blogHeroImage: heroWoodenBlocksImg,
    readTime: '4 min read',
    cluster: 'Pethapur & Bagh Carvers Guild',
    category: 'Wooden Blocks',
    floatingCallouts: [
      {
        id: 'fc-w1',
        title: 'Sagwan Teakwood',
        subtitle: '5-Year Seasoned Timber',
        priceOrMetric: 'Zero Warping',
        position: 'top-left',
        productId: 'prod-3',
      },
      {
        id: 'fc-w2',
        title: '0.8mm Kalam Chisel',
        subtitle: 'Hand-carved depth',
        priceOrMetric: '10,000+ Prints',
        position: 'mid-left',
        productId: 'prod-8',
      },
      {
        id: 'fc-w3',
        title: 'Rekh & Datta Pair',
        subtitle: 'Outline + Fill Matrix',
        priceOrMetric: '₹1,299',
        position: 'top-right',
        productId: 'prod-3',
      },
      {
        id: 'fc-w4',
        title: 'Mustard Oil Cured',
        subtitle: 'Water & dye resistant',
        priceOrMetric: '₹899 Kit',
        position: 'bottom-right',
        productId: 'prod-8',
      },
    ],
    blogPost: {
      author: 'Rupal Joshi',
      role: 'Toolmaker & Block Printing Specialist',
      date: 'Continuous Guild Craft',
      lead: 'Before any fabric receives its pattern, the woodcarver sits for days with specialized chisels, working seasoned Sagwan (teak) into raised relief stamping tools. Each block is an extraordinary sculpture in its own right.',
      specs: [
        { label: 'Timber', value: 'Seasoned Indian Teakwood (Tectona grandis)' },
        { label: 'Tool Class', value: 'Rekh (Outline), Datta (Fill), Gadh (Ground)' },
        { label: 'Relief Wall', value: '6mm to 8mm deep with 75° tapered bevel' },
        { label: 'Curing', value: '7-day immersion in cold-pressed mustard oil' },
      ],
      chapters: [
        {
          title: '1. Seasoning and Sanding the Timber',
          body: 'Only close-grained teak that has endured multiple monsoon cycles is selected. It resists warping when repeatedly submerged in aqueous dye trays. The carver planes the stamping face to absolute optical flatness and applies a white chalk paste (safeda).',
          craftTip: 'Air-dried teak prevents expansion and ensures pattern repeats align across 6 meters without drift.',
        },
        {
          title: '2. Hand Chiseling with Custom Kalams',
          body: 'Using over thirty handheld iron chisels and a mallet, the carver cuts away the negative space. The base of each line is beveled outward so delicate relief lines never snap under the printer’s fist pressure.',
          craftTip: 'Subtle drill holes allow air trapped beneath the wood block to escape, preventing blotchy dye haloing.',
        },
        {
          title: '3. Mustard Oil Bath and Test Stamping',
          body: 'Once carved, the blocks are soaked in mustard oil for a week to condition the wood against moisture. They are test-stamped onto raw muslin and certified before release to our printing tables or collectors.',
          craftTip: 'Clean blocks with warm water and soft brush after printing; re-oil annually.',
        },
      ],
      relatedProductIds: ['prod-3', 'prod-8', 'prod-1'],
      relatedWorkGroupIds: ['wg-2', 'wg-5', 'wg-6'],
    },
  },
];

export const WORK_GROUPS: WorkGroup[] = [
  {
    id: 'wg-1',
    groupNumber: '01',
    title: 'Motif Research & Tracing',
    categoryName: 'Bhimbetka Motifs',
    image: heroBhimbetkaMotifsImg,
    summary: 'Documenting cave paintings and calibrating stroke widths for wood chisel reproduction.',
    smallTasks: [
      {
        id: 't-1',
        code: '1.1',
        title: 'Extract figures from Cave Shelter III-F',
        detail: 'Isolate dancing figures and equine motifs from archival photography.',
        duration: '4 hrs',
        completed: true,
      },
      {
        id: 't-2',
        code: '1.2',
        title: 'Calibrate minimum 1.2mm stroke weight',
        detail: 'Ensure lines are structurally carvable in teakwood without snapping.',
        duration: '2.5 hrs',
        completed: true,
      },
      {
        id: 't-3',
        code: '1.3',
        title: 'Establish half-drop seamless repeat grid',
        detail: 'Test seamless boundary math across 44-inch textile roll width.',
        duration: '3 hrs',
        completed: true,
      },
      {
        id: 't-4',
        code: '1.4',
        title: 'Prepare pin-pricked master butter paper',
        detail: 'Perforate tracing line work for chalk dust transfer onto wood.',
        duration: '1.5 hrs',
        completed: false,
      },
    ],
  },
  {
    id: 'wg-2',
    groupNumber: '02',
    title: 'Teak Wood Block Carving',
    categoryName: 'Wooden Blocks',
    image: heroWoodenBlocksImg,
    summary: 'Hand-chiseling seasoned Sagwan wood into registered Rekh (outline) and Datta (fill) blocks.',
    smallTasks: [
      {
        id: 't-5',
        code: '2.1',
        title: 'Surface plane Sagwan timber block',
        detail: 'Level wood to 0.1mm flatness and brush safeda chalk ground.',
        duration: '2 hrs',
        completed: true,
      },
      {
        id: 't-6',
        code: '2.2',
        title: 'Chisel fine Rekh outline with kalam',
        detail: 'Carve 6mm deep relief channel around outer motif edges.',
        duration: '12 hrs',
        completed: true,
      },
      {
        id: 't-7',
        code: '2.3',
        title: 'Drill vertical air-release escape vents',
        detail: 'Prevent air pockets under stamped block from smudging dye.',
        duration: '1 hr',
        completed: true,
      },
      {
        id: 't-8',
        code: '2.4',
        title: '7-day mustard oil soak and proofing',
        detail: 'Cure wood against water absorption; print first test swatch.',
        duration: '7 days',
        completed: true,
      },
    ],
  },
  {
    id: 'wg-3',
    groupNumber: '03',
    title: 'Natural Dye & Mordant Prep',
    categoryName: 'Bhimbetka Motifs',
    image: bannerFashionModelImg,
    summary: 'Brewing fermented iron-jaggery black, alum fixatives, and botanical madder red pastes.',
    smallTasks: [
      {
        id: 't-9',
        code: '3.1',
        title: 'Reetha soapnut scouring wash',
        detail: 'Boil unbleached mulmul & khadi yardage to strip loom oils.',
        duration: '5 hrs',
        completed: true,
      },
      {
        id: 't-10',
        code: '3.2',
        title: 'Harda (Myrobalan) tannin bath',
        detail: 'Mordant clean cotton yardage to accept natural dye pigments.',
        duration: '4 hrs',
        completed: true,
      },
      {
        id: 't-11',
        code: '3.3',
        title: 'Kasim iron-jaggery 14-day fermentation',
        detail: 'Ferment scrap iron and raw jaggery in earthen pots for deep black.',
        duration: '14 days',
        completed: true,
      },
      {
        id: 't-12',
        code: '3.4',
        title: 'Tamarind seed gum thickening',
        detail: 'Simmer roasted tamarind seeds into printing paste viscosity.',
        duration: '3 hrs',
        completed: false,
      },
    ],
  },
  {
    id: 'wg-4',
    groupNumber: '04',
    title: 'Dupatta Restoration & Mordanting',
    categoryName: 'Revive Dupatta',
    image: heroReviveDupattaImg,
    summary: 'Inspecting vintage heirlooms, repairing damaged selvedges, and preparing for over-dyeing.',
    smallTasks: [
      {
        id: 't-13',
        code: '4.1',
        title: 'Backlit lightbox defect mapping',
        detail: 'Chart discoloration spots and worn zari threads across vintage drape.',
        duration: '2 hrs',
        completed: true,
      },
      {
        id: 't-14',
        code: '4.2',
        title: 'Fine zari needle darning and reinforcement',
        detail: 'Hand-darn frayed selvedges with matching antique gold thread.',
        duration: '6 hrs',
        completed: true,
      },
      {
        id: 't-15',
        code: '4.3',
        title: 'Targeted Harda immersion for tone warmth',
        detail: 'Give aged white silk a consistent warm ivory parchment ground.',
        duration: '3 hrs',
        completed: true,
      },
      {
        id: 't-16',
        code: '4.4',
        title: 'Layout planning for motif overprint',
        detail: 'Align block placement so dance motifs integrate over faint marks.',
        duration: '2 hrs',
        completed: false,
      },
    ],
  },
  {
    id: 'wg-5',
    groupNumber: '05',
    title: 'Hand-Block Stamping on Fabric',
    categoryName: 'Clothes & Patterns',
    image: productClothesHoodieImg,
    summary: 'Stamping Rekh and Datta blocks in perfect register across tensioned fabric tables.',
    smallTasks: [
      {
        id: 't-17',
        code: '5.1',
        title: 'Pin fabric across 24-layer jute table',
        detail: 'Tension cloth without stretching to ensure repeatable stamping.',
        duration: '1 hr',
        completed: true,
      },
      {
        id: 't-18',
        code: '5.2',
        title: 'Charge wooden tari tray felt pad',
        detail: 'Evenly distribute natural dye paste on bamboo grid felt.',
        duration: '30 mins',
        completed: true,
      },
      {
        id: 't-19',
        code: '5.3',
        title: 'Stamp outer border with pin registration',
        detail: 'Align guide pins on block corners for continuous narrative frieze.',
        duration: '4.5 hrs',
        completed: true,
      },
      {
        id: 't-20',
        code: '5.4',
        title: 'Overlay secondary Datta color block',
        detail: 'Stamp terracotta and ochre fills inside black outline motifs.',
        duration: '3 hrs',
        completed: false,
      },
    ],
  },
  {
    id: 'wg-6',
    groupNumber: '06',
    title: 'Sun Curing & Final Finishing',
    categoryName: 'Clothes & Patterns',
    image: heroReviveDupattaImg,
    summary: 'Boiling in copper dye vats with Dhawda flowers, river washing, and steam tailoring.',
    smallTasks: [
      {
        id: 't-21',
        code: '6.1',
        title: '72-Hour solar oxidation cure',
        detail: 'Rest printed yardage in open sunshine to let mordant bond to fiber.',
        duration: '3 days',
        completed: true,
      },
      {
        id: 't-22',
        code: '6.2',
        title: 'Copper vat boiling with alizarin root',
        detail: 'Boil cloth in copper cauldron to develop vibrant brick-red color.',
        duration: '4 hrs',
        completed: true,
      },
      {
        id: 't-23',
        code: '6.3',
        title: 'Flowing water river wash & air dry',
        detail: 'Rinse out gum paste until rinse water runs crystal clear.',
        duration: '5 hrs',
        completed: true,
      },
      {
        id: 't-24',
        code: '6.4',
        title: 'Quality inspection & craft certificate',
        detail: 'Sign artisan maker tag and stitch signature orange corner loop.',
        duration: '1 hr',
        completed: true,
      },
    ],
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Revive Chanderi Silk-Cotton Dupatta',
    category: 'Revive Dupatta',
    workGroupId: 'wg-4',
    price: 2999,
    originalPrice: 3799,
    rating: 4.9,
    reviews: 128,
    badge: '-20%',
    badgeType: 'discount',
    isBestSeller: true,
    isNewArrival: true,
    image: heroReviveDupattaImg,
    gallery: [heroReviveDupattaImg, bannerFashionModelImg, heroBhimbetkaMotifsImg, heroCraftBgImg],
    material: 'Handwoven Chanderi Silk & Organic Cotton (100s count)',
    dye: 'Natural Madder Root Red, Myrobalan Harda & Indigo',
    origin: 'Restored in Bagh & Chanderi, MP',
    description: 'Heirloom Chanderi dupatta restored with hand-darned zari selvedges and stamped with Bhimbetka cave narrative borders. Extremely lightweight with an ethereal drape that breathes effortlessly through seasonal transitions.',
    sizes: ['2.5 Meters Standard', '2.75 Meters Long Drape'],
    features: [
      'Genuine vintage Chanderi base with gossamer silk-cotton weave',
      'Hand-darned antique gold zari borders preserving heirloom selvedges',
      'Overprinted with Mesolithic stick-figure dancing troupe motifs',
      'Pre-washed in botanical soapnut (reetha) bath for softness and zero chemical odor',
      'Conserves over 2,700 liters of water compared to newly woven industrial drapes',
    ],
    careInstructions: 'Dry clean recommended for the first wash to set botanical pigments. For subsequent washes, hand wash separately in cold water with mild liquid reetha or gentle detergent. Do not wring or soak. Dry flat in shade. Medium warm iron on reverse side.',
    artisanName: 'Bagh & Chanderi Weavers Guild',
    artisanCluster: 'Chanderi & Dhar Cluster, Madhya Pradesh',
    dimensions: '250 cm × 92 cm · 140 grams',
    inStock: true,
    stockCount: 8,
    highlights: [
      { label: 'Weave Substrate', value: '100s Count Handloom Silk-Cotton' },
      { label: 'Tannin Mordant', value: 'Sun-dried Myrobalan (Harda)' },
      { label: 'Dye Vats', value: 'Alizarin Madder & Indigo' },
      { label: 'Process Group', value: 'Work Group 04: Dupatta Restoration' },
      { label: 'Authenticity', value: 'Craftmark Verified & Artisan Signed' },
    ],
    customerReviewsList: [
      {
        id: 'rev-101',
        author: 'Ananya Sharma',
        location: 'Bengaluru, Karnataka',
        rating: 5,
        date: '14 Sept 2026',
        title: 'The drape and texture are breathtaking',
        content: 'I wore this for a family function and received countless compliments. The hand-darned zari border gives it that rare vintage character that modern fast-fashion cannot replicate. The natural madder tones are earthy and rich.',
        verified: true,
      },
      {
        id: 'rev-102',
        author: 'Meera Deshmukh',
        location: 'Pune, Maharashtra',
        rating: 5,
        date: '28 Aug 2026',
        title: 'Heirloom quality that honors real artisans',
        content: 'Knowing that this revived dupatta saved thousands of liters of water while empowering women weavers in Chanderi makes wearing it an absolute joy. The dancing cave motifs are chiseled with immense clarity.',
        verified: true,
      },
      {
        id: 'rev-103',
        author: 'Pooja Venkatesh',
        location: 'Chennai, Tamil Nadu',
        rating: 4,
        date: '10 Aug 2026',
        title: 'Featherlight silk and beautiful packaging',
        content: 'Super lightweight and soft. The hand-tied tassels at both ends are a wonderful delicate touch. Arrived in recyclable kraft packaging with a signed certificate of origin.',
        verified: true,
      },
    ],
  },
  {
    id: 'prod-2',
    name: 'Bhimbetka Cave Dancers Organic Stole',
    category: 'Bhimbetka Motifs',
    workGroupId: 'wg-1',
    price: 1499,
    originalPrice: 1999,
    rating: 4.8,
    reviews: 94,
    badge: 'New',
    badgeType: 'new',
    isBestSeller: true,
    isNewArrival: true,
    image: heroBhimbetkaMotifsImg,
    gallery: [heroBhimbetkaMotifsImg, bannerFashionModelImg, heroWoodenBlocksImg, heroCraftBgImg],
    material: '100% Unbleached Organic Mulmul Cotton',
    dye: 'Red Hematite Geru & Fermented Iron Kasim Black',
    origin: 'Hand-printed in Bhopal Pattern Studio',
    description: 'Featherweight organic mulmul stole depicting rhythmic Mesolithic cave dancers. Hand-block stamped with mineral-fast pigments that soften beautifully with every single wash while celebrating Madhya Pradesh rock heritage.',
    sizes: ['2.0m Stole', '2.5m Full Dupatta'],
    features: [
      '10,000-year-old rock shelter dancers chiseled into seasoned teak blocks',
      'Pure organic Indian mulmul cotton spun without synthetic sizing agents',
      'Dual-pigment stamping: Red Hematite Geru and fermented iron Kasim',
      'Soft-frayed natural edge selvedge for easy casual draping',
    ],
    careInstructions: 'Gentle machine wash or hand wash in cold water using mild eco-detergent. Wash dark colors separately. Line dry in gentle shade. Iron while slightly damp for crisp handloom finish.',
    artisanName: 'Bhopal Pattern & Rock Art Guild',
    artisanCluster: 'Raisen & Bhopal Region, MP',
    dimensions: '200 cm × 75 cm · 95 grams',
    inStock: true,
    stockCount: 14,
    highlights: [
      { label: 'Substrate', value: '100% Desi Mulmul Cotton' },
      { label: 'Motif Source', value: 'Bhimbetka Cave Shelter III-F-23' },
      { label: 'Pigments', value: 'Red Hematite & Fermented Iron' },
      { label: 'Process Group', value: 'Work Group 01: Concept & Pattern' },
    ],
    customerReviewsList: [
      {
        id: 'rev-201',
        author: 'Rohan Mehra',
        location: 'New Delhi',
        rating: 5,
        date: '02 Sept 2026',
        title: 'Perfect accessory for both casual and festive wear',
        content: 'The mulmul fabric is extraordinarily breathable. The print feels embedded into the cotton fibers rather than sitting on top like cheap screen printing. Will definitely purchase again.',
        verified: true,
      },
      {
        id: 'rev-202',
        author: 'Kavita Sundaram',
        location: 'Hyderabad, Telangana',
        rating: 5,
        date: '19 Aug 2026',
        title: 'A piece of Indian history you can wear',
        content: 'The research behind this collection shows. The dancers look alive across the fabric. Fast shipping and impeccable finishing.',
        verified: true,
      },
    ],
  },
  {
    id: 'prod-3',
    name: 'Hand-Carved Sagwan Teak Wood Block Set',
    category: 'Wooden Blocks',
    workGroupId: 'wg-2',
    price: 1299,
    originalPrice: 1699,
    rating: 5.0,
    reviews: 88,
    badge: 'Bestseller',
    badgeType: 'bestseller',
    isBestSeller: true,
    isNewArrival: true,
    image: heroWoodenBlocksImg,
    gallery: [heroWoodenBlocksImg, bannerFashionModelImg, heroCraftBgImg, heroReviveDupattaImg],
    material: '5-Year Seasoned Sagwan Teakwood (Tectona grandis)',
    dye: 'Cured in Cold-Pressed Mustard Oil with Muslin Proof Swatch',
    origin: 'Chiseled by Pethapur Master Carvers',
    description: 'Set of 3 hand-chiseled teak blocks featuring Bhimbetka dancing figures, running equine border, and geometric jaal. Features 6mm deep relief relief walls and angled air-escape vents for crisp, clean stamping on fabrics or paper.',
    sizes: ['Set of 3 Blocks', 'Master Guild 5-Block Set'],
    features: [
      'Carved from solid aged Central Indian Sagwan teakwood',
      'Angled relief cavities ensure air escapes smoothly during stamping',
      'Oil-cured for 7 days in raw mustard oil to prevent warping or swelling',
      'Includes stamped test muslin proof and artisan hallmark stamp',
    ],
    careInstructions: 'Wipe clean with a damp cotton cloth after stamping with water-based dyes. Store in a dry, ventilated box. Occasionally apply a drop of linseed or mustard oil to preserve teak luster.',
    artisanName: 'Master Ustad Fakir Mohammad',
    artisanCluster: 'Traditional Teak Carving Guild',
    dimensions: 'Three blocks (approx. 8×8cm, 12×5cm, 10×10cm) · 420 grams total',
    inStock: true,
    stockCount: 6,
    highlights: [
      { label: 'Timber', value: 'Aged Sagwan Teak (Tectona grandis)' },
      { label: 'Carving Depth', value: '6mm high-relief with air channels' },
      { label: 'Curing Period', value: '7-day cold-pressed oil immersion' },
      { label: 'Process Group', value: 'Work Group 02: Teak Block Carving' },
    ],
    customerReviewsList: [
      {
        id: 'rev-301',
        author: 'Deepika Iyer',
        location: 'Mumbai, Maharashtra',
        rating: 5,
        date: '08 Sept 2026',
        title: 'Master craftsmanship! The prints come out razor sharp',
        content: 'As a textile designer, I have tested many blocks. These Sagwan blocks are phenomenal. The air-escape holes prevent the dreaded dye pooling in the center. Pure joy to work with.',
        verified: true,
      },
      {
        id: 'rev-302',
        author: 'Arjun Nambiar',
        location: 'Kochi, Kerala',
        rating: 5,
        date: '22 Aug 2026',
        title: 'Heirloom tools that will last for decades',
        content: 'Solid, seasoned wood that smells like clean mustard oil and teak. Even as decorative studio display objects, they are artworks in their own right.',
        verified: true,
      },
    ],
  },
  {
    id: 'prod-4',
    name: 'Essential Hand-Block Pattern Hoodie',
    category: 'Clothes & Patterns',
    workGroupId: 'wg-5',
    price: 2499,
    originalPrice: 2999,
    rating: 4.9,
    reviews: 156,
    badge: 'New',
    badgeType: 'new',
    isBestSeller: true,
    isNewArrival: true,
    image: productClothesHoodieImg,
    gallery: [productClothesHoodieImg, bannerFashionModelImg, heroCraftBgImg, heroReviveDupattaImg],
    material: 'Heavyweight 420 GSM Organic French Terry Cotton',
    dye: 'Harda Ecru with Iron-Carbon Block Stamped Sleeves & Hood',
    origin: 'Crafted & Tailored in Jaipur Studio',
    description: 'Modern luxury hoodie apparel detailed with hand-block printed Bhimbetka tribal motifs along the raglan sleeve seams and hood crown. Features antique brass eyelets, thick cotton drawcords, and custom drop-shoulder relaxed silhouette.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    features: [
      'Heavyweight 420 GSM unbrushed organic French Terry cotton for supreme structure',
      'Continuous running block stamp along sleeve raglan seams by master printers',
      'Double-layered hood with internal pattern lining',
      'Solid ribbed cuffs and waistband with elastane recovery',
      'Pre-shrunk fabric to prevent post-wash shrinkage',
    ],
    careInstructions: 'Machine wash cold on gentle cycle inside out. Do not bleach. Tumble dry low or hang dry in shade. Warm iron on reverse side away from direct block print.',
    artisanName: 'Jaipur Block Stamping Workshop',
    artisanCluster: 'Sanganer & Jaipur Guild, Rajasthan',
    dimensions: 'Relaxed Drop-Shoulder Fit · 780 grams',
    inStock: true,
    stockCount: 18,
    highlights: [
      { label: 'Fabric Density', value: '420 GSM Organic French Terry' },
      { label: 'Print Technique', value: 'Hand-stamped with Kasim Iron Vat' },
      { label: 'Hardware', value: 'Antique Brass Grommets' },
      { label: 'Process Group', value: 'Work Group 05: Hand-Block Stamping' },
    ],
    customerReviewsList: [
      {
        id: 'rev-401',
        author: 'Siddharth Rao',
        location: 'Gurugram, Haryana',
        rating: 5,
        date: '18 Sept 2026',
        title: 'Substantial weight and incredible street silhouette',
        content: 'The 420 GSM terry feels luxurious and heavy. The hand-printed sleeve striping is subtle yet captivating when examined up close. Truly bridges ancient Indian craft with contemporary streetwear.',
        verified: true,
      },
      {
        id: 'rev-402',
        author: 'Vikram Joshi',
        location: 'Ahmedabad, Gujarat',
        rating: 5,
        date: '04 Sept 2026',
        title: 'Worth every single rupee',
        content: 'Fits true to size with that relaxed drop shoulder look. The hood has great structure and doesn’t flop around. 10/10 craftsmanship.',
        verified: true,
      },
    ],
  },
  {
    id: 'prod-5',
    name: 'Equus Running Horse Pattern Overshirt',
    category: 'Clothes & Patterns',
    workGroupId: 'wg-5',
    price: 2799,
    originalPrice: 3499,
    rating: 4.7,
    reviews: 73,
    badge: '-20%',
    badgeType: 'discount',
    isBestSeller: false,
    isNewArrival: true,
    image: bannerFashionModelImg,
    gallery: [bannerFashionModelImg, productClothesHoodieImg, heroReviveDupattaImg, heroCraftBgImg],
    material: 'Handspun Khadi Denim with Indigo Yarn Warp',
    dye: 'Natural Indigo Vat & Terracotta Block Print Accents',
    origin: 'Ambar Charkha Guild, MP',
    description: 'Contemporary relaxed-fit chore jacket featuring hand-stamped prehistoric horse patterns along the back yoke and chest pocket. Tailored with natural horn buttons, triple-stitched felled seams, and functional utility pockets.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    features: [
      'Handspun, handwoven Khadi denim woven on traditional Ambar Charkhas',
      'Dynamic Equus running horse motif from Bhimbetka cave rock panels',
      'Corozo nut button closures with reinforced back plackets',
      'Two oversized chest pockets and interior passport slot',
    ],
    careInstructions: 'Gentle hand wash in cold water with mild indigo-safe detergent. Indigo naturally evolves its patina over time. Line dry in shade.',
    artisanName: 'Ambar Charkha Weavers Guild',
    artisanCluster: 'Maheshwar & Dhar Handloom Belt, MP',
    dimensions: 'Regular Overshirt Fit · 490 grams',
    inStock: true,
    stockCount: 9,
    highlights: [
      { label: 'Weave', value: '100% Handspun Khadi Denim' },
      { label: 'Vat Chemistry', value: 'Fermented Natural Indigo' },
      { label: 'Buttons', value: 'Natural Corozo Nut' },
      { label: 'Process Group', value: 'Work Group 05: Hand-Block Stamping' },
    ],
    customerReviewsList: [
      {
        id: 'rev-501',
        author: 'Varun Sen',
        location: 'Kolkata, West Bengal',
        rating: 5,
        date: '11 Sept 2026',
        title: 'Unique texture you cannot find in mill denim',
        content: 'The slub in the Khadi denim gives it so much life. The horse motifs on the back yoke give it a signature artisanal edge. Very pleased with the fit.',
        verified: true,
      },
    ],
  },
  {
    id: 'prod-6',
    name: 'Unbleached Mulmul Yardage Fabric (3 Yds)',
    category: 'Bhimbetka Motifs',
    workGroupId: 'wg-3',
    price: 899,
    originalPrice: 1199,
    rating: 4.8,
    reviews: 51,
    badge: 'Craft Yardage',
    badgeType: 'new',
    isBestSeller: false,
    isNewArrival: true,
    image: heroBhimbetkaMotifsImg,
    gallery: [heroBhimbetkaMotifsImg, heroReviveDupattaImg, heroCraftBgImg, heroWoodenBlocksImg],
    material: '80s Count Pure Organic Desi Cotton (44" Width)',
    dye: 'Cold Water Scoured, Ready for Natural Dyeing or Tailoring',
    origin: 'Handloom Cluster of Maheshwar',
    description: 'Uncut artisanal yardage suitable for custom shirts, dupattas, or home textile drapes. Pre-shrunk in natural soapnut water with clean selvedges, primed to absorb natural dye tannins with maximum vibrancy.',
    sizes: ['3 Yards Cut', '5 Yards Bolt'],
    features: [
      'Grown organically without synthetic pesticides or chemical fertilizers',
      'Woven on traditional pit looms with balanced warp-weft tension',
      'Scoured in natural reetha soapnut water to remove loom starch',
      'Ideal for botanical printing, cyanotype, or bespoke tailoring',
    ],
    careInstructions: 'Machine washable or hand wash in cold water. Preshrunk during scouring stage.',
    artisanName: 'Maheshwar Pit Loom Guild',
    artisanCluster: 'Maheshwar Riverbanks, MP',
    dimensions: '3 Yards (274 cm) × 112 cm width · 210 grams',
    inStock: true,
    stockCount: 25,
    highlights: [
      { label: 'Cotton Count', value: '80s Count Fine Desi Cotton' },
      { label: 'Loom Type', value: 'Traditional Pit Loom' },
      { label: 'Scouring Method', value: 'Herbal Reetha Cold Wash' },
      { label: 'Process Group', value: 'Work Group 03: Natural Dye Prep' },
    ],
    customerReviewsList: [
      {
        id: 'rev-601',
        author: 'Swati Kulkarni',
        location: 'Vadodara, Gujarat',
        rating: 5,
        date: '25 Aug 2026',
        title: 'Perfect base for my block printing studio',
        content: 'Takes madder and iron pigments without any splotchiness. Clean edges and zero chemical odor. Highly recommended for craft practitioners.',
        verified: true,
      },
    ],
  },
  {
    id: 'prod-7',
    name: 'Revive Ahimsa Tussar Silk Dupatta',
    category: 'Revive Dupatta',
    workGroupId: 'wg-4',
    price: 3999,
    originalPrice: 4899,
    rating: 4.9,
    reviews: 42,
    badge: 'Limited',
    badgeType: 'bestseller',
    isBestSeller: true,
    isNewArrival: false,
    image: heroReviveDupattaImg,
    gallery: [heroReviveDupattaImg, bannerFashionModelImg, heroBhimbetkaMotifsImg, heroCraftBgImg],
    material: 'Handspun Wild Ghicha Tussar Silk with Gold Zari',
    dye: 'Tesu (Flame of the Forest) Marigold Yellow & Iron Black',
    origin: 'Restored Heirloom Piece',
    description: 'Raw textured wild Tussar silk revived through golden floral dye immersion and twin-block Bhimbetka pallu panels. Features hand-twisted silk tassels and rich natural sheen that catches the light gracefully.',
    sizes: ['2.5m Standard Drape'],
    features: [
      'Cruelty-free Ahimsa wild Tussar silk harvested post-cocoon emergence',
      'Natural honey-gold tones elevated with Tesu flower herbal baths',
      'Dual-register Bhimbetka procession stamped on both end pallus',
      'Artisanal hand-braided fringe tassels along borders',
    ],
    careInstructions: 'Dry clean only to maintain raw Ghicha texture and metallic zari luster.',
    artisanName: 'Ahimsa Silk Guild',
    artisanCluster: 'Champa & Raigarh Silk Weavers',
    dimensions: '250 cm × 95 cm · 185 grams',
    inStock: true,
    stockCount: 4,
    highlights: [
      { label: 'Silk Type', value: 'Ahimsa Non-Violent Wild Tussar' },
      { label: 'Herbal Dye', value: 'Tesu (Flame of the Forest) Flowers' },
      { label: 'Pallu Work', value: 'Twin-Register Rock Art Procession' },
      { label: 'Process Group', value: 'Work Group 04: Dupatta Restoration' },
    ],
    customerReviewsList: [
      {
        id: 'rev-701',
        author: 'Shalini Nair',
        location: 'Thiruvananthapuram, Kerala',
        rating: 5,
        date: '01 Sept 2026',
        title: 'Epitome of royal Indian textile luxury',
        content: 'The handspun Ghicha slub has an unbelievable tactile presence. The Tesu flower yellow is luminous without being neon. Truly an heirloom item.',
        verified: true,
      },
    ],
  },
  {
    id: 'prod-8',
    name: 'Single Rekh Motif Block & DIY Dye Studio Kit',
    category: 'Wooden Blocks',
    workGroupId: 'wg-2',
    price: 999,
    originalPrice: 1299,
    rating: 4.9,
    reviews: 112,
    badge: 'Kit',
    badgeType: 'new',
    isBestSeller: false,
    isNewArrival: false,
    image: heroWoodenBlocksImg,
    gallery: [heroWoodenBlocksImg, productClothesHoodieImg, heroCraftBgImg, bannerFashionModelImg],
    material: 'Sagwan Block + 2 Mordanted Cotton Bandanas + Natural Dyes',
    dye: 'Pre-measured Harda, Alizarin & Iron Powders Included',
    origin: 'Artisan DIY Craft Studio',
    description: 'Complete hands-on textile printing kit. Includes one hand-carved Bhimbetka dancer teak block, woolen ink pad, non-toxic natural dye powders, step-by-step guidebook, and two pre-mordanted pure cotton bandana swatches.',
    sizes: ['Dancer Kit', 'Equus Horse Kit'],
    features: [
      'One authentic seasoned Sagwan teak hand-block chiseled by master carvers',
      'Non-toxic plant and earth mineral dye extracts (Harda, Alizarin, Iron)',
      'High-density wool felt pad inside a reusable tin container',
      'Two 50×50cm pre-washed organic cotton bandanas ready for printing',
      'Artisan-illustrated printing guidebook with registration techniques',
    ],
    careInstructions: 'Clean block thoroughly with cold water after printing session. Keep dye powders stored in moisture-free airtight pouches.',
    artisanName: 'Bhopal Heritage Workshop',
    artisanCluster: 'Studio Guild, Madhya Pradesh',
    dimensions: 'Box: 22 × 16 × 7 cm · 580 grams',
    inStock: true,
    stockCount: 15,
    highlights: [
      { label: 'Included Block', value: '1 Hand-Carved Teak Rekh Matrix' },
      { label: 'Substrates', value: '2 Mordanted 100% Cotton Bandanas' },
      { label: 'Dye Powders', value: 'Natural Alizarin, Iron & Harda' },
      { label: 'Process Group', value: 'Work Group 02: Teak Block Carving' },
    ],
    customerReviewsList: [
      {
        id: 'rev-801',
        author: 'Nandita Sen',
        location: 'Chandigarh',
        rating: 5,
        date: '15 Sept 2026',
        title: 'Wonderful family craft weekend project!',
        content: 'Printed our own cotton bandanas with the children. The instruction booklet is clear and informative, and the teak block is so well carved that even my 9-year-old was able to get crisp prints.',
        verified: true,
      },
    ],
  },
];
