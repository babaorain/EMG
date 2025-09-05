# app.py
import streamlit as st

st.set_page_config(page_title="EMG 臨床選肌與神經叢學習", layout="wide")

# -----------------------------
# 基礎資料：臂叢/腰薦叢結構與肌肉/神經對照
# -----------------------------

# 節點層級名稱（用於顯示與繪圖）
LEVEL_ORDER = ["Roots", "Trunk", "Division", "Cord", "Plexus", "Nerve", "Muscle"]

# 臂叢結構速記（教育用途，非完整解剖教科書）
BRACHIAL_MAP = {
    "C5": {"level": "Roots"}, "C6": {"level": "Roots"}, "C7": {"level": "Roots"},
    "C8": {"level": "Roots"}, "T1": {"level": "Roots"},
    "Upper trunk": {"level": "Trunk"}, "Middle trunk": {"level": "Trunk"}, "Lower trunk": {"level": "Trunk"},
    "Anterior division (upper)": {"level": "Division"},
    "Anterior division (middle)": {"level": "Division"},
    "Anterior division (lower)": {"level": "Division"},
    "Posterior divisions (all)": {"level": "Division"},
    "Lateral cord": {"level": "Cord"},
    "Medial cord": {"level": "Cord"},
    "Posterior cord": {"level": "Cord"},
    # Named branches / major nerves:
    "Dorsal scapular nerve": {"level": "Nerve"},
    "Long thoracic nerve": {"level": "Nerve"},
    "Suprascapular nerve": {"level": "Nerve"},
    "Lateral pectoral nerve": {"level": "Nerve"},
    "Medial pectoral nerve": {"level": "Nerve"},
    "Thoracodorsal nerve": {"level": "Nerve"},
    "Upper subscapular nerve": {"level": "Nerve"},
    "Lower subscapular nerve": {"level": "Nerve"},
    "Musculocutaneous nerve": {"level": "Nerve"},
    "Axillary nerve": {"level": "Nerve"},
    "Radial nerve": {"level": "Nerve"},
    "Median nerve": {"level": "Nerve"},
    "Ulnar nerve": {"level": "Nerve"},
}

# 腰薦叢結構速記
LUMBOSACRAL_MAP = {
    "L2": {"level": "Roots"}, "L3": {"level": "Roots"}, "L4": {"level": "Roots"},
    "L5": {"level": "Roots"}, "S1": {"level": "Roots"}, "S2": {"level": "Roots"}, "S3": {"level": "Roots"},
    "Lumbar plexus": {"level": "Plexus"},
    "Sacral plexus": {"level": "Plexus"},
    "Lumbosacral trunk (L4-L5)": {"level": "Plexus"},
    "Femoral nerve": {"level": "Nerve"},
    "Obturator nerve": {"level": "Nerve"},
    "Lateral femoral cutaneous nerve": {"level": "Nerve"},
    "Sciatic nerve": {"level": "Nerve"},
    "Tibial nerve": {"level": "Nerve"},
    "Common peroneal nerve": {"level": "Nerve"},
    "Deep peroneal nerve": {"level": "Nerve"},
    "Superficial peroneal nerve": {"level": "Nerve"},
}

