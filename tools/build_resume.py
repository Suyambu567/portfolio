# -*- coding: utf-8 -*-
"""ATS resume for S. Suyambulingaraj - AI/ML Engineer.

Single column, standard Helvetica, no tables, no graphics, no text boxes: the
shapes ATS parsers read reliably. Every claim comes from the project
repositories or the previous resume; nothing here is inferred.

Employment history is verified from the LinkedIn profile supplied by the owner.
Historical job titles are recorded exactly as held - a past title is a fact, not
a positioning statement. Roles with no supplied responsibilities carry metadata
only; nothing is invented to fill them.

Usage
-----
    python3 tools/build_resume.py                       # rebuild the public PDF + TXT
    python3 tools/build_resume.py out.pdf               # write somewhere else
    python3 tools/build_resume.py out.pdf --phone NNNN  # private copy, with a phone number

The phone number is NOT stored in this file and is not in the repository. The
public PDF is served from a public URL, so anything in it is published rather
than handed to one recruiter; contact routes there are email, LinkedIn and
GitHub. Pass --phone only when writing a private copy OUTSIDE this repository,
and never commit the result.
"""
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.lib.colors import HexColor
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer,
                                HRFlowable, KeepTogether, PageBreak)

def _args(argv):
    """Positional output path, plus an optional --phone value."""
    out, phone, rest = "Suyambulingaraj_Resume_ATS.pdf", None, []
    i = 1
    while i < len(argv):
        if argv[i] == "--phone" and i + 1 < len(argv):
            phone = argv[i + 1]; i += 2; continue
        rest.append(argv[i]); i += 1
    if rest:
        out = rest[0]
    return out, phone


OUT, PHONE = _args(sys.argv)

NAME  = "S. Suyambulingaraj"
TITLE = "AI/ML Engineer"
INK   = HexColor("#111111")
RULE  = HexColor("#444444")

# ---------------------------------------------------------------- content ---

# The first contact line is assembled at build time so that no phone number is
# ever stored in this file or in the repository. Without --phone the public
# résumé carries location and email only.
def contact_lines(phone=None):
    first = "Chennai, Tamil Nadu, India &nbsp;|&nbsp; suyambulingaraj7@gmail.com"
    if phone:
        first += " &nbsp;|&nbsp; " + phone
    return [first,
            "linkedin.com/in/suyambulingaraj-s-165590250 &nbsp;|&nbsp; github.com/Suyambu567"]


CONTACT = contact_lines()

SUMMARY = (
    "AI/ML Engineer at XMEDIA Solutions, building AI-powered applications across machine learning, "
    "NLP and large language models. Fine-tuned Whisper ASR with LoRA for code-mixed Tamil-English "
    "speech and served it through a real-time WebSocket voice pipeline; implemented Byte Pair Encoding "
    "from scratch against Tamil Unicode; built an imbalance-aware XGBoost classifier reported against "
    "its majority-class baseline rather than accuracy alone. Works across model training, evaluation, "
    "and the FastAPI and WebSocket backends that serve them. B.E. Computer Science and Engineering, 2025."
)

SKILLS = [
    ("Languages", "Python, JavaScript"),
    ("Machine Learning", "Scikit-learn, XGBoost, Random Forest, LoRA / PEFT fine-tuning, "
                         "class imbalance handling, cross-validation, model evaluation, baseline comparison"),
    ("Speech &amp; Voice AI", "Whisper, ASR / speech recognition, CTranslate2, text-to-speech, "
                              "WebRTC voice activity detection, real-time audio streaming"),
    ("NLP &amp; LLM Applications", "BPE tokenization, Tamil NLP, Tamil Unicode processing, "
                                   "code-mixed (Tanglish) NLP, TF-IDF, feature engineering, LLM integration, "
                                   "prompt engineering, intent classification, slot filling, dialogue state management"),
    ("Backend &amp; Data", "FastAPI, REST APIs, WebSocket, Pydantic, asynchronous Python services, "
                           "Pandas, NumPy, data preprocessing, feature extraction, evaluation metrics"),
    ("Tools", "Git, GitHub, GitHub Actions, pytest, Flutter, YAML, JSON, Jupyter Notebook, Google Colab"),
]

