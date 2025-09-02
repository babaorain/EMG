
# EMG Needle Muscle Selector — Lower Limb (Streamlit)
# Author: ChatGPT (for Fleming Chen)
# Purpose: Quickly choose needle EMG muscles to differentiate radiculopathy, mononeuropathy, and plexopathy
# How to run:
#   1) pip install streamlit pandas
#   2) streamlit run emg_muscle_selector_app.py

import streamlit as st
import pandas as pd

st.set_page_config(page_title="EMG Muscle Selector — Lower Limb", page_icon="🦵", layout="wide")

# ----------------------------
# Data model
# ----------------------------

# Muscles database (lower limb) — concise, high-yield set
MUSCLES = [
    # Proximal trunk / paraspinals
    {"muscle": "Lumbar paraspinals", "nerve": "Dorsal rami", "roots": ["L2","L3","L4","L5","S1"], "notes": "Abnormal in radiculopathy; normal in isolated plexopathy or distal mononeuropathies.", "category": "Paraspinal"},
    # Hip flexors/adductors/abductors
    {"muscle": "Iliopsoas", "nerve": "Direct branches (L2–L3) / Femoral (Iliacus)", "roots": ["L2","L3"], "notes": "Proximal L2–3 indicator; hard to access if severe pain.", "category": "Proximal"},
    {"muscle": "Sartorius", "nerve": "Femoral", "roots": ["L2","L3"], "notes": "Pure femoral L2–3; superficial and safe.", "category": "Femoral"},
    {"muscle": "Quadriceps (Vastus medialis)", "nerve": "Femoral", "roots": ["L2","L3","L4"], "notes": "Key for femoral neuropathy vs L3/L4 radiculopathy.", "category": "Femoral"},
    {"muscle": "Adductor longus", "nerve": "Obturator", "roots": ["L2","L3","L4"], "notes": "Spared in isolated femoral neuropathy; involved in L2–4 radiculopathy/plexopathy.", "category": "Obturator"},
    {"muscle": "Gluteus medius", "nerve": "Superior gluteal", "roots": ["L5","S1"], "notes": "Excellent L5 indicator; helps separate L5 radiculopathy from peroneal neuropathy.", "category": "Gluteal"},
    {"muscle": "Tensor fasciae latae", "nerve": "Superior gluteal", "roots": ["L4","L5"], "notes": "Alternative L5 indicator.", "category": "Gluteal"},
    {"muscle": "Gluteus maximus", "nerve": "Inferior gluteal", "roots": ["L5","S1","S2"], "notes": "Proximal S1–2 indicator; large and easy to access.", "category": "Gluteal"},
    # Hamstrings
    {"muscle": "Biceps femoris (short head)", "nerve": "Common peroneal (sciatic)", "roots": ["L5","S1","S2"], "notes": "Peroneal division involvement suggests sciatic/plexus, not isolated tibial neuropathy.", "category": "Hamstrings"},
    {"muscle": "Semitendinosus", "nerve": "Tibial (sciatic)", "roots": ["L5","S1","S2"], "notes": "Tibial division hamstring.", "category": "Hamstrings"},
    # Anterior compartment (deep peroneal)
    {"muscle": "Tibialis anterior", "nerve": "Deep peroneal", "roots": ["L4","L5"], "notes": "Classic for peroneal neuropathy vs L5 radiculopathy.", "category": "Peroneal (Deep)"},
    {"muscle": "Extensor hallucis longus", "nerve": "Deep peroneal", "roots": ["L5"], "notes": "Pure L5 bias; small signal.", "category": "Peroneal (Deep)"},
    {"muscle": "Extensor digitorum longus", "nerve": "Deep peroneal", "roots": ["L5","S1"], "notes": "", "category": "Peroneal (Deep)"},
    {"muscle": "Extensor digitorum brevis", "nerve": "Deep peroneal", "roots": ["L5","S1"], "notes": "Foot intrinsic (EDB) is convenient; helps localize distal peroneal lesions.", "category": "Peroneal (Deep)"},
    # Lateral compartment (superficial peroneal)
    {"muscle": "Peroneus longus", "nerve": "Superficial peroneal", "roots": ["L5","S1"], "notes": "Weakness favors peroneal neuropathy over L5 radiculopathy if tibialis posterior is normal.", "category": "Peroneal (Superficial)"},
    {"muscle": "Peroneus brevis", "nerve": "Superficial peroneal", "roots": ["L5","S1"], "notes": "", "category": "Peroneal (Superficial)"},
    # Posterior compartment (tibial)
    {"muscle": "Tibialis posterior", "nerve": "Tibial", "roots": ["L4","L5"], "notes": "Key differentiator: affected in L5 radiculopathy but spared in common peroneal neuropathy.", "category": "Tibial"},
    {"muscle": "Flexor hallucis longus", "nerve": "Tibial", "roots": ["L5","S1","S2"], "notes": "S1 > L5; deep.", "category": "Tibial"},
    {"muscle": "Flexor digitorum longus", "nerve": "Tibial", "roots": ["L5","S1"], "notes": "", "category": "Tibial"},
    {"muscle": "Soleus", "nerve": "Tibial", "roots": ["S1","S2"], "notes": "S1 indicator; tonic activity baseline can help.", "category": "Tibial"},
    {"muscle": "Medial gastrocnemius", "nerve": "Tibial", "roots": ["S1","S2"], "notes": "Strong S1 indicator.", "category": "Tibial"},
    # Foot intrinsics (tibial branches)
    {"muscle": "Abductor hallucis", "nerve": "Medial plantar (tibial)", "roots": ["S1","S2"], "notes": "Useful for tarsal tunnel/medial plantar branch.", "category": "Foot intrinsics"},
    {"muscle": "Abductor digiti minimi (foot)", "nerve": "Lateral plantar (tibial)", "roots": ["S1","S2"], "notes": "Useful for lateral plantar branch.", "category": "Foot intrinsics"},
]

