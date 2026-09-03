import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher'
import { WisdomGenerator } from '@/components/wisdom/WisdomGenerator'

const App = (): React.JSX.Element => {
  return (
    <>
      <div className="theme-switcher-position">
        <ThemeSwitcher />
      </div>
      <WisdomGenerator />
    </>
  )
}

export default App
