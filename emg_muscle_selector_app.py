import streamlit as st

st.set_page_config(page_title="肌肉-神經學習 App", layout="centered")

# ======== 資料定義 ========

upper_muscles_data = [
    {"zh": "肩胛提肌", "en": "Levator scapulae", "nerve_zh": "背肩胛神經", "nerve_en": "Dorsal scapular nerve", "root": "C5", "desc": "提肩胛骨的肌肉，可上提肩胛骨。由背肩胛神經支配，神經根 C5。"},
    {"zh": "菱形肌", "en": "Rhomboids", "nerve_zh": "背肩胛神經", "nerve_en": "Dorsal scapular nerve", "root": "C5", "desc": "包括大、小菱形肌，拉攏肩胛骨向中線靠攏（肩胛內收）。由背肩胛神經支配，神經根 C5。"},
    {"zh": "前鋸肌", "en": "Serratus anterior", "nerve_zh": "胸長神經", "nerve_en": "Long thoracic nerve", "root": "C5-C7", "desc": "位於胸廓側方，將肩胛骨固定於胸壁並向前推舉肩胛骨。由胸長神經支配，神經根 C5-C7。"},
    {"zh": "棘上肌", "en": "Supraspinatus", "nerve_zh": "肩胛上神經", "nerve_en": "Suprascapular nerve", "root": "C5-C6", "desc": "肩旋轉袖之一，負責肩關節初始外展。由肩胛上神經支配，C5-C6。"},
    {"zh": "棘下肌", "en": "Infraspinatus", "nerve_zh": "肩胛上神經", "nerve_en": "Suprascapular nerve", "root": "C5-C6", "desc": "肩旋轉袖之一，負責肩關節外旋。由肩胛上神經支配，C5-C6。"},
    {"zh": "肩胛下肌", "en": "Subscapularis", "nerve_zh": "肩胛下神經", "nerve_en": "Subscapular nerves", "root": "C5-C6", "desc": "肩旋轉袖之一，負責肩關節內旋。由肩胛下神經上、下支支配，C5-C6。"},
    {"zh": "大圓肌", "en": "Teres major", "nerve_zh": "肩胛下神經", "nerve_en": "Lower subscapular nerve", "root": "C5-C6", "desc": "肩關節內旋與內收。由肩胛下神經下支支配，C5-C6。"},
    {"zh": "闊背肌", "en": "Latissimus dorsi", "nerve_zh": "胸背神經", "nerve_en": "Thoracodorsal nerve", "root": "C6-C8", "desc": "肩關節伸展、內收、內旋。由胸背神經支配，C6-C8。"},
    {"zh": "胸大肌", "en": "Pectoralis major", "nerve_zh": "胸外側/胸內側神經", "nerve_en": "Lateral/Medial pectoral nerves", "root": "C5-T1", "desc": "屈曲、內收、內旋肩關節。鎖骨部 C5-C7（胸外側神經）；胸肋部 C8-T1（胸內側神經）。"},
    {"zh": "胸小肌", "en": "Pectoralis minor", "nerve_zh": "胸內側神經", "nerve_en": "Medial pectoral nerve", "root": "C8-T1", "desc": "下壓並固定肩胛骨。由胸內側神經支配，C8-T1。"},
    {"zh": "三角肌", "en": "Deltoid", "nerve_zh": "腋神經", "nerve_en": "Axillary nerve", "root": "C5-C6", "desc": "肩外展（>15°）、前束屈肩、後束伸肩。腋神經 C5-C6。"},
    {"zh": "小圓肌", "en": "Teres minor", "nerve_zh": "腋神經", "nerve_en": "Axillary nerve", "root": "C5-C6", "desc": "肩外旋。腋神經 C5-C6。"},
    {"zh": "肱二頭肌", "en": "Biceps brachii", "nerve_zh": "肌皮神經", "nerve_en": "Musculocutaneous nerve", "root": "C5-C6", "desc": "屈肘與旋後。肌皮神經 C5-C6。"},
    {"zh": "肱肌", "en": "Brachialis", "nerve_zh": "肌皮神經", "nerve_en": "Musculocutaneous nerve", "root": "C5-C6", "desc": "主動屈肘。肌皮神經 C5-C6。"},
    {"zh": "喙肱肌", "en": "Coracobrachialis", "nerve_zh": "肌皮神經", "nerve_en": "Musculocutaneous nerve", "root": "C5-C7", "desc": "屈肩、內收。肌皮神經 C5-C7。"},
    {"zh": "肱三頭肌", "en": "Triceps brachii", "nerve_zh": "橈神經", "nerve_en": "Radial nerve", "root": "C7-C8", "desc": "伸肘。橈神經 C7-C8。"},
    {"zh": "肘肌", "en": "Anconeus", "nerve_zh": "橈神經", "nerve_en": "Radial nerve", "root": "C7-C8", "desc": "協助伸肘。橈神經 C7-C8。"},
    {"zh": "肱橈肌", "en": "Brachioradialis", "nerve_zh": "橈神經", "nerve_en": "Radial nerve", "root": "C5-C6", "desc": "前臂中立位屈肘。橈神經 C5-C6。"},
    {"zh": "旋後肌", "en": "Supinator", "nerve_zh": "橈神經（深支）", "nerve_en": "Radial nerve (deep branch)", "root": "C5-C6", "desc": "前臂旋後。橈神經深支 C5-C6。"},
    {"zh": "橈側伸腕長肌", "en": "Extensor carpi radialis longus", "nerve_zh": "橈神經", "nerve_en": "Radial nerve", "root": "C6-C7", "desc": "伸腕、外展。橈神經 C6-C7。"},
    {"zh": "橈側伸腕短肌", "en": "Extensor carpi radialis brevis", "nerve_zh": "橈神經（深支）", "nerve_en": "Radial nerve (deep branch)", "root": "C7-C8", "desc": "伸腕、外展。後骨間神經 C7-C8。"},
    {"zh": "尺側伸腕肌", "en": "Extensor carpi ulnaris", "nerve_zh": "橈神經（深支）", "nerve_en": "Radial nerve (deep branch)", "root": "C7-C8", "desc": "伸腕、內收。後骨間神經 C7-C8。"},
    {"zh": "伸指總肌", "en": "Extensor digitorum", "nerve_zh": "橈神經（深支）", "nerve_en": "Radial nerve (deep branch)", "root": "C7-C8", "desc": "伸 2–5 指。後骨間神經 C7-C8。"},
    {"zh": "旋前圓肌", "en": "Pronator teres", "nerve_zh": "正中神經", "nerve_en": "Median nerve", "root": "C6-C7", "desc": "前臂旋前、輔助屈肘。正中神經 C6-C7。"},
    {"zh": "橈側屈腕肌", "en": "Flexor carpi radialis", "nerve_zh": "正中神經", "nerve_en": "Median nerve", "root": "C6-C7", "desc": "屈腕、橈偏。正中神經 C6-C7。"},
    {"zh": "掌長肌", "en": "Palmaris longus", "nerve_zh": "正中神經", "nerve_en": "Median nerve", "root": "C7-T1", "desc": "屈腕、繃緊掌腱膜。正中神經 C7-T1。"},
    {"zh": "屈指淺肌", "en": "Flexor digitorum superficialis", "nerve_zh": "正中神經", "nerve_en": "Median nerve", "root": "C7-T1", "desc": "屈 PIP。正中神經 C7-T1。"},
    {"zh": "屈指深肌", "en": "Flexor digitorum profundus", "nerve_zh": "正中/尺神經", "nerve_en": "Median/Ulnar nerves", "root": "C8-T1", "desc": "屈 DIP。外側半正中、內側半尺神經 C8-T1。"},
    {"zh": "屈拇長肌", "en": "Flexor pollicis longus", "nerve_zh": "正中神經（骨間前）", "nerve_en": "Median nerve (anterior interosseous)", "root": "C7-C8", "desc": "屈拇指末節。骨間前神經 C7-C8。"},
    {"zh": "旋前方肌", "en": "Pronator quadratus", "nerve_zh": "正中神經（骨間前）", "nerve_en": "Median nerve (anterior interosseous)", "root": "C8-T1", "desc": "遠端旋前主力。骨間前神經 C8-T1。"},
    {"zh": "尺側屈腕肌", "en": "Flexor carpi ulnaris", "nerve_zh": "尺神經", "nerve_en": "Ulnar nerve", "root": "C8-T1", "desc": "屈腕、尺偏。尺神經 C8-T1。"},
    {"zh": "外展拇短肌", "en": "Abductor pollicis brevis", "nerve_zh": "正中神經（返支）", "nerve_en": "Median nerve (recurrent branch)", "root": "C8-T1", "desc": "魚際肌，外展拇。正中神經返支 C8-T1。"},
    {"zh": "第一骨間背肌", "en": "First dorsal interosseous", "nerve_zh": "尺神經（深支）", "nerve_en": "Ulnar nerve (deep branch)", "root": "C8-T1", "desc": "食/中指外展。尺神經深支 C8-T1。"},
]