# Localization presets with recommended core and extended muscle sets
LOCALIZATION = {
    # Radiculopathies
    "L2 radiculopathy": {
        "core": ["Lumbar paraspinals", "Iliopsoas", "Sartorius"],
        "extended": ["Quadriceps (Vastus medialis)", "Adductor longus"]
    },
    "L3 radiculopathy": {
        "core": ["Lumbar paraspinals", "Quadriceps (Vastus medialis)", "Adductor longus"],
        "extended": ["Iliopsoas", "Sartorius"]
    },
    "L4 radiculopathy": {
        "core": ["Lumbar paraspinals", "Quadriceps (Vastus medialis)", "Tibialis anterior"],
        "extended": ["Adductor longus", "Tibialis posterior"]
    },
    "L5 radiculopathy": {
        "core": ["Lumbar paraspinals", "Gluteus medius", "Tibialis posterior"],
        "extended": ["Tibialis anterior", "Extensor hallucis longus", "Peroneus longus"]
    },
    "S1 radiculopathy": {
        "core": ["Lumbar paraspinals", "Medial gastrocnemius", "Gluteus maximus"],
        "extended": ["Soleus", "Peroneus longus", "Abductor hallucis"]
    },

    # Mononeuropathies
    "Femoral neuropathy": {
        "core": ["Quadriceps (Vastus medialis)", "Sartorius", "Iliopsoas"],
        "extended": ["Adductor longus"],  # should be spared; add for contrast
        "pearls": "Adductor longus (obturator) normal favors femoral neuropathy over L3/L4 radiculopathy."
    },
    "Obturator neuropathy": {
        "core": ["Adductor longus", "Gracilis" if False else "Adductor longus", "Quadriceps (Vastus medialis)"],
        "extended": ["Lumbar paraspinals", "Iliopsoas"],
        "pearls": "Quadriceps usually normal; paraspinals normal. Consider pelvic/obturator canal lesions."
    },
    "Common peroneal neuropathy (fibular head)": {
        "core": ["Tibialis anterior", "Extensor hallucis longus", "Peroneus longus"],
        "extended": ["Extensor digitorum brevis", "Biceps femoris (short head)"],
        "pearls": "Tibialis posterior should be normal; peronei weak. Consider fibular head compression."
    },
    "Deep peroneal neuropathy (anterior tarsal tunnel)": {
        "core": ["Extensor digitorum brevis", "Extensor hallucis longus", "Tibialis anterior"],
        "extended": ["Peroneus longus"],
        "pearls": "EDB often most affected/distal."
    },
    "Superficial peroneal neuropathy": {
        "core": ["Peroneus longus", "Peroneus brevis"],
        "extended": ["Tibialis anterior"],
        "pearls": "Pure eversion weakness; TA usually normal."
    },
    "Tibial neuropathy (tarsal tunnel)": {
        "core": ["Abductor hallucis", "Abductor digiti minimi (foot)"],
        "extended": ["Medial gastrocnemius"],
        "pearls": "Foot intrinsics most affected; proximal calf muscles are spared."
    },
    "Tibial neuropathy (proximal)": {
        "core": ["Medial gastrocnemius", "Soleus", "Tibialis posterior"],
        "extended": ["Abductor hallucis"],
        "pearls": "Proximal tibial lesions affect calf muscles; differentiate from S1 radiculopathy via peroneal muscles and paraspinals."
    },
    "Sciatic neuropathy": {
        "core": ["Tibialis anterior", "Medial gastrocnemius", "Biceps femoris (short head)"],
        "extended": ["Semitendinosus", "Gluteus medius"],
        "pearls": "Both tibial and peroneal division involvement; hamstring involvement common."
    },

    # Plexopathies
    "Lumbar plexopathy (L2–L4 predominant)": {
        "core": ["Iliopsoas", "Quadriceps (Vastus medialis)", "Adductor longus"],
        "extended": ["Gluteus medius"],
        "pearls": "Paraspinals typically normal; multiple nerves (femoral + obturator) involved with shared L2–4 roots."
    },
    "Lumbosacral trunk / Sacral plexopathy (L4–S1)": {
        "core": ["Gluteus medius", "Tibialis anterior", "Peroneus longus"],
        "extended": ["Medial gastrocnemius", "Tibialis posterior"],
        "pearls": "Paraspinals normal; proximal gluteal + distal peroneal pattern."
    },
    "Sacral plexopathy (S1–S2 predominant)": {
        "core": ["Medial gastrocnemius", "Soleus", "Gluteus maximus"],
        "extended": ["Hamstrings"],
        "pearls": "Paraspinals normal; tibial-division predominant."
    }
}

