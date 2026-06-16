export type MetodoPreparacion = {
  temperatura: string;
  tiempo: string;
  descripcion: string;
};

export type CategoriaKey =
  | "expectorantes"
  | "ciclo-menstrual"
  | "antiinflamatorias"
  | "cicatrizantes"
  | "sistema-nervioso"
  | "inmunidad-antimicrobianas"
  | "digestivas"
  | "piel-cosmetica";

export type Planta = {
  slug: string;
  nombre: string;
  nombreCientifico: string;
  familia: string;
  descripcionBreve: string;
  descripcionCompleta: string;
  propiedades: string[];
  usosMedicinales: string[];
  usosCosmeticos: string[];
  preparacion: Partial<Record<"infusion" | "decoccion" | "maceracion" | "tintura", MetodoPreparacion>>;
  contraindicaciones: string[];
  categorias: CategoriaKey[];
};

export type Categoria = {
  key: CategoriaKey;
  label: string;
  descripcion: string;
};

export const categorias: Categoria[] = [
  {
    key: "expectorantes",
    label: "Expectorantes y respiratorio",
    descripcion: "Plantas que facilitan la expectoración, alivian bronquios y vías respiratorias. Se preparan principalmente en decocciones e infusiones que se inhalan o se toman calientes.",
  },
  {
    key: "ciclo-menstrual",
    label: "Ciclo menstrual y salud femenina",
    descripcion: "Plantas emenágogas y reguladoras del ciclo. Actúan sobre la musculatura uterina, el equilibrio hormonal y los dolores asociados al ciclo.",
  },
  {
    key: "antiinflamatorias",
    label: "Antiinflamatorias",
    descripcion: "Plantas con compuestos que inhiben mediadores proinflamatorios como prostaglandinas y citocinas. Útiles tanto en uso interno como tópico.",
  },
  {
    key: "cicatrizantes",
    label: "Cicatrizantes y reparadoras",
    descripcion: "Plantas que aceleran la regeneración tisular, favorecen la hemostasia y reducen la formación de queloides. Fundamentales en formulación cosmética reparadora.",
  },
  {
    key: "sistema-nervioso",
    label: "Sistema nervioso y estrés",
    descripcion: "Plantas adaptógenas, sedantes suaves y ansiolíticas. Actúan sobre el eje HPA y la transmisión GABAérgica sin producir dependencia en dosis terapéuticas.",
  },
  {
    key: "inmunidad-antimicrobianas",
    label: "Inmunidad y antimicrobianas",
    descripcion: "Plantas con actividad inmunomoduladora, antimicrobiana y antiviral. Contienen polifenoles, taninos y compuestos azufrados que alteran membranas bacterianas.",
  },
  {
    key: "digestivas",
    label: "Digestivas",
    descripcion: "Plantas carminativas, colagogas y procinéticas que regulan el tránsito intestinal, alivian espasmos y protegen la mucosa gastroduodenal.",
  },
  {
    key: "piel-cosmetica",
    label: "Piel y cosmética",
    descripcion: "Plantas con principios activos compatibles con formulación cosmética: antioxidantes, emolientes, astringentes, despigmentantes y estimulantes de colágeno.",
  },
];

