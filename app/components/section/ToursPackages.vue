<script setup lang="ts">
const tourPackages = [
  {
    id: 1,
    badge: 'Popular Choice',
    category: 'GROUP TOURS',
    title: 'Group Tours Across Uzbekistan',
    description: 'Travel together with like-minded explorers — fixed dates, guided routes, and everything arranged for you. Visit Samarkand, Bukhara, and Khiva with our expert local guides',
    locations: ['Tashkent', 'Samarkand', 'Bukhara', 'Khiva'],
    features: [
      { icon: 'clock', text: '7 days / 6 nights' },
      { icon: 'hotel', text: '3-4 hotels' },
      { icon: 'group', text: 'Group of 10-20 people' },
      { icon: 'transport', text: 'Transport' },
      { icon: 'food', text: 'Breakfast' },
      { icon: 'guide', text: 'Licensed guide' },
      { icon: 'wifi', text: 'Free SIM/eSIM' }
    ],
    rating: 3.0,
    reviewCount: 160,
    ratingLabel: 'Excellent',
    price: 'From 10 989 000 UZS',
    image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800'
  },
  {
    id: 2,
    badge: 'Best for Families',
    category: 'FAMILY PACKAGE',
    title: 'Uzbekistan Family Adventure',
    description: 'A comfortable and safe family journey through history — discover Tashkent, Samarkand, and Bukhara together. Family-friendly hotels, private transfers, and fun experiences for all ages.',
    locations: ['Tashkent', 'Samarkand', 'Bukhara'],
    features: [
      { icon: 'clock', text: '7 days / 6 nights' },
      { icon: 'hotel', text: '4 family hotels' },
      { icon: 'family', text: 'Private family tour' },
      { icon: 'transport', text: 'Transport' },
      { icon: 'transport', text: 'Transfers' },
      { icon: 'ticket', text: 'Entry tickets included' },
      { icon: 'support', text: '24/7 support' }
    ],
    rating: 4.9,
    reviewCount: 160,
    ratingLabel: 'Excellent',
    price: 'From 10 989 000 UZS',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800'
  },
  {
    id: 3,
    badge: 'Premium Experience',
    category: 'VIP TOURS',
    title: 'Luxury Silk Road Journey',
    description: 'Experience Uzbekistan in ultimate comfort with 5-star accommodations, private guides, and exclusive access to historical sites. Perfect for discerning travelers.',
    locations: ['Tashkent', 'Samarkand', 'Bukhara', 'Khiva'],
    features: [
      { icon: 'clock', text: '10 days / 9 nights' },
      { icon: 'hotel', text: '5-star hotels' },
      { icon: 'guide', text: 'Private guide' },
      { icon: 'transport', text: 'Luxury transport' },
      { icon: 'food', text: 'Full board' },
      { icon: 'ticket', text: 'VIP access' }
    ],
    rating: 5.0,
    reviewCount: 89,
    ratingLabel: 'Outstanding',
    price: 'From 25 000 000 UZS',
    image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=800'
  },
  {
    id: 4,
    badge: 'Adventure Seekers',
    category: 'ADVENTURE TOUR',
    title: 'Desert & Mountains Explorer',
    description: 'For those who crave adventure — explore the Kyzylkum desert, stay in yurts, and trek through the stunning Nurata mountains.',
    locations: ['Tashkent', 'Nurata', 'Kyzylkum', 'Samarkand'],
    features: [
      { icon: 'clock', text: '6 days / 5 nights' },
      { icon: 'hotel', text: 'Yurts & hotels' },
      { icon: 'group', text: 'Small groups' },
      { icon: 'transport', text: '4x4 vehicles' },
      { icon: 'food', text: 'All meals' },
      { icon: 'guide', text: 'Expert guide' }
    ],
    rating: 4.7,
    reviewCount: 124,
    ratingLabel: 'Excellent',
    price: 'From 15 500 000 UZS',
    image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800'
  }
]
</script>

<template>
  <section class="py-16">
    <div class="container mx-auto px-4">
      <!-- Title -->
      <h2 class="text-5xl font-bold text-gray-900 text-center mb-12 italic">
        Our Tour Packages
      </h2>

      <!-- Tour Cards -->
      <div class="space-y-6">
        <CardsTourPackageCard
          v-for="tour in tourPackages"
          :key="tour.id"
          :badge="tour.badge"
          :category="tour.category"
          :title="tour.title"
          :description="tour.description"
          :locations="tour.locations"
          :features="tour.features"
          :rating="tour.rating"
          :review-count="tour.reviewCount"
          :rating-label="tour.ratingLabel"
          :price="tour.price"
          :image="tour.image"
        />
      </div>
    </div>
  </section>
</template>
