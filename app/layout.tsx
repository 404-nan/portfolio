import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import {
  Geist,
  Geist_Mono,
  Noto_Serif_JP,
  Noto_Sans_JP,
  Dela_Gothic_One,
  Reggae_One,
  RocknRoll_One,
  Rampart_One,
  DotGothic16,
  Yuji_Syuku,
  Hachi_Maru_Pop,
  Train_One,
  Stick,
} from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const notoSerif = Noto_Serif_JP({
  variable: '--font-noto-serif',
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
})
const notoSans = Noto_Sans_JP({
  variable: '--font-noto-sans',
  weight: ['300', '400', '500'],
  subsets: ['latin'],
})

// Display fonts used by the glitch / roulette headline effect.
const delaGothic = Dela_Gothic_One({
  variable: '--font-dela',
  weight: '400',
  subsets: ['latin'],
})
const reggae = Reggae_One({
  variable: '--font-reggae',
  weight: '400',
  subsets: ['latin'],
})
const rocknroll = RocknRoll_One({
  variable: '--font-rocknroll',
  weight: '400',
  subsets: ['latin'],
})
const rampart = Rampart_One({
  variable: '--font-rampart',
  weight: '400',
  subsets: ['latin'],
})
const dotGothic = DotGothic16({
  variable: '--font-dot',
  weight: '400',
  subsets: ['latin'],
})
const yujiSyuku = Yuji_Syuku({
  variable: '--font-yuji',
  weight: '400',
  subsets: ['latin'],
})
const hachiMaru = Hachi_Maru_Pop({
  variable: '--font-hachi',
  weight: '400',
  subsets: ['latin'],
})
const trainOne = Train_One({
  variable: '--font-train',
  weight: '400',
  subsets: ['latin'],
})
const stick = Stick({
  variable: '--font-stick',
  weight: '400',
  subsets: ['latin'],
})

const displayFontVars = [
  delaGothic.variable,
  reggae.variable,
  rocknroll.variable,
  rampart.variable,
  dotGothic.variable,
  yujiSyuku.variable,
  hachiMaru.variable,
  trainOne.variable,
  stick.variable,
].join(' ')

export const metadata: Metadata = {
  title: 'NaN — 測れないものを、形にする。',
  description:
    'NaN は、デザインとテクノロジーの境界を越え、本質的な価値にフォーカスを当てるクリエイティブスタジオです。見えない課題を見つめ、まだ存在しない体験をカタチにします。',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#1c1c1c',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ja"
      className={`dark ${geistSans.variable} ${geistMono.variable} ${notoSerif.variable} ${notoSans.variable} ${displayFontVars} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
