import { GetStaticProps } from 'next'
import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import cn from 'classnames'
import { Game, NextPageWithLayout, TargetPlatform } from '@/types'
import DashboardLayout from '@/layouts/_dashboard'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'
import Button from '@/components/ui/button'
import client from '@/data/client'
import { useMyGames } from '@/data/games'
import { useMutation } from 'react-query'
import { download } from '@/lib/download-asset'
import ImageWithFallback from '@/components/ui/image-with-fallback'
import Select from '@/components/ui/forms/select'
import getPlatformLabel from '@/lib/get-target-platform-label'

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
      revalidate: 15 * 60
    }
  }
}

function GameGallery() {
  const { games } = useMyGames()
  const { t } = useTranslation('common')

  return (
    <main className="p-6">
      <h1 className="mb-4 text-center text-2xl font-bold">
        {t('text-my-games')}
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {games && games?.map((game) => <GameCard key={game.id} game={game} />)}
      </div>
    </main>
  )
}

interface GameCardProps {
  game: Game
}

function GameCard({ game }: GameCardProps) {
  const [hovered, setHovered] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<TargetPlatform>(
    TargetPlatform.WINDOWS
  )
  const { t } = useTranslation('common')
  const { mutate: downloadGame } = useMutation(
    client.orders.generateDownloadGameLink,
    {
      onSuccess: (data) => {
        download(data)
      }
    }
  )

  const builds = game.builds || []
  const uniquePlatforms = Array.from(new Set(builds.map((b) => b.platform)))

  // Default to windows if none
  const platformOptions =
    uniquePlatforms.length > 0 ? uniquePlatforms : [TargetPlatform.WINDOWS]

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-300 shadow-md"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="h-[300px] w-full md:h-[350px] lg:h-[400px]">
        <ImageWithFallback
          src={game.image.original}
          alt={game.name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div
        className={cn(
          'absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black bg-opacity-60 opacity-0 transition-opacity duration-300',
          hovered && 'opacity-100'
        )}
      >
        <Select
          label=""
          value={selectedPlatform}
          onChange={(e) =>
            setSelectedPlatform(e.target.value as TargetPlatform)
          }
          options={platformOptions.map((p) => ({
            value: p,
            label: getPlatformLabel(p)
          }))}
          className="w-[92%]"
          selectClassName="bg-white text-sm rounded-md"
        />

        <Button
          onClick={() => {
            downloadGame({ id: game.id, platform: selectedPlatform })
          }}
          className="rounded-lg bg-brand w-[92%] px-1 py-1 text-white shadow-md dark:bg-brand-dark"
        >
          {t('text-download')}
        </Button>
      </div>
      <div className="absolute bottom-2 left-2 rounded-lg bg-black bg-opacity-70 px-3 py-1 text-sm text-white">
        {game.name}
      </div>
    </div>
  )
}

const GamesPage: NextPageWithLayout = () => {
  return (
    <>
      <GameGallery />
    </>
  )
}

GamesPage.authorization = true
GamesPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>
}

export default GamesPage
