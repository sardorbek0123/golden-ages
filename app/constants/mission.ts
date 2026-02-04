export interface MissionItem {
  id: number
  title: string
  description: string
}

export const missionData = {
  badge: 'mission.badge',
  title: 'mission.title',
  description: 'mission.description',
  buttonText: 'mission.buttonText',
  image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=800',
  items: [
    {
      id: 1,
      title: 'mission.items.connections.title',
      description: 'mission.items.connections.description'
    },
    {
      id: 2,
      title: 'mission.items.customizable.title',
      description: 'mission.items.customizable.description'
    },
    {
      id: 3,
      title: 'mission.items.modular.title',
      description: 'mission.items.modular.description'
    }
  ] as MissionItem[]
}
