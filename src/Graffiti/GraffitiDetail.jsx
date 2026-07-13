import { useEffect } from "react";

function GraffitiDetail({ graffiti, onClose }) {

    useEffect(() => {

        const handleKeyDown = event => {

            if (event.key === "Escape") {

                onClose();

            }

        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {

            window.removeEventListener("keydown", handleKeyDown);

        };

    }, [onClose]);

    const location = `${graffiti.lat.toFixed(4)} N, ${graffiti.lng.toFixed(4)} E`;

    return (

        <section
            className="graffiti-detail"
            role="dialog"
            aria-modal="true"
            aria-labelledby="graffiti-detail-title"
        >

            <button
                className="graffiti-detail__close"
                type="button"
                onClick={onClose}
            >
                Close archive
            </button>

            <div
                className="graffiti-detail__model-stage"
                aria-label="3D infrastructure model placeholder"
            >

                <span>3D object view pending</span>

            </div>

            <article className="graffiti-detail__card">

                <p className="graffiti-detail__eyebrow">
                    Traffiti archive
                </p>

                <h2 id="graffiti-detail-title">
                    {graffiti.title}
                </h2>

                <dl className="graffiti-detail__metadata">

                    <div>
                        <dt>Location</dt>
                        <dd>{location}</dd>
                    </div>

                    <div>
                        <dt>Artist</dt>
                        <dd>{graffiti.artist}</dd>
                    </div>

                    <div>
                        <dt>Scanned</dt>
                        <dd>{graffiti.scannedAt}</dd>
                    </div>

                </dl>

            </article>

        </section>

    );

}

export default GraffitiDetail;