# Verified from the LinkedIn profile supplied by the owner.
# (role, organisation, employment type, location, dates, [bullets])
# Roles are recorded exactly as held. XMEDIA bullets restate the LinkedIn
# description without embellishment and carry no metrics, because none were
# supplied. MSL is metadata only: no responsibilities were provided, and none
# are invented. Elevate Labs keeps its actual "Data Analyst" title - historical
# job titles are facts, not positioning.
EXPERIENCE = [
    ("AI/ML Engineer", "XMEDIA Solutions", "Full-time",
     "Chennai, Tamil Nadu, India &middot; On-site", "May 2026 &ndash; Present", [
      "Build AI-powered applications spanning artificial intelligence, machine learning, natural "
      "language processing, large language models and generative AI.",
      "Work across RAG pipelines, LLM integration, prompt engineering, model fine-tuning, AI agents, "
      "and speech-to-text and text-to-speech, combining machine learning models, LLMs, retrieval "
      "systems and real-time voice technologies to solve real-world problems.",
     ]),
    ("Engineer Intern", "MSL Infotech India Pvt. Ltd.", "Internship",
     "Chennai, Tamil Nadu, India &middot; On-site", "Dec 2025 &ndash; May 2026", []),
    ("Data Analyst", "Elevate Labs", "Internship",
     "Remote", "Jan 2025 &ndash; Mar 2025", [
      "Performed data collection, cleaning and preprocessing on real-world datasets, and conducted "
      "exploratory data analysis (EDA) to identify trends and patterns.",
      "Queried, transformed and analysed data with Python (Pandas) and SQL, and built Excel dashboards "
      "and visual reports presenting insights that supported data-driven business decisions.",
     ]),
]

LINKS = [
    "linkedin.com/in/suyambulingaraj-s-165590250 &nbsp;|&nbsp; github.com/Suyambu567",
    "github.com/Suyambu567/Tamil-BPE-Tokenizer &nbsp;|&nbsp; github.com/Suyambu567/FAKE_USER_DEC",
]

PROJECTS = [
    {
     "n": "01",
     "t": "Citizen Complaint Voice Assistant",
     "k": "End-to-End Voice AI / LLM Application",
     "tech": "Python, Whisper, LoRA / PEFT, CTranslate2, WebRTC VAD, WebSocket, LLM, text-to-speech, "
             "Flutter, pytest &mdash; private repository; no source or infrastructure disclosed",
     "b": [
      "Built an end-to-end spoken-dialogue system carrying a citizen's civic complaint from speech to a "
      "routed, ticketed record without a form, in code-mixed Tamil-English (Tanglish); every off-the-shelf "
      "ASR tested transliterated the English words into Tamil script and corrupted downstream routing.",
      "Implemented the real-time voice server: WebSocket audio streaming, WebRTC voice activity detection "
      "for turn-taking on 20 ms frames, Whisper-medium fine-tuned with LoRA and served through CTranslate2, "
      "an LLM plus rule-based intent and location layer over 24 civic issue categories, follow-up "
      "questioning for a missing area or street, routing across 25 departments, neural text-to-speech for "
      "the spoken Tamil reply, and a pytest harness asserting the filed record rather than that the code ran.",
      "Cut word error rate from 80.1% to 55.0% and character error rate from 77.2% to 39.4% on 89 held-out "
      "clips in the first LoRA fine-tuning round; a second round reached 46.6% WER and 30.8% CER on 107 "
      "clips, and raised English words correctly kept in Latin script from 0% to 38.5%, at 0.533 s average "
      "serving latency (1.091 s p95, real-time factor 0.139).",
     ]},
    {
     "n": "02",
     "t": "Tamil BPE Tokenizer",
     "k": "Tamil NLP",
     "tech": "Python, Byte Pair Encoding, Tamil Unicode, YAML, JSON &mdash; "
             "github.com/Suyambu567/Tamil-BPE-Tokenizer",
     "b": [
      "Tamil is agglutinative and composes each written character from a consonant plus a dependent vowel "
      "sign, so a naive tokenizer splits inside grapheme clusters and yields pieces that are not linguistic "
      "units, while word-level tokenization explodes the vocabulary.",
      "Implemented Byte Pair Encoding from first principles in plain Python with no tokenizer library: "
      "vocabulary construction, adjacent-pair frequency statistics, best-pair selection and iterative merge "
      "application, the encoder that replays learned merges over unseen text, the decoder, JSON merge-rule "
      "persistence with Unicode preserved, a Tamil Unicode validator over the U+0B80-U+0BFF block, "
      "token-to-ID vocabulary mapping, and YAML-driven config for reproducible runs.",
      "Trained on a demonstration corpus for 50 merges: the earliest rules learned join a consonant to its "
      "pulli and then to a following consonant, recovering Tamil's own orthographic units from frequency "
      "alone with no grammar encoded; encoding unseen text exposes the single-token memorisation that "
      "overfitting a small corpus produces.",
     ]},
    {
     "n": "03",
     "t": "Fake User Detection",
     "k": "Machine Learning / NLP",
     "tech": "Python, Scikit-learn, XGBoost, Random Forest, TF-IDF, FastAPI, Pydantic, JavaScript "
             "&mdash; github.com/Suyambu567/FAKE_USER_DEC",
     "b": [
      "Detecting fake social profiles from account metadata is a class-imbalanced binary classification "
      "problem in which accuracy alone is uninformative: a majority-class guesser already scores well above "
      "50%, so every figure is reported against that baseline.",
      "Engineered profile, behavioural and textual features and encoded them in a fitted ColumnTransformer "
      "combining StandardScaler, TF-IDF over the bio and one-hot encoding; applied class-imbalance handling "
      "only after the train/test split; trained XGBoost with imbalance-strategy selection, and added a test "
      "asserting the training and serving feature frames are identical column for column, since both call "
      "one shared feature-building function; served it through a FastAPI service with Pydantic validation "
      "and model-version checking, and exported a smaller Random Forest to JSON re-implemented in vanilla "
      "JavaScript to run in-browser with no backend.",
      "Reached 0.9409 accuracy against a 0.6337 majority-class baseline, a lift of +0.3072, with F1 0.9179, "
      "ROC-AUC 0.9331 and 5-fold cross-validation 0.9400 &plusmn; 0.0018 on 10,000 held-out profiles; the "
      "256 KB in-browser model scored 0.9342 against a 0.6312 baseline. A control run on randomly "
      "shuffled labels scored 0.5110 against a 0.5045 baseline, confirming signal rather than leakage. "
      "Both models are evaluated on synthetic data, not a sample of real accounts.",
     ]},
]

