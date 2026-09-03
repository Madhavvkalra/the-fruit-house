import { useEffect, useState } from 'react'

type NavItem = {
  label: string
  mobileLabel: string
  sectionId: string
}

const navItems: NavItem[] = [
  {
    label: 'Fruit Shop',
    mobileLabel: 'Fruit',
    sectionId: 'fruit-shop',
  },
  {
    label: 'Hamper Studio',
    mobileLabel: 'Hamper',
    sectionId: 'hamper-studio',
  },
  {
    label: 'Our Story',
    mobileLabel: 'Our',
    sectionId: 'our-story',
  },
 {
  label: 'Contact Us',
  mobileLabel: 'Contact',
  sectionId: 'contact',
},
]

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('')

const scrollToSection = (sectionId: string) => {
  if (sectionId === 'contact') {
    window.location.href = '/contact'
    return
  }

  setActiveSection(sectionId)

  const section = document.getElementById(sectionId)

  if (!section) {
    console.warn(`Section "${sectionId}" was not found`)
    return
  }

  section.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

useEffect(() => {
  const handleScroll = () => {
    const fruitShop = document.getElementById('fruit-shop')
    const hamperStudio = document.getElementById('hamper-studio')

    if (!fruitShop || !hamperStudio) return

    const scrollPosition = window.scrollY + 120

    const fruitShopTop = fruitShop.offsetTop
    const hamperStudioTop = hamperStudio.offsetTop

    // HERO — nothing active
    if (scrollPosition < fruitShopTop) {
      setActiveSection('')
      return
    }

    // FRUIT SHOP — active throughout the entire section
    if (
      scrollPosition >= fruitShopTop &&
      scrollPosition < hamperStudioTop
    ) {
      setActiveSection('fruit-shop')
      return
    }

    // HAMPER STUDIO
    if (scrollPosition >= hamperStudioTop) {
      setActiveSection('hamper-studio')
      return
    }
  }

  handleScroll()

  window.addEventListener('scroll', handleScroll, {
    passive: true,
  })

  window.addEventListener('resize', handleScroll)

  return () => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleScroll)
  }
}, [])

const isLightBackground = activeSection === 'fruit-shop'

  const goHome = () => {
    setActiveSection('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <nav className="fixed left-0 right-0 top-0 z-[100] px-3 pt-4 sm:px-5 md:px-10 md:py-6">

      {/* =====================================================
          MOBILE NAVBAR
      ===================================================== */}

      <div className="md:hidden">

        <div className="flex items-center gap-2">

          {/* LOGO */}

          <button
            type="button"
            onClick={goHome}
            aria-label="Go to home"
            className="flex h-11 w-11 shrink-0 items-center justify-center select-none touch-manipulation"
            style={{
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
            }}
          >
      <img
  src="/fruit-house-logo.png"
  alt="The Fruit House"
  draggable={false}
  className={`
    pointer-events-none
    h-10
    w-auto
    object-contain
    select-none
    transition-all
    duration-500
    ${
      isLightBackground
        ? 'brightness-0 saturate-100'
        : ''
    }
  `}
/>
          </button>

          {/* MOBILE TAB BAR */}

          <div
  className={`
    grid
    flex-1
    grid-cols-4
    items-center
    gap-1
    rounded-full
    border
    p-1
    shadow-[0_10px_35px_rgba(0,0,0,0.18)]
    backdrop-blur-xl
    transition-all
    duration-500
    ${
      isLightBackground
        ? 'border-[#17351d]/15 bg-white/80'
        : 'border-white/15 bg-black/25'
    }
  `}
>
            {navItems.map((item) => {
              const isActive =
                activeSection === item.sectionId

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() =>
                    scrollToSection(item.sectionId)
                  }
                 className={`
  flex
  min-w-0
  min-h-[52px]
  items-center
  justify-center
  rounded-full
  px-2
  py-3
  text-center
  text-[12px]
  font-semibold
  leading-[0.95]
  transition-all
  duration-300
  select-none
  touch-manipulation
  [-webkit-touch-callout:none]
  [-webkit-user-select:none]

  ${
    isActive
      ? 'bg-[#17351d] text-white shadow-sm'
      : isLightBackground
        ? 'text-[#17351d]/70 active:bg-[#17351d]/10 active:text-[#17351d]'
        : 'text-white/80 active:bg-white/10 active:text-white'
  }
`}
                  style={{
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none',
                  }}
                >
                  <span className="flex flex-col items-center gap-[2px] leading-none">
  {item.sectionId === 'fruit-shop' ? (
    <>
      <span>Fruit</span>
      <span>Shop</span>
    </>
  ) : item.sectionId === 'hamper-studio' ? (
    <>
      <span>Hamper</span>
      <span>Studio</span>
    </>
  ) : item.sectionId === 'our-story' ? (
    <>
      <span>Our</span>
      <span>Story</span>
    </>
) : (
  <>
    <span>Contact</span>
    <span>Us</span>
  </>
)}
</span>
                </button>
              )
            })}
          </div>

        </div>

      </div>


      {/* =====================================================
          DESKTOP NAVBAR
      ===================================================== */}

      <div className="hidden md:flex">

       <div
  className={`
    flex
    items-center
    gap-3
    rounded-full
    border
    p-2
    shadow-[0_12px_40px_rgba(0,0,0,0.16)]
    backdrop-blur-xl
    transition-all
    duration-500
    ${
      isLightBackground
        ? 'border-[#17351d]/15 bg-white/80'
        : 'border-white/15 bg-black/20'
    }
  `}
>

          {/* LOGO */}

<button
  type="button"
  onClick={goHome}
  aria-label="Go to home"
  className="
    flex
    h-14
    w-16
    shrink-0
    items-center
    justify-center
    overflow-visible
    select-none
  "
>
  <img
    src="/fruit-house-logo.png"
    alt="The Fruit House"
    draggable={false}
    className={`
      pointer-events-none
      h-14
      w-auto
      translate-x-1
      object-contain
      select-none
      transition-all
      duration-500
      ${
        isLightBackground
          ? 'brightness-0 saturate-100'
          : ''
      }
    `}
  />
</button>

          {/* DIVIDER */}

          <div
  className={`
    h-7
    w-px
    transition-colors
    duration-500
    ${
      isLightBackground
        ? 'bg-[#17351d]/15'
        : 'bg-white/15'
    }
  `}
/>


          {/* DESKTOP TABS */}

          <div className="flex items-center gap-1">

            {navItems.map((item) => {
              const isActive =
                activeSection === item.sectionId

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() =>
                    scrollToSection(item.sectionId)
                  }
                  className={`
                    rounded-full
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    transition-all
                    duration-300
                    select-none
                    touch-manipulation

                   ${
  isActive
    ? 'bg-[#17351d] text-white shadow-sm'
    : isLightBackground
      ? 'text-[#17351d]/70 hover:bg-[#17351d]/10 hover:text-[#17351d]'
      : 'text-white/80 hover:bg-white/10 hover:text-white'
}
                  `}
                >
                  {item.label}
                </button>
              )
            })}

          </div>

        </div>

      </div>

    </nav>
  )
}