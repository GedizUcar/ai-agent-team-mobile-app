import { prisma } from '../config/database';
import { hashPassword } from '../utils/password';

interface CategorySeed {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
}

interface ProductSeed {
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  isFeatured: boolean;
  categorySlug: string;
  images: Array<{ url: string; altText: string; sortOrder: number }>;
  variants: Array<{
    size: string;
    color: string;
    colorHex: string;
    stock: number;
    sku: string;
  }>;
}

const categories: CategorySeed[] = [
  {
    name: 'Kadin',
    slug: 'kadin',
    description: 'Kadin giyim koleksiyonu',
    imageUrl: 'https://picsum.photos/400/400?random=100',
    sortOrder: 1,
  },
  {
    name: 'Erkek',
    slug: 'erkek',
    description: 'Erkek giyim koleksiyonu',
    imageUrl: 'https://picsum.photos/400/400?random=101',
    sortOrder: 2,
  },
  {
    name: 'Aksesuar',
    slug: 'aksesuar',
    description: 'Aksesuar koleksiyonu',
    imageUrl: 'https://picsum.photos/400/400?random=102',
    sortOrder: 3,
  },
  {
    name: 'Ayakkabi',
    slug: 'ayakkabi',
    description: 'Ayakkabi koleksiyonu',
    imageUrl: 'https://picsum.photos/400/400?random=103',
    sortOrder: 4,
  },
  {
    name: 'Canta',
    slug: 'canta',
    description: 'Canta koleksiyonu',
    imageUrl: 'https://picsum.photos/400/400?random=104',
    sortOrder: 5,
  },
  {
    name: 'Spor',
    slug: 'spor',
    description: 'Spor giyim koleksiyonu',
    imageUrl: 'https://picsum.photos/400/400?random=105',
    sortOrder: 6,
  },
];

