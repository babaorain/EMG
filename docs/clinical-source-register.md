# Clinical source register

This register separates product behavior from clinical knowledge. A source being listed does not mean that every statement in it has been approved for automated decision support.

## Governance rule

Before content may be marked `clinically-reviewed` or used for decision support,
every clinical catalog row, reference interval, interpretation hint, timing
statement, protocol, and inference rule must have:

- a stable knowledge ID and semantic version;
- the exact source and locator;
- population, muscle, age range, electrode, technique, and other applicability conditions;
- a short human-readable limitation;
- clinical reviewer and review date;
- tests demonstrating how the claim appears in the UI and report.

Candidate educational guidance may appear in the non-clinical prototype only
when it has a stable ID and version, an exact source link, explicit applicability
and limitation text, and a visible `clinical review pending` state. A reviewer
and review date are required before promotion to `clinically-reviewed`.

No global MUAP amplitude or duration cutoff may be applied to every muscle. Quantitative reference intervals must be selected through a versioned laboratory reference profile. When no applicable profile exists, the app records the observation but does not label it normal or abnormal from a numeric threshold.

## Tier 1 — professional guidance

1. American Spinal Injury Association / International Spinal Cord Society. [International Standards for Neurological Classification of Spinal Cord Injury (ISNCSCI), Revised 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC8152171/).
   - Current use: the 28 bilateral key sensory point landmarks from C2 through S4–5 on the independent dermatome reference page.
   - Limitation: these standardized points support reproducible sensory examination; they do not turn overlapping dermatome boundaries into a stand-alone diagnostic test.
