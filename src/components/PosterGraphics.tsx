import React from 'react';

interface PosterGraphicsProps {
  type: 'earth-melting' | 'clean-ocean' | 'sprout-hands' | 'wind-solar' | 'recycling-loop' | 'polar-bear';
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  className?: string;
}

export const PosterGraphics: React.FC<PosterGraphicsProps> = ({
  type,
  primaryColor = '#10B981',
  secondaryColor = '#065F46',
  accentColor = '#38BDF8',
  className = 'w-full h-full'
}) => {
  switch (type) {
    case 'earth-melting':
      return (
        <svg viewBox="0 0 400 400" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="heatGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.4" />
              <stop offset="70%" stopColor={primaryColor} stopOpacity="0.15" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="earthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="50%" stopColor="#0D9488" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="meltGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
          </defs>

          {/* Ambient Glow */}
          <circle cx="200" cy="190" r="160" fill="url(#heatGlow)" />

          {/* Earth Body */}
          <circle cx="200" cy="190" r="110" fill="url(#earthGrad)" stroke={primaryColor} strokeWidth="3" />

          {/* Continents */}
          <path
            d="M140 140 C160 120, 200 130, 210 150 C220 170, 190 190, 170 190 C150 190, 130 160, 140 140 Z"
            fill="#10B981"
            opacity="0.85"
          />
          <path
            d="M220 160 C250 150, 270 170, 260 200 C250 220, 230 230, 210 210 C200 190, 210 170, 220 160 Z"
            fill="#059669"
            opacity="0.9"
          />
          <path
            d="M160 220 C180 210, 200 230, 190 250 C180 260, 160 260, 150 240 Z"
            fill="#34D399"
            opacity="0.8"
          />

          {/* Melting Droplets Effect */}
          <path
            d="M120 230 C120 280, 140 310, 140 330 C140 340, 130 350, 120 350 C110 350, 100 340, 100 330 C100 300, 120 270, 120 230 Z"
            fill="url(#meltGrad)"
          />
          <path
            d="M200 280 C200 320, 215 340, 215 365 C215 375, 205 385, 195 385 C185 385, 175 375, 175 365 C175 330, 200 310, 200 280 Z"
            fill="url(#meltGrad)"
          />
          <path
            d="M270 240 C270 280, 285 305, 285 325 C285 335, 275 345, 265 345 C255 345, 245 335, 245 325 C245 295, 270 270, 270 240 Z"
            fill="url(#meltGrad)"
          />

          {/* Thermometer scale on side */}
          <rect x="330" y="80" width="14" height="150" rx="7" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
          <rect x="333" y="110" width="8" height="116" rx="4" fill="#EF4444" />
          <circle cx="337" cy="235" r="14" fill="#EF4444" stroke="#64748B" strokeWidth="2" />
          <line x1="324" y1="110" x2="330" y2="110" stroke="#EF4444" strokeWidth="2" />
          <text x="312" y="114" fill="#EF4444" fontSize="12" fontWeight="700" textAnchor="end">+1.5°C</text>
        </svg>
      );

    case 'clean-ocean':
      return (
        <svg viewBox="0 0 400 400" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="oceanSunRays" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.4" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="deepWater" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="50%" stopColor="#0369A1" />
              <stop offset="100%" stopColor="#082F49" />
            </linearGradient>
          </defs>

          {/* Water background */}
          <rect x="20" y="20" width="360" height="360" rx="24" fill="url(#deepWater)" />

          {/* Sunbeams underwater */}
          <polygon points="120,20 180,20 240,320 140,320" fill="url(#oceanSunRays)" />
          <polygon points="220,20 270,20 330,300 250,300" fill="url(#oceanSunRays)" />

          {/* Gentle Waves */}
          <path d="M20 70 Q 110 40, 200 70 T 380 70 L 380 380 L 20 380 Z" fill="#0C4A6E" opacity="0.3" />

          {/* Majestic Whale Silhouette */}
          <path
            d="M80 180 C120 140, 220 130, 280 160 C320 180, 340 190, 360 170 C355 195, 330 205, 300 200 C250 230, 180 230, 130 210 C100 210, 70 200, 80 180 Z"
            fill={primaryColor}
            stroke={accentColor}
            strokeWidth="2"
          />
          {/* Whale fin */}
          <path d="M190 200 C210 235, 230 240, 225 220 Z" fill={primaryColor} />

          {/* Coral & Seaweed at bottom */}
          <path d="M50 380 Q 70 300, 90 380 Q 110 320, 130 380" stroke="#10B981" strokeWidth="6" strokeLinecap="round" />
          <path d="M270 380 Q 290 290, 310 380 Q 330 310, 350 380" stroke="#059669" strokeWidth="6" strokeLinecap="round" />

          {/* Bioluminescent bubbles */}
          <circle cx="150" cy="120" r="8" fill={accentColor} opacity="0.6" />
          <circle cx="180" cy="90" r="5" fill={accentColor} opacity="0.8" />
          <circle cx="260" cy="110" r="10" fill={accentColor} opacity="0.5" />
          <circle cx="240" cy="250" r="6" fill="#FFFFFF" opacity="0.7" />
        </svg>
      );

    case 'sprout-hands':
      return (
        <svg viewBox="0 0 400 400" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="sproutGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Center Glow */}
          <circle cx="200" cy="180" r="130" fill="url(#sproutGlow)" />

          {/* Circular frame */}
          <circle cx="200" cy="200" r="150" stroke={primaryColor} strokeWidth="2" strokeDasharray="6 6" opacity="0.4" />

          {/* Sprout Stem */}
          <path d="M200 270 Q 195 200, 200 150" stroke={primaryColor} strokeWidth="8" strokeLinecap="round" />

          {/* Left Leaf */}
          <path
            d="M198 190 C150 180, 130 140, 160 120 C190 120, 200 160, 198 190 Z"
            fill={primaryColor}
            stroke={accentColor}
            strokeWidth="2"
          />

          {/* Right Leaf */}
          <path
            d="M202 165 C250 150, 270 110, 240 90 C210 90, 200 130, 202 165 Z"
            fill={accentColor}
            stroke={primaryColor}
            strokeWidth="2"
          />

          {/* Top Tender Bud */}
          <path
            d="M200 140 C190 120, 200 100, 200 90 C205 100, 215 120, 200 140 Z"
            fill="#FACC15"
          />

          {/* Stylized Caring Hands Cupping */}
          <path
            d="M90 280 C120 280, 160 300, 190 320 C170 335, 130 335, 80 305 Z"
            fill={secondaryColor}
            stroke={primaryColor}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M310 280 C280 280, 240 300, 210 320 C230 335, 270 335, 320 305 Z"
            fill={secondaryColor}
            stroke={primaryColor}
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Sparkling Stars */}
          <polygon points="200,60 203,72 215,75 203,78 200,90 197,78 185,75 197,72" fill="#FDE047" />
          <polygon points="120,100 122,108 130,110 122,112 120,120 118,112 110,110 118,108" fill="#FDE047" />
          <polygon points="280,100 282,108 290,110 282,112 280,120 278,112 270,110 278,108" fill="#FDE047" />
        </svg>
      );

    case 'wind-solar':
      return (
        <svg viewBox="0 0 400 400" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0369A1" />
              <stop offset="60%" stopColor="#0D9488" />
              <stop offset="100%" stopColor="#111827" />
            </linearGradient>
          </defs>

          {/* Backdrop */}
          <rect x="20" y="20" width="360" height="360" rx="20" fill="url(#skyGrad)" />

          {/* Radiant Sun */}
          <circle cx="310" cy="90" r="40" fill="#F59E0B" />
          <circle cx="310" cy="90" r="55" stroke="#FBBF24" strokeWidth="2" strokeDasharray="8 6" opacity="0.8" />

          {/* Rolling Hills */}
          <path d="M20 280 Q 140 230, 240 270 T 380 250 L 380 380 L 20 380 Z" fill="#047857" opacity="0.6" />
          <path d="M20 310 Q 160 270, 280 310 T 380 300 L 380 380 L 20 380 Z" fill="#065F46" />

          {/* Wind Turbine 1 (Center-Left) */}
          <line x1="160" y1="140" x2="160" y2="310" stroke="#F8FAFC" strokeWidth="5" strokeLinecap="round" />
          <circle cx="160" cy="140" r="7" fill="#CBD5E1" />
          <path d="M160 140 L 160 60 L 166 140 Z" fill="#F8FAFC" />
          <path d="M160 140 L 230 180 L 160 146 Z" fill="#F8FAFC" />
          <path d="M160 140 L 90 180 L 154 146 Z" fill="#F8FAFC" />

          {/* Wind Turbine 2 (Smaller Right) */}
          <line x1="260" y1="180" x2="260" y2="300" stroke="#F8FAFC" strokeWidth="4" strokeLinecap="round" />
          <circle cx="260" cy="180" r="5" fill="#CBD5E1" />
          <path d="M260 180 L 260 120 L 264 180 Z" fill="#F8FAFC" />
          <path d="M260 180 L 310 210 L 260 184 Z" fill="#F8FAFC" />
          <path d="M260 180 L 210 210 L 256 184 Z" fill="#F8FAFC" />

          {/* Solar Panel Grid Array (Foreground) */}
          <polygon points="70,330 180,330 160,370 40,370" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="2" />
          <line x1="125" y1="330" x2="100" y2="370" stroke="#38BDF8" strokeWidth="1.5" />
          <line x1="55" y1="350" x2="170" y2="350" stroke="#38BDF8" strokeWidth="1.5" />

          <polygon points="200,325 310,325 330,365 210,365" fill="#1E3A8A" stroke="#38BDF8" strokeWidth="2" />
          <line x1="255" y1="325" x2="270" y2="365" stroke="#38BDF8" strokeWidth="1.5" />
          <line x1="205" y1="345" x2="320" y2="345" stroke="#38BDF8" strokeWidth="1.5" />
        </svg>
      );

    case 'recycling-loop':
      return (
        <svg viewBox="0 0 400 400" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="loopGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={accentColor} />
            </linearGradient>
            <linearGradient id="loopGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={secondaryColor} />
              <stop offset="100%" stopColor={primaryColor} />
            </linearGradient>
          </defs>

          {/* Inner Circle Glow */}
          <circle cx="200" cy="200" r="140" fill="#064E3B" opacity="0.3" />

          {/* 3 Recycling Arrows */}
          <g transform="translate(200, 200)">
            {/* Arrow 1 (Top) */}
            <path
              d="M -60,-80 C -20,-120, 40,-120, 80,-80 L 100,-100 L 90,-40 L 30,-50 L 50,-70 C 20,-100, -20,-100, -50,-70 Z"
              fill="url(#loopGrad1)"
            />
            {/* Arrow 2 (Right-Bottom) */}
            <g transform="rotate(120)">
              <path
                d="M -60,-80 C -20,-120, 40,-120, 80,-80 L 100,-100 L 90,-40 L 30,-50 L 50,-70 C 20,-100, -20,-100, -50,-70 Z"
                fill="url(#loopGrad1)"
              />
            </g>
            {/* Arrow 3 (Left-Bottom) */}
            <g transform="rotate(240)">
              <path
                d="M -60,-80 C -20,-120, 40,-120, 80,-80 L 100,-100 L 90,-40 L 30,-50 L 50,-70 C 20,-100, -20,-100, -50,-70 Z"
                fill="url(#loopGrad1)"
              />
            </g>

            {/* Central Leaf Icon */}
            <circle cx="0" cy="0" r="45" fill="#0F172A" stroke={primaryColor} strokeWidth="3" />
            <path
              d="M -15,15 C -25,-5, -10,-25, 15,-20 C 25,0, 10,25, -15,15 Z"
              fill={primaryColor}
            />
            <path d="M -15,15 L 15,-20" stroke="#0F172A" strokeWidth="2" />
          </g>

          {/* Circular decorative dots */}
          <circle cx="80" cy="110" r="4" fill={accentColor} />
          <circle cx="320" cy="110" r="4" fill={accentColor} />
          <circle cx="200" cy="340" r="4" fill={accentColor} />
        </svg>
      );

    case 'polar-bear':
      return (
        <svg viewBox="0 0 400 400" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="aurora" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#818CF8" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="nightSky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0B132B" />
              <stop offset="100%" stopColor="#1C2541" />
            </linearGradient>
          </defs>

          {/* Sky background */}
          <rect x="20" y="20" width="360" height="360" rx="20" fill="url(#nightSky)" />

          {/* Aurora Borealis Curves */}
          <path d="M 20,80 Q 120,40, 200,90 T 380,60 L 380,140 Q 280,180, 200,120 T 20,150 Z" fill="url(#aurora)" />

          {/* Dark Cold Sea */}
          <rect x="20" y="240" width="360" height="140" fill="#0A192F" />

          {/* Small Melting Iceberg Floe */}
          <polygon points="120,240 280,240 250,290 140,290" fill="#E2E8F0" stroke="#38BDF8" strokeWidth="2" />
          <polygon points="140,290 250,290 230,340 160,340" fill="#0284C7" opacity="0.7" />

          {/* Polar Bear Silhouette on Ice Floe */}
          <path
            d="M 180,240 C 180,225, 175,220, 165,220 C 155,220, 150,230, 150,240 L 160,240 L 165,232 L 180,240 Z"
            fill="#FFFFFF"
          />
          {/* Bear Body */}
          <path
            d="M 165,222 C 175,205, 215,205, 230,220 C 235,225, 240,240, 240,240 L 225,240 L 222,230 L 200,230 L 195,240 Z"
            fill="#FFFFFF"
          />
          {/* Bear Head looking up */}
          <circle cx="160" cy="214" r="9" fill="#FFFFFF" />
          <circle cx="156" cy="213" r="1.5" fill="#0F172A" />
          <circle cx="152" cy="216" r="2" fill="#0F172A" />

          {/* Water reflection ripples */}
          <line x1="130" y1="260" x2="160" y2="260" stroke="#38BDF8" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
          <line x1="240" y1="265" x2="275" y2="265" stroke="#38BDF8" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
        </svg>
      );

    default:
      return null;
  }
};
