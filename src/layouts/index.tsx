import * as React from "react";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import "../styles.scss";
import { usePixiApp } from "../hooks/usePixiApp";

export const Layout: React.FC<React.ReactNode> = (props) => {
  const [containerRef, pixiApp] = usePixiApp();

  return (
    <>
      <div className="anim-background" ref={containerRef}>
        <Header />
        {props.children}
        <Footer />
      </div>
    </>
  );
};

export default Layout;
