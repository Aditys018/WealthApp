import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useNavigate } from '@tanstack/react-router'
import React from 'react'

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
  showGetStartedButton?: boolean
  showLoginButton?: boolean
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
  showGetStartedButton = false,
  showLoginButton = false,
}: IContentWithImageProps) {
  const isLeft = imagePosition === 'left'
  const navigate = useNavigate()

  return (
    <section
      className={cn(
        'w-full py-12 md:py-20 px-4 sm:px-6 lg:px-8 text-white',
        className,
      )}
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={cn(
            'flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16',
            isLeft && 'md:flex-row-reverse',
          )}
        >
          {/* Content Section */}
          <div className="flex flex-col flex-1 max-w-full md:max-w-lg lg:max-w-2xl">
            {/* Heading */}
            <h2 className="text-2xl sm:text-2xl lg:text-3xl font-bold tracking-tight mb-6 text-[#FF9500] leading-none text-left">
              {title}
            </h2>

            {/* Description */}
            <div className="text-base sm:text-lg text-white/80 mb-9 leading-relaxed text-left">
              {typeof description === 'string' ? (
                <p>{description}</p>
              ) : (
                description
              )}
            </div>

            <div className="flex flex-col gap-2 md:gap-4 md:flex-row">
              {/* Get Started Button */}
              {showGetStartedButton ? (
                <div className="flex justify-start mb-8">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="!bg-[#FF9500] hover:!bg-[#ffb84d] text-black font-bold px-10 py-6 rounded-lg text-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => navigate({ to: '/register' })}
                  >
                    Get Started
                  </Button>
                </div>
              ) : null}

              {showLoginButton ? (
                <div className="flex justify-start mb-8">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="!bg-[#FF9500] hover:!bg-[#ffb84d] text-black font-bold px-10 py-6 rounded-lg text-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => navigate({ to: '/login' })}
                  >
                    Login
                  </Button>
                </div>
              ) : null}
            </div>

            {/* Primary/Secondary Buttons */}
            {(primaryButtonText || secondaryButtonText) && (
              <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:justify-start">
                {primaryButtonText && (
                  <Button
                    onClick={onPrimaryClick}
                    className="bg-accent hover:bg-[#ffb84d] text-black font-bold px-6 py-6 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {primaryButtonText}
                  </Button>
                )}

                {secondaryButtonText && (
                  <Button
                    onClick={onSecondaryClick}
                    variant="outline"
                    className="border-accent text-accent font-bold px-6 py-6 rounded-lg text-lg shadow-lg hover:bg-accent/10 transition-all duration-300"
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
                className="cwi-image w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
