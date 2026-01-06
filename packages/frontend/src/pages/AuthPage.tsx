import { Auth } from "../components/Auth"
import { useSkipAuth } from "../utils/hooks"

export const AuthPage = () => {
  useSkipAuth()

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        margin: "20px",
      }}
    >
      <Auth />
      <div style={{ display: "flex", alignItems: "center" }}>
        <h1>AccompanyMe.</h1>
      </div>
    </div>
  )
}