# Quick differentials (A vs B) → suggested discriminating muscles
DIFFS = {
    "L5 radiculopathy vs Common peroneal neuropathy": {
        "A": "L5 radiculopathy", "B": "Common peroneal neuropathy (fibular head)",
        "why": "L5 involves multiple nerves (tibial, superior gluteal) and paraspinals; peroneal neuropathy affects deep/superficial peroneal only.",
        "discriminators": [
            {"muscle": "Tibialis posterior", "favor": "L5 radiculopathy", "because": "Innervated by tibial (L4–5); abnormal in L5 radiculopathy, normal in isolated peroneal neuropathy."},
            {"muscle": "Gluteus medius", "favor": "L5 radiculopathy", "because": "Superior gluteal (L5–S1); spared in peroneal neuropathy."},
            {"muscle": "Lumbar paraspinals", "favor": "L5 radiculopathy", "because": "Denervation supports radiculopathy; normal in mononeuropathy."}
        ]
    },
    "S1 radiculopathy vs Tibial neuropathy (proximal)": {
        "A": "S1 radiculopathy", "B": "Tibial neuropathy (proximal)",
        "why": "Both affect calf muscles; look for non‑tibial S1 muscles and paraspinals.",
        "discriminators": [
            {"muscle": "Peroneus longus", "favor": "S1 radiculopathy", "because": "Superficial peroneal (L5–S1) often abnormal in S1 root, preserved in isolated tibial lesion."},
            {"muscle": "Gluteus maximus", "favor": "S1 radiculopathy", "because": "Inferior gluteal (L5–S2) may be involved with S1 root; spared in tibial neuropathy."},
            {"muscle": "Lumbar paraspinals", "favor": "S1 radiculopathy", "because": "Denervation supports radiculopathy; paraspinals normal in tibial neuropathy."}
        ]
    },
    "Femoral neuropathy vs L3/L4 radiculopathy": {
        "A": "Femoral neuropathy", "B": "L3 radiculopathy",
        "why": "Both weaken quadriceps; look for obturator and paraspinal involvement.",
        "discriminators": [
            {"muscle": "Adductor longus", "favor": "Radiculopathy", "because": "Obturator (L2–4) abnormal in radiculopathy/plexus; spared in isolated femoral neuropathy."},
            {"muscle": "Lumbar paraspinals", "favor": "Radiculopathy", "because": "Abnormal in radiculopathy; normal in femoral neuropathy."}
        ]
    },
    "Sciatic neuropathy vs L5/S1 radiculopathy": {
        "A": "Sciatic neuropathy", "B": "L5 radiculopathy",
        "why": "Sciatic affects both divisions distal to gluteal nerves; paraspinals and gluteals help.",
        "discriminators": [
            {"muscle": "Gluteus medius", "favor": "L5 radiculopathy", "because": "Superior gluteal spared in sciatic lesions."},
            {"muscle": "Biceps femoris (short head)", "favor": "Sciatic neuropathy", "because": "Peroneal division branch from sciatic; abnormal in sciatic neuropathy."},
            {"muscle": "Lumbar paraspinals", "favor": "Radiculopathy", "because": "Abnormal in root lesions, normal in sciatic neuropathy."}
        ]
    }
}

def muscles_df():
    df = pd.DataFrame(MUSCLES)
    df["roots_str"] = df["roots"].apply(lambda xs: "/".join(xs))
    return df[["muscle","nerve","roots_str","category","notes"]].rename(columns={"roots_str":"roots"})

def list_muscles(names):
    df = muscles_df()
    return df[df["muscle"].isin(names)]

# ----------------------------
# UI Helpers
# ----------------------------

