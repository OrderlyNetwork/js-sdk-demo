import { useEffect, useState } from "react";
import { cn, useOrderlyTheme } from "@orderly.network/ui";

/**
 * Demo-owned static framing artwork for the general leaderboard.
 *
 * The images live in public/leaderboard and the geometry below is tuned to
 * their transparent padding, so the whole treatment stays consumer-side:
 * rendered for every dark preset (Light stays quiet), hidden below 768px
 * (lg in the OUI scale), and pinned to the content edge on ultrawide screens.
 *
 * Layering contract with the SDK page: the view wraps LeaderboardPage in an
 * isolating container that owns the page background, and the page root is
 * made transparent through its supported `className` prop. That keeps this
 * component's z-index:-1 layer above the background but under the table —
 * no CSS overrides against SDK-generated DOM.
 */
export function LeaderboardDecorations() {
  const { currentTheme } = useOrderlyTheme();
  const [isUltrawide, setIsUltrawide] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 2560px)");
    const update = () => setIsUltrawide(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  if (currentTheme?.mode !== "dark") {
    return null;
  }

  const baseClass = cn(
    "oui-pointer-events-none",
    "oui-fixed oui-top-12 oui-z-[-1] oui-opacity-50",
    "oui-hidden lg:oui-block",
  );
  const baseStyle: React.CSSProperties = {
    width: "clamp(260px, 28vw, 560px)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  };

  return (
    <>
      <div
        aria-hidden
        className={baseClass}
        style={{
          ...baseStyle,
          left: isUltrawide
            ? "calc(50vw - 996px)"
            : "clamp(32px, calc(28.125vw - 440px), 280px)",
          // Offset this asset's transparent lower padding so the artwork
          // meets the footer edge.
          bottom: "max(-35px, calc(28px - 3.68vw))",
          backgroundImage: "url(/leaderboard/background-left.png)",
          backgroundPosition: "left bottom",
        }}
      />
      <div
        aria-hidden
        className={baseClass}
        style={{
          ...baseStyle,
          right: isUltrawide
            ? "calc(50vw - 996px)"
            : "clamp(32px, calc(28.125vw - 440px), 280px)",
          // The right asset ships slightly more transparent padding.
          bottom: "max(-49px, calc(28px - 4.52vw))",
          backgroundImage: "url(/leaderboard/background-right.png)",
          backgroundPosition: "right bottom",
        }}
      />
    </>
  );
}
