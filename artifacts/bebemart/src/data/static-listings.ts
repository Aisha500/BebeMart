import type { Listing, ListingDetail, UserPublic } from "@workspace/api-client-react";

const sellers: Record<number, UserPublic> = {
  1: { id: 1, name: "Amara Okonkwo", city: "Lekki", state: "Lagos", rating: 4.8, reviewCount: 12, createdAt: "2025-01-15T00:00:00Z" },
  2: { id: 2, name: "Chioma Adeyemi", city: "Garki", state: "Abuja", rating: 4.5, reviewCount: 8, createdAt: "2025-02-01T00:00:00Z" },
  3: { id: 3, name: "Tunde Bello", city: "Ikeja", state: "Lagos", rating: null, reviewCount: 0, createdAt: "2025-03-10T00:00:00Z" },
  4: { id: 4, name: "Ngozi Eze", city: "GRA Phase 2", state: "Port Harcourt", rating: 4.2, reviewCount: 5, createdAt: "2025-01-20T00:00:00Z" },
};

export const staticListings: Listing[] = [
  {
    id: 1,
    title: "Cute Baby Romper Set",
    description: "Adorable 3-piece romper set in mint green, barely worn. Perfect for 0-6 months.",
    price: 1500,
    category: "Clothes",
    ageGroup: "0-6m",
    condition: "Like New",
    images: ["/images/listing-romper.webp"],
    sellerId: 1,
    sellerName: "Amara Okonkwo",
    sellerRating: 4.8,
    state: "Lagos",
    city: "Lekki",
    status: "available",
    giftItForward: false,
    createdAt: "2025-06-01T10:00:00Z",
  },
  {
    id: 2,
    title: "Fisher-Price Activity Gym",
    description: "Complete activity gym with hanging toys and mat. My daughter loved this!",
    price: 3500,
    category: "Gear",
    ageGroup: "0-6m",
    condition: "Good",
    images: ["/images/listing-gym.webp"],
    sellerId: 1,
    sellerName: "Amara Okonkwo",
    sellerRating: 4.8,
    state: "Lagos",
    city: "Lekki",
    status: "available",
    giftItForward: false,
    createdAt: "2025-06-02T10:00:00Z",
  },
  {
    id: 3,
    title: "Toddler Shoe Collection (Size 22)",
    description: "3 pairs of barely used toddler shoes. All in great condition. Size 22.",
    price: 2000,
    category: "Shoes",
    ageGroup: "1-3y",
    condition: "Good",
    images: ["/images/listing-shoes.webp"],
    sellerId: 2,
    sellerName: "Chioma Adeyemi",
    sellerRating: 4.5,
    state: "Abuja",
    city: "Garki",
    status: "available",
    giftItForward: false,
    createdAt: "2025-06-03T10:00:00Z",
  },
  {
    id: 4,
    title: "Board Book Bundle (10 books)",
    description: "Collection of 10 colorful board books, great condition. Educational and fun!",
    price: 1800,
    category: "Books",
    ageGroup: "1-3y",
    condition: "Good",
    images: ["/images/listing-books.webp"],
    sellerId: 2,
    sellerName: "Chioma Adeyemi",
    sellerRating: 4.5,
    state: "Abuja",
    city: "Garki",
    status: "available",
    giftItForward: false,
    createdAt: "2025-06-04T10:00:00Z",
  },
  {
    id: 5,
    title: "Wooden Toy Train Set",
    description: "Classic wooden train set with tracks, bridges and trees. Hours of fun!",
    price: 4500,
    category: "Toys",
    ageGroup: "4-6y",
    condition: "Like New",
    images: ["/images/listing-train.webp"],
    sellerId: 4,
    sellerName: "Ngozi Eze",
    sellerRating: 4.2,
    state: "Port Harcourt",
    city: "GRA Phase 2",
    status: "available",
    giftItForward: false,
    createdAt: "2025-06-05T10:00:00Z",
  },
  {
    id: 6,
    title: "Baby Girl Dress Collection",
    description: "Beautiful gift from aunty — too small before she could wear most of them! Giving forward.",
    price: 0,
    category: "Clothes",
    ageGroup: "6-12m",
    condition: "Like New",
    images: ["/images/listing-dresses.webp"],
    sellerId: 1,
    sellerName: "Amara Okonkwo",
    sellerRating: 4.8,
    state: "Lagos",
    city: "Lekki",
    status: "available",
    giftItForward: true,
    createdAt: "2025-06-06T10:00:00Z",
  },
  {
    id: 7,
    title: "LEGO Duplo Big Box",
    description: "Original LEGO Duplo big box with all pieces intact. Great for creative play.",
    price: 5000,
    category: "Toys",
    ageGroup: "1-3y",
    condition: "Good",
    images: ["/images/listing-lego.webp"],
    sellerId: 4,
    sellerName: "Ngozi Eze",
    sellerRating: 4.2,
    state: "Port Harcourt",
    city: "GRA Phase 2",
    status: "available",
    giftItForward: false,
    createdAt: "2025-06-07T10:00:00Z",
  },
  {
    id: 8,
    title: "Baby Stroller (Chicco)",
    description: "Chicco stroller in excellent condition. Compact and easy to fold. Comes with rain cover.",
    price: 4800,
    category: "Gear",
    ageGroup: "0-6m",
    condition: "Good",
    images: ["/images/listing-stroller.webp"],
    sellerId: 2,
    sellerName: "Chioma Adeyemi",
    sellerRating: 4.5,
    state: "Abuja",
    city: "Garki",
    status: "available",
    giftItForward: false,
    createdAt: "2025-06-08T10:00:00Z",
  },
  {
    id: 9,
    title: "Boy School Uniforms Set",
    description: "Complete school uniform set for primary school, age 7+. Outgrown in just one term!",
    price: 2500,
    category: "Clothes",
    ageGroup: "7y+",
    condition: "Good",
    images: ["/images/listing-uniforms.webp"],
    sellerId: 4,
    sellerName: "Ngozi Eze",
    sellerRating: 4.2,
    state: "Port Harcourt",
    city: "GRA Phase 2",
    status: "available",
    giftItForward: false,
    createdAt: "2025-06-09T10:00:00Z",
  },
  {
    id: 10,
    title: "Shape Sorter & Puzzle Bundle",
    description: "Plastic shape sorter + 3 wooden puzzles. Great starter set for toddlers.",
    price: 0,
    category: "Toys",
    ageGroup: "1-3y",
    condition: "Like New",
    images: ["/images/listing-puzzles.webp"],
    sellerId: 2,
    sellerName: "Chioma Adeyemi",
    sellerRating: 4.5,
    state: "Abuja",
    city: "Garki",
    status: "available",
    giftItForward: true,
    createdAt: "2025-06-10T10:00:00Z",
  },
];

export function getStaticListingDetail(id: number): ListingDetail | undefined {
  const listing = staticListings.find((l) => l.id === id);
  if (!listing) return undefined;
  const seller = sellers[listing.sellerId];
  return { ...listing, seller };
}

export function filterStaticListings(params: Record<string, any>): { listings: Listing[]; total: number } {
  let filtered = [...staticListings];

  if (params.category && params.category !== "all") {
    filtered = filtered.filter((l) => l.category === params.category);
  }
  if (params.ageGroup && params.ageGroup !== "all") {
    filtered = filtered.filter((l) => l.ageGroup === params.ageGroup);
  }
  if (params.state && params.state !== "all") {
    filtered = filtered.filter((l) => l.state === params.state);
  }
  if (params.giftItForward) {
    filtered = filtered.filter((l) => l.giftItForward);
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q)
    );
  }

  return { listings: filtered, total: filtered.length };
}
