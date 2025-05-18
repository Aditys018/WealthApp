import { contentSections } from '../config'
import { ContentWithImage } from './components'

export function LandingPage() {
  return (
    <>
      {contentSections.map((section) => (
        <ContentWithImage
          key={section.id}
          title={section.title}
          description={section.description}
          imageSrc={section.imageSrc}
          imagePosition={section.imagePosition as 'left' | 'right'}
          className={section.className}
          // You can add optional props here if needed for specific sections
          onPrimaryClick={
            section.id === 'main'
              ? () => (window.location.href = '/register')
              : undefined
          }
          onSecondaryClick={
            section.id === 'main'
              ? () => (window.location.href = '/learn-more')
              : undefined
          }
        />
      ))}
    </>
  )
}
