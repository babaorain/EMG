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