# 肌肉清單（上肢）
UPPER_MUSCLES = [
    # zh, en, nerve_zh, nerve_en, roots(list), path(list of node names in order), cord/plexus hint
    {
        "zh": "三角肌", "en": "Deltoid",
        "nerve_zh": "腋神經", "nerve_en": "Axillary nerve",
        "roots": ["C5", "C6"],
        "path": ["C5", "C6", "Upper trunk", "Posterior divisions (all)", "Posterior cord", "Axillary nerve", "Deltoid"],
        "region": "Upper", "cord": "Posterior cord"
    },
    {
        "zh": "小圓肌", "en": "Teres minor",
        "nerve_zh": "腋神經", "nerve_en": "Axillary nerve",
        "roots": ["C5", "C6"],
        "path": ["C5", "C6", "Upper trunk", "Posterior divisions (all)", "Posterior cord", "Axillary nerve", "Teres minor"],
        "region": "Upper", "cord": "Posterior cord"
    },
    {
        "zh": "肱二頭肌", "en": "Biceps brachii",
        "nerve_zh": "肌皮神經", "nerve_en": "Musculocutaneous nerve",
        "roots": ["C5", "C6"],
        "path": ["C5", "C6", "Upper trunk", "Anterior division (upper)", "Lateral cord", "Musculocutaneous nerve", "Biceps brachii"],
        "region": "Upper", "cord": "Lateral cord"
    },
    {
        "zh": "肱肌", "en": "Brachialis",
        "nerve_zh": "肌皮神經", "nerve_en": "Musculocutaneous nerve",
        "roots": ["C5", "C6"],
        "path": ["C5", "C6", "Upper trunk", "Anterior division (upper)", "Lateral cord", "Musculocutaneous nerve", "Brachialis"],
        "region": "Upper", "cord": "Lateral cord"
    },
    {
        "zh": "肱三頭肌", "en": "Triceps brachii",
        "nerve_zh": "橈神經", "nerve_en": "Radial nerve",
        "roots": ["C7", "C8"],
        "path": ["C7", "C8", "Middle trunk", "Posterior divisions (all)", "Posterior cord", "Radial nerve", "Triceps brachii"],
        "region": "Upper", "cord": "Posterior cord"
    },
    {
        "zh": "肱橈肌", "en": "Brachioradialis",
        "nerve_zh": "橈神經", "nerve_en": "Radial nerve",
        "roots": ["C5", "C6"],
        "path": ["C5", "C6", "Upper trunk", "Posterior divisions (all)", "Posterior cord", "Radial nerve", "Brachioradialis"],
        "region": "Upper", "cord": "Posterior cord"
    },
    {
        "zh": "前鋸肌", "en": "Serratus anterior",
        "nerve_zh": "胸長神經", "nerve_en": "Long thoracic nerve",
        "roots": ["C5", "C6", "C7"],
        "path": ["C5", "C6", "C7", "Long thoracic nerve", "Serratus anterior"],
        "region": "Upper", "cord": None
    },
    {
        "zh": "棘上肌", "en": "Supraspinatus",
        "nerve_zh": "肩胛上神經", "nerve_en": "Suprascapular nerve",
        "roots": ["C5", "C6"],
        "path": ["C5", "C6", "Upper trunk", "Suprascapular nerve", "Supraspinatus"],
        "region": "Upper", "cord": None  # trunk branch
    },
    {
        "zh": "第一骨間背肌", "en": "First dorsal interosseous",
        "nerve_zh": "尺神經（深支）", "nerve_en": "Ulnar nerve (deep branch)",
        "roots": ["C8", "T1"],
        "path": ["C8", "T1", "Lower trunk", "Anterior division (lower)", "Medial cord", "Ulnar nerve", "First dorsal interosseous"],
        "region": "Upper", "cord": "Medial cord"
    },
    {
        "zh": "外展拇短肌", "en": "Abductor pollicis brevis",
        "nerve_zh": "正中神經（返支）", "nerve_en": "Median nerve (recurrent branch)",
        "roots": ["C8", "T1"],
        "path": ["C8", "T1", "Lower trunk", "Anterior division (lower)", "Medial cord / Lateral cord", "Median nerve", "Abductor pollicis brevis"],
        "region": "Upper", "cord": "Medial/Lateral cords"
    },
]

