import { Button } from '@/components/ui/button'

export function Footer() {
  return (
    <div className="bg-[#1d1d1d] py-[80px]">
      <footer className="w-full text-white px-4 sm:px-6 lg:px-8 min-h-[100px]">
        <div className="max-w-7xl mx-auto flex flex-col gap-2">
         
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
            <div className="flex flex-col items-start gap-1">
              <img
                src="/Logo.png"
                alt="WealthApp Logo"
                className="w-[120px] h-[36px] object-contain"
              />
              <span className="text-sm text-white/80 mt-1">
                Simplified wealth analysis at your fingertips
              </span>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 text-white no-underline hover:bg-transparent focus-visible:ring-0 focus:outline-none"
                onClick={() => window.open('/about', '_blank')}
              >
                About
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 text-white no-underline hover:bg-transparent focus-visible:ring-0 focus:outline-none"
                onClick={() => window.open('/privacy-policy', '_blank')}
              >
                Privacy Policy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 text-white no-underline hover:bg-transparent focus-visible:ring-0 focus:outline-none"
                onClick={() =>
                  window.open('https://github.com/Aditys018/WealthApp')
                }
              >
                GitHub
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 text-white no-underline hover:bg-transparent focus-visible:ring-0 focus:outline-none"
                onClick={() => window.open('/contact', '_blank')}
              >
                Contact
              </Button>
            </div>
          </div>
         
          <hr className="border-t border-white/30 my-4" />
         
          <div className="text-sm text-white/70 text-center mt-2">
            &copy; {new Date().getFullYear()} WealthApp. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