lower_muscles_data = [
    {"zh": "股四頭肌", "en": "Quadriceps femoris", "nerve_zh": "股神經", "nerve_en": "Femoral nerve", "root": "L2-L4", "desc": "伸膝主力（四部分）。股神經 L2-L4。"},
    {"zh": "縫匠肌", "en": "Sartorius", "nerve_zh": "股神經", "nerve_en": "Femoral nerve", "root": "L2-L3", "desc": "屈髖、屈膝、外旋（盤腿）。股神經 L2-L3。"},
    {"zh": "恥骨肌", "en": "Pectineus", "nerve_zh": "股神經", "nerve_en": "Femoral nerve (± Obturator)", "root": "L2-L3", "desc": "屈髖、內收。多由股神經（部分人閉孔神經）L2-L3。"},
    {"zh": "內收長肌", "en": "Adductor longus", "nerve_zh": "閉孔神經", "nerve_en": "Obturator nerve", "root": "L2-L4", "desc": "內收髖。閉孔神經 L2-L4。"},
    {"zh": "內收短肌", "en": "Adductor brevis", "nerve_zh": "閉孔神經", "nerve_en": "Obturator nerve", "root": "L2-L4", "desc": "內收髖。閉孔神經 L2-L4。"},
    {"zh": "內收大肌", "en": "Adductor magnus", "nerve_zh": "閉孔/坐骨（脛）", "nerve_en": "Obturator / Sciatic (tibial)", "root": "L2-L4; L4-S3", "desc": "前部內收（閉孔 L2-L4），後部伸髖（脛成分 L4-S3）。"},
    {"zh": "股薄肌", "en": "Gracilis", "nerve_zh": "閉孔神經", "nerve_en": "Obturator nerve", "root": "L2-L3", "desc": "內收髖、輔助屈膝。閉孔 L2-L3。"},
    {"zh": "臀大肌", "en": "Gluteus maximus", "nerve_zh": "臀下神經", "nerve_en": "Inferior gluteal nerve", "root": "L5-S2", "desc": "強力伸髖（起立、爬階）。臀下 L5-S2。"},
    {"zh": "臀中肌", "en": "Gluteus medius", "nerve_zh": "臀上神經", "nerve_en": "Superior gluteal nerve", "root": "L4-S1", "desc": "外展、穩骨盆。臀上 L4-S1。"},
    {"zh": "臀小肌", "en": "Gluteus minimus", "nerve_zh": "臀上神經", "nerve_en": "Superior gluteal nerve", "root": "L4-S1", "desc": "外展、內旋、穩骨盆。臀上 L4-S1。"},
    {"zh": "闊筋膜張肌", "en": "Tensor fasciae latae", "nerve_zh": "臀上神經", "nerve_en": "Superior gluteal nerve", "root": "L4-S1", "desc": "張緊髂脛束、屈髖內旋。臀上 L4-S1。"},
    {"zh": "股二頭肌", "en": "Biceps femoris", "nerve_zh": "坐骨神經", "nerve_en": "Sciatic (tibial & fibular parts)", "root": "L5-S2", "desc": "伸髖、屈膝。長頭脛成分、短頭腓成分 L5-S2。"},
    {"zh": "半腱肌", "en": "Semitendinosus", "nerve_zh": "坐骨（脛）", "nerve_en": "Sciatic (tibial)", "root": "L5-S2", "desc": "伸髖、屈膝。脛成分 L5-S2。"},
    {"zh": "脛前肌", "en": "Tibialis anterior", "nerve_zh": "腓深神經", "nerve_en": "Deep peroneal nerve", "root": "L4-L5", "desc": "足背屈、內翻。深腓 L4-L5。"},
    {"zh": "伸拇長肌", "en": "Extensor hallucis longus", "nerve_zh": "腓深神經", "nerve_en": "Deep peroneal nerve", "root": "L5-S1", "desc": "伸拇趾。深腓 L5-S1。"},
    {"zh": "伸趾長肌", "en": "Extensor digitorum longus", "nerve_zh": "腓深神經", "nerve_en": "Deep peroneal nerve", "root": "L5-S1", "desc": "伸 2–5 趾。深腓 L5-S1。"},
    {"zh": "腓骨長肌", "en": "Peroneus longus", "nerve_zh": "腓淺神經", "nerve_en": "Superficial peroneal nerve", "root": "L5-S1", "desc": "外翻、輔助足底屈。淺腓 L5-S1。"},
    {"zh": "腓骨短肌", "en": "Peroneus brevis", "nerve_zh": "腓淺神經", "nerve_en": "Superficial peroneal nerve", "root": "L5-S1", "desc": "外翻、輔助足底屈。淺腓 L5-S1。"},
    {"zh": "腓腸肌", "en": "Gastrocnemius", "nerve_zh": "脛神經", "nerve_en": "Tibial nerve", "root": "S1-S2", "desc": "足底屈、輔助屈膝。脛神經 S1-S2。"},
    {"zh": "比目魚肌", "en": "Soleus", "nerve_zh": "脛神經", "nerve_en": "Tibial nerve", "root": "S1-S2", "desc": "足底屈、姿勢肌。脛神經 S1-S2。"},
    {"zh": "脛後肌", "en": "Tibialis posterior", "nerve_zh": "脛神經", "nerve_en": "Tibial nerve", "root": "L4-L5", "desc": "足底屈、內翻。脛神經 L4-L5。"},
    {"zh": "屈拇長肌", "en": "Flexor hallucis longus", "nerve_zh": "脛神經", "nerve_en": "Tibial nerve", "root": "S2-S3", "desc": "屈拇趾。脛神經 S2-S3。"},
    {"zh": "屈趾長肌", "en": "Flexor digitorum longus", "nerve_zh": "脛神經", "nerve_en": "Tibial nerve", "root": "L5-S1", "desc": "屈 2–5 趾。脛神經 L5-S1。"},
    {"zh": "伸趾短肌", "en": "Extensor digitorum brevis", "nerve_zh": "腓深神經", "nerve_en": "Deep peroneal nerve", "root": "S1-S2", "desc": "足背小肌，協助伸趾。深腓 S1-S2。"},
]

