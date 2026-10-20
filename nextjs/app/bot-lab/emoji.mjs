// A few Slack :shortcodes: as characters, for the chat's speaker label. Unknown codes show as the code itself.
const EMOJI = {
  scroll: "📜", zombie: "🧟", robot_face: "🤖", ghost: "👻", books: "📚", book: "📖", brain: "🧠", speech_balloon: "💬", owl: "🦉",
  rose: "🌹", skull: "💀", performing_arts: "🎭", fire: "🔥", snowflake: "❄️", sparkles: "✨", wolf: "🐺", cat: "🐱", dog: "🐶",
  frog: "🐸", crown: "👑", mag: "🔍", pencil2: "✏️", lower_left_fountain_pen: "🖋️", telescope: "🔭", microscope: "🔬",
  test_tube: "🧪", alien: "👽", dragon: "🐉", unicorn_face: "🦄", octopus: "🐙", whale: "🐳", ship: "🚢", anchor: "⚓",
  crescent_moon: "🌙", star: "⭐", rainbow: "🌈", coffee: "☕", tea: "🍵", wine_glass: "🍷", apple: "🍎", cherry_blossom: "🌸",
  maple_leaf: "🍁", mushroom: "🍄", evergreen_tree: "🌲", hourglass: "⌛", key: "🔑", lock: "🔒", bell: "🔔", newspaper: "📰",
  bulb: "💡", gear: "⚙️", crossed_swords: "⚔️", shield: "🛡️", violin: "🎻", guitar: "🎸", musical_note: "🎵", art: "🎨",
  camera: "📷", movie_camera: "🎥", clapper: "🎬", microphone: "🎤", trophy: "🏆", game_die: "🎲", jack_o_lantern: "🎃",
  bat: "🦇", spider: "🕷️", candle: "🕯️", ocean: "🌊", volcano: "🌋", castle: "🏰", classical_building: "🏛️", eyes: "👀",
  heart: "❤️", broken_heart: "💔", thinking_face: "🤔", nerd_face: "🤓", face_with_monocle: "🧐", mage: "🧙", vampire: "🧛",
  fairy: "🧚", genie: "🧞", elf: "🧝", detective: "🕵️", older_man: "👴", older_woman: "👵", female_scientist: "👩‍🔬", male_scientist: "👨‍🔬",
  female_teacher: "👩‍🏫", male_teacher: "👨‍🏫", writing_hand: "✍️", leaves: "🍃", seedling: "🌱", mountain: "⛰️", house: "🏠", bust_in_silhouette: "👤",
};

export function emojiCharacter(shortcode = "") {
  const m = String(shortcode).match(/^:([a-z0-9_+'-]+):$/);
  return m ? EMOJI[m[1]] ?? shortcode : "";
}
