import streamlit as st

# 定義肌肉與神經的資料
upper_muscles_data = [
    {"zh": "肩胛提肌", "en": "Levator scapulae", "nerve_zh": "背肩胛神經", "nerve_en": "Dorsal scapular nerve", "root": "C5", "desc": "提肩胛骨的肌肉，可上提肩胛骨。由背肩胛神經支配，神經根 C5。"},
    {"zh": "菱形肌", "en": "Rhomboids", "nerve_zh": "背肩胛神經", "nerve_en": "Dorsal scapular nerve", "root": "C5", "desc": "包括大、小菱形肌，拉攏肩胛骨向中線靠攏（肩胛內收）。由背肩胛神經支配，神經根 C5。"},
    {"zh": "前鋸肌", "en": "Serratus anterior", "nerve_zh": "胸長神經", "nerve_en": "Long thoracic nerve", "root": "C5-C7", "desc": "位於胸廓側方，將肩胛骨固定於胸壁並向前推舉肩胛骨。由胸長神經支配，神經根 C5-C7。"},
    {"zh": "棘上肌", "en": "Supraspinatus", "nerve_zh": "肩胛上神經", "nerve_en": "Suprascapular nerve", "root": "C5-C6", "desc": "肩旋轉袖肌群之一，負責肩關節初始外展動作。由肩胛上神經支配，神經根 C5-C6。"},
    {"zh": "棘下肌", "en": "Infraspinatus", "nerve_zh": "肩胛上神經", "nerve_en": "Suprascapular nerve", "root": "C5-C6", "desc": "肩旋轉袖肌群之一，負責肩關節外旋動作。由肩胛上神經支配，神經根 C5-C6。"},
    {"zh": "肩胛下肌", "en": "Subscapularis", "nerve_zh": "肩胛下神經", "nerve_en": "Subscapular nerves", "root": "C5-C6", "desc": "肩旋轉袖肌群之一，負責肩關節內旋。由肩胛下神經上、下支支配，神經根 C5-C6。"},
    {"zh": "大圓肌", "en": "Teres major", "nerve_zh": "肩胛下神經", "nerve_en": "Lower subscapular nerve", "root": "C5-C6", "desc": "負責肩關節內旋與內收的肌肉。由肩胛下神經下支支配，神經根 C5-C6。"},
    {"zh": "闊背肌", "en": "Latissimus dorsi", "nerve_zh": "胸背神經", "nerve_en": "Thoracodorsal nerve", "root": "C6-C8", "desc": "大型背部肌肉，負責肩關節伸展、內收和內旋（划船動作）。由胸背神經支配，神經根 C6-C8。"},
    {"zh": "胸大肌", "en": "Pectoralis major", "nerve_zh": "胸外側/胸內側神經", "nerve_en": "Lateral/Medial pectoral nerves", "root": "C5-T1", "desc": "胸前的大型肌肉，可屈曲、內收和內旋肩關節。鎖骨部由胸外側神經 (C5-C7) 支配，胸肋部由胸內側神經 (C8-T1) 支配。"},
    {"zh": "胸小肌", "en": "Pectoralis minor", "nerve_zh": "胸內側神經", "nerve_en": "Medial pectoral nerve", "root": "C8-T1", "desc": "位於胸大肌深層的小肌肉，可下壓並固定肩胛骨。由胸內側神經支配，神經根 C8-T1。"},
    {"zh": "三角肌", "en": "Deltoid", "nerve_zh": "腋神經", "nerve_en": "Axillary nerve", "root": "C5-C6", "desc": "覆蓋肩峰的大肌肉，負責肩關節外展（特別是 15 度以上）、前束屈肩、後束伸肩。由腋神經支配，神經根 C5-C6。"},
    {"zh": "小圓肌", "en": "Teres minor", "nerve_zh": "腋神經", "nerve_en": "Axillary nerve", "root": "C5-C6", "desc": "肩旋轉袖肌群之一，負責肩關節外旋。由腋神經支配，神經根 C5-C6。"},
    {"zh": "肱二頭肌", "en": "Biceps brachii", "nerve_zh": "肌皮神經", "nerve_en": "Musculocutaneous nerve", "root": "C5-C6", "desc": "上臂前側的二頭肌，屈曲肘關節並輔助前臂旋後（掌心向上）。由肌皮神經支配，神經根 C5-C6。"},
    {"zh": "肱肌", "en": "Brachialis", "nerve_zh": "肌皮神經", "nerve_en": "Musculocutaneous nerve", "root": "C5-C6", "desc": "位於肱二頭肌深處，主要屈曲肘關節的肌肉。由肌皮神經支配，神經根 C5-C6。"},
    {"zh": "喙肱肌", "en": "Coracobrachialis", "nerve_zh": "肌皮神經", "nerve_en": "Musculocutaneous nerve", "root": "C5-C7", "desc": "上臂內側的小肌肉，協助屈曲和內收肩關節。由肌皮神經支配，神經根 C5-C7。"},
    {"zh": "肱三頭肌", "en": "Triceps brachii", "nerve_zh": "橈神經", "nerve_en": "Radial nerve", "root": "C7-C8", "desc": "上臂後側的三頭肌，負責伸直肘關節。由橈神經支配，神經根 C7-C8。"},
    {"zh": "肘肌", "en": "Anconeus", "nerve_zh": "橈神經", "nerve_en": "Radial nerve", "root": "C7-C8", "desc": "肘後的小肌肉，協助肘關節伸直和穩定。由橈神經支配，神經根 C7-C8。"},
    {"zh": "肱橈肌", "en": "Brachioradialis", "nerve_zh": "橈神經", "nerve_en": "Radial nerve", "root": "C5-C6", "desc": "前臂橈側的肌肉，在前臂中立位時屈曲肘關節。由橈神經支配，神經根 C5-C6。"},
    {"zh": "旋後肌", "en": "Supinator", "nerve_zh": "橈神經（深支）", "nerve_en": "Radial nerve (deep branch)", "root": "C5-C6", "desc": "前臂後外側深層肌肉，使前臂旋後（轉掌心向上）。由橈神經深支支配，神經根 C5-C6。"},
    {"zh": "橈側伸腕長肌", "en": "Extensor carpi radialis longus", "nerve_zh": "橈神經", "nerve_en": "Radial nerve", "root": "C6-C7", "desc": "前臂後側外側淺層肌，伸直及外展手腕。由橈神經支配，神經根 C6-C7。"},
    {"zh": "橈側伸腕短肌", "en": "Extensor carpi radialis brevis", "nerve_zh": "橈神經（深支）", "nerve_en": "Radial nerve (deep branch)", "root": "C7-C8", "desc": "前臂後側外側淺層肌，伸直及外展手腕。由橈神經深支（後骨間神經）支配，神經根 C7-C8。"},
    {"zh": "尺側伸腕肌", "en": "Extensor carpi ulnaris", "nerve_zh": "橈神經（深支）", "nerve_en": "Radial nerve (deep branch)", "root": "C7-C8", "desc": "前臂後側淺層肌，伸直及內收手腕。由橈神經深支（後骨間神經）支配，神經根 C7-C8。"},
    {"zh": "伸指總肌", "en": "Extensor digitorum", "nerve_zh": "橈神經（深支）", "nerve_en": "Radial nerve (deep branch)", "root": "C7-C8", "desc": "前臂後側淺層肌，負責伸直第 2-5 指。由橈神經深支支配，神經根 C7-C8。"},
    {"zh": "旋前圓肌", "en": "Pronator teres", "nerve_zh": "正中神經", "nerve_en": "Median nerve", "root": "C6-C7", "desc": "前臂屈肌淺層肌，旋前前臂（使掌心向下）並輔助屈肘。由正中神經支配，神經根 C6-C7。"},
    {"zh": "橈側屈腕肌", "en": "Flexor carpi radialis", "nerve_zh": "正中神經", "nerve_en": "Median nerve", "root": "C6-C7", "desc": "前臂屈肌淺層肌，屈曲手腕並使之橈偏（外展）。由正中神經支配，神經根 C6-C7。"},
    {"zh": "掌長肌", "en": "Palmaris longus", "nerve_zh": "正中神經", "nerve_en": "Median nerve", "root": "C7-T1", "desc": "細長的前臂屈肌，協助屈曲手腕並繃緊手掌腱膜。由正中神經支配，神經根 C7-T1。"},
    {"zh": "屈指淺肌", "en": "Flexor digitorum superficialis", "nerve_zh": "正中神經", "nerve_en": "Median nerve", "root": "C7-T1", "desc": "前臂屈肌淺層肌，屈曲手指近端指關節。由正中神經支配，神經根 C7-T1。"},
    {"zh": "屈指深肌", "en": "Flexor digitorum profundus", "nerve_zh": "正中/尺神經", "nerve_en": "Median/Ulnar nerves", "root": "C8-T1", "desc": "前臂屈肌深層肌，屈曲手指遠端指關節。此肌外側半由正中神經支配、內側半由尺神經支配，神經根 C8-T1。"},
    {"zh": "屈拇長肌", "en": "Flexor pollicis longus", "nerve_zh": "正中神經（骨間前神經）", "nerve_en": "Median nerve (anterior interosseous)", "root": "C7-C8", "desc": "前臂屈肌深層肌，屈曲拇指末節指關節。由正中神經的骨間前神經分支支配，神經根 C7-C8。"},
    {"zh": "旋前方肌", "en": "Pronator quadratus", "nerve_zh": "正中神經（骨間前神經）", "nerve_en": "Median nerve (anterior interosseous)", "root": "C8-T1", "desc": "前臂遠端深層的方形肌，主導前臂旋前動作。由正中神經的骨間前神經分支支配，神經根 C8-T1。"},
    {"zh": "尺側屈腕肌", "en": "Flexor carpi ulnaris", "nerve_zh": "尺神經", "nerve_en": "Ulnar nerve", "root": "C8-T1", "desc": "前臂屈肌淺層肌，屈曲手腕並使之尺偏（內收）。由尺神經支配，神經根 C8-T1。"},
    {"zh": "外展拇短肌", "en": "Abductor pollicis brevis", "nerve_zh": "正中神經（返支）", "nerve_en": "Median nerve (recurrent branch)", "root": "C8-T1", "desc": "手掌魚際肌，負責外展拇指。由正中神經的返支（支配魚際肌群）支配，神經根 C8-T1。"},
    {"zh": "第一骨間背肌", "en": "First dorsal interosseous", "nerve_zh": "尺神經（深支）", "nerve_en": "Ulnar nerve (deep branch)", "root": "C8-T1", "desc": "手部骨間肌，負責食指與中指的外展。由尺神經深支支配，神經根 C8-T1。"}
]

