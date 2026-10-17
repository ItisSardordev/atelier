export type ProductCategory =
  | 'OUTERWEAR'
  | 'KNITWEAR'
  | 'TROUSERS'
  | 'ACCESSORIES';

export interface ProductImage {
  full: string;
  front: string;
  back: string;
  detail: string;
  material: string;
  editorial: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  isNew?: boolean;
  description: string;
  material: string;
  origin: string;
  fit: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  images: ProductImage;
}

const img = {
  full: 'https://images.pexels.com/photos/7760238/pexels-photo-7760238.jpeg?auto=compress&cs=tinysrgb&w=1400',
  front: 'https://images.pexels.com/photos/4456728/pexels-photo-4456728.jpeg?auto=compress&cs=tinysrgb&w=1400',
  back: 'https://images.pexels.com/photos/36180263/pexels-photo-36180263.jpeg?auto=compress&cs=tinysrgb&w=1400',
  detail: 'https://images.pexels.com/photos/18601963/pexels-photo-18601963.jpeg?auto=compress&cs=tinysrgb&w=1400',
  material: 'https://images.pexels.com/photos/36013149/pexels-photo-36013149.png?auto=compress&cs=tinysrgb&w=1400',
  editorial: 'https://images.pexels.com/photos/9142805/pexels-photo-9142805.jpeg?auto=compress&cs=tinysrgb&w=1400',
};