const products: ProductSeed[] = [
  // -- Kadin (4 products) --
  {
    name: 'Oversize Pamuklu T-Shirt',
    slug: 'oversize-pamuklu-t-shirt',
    description: 'Rahat kesim, %100 pamuklu oversize t-shirt. Gunluk kullanima uygun.',
    price: 299,
    comparePrice: 449,
    isFeatured: true,
    categorySlug: 'kadin',
    images: [
      { url: 'https://picsum.photos/400/600?random=1', altText: 'Oversize Pamuklu T-Shirt - On', sortOrder: 0 },
      { url: 'https://picsum.photos/400/600?random=2', altText: 'Oversize Pamuklu T-Shirt - Arka', sortOrder: 1 },
      { url: 'https://picsum.photos/400/600?random=3', altText: 'Oversize Pamuklu T-Shirt - Detay', sortOrder: 2 },
    ],
    variants: [
      { size: 'S', color: 'Beyaz', colorHex: '#FFFFFF', stock: 15, sku: 'KDN-OPT-S-BYZ' },
      { size: 'M', color: 'Beyaz', colorHex: '#FFFFFF', stock: 20, sku: 'KDN-OPT-M-BYZ' },
      { size: 'L', color: 'Beyaz', colorHex: '#FFFFFF', stock: 10, sku: 'KDN-OPT-L-BYZ' },
      { size: 'S', color: 'Siyah', colorHex: '#000000', stock: 12, sku: 'KDN-OPT-S-SYH' },
      { size: 'M', color: 'Siyah', colorHex: '#000000', stock: 18, sku: 'KDN-OPT-M-SYH' },
      { size: 'L', color: 'Siyah', colorHex: '#000000', stock: 8, sku: 'KDN-OPT-L-SYH' },
    ],
  },
  {
    name: 'Yuksek Bel Mom Jean',
    slug: 'yuksek-bel-mom-jean',
    description: 'Yuksek bel, rahat kesim mom jean. Vintage gorunum.',
    price: 599,
    comparePrice: 799,
    isFeatured: true,
    categorySlug: 'kadin',
    images: [
      { url: 'https://picsum.photos/400/600?random=4', altText: 'Mom Jean - On', sortOrder: 0 },
      { url: 'https://picsum.photos/400/600?random=5', altText: 'Mom Jean - Arka', sortOrder: 1 },
    ],
    variants: [
      { size: 'XS', color: 'Mavi', colorHex: '#2196F3', stock: 8, sku: 'KDN-MJ-XS-MV' },
      { size: 'S', color: 'Mavi', colorHex: '#2196F3', stock: 14, sku: 'KDN-MJ-S-MV' },
      { size: 'M', color: 'Mavi', colorHex: '#2196F3', stock: 20, sku: 'KDN-MJ-M-MV' },
      { size: 'L', color: 'Mavi', colorHex: '#2196F3', stock: 12, sku: 'KDN-MJ-L-MV' },
    ],
  },
  {
    name: 'Saten Gomlek Elbise',
    slug: 'saten-gomlek-elbise',
    description: 'Zarif saten kumastan gomlek yaka elbise. Ozel gunler icin ideal.',
    price: 899,
    isFeatured: false,
    categorySlug: 'kadin',
    images: [
      { url: 'https://picsum.photos/400/600?random=6', altText: 'Saten Elbise - On', sortOrder: 0 },
      { url: 'https://picsum.photos/400/600?random=7', altText: 'Saten Elbise - Arka', sortOrder: 1 },
      { url: 'https://picsum.photos/400/600?random=8', altText: 'Saten Elbise - Detay', sortOrder: 2 },
    ],
    variants: [
      { size: 'S', color: 'Bej', colorHex: '#F5F5DC', stock: 6, sku: 'KDN-SGE-S-BJ' },
      { size: 'M', color: 'Bej', colorHex: '#F5F5DC', stock: 10, sku: 'KDN-SGE-M-BJ' },
      { size: 'L', color: 'Bej', colorHex: '#F5F5DC', stock: 5, sku: 'KDN-SGE-L-BJ' },
      { size: 'S', color: 'Siyah', colorHex: '#000000', stock: 8, sku: 'KDN-SGE-S-SYH' },
      { size: 'M', color: 'Siyah', colorHex: '#000000', stock: 12, sku: 'KDN-SGE-M-SYH' },
    ],
  },
  {
    name: 'Triko Hirka',
    slug: 'triko-hirka',
    description: 'Yumusak dokulu triko hirka. Katmanlama icin mukemmel.',
    price: 449,
    comparePrice: 599,
    isFeatured: false,
    categorySlug: 'kadin',
    images: [
      { url: 'https://picsum.photos/400/600?random=9', altText: 'Triko Hirka - On', sortOrder: 0 },
      { url: 'https://picsum.photos/400/600?random=10', altText: 'Triko Hirka - Detay', sortOrder: 1 },
    ],
    variants: [
      { size: 'S', color: 'Kirmizi', colorHex: '#FF0000', stock: 7, sku: 'KDN-TH-S-KMZ' },
      { size: 'M', color: 'Kirmizi', colorHex: '#FF0000', stock: 11, sku: 'KDN-TH-M-KMZ' },
      { size: 'L', color: 'Kirmizi', colorHex: '#FF0000', stock: 9, sku: 'KDN-TH-L-KMZ' },
    ],
  },

  // -- Erkek (4 products) --
  {
    name: 'Deri Biker Ceket',
    slug: 'deri-biker-ceket',
    description: 'Gercek deri biker ceket. Klasik motorcu tarzinda.',
    price: 2499,
    comparePrice: 2999,
    isFeatured: true,
    categorySlug: 'erkek',
    images: [
      { url: 'https://picsum.photos/400/600?random=11', altText: 'Deri Ceket - On', sortOrder: 0 },
      { url: 'https://picsum.photos/400/600?random=12', altText: 'Deri Ceket - Arka', sortOrder: 1 },
      { url: 'https://picsum.photos/400/600?random=13', altText: 'Deri Ceket - Detay', sortOrder: 2 },
      { url: 'https://picsum.photos/400/600?random=14', altText: 'Deri Ceket - Yan', sortOrder: 3 },
    ],
    variants: [
      { size: 'M', color: 'Siyah', colorHex: '#000000', stock: 5, sku: 'ERK-DBC-M-SYH' },
      { size: 'L', color: 'Siyah', colorHex: '#000000', stock: 8, sku: 'ERK-DBC-L-SYH' },
      { size: 'XL', color: 'Siyah', colorHex: '#000000', stock: 4, sku: 'ERK-DBC-XL-SYH' },
    ],
  },
  {
    name: 'Slim Fit Chino Pantolon',
    slug: 'slim-fit-chino-pantolon',
    description: 'Slim fit kesim chino pantolon. Is ve gunluk kullanima uygun.',
    price: 499,
    isFeatured: false,
    categorySlug: 'erkek',
    images: [
      { url: 'https://picsum.photos/400/600?random=15', altText: 'Chino Pantolon - On', sortOrder: 0 },
      { url: 'https://picsum.photos/400/600?random=16', altText: 'Chino Pantolon - Detay', sortOrder: 1 },
    ],
    variants: [
      { size: 'S', color: 'Bej', colorHex: '#F5F5DC', stock: 10, sku: 'ERK-SFC-S-BJ' },
      { size: 'M', color: 'Bej', colorHex: '#F5F5DC', stock: 15, sku: 'ERK-SFC-M-BJ' },
      { size: 'L', color: 'Bej', colorHex: '#F5F5DC', stock: 12, sku: 'ERK-SFC-L-BJ' },
      { size: 'S', color: 'Gri', colorHex: '#808080', stock: 8, sku: 'ERK-SFC-S-GR' },
      { size: 'M', color: 'Gri', colorHex: '#808080', stock: 14, sku: 'ERK-SFC-M-GR' },
      { size: 'L', color: 'Gri', colorHex: '#808080', stock: 10, sku: 'ERK-SFC-L-GR' },
    ],
  },
  {
    name: 'Oxford Gomlek',
    slug: 'oxford-gomlek',
    description: 'Klasik oxford kumastan slim fit gomlek. Premium kalite.',
    price: 399,
    comparePrice: 549,
    isFeatured: true,
    categorySlug: 'erkek',
    images: [
      { url: 'https://picsum.photos/400/600?random=17', altText: 'Oxford Gomlek - On', sortOrder: 0 },
      { url: 'https://picsum.photos/400/600?random=18', altText: 'Oxford Gomlek - Detay', sortOrder: 1 },
      { url: 'https://picsum.photos/400/600?random=19', altText: 'Oxford Gomlek - Yaka', sortOrder: 2 },
    ],
    variants: [
      { size: 'S', color: 'Beyaz', colorHex: '#FFFFFF', stock: 20, sku: 'ERK-OG-S-BYZ' },
      { size: 'M', color: 'Beyaz', colorHex: '#FFFFFF', stock: 25, sku: 'ERK-OG-M-BYZ' },
      { size: 'L', color: 'Beyaz', colorHex: '#FFFFFF', stock: 15, sku: 'ERK-OG-L-BYZ' },
      { size: 'XL', color: 'Beyaz', colorHex: '#FFFFFF', stock: 10, sku: 'ERK-OG-XL-BYZ' },
      { size: 'S', color: 'Mavi', colorHex: '#2196F3', stock: 18, sku: 'ERK-OG-S-MV' },
      { size: 'M', color: 'Mavi', colorHex: '#2196F3', stock: 22, sku: 'ERK-OG-M-MV' },
    ],
  },
  {
    name: 'Kapusonlu Sweatshirt',
    slug: 'kapusonlu-sweatshirt',
    description: 'Ic yuzey fleece kapusonlu sweatshirt. Soguk havalarda sicak tutar.',
    price: 349,
    isFeatured: false,
    categorySlug: 'erkek',
    images: [
      { url: 'https://picsum.photos/400/600?random=20', altText: 'Kapusonlu Sweatshirt - On', sortOrder: 0 },
      { url: 'https://picsum.photos/400/600?random=21', altText: 'Kapusonlu Sweatshirt - Arka', sortOrder: 1 },
    ],
    variants: [
      { size: 'M', color: 'Gri', colorHex: '#808080', stock: 16, sku: 'ERK-KS-M-GR' },
      { size: 'L', color: 'Gri', colorHex: '#808080', stock: 12, sku: 'ERK-KS-L-GR' },
      { size: 'XL', color: 'Gri', colorHex: '#808080', stock: 8, sku: 'ERK-KS-XL-GR' },
      { size: 'M', color: 'Siyah', colorHex: '#000000', stock: 14, sku: 'ERK-KS-M-SYH' },
      { size: 'L', color: 'Siyah', colorHex: '#000000', stock: 10, sku: 'ERK-KS-L-SYH' },
    ],
  },

  // -- Aksesuar (4 products) --
  {
    name: 'Minimal Gold Kolye',
    slug: 'minimal-gold-kolye',
    description: 'Ince zincirli minimal gold kolye. Her kombinle uyumlu.',
    price: 199,
    comparePrice: 299,
    isFeatured: true,
    categorySlug: 'aksesuar',
    images: [
      { url: 'https://picsum.photos/400/600?random=22', altText: 'Gold Kolye - On', sortOrder: 0 },
      { url: 'https://picsum.photos/400/600?random=23', altText: 'Gold Kolye - Detay', sortOrder: 1 },
    ],
    variants: [
      { size: 'Standart', color: 'Gold', colorHex: '#FFD700', stock: 30, sku: 'AKS-MGK-STD-GLD' },
      { size: 'Standart', color: 'Gumus', colorHex: '#C0C0C0', stock: 25, sku: 'AKS-MGK-STD-GMS' },
    ],
  },
  {
    name: 'Deri Kemer',
    slug: 'deri-kemer',
    description: 'Gercek deri el yapimi kemer. Paslanmaz celik toka.',
    price: 249,
    isFeatured: false,
    categorySlug: 'aksesuar',
    images: [
      { url: 'https://picsum.photos/400/600?random=24', altText: 'Deri Kemer - On', sortOrder: 0 },
      { url: 'https://picsum.photos/400/600?random=25', altText: 'Deri Kemer - Detay', sortOrder: 1 },
      { url: 'https://picsum.photos/400/600?random=26', altText: 'Deri Kemer - Toka', sortOrder: 2 },
    ],
    variants: [
      { size: 'S', color: 'Siyah', colorHex: '#000000', stock: 12, sku: 'AKS-DK-S-SYH' },
      { size: 'M', color: 'Siyah', colorHex: '#000000', stock: 18, sku: 'AKS-DK-M-SYH' },
      { size: 'L', color: 'Siyah', colorHex: '#000000', stock: 10, sku: 'AKS-DK-L-SYH' },
    ],
  },
  {
    name: 'Gunes Gozlugu',
    slug: 'gunes-gozlugu',
    description: 'UV korumali polarize gunes gozlugu. Metal cerceve.',
    price: 349,
    comparePrice: 499,
    isFeatured: false,
    categorySlug: 'aksesuar',
    images: [
      { url: 'https://picsum.photos/400/600?random=27', altText: 'Gunes Gozlugu - On', sortOrder: 0 },
      { url: 'https://picsum.photos/400/600?random=28', altText: 'Gunes Gozlugu - Yan', sortOrder: 1 },
    ],
    variants: [
      { size: 'Standart', color: 'Siyah', colorHex: '#000000', stock: 20, sku: 'AKS-GG-STD-SYH' },
      { size: 'Standart', color: 'Gold', colorHex: '#FFD700', stock: 15, sku: 'AKS-GG-STD-GLD' },
    ],
  },
  {
    name: 'Yun Atki',
    slug: 'yun-atki',
    description: 'Yumusak yun karisim atki. Kis mevsimi icin vazgecilmez.',
    price: 179,
    isFeatured: false,
    categorySlug: 'aksesuar',
    images: [
      { url: 'https://picsum.photos/400/600?random=29', altText: 'Yun Atki - On', sortOrder: 0 },
      { url: 'https://picsum.photos/400/600?random=30', altText: 'Yun Atki - Detay', sortOrder: 1 },
    ],
    variants: [
      { size: 'Standart', color: 'Kirmizi', colorHex: '#FF0000', stock: 15, sku: 'AKS-YA-STD-KMZ' },
      { size: 'Standart', color: 'Gri', colorHex: '#808080', stock: 20, sku: 'AKS-YA-STD-GR' },
      { size: 'Standart', color: 'Bej', colorHex: '#F5F5DC', stock: 12, sku: 'AKS-YA-STD-BJ' },
    ],
  },

  // -- Ayakkabi (4 products) --
  {
    name: 'Beyaz Deri Sneaker',
    slug: 'beyaz-deri-sneaker',
    description: 'Minimal tasarimli beyaz deri sneaker. Gunluk kullanima uygun.',
    price: 799,
    comparePrice: 999,
    isFeatured: true,
    categorySlug: 'ayakkabi',
    images: [
      { url: 'https://picsum.photos/400/600?random=31', altText: 'Beyaz Sneaker - On', sortOrder: 0 },
      { url: 'https://picsum.photos/400/600?random=32', altText: 'Beyaz Sneaker - Yan', sortOrder: 1 },
      { url: 'https://picsum.photos/400/600?random=33', altText: 'Beyaz Sneaker - Taban', sortOrder: 2 },
    ],
    variants: [
      { size: '38', color: 'Beyaz', colorHex: '#FFFFFF', stock: 6, sku: 'AYK-BDS-38-BYZ' },
      { size: '39', color: 'Beyaz', colorHex: '#FFFFFF', stock: 8, sku: 'AYK-BDS-39-BYZ' },
      { size: '40', color: 'Beyaz', colorHex: '#FFFFFF', stock: 12, sku: 'AYK-BDS-40-BYZ' },
      { size: '41', color: 'Beyaz', colorHex: '#FFFFFF', stock: 14, sku: 'AYK-BDS-41-BYZ' },
      { size: '42', color: 'Beyaz', colorHex: '#FFFFFF', stock: 10, sku: 'AYK-BDS-42-BYZ' },
      { size: '43', color: 'Beyaz', colorHex: '#FFFFFF', stock: 7, sku: 'AYK-BDS-43-BYZ' },
    ],
  },
  {
    name: 'Suet Topuklu Bot',
    slug: 'suet-topuklu-bot',
    description: 'Suet kaplama topuklu bot. Sonbahar-kis sezonu icin.',
    price: 1199,
    isFeatured: false,
    categorySlug: 'ayakkabi',
    images: [
      { url: 'https://picsum.photos/400/600?random=34', altText: 'Topuklu Bot - On', sortOrder: 0 },
      { url: 'https://picsum.photos/400/600?random=35', altText: 'Topuklu Bot - Yan', sortOrder: 1 },
    ],
    variants: [
      { size: '36', color: 'Siyah', colorHex: '#000000', stock: 5, sku: 'AYK-STB-36-SYH' },
      { size: '37', color: 'Siyah', colorHex: '#000000', stock: 8, sku: 'AYK-STB-37-SYH' },
      { size: '38', color: 'Siyah', colorHex: '#000000', stock: 10, sku: 'AYK-STB-38-SYH' },
      { size: '39', color: 'Siyah', colorHex: '#000000', stock: 6, sku: 'AYK-STB-39-SYH' },
    ],
  },
  {
    name: 'Klasik Oxford Ayakkabi',
    slug: 'klasik-oxford-ayakkabi',
    description: 'El yapimi klasik oxford ayakkabi. Premium deri.',
    price: 1499,
    comparePrice: 1899,
    isFeatured: true,
    categorySlug: 'ayakkabi',
    images: [
      { url: 'https://picsum.photos/400/600?random=36', altText: 'Oxford Ayakkabi - On', sortOrder: 0 },
      { url: 'https://picsum.photos/400/600?random=37', altText: 'Oxford Ayakkabi - Yan', sortOrder: 1 },
      { url: 'https://picsum.photos/400/600?random=38', altText: 'Oxford Ayakkabi - Detay', sortOrder: 2 },
    ],
    variants: [
      { size: '40', color: 'Siyah', colorHex: '#000000', stock: 6, sku: 'AYK-KOA-40-SYH' },
      { size: '41', color: 'Siyah', colorHex: '#000000', stock: 8, sku: 'AYK-KOA-41-SYH' },
      { size: '42', color: 'Siyah', colorHex: '#000000', stock: 10, sku: 'AYK-KOA-42-SYH' },
      { size: '43', color: 'Siyah', colorHex: '#000000', stock: 5, sku: 'AYK-KOA-43-SYH' },
    ],
  },
  {
    name: 'Spor Sandalet',
    slug: 'spor-sandalet',
    description: 'Hafif ve rahat spor sandalet. Yaz mevsimi icin ideal.',
    price: 399,
    isFeatured: false,
    categorySlug: 'ayakkabi',
    images: [
      { url: 'https://picsum.photos/400/600?random=39', altText: 'Spor Sandalet - On', sortOrder: 0 },
      { url: 'https://picsum.photos/400/600?random=40', altText: 'Spor Sandalet - Yan', sortOrder: 1 },
    ],
    variants: [
      { size: '38', color: 'Siyah', colorHex: '#000000', stock: 10, sku: 'AYK-SS-38-SYH' },
      { size: '39', color: 'Siyah', colorHex: '#000000', stock: 12, sku: 'AYK-SS-39-SYH' },
      { size: '40', color: 'Siyah', colorHex: '#000000', stock: 8, sku: 'AYK-SS-40-SYH' },
      { size: '41', color: 'Siyah', colorHex: '#000000', stock: 6, sku: 'AYK-SS-41-SYH' },
    ],
  },

  // -- Canta (4 products) --
  {
    name: 'Deri Tote Canta',
    slug: 'deri-tote-canta',
    description: 'Genis hacimli deri tote canta. Is ve gunluk kullanim.',
    price: 1299,
    comparePrice: 1599,
    isFeatured: true,
    categorySlug: 'canta',
    images: [
      { url: 'https://picsum.photos/400/600?random=41', altText: 'Tote Canta - On', sortOrder: 0 },
      { url: 'https://picsum.photos/400/600?random=42', altText: 'Tote Canta - Ic', sortOrder: 1 },
      { url: 'https://picsum.photos/400/600?random=43', altText: 'Tote Canta - Yan', sortOrder: 2 },
    ],
    variants: [
      { size: 'Standart', color: 'Siyah', colorHex: '#000000', stock: 10, sku: 'CNT-DTC-STD-SYH' },
      { size: 'Standart', color: 'Bej', colorHex: '#F5F5DC', stock: 8, sku: 'CNT-DTC-STD-BJ' },
    ],
  },
  {
    name: 'Mini Crossbody Canta',
    slug: 'mini-crossbody-canta',
    description: 'Kompakt mini crossbody canta. Ayarlanabilir askili.',
    price: 599,
    isFeatured: false,
    categorySlug: 'canta',
    images: [
      { url: 'https://picsum.photos/400/600?random=44', altText: 'Crossbody Canta - On', sortOrder: 0 },
      { url: 'https://picsum.photos/400/600?random=45', altText: 'Crossbody Canta - Yan', sortOrder: 1 },
    ],
    variants: [
      { size: 'Standart', color: 'Kirmizi', colorHex: '#FF0000', stock: 12, sku: 'CNT-MCC-STD-KMZ' },
      { size: 'Standart', color: 'Siyah', colorHex: '#000000', stock: 15, sku: 'CNT-MCC-STD-SYH' },
      { size: 'Standart', color: 'Yesil', colorHex: '#4CAF50', stock: 7, sku: 'CNT-MCC-STD-YSL' },
    ],
  },
  {
    name: 'Kanvas Sirt Cantasi',
    slug: 'kanvas-sirt-cantasi',
    description: 'Dayanikli kanvas sirt cantasi. Laptop bolmeli.',
    price: 449,
    comparePrice: 599,
    isFeatured: false,
    categorySlug: 'canta',
    images: [
      { url: 'https://picsum.photos/400/600?random=46', altText: 'Sirt Cantasi - On', sortOrder: 0 },
      { url: 'https://picsum.photos/400/600?random=47', altText: 'Sirt Cantasi - Arka', sortOrder: 1 },
      { url: 'https://picsum.photos/400/600?random=48', altText: 'Sirt Cantasi - Ic', sortOrder: 2 },
    ],
    variants: [
      { size: 'Standart', color: 'Gri', colorHex: '#808080', stock: 18, sku: 'CNT-KSC-STD-GR' },
      { size: 'Standart', color: 'Mavi', colorHex: '#2196F3', stock: 14, sku: 'CNT-KSC-STD-MV' },
    ],
  },
  {
    name: 'Hasir Plaj Cantasi',
    slug: 'hasir-plaj-cantasi',
    description: 'El orgusu hasir plaj cantasi. Yaz koleksiyonu.',
    price: 349,
    isFeatured: false,
    categorySlug: 'canta',
    images: [
      { url: 'https://picsum.photos/400/600?random=49', altText: 'Plaj Cantasi - On', sortOrder: 0 },
      { url: 'https://picsum.photos/400/600?random=50', altText: 'Plaj Cantasi - Detay', sortOrder: 1 },
    ],
    variants: [
      { size: 'Standart', color: 'Bej', colorHex: '#F5F5DC', stock: 20, sku: 'CNT-HPC-STD-BJ' },
    ],
  },

  // -- Spor (4 products) --
  {
    name: 'Performans Kosu Ayakkabisi',
    slug: 'performans-kosu-ayakkabisi',
    description: 'Hafif ve esnek kosu ayakkabisi. Nefes alan kumasla.',
    price: 999,
    comparePrice: 1299,
    isFeatured: true,
    categorySlug: 'spor',
    images: [
      { url: 'https://picsum.photos/400/600?random=51', altText: 'Kosu Ayakkabisi - On', sortOrder: 0 },
      { url: 'https://picsum.photos/400/600?random=52', altText: 'Kosu Ayakkabisi - Yan', sortOrder: 1 },
      { url: 'https://picsum.photos/400/600?random=53', altText: 'Kosu Ayakkabisi - Taban', sortOrder: 2 },
    ],
    variants: [
      { size: '39', color: 'Siyah', colorHex: '#000000', stock: 10, sku: 'SPR-PKA-39-SYH' },
      { size: '40', color: 'Siyah', colorHex: '#000000', stock: 14, sku: 'SPR-PKA-40-SYH' },
      { size: '41', color: 'Siyah', colorHex: '#000000', stock: 12, sku: 'SPR-PKA-41-SYH' },
      { size: '42', color: 'Siyah', colorHex: '#000000', stock: 8, sku: 'SPR-PKA-42-SYH' },
      { size: '40', color: 'Mavi', colorHex: '#2196F3', stock: 10, sku: 'SPR-PKA-40-MV' },
      { size: '41', color: 'Mavi', colorHex: '#2196F3', stock: 8, sku: 'SPR-PKA-41-MV' },
    ],
  },
  {
    name: 'Yoga Taytı',
    slug: 'yoga-tayti',
    description: 'Yuksek bel, esnek yoga tayti. 4 yone esner.',
    price: 399,
    isFeatured: false,
    categorySlug: 'spor',
    images: [
      { url: 'https://picsum.photos/400/600?random=54', altText: 'Yoga Tayti - On', sortOrder: 0 },
      { url: 'https://picsum.photos/400/600?random=55', altText: 'Yoga Tayti - Arka', sortOrder: 1 },
    ],
    variants: [
      { size: 'XS', color: 'Siyah', colorHex: '#000000', stock: 12, sku: 'SPR-YT-XS-SYH' },
      { size: 'S', color: 'Siyah', colorHex: '#000000', stock: 18, sku: 'SPR-YT-S-SYH' },
      { size: 'M', color: 'Siyah', colorHex: '#000000', stock: 20, sku: 'SPR-YT-M-SYH' },
      { size: 'L', color: 'Siyah', colorHex: '#000000', stock: 14, sku: 'SPR-YT-L-SYH' },
    ],
  },
  {
    name: 'Spor Esofman Takimi',
    slug: 'spor-esofman-takimi',
    description: 'Ust ve alt takim spor esofman. Antrenman ve gunluk kullanim.',
    price: 699,
    comparePrice: 899,
    isFeatured: true,
    categorySlug: 'spor',
    images: [
      { url: 'https://picsum.photos/400/600?random=56', altText: 'Esofman Takimi - On', sortOrder: 0 },
      { url: 'https://picsum.photos/400/600?random=57', altText: 'Esofman Takimi - Arka', sortOrder: 1 },
      { url: 'https://picsum.photos/400/600?random=58', altText: 'Esofman Takimi - Detay', sortOrder: 2 },
    ],
    variants: [
      { size: 'S', color: 'Gri', colorHex: '#808080', stock: 10, sku: 'SPR-SET-S-GR' },
      { size: 'M', color: 'Gri', colorHex: '#808080', stock: 15, sku: 'SPR-SET-M-GR' },
      { size: 'L', color: 'Gri', colorHex: '#808080', stock: 12, sku: 'SPR-SET-L-GR' },
      { size: 'XL', color: 'Gri', colorHex: '#808080', stock: 8, sku: 'SPR-SET-XL-GR' },
    ],
  },
  {
    name: 'Dry-Fit Spor Tisort',
    slug: 'dry-fit-spor-tisort',
    description: 'Nem emici dry-fit teknolojili spor tisort. Hafif ve rahat.',
    price: 199,
    isFeatured: false,
    categorySlug: 'spor',
    images: [
      { url: 'https://picsum.photos/400/600?random=59', altText: 'Spor Tisort - On', sortOrder: 0 },
      { url: 'https://picsum.photos/400/600?random=60', altText: 'Spor Tisort - Arka', sortOrder: 1 },
    ],
    variants: [
      { size: 'S', color: 'Beyaz', colorHex: '#FFFFFF', stock: 20, sku: 'SPR-DFT-S-BYZ' },
      { size: 'M', color: 'Beyaz', colorHex: '#FFFFFF', stock: 25, sku: 'SPR-DFT-M-BYZ' },
      { size: 'L', color: 'Beyaz', colorHex: '#FFFFFF', stock: 18, sku: 'SPR-DFT-L-BYZ' },
      { size: 'S', color: 'Siyah', colorHex: '#000000', stock: 22, sku: 'SPR-DFT-S-SYH' },
      { size: 'M', color: 'Siyah', colorHex: '#000000', stock: 28, sku: 'SPR-DFT-M-SYH' },
      { size: 'L', color: 'Siyah', colorHex: '#000000', stock: 16, sku: 'SPR-DFT-L-SYH' },
    ],
  },
];

