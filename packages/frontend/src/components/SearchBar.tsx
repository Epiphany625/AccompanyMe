import type { FormEvent } from "react";
import "./SearchBar.css";

export const SearchBar = () => {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    return (
        <section className="search-bar page-panel" aria-label="Search companions">
            <div className="search-bar__header">
                <div>
                    <p className="search-bar__eyebrow">Start here</p>
                    <h2>Find your next companion</h2>
                    <p className="search-bar__sub">
                        Search by interest, name, or city. We will surface companions who match your pace.
                    </p>
                </div>
                <div className="search-bar__highlight" aria-hidden="true">
                    <div className="search-bar__highlight-label">Open now</div>
                    <div className="search-bar__highlight-value">18 companions</div>
                </div>
            </div>

            <form className="search-bar__form" onSubmit={handleSubmit}>
                <label className="search-bar__label" htmlFor="search-input">
                    Search for companions
                </label>
                <div className="search-bar__field">
                    <span className="search-bar__icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" role="presentation">
                            <path
                                d="M11 4a7 7 0 1 1 0 14a7 7 0 0 1 0-14m0-2a9 9 0 1 0 5.55 16.08l4.69 4.69a1 1 0 0 0 1.42-1.42l-4.69-4.69A9 9 0 0 0 11 2z"
                                fill="currentColor"
                            />
                        </svg>
                    </span>
                    <input
                        className="ds-input search-bar__input"
                        id="search-input"
                        name="search"
                        type="search"
                        placeholder="Try "
                    />
                </div>
                <button className="ds-button ds-button--primary search-bar__button" type="submit">
                    Search
                </button>
            </form>

            <div className="search-bar__chips" aria-label="Popular searches">
                <span className="search-bar__chips-label">Popular:</span>
                <button className="search-bar__chip" type="button">Garden strolls</button>
                <button className="search-bar__chip" type="button">Cafe chats</button>
                <button className="search-bar__chip" type="button">Museum visits</button>
                <button className="search-bar__chip" type="button">Evening walks</button>
            </div>
        </section>
    );
}
