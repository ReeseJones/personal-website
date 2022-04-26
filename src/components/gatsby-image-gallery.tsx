import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import { SourceProps } from "gatsby-plugin-image/dist/src/components/picture";
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
                const aspect = data.height / data.width;
                const height = 300;
                const width = height * aspect;
                return (
                    <li>
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
