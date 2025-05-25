import { contentSections } from '../config'
import { ContentWithImage } from './components'
import { Footer } from './components/Footer'

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
          showGetStartedButton={section.id === 'main'}
          showLoginButton={section.id === 'main'}
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
      <Footer />
    </>
  )
}