lower_muscles_data = [
    {"zh": "股四頭肌", "en": "Quadriceps femoris", "nerve_zh": "股神經", "nerve_en": "Femoral nerve", "root": "L2-L4", "desc": "包含股直肌、股內側肌、股外側肌和股中間肌四部分，負責伸直膝關節，是行走和站立的重要肌群。由股神經支配，神經根 L2-L4。"},
    {"zh": "縫匠肌", "en": "Sartorius", "nerve_zh": "股神經", "nerve_en": "Femoral nerve", "root": "L2-L3", "desc": "全身最長的肌肉，從髂前上棘斜向內下方跨越大腿。可屈曲髖關節、屈膝並外旋髖關節（盤腿動作）。由股神經支配，神經根 L2-L3。"},
    {"zh": "恥骨肌", "en": "Pectineus", "nerve_zh": "股神經", "nerve_en": "Femoral nerve (sometimes Obturator nerve)", "root": "L2-L3", "desc": "大腿近側內側肌，負責髖關節屈曲與內收。主要由股神經支配（部分人此肌也受閉孔神經支配），神經根 L2-L3。"},
    {"zh": "內收長肌", "en": "Adductor longus", "nerve_zh": "閉孔神經", "nerve_en": "Obturator nerve", "root": "L2-L4", "desc": "大腿內側肌群之一，負責髖關節內收動作。由閉孔神經支配，神經根 L2-L4。"},
    {"zh": "內收短肌", "en": "Adductor brevis", "nerve_zh": "閉孔神經", "nerve_en": "Obturator nerve", "root": "L2-L4", "desc": "大腿內側肌群之一，位於內收長肌深層，協助髖關節內收。由閉孔神經支配，神經根 L2-L4。"},
    {"zh": "內收大肌", "en": "Adductor magnus", "nerve_zh": "閉孔神經/坐骨神經", "nerve_en": "Obturator nerve / Sciatic nerve (tibial part)", "root": "L2-L4 (前部); L4-S3 (後部)", "desc": "大腿內收肌群中最大的一塊，分前（內收）部和後（腱）部。前部由閉孔神經支配 (L2-L4)，後部由坐骨神經的脛神經成分支配 (L4-S3)。此肌輔助髖關節內收及伸展。"},
    {"zh": "股薄肌", "en": "Gracilis", "nerve_zh": "閉孔神經", "nerve_en": "Obturator nerve", "root": "L2-L3", "desc": "細長的股內側肌，起自恥骨下支，止於脛骨內側髁處，作用為髖關節內收並輔助屈膝。由閉孔神經支配，神經根 L2-L3。"},
    {"zh": "臀大肌", "en": "Gluteus maximus", "nerve_zh": "臀下神經", "nerve_en": "Inferior gluteal nerve", "root": "L5-S2", "desc": "臀部最大肌肉，負責髖關節伸展（如站起、爬樓梯時伸髖）。由臀下神經支配，神經根 L5-S2。"},
    {"zh": "臀中肌", "en": "Gluteus medius", "nerve_zh": "臀上神經", "nerve_en": "Superior gluteal nerve", "root": "L4-S1", "desc": "位於臀部外側中層，負責髖關節外展並穩定單腳站立時的骨盆平衡。由臀上神經支配，神經根 L4-S1。"},
    {"zh": "臀小肌", "en": "Gluteus minimus", "nerve_zh": "臀上神經", "nerve_en": "Superior gluteal nerve", "root": "L4-S1", "desc": "位於臀中肌深層，功能類似臀中肌，協助髖外展與內旋並穩定骨盆。由臀上神經支配，神經根 L4-S1。"},
    {"zh": "闊筋膜張肌", "en": "Tensor fasciae latae", "nerve_zh": "臀上神經", "nerve_en": "Superior gluteal nerve", "root": "L4-S1", "desc": "位於大腿前外側，繃緊闊筋膜與髂脛束，協助髖關節屈曲及內旋。由臀上神經支配，神經根 L4-S1。"},
    {"zh": "股二頭肌", "en": "Biceps femoris", "nerve_zh": "坐骨神經", "nerve_en": "Sciatic nerve (tibial & fibular parts)", "root": "L5-S2", "desc": "大腿後側肌群之一，含長頭與短頭。長頭由坐骨神經的脛神經成分支配，短頭由腓神經成分支配，神經根均為 L5-S2。此肌可伸髖及屈膝。"},
    {"zh": "半腱肌", "en": "Semitendinosus", "nerve_zh": "坐骨神經", "nerve_en": "Sciatic nerve (tibial part)", "root": "L5-S2", "desc": "大腿後側肌群之一，與半膜肌一起協助伸髖、屈膝。由坐骨神經的脛神經成分支配，神經根 L5-S2。"},
    {"zh": "脛前肌", "en": "Tibialis anterior", "nerve_zh": "腓深神經", "nerve_en": "Deep peroneal nerve", "root": "L4-L5", "desc": "小腿前側肌群，負責足背屈（將腳背向上翹）及足內翻。由腓深神經支配，神經根 L4-L5。"},
    {"zh": "伸拇長肌", "en": "Extensor hallucis longus", "nerve_zh": "腓深神經", "nerve_en": "Deep peroneal nerve", "root": "L5-S1", "desc": "小腿前側肌群，負責伸直大腳趾。由腓深神經支配，神經根 L5-S1。"},
    {"zh": "伸趾長肌", "en": "Extensor digitorum longus", "nerve_zh": "腓深神經", "nerve_en": "Deep peroneal nerve", "root": "L5-S1", "desc": "小腿前側肌群，負責伸直第 2-5 腳趾。由腓深神經支配，神經根 L5-S1。"},
    {"zh": "腓骨長肌", "en": "Peroneus longus", "nerve_zh": "腓淺神經", "nerve_en": "Superficial peroneal nerve", "root": "L5-S1", "desc": "小腿外側肌群，負責足外翻並輔助足底屈（踮腳）。由腓淺神經支配，神經根 L5-S1。"},
    {"zh": "腓骨短肌", "en": "Peroneus brevis", "nerve_zh": "腓淺神經", "nerve_en": "Superficial peroneal nerve", "root": "L5-S1", "desc": "小腿外側肌群，作用與腓骨長肌相似（足外翻、輔助足底屈）。由腓淺神經支配，神經根 L5-S1。"},
    {"zh": "腓腸肌", "en": "Gastrocnemius", "nerve_zh": "脛神經", "nerve_en": "Tibial nerve", "root": "S1-S2", "desc": "小腿後側淺層肌，與比目魚肌共用跟腱。作用為足底屈（踮腳尖）並輔助屈膝。由脛神經支配，神經根 S1-S2。"},
    {"zh": "比目魚肌", "en": "Soleus", "nerve_zh": "脛神經", "nerve_en": "Tibial nerve", "root": "S1-S2", "desc": "小腿後側淺層扁肌，位於腓腸肌深層，負責足底屈，是維持站立姿勢的重要肌肉。由脛神經支配，神經根 S1-S2。"},
    {"zh": "脛後肌", "en": "Tibialis posterior", "nerve_zh": "脛神經", "nerve_en": "Tibial nerve", "root": "L4-L5", "desc": "小腿後側深層肌，負責足底屈及足內翻。由脛神經支配，神經根 L4-L5。"},
    {"zh": "屈拇長肌", "en": "Flexor hallucis longus", "nerve_zh": "脛神經", "nerve_en": "Tibial nerve", "root": "S2-S3", "desc": "小腿後側深層肌，負責屈曲大腳趾。由脛神經支配，神經根 S2-S3。"},
    {"zh": "屈趾長肌", "en": "Flexor digitorum longus", "nerve_zh": "脛神經", "nerve_en": "Tibial nerve", "root": "L5-S1", "desc": "小腿後側深層肌，負責屈曲第 2-5 腳趾。由脛神經支配，神經根 L5-S1。"},
    {"zh": "伸趾短肌", "en": "Extensor digitorum brevis", "nerve_zh": "腓深神經", "nerve_en": "Deep peroneal nerve", "root": "S1-S2", "desc": "足背小肌肉，協助伸直足趾，在足背外側可觸及肌腹。由腓深神經支配，神經根 S1-S2。"}
]

