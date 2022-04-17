import React, { JSXElementConstructor, ReactElement, ReactNode } from "react";
import "./card.scss";

export interface ICardProps {
    title: ReactElement<any, string | JSXElementConstructor<any>>;
    backgroundElement?: ReactElement<any, string | JSXElementConstructor<any>>;
    children?: React.ReactNode;
}

export const Card: React.FC<ICardProps> = (props) => {
    const bgEl = props.backgroundElement
        ? React.cloneElement(props.backgroundElement, {
              className: "card-background"
          })
        : null;

    return (
        <section className="card">
            {bgEl}
            {React.cloneElement(props.title, { className: "card-title" })}
            <section className="card-details">{props.children}</section>
        </section>
    );
};
