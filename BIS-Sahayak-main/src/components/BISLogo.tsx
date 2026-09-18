import React from "react";

interface BISLogoProps {
  compact?: boolean;
  className?: string;
}

export const BISLogo: React.FC<BISLogoProps> = ({
  compact = false,
  className = "",
}) => {
  return (
    <div
      className={`inline-flex items-center ${className}`}
      aria-label="BIS Sahayak"
    >
      <svg
        role="img"
        aria-labelledby="bis-logo-title bis-logo-description"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={compact ? "0 0 80 80" : "0 0 360 80"}
        className={compact ? "h-9 w-9" : "h-12 w-auto"}
        fill="none"
      >
        <title id="bis-logo-title">BIS Sahayak</title>

        <desc id="bis-logo-description">
          BIS Sahayak - Your Partner in Standards
        </desc>

        {compact ? (
          /* =====================================================
             COMPACT LOGO
             ===================================================== */
          <g>
            {/* Outer triangular mark */}
            <path
              d="
                M40 5
                L72 45
                C75 49
                72 55
                67 55
                H13
                C8 55
                5 49
                8 45
                Z
              "
              fill="#0B4F8A"
            />

            {/* Inner white triangle */}
            <path
              d="
                M40 17
                L57 42
                H23
                Z
              "
              fill="#FFFFFF"
            />

            {/* Red center */}
            <circle
              cx="40"
              cy="35"
              r="6"
              fill="#E53935"
            />

            {/* Main bottom line */}
            <rect
              x="8"
              y="58"
              width="64"
              height="5"
              rx="2.5"
              fill="#0B4F8A"
            />

            {/* Shorter bottom line */}
            <rect
              x="18"
              y="67"
              width="44"
              height="4"
              rx="2"
              fill="#0B4F8A"
            />
          </g>
        ) : (
          /* =====================================================
             FULL LOGO
             ===================================================== */
          <g>
            {/* =================================================
               OUTER BLUE TRIANGLE
               ================================================= */}
            <path
              d="
                M42 4
                L77 48
                C80.5 52.5
                77.2 58
                71.8 58
                H12.2
                C6.8 58
                3.5 52.5
                7 48
                Z
              "
              fill="#0B4F8A"
            />

            {/* =================================================
               INNER WHITE TRIANGLE
               ================================================= */}
            <path
              d="
                M42 17
                L61 45
                H23
                Z
              "
              fill="#FFFFFF"
            />

            {/* =================================================
               RED CENTER CIRCLE
               ================================================= */}
            <circle
              cx="42"
              cy="37"
              r="6"
              fill="#E53935"
            />

            {/* =================================================
               BOTTOM LINES
               ================================================= */}

            {/* Main line */}
            <rect
              x="7"
              y="61"
              width="70"
              height="5"
              rx="2.5"
              fill="#0B4F8A"
            />

            {/* Shorter second line */}
            <rect
              x="19"
              y="70"
              width="46"
              height="4"
              rx="2"
              fill="#0B4F8A"
            />

            {/* =================================================
               BIS SAHAYAK
               ================================================= */}
            <text
              x="96"
              y="38"
              fill="#10233F"
              fontFamily="Inter, Arial, sans-serif"
              fontSize="20"
              fontWeight="700"
              letterSpacing="-0.5"
            >
              BIS Sahayak
            </text>

            {/* =================================================
               TAGLINE
               ================================================= */}
            <text
              x="97"
              y="57"
              fill="#64748B"
              fontFamily="Inter, Arial, sans-serif"
              fontSize="9"
              fontWeight="500"
            >
              Your Partner in Standards
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default BISLogo;