upper_nerves_data = [
    {"zh": "背肩胛神經", "en": "Dorsal scapular nerve", "root": "C5", "muscles": "肩胛提肌、菱形肌", "desc": "由頸神經根 C5（常含C4）發出，支配肩胛提肌與大、小菱形肌，控制肩胛骨上提及內收。"},
    {"zh": "胸長神經", "en": "Long thoracic nerve", "root": "C5-C7", "muscles": "前鋸肌", "desc": "來自臂神經叢根部 (C5-C7)，支配前鋸肌，將肩胛骨固定在胸壁並協助前伸肩胛骨。損傷會導致肩胛骨內側翹起（翼狀肩胛）。"},
    {"zh": "肩胛上神經", "en": "Suprascapular nerve", "root": "C5-C6", "muscles": "棘上肌、棘下肌", "desc": "源自臂神經叢上幹 (C5-C6)，經肩胛切跡進入肩胛上窩，支配棘上肌與棘下肌，協助肩關節外展起始與外旋。"},
    {"zh": "胸外側神經", "en": "Lateral pectoral nerve", "root": "C5-C7", "muscles": "胸大肌（鎖骨部）", "desc": "源自臂叢外側束 (C5-C7)，穿入胸大肌上部，支配胸大肌的鎖骨部纖維，使肩關節屈曲、內收。"},
    {"zh": "胸內側神經", "en": "Medial pectoral nerve", "root": "C8-T1", "muscles": "胸小肌、胸大肌（胸肋部）", "desc": "源自臂叢內側束 (C8-T1)，穿過胸小肌後支配胸小肌及胸大肌下部（胸肋部）纖維，協助肩胛骨穩定及肩關節內收動作。"},
    {"zh": "胸背神經", "en": "Thoracodorsal nerve", "root": "C6-C8", "muscles": "闊背肌", "desc": "源自臂叢後束 (C6-C8)，下行支配闊背肌，使肩關節伸展、內收及內旋（如引體向上動作）。"},
    {"zh": "肩胛下神經上支", "en": "Upper subscapular nerve", "root": "C5-C6", "muscles": "肩胛下肌（上部）", "desc": "源自臂叢後束 (C5-C6) 的分支，支配肩胛下肌的上半部纖維，協助肩關節內旋。"},
    {"zh": "肩胛下神經下支", "en": "Lower subscapular nerve", "root": "C5-C6", "muscles": "肩胛下肌（下部）、大圓肌", "desc": "源自臂叢後束 (C5-C6) 的另一分支，支配肩胛下肌下半部及大圓肌，負責肩關節內旋和內收動作。"},
    {"zh": "肌皮神經", "en": "Musculocutaneous nerve", "root": "C5-C7", "muscles": "肱二頭肌、肱肌、喙肱肌", "desc": "源自臂叢外側束 (C5-C7)，穿入喙肱肌並沿上臂前側下行，支配肱二頭肌、肱肌、喙肱肌（三者負責屈肘和前臂旋後）。肌皮神經的終末感覺分支為前臂外側皮神經。"},
    {"zh": "腋神經", "en": "Axillary nerve", "root": "C5-C6", "muscles": "三角肌、小圓肌", "desc": "源自臂叢後束 (C5-C6)，經四邊孔出腋後，支配三角肌和小圓肌，使肩關節外展及外旋。腋神經受損會導致肩外側麻木無力，無法平舉手臂。"},
    {"zh": "橈神經", "en": "Radial nerve", "root": "C5-T1", "muscles": "肱三頭肌、前臂伸肌群（伸腕伸指等）", "desc": "源自臂叢後束 (C5-T1)，沿肱骨後方螺旋溝下行，支配肱三頭肌及前臂所有伸肌群，控制肘、腕、手指伸直動作。橈神經受壓或損傷會引起腕垂症（無法伸腕，手下垂）。"},
    {"zh": "正中神經", "en": "Median nerve", "root": "C6-T1", "muscles": "前臂大部分屈肌、魚際肌群（拇短外展肌等）", "desc": "由臂叢外側束與內側束合併形成 (C6-T1)，經肘窩進入前臂，支配大部分前臂屈肌（除尺側屈腕肌和屈指深肌內側半）以及手掌橈側的魚際肌群和外側兩個蚓狀肌。正中神經掌管前臂旋前、手腕及前兩指屈曲、拇指對掌等精細動作，在手腕處受壓會導致腕隧道症候群。"},
    {"zh": "尺神經", "en": "Ulnar nerve", "root": "C8-T1", "muscles": "尺側前臂屈肌（尺側屈腕肌、屈指深肌內側半）、大部分手內在肌", "desc": "源自臂叢內側束 (C8-T1)，經肘部尺神經溝進入前臂，支配尺側屈腕肌及屈指深肌內側半，並負責手掌大部分內在肌（包括所有骨間肌、兩個內側蚓狀肌、拇收肌、小指肌群等）。尺神經受損常見於肘部撞擊傷，會出現爪形手姿勢和精細動作障礙。"}
]

