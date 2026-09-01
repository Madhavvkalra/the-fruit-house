import { Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type FruitSenseButtonProps = {
  hamperMobilePanelVisible: boolean
  hasBottomAction?: boolean
}

export default function FruitSenseButton({
  hamperMobilePanelVisible,
  hasBottomAction = false,
}: FruitSenseButtonProps) {

  const navigate = useNavigate()

  const shouldMoveUp =
    hamperMobilePanelVisible || hasBottomAction

  return (
    <div
      className={`
        fixed
        left-4
        z-[240]

        transition-[bottom,transform,opacity]
        duration-500
        ease-[cubic-bezier(.22,1,.36,1)]

        ${
          shouldMoveUp
            ? 'bottom-[118px] sm:bottom-[122px]'
            : 'bottom-5 sm:bottom-6'
        }

        md:left-6
        md:bottom-6
      `}
    >
     <button
  type="button"
  onClick={() => navigate('/fruit-sense')}
  className="
    group
    flex
    h-[58px]
    w-[168px]
    items-center
    rounded-full

    bg-[#efffb0]

    pl-[7px]
    pr-4

    text-[#17351d]

    shadow-[0_14px_45px_rgba(8,21,11,.25)]

    transition-all
    duration-300

    hover:scale-[1.02]
    active:scale-[0.97]
  "
>
  {/* AI ICON */}

  <span
    className="
      flex
   h-10
w-10
      shrink-0
      items-center
      justify-center
      rounded-full

      bg-[#17351d]
      text-[#efffb0]
    "
  >
    <Sparkles
      size={16}
      strokeWidth={2}
    />
  </span>


  {/* TEXT */}

  <span
    className="
      ml-3
      flex
      min-w-0
      flex-col
      justify-center
      leading-none
    "
  >
    <span
      className="
        text-[8px]
        font-semibold
        uppercase
        tracking-[0.16em]
        text-[#17351d]/50
      "
    >
      Discover
    </span>

    <span
      className="
        mt-[4px]
        whitespace-nowrap
        font-playfair
        text-[13px]
        italic
        leading-none
        text-[#17351d]
      "
    >
      Fruit Sense AI
    </span>
  </span>
</button>
    </div>
  )
}