export const products: Product[] = [
  {
    id: 'archive-coat',
    name: 'The Archive Coat',
    price: 890,
    category: 'OUTERWEAR',
    isNew: true,
    description:
      'Cut from dense wool and finished by hand in our Paris atelier. A long, considered silhouette that settles into its wearer over time.',
    material: '100% dense virgin wool, viscose lining',
    origin: 'Atelier Paris — limited run of 40',
    fit: 'Relaxed, true to size. Falls below the knee.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Ivory', hex: '#F6F3EE' },
      { name: 'Charcoal', hex: '#2A2825' },
      { name: 'Seasonal Camel', hex: '#8A6B5A' },
    ],
    images: {
      full: 'https://images.pexels.com/photos/8070398/pexels-photo-8070398.jpeg?auto=compress&cs=tinysrgb&w=1400',
      front: 'https://images.pexels.com/photos/4456728/pexels-photo-4456728.jpeg?auto=compress&cs=tinysrgb&w=1400',
      back: 'https://images.pexels.com/photos/36180263/pexels-photo-36180263.jpeg?auto=compress&cs=tinysrgb&w=1400',
      detail: 'https://images.pexels.com/photos/18601963/pexels-photo-18601963.jpeg?auto=compress&cs=tinysrgb&w=1400',
      material: 'https://images.pexels.com/photos/36013149/pexels-photo-36013149.png?auto=compress&cs=tinysrgb&w=1400',
      editorial: 'https://images.pexels.com/photos/9142805/pexels-photo-9142805.jpeg?auto=compress&cs=tinysrgb&w=1400',
    },
  },
  {
    id: 'signature-knit',
    name: 'Signature Knit',
    price: 420,
    category: 'KNITWEAR',
    isNew: true,
    description:
      'A heavy-gauge merino knit, hand-linked and washed softly. Built for everyday ritual.',
    material: '100% extra-fine merino wool',
    origin: 'Atelier Porto — hand-linked',
    fit: 'Regular, relaxed shoulder.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Ivory', hex: '#F6F3EE' },
      { name: 'Stone', hex: '#8A8278' },
    ],
    images: {
      full: 'https://images.pexels.com/photos/12056642/pexels-photo-12056642.jpeg?auto=compress&cs=tinysrgb&w=1400',
      front: 'https://images.pexels.com/photos/6996083/pexels-photo-6996083.jpeg?auto=compress&cs=tinysrgb&w=1400',
      back: 'https://images.pexels.com/photos/8453648/pexels-photo-8453648.jpeg?auto=compress&cs=tinysrgb&w=1400',
      detail: 'https://images.pexels.com/photos/6995898/pexels-photo-6995898.jpeg?auto=compress&cs=tinysrgb&w=1400',
      material: 'https://images.pexels.com/photos/10221760/pexels-photo-10221760.jpeg?auto=compress&cs=tinysrgb&w=1400',
      editorial: 'https://images.pexels.com/photos/16238583/pexels-photo-16238583.jpeg?auto=compress&cs=tinysrgb&w=1400',
    },
  },
  {
    id: 'pleated-trouser',
    name: 'Pleated Trouser',
    price: 340,
    category: 'TROUSERS',
    description:
      'High-waisted, wide-leg, cut from a dry-handled wool blend. Tailored for movement.',
    material: '55% wool, 45% viscose',
    origin: 'Atelier Porto',
    fit: 'High-rise, wide leg.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Beige', hex: '#E8E1D6' },
      { name: 'Charcoal', hex: '#2A2825' },
    ],
    images: {
      full: 'https://images.pexels.com/photos/31400265/pexels-photo-31400265.jpeg?auto=compress&cs=tinysrgb&w=1400',
      front: 'https://images.pexels.com/photos/7945664/pexels-photo-7945664.jpeg?auto=compress&cs=tinysrgb&w=1400',
      back: 'https://images.pexels.com/photos/7945663/pexels-photo-7945663.jpeg?auto=compress&cs=tinysrgb&w=1400',
      detail: 'https://images.pexels.com/photos/7945666/pexels-photo-7945666.jpeg?auto=compress&cs=tinysrgb&w=1400',
      material: 'https://images.pexels.com/photos/36013144/pexels-photo-36013144.png?auto=compress&cs=tinysrgb&w=1400',
      editorial: 'https://images.pexels.com/photos/18532851/pexels-photo-18532851.jpeg?auto=compress&cs=tinysrgb&w=1400',
    },
  },
  {
    id: 'oversized-blazer',
    name: 'Oversized Blazer',
    price: 560,
    category: 'OUTERWEAR',
    description:
      'A deconstructed blazer with soft shoulders and an unstructured drape. Designed to be lived in.',
    material: '70% wool, 30% mohair',
    origin: 'Atelier Paris',
    fit: 'Oversized, unstructured.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Charcoal', hex: '#2A2825' },
      { name: 'Ivory', hex: '#F6F3EE' },
    ],
    images: {
      full: 'https://images.pexels.com/photos/38898771/pexels-photo-38898771.jpeg?auto=compress&cs=tinysrgb&w=1400',
      front: 'https://images.pexels.com/photos/34148968/pexels-photo-34148968.jpeg?auto=compress&cs=tinysrgb&w=1400',
      back: 'https://images.pexels.com/photos/6702630/pexels-photo-6702630.jpeg?auto=compress&cs=tinysrgb&w=1400',
      detail: 'https://images.pexels.com/photos/9898824/pexels-photo-9898824.jpeg?auto=compress&cs=tinysrgb&w=1400',
      material: 'https://images.pexels.com/photos/36013149/pexels-photo-36013149.png?auto=compress&cs=tinysrgb&w=1400',
      editorial: 'https://images.pexels.com/photos/15761494/pexels-photo-15761494.jpeg?auto=compress&cs=tinysrgb&w=1400',
    },
  },
  {
    id: 'cashmere-scarf',
    name: 'Cashmere Scarf',
    price: 180,
    category: 'ACCESSORIES',
    isNew: true,
    description:
      'Featherweight cashmere, hand-finished edges. The weight of nearly nothing.',
    material: '100% Mongolian cashmere',
    origin: 'Atelier Florence',
    fit: '200 × 70 cm',
    sizes: ['ONE SIZE'],
    colors: [
      { name: 'Ivory', hex: '#F6F3EE' },
      { name: 'Seasonal Camel', hex: '#8A6B5A' },
      { name: 'Charcoal', hex: '#2A2825' },
    ],
    images: {
      full: 'https://images.pexels.com/photos/9898824/pexels-photo-9898824.jpeg?auto=compress&cs=tinysrgb&w=1400',
      front: 'https://images.pexels.com/photos/7760651/pexels-photo-7760651.jpeg?auto=compress&cs=tinysrgb&w=1400',
      back: 'https://images.pexels.com/photos/36180266/pexels-photo-36180266.jpeg?auto=compress&cs=tinysrgb&w=1400',
      detail: 'https://images.pexels.com/photos/6045258/pexels-photo-6045258.jpeg?auto=compress&cs=tinysrgb&w=1400',
      material: 'https://images.pexels.com/photos/10221760/pexels-photo-10221760.jpeg?auto=compress&cs=tinysrgb&w=1400',
      editorial: 'https://images.pexels.com/photos/9558939/pexels-photo-9558939.jpeg?auto=compress&cs=tinysrgb&w=1400',
    },
  },
  {
    id: 'leather-tote',
    name: 'Structured Leather Tote',
    price: 640,
    category: 'ACCESSORIES',
    description:
      'Vegetable-tanned leather, hand-stitched. Softens and deepens with use.',
    material: 'Vegetable-tanned Italian leather',
    origin: 'Atelier Florence',
    fit: '40 × 32 × 12 cm',
    sizes: ['ONE SIZE'],
    colors: [
      { name: 'Natural', hex: '#8A6B5A' },
      { name: 'Black', hex: '#17150F' },
    ],
    images: {
      full: 'https://images.pexels.com/photos/8502484/pexels-photo-8502484.jpeg?auto=compress&cs=tinysrgb&w=1400',
      front: 'https://images.pexels.com/photos/6617903/pexels-photo-6617903.jpeg?auto=compress&cs=tinysrgb&w=1400',
      back: 'https://images.pexels.com/photos/22434771/pexels-photo-22434771.jpeg?auto=compress&cs=tinysrgb&w=1400',
      detail: 'https://images.pexels.com/photos/20380733/pexels-photo-20380733.jpeg?auto=compress&cs=tinysrgb&w=1400',
      material: 'https://images.pexels.com/photos/35150404/pexels-photo-35150404.jpeg?auto=compress&cs=tinysrgb&w=1400',
      editorial: 'https://images.pexels.com/photos/15795858/pexels-photo-15795858.jpeg?auto=compress&cs=tinysrgb&w=1400',
    },
  },
  {
    id: 'linen-shirt',
    name: 'Atelier Linen Shirt',
    price: 290,
    category: 'OUTERWEAR',
    description:
      'Washed European linen, oversized. Breathes; creases; remembers.',
    material: '100% washed European linen',
    origin: 'Atelier Porto',
    fit: 'Oversized, boxy.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Ivory', hex: '#F6F3EE' },
      { name: 'Beige', hex: '#E8E1D6' },
    ],
    images: {
      full: 'https://images.pexels.com/photos/22441297/pexels-photo-22441297.jpeg?auto=compress&cs=tinysrgb&w=1400',
      front: 'https://images.pexels.com/photos/22441291/pexels-photo-22441291.jpeg?auto=compress&cs=tinysrgb&w=1400',
      back: 'https://images.pexels.com/photos/17293343/pexels-photo-17293343.jpeg?auto=compress&cs=tinysrgb&w=1400',
      detail: 'https://images.pexels.com/photos/17315934/pexels-photo-17315934.jpeg?auto=compress&cs=tinysrgb&w=1400',
      material: 'https://images.pexels.com/photos/36013144/pexels-photo-36013144.png?auto=compress&cs=tinysrgb&w=1400',
      editorial: 'https://images.pexels.com/photos/7705920/pexels-photo-7705920.jpeg?auto=compress&cs=tinysrgb&w=1400',
    },
  },
  {
    id: 'wool-cardigan',
    name: 'Hand-Knit Cardigan',
    price: 480,
    category: 'KNITWEAR',
    description:
      'An open cardigan in undyed wool, hand-knit on traditional machines. A garment that ages well.',
    material: 'Undyed pure new wool',
    origin: 'Atelier Porto — hand-finished',
    fit: 'Relaxed, layering.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Natural', hex: '#D8CFC0' },
      { name: 'Stone', hex: '#8A8278' },
    ],
    images: {
      full: 'https://images.pexels.com/photos/9603626/pexels-photo-9603626.jpeg?auto=compress&cs=tinysrgb&w=1400',
      front: 'https://images.pexels.com/photos/6995900/pexels-photo-6995900.jpeg?auto=compress&cs=tinysrgb&w=1400',
      back: 'https://images.pexels.com/photos/14642651/pexels-photo-14642651.jpeg?auto=compress&cs=tinysrgb&w=1400',
      detail: 'https://images.pexels.com/photos/6995898/pexels-photo-6995898.jpeg?auto=compress&cs=tinysrgb&w=1400',
      material: 'https://images.pexels.com/photos/10221760/pexels-photo-10221760.jpeg?auto=compress&cs=tinysrgb&w=1400',
      editorial: 'https://images.pexels.com/photos/16238583/pexels-photo-16238583.jpeg?auto=compress&cs=tinysrgb&w=1400',
    },
  },
];

export const categories: ('ALL' | ProductCategory)[] = [
  'ALL',
  'OUTERWEAR',
  'KNITWEAR',
  'TROUSERS',
  'ACCESSORIES',
];

export function formatPrice(n: number): string {
  return `€${n}`;
}

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
