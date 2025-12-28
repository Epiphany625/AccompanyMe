import { Sidebar } from "../components/Sidebar"
import "./PageLayout.css"

export const AiChatPage = () => {
  return (
    <div className="page-shell">
      <Sidebar activePage="aichat" />
      <main className="page-content">
        <section className="page-panel">
          <h1>AI Chat</h1>
          <p>Start a guided conversation and capture ideas in real time.</p>
        </section>
      </main>
    </div>
  )
}
