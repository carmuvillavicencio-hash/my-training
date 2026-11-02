// Biblioteca precargada y figuras vectoriales de My Training.
export const GROUPS = {
  'Tren inferior': ['Cuádriceps', 'Isquiotibiales', 'Glúteos', 'Aductores', 'Abductores', 'Gemelos y sóleo', 'Tibial anterior', 'Pie y tobillo'],
  'Core': ['Abdomen', 'Oblicuos', 'Zona lumbar'],
  'Tren superior': ['Espalda', 'Pecho', 'Hombros', 'Bíceps', 'Tríceps'],
  'Otros': ['Movilidad', 'Estabilidad', 'Equilibrio', 'Propiocepción'],
};
export const groupOf = m => Object.keys(GROUPS).find(g => GROUPS[g].includes(m)) || 'Otros';
export const TYPES = ['Máquina', 'Peso libre', 'Barra', 'Mancuernas', 'Banda', 'Peso corporal', 'Movilidad', 'Runner', 'Rehab y prevención'];

const M = 'Máquina', B = 'Barra', D = 'Mancuernas', F = 'Peso libre', E = 'Banda', C = 'Peso corporal', V = 'Movilidad', R = 'Runner', H = 'Rehab y prevención';
const Q = 'Cuádriceps', I = 'Isquiotibiales', G = 'Glúteos', AD = 'Aductores', AB = 'Abductores', GS = 'Gemelos y sóleo', T = 'Tibial anterior', P = 'Pie y tobillo';
const A = 'Abdomen', O = 'Oblicuos', L = 'Zona lumbar', ES = 'Espalda', PE = 'Pecho', HO = 'Hombros', BI = 'Bíceps', TR = 'Tríceps';
const MO = 'Movilidad', ST = 'Estabilidad', EQ = 'Equilibrio', PR = 'Propiocepción';