EDUCATION = [("B.E. Computer Science and Engineering", "2025",
              "Mahendra Engineering College, Salem, Tamil Nadu")]

CERTIFICATIONS = ("Python Programming Certificate &nbsp;|&nbsp; SQL for Data Analytics Certificate "
                  "&nbsp;|&nbsp; Power BI / Tableau Certification")

LANGUAGES = "Tamil (Native) &nbsp;|&nbsp; English (Professional)"

# ----------------------------------------------------------------- styles ---

def styles(body_size, lead, gap):
    s = {}
    s["name"] = ParagraphStyle("name", fontName="Helvetica-Bold", fontSize=18,
                               leading=21, textColor=INK, spaceAfter=1)
    s["title"] = ParagraphStyle("title", fontName="Helvetica", fontSize=11,
                                leading=13, textColor=INK, spaceAfter=3)
    s["contact"] = ParagraphStyle("contact", fontName="Helvetica", fontSize=8.4,
                                  leading=10.4, textColor=INK)
    s["h2"] = ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=9.6,
                             leading=11.5, textColor=INK, spaceBefore=gap,
                             spaceAfter=1.5)
    s["body"] = ParagraphStyle("body", fontName="Helvetica", fontSize=body_size,
                               leading=lead, textColor=INK, alignment=TA_JUSTIFY)
    s["proj"] = ParagraphStyle("proj", fontName="Helvetica-Bold", fontSize=body_size + 0.4,
                               leading=lead, textColor=INK, spaceBefore=3.4, spaceAfter=0.5)
    s["tech"] = ParagraphStyle("tech", fontName="Helvetica-Oblique", fontSize=body_size - 0.6,
                               leading=lead - 0.8, textColor=INK, spaceAfter=1.6)
    s["bullet"] = ParagraphStyle("bullet", parent=s["body"], leftIndent=9,
                                 bulletIndent=1.5, spaceAfter=1.4)
    # Employment metadata: type, location, dates. Sits under the role line.
    s["meta"] = ParagraphStyle("meta", fontName="Helvetica", fontSize=body_size - 0.5,
                               leading=lead - 0.9, textColor=INK, spaceAfter=1.8)
    return s

def rule():
    return HRFlowable(width="100%", thickness=0.6, color=RULE,
                      spaceBefore=1, spaceAfter=3.5)