2. American Association of Neuromuscular & Electrodiagnostic Medicine. [Reporting the Results of Nerve Conduction Studies and Needle EMG](https://www.aanem.org/docs/default-source/documents/aanem/practice/rptresultsemgncs-pdf.pdf?sfvrsn=4301b6a7_0).
   - Initial use: report structure and the requirement to describe insertional, spontaneous, and voluntary activity for every tested muscle.
3. AANEM. [Practice Toolkit: Report Sample](https://www.aanem.org/docs/default-source/documents/aanem/report-template.pdf?sfvrsn=8557dd12_1).
   - Initial use: needle EMG field inventory and 0–4+ spontaneous-activity grading vocabulary.
4. AANEM. [Key Report Checklist](https://www.aanem.org/docs/default-source/documents/aanem/practice/checklist.pdf?sfvrsn=9486ae21_2).
   - Initial use: laterality, tested structures, abnormality detail, clinical context, and report completeness.
5. AANEM Normative Data Task Force. [Establishing high-quality reference values for nerve conduction studies](https://www.aanem.org/docs/default-source/documents/aanem/practice/dillingham-et-al-2016-muscle-nerve.pdf?sfvrsn=b63cead3_0).
   - Initial use: reference-data governance principles only. NCS values and this paper's numeric intervals are outside the first needle-only implementation.
6. AANEM/AAEM. [Glossary of Terms in Electrodiagnostic Medicine](https://www.aanem.org/docs/default-source/documents/abem/technologists/glossary-of-terms-cnct-study-material.pdf?sfvrsn=f47994fb_0).
   - Candidate use: MUAP parameter definitions; CRD, myotonic, myokymic, and neuromyotonic pattern descriptions; recruitment terminology.
   - Limitation: diagnostic-sounding descriptive terms such as `giant` remain discouraged; quantitative values require a matched laboratory profile.
7. AANEM. [Grading Fibs and PSWs](https://d2e2pfwbugllxo.cloudfront.net/AANEM/pdf/8a838b96-cda8-4f68-9a54-7916e98f7849.pdf).
   - Candidate use: the visible 0–4+ ordinal grading table.
   - Limitation: the scale describes spatial density and persistence; it is not an arithmetic severity scale. Local convention still requires approval.
8. AANEM. [Needle EMG review](https://d2e2pfwbugllxo.cloudfront.net/AANEM/pdf/3d0e1b28-3427-4c85-bee6-999aedc97b4e.pdf).
   - Candidate use: pattern-recognition education and the variable timing of Fib/PSW after axonal injury.
   - Limitation: timing ranges are background only and do not drive automated clinical inference.

## Tier 2 — peer-reviewed background

1. Feinberg J. [EMG: Myths and Facts](https://pmc.ncbi.nlm.nih.gov/articles/PMC2504120/). HSS Journal. 2006.
   - Candidate use: contextual education about the variable appearance of denervation activity after axonal injury.
   - Locator: section “Electromyographic Changes After Nerve Injury.”
   - Limitation: timing ranges are educational context, not a patient-specific clock or exclusion rule.
2. Rubin DI. [Needle electromyography: Basic concepts](https://pubmed.ncbi.nlm.nih.gov/31277852/). Handbook of Clinical Neurology. 2019.
   - Candidate use: terminology and basic technique.
3. Stålberg E, et al. [Age effects on properties of motor unit action potentials](https://pubmed.ncbi.nlm.nih.gov/3178176/). Annals of Neurology. 1988.
   - Candidate use: evidence that quantitative MUAP properties depend on age and acquisition method.
4. Podnar S. [Comparison of parametric and nonparametric reference data in motor unit potential analysis](https://pubmed.ncbi.nlm.nih.gov/18816623/). Muscle & Nerve. 2008.
   - Candidate use: reference-interval methodology for quantitative MUP analysis.

## Private educational reference

1. Preston DC, Shapiro BE. *Electromyography and Neuromuscular Disorders: Clinical-Electrophysiologic-Ultrasound Correlations*. 4th ed. Elsevier; 2020. Chapter 13, “Anatomy for Needle Electromyography,” figures 13.1–13.63.
   - Current use: private, Chinese-language needle insertion guide covering innervation, positioning, activation, clinical points, cross-sectional anatomy, and nearby structures.
   - Current use: root and terminal nerve values for the 71 catalog muscles that map to the chapter 13 descriptions; tables 32.3 and 32.4 are used as a cross-check for major upper- and lower-extremity muscles.
   - Current use: private dermatome distribution maps from chapter 32, figures 32.1 and 32.2.
   - Current use: private NCV technique atlas from chapters 4, 10, and 11, covering 34 motor, sensory, mixed, comparison, late-response, and reflex entries. The 58 extracted figure panels map to figures 4.5, 10.1–10.21, and 11.1–11.12.
   - Current use: the textbook's adult reference tables are displayed as educational reference values alongside their standard distance and technique conditions.
   - Local source: user-provided PDF. Figure crops remain private assets and are not intended for public distribution.
   - Limitation: translated educational content has not been promoted to `clinically-reviewed` status and does not drive automated diagnosis. NCV limits require controlled temperature and matching technique; age, height, limb length, side-to-side comparison, and laboratory-specific reference data may supersede the displayed textbook value.

## Deferred claims

The following are intentionally not encoded as executable rules until a clinical owner approves exact wording, applicability, and sources:

- a universal number of days until fibrillation potentials or positive sharp waves appear;
- a universal time after which spontaneous activity should disappear;
- global amplitude, duration, or polyphasia thresholds across all muscles;
- a finding pattern that independently confirms or excludes radiculopathy, plexopathy, mononeuropathy, motor neuron disease, or myopathy;
- next-muscle recommendations based only on the legacy root list.

## Current prototype safeguards

- Numeric `Amplitude`, `Duration`, and `Polyphasia` values are recorded but do not receive an automatic normal/abnormal verdict.
- `>5000 µV` is not encoded as an automatic `giant` threshold.
- Four-quadrant Polyphasia sampling stores each numerator and denominator; the displayed percentage is derived and never stored separately.
- Migrated legacy percentages remain labeled `legacy_single_percent`; if new Q1–Q4 sampling begins, the old value remains as `supersededLegacyPercent`. The application never invents its denominator.
- The English report has an automated test that rejects Chinese UI text.
