# scripts/tag-courses.py
# Source of truth for course tags. Edit COURSE_TAGS here, then run this script
# to regenerate data/courses.json. Or edit data/tags.csv and run with --from-csv.
import json, os, csv, sys

COURSE_TAGS = {
    # Arts & Humanities
    'AH110': ['history', 'globalization', 'cross-cultural', 'comparative-history', 'migration'],
    'AH111': ['ethics', 'identity', 'justice', 'moral-philosophy', 'bioethics', 'feminist-ethics', 'applied-ethics'],
    'AH112': ['artistic-expression', 'visual-arts', 'literature', 'music', 'social-change', 'creative-expression', 'film'],
    'AH113': ['design', 'design-thinking', 'material-culture', 'technology', 'interdisciplinary', 'narrative'],
    'AH142': ['historiography', 'historical-analysis', 'evidence', 'methodology', 'digital-humanities'],
    'AH144': ['ethics', 'dilemmas', 'normative-ethics', 'applied-ethics', 'philosophy'],
    'AH146': ['art-analysis', 'literary-criticism', 'close-reading', 'aesthetics', 'form', 'film', 'narrative'],
    'AH152': ['comparative-history', 'sociology', 'cross-cultural', 'globalization', 'social-change'],
    'AH154': ['law', 'international-law', 'applied-ethics', 'global-justice', 'human-rights'],
    'AH156': ['socioeconomics', 'arts', 'literature', 'labor', 'institutions'],
    'AH162': ['public-history', 'history', 'digital-history', 'museums', 'methodology'],
    'AH164': ['political-philosophy', 'social-justice', 'democracy', 'justice', 'philosophy'],
    'AH166': ['artistic-expression', 'creative-writing', 'communication', 'narrative', 'media', 'film'],
    # Business
    'B110':  ['market-research', 'product-analytics', 'consumer-behavior', 'marketing', 'forecasting'],
    'B111':  ['financial-planning', 'budgeting', 'financial-modeling', 'forecasting', 'finance'],
    'B112':  ['entrepreneurship', 'business-strategy', 'global-business', 'operations', 'innovation'],
    'B113':  ['operations', 'systems-design', 'optimization', 'organizational-design', 'strategy'],
    'B144':  ['product-development', 'user-research', 'product-design', 'innovation', 'consumer-behavior'],
    'B145':  ['venture-capital', 'valuation', 'startup', 'entrepreneurship', 'fundraising'],
    'B146':  ['operations', 'supply-chain', 'business-strategy', 'organizational-design', 'risk-management'],
    'B154':  ['brand-strategy', 'brand-management', 'marketing', 'branding', 'consumer-psychology'],
    'B155':  ['capital-allocation', 'value-creation', 'investment', 'corporate-finance', 'capital-structure'],
    'B156':  ['systems-design', 'operations', 'optimization', 'organizational-design', 'strategy'],
    'B164':  ['brand-management', 'brand-strategy', 'branding', 'marketing', 'innovation'],
    'B165':  ['finance', 'global-business', 'corporate-finance', 'geopolitics', 'hedging'],
    'B166':  ['optimization', 'operations', 'supply-chain', 'systems-design', 'business-strategy'],
    'B199':  ['entrepreneurship', 'business-strategy', 'strategy', 'operations', 'innovation'],
    # Computational Sciences
    'CS110': ['algorithms', 'data-structures', 'computational-thinking', 'software-engineering', 'python'],
    'CS111': ['calculus', 'mathematics', 'applied-math', 'numerical-methods', 'differential-equations', 'proof-writing'],
    'CS113': ['linear-algebra', 'mathematics', 'applied-math', 'data-science', 'modeling'],
    'CS114': ['probability', 'statistics', 'mathematics', 'probabilistic-modeling', 'regression'],
    'CS130': ['statistics', 'regression', 'causal-inference', 'machine-learning', 'data-science'],
    'CS142': ['theory-of-computation', 'automata', 'formal-languages', 'complexity-theory', 'Turing-machines', 'algorithms'],
    'CS144': ['mathematics', 'proof-writing', 'applied-math', 'logic', 'abstract-algebra'],
    'CS146': ['Bayesian', 'probabilistic-modeling', 'statistics', 'inference', 'machine-learning'],
    'CS152': ['artificial-intelligence', 'machine-learning', 'algorithms', 'neural-networks', 'data-science'],
    'CS154': ['differential-equations', 'numerical-methods', 'applied-math', 'modeling', 'calculus'],
    'CS156': ['machine-learning', 'data-science', 'classification', 'clustering', 'neural-networks'],
    'CS162': ['software-engineering', 'web-development', 'system-design', 'python', 'algorithms'],
    'CS164': ['optimization', 'linear-programming', 'operations-research', 'algorithms', 'mathematics'],
    'CS166': ['complex-systems', 'modeling', 'simulation', 'dynamical-systems', 'network-theory'],
    # Natural Sciences
    'NS110L': ['physics', 'biophysics', 'biology', 'applied-physics', 'thermodynamics'],
    'NS110U': ['physics', 'cosmology', 'gravity', 'relativity', 'theoretical-physics'],
    'NS111':  ['geology', 'climate', 'ecology', 'sustainability', 'atmospheric-science'],
    'NS112':  ['evolution', 'natural-selection', 'genetics', 'biodiversity', 'biology'],
    'NS113':  ['chemistry', 'organic-chemistry', 'molecular-biology', 'analytical-chemistry', 'biochemistry'],
    'NS125':  ['research-methods', 'statistics', 'data-analysis', 'biology', 'ecology'],
    'NS142':  ['quantum-mechanics', 'quantum', 'physics', 'materials-science', 'theoretical-physics'],
    'NS144':  ['genetics', 'genomics', 'cell-biology', 'molecular-biology', 'evolution'],
    'NS146':  ['climate', 'ecology', 'geology', 'sustainability', 'climate-change'],
    'NS152':  ['chemistry', 'analytical-chemistry', 'biochemistry', 'molecular-biology', 'organic-chemistry'],
    'NS154':  ['biochemistry', 'life-sciences', 'biology', 'cell-biology', 'molecular-biology'],
    'NS156':  ['climate-modeling', 'ecology', 'data-analysis', 'statistics', 'sustainability'],
    'NS162':  ['thermodynamics', 'physics', 'statistics', 'entropy', 'theoretical-physics'],
    'NS164':  ['biotechnology', 'gene-engineering', 'biomedical', 'biochemistry', 'life-sciences'],
    'NS166':  ['climate-change', 'sustainability', 'ecology', 'climate', 'atmospheric-science'],
    # Social Sciences
    'SS110': ['psychology', 'neuroscience', 'cognition', 'social-psychology', 'brain', 'social-systems'],
    'SS111': ['economics', 'macroeconomics', 'markets', 'economic-policy', 'institutions'],
    'SS112': ['political-science', 'social-change', 'social-movements', 'democracy', 'political-theory'],
    'SS142': ['cognition', 'emotion', 'cognitive-science', 'psychology', 'neuroscience'],
    'SS144': ['microeconomics', 'macroeconomics', 'econometrics', 'markets', 'statistics'],
    'SS146': ['governance', 'institutions', 'political-systems', 'public-policy', 'rule-of-law'],
    'SS152': ['neuroscience', 'neural-computation', 'brain', 'cognitive-science', 'psychology'],
    'SS154': ['econometrics', 'economic-policy', 'regression', 'statistics', 'causal-inference'],
    'SS156': ['comparative-politics', 'political-systems', 'democracy', 'institutions', 'governance'],
    'SS162': ['psychology', 'motivation', 'social-psychology', 'behavior-change', 'health-psychology', 'research-methods'],
    'SS164': ['development-economics', 'global-development', 'economics', 'inequality', 'public-policy'],
    'SS166': ['constitutional-law', 'comparative-law', 'constitution-making', 'rule-of-law', 'democracy'],
}

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
courses_path = os.path.join(root, 'data', 'courses.json')
csv_path = os.path.join(root, 'data', 'tags.csv')

