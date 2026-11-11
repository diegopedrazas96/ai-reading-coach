import type { Passage } from '@/types';

export const passages: readonly Passage[] = [
  {
    id: 'cat',
    title: 'The Sleepy Cat',
    tag: 'Easy • 5 words',
    level: 1,
    text: 'The little cat is sleeping.',
    emoji: '🐱',
    accent: '#fce9d3',
  },
  {
    id: 'sun',
    title: 'A Sunny Day',
    tag: 'Easy • 12 words',
    level: 1,
    text: 'The sun is shining today. We can play outside in the park.',
    emoji: '☀️',
    accent: '#ffedb0',
  },
  {
    id: 'bird',
    title: 'The Blue Bird',
    tag: 'Medium • 19 words',
    level: 2,
    text: 'A little blue bird sits on the tree. It sings a happy song as the morning sun rises.',
    emoji: '🐦',
    accent: '#dcecfb',
  },
  {
    id: 'garden',
    title: 'My Little Garden',
    tag: 'Medium • 24 words',
    level: 2,
    text: 'Every morning, Mia waters the flowers in her garden. Red roses and yellow daisies grow beside a small wooden fence.',
    emoji: '🌻',
    accent: '#fce4d6',
  },
];