async function seed() {
  console.log('Starting seed...');

  // Clear existing data (order matters: dependents first)
  console.log('Clearing existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.address.deleteMany();
  await prisma.session.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  console.log('Existing data cleared.');

  // Create test users
  console.log('Creating test users...');
  const testPassword = await hashPassword('Test1234!');

  const testUser = await prisma.user.create({
    data: {
      email: 'test@stilora.com',
      passwordHash: testPassword,
      firstName: 'Test',
      lastName: 'Kullanici',
      phone: '+905551234567',
      role: 'USER',
      isActive: true,
      emailVerified: true,
    },
  });
  console.log(`  User: ${testUser.email} (${testUser.id})`);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@stilora.com',
      passwordHash: testPassword,
      firstName: 'Admin',
      lastName: 'Stilora',
      phone: '+905559876543',
      role: 'ADMIN',
      isActive: true,
      emailVerified: true,
    },
  });
  console.log(`  Admin: ${adminUser.email} (${adminUser.id})`);

  // Create address for test user
  await prisma.address.create({
    data: {
      userId: testUser.id,
      fullName: 'Test Kullanici',
      phone: '+905551234567',
      address: 'Ataturk Cad. No:123 D:4',
      city: 'Istanbul',
      postalCode: '34000',
      country: 'TR',
      isDefault: true,
    },
  });
  console.log('  Address created for test user');

  // Insert categories
  console.log('Inserting categories...');
  const categoryMap = new Map<string, string>();

  for (const cat of categories) {
    const created = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        imageUrl: cat.imageUrl,
        sortOrder: cat.sortOrder,
      },
    });
    categoryMap.set(cat.slug, created.id);
    console.log(`  Category: ${cat.name} (${created.id})`);
  }

  // Insert products with images and variants
  console.log('Inserting products...');
  for (const prod of products) {
    const categoryId = categoryMap.get(prod.categorySlug);
    if (!categoryId) {
      console.error(`  Category not found for slug: ${prod.categorySlug}`);
      continue;
    }

    const created = await prisma.product.create({
      data: {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        price: prod.price,
        comparePrice: prod.comparePrice ?? null,
        categoryId,
        isFeatured: prod.isFeatured,
        images: {
          create: prod.images.map((img) => ({
            url: img.url,
            altText: img.altText,
            sortOrder: img.sortOrder,
          })),
        },
        variants: {
          create: prod.variants.map((v) => ({
            size: v.size,
            color: v.color,
            colorHex: v.colorHex,
            stock: v.stock,
            sku: v.sku,
          })),
        },
      },
    });

    console.log(`  Product: ${prod.name} (${created.id}) - ${prod.images.length} images, ${prod.variants.length} variants`);
  }

  console.log(`\nSeed complete! Created ${categories.length} categories and ${products.length} products.`);
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