lower_nerves_data = [
    {"zh": "股神經", "en": "Femoral nerve", "root": "L2-L4", "muscles": "股四頭肌、縫匠肌、髂肌等", "desc": "腰神經叢主要分支之一 (L2-L4)，經腹股溝韌帶下方進入股三角。支配大腿前側伸膝肌群（股四頭肌）和部分屈髖肌（縫匠肌、髂肌），負責膝伸與髖屈，是行走站立的重要神經。"},
    {"zh": "閉孔神經", "en": "Obturator nerve", "root": "L2-L4", "muscles": "大腿內收肌群（內收長肌、短肌、股薄肌等）", "desc": "腰神經叢分支 (L2-L4)，經閉鎖孔到大腿內側，支配股內側的內收肌群（內收長肌、短肌、內收大肌及股薄肌），控制髖關節內收動作。"},
    {"zh": "臀上神經", "en": "Superior gluteal nerve", "root": "L4-S1", "muscles": "臀中肌、臀小肌、闊筋膜張肌", "desc": "薦神經叢分支 (L4-S1)，經大坐骨孔梨狀肌上方出骨盆。支配臀中肌、臀小肌、闊筋膜張肌，維持單腳站立時骨盆水平和髖關節外展。損傷會出現趨避步態（Trendelenburg 徵象）。"},
    {"zh": "臀下神經", "en": "Inferior gluteal nerve", "root": "L5-S2", "muscles": "臀大肌", "desc": "薦神經叢分支 (L5-S2)，經梨狀肌下方出盆腔後進入臀部，支配臀大肌，使髖關節強力伸展（如起立、爬階）。損傷則影響站立起身等動作。"},
    {"zh": "坐骨神經", "en": "Sciatic nerve", "root": "L4-S3", "muscles": "腿後肌群（股二頭肌、半腱肌、半膜肌）及經分支支配小腿足部肌肉", "desc": "由薦神經叢發出 (L4-S3)，為全身最粗大的神經，經梨狀肌下孔出骨盆沿股後下行。在膕窩上方分為脛神經與腓總神經兩支。本幹支配大腿後側肌群（髖伸膝屈），其分支則掌管小腿和足部的運動與感覺功能。"},
    {"zh": "脛神經", "en": "Tibial nerve", "root": "L4-S3", "muscles": "小腿後側肌群（腓腸肌、比目魚肌等）及足底肌群（經足底神經）", "desc": "坐骨神經分支之一，沿小腿後側經內踝後方入足底。支配小腿後側所有屈肌（踮腳尖肌群）及足底全部肌肉（透過內、外足底神經），控制足蹠屈和趾屈動作。脛神經受損將無法足尖跛行（無法足底屈）。"},
    {"zh": "腓總神經", "en": "Common peroneal nerve", "root": "L4-S2", "muscles": "股二頭肌短頭及分支支配小腿前外側肌群", "desc": "坐骨神經的另一終末分支，繞腓骨頸後分為淺腓神經與深腓神經。本身直接支配股二頭肌短頭，分支淺腓神經支配足外翻肌群，深腓神經支配足背屈肌群。腓總神經在膝外側易受傷，損傷後會導致垂足（無法抬腳）。"},
    {"zh": "腓深神經", "en": "Deep peroneal nerve", "root": "L4-S1", "muscles": "小腿前側肌群（脛前肌、趾長伸肌等）、足背肌（伸趾短肌）", "desc": "腓總神經的分支之一，沿小腿前區走行。支配小腿前側肌群及足背的伸趾肌，負責足背屈（抬腳）和伸趾動作。深腓神經受損會引起垂足拖步。"},
    {"zh": "腓淺神經", "en": "Superficial peroneal nerve", "root": "L5-S2", "muscles": "小腿外側肌群（腓骨長肌、短肌）", "desc": "腓總神經的另一分支，支配小腿外側肌群，控制足外翻並協助足底屈動作。同時傳導足背大部分皮膚感覺。淺腓神經受損會影響足外翻力量及足背感覺。"},
    {"zh": "股外側皮神經", "en": "Lateral femoral cutaneous nerve", "root": "L2-L3", "muscles": "（感覺神經，無運動支配）", "desc": "純感覺神經，源自腰神經叢 (L2-L3)，經腹股溝韌帶外側下方穿出，支配大腿外側皮膚感覺。受壓時會導致股外側皮神經痛（Meralgia Paresthetica），表現為大腿外側麻痛。"}
]

