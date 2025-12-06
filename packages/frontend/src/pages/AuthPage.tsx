import { Auth } from "../components/Auth"

export const AuthPage = () => {
    return (
        <div style={{ display: "flex", justifyContent: "space-evenly", margin: "20px" }}>
            <Auth />
            <div style={{ display: "flex", alignItems: "center" }}>
                <h1>
                    AccompanyMe.
                </h1>
            </div>
        </div>

    )
}