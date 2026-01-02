export interface ThemeConfig {
  id: string;
  name: string;
  icon: string;
  // Background gradients
  background: string;
  backgroundImage?: string; // URL to background image
  backgroundOverlay?: string; // Overlay gradient over image
  customizable?: boolean; // Allow user to upload custom background
  // Typography
  fontFamily?: string; // Custom font family
  // Card/Container styles
  cardBg: string;
  cardBorder: string;
  cardShape: string; // rounded classes
  // Button styles
  buttonBg: string;
  buttonHover: string;
  buttonShape: string;
  buttonText?: string; // text color for buttons
  // Progress bar
  progressBg: string;
  progressFill: string;
  // Text colors
  primaryText: string;
  secondaryText: string;
  // Correct/Wrong feedback
  correctColor: string;
  wrongColor: string;
  // Special elements (shapes, decorations)
  decorativeShapes: string[];
  // Answer option styles
  optionBg: string;
  optionBorder: string;
  optionHoverBg: string;
  optionShape: string;
  optionText?: string;
}

export const themes: Record<string, ThemeConfig> = {
  default: {
    id: "default",
    name: "Default",
    icon: "🎨",
    background: "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500",
    backgroundImage:
      "https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80",
    backgroundOverlay:
      "bg-gradient-to-br from-blue-500/80 via-purple-500/80 to-pink-500/80",
    customizable: true,
    fontFamily: "font-sans",
    cardBg: "bg-white/95 backdrop-blur-sm",
    cardBorder: "border-none",
    cardShape: "rounded-3xl",
    buttonBg: "bg-gradient-to-r from-blue-500 to-purple-600",
    buttonHover: "hover:from-blue-600 hover:to-purple-700",
    buttonShape: "rounded-xl",
    buttonText: "text-white",
    progressBg: "bg-white/30",
    progressFill: "bg-gradient-to-r from-green-400 to-green-600",
    primaryText: "text-gray-900",
    secondaryText: "text-gray-600",
    correctColor: "bg-green-500",
    wrongColor: "bg-red-500",
    decorativeShapes: [],
    optionBg: "bg-gray-100",
    optionBorder: "border-2 border-gray-200",
    optionHoverBg: "hover:bg-gray-200",
    optionShape: "rounded-2xl",
    optionText: "text-gray-900",
  },

  classroom: {
    id: "classroom",
    name: "Classroom",
    icon: "📚",
    background: "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900",
    backgroundImage:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&q=80",
    backgroundOverlay: "bg-slate-900/70",
    fontFamily: "font-['Comic_Neue']",
    cardBg:
      "bg-slate-800/95 backdrop-blur-md shadow-2xl border-8 border-amber-900 relative",
    cardBorder: "border-[8px] border-amber-800/80 shadow-inner",
    cardShape: "rounded-lg",
    buttonBg: "bg-gradient-to-r from-amber-600 to-amber-700 shadow-xl",
    buttonHover:
      "hover:from-amber-700 hover:to-amber-800 hover:shadow-2xl hover:scale-105",
    buttonShape: "rounded-lg",
    buttonText: "text-white font-bold",
    progressBg: "bg-slate-700/80",
    progressFill: "bg-gradient-to-r from-yellow-400 to-amber-500",
    primaryText:
      "text-yellow-50 font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]",
    secondaryText: "text-yellow-100/90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]",
    correctColor: "bg-gradient-to-r from-green-600 to-emerald-600",
    wrongColor: "bg-gradient-to-r from-red-600 to-rose-600",
    decorativeShapes: ["📏", "✏️", "📐", "📖", "🎓", "📝", "🍎", "⭐"],
    optionBg: "bg-slate-700/90 backdrop-blur-sm shadow-lg",
    optionBorder: "border-4 border-amber-700/60 shadow-inner",
    optionHoverBg:
      "hover:bg-slate-600/90 hover:border-amber-600 hover:shadow-xl hover:scale-105",
    optionShape: "rounded-lg",
    optionText:
      "text-yellow-50 font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]",
  },

  garden: {
    id: "garden",
    name: "Garden",
    icon: "🌸",
    background: "bg-gradient-to-br from-green-200 via-emerald-100 to-teal-100",
    backgroundImage:
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1920&q=80",
    backgroundOverlay: "bg-green-900/20",
    fontFamily: "font-['Fredoka']",
    cardBg: "bg-white/90 backdrop-blur-md shadow-2xl",
    cardBorder: "border-[4px] border-green-400",
    cardShape: "rounded-3xl",
    buttonBg: "bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg",
    buttonHover: "hover:from-green-600 hover:to-emerald-700",
    buttonShape: "rounded-full",
    buttonText: "text-white font-semibold",
    progressBg: "bg-green-200",
    progressFill: "bg-gradient-to-r from-green-500 to-emerald-600",
    primaryText: "text-green-900",
    secondaryText: "text-green-700",
    correctColor: "bg-emerald-500",
    wrongColor: "bg-rose-500",
    decorativeShapes: ["🌻", "🌺", "🦋", "🌿", "🌷"],
    optionBg: "bg-green-50/80 backdrop-blur-sm",
    optionBorder: "border-2 border-green-300",
    optionHoverBg: "hover:bg-green-100/90",
    optionShape: "rounded-2xl",
    optionText: "text-green-900",
  },

  ocean: {
    id: "ocean",
    name: "Ocean",
    icon: "🌊",
    background: "bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600",
    backgroundImage:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80",
    backgroundOverlay: "bg-blue-900/30",
    fontFamily: "font-['Comic_Neue']",
    cardBg: "bg-cyan-50/90 backdrop-blur-lg shadow-2xl",
    cardBorder: "border-[4px] border-blue-400",
    cardShape: "rounded-[2rem]",
    buttonBg: "bg-gradient-to-br from-blue-500 to-cyan-600 shadow-xl",
    buttonHover: "hover:from-blue-600 hover:to-cyan-700",
    buttonShape: "rounded-full",
    buttonText: "text-white font-bold",
    progressBg: "bg-cyan-200",
    progressFill: "bg-gradient-to-r from-blue-500 to-cyan-600",
    primaryText: "text-blue-900 font-bold",
    secondaryText: "text-blue-700",
    correctColor: "bg-teal-500",
    wrongColor: "bg-orange-500",
    decorativeShapes: ["🐠", "🐟", "🐡", "🦈", "🐙", "⭐"],
    optionBg: "bg-cyan-100/70 backdrop-blur-md",
    optionBorder: "border-[3px] border-blue-400",
    optionHoverBg: "hover:bg-cyan-200/80",
    optionShape: "rounded-3xl",
    optionText: "text-blue-900 font-semibold",
  },

  space: {
    id: "space",
    name: "Space",
    icon: "🚀",
    background: "bg-gradient-to-br from-indigo-900 via-purple-900 to-black",
    backgroundImage:
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80",
    backgroundOverlay: "bg-indigo-950/50",
    fontFamily: "font-['Orbitron']",
    cardBg:
      "bg-slate-800/90 backdrop-blur-xl shadow-2xl border-2 border-purple-500/50",
    cardBorder: "border-[3px] border-purple-500",
    cardShape: "rounded-2xl",
    buttonBg:
      "bg-gradient-to-r from-purple-600 to-pink-600 shadow-xl shadow-purple-500/50",
    buttonHover: "hover:from-purple-700 hover:to-pink-700",
    buttonShape: "rounded-xl",
    buttonText: "text-white font-bold",
    progressBg: "bg-slate-700",
    progressFill: "bg-gradient-to-r from-purple-500 to-pink-500",
    primaryText: "text-white font-bold",
    secondaryText: "text-purple-200",
    correctColor: "bg-cyan-500",
    wrongColor: "bg-red-500",
    decorativeShapes: ["🌟", "✨", "⭐", "🌙", "🪐", "🛸"],
    optionBg: "bg-slate-700/80 backdrop-blur-md",
    optionBorder: "border-2 border-purple-400",
    optionHoverBg: "hover:bg-slate-600/90",
    optionShape: "rounded-xl",
    optionText: "text-purple-100 font-semibold",
  },

  forest: {
    id: "forest",
    name: "Forest",
    icon: "🌲",
    background: "bg-gradient-to-br from-green-300 via-emerald-200 to-teal-200",
    backgroundImage:
      "https://images.unsplash.com/photo-1511497584788-876760111969?w=1920&q=80",
    backgroundOverlay: "bg-green-950/40",
    fontFamily: "font-['Merriweather']",
    cardBg: "bg-amber-50/95 backdrop-blur-lg shadow-2xl",
    cardBorder: "border-[5px] border-amber-700",
    cardShape: "rounded-2xl",
    buttonBg: "bg-gradient-to-br from-amber-700 to-orange-800 shadow-lg",
    buttonHover: "hover:from-amber-800 hover:to-orange-900",
    buttonShape: "rounded-lg",
    buttonText: "text-white font-bold",
    progressBg: "bg-amber-200",
    progressFill: "bg-gradient-to-r from-amber-700 to-orange-700",
    primaryText: "text-amber-900 font-bold",
    secondaryText: "text-amber-800",
    correctColor: "bg-green-600",
    wrongColor: "bg-red-600",
    decorativeShapes: ["🍂", "🍁", "🌳", "🦌", "🦊", "🦉"],
    optionBg: "bg-amber-100/85 backdrop-blur-sm",
    optionBorder: "border-[3px] border-amber-600",
    optionHoverBg: "hover:bg-amber-200/90",
    optionShape: "rounded-xl",
    optionText: "text-amber-900 font-semibold",
  },
};

export const getTheme = (themeId: string): ThemeConfig => {
  return themes[themeId] || themes.default;
};