export const plantas: Planta[] = [
  {
    slug: "matico",
    nombre: "Matico",
    nombreCientifico: "Piper aduncum",
    familia: "Piperaceae",
    descripcionBreve: "Arbusto andino con poderosa acción cicatrizante y antimicrobiana. Referente de la medicina tradicional del sur.",
    descripcionCompleta: "El matico es un arbusto de los Andes tropicales y subtropicales, ampliamente usado en la medicina tradicional andina desde tiempos precolombinos. Sus hojas contienen flavonoides, aceites esenciales (principalmente safrol y asarona), taninos y compuestos fenólicos que explican su potente actividad cicatrizante, antiinflamatoria y antimicrobiana. La combinación de astringencia tánica con acción antiinflamatoria flavonoídica lo convierte en uno de los activos más versátiles de la farmacopea vegetal andina.",
    propiedades: ["cicatrizante", "antiinflamatorio", "antimicrobiano"],
    usosMedicinales: [
      "Cicatrización de heridas cutáneas, úlceras y abrasiones",
      "Tratamiento tópico de infecciones dérmicas menores",
      "Antiinflamatorio en afecciones articulares externas",
      "Antiséptico en lesiones de mucosa oral",
      "Compresa en contusiones y hematomas superficiales",
    ],
    usosCosmeticos: [
      "Tónico reparador para pieles agredidas post-tratamiento",
      "Activo en sérum cicatrizante para cicatrices y estrías",
      "Calmante en formulaciones para pieles reactivas o atópicas",
      "Extracto en cremas de regeneración celular",
      "Agua floral maticada para tónicos astringentes",
    ],
    preparacion: {
      infusion: {
        temperatura: "90 °C",
        tiempo: "10 min",
        descripcion: "Añadir 2 g de hojas secas por cada 200 ml de agua. Tapar y reposar. Usar como compresa fría en heridas o como tónico tópico. No hervir: el calor excesivo volatiliza los aceites esenciales activos.",
      },
      decoccion: {
        temperatura: "100 °C",
        tiempo: "15 min",
        descripcion: "Hervir hojas en agua durante 15 minutos. Mayor extracción de taninos. Ideal para baños de zona en heridas, hemorroides o afecciones vulvovaginales. Enfriar antes de aplicar.",
      },
      maceracion: {
        temperatura: "Ambiente (18–22 °C)",
        tiempo: "3–4 semanas",
        descripcion: "Macerar hojas frescas o secas en aceite de jojoba o de almendras dulces. Relación 1:5 (planta:aceite). Proteger de la luz. Filtrar con tela fina. Usar directamente como aceite reparador o como base de ungüento.",
      },
      tintura: {
        temperatura: "Ambiente",
        tiempo: "3–4 semanas",
        descripcion: "1 parte de hojas secas por 5 partes de alcohol etílico 70°. Macerar en frasco oscuro. Agitar cada 2 días. Filtrar con papel. Conservar en ámbar a temperatura baja. Diluir al 10% en agua para uso tópico.",
      },
    },
    contraindicaciones: [
      "Evitar uso interno durante el embarazo por posible efecto emenagogo",
      "Puede causar sensibilización en pieles muy sensibles — realizar prueba de parche",
      "No usar en heridas profundas o punzantes sin supervisión médica",
      "Interacción posible con anticoagulantes — consultar profesional",
    ],
    categorias: ["cicatrizantes", "antiinflamatorias", "inmunidad-antimicrobianas", "piel-cosmetica"],
  },
  {
    slug: "pitra",
    nombre: "Pitra",
    nombreCientifico: "Myrceugenia exsucca",
    familia: "Myrtaceae",
    descripcionBreve: "Árbol nativo del sur de Chile con potente acción astringente, antioxidante y hepatoprotectora.",
    descripcionCompleta: "La pitra es un árbol endémico de los bosques valdiviano y patagónico chileno. Crece en suelos húmedos y riberas. Su corteza y hojas contienen taninos condensados de alta densidad, flavonoides (quercetina, miricetina) y polifenoles de actividad antioxidante comparable a extractos de té verde. Culturalmente usada por el pueblo mapuche para tratar afecciones hepáticas y como astringente en diarreas agudas.",
    propiedades: ["astringente", "antioxidante", "hepatoprotector"],
    usosMedicinales: [
      "Tratamiento de diarrea aguda y gastroenteritis",
      "Afecciones hepáticas leves como hepatoprotector",
      "Uso tópico en heridas húmedas y eccemas exudativos",
      "Gárgaras en faringitis y aftas orales",
    ],
    usosCosmeticos: [
      "Tónico astringente para pieles grasas y poros dilatados",
      "Activo antioxidante en sérum anti-aging",
      "Agua de corteza en preparaciones para pieles acneicas",
      "Extracto en contornos de ojos por su acción vasoconstrictora suave",
    ],
    preparacion: {
      decoccion: {
        temperatura: "100 °C",
        tiempo: "20 min",
        descripcion: "Hervir 5 g de corteza seca fragmentada en 300 ml de agua. Mayor extracción de taninos condensados de la corteza. Colar y usar tibio. Para uso interno (diarrea): tomar 2 tazas al día máximo 3 días.",
      },
      infusion: {
        temperatura: "85 °C",
        tiempo: "12 min",
        descripcion: "Usar hojas secas (2 g/200 ml). Temperatura moderada para preservar flavonoides sensibles al calor. Ideal para uso tópico como compresa astringente en eccemas.",
      },
      tintura: {
        temperatura: "Ambiente",
        tiempo: "4 semanas",
        descripcion: "Corteza triturada en alcohol 70° (1:5). Maceración prolongada para extraer taninos. Filtrar por prensado. Diluir al 5–10% en formulaciones cosméticas como activo astringente.",
      },
    },
    contraindicaciones: [
      "No usar internamente por más de una semana continua por concentración de taninos",
      "Puede interferir con la absorción de hierro y otros minerales",
      "Evitar en estreñimiento crónico",
      "Precaución en personas con úlcera gástrica activa",
    ],
    categorias: ["antiinflamatorias", "piel-cosmetica", "digestivas"],
  },
  {
    slug: "arrayan",
    nombre: "Arrayán",
    nombreCientifico: "Luma apiculata",
    familia: "Myrtaceae",
    descripcionBreve: "Árbol emblemático del bosque templado lluvioso. Antiséptico, digestivo y aromaterapéutico por excelencia.",
    descripcionCompleta: "El arrayán es uno de los árboles más característicos del bosque templado lluvioso del sur de Chile y Argentina. Su corteza rojiza y sus pequeñas hojas aromáticas contienen aceites esenciales ricos en eucaliptol, linalol y α-pineno, además de flavonoides y taninos. Forma bosques puros llamados 'arrayalares' en las orillas de lagos y ríos. Su fragancia característica lo ha hecho parte del paisaje cultural valdiviano.",
    propiedades: ["antiséptico", "digestivo", "antifúngico"],
    usosMedicinales: [
      "Antiséptico en infecciones urinarias leves",
      "Digestivo en dispepsias y flatulencias",
      "Antifúngico tópico en micosis superficiales",
      "Inhalación en afecciones respiratorias y sinusitis",
    ],
    usosCosmeticos: [
      "Aceite esencial en formulaciones antisépticas y desodorantes",
      "Extracto en jabones antibacterianos artesanales",
      "Agua floral de hojas en tónicos para pieles mixtas",
      "Activo aromaterapéutico en cremas relajantes",
    ],
    preparacion: {
      infusion: {
        temperatura: "90 °C",
        tiempo: "8 min",
        descripcion: "2 g de hojas frescas o secas en 200 ml de agua. No sobrepasar temperatura para preservar aceites esenciales. Tapar durante la infusión. Tomar 2 tazas/día para problemas digestivos.",
      },
      decoccion: {
        temperatura: "100 °C",
        tiempo: "10 min",
        descripcion: "Corteza fragmentada (3 g/200 ml). Hervir 10 minutos. Para uso tópico en micosis: baño de pies o compresas en la zona afectada. Enfriar antes de aplicar.",
      },
      maceracion: {
        temperatura: "Ambiente",
        tiempo: "2 semanas",
        descripcion: "Hojas frescas en aceite de coco o argán (1:4). 2 semanas en frasco oscuro. Filtrar. El aceite resultante contiene aceites esenciales aromáticos útiles en formulación cosmética.",
      },
    },
    contraindicaciones: [
      "Evitar aceite esencial puro sobre piel sin diluir (puede causar irritación)",
      "Precaución en niños menores de 6 años con aceites esenciales",
      "No usar internamente en cantidades elevadas — puede irritar la mucosa renal",
    ],
    categorias: ["digestivas", "inmunidad-antimicrobianas", "piel-cosmetica", "expectorantes"],
  },
  {
    slug: "maqui",
    nombre: "Maqui",
    nombreCientifico: "Aristotelia chilensis",
    familia: "Elaeocarpaceae",
    descripcionBreve: "La superfruta del mundo. Concentración de antocianinas sin par en el reino vegetal.",
    descripcionCompleta: "El maqui es un arbusto nativo de los bosques templados del sur de Chile y Argentina. Sus frutos violeta-negro poseen la mayor concentración de antocianinas registrada en cualquier fruta conocida — principalmente delfinidinas. Estas antocianinas no solo son potentes antioxidantes sino que modulan la respuesta inflamatoria a nivel molecular, inhiben la glicación proteica y tienen demostrado efecto fotoprotector.",
    propiedades: ["antioxidante", "antiinflamatorio", "inmunoestimulante"],
    usosMedicinales: [
      "Protección contra estrés oxidativo sistémico",
      "Apoyo en procesos inflamatorios crónicos",
      "Estimulación del sistema inmune",
      "Regulación del azúcar sanguíneo post-prandial",
    ],
    usosCosmeticos: [
      "Activo anti-aging en sérum por su acción sobre oxidación celular",
      "Extracto en cremas fotoprotectoras naturales",
      "Pigmento natural en cosmética color",
      "Inhibidor de glicación en formulaciones anti-manchas",
      "Activo en contorno de ojos por su acción microcirculatoria",
    ],
    preparacion: {
      infusion: {
        temperatura: "75 °C",
        tiempo: "8 min",
        descripcion: "Frutos secos o frescos (5 g/200 ml). Temperatura baja para preservar antocianinas termolábiles. Tapar. Tomar 1–2 tazas al día. El fruto fresco es preferible al seco para mayor actividad antioxidante.",
      },
      maceracion: {
        temperatura: "Frío (4–8 °C)",
        tiempo: "24–48 h",
        descripcion: "Maceración acuosa en frío: frutos aplastados en agua destilada fría durante 24-48 h en refrigeración. Preserva máxima concentración de antocianinas. Para uso cosmético, incorporar como fase acuosa en emulsiones.",
      },
      tintura: {
        temperatura: "Ambiente",
        tiempo: "2 semanas",
        descripcion: "Frutos en alcohol glicerinado (60% etanol / 10% glicerina / 30% agua). La glicerina estabiliza los pigmentos antociánicos. Filtrar. Conservar a 4 °C. Usar al 5–15% en formulaciones cosméticas.",
      },
    },
    contraindicaciones: [
      "Puede potenciar efecto de anticoagulantes — consultar médico",
      "Efecto hipoglucemiante: precaución en diabéticos con medicación",
      "Los pigmentos tiñen piel y superficies — tomar precauciones",
    ],
    categorias: ["antiinflamatorias", "inmunidad-antimicrobianas", "piel-cosmetica"],
  },
  {
    slug: "triwe",
    nombre: "Triwe",
    nombreCientifico: "Laureliopsis philippiana",
    familia: "Atherospermataceae",
    descripcionBreve: "El árbol sagrado del bosque valdiviano. Sedante, aromático y guardián del sistema nervioso.",
    descripcionCompleta: "El triwe —nombre mapuche para el tepa— es un árbol endémico de los bosques valdivianos de Chile y Argentina. Alcanza los 30 metros de altura y puede vivir cientos de años. Sus hojas contienen alcaloides isoquinolínicos (laurelina), aceites esenciales con linalol y terpenoides de acción sedante-ansiolítica. Para el pueblo mapuche es un árbol medicinal y espiritual de primer orden. Su aroma es intensamente fragante y reconocible en el bosque húmedo.",
    propiedades: ["sedante", "antiespasmódico", "aromático"],
    usosMedicinales: [
      "Ansiedad leve y estados de nerviosismo",
      "Insomnio de inicio por sobreactivación nerviosa",
      "Cólicos intestinales y espasmos digestivos",
      "Dolores de cabeza tensionales",
    ],
    usosCosmeticos: [
      "Aceite esencial en aromaterapia de relajación",
      "Extracto en cremas de masaje anticontractura",
      "Activo sedante en formulaciones para pieles reactivas por estrés",
      "Agua floral en brumas corporales relajantes",
    ],
    preparacion: {
      infusion: {
        temperatura: "85 °C",
        tiempo: "10 min",
        descripcion: "Hojas jóvenes (1–2 g/200 ml). Temperatura moderada para preservar alcaloides y aceites. Tomar 1 taza antes de dormir para insomnio, o 2–3 veces al día para ansiedad. La sobredosis puede causar somnolencia excesiva.",
      },
      maceracion: {
        temperatura: "Ambiente",
        tiempo: "2–3 semanas",
        descripcion: "Hojas en aceite de argán o de jojoba. Para uso en masaje relajante. El aceite resultante capta bien los compuestos lipofílicos aromáticos. Aplicar con técnica de effleurage en zona cervical.",
      },
    },
    contraindicaciones: [
      "No combinar con fármacos ansiolíticos o sedantes sin supervisión",
      "Evitar durante el embarazo — posible efecto sobre útero",
      "No usar antes de conducir o manejar maquinaria pesada",
      "Uso prolongado puede generar tolerancia — ciclar el consumo",
    ],
    categorias: ["sistema-nervioso", "digestivas", "expectorantes"],
  },
  {
    slug: "chilco",
    nombre: "Chilco",
    nombreCientifico: "Fuchsia magellanica",
    familia: "Onagraceae",
    descripcionBreve: "La flor colgante del sur del mundo. Astringente, cicatrizante y de profunda identidad andino-patagónica.",
    descripcionCompleta: "El chilco o fucsia silvestre es un arbusto nativo de los bosques andino-patagónicos que crece desde el centro-sur de Chile hasta Tierra del Fuego. Reconocible por sus flores bicolores colgantes, contiene en hojas y tallos taninos hidrolizables, flavonoides (quercetina, kaempferol) y antocianinas en los frutos. Resistente a condiciones extremas de viento y lluvia, ha desarrollado mecanismos de protección celular que se traducen en principios activos de interés cosmético.",
    propiedades: ["astringente", "cicatrizante", "antiinflamatorio"],
    usosMedicinales: [
      "Heridas superficiales y abrasiones con sangrado leve",
      "Gastritis y diarrea por su acción astringente",
      "Hemostático tópico en cortes superficiales",
      "Uso tópico en hemorroides externas",
    ],
    usosCosmeticos: [
      "Tónico astringente para pieles con poros dilatados",
      "Activo en fórmulas post-depilación calmantes",
      "Extracto en contorno de ojos por su acción sobre microcirculación",
      "Ingrediente en mascarillas peel-off por sus taninos",
    ],
    preparacion: {
      decoccion: {
        temperatura: "100 °C",
        tiempo: "15 min",
        descripcion: "Hojas y tallos frescos o secos (3 g/200 ml). Hervir 15 minutos para máxima extracción de taninos. Enfriar. Para uso tópico: compresas frías en heridas y hemorroides. Para uso interno: máximo 3 tazas al día.",
      },
      infusion: {
        temperatura: "88 °C",
        tiempo: "10 min",
        descripcion: "Solo con hojas (2 g/200 ml). Más suave que la decocción. Usada en gárgaras para faringitis o bebida para diarrea leve. Los frutos maduros pueden añadirse como fuente de antocianinas.",
      },
      tintura: {
        temperatura: "Ambiente",
        tiempo: "3 semanas",
        descripcion: "Hojas en alcohol 70° (1:5). Filtrar por prensado. Al 3–8% en tónicos faciales astringentes. Excelente estabilizador de emulsiones O/W por su contenido tánico.",
      },
    },
    contraindicaciones: [
      "Uso interno prolongado puede causar estreñimiento por exceso de taninos",
      "Evitar en personas con tendencia a estreñimiento crónico",
      "Posible interferencia con absorción de fármacos — tomar con 2 h de diferencia",
    ],
    categorias: ["cicatrizantes", "antiinflamatorias", "piel-cosmetica"],
  },
  {
    slug: "milenrama",
    nombre: "Milenrama",
    nombreCientifico: "Achillea millefolium",
    familia: "Asteraceae",
    descripcionBreve: "La hierba de los guerreros. Hemostática, emenagoga y cicatrizante de uso milenario en todas las tradiciones del mundo.",
    descripcionCompleta: "La milenrama es una de las plantas medicinales más universales de la historia. Su nombre científico evoca a Aquiles, quien según la mitología la usó para curar heridas de batalla. Presente en zonas templadas de todo el hemisferio norte y ampliamente naturalizada en el sur de Chile y Argentina. Sus cabezuelas florales contienen aceites esenciales con azuleno (antiinflamatorio potente), flavonoides, alcaloides (achileína, estaquidrina) y taninos con efecto hemostático documentado.",
    propiedades: ["hemostático", "emenagogo", "cicatrizante"],
    usosMedicinales: [
      "Hemostático en heridas con sangrado superficial activo",
      "Regulación del ciclo menstrual irregular",
      "Dismenorrea y cólicos menstruales",
      "Antiinflamatorio sistémico en fiebre y estados gripales",
      "Digestivo amargo y colerético",
    ],
    usosCosmeticos: [
      "Activo antiinflamatorio en formulaciones para pieles sensibles",
      "Extracto en cremas cicatrizantes post-acné",
      "Tónico floral para pieles con rosácea o eritema facial",
      "Activo en mascarillas para pieles grasas por su acción sebostática",
      "Agua de milenrama como bruma facial calmante",
    ],
    preparacion: {
      infusion: {
        temperatura: "90 °C",
        tiempo: "10 min",
        descripcion: "2 g de flores y hojas secas en 200 ml de agua. Tapar. La infusión libera azuleno de las flores azules. Para ciclo menstrual: 1–2 tazas al día en los 5 días previos. Para heridas: compresa fría directa.",
      },
      decoccion: {
        temperatura: "100 °C",
        tiempo: "12 min",
        descripcion: "Para uso tópico intensivo: hervir 5 g en 300 ml. Enfriar completamente. Usar como lavado hemostático en heridas o como baño de zona en menorragia.",
      },
      tintura: {
        temperatura: "Ambiente",
        tiempo: "4 semanas",
        descripcion: "Flores en alcohol 60° (1:5). La tintura concentra alcaloides y flavonoides. Al 5% en tónicos faciales. Al 10–15% en formulaciones hemostáticas o antiinflamatorias tópicas.",
      },
      maceracion: {
        temperatura: "Ambiente con calor solar (método solar)",
        tiempo: "4–6 semanas",
        descripcion: "Flores frescas en aceite de oliva o girasol por el método tradicional solar. El calor suave extrae el azuleno lipofílico que da el aceite un tono levemente azulado. Cicatrizante y calmante directo sobre la piel.",
      },
    },
    contraindicaciones: [
      "Contraindicada en embarazo por su acción emenagoga",
      "Puede causar dermatitis de contacto en personas sensibles a Asteráceas",
      "Evitar con anticoagulantes — efecto hemostático puede interaccionar",
      "No usar flores silvestres sin identificación segura — posible confusión con plantas tóxicas",
    ],
    categorias: ["cicatrizantes", "ciclo-menstrual", "antiinflamatorias", "piel-cosmetica"],
  },
];

export function getPlanta(slug: string): Planta | undefined {
  return plantas.find((p) => p.slug === slug);
}

export function getPlantasByCategoria(key: CategoriaKey): Planta[] {
  return plantas.filter((p) => p.categorias.includes(key));
}
