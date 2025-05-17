import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface IContentWithImageProps {
  title: string
  description: string | React.ReactNode
  imageSrc: string
  imageAlt?: string
  primaryButtonText?: string
  secondaryButtonText?: string
  onPrimaryClick?: () => void
  onSecondaryClick?: () => void
  imagePosition?: 'left' | 'right'
  className?: string
}

export function ContentWithImage({
  title,
  description,
  imageSrc,
  imageAlt = 'Feature image',
  primaryButtonText,
  secondaryButtonText,
  onPrimaryClick,
  onSecondaryClick,
  imagePosition = 'right',
  className,
}: IContentWithImageProps) {
  return (
    <section
      className={cn(
        'w-full py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-t from-black to to-black/20 text-white',
        className,
      )}
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={cn(
            'flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16',
            imagePosition === 'left' && 'md:flex-row-reverse',
          )}
        >
          {/* Content Section */}
          <div className="flex flex-col flex-1 max-w-full md:max-w-lg lg:max-w-2xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              {title}
            </h2>

            <div className="text-base sm:text-lg text-white/80 mb-8 leading-relaxed">
              {typeof description === 'string' ? (
                <p>{description}</p>
              ) : (
                description
              )}
            </div>

            {(primaryButtonText || secondaryButtonText) && (
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                {primaryButtonText && (
                  <Button
                    onClick={onPrimaryClick}
                    className="bg-accent hover:bg-[#ffb84d] text-black 
                    font-bold px-6 py-6 rounded-lg text-lg shadow-lg hover:shadow-xl
                     transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {primaryButtonText}
                  </Button>
                )}

                {secondaryButtonText && (
                  <Button
                    variant="outline"
                    onClick={onSecondaryClick}
                    className="border-white/20 hover:bg-white/10 text-white font-medium px-6 py-6 rounded-lg text-lg transition-all duration-300"
                  >
                    {secondaryButtonText}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Image Section */}
          <div className="flex-shrink-0 w-full md:w-2/5 lg:w-5/12">
            <div className="relative aspect-square sm:aspect-[4/3] md:aspect-[3/4] lg:aspect-square rounded-xl overflow-hidden shadow-xl mx-auto">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