def load_tags_from_csv():
    tags = {}
    with open(csv_path, newline='') as f:
        for row in csv.DictReader(f):
            tags[row['id']] = [t.strip() for t in row['tags'].split(',') if t.strip()]
    return tags

def export_csv(courses):
    with open(csv_path, 'w', newline='') as f:
        w = csv.writer(f)
        w.writerow(['id', 'school', 'title', 'tags'])
        for c in courses:
            w.writerow([c['id'], c['school'], c['title'], ', '.join(c.get('tags', []))])
    print(f"Exported {len(courses)} courses to data/tags.csv")

with open(courses_path) as f:
    courses = json.load(f)

if '--from-csv' in sys.argv:
    tag_source = load_tags_from_csv()
    print("Using data/tags.csv as tag source")
elif '--export-csv' in sys.argv:
    export_csv(courses)
    sys.exit(0)
else:
    tag_source = COURSE_TAGS

missing = []
for course in courses:
    tags = tag_source.get(course['id'], [])
    course['tags'] = tags
    if not tags:
        missing.append(course['id'])

with open(courses_path, 'w') as f:
    json.dump(courses, f, indent=2)

print(f"Tagged {len(courses)} courses.")
if missing:
    print(f"WARNING — no tags for: {missing}")
else:
    print("All courses have tags ✓")