upper_nerves_data = [
    {"zh": "背肩胛神經", "en": "Dorsal scapular nerve", "root": "C5", "muscles": "肩胛提肌、菱形肌", "desc": "C5（常含C4）→肩胛提肌、菱形肌；上提與內收肩胛。"},
    {"zh": "胸長神經", "en": "Long thoracic nerve", "root": "C5-C7", "muscles": "前鋸肌", "desc": "臂叢根部 C5–C7 → 前鋸肌；損傷見翼狀肩胛。"},
    {"zh": "肩胛上神經", "en": "Suprascapular nerve", "root": "C5-C6", "muscles": "棘上肌、棘下肌", "desc": "上幹 C5–C6 → 棘上/下肌；外展起始、外旋。"},
    {"zh": "胸外側神經", "en": "Lateral pectoral nerve", "root": "C5-C7", "muscles": "胸大肌（鎖骨部）", "desc": "外側束 C5–C7 → 胸大肌上部；屈肩、內收。"},
    {"zh": "胸內側神經", "en": "Medial pectoral nerve", "root": "C8-T1", "muscles": "胸小肌、胸大肌（胸肋部）", "desc": "內側束 C8–T1 → 胸小肌/胸大肌下部。"},
    {"zh": "胸背神經", "en": "Thoracodorsal nerve", "root": "C6-C8", "muscles": "闊背肌", "desc": "後束 C6–C8 → 闊背肌；伸、內收、內旋。"},
    {"zh": "肩胛下神經上支", "en": "Upper subscapular nerve", "root": "C5-C6", "muscles": "肩胛下肌（上部）", "desc": "後束 C5–C6 → 肩胛下肌上半。"},
    {"zh": "肩胛下神經下支", "en": "Lower subscapular nerve", "root": "C5-C6", "muscles": "肩胛下肌（下部）、大圓肌", "desc": "後束 C5–C6 → 肩胛下肌下半、大圓肌。"},
    {"zh": "肌皮神經", "en": "Musculocutaneous nerve", "root": "C5-C7", "muscles": "肱二頭肌、肱肌、喙肱肌", "desc": "外側束 → 上臂前群；屈肘/旋後。"},
    {"zh": "腋神經", "en": "Axillary nerve", "root": "C5-C6", "muscles": "三角肌、小圓肌", "desc": "後束 → 三角/小圓；三角區受損→肩外側麻、外展弱。"},
    {"zh": "橈神經", "en": "Radial nerve", "root": "C5-T1", "muscles": "肱三頭肌、前臂伸肌群", "desc": "後束 → 伸肌群；受損腕垂。"},
    {"zh": "正中神經", "en": "Median nerve", "root": "C6-T1", "muscles": "前臂大部分屈肌、魚際群", "desc": "外側+內側束合併；腕隧道受壓常見。"},
    {"zh": "尺神經", "en": "Ulnar nerve", "root": "C8-T1", "muscles": "尺側屈肌、手內在肌（多數）", "desc": "內側束；受損可見爪形手、精細動作差。"},
]