def section_header(title, subtitle=None, icon="🧭"):
    cols = st.columns([1,6])
    with cols[0]:
        st.markdown(f"<div style='font-size:28px'>{icon}</div>", unsafe_allow_html=True)
    with cols[1]:
        st.markdown(f"<div style='font-size:22px; font-weight:700'>{title}</div>", unsafe_allow_html=True)
        if subtitle:
            st.markdown(f"<div style='margin-top:-8px;color:#666'>{subtitle}</div>", unsafe_allow_html=True)

def plan_add(muscle_list, why=""):
    if "plan" not in st.session_state:
        st.session_state.plan = []
    for m in muscle_list:
        st.session_state.plan.append({"muscle": m, "why": why})

def plan_view():
    if "plan" not in st.session_state or not st.session_state.plan:
        st.info("No muscles added yet. Use the selectors above to build your needle plan.")
        return
    df = pd.DataFrame(st.session_state.plan)
    df = df.groupby("muscle")["why"].apply(lambda s: "; ".join([w for w in s if w])).reset_index()
    st.dataframe(df, use_container_width=True)
    csv = df.to_csv(index=False).encode("utf-8")
    st.download_button("Download plan as CSV", data=csv, file_name="emg_muscle_plan.csv", mime="text/csv")

# ----------------------------
# Layout
# ----------------------------

st.markdown("""
<style>
/* tighten layout a bit */
.block-container {padding-top: 1.2rem; padding-bottom: 2rem;}
</style>
""", unsafe_allow_html=True)

st.title("EMG Needle Muscle Selector — Lower Limb")
st.caption("快速挑選肌肉以區分：單神經病變、神經叢病變、神經根病變。")

tab1, tab2, tab3, tab4 = st.tabs(["🔎 Quick Pick", "🧩 A vs B", "📚 Library", "📝 My Plan"])

with tab1:
    section_header("Choose a suspected localization", "Select one to see suggested core and extended muscle sets.", "🎯")
    loc = st.selectbox("Localization", list(LOCALIZATION.keys()), index=list(LOCALIZATION.keys()).index("L5 radiculopathy"))
    if loc:
        preset = LOCALIZATION[loc]
        st.subheader("Core set (3)")
        st.dataframe(list_muscles(preset["core"]), use_container_width=True)
        st.button("➕ Add CORE to plan", on_click=plan_add, args=(preset["core"], f"Core for {loc}"))
        st.subheader("Extended set (2–4)")
        ext = preset.get("extended", [])
        if ext:
            st.dataframe(list_muscles(ext), use_container_width=True)
            st.button("➕ Add EXTENDED to plan", on_click=plan_add, args=(ext, f"Extended for {loc}"))
        pearls = preset.get("pearls")
        if pearls:
            st.info(pearls)

with tab2:
    section_header("Head‑to‑head differential", "Pick a common pair to get discriminating muscles and rationale.", "⚖️")
    pair = st.selectbox("Differential pair", list(DIFFS.keys()), index=0)
    p = DIFFS[pair]
    st.write(f"**Why this comparison matters:** {p['why']}")
    disc = pd.DataFrame(p["discriminators"])
    st.dataframe(list_muscles(disc["muscle"].tolist()).merge(disc, on="muscle"), use_container_width=True)
    st.button("➕ Add discriminators to plan", on_click=plan_add, args=(disc["muscle"].tolist(), f"Discriminators for {pair}"))
    st.caption("Tip: Add paraspinals when radiculopathy is in the differential.")

with tab3:
    section_header("Searchable muscle library", "Filter by nerve, root, or name. Click rows → add to plan in the next section.", "📚")
    df = muscles_df()
    c1, c2, c3 = st.columns(3)
    with c1:
        nerve_f = st.multiselect("Peripheral nerve", sorted(df["nerve"].unique()))
    with c2:
        root_f = st.multiselect("Root(s)", ["L2","L3","L4","L5","S1","S2"])
    with c3:
        name_f = st.text_input("Name contains")
    lib = df.copy()
    if nerve_f:
        lib = lib[lib["nerve"].isin(nerve_f)]
    if root_f:
        lib = lib[lib["roots"].str.contains("|".join(root_f))]
    if name_f:
        lib = lib[lib["muscle"].str.contains(name_f, case=False)]
    st.dataframe(lib, use_container_width=True, height=380)
    add_sel = st.multiselect("Add selected muscles to plan", lib["muscle"].tolist())
    if st.button("➕ Add to plan"):
        plan_add(add_sel, "From library")

with tab4:
    section_header("My needle plan", "Your running list for this study. Export to CSV.", "📝")
    plan_view()

st.divider()
st.caption("Educational tool — not a substitute for clinical judgment. Customize sets based on patient anatomy, safety, and suspected lesion.")
