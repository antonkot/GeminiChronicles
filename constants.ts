import { GameGenre } from './types';

export const SUPPORTED_LANGUAGES = [
  { code: 'English', label: 'English', flag: '🇬🇧' },
  { code: 'Spanish', label: 'Español', flag: '🇪🇸' },
  { code: 'French', label: 'Français', flag: '🇫🇷' },
  { code: 'German', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'Japanese', label: '日本語', flag: '🇯🇵' },
  { code: 'Korean', label: '한국어', flag: '🇰🇷' },
  { code: 'Portuguese', label: 'Português', flag: '🇧🇷' },
  { code: 'Russian', label: 'Русский', flag: '🇷🇺' },
];

export const MOOD_TRACKS: Record<string, string> = {
  // Royalty-free tracks (Credit: Pixabay / various artists)
  epic: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
  mysterious: 'https://cdn.pixabay.com/audio/2021/11/24/audio_c9b4a45052.mp3',
  ominous: 'https://cdn.pixabay.com/audio/2021/08/09/audio_289454173d.mp3',
  melancholic: 'https://cdn.pixabay.com/audio/2021/09/06/audio_9c0b1e4c70.mp3',
  cybernetic: 'https://cdn.pixabay.com/audio/2022/03/10/audio_51a37c377f.mp3',
  peaceful: 'https://cdn.pixabay.com/audio/2022/10/25/audio_5d7790b832.mp3',
  action: 'https://cdn.pixabay.com/audio/2022/03/24/audio_078e353273.mp3',
};