lower_nerves_data = [
    {"zh": "股神經", "en": "Femoral nerve", "root": "L2-L4", "muscles": "股四頭肌、縫匠肌、髂肌等", "desc": "腰叢主幹；伸膝、屈髖主力。"},
    {"zh": "閉孔神經", "en": "Obturator nerve", "root": "L2-L4", "muscles": "大腿內收群", "desc": "通閉鎖孔；內收髖。"},
    {"zh": "臀上神經", "en": "Superior gluteal nerve", "root": "L4-S1", "muscles": "臀中/小肌、闊筋膜張肌", "desc": "維持單腳站立骨盆水平；損傷見 Trendelenburg。"},
    {"zh": "臀下神經", "en": "Inferior gluteal nerve", "root": "L5-S2", "muscles": "臀大肌", "desc": "強力伸髖。"},
    {"zh": "坐骨神經", "en": "Sciatic nerve", "root": "L4-S3", "muscles": "腿後群；分脛/腓總支配小腿足部", "desc": "全身最粗；於膕窩上方分支。"},
    {"zh": "脛神經", "en": "Tibial nerve", "root": "L4-S3", "muscles": "小腿後群、足底肌群", "desc": "足底屈、趾屈與足底肌群。"},
    {"zh": "腓總神經", "en": "Common peroneal nerve", "root": "L4-S2", "muscles": "股二頭肌短頭及分支小腿前外側群", "desc": "繞腓骨頸最易傷；傷後垂足。"},
    {"zh": "腓深神經", "en": "Deep peroneal nerve", "root": "L4-S1", "muscles": "小腿前群、足背肌", "desc": "足背屈、伸趾。"},
    {"zh": "腓淺神經", "en": "Superficial peroneal nerve", "root": "L5-S2", "muscles": "小腿外側群", "desc": "足外翻、足背感覺。"},
    {"zh": "股外側皮神經", "en": "Lateral femoral cutaneous nerve", "root": "L2-L3", "muscles": "（感覺神經）", "desc": "Meralgia paresthetica 常見壓迫。"},
]