# 肌肉清單（下肢）
LOWER_MUSCLES = [
    {
        "zh": "股四頭肌", "en": "Quadriceps femoris",
        "nerve_zh": "股神經", "nerve_en": "Femoral nerve",
        "roots": ["L2", "L3", "L4"],
        "path": ["L2", "L3", "L4", "Lumbar plexus", "Femoral nerve", "Quadriceps femoris"],
        "region": "Lower", "plexus": "Lumbar plexus"
    },
    {
        "zh": "內收長肌", "en": "Adductor longus",
        "nerve_zh": "閉孔神經", "nerve_en": "Obturator nerve",
        "roots": ["L2", "L3", "L4"],
        "path": ["L2", "L3", "L4", "Lumbar plexus", "Obturator nerve", "Adductor longus"],
        "region": "Lower", "plexus": "Lumbar plexus"
    },
    {
        "zh": "脛前肌", "en": "Tibialis anterior",
        "nerve_zh": "腓深神經", "nerve_en": "Deep peroneal nerve",
        "roots": ["L4", "L5"],
        "path": ["L4", "L5", "Lumbosacral trunk (L4-L5)", "Sacral plexus", "Sciatic nerve", "Common peroneal nerve", "Deep peroneal nerve", "Tibialis anterior"],
        "region": "Lower", "plexus": "Sacral plexus"
    },
    {
        "zh": "腓骨長肌", "en": "Peroneus longus",
        "nerve_zh": "腓淺神經", "nerve_en": "Superficial peroneal nerve",
        "roots": ["L5", "S1"],
        "path": ["L5", "S1", "Sacral plexus", "Sciatic nerve", "Common peroneal nerve", "Superficial peroneal nerve", "Peroneus longus"],
        "region": "Lower", "plexus": "Sacral plexus"
    },
    {
        "zh": "腓腸肌", "en": "Gastrocnemius",
        "nerve_zh": "脛神經", "nerve_en": "Tibial nerve",
        "roots": ["S1", "S2"],
        "path": ["S1", "S2", "Sacral plexus", "Sciatic nerve", "Tibial nerve", "Gastrocnemius"],
        "region": "Lower", "plexus": "Sacral plexus"
    },
    {
        "zh": "伸趾短肌", "en": "Extensor digitorum brevis",
        "nerve_zh": "腓深神經", "nerve_en": "Deep peroneal nerve",
        "roots": ["S1", "S2"],
        "path": ["S1", "S2", "Sacral plexus", "Sciatic nerve", "Common peroneal nerve", "Deep peroneal nerve", "Extensor digitorum brevis"],
        "region": "Lower", "plexus": "Sacral plexus"
    },
]

# 神經詞條（部分，便於神經→肌肉檢視）
NERVE_INDEX = {
    # Upper limb
    "Axillary nerve": {
        "zh": "腋神經", "region": "Upper", "cord": "Posterior cord",
        "roots": ["C5", "C6"], "muscles": ["Deltoid", "Teres minor"],
        "path": ["C5", "C6", "Upper trunk", "Posterior divisions (all)", "Posterior cord", "Axillary nerve"]
    },
    "Musculocutaneous nerve": {
        "zh": "肌皮神經", "region": "Upper", "cord": "Lateral cord",
        "roots": ["C5", "C6", "C7"], "muscles": ["Biceps brachii", "Brachialis"],
        "path": ["C5", "C6", "Upper trunk", "Anterior division (upper)", "Lateral cord", "Musculocutaneous nerve"]
    },
    "Radial nerve": {
        "zh": "橈神經", "region": "Upper", "cord": "Posterior cord",
        "roots": ["C5","C6","C7","C8","T1"], "muscles": ["Triceps brachii", "Brachioradialis"],
        "path": ["C5","C6","C7","C8","T1", "Posterior divisions (all)", "Posterior cord", "Radial nerve"]
    },
    "Suprascapular nerve": {
        "zh": "肩胛上神經", "region": "Upper",
        "roots": ["C5","C6"], "muscles": ["Supraspinatus"],
        "path": ["C5","C6","Upper trunk","Suprascapular nerve"]
    },
    "Long thoracic nerve": {
        "zh": "胸長神經", "region": "Upper",
        "roots": ["C5","C6","C7"], "muscles": ["Serratus anterior"],
        "path": ["C5","C6","C7","Long thoracic nerve"]
    },
    "Median nerve": {
        "zh": "正中神經", "region": "Upper",
        "roots": ["C6","C7","C8","T1"], "muscles": ["Abductor pollicis brevis"],
        "path": ["C6","C7","C8","T1","Lateral cord + Medial cord","Median nerve"]
    },
    "Ulnar nerve": {
        "zh": "尺神經", "region": "Upper",
        "roots": ["C8","T1"], "muscles": ["First dorsal interosseous"],
        "path": ["C8","T1","Lower trunk","Anterior division (lower)","Medial cord","Ulnar nerve"]
    },

    # Lower limb
    "Femoral nerve": {
        "zh": "股神經", "region": "Lower", "plexus": "Lumbar plexus",
        "roots": ["L2","L3","L4"], "muscles": ["Quadriceps femoris"],
        "path": ["L2","L3","L4","Lumbar plexus","Femoral nerve"]
    },
    "Obturator nerve": {
        "zh": "閉孔神經", "region": "Lower", "plexus": "Lumbar plexus",
        "roots": ["L2","L3","L4"], "muscles": ["Adductor longus"],
        "path": ["L2","L3","L4","Lumbar plexus","Obturator nerve"]
    },
    "Deep peroneal nerve": {
        "zh": "腓深神經", "region": "Lower", "plexus": "Sacral plexus",
        "roots": ["L4","L5","S1"], "muscles": ["Tibialis anterior","Extensor digitorum brevis"],
        "path": ["L4","L5","S1","Sacral plexus","Sciatic nerve","Common peroneal nerve","Deep peroneal nerve"]
    },
    "Superficial peroneal nerve": {
        "zh": "腓淺神經", "region": "Lower", "plexus": "Sacral plexus",
        "roots": ["L5","S1"], "muscles": ["Peroneus longus"],
        "path": ["L5","S1","Sacral plexus","Sciatic nerve","Common peroneal nerve","Superficial peroneal nerve"]
    },
    "Tibial nerve": {
        "zh": "脛神經", "region": "Lower", "plexus": "Sacral plexus",
        "roots": ["L4","L5","S1","S2","S3"], "muscles": ["Gastrocnemius"],
        "path": ["L4","L5","S1","S2","S3","Sacral plexus","Sciatic nerve","Tibial nerve"]
    },
    "Sciatic nerve": {
        "zh": "坐骨神經", "region": "Lower", "plexus": "Sacral plexus",
        "roots": ["L4","L5","S1","S2","S3"], "muscles": [],
        "path": ["L4","L5","S1","S2","S3","Sacral plexus","Sciatic nerve"]
    },
}

