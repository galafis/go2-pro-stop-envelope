export default {
  slug: 'go2-pro-stop-envelope',
  title: 'Go2 PRO Stop Envelope',
  color: '#a34465',
  group: 'Unitree Go2 PRO',
  tagline: {
    en: 'Explore stopping-distance assumptions before designing a controlled trial.',
    pt: 'Explore hipóteses de distância de parada antes de planejar um ensaio controlado.',
  },
  description:
    'EN: Explore stopping-distance assumptions before designing a controlled trial. PT: Explore hipóteses de distância de parada antes de planejar um ensaio controlado.',
  topics: [
    'unitree-go2',
    'robotics',
    'research-prototype',
    'bilingual',
    'javascript',
    'kinematics',
    'sensitivity-analysis',
    'robotics-education',
  ],
  setting: {
    key: 'speedMps',
    label: {
      en: 'Initial speed (m/s)',
      pt: 'Velocidade inicial (m/s)',
    },
    min: 0,
    max: 10,
    step: 0.05,
  },
  default: 1,
};
