export interface GoalCard {
  id: number
  badge: string
  value: string
  description: string
  image?: string
}

export const goalsData = {
  badge: 'goals.badge',
  title: 'goals.title',
  description: 'goals.description',
  cards: [
    {
      id: 1,
      badge: 'goals.cards.experience.badge',
      value: 'goals.cards.experience.value',
      description: 'goals.cards.experience.description',
      image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600'
    },
    {
      id: 2,
      badge: 'goals.cards.satisfaction.badge',
      value: 'goals.cards.satisfaction.value',
      description: 'goals.cards.satisfaction.description'
    },
    {
      id: 3,
      badge: 'goals.cards.journeys.badge',
      value: 'goals.cards.journeys.value',
      description: 'goals.cards.journeys.description'
    },
    {
      id: 4,
      badge: 'goals.cards.support.badge',
      value: 'goals.cards.support.value',
      description: 'goals.cards.support.description'
    }
  ] as GoalCard[]
}