# 快速索引
ALL_MUSCLES = UPPER_MUSCLES + LOWER_MUSCLES
MUSCLE_BY_EN = {m["en"]: m for m in ALL_MUSCLES}
MUSCLE_LABELS = {
    "Upper": [f"{m['zh']} ({m['en']})" for m in UPPER_MUSCLES],
    "Lower": [f"{m['zh']} ({m['en']})" for m in LOWER_MUSCLES],
}
NERVE_LABELS = {
    "Upper": [f"{NERVE_INDEX[k]['zh']} ({k})" for k in NERVE_INDEX if NERVE_INDEX[k]["region"] == "Upper"],
    "Lower": [f"{NERVE_INDEX[k]['zh']} ({k})" for k in NERVE_INDEX if NERVE_INDEX[k]["region"] == "Lower"],
}

# -----------------------------
# 工具：比較選肌邏輯
# -----------------------------
def roots_set(item):
    return set(item.get("roots", []))

def same_root_different_nerve(target_muscle):
    """同一/重疊根，但不同神經 → 幫助分辨 root lesion vs peripheral nerve lesion。"""
    tgt_roots = roots_set(target_muscle)
    region = target_muscle["region"]
    out = []
    for m in ALL_MUSCLES:
        if m is target_muscle or m["region"] != region:
            continue
        if roots_set(m) & tgt_roots and (m["nerve_en"] != target_muscle["nerve_en"]):
            out.append(m)
    return out[:8]

def same_nerve_different_muscle(target_muscle):
    """同神經，不同肌肉 → 幫助確認該周邊神經是否整體受損。"""
    region = target_muscle["region"]
    nerve_en = target_muscle["nerve_en"]
    out = []
    for m in ALL_MUSCLES:
        if m is target_muscle or m["region"] != region:
            continue
        if m["nerve_en"] == nerve_en:
            out.append(m)
    return out[:8]

def same_cord_or_plexus_diff_nerve(target_muscle):
    """同一 cord（上肢）或同一 plexus（下肢），但不同終末神經 → 檢視 plexus/cord level。"""
    region = target_muscle["region"]
    out = []
    if region == "Upper":
        tgt_cord = target_muscle.get("cord")
        if not tgt_cord:
            return out
        for m in ALL_MUSCLES:
            if m is target_muscle or m["region"] != "Upper":
                continue
            if m.get("cord") == tgt_cord and m["nerve_en"] != target_muscle["nerve_en"]:
                out.append(m)
    else:
        tgt_plexus = target_muscle.get("plexus")
        if not tgt_plexus:
            return out
        for m in ALL_MUSCLES:
            if m is target_muscle or m["region"] != "Lower":
                continue
            if m.get("plexus") == tgt_plexus and m["nerve_en"] != target_muscle["nerve_en"]:
                out.append(m)
    return out[:8]

