import { MotionConfig } from 'framer-motion'
import { InteractionSound } from './components/Effects'
import AnimatedBackground from './components/AnimatedBackground'
import CustomCursor from './components/CustomCursor'
import LoadingScreen from './components/LoadingScreen'
import {
  Header,
  AssistantRail,
  ScrollRail,
  Divider,
  Footer,
} from './components/Layout'
import {
  Hero,
  Skills,
  Projects,
  GithubActivity,
  Experience,
  Certificates,
  Contact,
} from './components/Sections'

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="app-shell">
        <LoadingScreen />
        <AnimatedBackground />
        <CustomCursor />
        <InteractionSound />
        <Header />
        <main>
          <Hero />
          <Divider />
          <Skills />
          <Divider />
          <Projects />
          <Divider />
          <GithubActivity />
          <Divider />
          <Experience />
          <Divider />
          <Certificates />
          <Divider />
          <Contact />
        </main>
        <Footer />
        <AssistantRail />
        <ScrollRail />
      </div>
    </MotionConfig>
  )
}

export default App;
