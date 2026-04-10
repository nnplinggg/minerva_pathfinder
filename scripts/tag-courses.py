# scripts/tag-courses.py
import json, os

COURSE_TAGS = {
    # Arts & Humanities
    'AH110': ['history', 'globalization', 'cross-cultural', 'comparative-history', 'migration'],
    'AH111': ['ethics', 'identity', 'justice', 'moral-philosophy', 'bioethics', 'feminist-ethics', 'applied-ethics'],
    'AH112': ['artistic-expression', 'visual-arts', 'literature', 'music', 'social-change', 'creative-expression'],
    'AH113': ['design', 'design-thinking', 'material-culture', 'technology', 'interdisciplinary'],
    'AH142': ['historiography', 'historical-analysis', 'evidence', 'methodology', 'digital-humanities'],
    'AH144': ['ethics', 'dilemmas', 'normative-ethics', 'applied-ethics', 'philosophy'],
    'AH146': ['art-analysis', 'literary-criticism', 'close-reading', 'aesthetics', 'form'],
    'AH152': ['comparative-history', 'sociology', 'cross-cultural', 'globalization', 'social-change'],
    'AH154': ['law', 'international-law', 'applied-ethics', 'global-justice', 'human-rights'],
    'AH156': ['socioeconomics', 'arts', 'literature', 'labor', 'institutions'],
    'AH162': ['public-history', 'history', 'digital-history', 'museums', 'methodology'],
    'AH164': ['political-philosophy', 'social-justice', 'democracy', 'justice', 'philosophy'],
    'AH166': ['artistic-expression', 'creative-writing', 'communication', 'narrative', 'media'],
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
    'CS111': ['calculus', 'mathematics', 'applied-math', 'numerical-methods', 'differential-equations'],
    'CS113': ['linear-algebra', 'mathematics', 'applied-math', 'data-science', 'modeling'],
    'CS114': ['probability', 'statistics', 'mathematics', 'probabilistic-modeling', 'regression'],
    'CS130': ['statistics', 'regression', 'causal-inference', 'machine-learning', 'data-science'],
    'CS142': ['theory-of-computation', 'automata', 'formal-languages', 'complexity-theory', 'Turing-machines'],
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
    'SS110': ['psychology', 'neuroscience', 'cognition', 'social-psychology', 'brain'],
    'SS111': ['economics', 'macroeconomics', 'markets', 'economic-policy', 'institutions'],
    'SS112': ['political-science', 'social-change', 'social-movements', 'democracy', 'political-theory'],
    'SS142': ['cognition', 'emotion', 'cognitive-science', 'psychology', 'neuroscience'],
    'SS144': ['microeconomics', 'macroeconomics', 'econometrics', 'markets', 'statistics'],
    'SS146': ['governance', 'institutions', 'political-systems', 'public-policy', 'rule-of-law'],
    'SS152': ['neuroscience', 'neural-computation', 'brain', 'cognitive-science', 'psychology'],
    'SS154': ['econometrics', 'economic-policy', 'regression', 'statistics', 'causal-inference'],
    'SS156': ['comparative-politics', 'political-systems', 'democracy', 'institutions', 'governance'],
    'SS162': ['psychology', 'motivation', 'social-psychology', 'behavior-change', 'health-psychology'],
    'SS164': ['development-economics', 'global-development', 'economics', 'inequality', 'public-policy'],
    'SS166': ['constitutional-law', 'comparative-law', 'constitution-making', 'rule-of-law', 'democracy'],
}

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
courses_path = os.path.join(root, 'data', 'courses.json')

with open(courses_path) as f:
    courses = json.load(f)

missing = []
for course in courses:
    tags = COURSE_TAGS.get(course['id'], [])
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