// [nombre, músculo principal, secundarios, equipamiento, tipos, descripción, pose, equipo dibujado]
const RAW = [
  // Cuádriceps
  ['Sentadilla con barra', Q, [G, I, A], 'Barra y rack', [B, F], 'Con la barra sobre los trapecios, bajá hasta que los muslos queden paralelos al piso y subí empujando con todo el pie.', 'squat', 'barBack'],
  ['Sentadilla frontal', Q, [G, A], 'Barra y rack', [B, F], 'Con la barra apoyada adelante sobre los hombros y el torso erguido, bajá controlando y subí sin inclinarte.', 'squat', 'barFront'],
  ['Sentadilla goblet', Q, [G, A], 'Mancuerna o pesa rusa', [D, F, R], 'Sostené el peso contra el pecho, bajá con los codos entre las rodillas y subí manteniendo el pecho alto.', 'squat', 'dbFront'],
  ['Sentadilla búlgara', Q, [G, I, ST], 'Mancuernas y banco', [D, F, R], 'Con el pie de atrás sobre un banco, bajá hasta que la rodilla trasera casi toque el piso y subí con la pierna de adelante.', 'bulgarian', 'dbHand'],
  ['Sentadilla búlgara sin peso', Q, [G, ST], 'Banco', [C, R], 'Con el pie de atrás sobre un banco, bajá despacio y subí empujando con la pierna de adelante.', 'bulgarian', ''],
  ['Sentadilla al cajón', Q, [G], 'Cajón', [C, H], 'Bajá hasta rozar el cajón con la cola y subí sin desarmar la postura.', 'squatBox', ''],
  ['Sentadilla libre', Q, [G, A], 'Sin equipamiento', [C], 'Con los pies al ancho de hombros, bajá flexionando cadera y rodillas y subí empujando con todo el pie.', 'squat', ''],
  ['Sentadilla a una pierna (pistol asistida)', Q, [G, EQ], 'Soporte o TRX', [C, R], 'Tomate de un soporte, bajá con una sola pierna hasta donde controles y subí sin que la rodilla se vaya hacia adentro.', 'pistol', ''],
  ['Prensa de piernas', Q, [G, I], 'Máquina de prensa', [M], 'Empujá la plataforma con todo el pie sin trabar las rodillas y volvé despacio.', 'legpress', ''],
  ['Prensa a una pierna', Q, [G, ST], 'Máquina de prensa', [M, R], 'Empujá con una sola pierna, alineando la rodilla con el pie, y volvé controlando.', 'legpress', ''],
  ['Hack squat', Q, [G], 'Máquina hack', [M], 'Con la espalda apoyada en el respaldo, bajá controlando y subí empujando con toda la planta.', 'hack', ''],
  ['Extensión de cuádriceps', Q, [], 'Máquina de extensión', [M], 'Sentada, extendé las rodillas hasta arriba, sostené un instante y bajá lento.', 'legext', ''],
  ['Extensión de cuádriceps a una pierna', Q, [], 'Máquina de extensión', [M, H], 'Extendé una pierna por vez con carga liviana, sostené arriba y bajá lento.', 'legext', ''],
  ['Estocada caminando', Q, [G, I, ST], 'Mancuernas', [D, F, R], 'Dá un paso largo, bajá hasta casi tocar el piso con la rodilla de atrás y avanzá con la otra pierna.', 'lunge', 'dbHand'],
  ['Estocada hacia atrás', Q, [G, I], 'Mancuernas', [D, F, R], 'Dá un paso hacia atrás, bajá con el torso erguido y volvé empujando con la pierna de adelante.', 'lunge', 'dbHand'],
  ['Estocada con barra', Q, [G, I], 'Barra', [B, F], 'Con la barra sobre la espalda, da un paso adelante, bajá controlando y volvé al inicio.', 'lunge', 'barBack2'],
  ['Subida al cajón', Q, [G, ST], 'Cajón y mancuernas', [D, F, R], 'Subí apoyando todo el pie sobre el cajón, sin impulsarte con la pierna de abajo, y bajá lento.', 'stepup', 'dbHand'],
  ['Bajada lenta de escalón', Q, [G, ST], 'Escalón', [C, R, H], 'Parada en un escalón, bajá el otro talón en 3 a 5 segundos sin que la rodilla se vaya hacia adentro.', 'stepdown', ''],
  ['Sentadilla isométrica contra la pared', Q, [G], 'Pared', [C, R, H], 'Con la espalda en la pared y las rodillas flexionadas, sostené la posición el tiempo previsto.', 'wallsit', ''],
  ['Sentadilla española con banda', Q, [G], 'Banda elástica', [E, H, R], 'Con una banda fija detrás de las rodillas, sentate hacia atrás con las tibias verticales y volvé a subir.', 'squat', 'band'],
  // Isquiotibiales
  ['Peso muerto rumano con barra', I, [G, L], 'Barra', [B, F, R], 'Con rodillas apenas flexionadas, llevá la cadera hacia atrás bajando la barra pegada a las piernas y volvé a subir.', 'hinge', 'barLow'],
  ['Peso muerto rumano con mancuernas', I, [G, L], 'Mancuernas', [D, F, R], 'Llevá la cadera hacia atrás con la espalda neutra hasta sentir tensión atrás de las piernas y volvé.', 'hinge', 'dbHand'],
  ['Peso muerto a una pierna', I, [G, EQ, L], 'Mancuerna', [D, F, R], 'Parada en una pierna, inclinate llevando la otra hacia atrás hasta formar una línea y volvé sin rotar la cadera.', 'rdlOne', 'dbHand'],
  ['Curl femoral acostada', I, [GS], 'Máquina de curl femoral', [M], 'Boca abajo, llevá los talones hacia la cola sin levantar la cadera y bajá lento.', 'legcurlLying', ''],
  ['Curl femoral sentada', I, [GS], 'Máquina de curl femoral', [M], 'Sentada, flexioná las rodillas empujando el rodillo hacia abajo y volvé controlando.', 'legcurl', ''],
  ['Curl nórdico', I, [G], 'Soporte para los tobillos', [C, R, H], 'De rodillas con los tobillos fijos, dejate caer hacia adelante lo más lento posible y volvé con ayuda de las manos.', 'nordic', ''],
  ['Curl femoral con fitball', I, [G, L], 'Fitball', [C, R], 'Boca arriba con los talones en la pelota, elevá la cadera y acercá la pelota flexionando las rodillas.', 'bridge', 'ball'],
  ['Curl femoral con banda', I, [], 'Banda elástica', [E, H], 'Boca abajo con la banda en el tobillo, llevá el talón hacia la cola y volvé lento.', 'legcurlLying', 'band'],
  ['Puente de isquios con talones', I, [G], 'Sin equipamiento', [C, H, R], 'Boca arriba con los talones lejos de la cola, elevá la cadera y sostené sin arquear la espalda.', 'bridge', ''],
  ['Buenos días con barra', I, [G, L], 'Barra', [B, F], 'Con la barra en la espalda, inclinate llevando la cadera atrás con la espalda neutra y volvé.', 'hinge', 'barBack3'],
  // Glúteos
  ['Hip thrust con barra', G, [I, A], 'Barra y banco', [B, F], 'Con la espalda alta en el banco, elevá la cadera hasta alinearla con el torso, apretá y bajá lento.', 'hipthrust', 'barHip'],
  ['Hip thrust en máquina', G, [I], 'Máquina de hip thrust', [M], 'Con la almohadilla sobre la cadera, empujá hacia arriba, sostené un segundo y bajá lento.', 'hipthrust', ''],
  ['Puente de glúteos', G, [I, A], 'Sin equipamiento', [C, H, R], 'Boca arriba con rodillas flexionadas, elevá la cadera apretando los glúteos y bajá lento.', 'bridge', ''],
  ['Puente de glúteos a una pierna', G, [I, ST], 'Sin equipamiento', [C, H, R], 'Con una pierna extendida en el aire, elevá la cadera sin que se incline hacia un costado.', 'bridgeOne', ''],
  ['Patada de glúteo en polea', G, [I], 'Polea', [M, H], 'Con la tobillera en la polea, llevá la pierna hacia atrás sin arquear la zona lumbar.', 'kickback', 'cable'],
  ['Patada de glúteo en máquina', G, [I], 'Máquina de glúteos', [M], 'Empujá la plataforma hacia atrás con el talón, apretá arriba y volvé controlando.', 'kickback', ''],
  ['Peso muerto convencional', G, [I, L, ES], 'Barra', [B, F], 'Con la barra sobre el empeine, levantala pegada al cuerpo extendiendo cadera y rodillas a la vez.', 'deadlift', 'barLow'],
  ['Peso muerto sumo', G, [AD, I, L], 'Barra', [B, F], 'Con los pies abiertos y las manos por dentro de las piernas, subí la barra extendiendo cadera y rodillas.', 'deadlift', 'barLow'],
  ['Swing con pesa rusa', G, [I, L, A], 'Pesa rusa', [F, R], 'Llevá la pesa entre las piernas con la cadera hacia atrás y proyectala al frente con un golpe de cadera.', 'swing', 'kbHand'],
  ['Extensión de cadera en cuadrupedia', G, [AB], 'Sin equipamiento', [C, H], 'En cuatro apoyos, elevá la pierna flexionada hacia atrás y arriba sin mover la zona lumbar.', 'birddogLeg', ''],
  // Aductores
  ['Máquina de aductores', AD, [], 'Máquina de aductores', [M], 'Sentada, cerrá las piernas contra las almohadillas y abrí despacio.', 'seatFront', 'padsIn'],
  ['Plancha de Copenhague', AD, [O, ST], 'Banco', [C, R, H], 'De costado, con la pierna de arriba sobre un banco, elevá la cadera y sostené.', 'copenhagen', ''],
  ['Aducción en polea', AD, [ST], 'Polea', [M, H], 'De costado a la polea, llevá la pierna hacia adentro cruzando la línea media y volvé lento.', 'sideLeg', 'cable'],
  ['Aducción con banda', AD, [ST], 'Banda elástica', [E, H, R], 'Con la banda en el tobillo y fijada a un costado, llevá la pierna hacia adentro y volvé controlando.', 'sideLeg', 'band'],
  ['Compresión de pelota entre rodillas', AD, [A], 'Pelota', [C, H], 'Boca arriba con una pelota entre las rodillas, apretá unos segundos y soltá.', 'bridgeRest', 'ballKnee'],
  ['Sentadilla sumo', AD, [Q, G], 'Mancuerna', [D, F], 'Con los pies bien abiertos y las puntas hacia afuera, bajá con el peso colgando entre las piernas.', 'sumo', 'dbFrontLow'],
  ['Estocada lateral', AD, [Q, G], 'Mancuerna o sin peso', [D, F, R, C], 'Dá un paso amplio al costado, llevá la cadera atrás sobre esa pierna y volvé al centro.', 'sidelunge', ''],
  // Abductores
  ['Máquina de abductores', AB, [G], 'Máquina de abductores', [M], 'Sentada, abrí las piernas contra las almohadillas y cerrá despacio.', 'seatFront', 'padsOut'],
  ['Caminata lateral con banda', AB, [G, ST], 'Mini banda', [E, R, H], 'Con la banda sobre las rodillas o tobillos y semiflexión, da pasos cortos al costado sin juntar los pies.', 'sumoSmall', 'bandKnee'],
  ['Clamshell con banda', AB, [G], 'Mini banda', [E, R, H], 'De costado con las rodillas flexionadas, abrí la rodilla de arriba sin mover la cadera.', 'clam', 'bandKneeLying'],
  ['Elevación lateral de pierna acostada', AB, [G], 'Sin equipamiento', [C, R, H], 'De costado con las piernas extendidas, subí la de arriba con el pie neutro y bajá lento.', 'sideLying', ''],
  ['Abducción de cadera en polea', AB, [G], 'Polea', [M, H], 'Con la tobillera en la pierna lejana a la polea, llevala hacia afuera sin inclinar el torso.', 'sideLeg', 'cable'],
  ['Abducción de pie con banda', AB, [G, ST], 'Mini banda', [E, R, H], 'Parada sobre una pierna, llevá la otra al costado contra la banda sin inclinar el torso.', 'sideLeg', 'bandKnee'],
  ['Hip hike en escalón', AB, [G, ST], 'Escalón', [C, R, H], 'Parada de costado en un escalón, bajá y subí la cadera libre sin flexionar la rodilla de apoyo.', 'stepdown', ''],
  ['Fire hydrant', AB, [G], 'Sin equipamiento', [C, H], 'En cuatro apoyos, abrí la rodilla hacia el costado sin rotar el torso y volvé.', 'birddogLeg', ''],
  // Gemelos
  ['Elevación de talones de pie en máquina', GS, [P], 'Máquina de gemelos', [M], 'Con la almohadilla en los hombros, subí a puntas de pie lo más alto posible y bajá hasta estirar.', 'calf', 'machineShoulder'],
  ['Elevación de talones sentada', GS, [P], 'Máquina de sóleo', [M, R], 'Sentada con rodillas a 90°, subí los talones y bajá controlando para trabajar el sóleo.', 'seatedCalf', ''],
  ['Elevación de talones a una pierna', GS, [P, EQ], 'Escalón', [C, R, H], 'En una pierna al borde del escalón, subí a punta de pie y bajá lento.', 'calf', 'step'],
  ['Elevación de talones con mancuernas', GS, [P], 'Mancuernas', [D, F, R], 'Con una mancuerna en cada mano, subí a puntas de pie y bajá controlando.', 'calf', 'dbHand'],
  ['Elevación de talones en prensa', GS, [], 'Máquina de prensa', [M], 'Con las puntas en el borde de la plataforma, empujá con los tobillos y volvé a estirar.', 'legpress', ''],
  ['Excéntrico de gemelos en escalón', GS, [P], 'Escalón', [C, R, H], 'Subí con las dos piernas y bajá en 3 a 5 segundos con una sola, con la rodilla extendida.', 'calf', 'step'],
  ['Excéntrico de sóleo con rodilla flexionada', GS, [P], 'Escalón', [C, R, H], 'Con la rodilla apenas flexionada, bajá el talón lento desde el borde del escalón.', 'calf', 'step'],
  ['Saltos de tobillo (pogos)', GS, [P, PR], 'Sin equipamiento', [C, R], 'Da saltos cortos y rápidos con las rodillas casi rígidas, rebotando en la parte delantera del pie.', 'pogo', ''],
  // Tibial
  ['Elevación de puntas contra la pared', T, [P], 'Pared', [C, R, H], 'Con la espalda en la pared y los talones adelante, subí las puntas de los pies y bajá lento.', 'tibial', ''],
  ['Dorsiflexión con banda', T, [P], 'Banda elástica', [E, R, H], 'Sentada con la pierna extendida y la banda en el empeine, llevá la punta hacia vos y volvé lento.', 'ankleSit', 'band'],
  ['Elevación de tibial con peso', T, [], 'Máquina tibial o disco', [F, M, R], 'Con la carga sobre el empeine, subí la punta del pie al máximo y bajá controlando.', 'ankleSit', 'plateFoot'],
  ['Caminata sobre talones', T, [P], 'Sin equipamiento', [C, R, H], 'Caminá apoyando solo los talones, con las puntas de los pies bien arriba.', 'tibialWalk', ''],
  // Pie y tobillo
  ['Short foot (arco activo)', P, [ST], 'Sin equipamiento', [C, R, H], 'Con el pie apoyado, acercá la base del dedo gordo al talón elevando el arco sin encoger los dedos.', 'foot', ''],
  ['Agarre de toalla con los dedos', P, [], 'Toalla', [C, R, H], 'Sentada, arrastrá una toalla hacia vos flexionando los dedos del pie.', 'foot', 'towel'],
  ['Elevación de talón con pelota', P, [GS], 'Pelota chica', [C, R, H], 'Con una pelota entre los talones, subí a puntas de pie sin que los tobillos se abran.', 'calf', 'ballAnkle'],
  ['Inversión de tobillo con banda', P, [T], 'Banda elástica', [E, R, H], 'Sentada, con la banda desde afuera, llevá la planta del pie hacia adentro y volvé lento.', 'ankleSit', 'band'],
  ['Eversión de tobillo con banda', P, [GS], 'Banda elástica', [E, R, H], 'Sentada, con la banda desde adentro, llevá el borde externo del pie hacia afuera y volvé lento.', 'ankleSit', 'band'],
  ['Círculos de tobillo', P, [MO], 'Sin equipamiento', [V, R, H], 'Con el pie en el aire, dibujá círculos lentos y amplios en ambos sentidos.', 'foot', 'circle'],
  ['Masaje de planta con pelota', P, [MO], 'Pelota chica', [V, R, H], 'Hacé rodar una pelota bajo la planta del pie con presión tolerable.', 'foot', 'ballFoot'],
  // Abdomen
  ['Plancha frontal', A, [HO, G, ST], 'Sin equipamiento', [C, R, H], 'Apoyada en antebrazos y puntas de pie, formá una línea recta y sostené sin dejar caer la cadera.', 'plank', ''],
  ['Dead bug', A, [L, ST], 'Sin equipamiento', [C, R, H], 'Boca arriba, extendé el brazo y la pierna opuestos sin despegar la zona lumbar del piso.', 'deadbug', ''],
  ['Crunch abdominal', A, [], 'Colchoneta', [C], 'Boca arriba con rodillas flexionadas, despegá los hombros del piso contrayendo el abdomen.', 'crunch', ''],
  ['Crunch en máquina', A, [], 'Máquina de abdominales', [M], 'Sentada, acercá el pecho a la cadera flexionando el tronco y volvé lento.', 'crunch', ''],
  ['Elevación de piernas colgada', A, [O], 'Barra fija', [C], 'Colgada de la barra, subí las piernas sin balancearte y bajá lento.', 'hangLeg', ''],
  ['Elevación de piernas acostada', A, [], 'Colchoneta', [C], 'Boca arriba, subí las piernas juntas y bajalas sin que la zona lumbar se despegue.', 'lyingLeg', ''],
  ['Rollout con rueda', A, [HO, ES], 'Rueda abdominal', [F], 'De rodillas, llevá la rueda hacia adelante sin arquear la espalda y volvé con el abdomen.', 'rollout', ''],
  ['Hollow hold', A, [ST], 'Colchoneta', [C, R], 'Boca arriba, despegá hombros y piernas con la zona lumbar pegada al piso y sostené.', 'lyingLeg', ''],
  // Oblicuos
  ['Plancha lateral', O, [AB, ST], 'Sin equipamiento', [C, R, H], 'De costado sobre el antebrazo, elevá la cadera formando una línea y sostené.', 'sideplank', ''],
  ['Russian twist', O, [A], 'Disco o mancuerna', [F, D], 'Sentada con el torso inclinado, rotá hacia cada lado llevando el peso con las manos.', 'twist', 'dbHand'],
  ['Press Pallof con banda', O, [A, ST], 'Banda o polea', [E, M, R, H], 'De costado al anclaje, extendé los brazos al frente sin dejar que el torso rote.', 'pallof', 'bandFront'],
  ['Leñador en polea', O, [A, HO], 'Polea', [M], 'Llevá la manija en diagonal de arriba hacia abajo rotando el tronco y volvé lento.', 'woodchop', 'cable'],
  ['Marcha de maleta', O, [ST, A], 'Mancuerna o pesa rusa', [D, F, R], 'Caminá con peso en una sola mano sin inclinarte hacia ningún lado.', 'carry', 'dbHand'],
  ['Crunch oblicuo', O, [A], 'Colchoneta', [C], 'Boca arriba, llevá el hombro hacia la rodilla opuesta y volvé despacio.', 'crunch', ''],
  // Lumbar
  ['Bird dog', L, [G, A, ST], 'Sin equipamiento', [C, R, H], 'En cuatro apoyos, extendé brazo y pierna opuestos sin mover la cadera. Sostené y cambiá.', 'birddog', ''],
  ['Extensión lumbar en banco', L, [G, I], 'Banco romano', [M], 'Con la cadera en el apoyo, bajá el torso y subí hasta alinearlo con las piernas.', 'backext', ''],
  ['Superman', L, [G], 'Colchoneta', [C, H], 'Boca abajo, despegá brazos y piernas unos centímetros, sostené y bajá.', 'superman', ''],
  ['Puente en fitball', L, [G, A], 'Fitball', [C, H], 'Con la espalda alta en la pelota, sostené la cadera arriba sin arquear la zona lumbar.', 'hipthrust', 'ballBack'],
  // Espalda
  ['Jalón al pecho', ES, [BI, HO], 'Polea alta', [M], 'Sentada, bajá la barra al pecho llevando los codos hacia las costillas y subí controlando.', 'pulldown', 'cableTop'],
  ['Remo sentado en polea', ES, [BI, L], 'Polea baja', [M], 'Con el pecho alto, llevá la manija al abdomen juntando las escápulas y volvé lento.', 'seatedrow', 'cableLow'],
  ['Remo con barra', ES, [BI, L], 'Barra', [B, F], 'Inclinada con la espalda neutra, llevá la barra hacia el abdomen y bajá controlando.', 'row', 'barRow'],
  ['Remo con mancuerna', ES, [BI], 'Mancuerna y banco', [D, F], 'Con una mano en el banco, subí la mancuerna hacia la cadera y bajá lento.', 'row', 'dbHand'],
  ['Remo en máquina', ES, [BI], 'Máquina de remo', [M], 'Con el pecho en el apoyo, tirá de las manijas hacia atrás y volvé controlando.', 'seatedrow', ''],
  ['Dominadas', ES, [BI, A], 'Barra fija', [C], 'Colgada de la barra, subí hasta pasar el mentón y bajá hasta extender los brazos.', 'pullup', ''],
  ['Dominadas asistidas', ES, [BI], 'Máquina asistida o banda', [M, E], 'Con asistencia, subí hasta pasar el mentón y bajá controlando.', 'pullup', ''],
  ['Remo invertido', ES, [BI, A], 'Barra baja o TRX', [C], 'Colgada con el cuerpo recto, llevá el pecho hacia la barra y bajá lento.', 'invrow', ''],
  ['Face pull', ES, [HO], 'Polea o banda', [M, E, H], 'Tirá la cuerda hacia la cara con los codos altos y abrí las manos al final.', 'facepull', 'cable'],
  ['Pullover en polea', ES, [TR], 'Polea alta', [M], 'Con los brazos casi rectos, bajá la barra hasta los muslos y volvé arriba.', 'pushdown', 'cable'],
  ['Remo con banda', ES, [BI], 'Banda elástica', [E, H], 'Con la banda al frente, llevá los codos hacia atrás juntando las escápulas.', 'seatedrow', 'bandFront'],
  // Pecho
  ['Press de banca con barra', PE, [TR, HO], 'Barra y banco', [B, F], 'Bajá la barra al pecho con los codos algo cerrados y empujá hasta extender los brazos.', 'bench', 'barBench'],
  ['Press con mancuernas', PE, [TR, HO], 'Mancuernas y banco', [D, F], 'Acostada, bajá las mancuernas a los lados del pecho y empujá hasta arriba.', 'bench', 'dbBench'],
  ['Press inclinado con mancuernas', PE, [HO, TR], 'Mancuernas y banco inclinado', [D, F], 'En banco inclinado, bajá las mancuernas al pecho alto y empujá hacia arriba.', 'incline', 'dbBench2'],
  ['Press de pecho en máquina', PE, [TR, HO], 'Máquina de pecho', [M], 'Empujá las manijas hacia adelante sin despegar la espalda y volvé lento.', 'chestpress', ''],
  ['Apertura con mancuernas', PE, [HO], 'Mancuernas y banco', [D, F], 'Acostada, abrí los brazos en arco con los codos semiflexionados y volvé a cerrar.', 'fly', 'dbFly'],
  ['Apertura en polea', PE, [HO], 'Polea', [M], 'Con una manija en cada mano, juntá los brazos al frente en arco y abrí despacio.', 'cablefly', 'cable'],
  ['Flexiones de brazos', PE, [TR, HO, A], 'Sin equipamiento', [C, R], 'Con el cuerpo recto, bajá el pecho hacia el piso y empujá hasta extender los brazos.', 'pushup', ''],
  ['Flexiones con rodillas apoyadas', PE, [TR, HO], 'Sin equipamiento', [C], 'Con las rodillas en el piso y el torso recto, bajá el pecho y empujá.', 'pushupKnee', ''],
  // Hombros
  ['Press militar con barra', HO, [TR, A], 'Barra', [B, F], 'De pie, empujá la barra desde los hombros hasta arriba de la cabeza sin arquear la espalda.', 'ohp', 'barOhp'],
  ['Press de hombros con mancuernas', HO, [TR], 'Mancuernas', [D, F], 'Empujá las mancuernas desde los hombros hasta arriba y bajá controlando.', 'ohp', 'dbOhp'],
  ['Press de hombros en máquina', HO, [TR], 'Máquina de hombros', [M], 'Sentada, empujá las manijas hacia arriba y volvé lento.', 'ohp', ''],
  ['Elevaciones laterales', HO, [], 'Mancuernas', [D, F], 'Con los codos semiflexionados, subí los brazos al costado hasta la altura de los hombros.', 'lateral', 'dbLateral'],
  ['Elevaciones frontales', HO, [PE], 'Mancuernas', [D, F], 'Subí los brazos al frente hasta la altura de los hombros y bajá lento.', 'frontraise', 'dbHand'],
  ['Pájaros (deltoides posterior)', HO, [ES], 'Mancuernas', [D, F], 'Inclinada, abrí los brazos hacia los costados juntando las escápulas y bajá lento.', 'reardelt', 'dbHand'],
  ['Rotación externa de hombro con banda', HO, [ES], 'Banda elástica', [E, H], 'Con el codo pegado al cuerpo a 90°, rotá el antebrazo hacia afuera y volvé lento.', 'curl', 'bandFront'],
  // Bíceps
  ['Curl con barra', BI, [], 'Barra', [B, F], 'Con los codos pegados al cuerpo, subí la barra hasta los hombros y bajá lento.', 'curl', 'barCurl'],
  ['Curl con mancuernas', BI, [], 'Mancuernas', [D, F], 'Subí las mancuernas alternando brazos sin balancear el cuerpo.', 'curl', 'dbHand'],
  ['Curl martillo', BI, [], 'Mancuernas', [D, F], 'Con las palmas enfrentadas, subí las mancuernas y bajá controlando.', 'curl', 'dbHand'],
  ['Curl en polea', BI, [], 'Polea baja', [M], 'Con los codos fijos, subí la barra de la polea hasta los hombros y bajá lento.', 'curl', 'cableLowCurl'],
  ['Curl con banda', BI, [], 'Banda elástica', [E], 'Pisando la banda, subí las manos hasta los hombros con los codos fijos.', 'curl', 'bandLow'],
  // Tríceps
  ['Extensión de tríceps en polea', TR, [], 'Polea alta', [M], 'Con los codos fijos, empujá la barra hacia abajo hasta extender y volvé lento.', 'pushdown', 'cable'],
  ['Extensión de tríceps sobre la cabeza', TR, [], 'Mancuerna', [D, F], 'Con la mancuerna atrás de la cabeza, extendé los brazos hacia arriba y bajá lento.', 'overhead', 'dbOver'],
  ['Press francés', TR, [], 'Barra Z y banco', [B, F], 'Acostada, bajá la barra hacia la frente flexionando solo los codos y extendé.', 'skull', 'barSkull'],
  ['Fondos en banco', TR, [PE, HO], 'Banco', [C], 'Con las manos en el banco, bajá flexionando los codos y empujá hasta extender.', 'benchdip', ''],
  ['Fondos en paralelas', TR, [PE, HO], 'Paralelas', [C], 'Sostenida en las paralelas, bajá hasta 90° de codo y subí empujando.', 'dip', ''],
  ['Press de banca agarre cerrado', TR, [PE, HO], 'Barra y banco', [B, F], 'Con las manos al ancho de hombros, bajá la barra con los codos cerrados y empujá.', 'bench', 'barBench'],
  // Movilidad
  ['Estiramiento de flexor de cadera', MO, [Q, G], 'Colchoneta', [V, R, H], 'En estocada con una rodilla apoyada, llevá la cadera adelante sin arquear la espalda.', 'kneelLunge', ''],
  ['World’s greatest stretch', MO, [I, G, ES], 'Sin equipamiento', [V, R], 'En estocada profunda, apoyá una mano y rotá el torso llevando el otro brazo al techo.', 'lungeTwist', ''],
  ['Movilidad de tobillo a la pared', MO, [GS, P], 'Pared', [V, R, H], 'Con el pie cerca de la pared, llevá la rodilla hacia adelante sin levantar el talón.', 'ankleWall', ''],
  ['Gato y vaca', MO, [L, A], 'Colchoneta', [V, H], 'En cuatro apoyos, alterná redondear y arquear la espalda siguiendo la respiración.', 'quadruped', ''],
  ['Paloma', MO, [G], 'Colchoneta', [V, R], 'Con una pierna flexionada adelante y la otra extendida atrás, inclinate sobre la pierna delantera.', 'pigeon', ''],
  ['Rotación torácica en cuadrupedia', MO, [ES], 'Colchoneta', [V, R], 'En cuatro apoyos con una mano en la nuca, rotá el pecho y volvé sin mover la cadera.', 'quadruped', ''],
  ['Rotación de cadera 90/90', MO, [G, AD], 'Colchoneta', [V, R], 'Sentada con ambas rodillas a 90°, girá las piernas de un lado al otro sin usar las manos.', 'hip9090', ''],
  ['Estiramiento de isquiotibiales', MO, [I], 'Colchoneta', [V, R], 'Sentada con una pierna extendida, inclinate desde la cadera con la espalda larga.', 'seatFold', ''],
  ['Estiramiento de cuádriceps de pie', MO, [Q], 'Sin equipamiento', [V, R], 'Parada, tomá el empeine y llevá el talón hacia la cola con las rodillas juntas.', 'quadStretch', ''],
  ['Estiramiento de gemelos en la pared', MO, [GS], 'Pared', [V, R], 'Con las manos en la pared y una pierna atrás, presioná el talón contra el piso.', 'calfStretch', ''],
  ['Rodillo en cintilla iliotibial', MO, [AB], 'Foam roller', [V, R], 'De costado sobre el rodillo, deslizate entre la cadera y la rodilla con presión tolerable.', 'roller', ''],
  ['Rodillo en gemelos', MO, [GS], 'Foam roller', [V, R], 'Con las pantorrillas sobre el rodillo y las manos atrás, desplazate lentamente.', 'rollerCalf', ''],
  // Estabilidad
  ['Monster walk con banda', ST, [AB, G], 'Mini banda', [E, R, H], 'En semiflexión, avanzá en diagonal con pasos cortos manteniendo tensión en la banda.', 'sumoSmall', 'bandKnee'],
  ['Estabilidad de cadera con banda en una pierna', ST, [G, AB], 'Banda elástica', [E, R, H], 'En una pierna, resistí la banda que tira de la rodilla hacia adentro sin perder la alineación.', 'oneleg', 'bandKnee'],
  ['Marcha en puente', ST, [G, A], 'Sin equipamiento', [C, R, H], 'Con la cadera elevada, subí una rodilla por vez sin que la pelvis caiga.', 'bridgeOne', ''],
  ['Star excursion', ST, [G, Q, PR], 'Cinta en el piso', [C, R, H], 'En una pierna, estirá la otra lo más lejos posible en varias direcciones y volvé.', 'rdlOne', ''],
  ['Skipping controlado', ST, [Q, GS], 'Sin equipamiento', [C, R], 'Subí una rodilla por vez con el torso alto, cuidando que el pie caiga debajo del cuerpo.', 'oneleg', ''],
  // Equilibrio
  ['Equilibrio en una pierna', EQ, [PR, P], 'Sin equipamiento', [C, R, H], 'Parada en una pierna, sostené la posición con la cadera nivelada y los dedos relajados.', 'oneleg', ''],
  ['Equilibrio en una pierna con ojos cerrados', EQ, [PR], 'Sin equipamiento', [C, R, H], 'Igual que el equilibrio simple, con los ojos cerrados y un apoyo cerca.', 'oneleg', ''],
  ['Equilibrio en una pierna sobre bosu', EQ, [PR, P], 'Bosu', [C, R, H], 'Parada sobre la superficie inestable, sostené sin que la rodilla se vaya hacia adentro.', 'oneleg', 'bosu'],
  ['Pase de pelota en una pierna', EQ, [PR, A], 'Pelota', [C, R, H], 'En una pierna, pasá o lanzá una pelota manteniendo la cadera estable.', 'oneleg', 'ballHand'],
  // Propiocepción
  ['Tándem con ojos cerrados', PR, [EQ], 'Sin equipamiento', [C, H], 'Con un pie delante del otro en línea, cerrá los ojos y sostené el equilibrio.', 'stand', ''],
  ['Saltos a una pierna con caída estable', PR, [Q, GS], 'Sin equipamiento', [C, R], 'Saltá con una pierna y aterrizá suave, frenando la rodilla alineada con el pie.', 'pogo', ''],
  ['Alfabeto con el pie', PR, [P, T], 'Sin equipamiento', [C, R, H], 'Parada en una pierna o sentada, dibujá las letras con el pie libre moviendo el tobillo.', 'foot', 'circle'],
  ['Desplazamiento de peso sobre tabla', PR, [EQ, P], 'Tabla de equilibrio', [C, R, H], 'Sobre la tabla, llevá el peso adelante, atrás y a los costados sin tocar el piso con los bordes.', 'stand', 'bosu'],
];

