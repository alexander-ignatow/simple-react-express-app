import { WisdomGenerator } from '@/components/wisdom/WisdomGenerator'
import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher'

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
