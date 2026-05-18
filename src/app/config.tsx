// export default {
//   // apiBaseUrl: 'https://skmsalesappapi.h2so4.lk'
//   //apiBaseUrl: 'https://skmsalesapptestapi.h2so4.lk',
//   apiBaseUrl: 'http://10.0.2.10'
// }

// config.ts
export default {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://skmsalesapptestapi.h2so4.lk'
}