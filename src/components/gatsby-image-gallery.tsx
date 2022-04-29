import { IGatsbyImageData } from "gatsby-plugin-image";
import React from "react";

export interface IGatsbyImageGalleryProps
    extends React.HTMLAttributes<HTMLUListElement> {
    imageData: IGatsbyImageData[];
}

export const GatsbyImageGallery: React.FC<IGatsbyImageGalleryProps> = (
    props
) => {
    const { imageData, ...restOfProps } = props;

    return (
        <ul className={restOfProps?.className + " gallery"}>
            {imageData.map((data) => {
                return (
                    <li key={data.images.fallback?.src}>
                        <img
                            src={data.images.fallback?.src}
                            srcSet={data.images.fallback?.srcSet}
                            decoding="async"
                        ></img>
                    </li>
                );
            })}
            <li>{/*left intentionally empty*/}</li>
        </ul>
    );
};