export const TRANSLATIONS: Record<string, any> = {
  English: {
    steps: {
      lang: { title: "Select Language", sub: "Choose the language for your story" },
      identity: { title: "Identity", sub: "Who will you become?" },
      world: { title: "World Setting", sub: "Where does your journey begin?" },
      character: { title: "Character Details", sub: "Define your abilities" }
    },
    ui: {
      nameLbl: "What is your name, traveler?",
      namePl: "Enter character name...",
      confirmBtn: "Confirm Identity",
      genreLbl: "Genre Setting",
      roleLbl: "Background Role",
      traitLbl: "Key Trait",
      startBtn: "Generate Adventure",
      backBtn: "Back",
      step: "Step",
      of: "of",
      loading: "Dreaming the next chapter..."
    },
    genres: {
      [GameGenre.FANTASY]: "Swords, sorcery, and ancient dragons.",
      [GameGenre.SCIFI]: "Space exploration, aliens, and high-tech warfare.",
      [GameGenre.CYBERPUNK]: "High tech, low life, neon lights and mega-corps.",
      [GameGenre.NOIR]: "Shadowy streets, jazz, and unsolved mysteries.",
      [GameGenre.PIRATE]: "High seas adventure, treasure, and naval battles.",
      [GameGenre.POST_APOCALYPTIC]: "Survival in a wasteland after the fall of civilization.",
      [GameGenre.ELDRIITCH]: "Madness, cosmic entities, and the unknown.",
    },
    roles: ["Mercenary", "Scholar", "Thief", "Noble", "Engineer", "Medic", "Captain", "Outcast"],
    traits: ["Charismatic", "Strong", "Intelligent", "Stealthy", "Lucky", "Cursed", "Tech-savvy"]
  },
  Spanish: {
    steps: {
      lang: { title: "Seleccionar Idioma", sub: "Elige el idioma de tu historia" },
      identity: { title: "Identidad", sub: "¿Quién serás?" },
      world: { title: "Escenario", sub: "¿Dónde comienza tu viaje?" },
      character: { title: "Detalles del Personaje", sub: "Define tus habilidades" }
    },
    ui: {
      nameLbl: "¿Cuál es tu nombre, viajero?",
      namePl: "Ingresa nombre del personaje...",
      confirmBtn: "Confirmar Identidad",
      genreLbl: "Género",
      roleLbl: "Rol de Fondo",
      traitLbl: "Rasgo Clave",
      startBtn: "Generar Aventura",
      backBtn: "Atrás",
      step: "Paso",
      of: "de",
      loading: "Soñando el siguiente capítulo..."
    },
    genres: {
      [GameGenre.FANTASY]: "Espadas, hechicería y dragones antiguos.",
      [GameGenre.SCIFI]: "Exploración espacial, alienígenas y guerra tecnológica.",
      [GameGenre.CYBERPUNK]: "Alta tecnología, baja calidad de vida y luces de neón.",
      [GameGenre.NOIR]: "Calles sombrías, jazz y misterios sin resolver.",
      [GameGenre.PIRATE]: "Aventura en alta mar, tesoros y batallas navales.",
      [GameGenre.POST_APOCALYPTIC]: "Supervivencia en un páramo tras la caída de la civilización.",
      [GameGenre.ELDRIITCH]: "Locura, entidades cósmicas y lo desconocido.",
    },
    roles: ["Mercenario", "Erudito", "Ladrón", "Noble", "Ingeniero", "Médico", "Capitán", "Marginado"],
    traits: ["Carismático", "Fuerte", "Inteligente", "Sigiloso", "Afortunado", "Maldito", "Tecnológico"]
  },
  French: {
    steps: {
      lang: { title: "Choisir la Langue", sub: "Choisissez la langue de votre histoire" },
      identity: { title: "Identité", sub: "Qui deviendrez-vous ?" },
      world: { title: "Cadre du Monde", sub: "Où commence votre voyage ?" },
      character: { title: "Détails du Personnage", sub: "Définissez vos capacités" }
    },
    ui: {
      nameLbl: "Quel est votre nom, voyageur ?",
      namePl: "Entrez le nom du personnage...",
      confirmBtn: "Confirmer l'Identité",
      genreLbl: "Genre",
      roleLbl: "Rôle d'Arrière-plan",
      traitLbl: "Trait Principal",
      startBtn: "Générer l'Aventure",
      backBtn: "Retour",
      step: "Étape",
      of: "sur",
      loading: "Rêver le prochain chapitre..."
    },
    genres: {
      [GameGenre.FANTASY]: "Épées, sorcellerie et dragons anciens.",
      [GameGenre.SCIFI]: "Exploration spatiale, extraterrestres et guerre high-tech.",
      [GameGenre.CYBERPUNK]: "Haute technologie, bas-fonds et néons.",
      [GameGenre.NOIR]: "Rues sombres, jazz et mystères non résolus.",
      [GameGenre.PIRATE]: "Aventure en haute mer, trésors et batailles navales.",
      [GameGenre.POST_APOCALYPTIC]: "Survie dans un désert après la chute de la civilisation.",
      [GameGenre.ELDRIITCH]: "Folie, entités cosmiques et l'inconnu.",
    },
    roles: ["Mercenaire", "Érudit", "Voleur", "Noble", "Ingénieur", "Médecin", "Capitaine", "Banni"],
    traits: ["Charismatique", "Fort", "Intelligent", "Furtif", "Chanceux", "Maudit", "Doué en technologie"]
  },
  German: {
    steps: {
      lang: { title: "Sprache Wählen", sub: "Wählen Sie die Sprache Ihrer Geschichte" },
      identity: { title: "Identität", sub: "Wer wirst du werden?" },
      world: { title: "Welteneinstellung", sub: "Wo beginnt deine Reise?" },
      character: { title: "Charakterdetails", sub: "Definiere deine Fähigkeiten" }
    },
    ui: {
      nameLbl: "Wie ist dein Name, Reisender?",
      namePl: "Charakternamen eingeben...",
      confirmBtn: "Identität Bestätigen",
      genreLbl: "Genre",
      roleLbl: "Hintergrundrolle",
      traitLbl: "Hauptmerkmal",
      startBtn: "Abenteuer Generieren",
      backBtn: "Zurück",
      step: "Schritt",
      of: "von",
      loading: "Das nächste Kapitel träumen..."
    },
    genres: {
      [GameGenre.FANTASY]: "Schwerter, Zauberei und alte Drachen.",
      [GameGenre.SCIFI]: "Weltraumforschung, Aliens und High-Tech-Krieg.",
      [GameGenre.CYBERPUNK]: "High-Tech, Low-Life, Neonlichter und Megakonzerne.",
      [GameGenre.NOIR]: "Schattenhafte Straßen, Jazz und ungelöste Rätsel.",
      [GameGenre.PIRATE]: "Hochseeabenteuer, Schätze und Seeschlachten.",
      [GameGenre.POST_APOCALYPTIC]: "Überleben im Ödland nach dem Fall der Zivilisation.",
      [GameGenre.ELDRIITCH]: "Wahnsinn, kosmische Wesen und das Unbekannte.",
    },
    roles: ["Söldner", "Gelehrter", "Dieb", "Adliger", "Ingenieur", "Sanitäter", "Kapitän", "Außenseiter"],
    traits: ["Charismatisch", "Stark", "Intelligent", "Heimlich", "Glücklich", "Verflucht", "Technikaffin"]
  },
  Japanese: {
    steps: {
      lang: { title: "言語の選択", sub: "物語の言語を選択してください" },
      identity: { title: "アイデンティティ", sub: "あなたは誰になりますか？" },
      world: { title: "世界設定", sub: "旅はどこから始まりますか？" },
      character: { title: "キャラクター詳細", sub: "能力を定義してください" }
    },
    ui: {
      nameLbl: "旅人よ、あなたの名前は？",
      namePl: "キャラクター名を入力...",
      confirmBtn: "アイデンティティを確認",
      genreLbl: "ジャンル",
      roleLbl: "役割",
      traitLbl: "特徴",
      startBtn: "冒険を生成",
      backBtn: "戻る",
      step: "ステップ",
      of: "/",
      loading: "次の章を夢見ています..."
    },
    genres: {
      [GameGenre.FANTASY]: "剣、魔法、そして古代のドラゴン。",
      [GameGenre.SCIFI]: "宇宙探査、エイリアン、ハイテク戦争。",
      [GameGenre.CYBERPUNK]: "ハイテク、ローライフ、ネオンライト。",
      [GameGenre.NOIR]: "影のある通り、ジャズ、未解決の謎。",
      [GameGenre.PIRATE]: "公海での冒険、宝物、海戦。",
      [GameGenre.POST_APOCALYPTIC]: "文明崩壊後の荒野での生存。",
      [GameGenre.ELDRIITCH]: "狂気、宇宙的実体、そして未知。",
    },
    roles: ["傭兵", "学者", "盗賊", "貴族", "エンジニア", "衛生兵", "船長", "追放者"],
    traits: ["カリスマ", "強い", "知的", "隠密", "幸運", "呪われた", "技術に精通"]
  },
  Korean: {
    steps: {
      lang: { title: "언어 선택", sub: "스토리 언어를 선택하세요" },
      identity: { title: "신원", sub: "당신은 누구입니까?" },
      world: { title: "세계 설정", sub: "여행은 어디서 시작됩니까?" },
      character: { title: "캐릭터 세부 정보", sub: "능력을 정의하세요" }
    },
    ui: {
      nameLbl: "여행자여, 당신의 이름은 무엇입니까?",
      namePl: "캐릭터 이름 입력...",
      confirmBtn: "신원 확인",
      genreLbl: "장르",
      roleLbl: "역할",
      traitLbl: "특성",
      startBtn: "모험 생성",
      backBtn: "뒤로",
      step: "단계",
      of: "/",
      loading: "다음 챕터를 구상 중..."
    },
    genres: {
      [GameGenre.FANTASY]: "검, 마법, 그리고 고대 용.",
      [GameGenre.SCIFI]: "우주 탐사, 외계인, 첨단 전쟁.",
      [GameGenre.CYBERPUNK]: "하이테크, 네온사인, 거대 기업.",
      [GameGenre.NOIR]: "어두운 거리, 재즈, 미해결 사건.",
      [GameGenre.PIRATE]: "공해 모험, 보물, 해전.",
      [GameGenre.POST_APOCALYPTIC]: "문명 붕괴 후 황무지에서의 생존.",
      [GameGenre.ELDRIITCH]: "광기, 우주적 존재, 미지의 것.",
    },
    roles: ["용병", "학자", "도둑", "귀족", "엔지니어", "의무병", "선장", "추방자"],
    traits: ["카리스마", "강인함", "지능적", "은밀함", "행운", "저주받음", "기술적"]
  },
  Portuguese: {
    steps: {
      lang: { title: "Selecionar Idioma", sub: "Escolha o idioma da sua história" },
      identity: { title: "Identidade", sub: "Quem você se tornará?" },
      world: { title: "Cenário do Mundo", sub: "Onde começa sua jornada?" },
      character: { title: "Detalhes do Personagem", sub: "Defina suas habilidades" }
    },
    ui: {
      nameLbl: "Qual é o seu nome, viajante?",
      namePl: "Digite o nome do personagem...",
      confirmBtn: "Confirmar Identidade",
      genreLbl: "Gênero",
      roleLbl: "Papel de Fundo",
      traitLbl: "Traço Principal",
      startBtn: "Gerar Aventura",
      backBtn: "Voltar",
      step: "Passo",
      of: "de",
      loading: "Sonhando o próximo capítulo..."
    },
    genres: {
      [GameGenre.FANTASY]: "Espadas, feitiçaria e dragões antigos.",
      [GameGenre.SCIFI]: "Exploração espacial, alienígenas e guerra tecnológica.",
      [GameGenre.CYBERPUNK]: "Alta tecnologia, vida marginal e luzes neon.",
      [GameGenre.NOIR]: "Ruas sombrias, jazz e mistérios não resolvidos.",
      [GameGenre.PIRATE]: "Aventura en alto mar, tesouros e batalhas navais.",
      [GameGenre.POST_APOCALYPTIC]: "Sobrevivência em um terreno baldio após a queda da civilização.",
      [GameGenre.ELDRIITCH]: "Loucura, entidades cósmicas e o desconhecido.",
    },
    roles: ["Mercenário", "Erudito", "Ladrão", "Nobre", "Engenheiro", "Médico", "Capitão", "Exilado"],
    traits: ["Carismático", "Forte", "Inteligente", "Furtivo", "Sortudo", "Amaldiçoado", "Tecnológico"]
  },
  Russian: {
    steps: {
      lang: { title: "Выберите Язык", sub: "Выберите язык вашей истории" },
      identity: { title: "Личность", sub: "Кем вы станете?" },
      world: { title: "Настройка Мира", sub: "Где начнется ваше путешествие?" },
      character: { title: "Детали Персонажа", sub: "Определите свои способности" }
    },
    ui: {
      nameLbl: "Как ваше имя, путник?",
      namePl: "Введите имя персонажа...",
      confirmBtn: "Подтвердить Личность",
      genreLbl: "Жанр",
      roleLbl: "Роль",
      traitLbl: "Ключевая Черта",
      startBtn: "Создать Приключение",
      backBtn: "Назад",
      step: "Шаг",
      of: "из",
      loading: "Создание следующей главы..."
    },
    genres: {
      [GameGenre.FANTASY]: "Мечи, магия и древние драконы.",
      [GameGenre.SCIFI]: "Исследование космоса, пришельцы и высокотехнологичные войны.",
      [GameGenre.CYBERPUNK]: "Высокие технологии, трущобы и неоновые огни.",
      [GameGenre.NOIR]: "Теннистые улицы, джаз и нераскрытые тайны.",
      [GameGenre.PIRATE]: "Приключения в открытом море, сокровища и морские сражения.",
      [GameGenre.POST_APOCALYPTIC]: "Выживание в пустоши после падения цивилизации.",
      [GameGenre.ELDRIITCH]: "Безумие, космические сущности и неизведанное.",
    },
    roles: ["Наемник", "Ученый", "Вор", "Дворянин", "Инженер", "Медик", "Капитан", "Изгой"],
    traits: ["Харизматичный", "Сильный", "Умный", "Скрытный", "Удачливый", "Проклятый", "Технически подкованный"]
  }
};

// Fallbacks for type safety, though logic should prefer TRANSLATIONS[lang]
export const GENRE_DESCRIPTIONS: Record<GameGenre, string> = TRANSLATIONS['English'].genres;
export const INITIAL_ROLES = TRANSLATIONS['English'].roles;
export const INITIAL_TRAITS = TRANSLATIONS['English'].traits;