const slug = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const EXERCISES = RAW.map(([name, muscle, secondary, equipment, types, desc, pose, eq]) => ({ id: slug(name), name, muscle, secondary, equipment, types, desc, pose, eq, builtin: true }));

/* ---------- Figuras: poses de línea en una grilla de 64 × 64 ----------
   h: cabeza · t: torso · a: brazos · l: piernas · m: aparato (gris). */
const POSES = {
  stand: { h: [32, 10], t: '32,17 32,35', a: ['32,19 26,33', '32,19 38,33'], l: ['32,35 29,57', '32,35 35,57'], hand: [38, 34] },
  squat: { h: [36, 12], t: '33,19 24,36', a: ['33,21 45,27'], l: ['24,36 40,38 35,56 42,56'], hand: [46, 27] },
  squatBox: { h: [36, 12], t: '33,19 24,36', a: ['33,21 45,27'], l: ['24,36 40,38 35,56 42,56'], m: ['10,57 10,40 25,40 25,57'], hand: [46, 27] },
  bulgarian: { h: [32, 9], t: '32,16 31,33', a: ['32,18 33,33'], l: ['31,33 44,38 44,56 50,56', '31,33 21,44 10,38'], m: ['3,41 15,41', '5,41 5,57', '13,41 13,57'], hand: [33, 35] },
  pistol: { h: [32, 16], t: '30,22 24,38', a: ['30,24 44,22'], l: ['24,38 36,42 28,56 35,56', '24,38 38,34 54,36'], m: ['48,57 48,14 44,14'], hand: [45, 21] },
  legpress: { h: [12, 28], t: '14,35 24,50', a: ['16,38 24,44'], l: ['24,50 38,32 48,30'], m: ['6,28 18,54 30,54', '48,16 56,34', '56,34 60,57', '6,57 60,57'], },
  hack: { h: [20, 14], t: '22,21 28,38', a: ['23,23 18,14'], l: ['28,38 42,40 40,56 47,56'], m: ['14,8 32,48', '34,57 52,57'] },
  legext: { h: [20, 13], t: '20,20 24,42', a: ['22,25 30,41'], l: ['24,42 40,42 54,32 58,28'], m: ['14,16 18,48 38,48', '26,48 26,57', '14,57 38,57', '50,28 54,38'] },
  legcurl: { h: [20, 13], t: '20,20 24,42', a: ['22,25 30,38'], l: ['24,42 42,40 40,56 46,56'], m: ['14,16 18,48 34,48', '24,48 24,57', '14,57 34,57', '38,52 46,50'] },
  legcurlLying: { h: [8, 40], t: '14,42 32,44', a: ['14,42 22,50'], l: ['32,44 48,44 54,28'], m: ['6,50 48,50', '14,50 14,57', '42,50 42,57', '50,28 58,28'] },
  lunge: { h: [30, 9], t: '30,16 30,33', a: ['30,18 31,32'], l: ['30,33 43,38 43,56 49,56', '30,33 22,45 12,55 16,57'], hand: [31, 34] },
  stepup: { h: [28, 8], t: '28,15 28,31', a: ['28,17 28,31'], l: ['28,31 42,32 42,43 49,43', '28,31 25,44 25,57 31,57'], m: ['36,44 56,44 56,57 36,57'], hand: [28, 33] },
  stepdown: { h: [24, 8], t: '24,15 24,31', a: ['24,17 32,27'], l: ['24,31 28,42 20,43 26,44', '24,31 40,40 42,56 48,56'], m: ['6,44 30,44 30,57 6,57'] },
  wallsit: { h: [14, 15], t: '13,22 13,40', a: ['13,24 24,34'], l: ['13,40 32,40 32,56 38,56'], m: ['7,6 7,57', '7,57 50,57'] },
  hinge: { h: [47, 21], t: '41,25 22,30', a: ['41,26 41,42'], l: ['22,30 24,44 22,57 29,57'], hand: [41, 44] },
  deadlift: { h: [45, 24], t: '39,28 22,36', a: ['39,29 39,49'], l: ['22,36 34,42 28,56 35,56'], hand: [39, 50] },
  nordic: { h: [45, 22], t: '39,28 24,44', a: ['39,30 48,40'], l: ['24,44 16,55 6,55'], m: ['2,49 10,49', '2,57 58,57'] },
  rdlOne: { h: [50, 25], t: '44,28 28,32', a: ['44,29 44,44'], l: ['28,32 28,57 34,57', '28,32 8,28'], hand: [44, 46] },
  swing: { h: [40, 16], t: '35,22 22,32', a: ['35,23 50,28'], l: ['22,32 32,42 28,56 35,56'], hand: [52, 29] },
  bridge: { h: [6, 50], t: '12,52 32,38', a: ['12,52 22,55'], l: ['32,38 44,41 48,55 54,55'] },
  bridgeOne: { h: [6, 50], t: '12,52 32,38', a: ['12,52 22,55'], l: ['32,38 42,42 46,55 52,55', '32,38 48,30 58,24'] },
  bridgeRest: { h: [6, 50], t: '12,53 32,53', a: ['12,53 22,56'], l: ['32,53 44,38 50,55 56,55'] },
  hipthrust: { h: [12, 25], t: '16,32 34,31', a: ['18,33 32,33'], l: ['34,31 46,36 46,56 52,56'], m: ['6,38 20,38', '9,38 9,57', '18,38 18,57'] },
  kickback: { h: [14, 22], t: '18,28 36,34', a: ['18,29 18,54'], l: ['36,34 36,54 40,56', '36,34 50,26 60,16'], hand: [18, 55] },
  birddogLeg: { h: [13, 25], t: '17,31 37,31', a: ['17,31 17,54'], l: ['37,31 37,54 44,54', '37,31 50,28 50,16'] },
  birddog: { h: [13, 25], t: '17,31 37,31', a: ['17,31 17,54', '17,31 3,24'], l: ['37,31 37,54 44,54', '37,31 60,24'] },
  quadruped: { h: [12, 28], t: '17,32 28,27 38,32', a: ['17,32 17,54'], l: ['38,32 38,54 46,54'] },
  seatFront: { h: [32, 10], t: '32,17 32,38', a: ['32,20 22,34', '32,20 42,34'], l: ['32,38 16,44 14,57', '32,38 48,44 50,57'] },
  copenhagen: { h: [8, 28], t: '13,33 30,42', a: ['13,33 12,55'], l: ['30,42 50,36', '30,42 44,54'], m: ['42,38 60,38', '46,38 46,57', '56,38 56,57'] },
  sideLeg: { h: [28, 10], t: '28,17 28,35', a: ['28,19 18,28', '28,19 38,30'], l: ['28,35 26,57', '28,35 46,52'], },
  sumo: { h: [32, 12], t: '32,19 32,37', a: ['32,21 32,40'], l: ['32,37 18,42 16,57', '32,37 46,42 48,57'], hand: [32, 41] },
  sumoSmall: { h: [32, 12], t: '32,19 32,36', a: ['32,21 24,31', '32,21 40,31'], l: ['32,36 22,44 22,57', '32,36 42,44 42,57'] },
  sidelunge: { h: [24, 14], t: '26,21 30,37', a: ['26,23 18,34'], l: ['30,37 14,42 12,57', '30,37 54,56'] },
  clam: { h: [6, 46], t: '12,48 30,50', a: ['12,48 18,38'], l: ['30,50 44,38 52,54', '30,50 44,56 52,54'] },
  sideLying: { h: [6, 46], t: '12,48 30,50', a: ['12,48 16,38'], l: ['30,50 56,54', '30,50 54,34'] },
  calf: { h: [32, 7], t: '32,14 32,32', a: ['32,16 32,30'], l: ['32,32 32,46 32,52 38,56'], hand: [32, 31] },
  seatedCalf: { h: [22, 10], t: '22,17 22,38', a: ['22,20 36,34'], l: ['22,38 40,38 40,50 47,46'], m: ['14,44 30,44', '20,44 20,57', '12,57 52,57', '36,34 46,34'] },
  pogo: { h: [32, 6], t: '32,13 32,30', a: ['32,15 24,26', '32,15 40,26'], l: ['32,30 30,44 34,50', '32,30 36,44 40,50'], m: ['20,57 44,57'] },
  tibial: { h: [14, 8], t: '13,15 13,34', a: ['13,17 20,30'], l: ['13,34 22,46 26,56 36,48'], m: ['7,4 7,57', '7,57 50,57'] },
  tibialWalk: { h: [30, 7], t: '30,14 30,33', a: ['30,16 40,26', '30,16 22,27'], l: ['30,33 36,56 46,48', '30,33 22,56 32,48'] },
  ankleSit: { h: [10, 24], t: '12,31 16,52', a: ['13,34 8,52'], l: ['16,52 46,52 48,42'], },
  foot: { foot: true },
  plank: { h: [11, 32], t: '16,37 38,42', a: ['16,37 18,54 27,54'], l: ['38,42 58,55'] },
  sideplank: { h: [10, 26], t: '14,32 34,44', a: ['14,32 14,54 22,54', '14,32 15,16'], l: ['34,44 56,55'] },
  deadbug: { h: [6, 49], t: '12,52 32,52', a: ['13,52 20,34', '13,52 2,34'], l: ['32,52 42,38 54,40', '32,52 56,54'] },
  crunch: { h: [12, 36], t: '17,42 32,54', a: ['17,42 12,32'], l: ['32,54 44,38 50,55 56,55'] },
  hangLeg: { h: [28, 15], t: '28,22 28,38', a: ['28,22 22,6', '28,22 36,6'], l: ['28,38 48,38'], m: ['8,5 56,5'] },
  lyingLeg: { h: [8, 50], t: '14,53 34,53', a: ['14,53 24,56'], l: ['34,53 52,28'] },
  rollout: { h: [16, 30], t: '22,35 42,38', a: ['22,35 10,50'], l: ['42,38 46,54 58,54'], m: ['10,54 r5'] },
  twist: { h: [18, 24], t: '22,31 34,52', a: ['23,33 38,34'], l: ['34,52 46,42 58,46'], hand: [40, 34] },
  pallof: { h: [32, 10], t: '32,17 32,35', a: ['32,20 50,20'], l: ['32,35 26,57', '32,35 38,57'], hand: [50, 20] },
  woodchop: { h: [30, 10], t: '30,17 30,35', a: ['30,19 44,30'], l: ['30,35 24,57', '30,35 36,57'], hand: [44, 30] },
  carry: { h: [30, 9], t: '30,16 30,34', a: ['30,18 38,33'], l: ['30,34 38,46 36,57 42,57', '30,34 22,46 16,57'], hand: [38, 35] },
  backext: { h: [50, 26], t: '44,30 26,38', a: ['44,30 38,40'], l: ['26,38 8,52'], m: ['18,44 30,44', '24,44 24,57', '6,57 34,57', '6,57 6,52'] },
  superman: { h: [13, 40], t: '18,45 36,52', a: ['18,45 4,36'], l: ['36,52 58,46'], m: ['2,57 62,57'] },
  pulldown: { h: [30, 22], t: '28,29 28,46', a: ['28,30 40,24 46,14'], l: ['28,46 44,46 44,57 50,57'], m: ['18,52 36,52', '26,52 26,57', '38,8 54,16'], hand: [46, 14] },
  seatedrow: { h: [24, 14], t: '22,21 18,44', a: ['22,24 34,32 42,30'], l: ['18,44 34,44 50,50'], m: ['10,50 28,50', '18,50 18,57', '50,44 50,57'], hand: [42, 30] },
  row: { h: [47, 18], t: '41,23 22,30', a: ['41,24 35,36 42,41'], l: ['22,30 28,44 26,57 33,57'], hand: [42, 42] },
  pullup: { h: [32, 15], t: '32,22 32,39', a: ['32,23 21,19 21,6', '32,23 43,19 43,6'], l: ['32,39 28,54', '32,39 36,54'], m: ['8,5 56,5'] },
  invrow: { h: [50, 20], t: '44,26 26,36', a: ['44,27 46,12'], l: ['26,36 6,50'], m: ['36,10 56,10', '38,10 38,57', '54,10 54,57'] },
  facepull: { h: [28, 10], t: '28,17 28,36', a: ['28,20 38,14 34,10'], l: ['28,36 22,57', '28,36 34,57'], hand: [34, 10] },
  bench: { h: [8, 38], t: '14,42 36,42', a: ['20,42 20,24'], l: ['36,42 46,44 46,57 52,57'], m: ['6,48 40,48', '14,48 14,57', '34,48 34,57'], hand: [20, 22] },
  incline: { h: [12, 22], t: '16,29 32,44', a: ['20,32 30,16'], l: ['32,44 44,44 46,57 52,57'], m: ['8,20 32,50', '20,50 20,57', '32,50 32,57'], hand: [30, 15] },
  chestpress: { h: [20, 12], t: '20,19 22,42', a: ['21,23 36,24 46,24'], l: ['22,42 38,42 38,57 44,57'], m: ['14,14 16,48 32,48', '22,48 22,57', '48,16 48,57', '12,57 54,57'], hand: [46, 24] },
  fly: { h: [8, 38], t: '14,42 36,42', a: ['20,42 8,28', '20,42 32,28'], l: ['36,42 46,44 46,57 52,57'], m: ['6,48 40,48', '14,48 14,57', '34,48 34,57'] },
  cablefly: { h: [32, 10], t: '32,17 32,35', a: ['32,20 22,27 32,32', '32,20 42,27 32,32'], l: ['32,35 28,57', '32,35 36,57'], m: ['6,4 6,57', '58,4 58,57'], },
  pushup: { h: [11, 26], t: '16,31 38,41', a: ['16,31 16,55'], l: ['38,41 58,55'] },
  pushupKnee: { h: [11, 26], t: '16,31 36,44', a: ['16,31 16,55'], l: ['36,44 42,55 56,55'] },
  ohp: { h: [32, 15], t: '32,22 32,39', a: ['32,24 42,22 42,10', '32,24 22,22 22,10'], l: ['32,39 28,57', '32,39 36,57'], hand: [42, 8] },
  lateral: { h: [32, 11], t: '32,18 32,37', a: ['32,20 50,23', '32,20 14,23'], l: ['32,37 28,57', '32,37 36,57'] },
  frontraise: { h: [30, 11], t: '30,18 30,37', a: ['30,20 50,20'], l: ['30,37 26,57', '30,37 34,57'], hand: [52, 20] },
  reardelt: { h: [47, 20], t: '41,25 22,32', a: ['41,26 54,18', '41,26 30,16'], l: ['22,32 28,45 26,57 33,57'], hand: [54, 16] },
  curl: { h: [30, 10], t: '30,17 30,36', a: ['30,19 29,31 42,25'], l: ['30,36 26,57', '30,36 34,57'], hand: [43, 24] },
  pushdown: { h: [28, 10], t: '28,17 28,36', a: ['28,20 27,31 40,37'], l: ['28,36 24,57', '28,36 32,57'], hand: [41, 37] },
  overhead: { h: [32, 16], t: '32,23 32,40', a: ['32,25 40,15 32,6'], l: ['32,40 28,57', '32,40 36,57'], hand: [31, 5] },
  skull: { h: [8, 38], t: '14,42 36,42', a: ['20,42 22,26 12,24'], l: ['36,42 46,44 46,57 52,57'], m: ['6,48 40,48', '14,48 14,57', '34,48 34,57'], hand: [11, 24] },
  benchdip: { h: [22, 18], t: '20,25 24,42', a: ['20,27 10,30 10,40'], l: ['24,42 42,44 52,56'], m: ['4,40 18,40', '6,40 6,57', '16,40 16,57'] },
  dip: { h: [32, 11], t: '32,18 32,36', a: ['32,20 22,28 22,36', '32,20 42,28 42,36'], l: ['32,36 30,46 24,52', '32,36 34,46 28,52'], m: ['14,36 28,36', '36,36 50,36', '16,36 16,57', '48,36 48,57'] },
  kneelLunge: { h: [28, 12], t: '28,19 26,39', a: ['28,21 28,37'], l: ['26,39 40,41 40,56 47,56', '26,39 14,54 4,54'] },
  lungeTwist: { h: [30, 18], t: '26,25 22,41', a: ['26,26 34,50', '26,26 28,8'], l: ['22,41 36,42 36,56 43,56', '22,41 8,54'] },
  ankleWall: { h: [30, 10], t: '30,17 26,36', a: ['30,19 52,22'], l: ['26,36 42,40 38,56 46,56', '26,36 16,46 8,56'], m: ['56,4 56,57'] },
  pigeon: { h: [36, 18], t: '32,25 26,44', a: ['32,27 42,54'], l: ['26,44 42,50 30,55', '26,44 4,55'] },
  hip9090: { h: [28, 14], t: '28,21 28,42', a: ['28,24 18,44'], l: ['28,42 44,42 44,54', '28,42 16,52 8,44'] },
  seatFold: { h: [34, 28], t: '28,33 14,50', a: ['28,34 42,48'], l: ['14,50 52,52 54,44'] },
  quadStretch: { h: [30, 8], t: '30,15 30,33', a: ['30,17 20,30 18,38'], l: ['30,33 30,57 36,57', '30,33 30,46 18,38'] },
  calfStretch: { h: [36, 12], t: '34,19 26,37', a: ['34,21 54,22'], l: ['26,37 40,44 40,56 46,56', '26,37 16,46 6,56'], m: ['56,4 56,57'] },
  roller: { h: [8, 28], t: '12,34 28,42', a: ['12,34 10,54'], l: ['28,42 56,52'], m: ['36,51 r5'] },
  rollerCalf: { h: [10, 26], t: '12,33 18,48', a: ['12,35 4,54'], l: ['18,48 36,44 58,46'], m: ['46,52 r5'] },
  oneleg: { h: [32, 9], t: '32,16 32,34', a: ['32,18 24,28', '32,18 40,28'], l: ['32,34 32,57 38,57', '32,34 44,38 41,50'] },
};