# -----------------------------
# 工具：Graphviz 路徑圖
# -----------------------------
def to_graphviz_path(path_nodes, region="Upper"):
    # 選擇節點庫
    node_map = BRACHIAL_MAP if region == "Upper" else LUMBOSACRAL_MAP
    # 按 level 分組
    grouped = {lvl: [] for lvl in LEVEL_ORDER}
    for node in path_nodes:
        lvl = node_map.get(node, {}).get("level")
        # 允許「Medial cord / Lateral cord」這類混合字串
        if lvl is None:
            # 嘗試臨時猜層級
            if "cord" in node.lower():
                lvl = "Cord"
            elif "trunk" in node.lower():
                lvl = "Trunk"
            elif "division" in node.lower():
                lvl = "Division"
            elif "plexus" in node.lower():
                lvl = "Plexus"
            elif "nerve" in node.lower():
                lvl = "Nerve"
            else:
                lvl = "Roots"
        grouped[lvl].append(node)

    # 建 DOT 圖
    dot = ['digraph G {rankdir=LR; node [shape=box, fontsize=12]; splines=true; overlap=false; ranksep=0.6;}']
    # 同層橫向排列
    for lvl in LEVEL_ORDER:
        if grouped[lvl]:
            sub = ['{rank=same;']
            for n in grouped[lvl]:
                safe = n.replace('"', '')
                sub.append(f'"{safe}";')
            sub.append('}')
            dot.append(' '.join(sub))

    # 依 path 順序連線
    for i in range(len(path_nodes)-1):
        a = path_nodes[i].replace('"', '')
        b = path_nodes[i+1].replace('"', '')
        dot.append(f'"{a}" -> "{b}" [penwidth=2];')

    return "\n".join(dot)

# -----------------------------
# 側邊欄
# -----------------------------
st.sidebar.title("設定 Settings")
mode = st.sidebar.radio("操作模式", ["以肌肉為主（選肌回推）", "以神經為主（選神經下鑽）"], key="mode_radio")
region = st.sidebar.radio("部位 Region", ["Upper", "Lower"], format_func=lambda x: "上肢 Upper" if x=="Upper" else "下肢 Lower", key="region_radio")

# -----------------------------
# 主畫面
# -----------------------------
st.title("EMG 臨床選肌與神經叢學習（含上游路徑與比較選肌）")
st.caption("教育輔助用途：呈現上游 Roots/Trunk/Division/Cord/Plexus → Nerve → Muscle 路徑，並自動產生比較選肌清單，協助 root / plexus / single-nerve 的層次性判讀。")

colA, colB = st.columns([1,1])