# 應用程式標題
st.title("肌肉與神經學習 App")
st.write("本應用依據《復健及物理醫學 臨床篇》提供的肌肉-神經對照圖表，動態展示肌肉和神經的中英文名稱及相關知識。請透過下方選單選擇肌肉或神經以瀏覽詳情。")

# 建立選項頁籤
tab1, tab2 = st.tabs(["肌肉 Muscles", "神經 Nerves"])

# 肌肉頁籤內容
with tab1:
    region = st.radio("選擇部位：", ("上肢", "下肢"), horizontal=True)
    if region == "上肢":
        options = [f"{d['zh']} ({d['en']})" for d in upper_muscles_data]
        choice = st.selectbox("選擇肌肉：", options)
        # 根據選擇的名稱尋找對應資料
        data = next(item for item in upper_muscles_data if f"{item['zh']} ({item['en']})" == choice)
    else:
        options = [f"{d['zh']} ({d['en']})" for d in lower_muscles_data]
        choice = st.selectbox("選擇肌肉：", options)
        data = next(item for item in lower_muscles_data if f"{item['zh']} ({item['en']})" == choice)
    # 顯示肌肉資訊
    st.markdown(f"**肌肉名稱:** {data['zh']} (*{data['en']}*)")
    st.markdown(f"**神經支配:** {data['nerve_zh']} (*{data['nerve_en']}*), 神經根 {data['root']}")
    st.markdown(f"**簡要說明:** {data['desc']}")

# 神經頁籤內容
with tab2:
    region = st.radio("選擇部位：", ("上肢", "下肢"), horizontal=True)
    if region == "上肢":
        options = [f"{d['zh']} ({d['en']})" for d in upper_nerves_data]
        choice = st.selectbox("選擇神經：", options)
        data = next(item for item in upper_nerves_data if f"{item['zh']} ({item['en']})" == choice)
    else:
        options = [f"{d['zh']} ({d['en']})" for d in lower_nerves_data]
        choice = st.selectbox("選擇神經：", options)
        data = next(item for item in lower_nerves_data if f"{item['zh']} ({item['en']})" == choice)
    # 顯示神經資訊
    st.markdown(f"**神經名稱:** {data['zh']} (*{data['en']}*)")
    st.markdown(f"**神經根:** {data['root']}")
    st.markdown(f"**支配肌肉:** {data['muscles']}")
    st.markdown(f"**簡要說明:** {data['desc']}")