// Aparatos y cargas que se dibujan sobre cada figura
function gear(pose, eq) {
  const h = pose.hand || [0, 0], c = 'var(--gear)';
  const db = (x, y) => `<g stroke="${c}" stroke-width="2"><path d="M${x - 4} ${y}h8"/><path d="M${x - 5} ${y - 3}v6M${x + 5} ${y - 3}v6" stroke-width="3"/></g>`;
  const plate = (x, y, r = 7) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${c}" stroke-width="3"/><circle cx="${x}" cy="${y}" r="1.4" fill="${c}"/>`;
  const line = d => `<path d="${d}" stroke="${c}" stroke-width="1.6" stroke-dasharray="3 3"/>`;
  const ball = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${c}" stroke-width="2.4"/>`;
  switch (eq) {
    case 'barBack': return plate(29, 19); case 'barBack2': return plate(30, 18); case 'barBack3': return plate(38, 22);
    case 'barFront': return plate(40, 22); case 'barLow': return plate(h[0], h[1] + 5); case 'barRow': return plate(h[0], h[1] + 3);
    case 'barHip': return plate(34, 25); case 'barBench': return plate(20, 18); case 'barOhp': return plate(42, 7); case 'barCurl': return plate(h[0] + 2, h[1] - 2, 6); case 'barSkull': return plate(10, 22, 6);
    case 'dbFront': return db(46, 26); case 'dbFrontLow': return db(32, 44); case 'dbHand': return db(h[0], h[1] + 1);
    case 'dbBench': return db(20, 21); case 'dbBench2': return db(30, 14); case 'dbFly': return db(7, 26) + db(33, 26); case 'dbOhp': return db(42, 8) + db(22, 8); case 'dbLateral': return db(52, 23) + db(12, 23); case 'dbOver': return db(31, 4);
    case 'kbHand': return `<path d="M${h[0] - 3} ${h[1]}a3 3 0 0 1 6 0" stroke="${c}" stroke-width="2"/><circle cx="${h[0]}" cy="${h[1] + 6}" r="5" fill="${c}"/>`;
    case 'cable': return `<path d="M58 4v53" stroke="${c}" stroke-width="2.4"/>` + line(`M58 8L${h[0] || 44} ${h[1] || 30}`);
    case 'cableTop': return `<path d="M46 2v12" stroke="${c}" stroke-width="1.8"/>`; case 'cableLow': return `<path d="M58 22v35" stroke="${c}" stroke-width="2.4"/>` + line(`M58 30L${h[0]} ${h[1]}`);
    case 'cableLowCurl': return `<path d="M58 22v35" stroke="${c}" stroke-width="2.4"/>` + line(`M58 52L${h[0]} ${h[1]}`);
    case 'band': return line('M58 12L48 34'); case 'bandFront': return line(`M60 20L${h[0] || 40} ${h[1] || 26}`); case 'bandLow': return line(`M36 57L${h[0]} ${h[1]}`);
    case 'bandKnee': return line('M24 46H40'); case 'bandKneeLying': return line('M43 40L43 54');
    case 'ball': return ball(50, 49, 7); case 'ballKnee': return ball(45, 34, 4); case 'ballBack': return ball(13, 45, 11); case 'ballAnkle': return ball(36, 49, 3); case 'ballHand': return ball(46, 20, 5);
    case 'plateFoot': return plate(49, 37, 5); case 'step': return `<path d="M24 57h20" stroke="${c}" stroke-width="3"/>`; case 'machineShoulder': return `<path d="M22 13h20M42 13v44M34 57h16" stroke="${c}" stroke-width="2.4"/>`;
    case 'padsIn': return `<path d="M10 42v10M54 42v10" stroke="${c}" stroke-width="4"/>`; case 'padsOut': return `<path d="M21 40v10M43 40v10" stroke="${c}" stroke-width="4"/>`;
    case 'bosu': return `<path d="M18 57a14 8 0 0 1 28 0z" fill="none" stroke="${c}" stroke-width="2.4"/>`;
    default: return '';
  }
}
function footArt(eq) {
  const c = 'var(--gear)';
  const extra = { towel: `<path d="M38 57h22" stroke="${c}" stroke-width="3" stroke-dasharray="4 2"/>`, ballFoot: `<circle cx="34" cy="53" r="4" fill="none" stroke="${c}" stroke-width="2.4"/>`, circle: `<path d="M50 28a10 10 0 1 1-6-9" stroke="${c}" stroke-width="2"/><path d="M44 14v6h6" stroke="${c}" stroke-width="2"/>` }[eq] || '';
  return `<path class="hi" d="M20 6v30c0 4 1 8 0 11-1 2 2 3 6 3h22c5 0 6-5 2-6l-14-5c-3-1-5-3-5-7V6"/>${extra}`;
}
const pts = s => 'M' + s.trim().split(' ').join('L');
const memo = new Map();
export function exerciseIcon(ex, size = 48) {
  const key = (ex.pose || 'custom') + '|' + (ex.eq || '') + '|' + ex.muscle;
  let inner = memo.get(key);
  if (!inner) {
    const p = POSES[ex.pose];
    if (!p) inner = `<circle cx="32" cy="14" r="5" fill="currentColor"/><path class="hi" d="M32 21v18"/><path d="M32 24L20 32M32 24l12 8M32 39l-7 18M32 39l7 18"/>`;
    else if (p.foot) inner = footArt(ex.eq);
    else {
      const g = groupOf(ex.muscle);
      const hiLegs = g === 'Tren inferior', hiCore = g === 'Core' || ['Espalda', 'Pecho'].includes(ex.muscle), hiArms = ['Hombros', 'Bíceps', 'Tríceps'].includes(ex.muscle), all = g === 'Otros';
      const part = (list, hi) => list.map(s => `<path ${hi || all ? 'class="hi"' : ''} d="${pts(s)}"/>`).join('');
      const mach = (p.m || []).map(s => {
        const r = s.match(/^(\d+),(\d+) r(\d+)$/);
        return r ? `<circle cx="${r[1]}" cy="${r[2]}" r="${r[3]}" stroke="var(--gear)" stroke-width="2.4"/>` : `<path d="${pts(s)}" stroke="var(--gear)" stroke-width="2.4"/>`;
      }).join('');
      inner = mach + gear(p, ex.eq) + part(p.l || [], hiLegs) + part([p.t], hiCore) + part(p.a || [], hiArms) + `<circle cx="${p.h[0]}" cy="${p.h[1]}" r="5" fill="currentColor" stroke="none"/>`;
    }
    memo.set(key, inner);
  }
  return `<svg class="fig" width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}