if mode.startswith("以肌肉"):
    # 以肌肉為主
    if region == "Upper":
        choice = colA.selectbox("選擇肌肉（上肢）", MUSCLE_LABELS["Upper"], key="sel_muscle_u")
        en = choice.split("(")[-1].strip(")")
        target = MUSCLE_BY_EN.get(en)
    else:
        choice = colA.selectbox("選擇肌肉（下肢）", MUSCLE_LABELS["Lower"], key="sel_muscle_l")
        en = choice.split("(")[-1].strip(")")
        target = MUSCLE_BY_EN.get(en)

    if target:
        colA.markdown(f"### {target['zh']} (*{target['en']}*)")
        colA.markdown(f"- **神經 Nerve**：{target['nerve_zh']} (*{target['nerve_en']}*)")
        colA.markdown(f"- **神經根 Roots**：{', '.join(target['roots'])}")
        if region == "Upper" and target.get("cord"):
            colA.markdown(f"- **所屬 Cord**：{target['cord']}")
        if region == "Lower" and target.get("plexus"):
            colA.markdown(f"- **所屬 Plexus**：{target['plexus']}")

        # 路徑圖
        dot = to_graphviz_path(target["path"], region=region)
        colB.markdown("#### 上游路徑（Graphviz）")
        colB.graphviz_chart(dot, use_container_width=True)

        # 比較選肌
        st.markdown("### 推薦比較肌肉（臨床判讀導向）")
        c1, c2, c3 = st.columns(3)
        # A. 同根不同神經
        a_list = same_root_different_nerve(target)
        c1.markdown("**A. 同根/重疊 Roots，不同周邊神經**  \n→ 有助區分 **根病變 vs 單神經病變**")
        if a_list:
            for m in a_list:
                c1.write(f"- {m['zh']} (*{m['en']}*) – {m['nerve_zh']} (*{m['nerve_en']}*), Roots {', '.join(m['roots'])}")
        else:
            c1.caption("（資料集中暫無合適對照）")

        # B. 同神經不同肌肉
        b_list = same_nerve_different_muscle(target)
        c2.markdown("**B. 同一周邊神經，不同肌肉**  \n→ 有助確認 **單神經是否整體受損**")
        if b_list:
            for m in b_list:
                c2.write(f"- {m['zh']} (*{m['en']}*), Roots {', '.join(m['roots'])}")
        else:
            c2.caption("（資料集中暫無合適對照）")

        # C. 同 cord/plexus 不同終末神經
        c_list = same_cord_or_plexus_diff_nerve(target)
        c3.markdown("**C. 同 Cord / Plexus，不同終末神經**  \n→ 有助評估 **cord/plexus 層級**")
        if c_list:
            for m in c_list:
                c3.write(f"- {m['zh']} (*{m['en']}*) – {m['nerve_zh']} (*{m['nerve_en']}*)")
        else:
            c3.caption("（資料集中暫無合適對照）")

        # 臨床提示
        st.markdown("#### EMG 選肌提示（簡要）")
        tips = []
        if region == "Upper":
            tips = [
                "若懷疑 **C5–C6 radiculopathy**：加入 paraspinal（頸）與 **Deltoid (Axillary)**、**Biceps (Musculocutaneous)**；若 **Wrist/Finger extensors (Radial)** 正常，可支持非周邊單神經病變。",
                "若懷疑 **Posterior cord lesion**：同層不同神經比較（Axillary vs Radial）很關鍵：**Deltoid** 與 **Triceps/Brachioradialis** 同弱常指向 cord 級。",
                "若懷疑 **Median vs Ulnar**：以 **APB (Median)** 對 **FDI (Ulnar)**；再用 **Radial** 伸腕肌作外部對照，以排除 proximal 根病變。",
            ]
        else:
            tips = [
                "若懷疑 **L4–L5 radiculopathy**：比較 **Tibialis anterior (Deep peroneal)** 與 **Quadriceps (Femoral)**/**Adductors (Obturator)**；另加腰椎 paraspinal。",
                "若懷疑 **Common peroneal neuropathy at fibular neck**：**TA/EDB** 弱而 **Gastrocnemius (Tibial)** 正常；感覺看足背。",
                "若懷疑 **Plexopathy**：同一 Plexus（Lumbar 或 Sacral）下不同終末神經肌群同步受影響，較符合叢病變。",
            ]
        for t in tips:
            st.write("- " + t)

else:
    # 以神經為主
    labels = NERVE_LABELS[region]
    choice = st.selectbox("選擇神經", labels, key="sel_nerve")
    # 取英文名
    nerve_en = choice.split("(")[-1].strip(")")
    nerve = NERVE_INDEX.get(nerve_en)

    if nerve:
        st.markdown(f"### {nerve['zh']} (*{nerve_en}*)")
        st.markdown(f"- **Roots**：{', '.join(nerve['roots'])}")
        if region == "Upper":
            st.markdown(f"- **Cord（若適用）**：{nerve.get('cord','—')}")
        else:
            st.markdown(f"- **Plexus（若適用）**：{nerve.get('plexus','—')}")
        st.markdown(f"- **主要支配肌肉**：{', '.join(nerve['muscles']) if nerve['muscles'] else '（在下游分支）'}")

        # 路徑圖
        dot = to_graphviz_path(nerve["path"], region=region)
        st.graphviz_chart(dot, use_container_width=True)

        # 下鑽到肌肉
        st.markdown("#### 該神經常用觀察肌肉（教育用途）")
        muscs = [MUSCLE_BY_EN[m] for m in nerve["muscles"] if m in MUSCLE_BY_EN]
        if muscs:
            for m in muscs:
                st.write(f"- {m['zh']} (*{m['en']}*), Roots {', '.join(m['roots'])}")
        else:
            st.caption("（此神經之代表肌肉請於肌肉模式檢視更多項目）")

# 底部備註
st.divider()
st.caption("說明：本工具僅供學習輔助。路徑圖為簡化示意；臨床仍需結合病史、理學檢查、感覺/反射、影像與完整 EMG/NCV 設計。")