def build(path, body_size=9.7, lead=12.0, gap=8.2, margin=17.0, vmargin=14.5,
          page_break=False, phone=None):
    doc = SimpleDocTemplate(
        path, pagesize=A4,
        leftMargin=margin * mm, rightMargin=margin * mm,
        topMargin=vmargin * mm, bottomMargin=vmargin * mm,
        title="S. Suyambulingaraj - AI/ML Engineer - Resume",
        author="S. Suyambulingaraj",
        subject="AI/ML Engineer resume - machine learning, NLP, Tamil NLP, ASR, voice AI, LLM applications",
        keywords=("Machine Learning, NLP, Tamil NLP, ASR, Speech Recognition, Voice AI, "
                  "LLM Applications, Python, Scikit-learn, XGBoost, Random Forest, LoRA, PEFT, "
                  "Whisper, CTranslate2, FastAPI, WebSocket, Text-to-Speech, WebRTC VAD, "
                  "BPE Tokenization, Feature Engineering, Model Evaluation"),
        creator="S. Suyambulingaraj")
    s = styles(body_size, lead, gap)
    f = []

    f += [Paragraph(NAME, s["name"]), Paragraph(TITLE, s["title"])]
    for line in contact_lines(phone):
        f.append(Paragraph(line, s["contact"]))

    f += [Paragraph("PROFESSIONAL SUMMARY", s["h2"]), rule(),
          Paragraph(SUMMARY, s["body"])]

    f += [Paragraph("TECHNICAL SKILLS", s["h2"]), rule()]
    for label, items in SKILLS:
        f.append(Paragraph("<b>%s:</b> %s" % (label, items), s["body"]))

    if EXPERIENCE:
        f += [Paragraph("EXPERIENCE", s["h2"]), rule()]
        for role, org, kind, loc, dates, bullets in EXPERIENCE:
            block = [Paragraph("%s &mdash; %s &nbsp;|&nbsp; %s" % (role, org, dates), s["proj"]),
                     Paragraph("%s &middot; %s" % (kind, loc), s["meta"])]
            block += [Paragraph(b, s["bullet"], bulletText="\u2022") for b in bullets]
            f.append(KeepTogether(block))

    if page_break:
        f.append(PageBreak())

    # The section heading travels with the first project, so it can never be
    # orphaned at the foot of a page - which is what happens under natural flow
    # (page_break=False) if the heading is emitted on its own.
    for i, p in enumerate(PROJECTS):
        block = []
        if i == 0:
            block += [Paragraph("SELECTED PROJECTS", s["h2"]), rule()]
        block += [Paragraph("%s &nbsp;|&nbsp; %s &mdash; %s" % (p["n"], p["t"], p["k"]), s["proj"]),
                  Paragraph(p["tech"], s["tech"])]
        block += [Paragraph(b, s["bullet"], bulletText="\u2022") for b in p["b"]]
        f.append(KeepTogether(block))

    f += [Paragraph("EDUCATION", s["h2"]), rule()]
    for deg, yr, inst in EDUCATION:
        f.append(Paragraph("<b>%s</b> &nbsp;|&nbsp; %s<br/>%s" % (deg, yr, inst), s["body"]))

    f += [Paragraph("CERTIFICATIONS &amp; LANGUAGES", s["h2"]), rule(),
          Paragraph(CERTIFICATIONS, s["body"]),
          Paragraph("<b>Languages:</b> " + LANGUAGES, s["body"])]

    f += [Paragraph("LINKS", s["h2"]), rule()]
    for line in LINKS:
        f.append(Paragraph(line, s["body"]))

    pages = []
    doc.build(f, onFirstPage=lambda c, d: pages.append(1),
                 onLaterPages=lambda c, d: pages.append(1))
    return len(pages)

def _plain(t):
    import re
    t = (t.replace("&nbsp;", " ").replace("&amp;", "&").replace("&mdash;", "-")
           .replace("&plusmn;", "+/-"))
    return re.sub(r"<[^>]+>", "", t)


def build_txt(path, phone=None):
    L = [NAME, TITLE, ""]
    L += [_plain(c) for c in contact_lines(phone)]
    L += ["", "PROFESSIONAL SUMMARY", _plain(SUMMARY), "", "TECHNICAL SKILLS"]
    L += ["%s: %s" % (_plain(a), _plain(b)) for a, b in SKILLS]
    if EXPERIENCE:
        L += ["", "EXPERIENCE"]
        for role, org, kind, loc, dates, bullets in EXPERIENCE:
            L += ["", "%s - %s | %s" % (role, org, _plain(dates)),
                  "%s - %s" % (kind, _plain(loc))]
            L += ["- " + _plain(b) for b in bullets]
    L += ["", "SELECTED PROJECTS"]
    for p in PROJECTS:
        L += ["", "%s | %s - %s" % (p["n"], p["t"], p["k"]), _plain(p["tech"])]
        L += ["- " + _plain(b) for b in p["b"]]
    L += ["", "EDUCATION"]
    L += ["%s | %s\n%s" % (d, y, i) for d, y, i in EDUCATION]
    L += ["", "CERTIFICATIONS & LANGUAGES", _plain(CERTIFICATIONS),
          "Languages: " + _plain(LANGUAGES)]
    L += ["", "LINKS"] + [_plain(x) for x in LINKS] + [""]
    open(path, "w", encoding="utf-8").write("\n".join(L))
    return len("\n".join(L).split("\n"))


if __name__ == "__main__":
    n = build(OUT, phone=PHONE)
    t = OUT.rsplit(".", 1)[0] + ".txt"
    lines = build_txt(t, phone=PHONE)
    print("pages: %d -> %s" % (n, OUT))
    print("lines: %d -> %s" % (lines, t))