# ======== 介面 ========

st.title("肌肉與神經學習 App")
st.write("動態瀏覽肌肉與神經的**中英文名稱**與**支配/功能**，用於肌電圖學習輔助（不含測驗與訊號模擬）。")

tab1, tab2 = st.tabs(["肌肉 Muscles", "神經 Nerves"])

with tab1:
    region_m = st.radio("選擇部位：", ("上肢", "下肢"), horizontal=True, key="region_muscle")
    if region_m == "上肢":
        options_m = [f"{d['zh']} ({d['en']})" for d in upper_muscles_data]
        choice_m = st.selectbox("選擇肌肉：", options_m, key="muscle_select")
        data_m = next(item for item in upper_muscles_data if f"{item['zh']} ({item['en']})" == choice_m)
    else:
        options_m = [f"{d['zh']} ({d['en']})" for d in lower_muscles_data]
        choice_m = st.selectbox("選擇肌肉：", options_m, key="muscle_select_lower")
        data_m = next(item for item in lower_muscles_data if f"{item['zh']} ({item['en']})" == choice_m)

    st.markdown(f"### {data_m['zh']} (*{data_m['en']}*)")
    st.markdown(f"- **神經 Nerve:** {data_m['nerve_zh']} (*{data_m['nerve_en']}*)")
    st.markdown(f"- **神經根 Roots:** {data_m['root']}")
    with st.expander("說明 / Description"):
        st.write(data_m["desc"])

with tab2:
    region_n = st.radio("選擇部位：", ("上肢", "下肢"), horizontal=True, key="region_nerve")
    if region_n == "上肢":
        options_n = [f"{d['zh']} ({d['en']})" for d in upper_nerves_data]
        choice_n = st.selectbox("選擇神經：", options_n, key="nerve_select")
        data_n = next(item for item in upper_nerves_data if f"{item['zh']} ({item['en']})" == choice_n)
    else:
        options_n = [f"{d['zh']} ({d['en']})" for d in lower_nerves_data]
        choice_n = st.selectbox("選擇神經：", options_n, key="nerve_select_lower")
        data_n = next(item for item in lower_nerves_data if f"{item['zh']} ({item['en']})" == choice_n)

    st.markdown(f"### {data_n['zh']} (*{data_n['en']}*)")
    st.markdown(f"- **神經根 Roots:** {data_n['root']}")
    st.markdown(f"- **支配肌肉 Innervation:** {data_n['muscles']}")
    with st.expander("說明 / Description"):
        st.write(data_n["desc"])
