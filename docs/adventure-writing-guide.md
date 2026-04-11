# Adventure Writing Guide — Minerva Pathfinder

Use this guide when writing or rewriting adventure stories for the 5 Minerva schools.

---

## Tone

**Mix of realistic and fantastical.** Mi is a pixel explorer in an imaginary world, but the intellectual content is real Minerva. A node might be set in a "data dimension" or a "jungle clearing" but the choices should reflect genuine academic questions that Minerva students actually grapple with.

- Scenarios: imaginative, sensory, specific ("a wall of manuscripts" not "a library")
- Choices: concrete intellectual actions ("Run a causal inference analysis" not "Think about causes")
- Endings: Mi celebrates; the student receives a short identity label ("You're a theorist", "You're a builder")

---

## Tree Structure

Each school has 10 nodes in this pattern:

```
start (3 choices) → branch-a, branch-b, branch-c
branch-a (2 choices) → cluster-1, cluster-2
branch-b (2 choices) → cluster-1, cluster-3
branch-c (2 choices) → cluster-2, cluster-3
cluster-1 (2 choices) → end-x   (all choices go to same ending)
cluster-2 (2 choices) → end-y
cluster-3 (2 choices) → end-z
end-x, end-y, end-z: terminal nodes (no choices)
```

**Key insight:** The ending (x/y/z) is determined at the *branch → cluster* step. The cluster's choices all lead to the same ending but accumulate different tags — so they affect which courses appear, not which story branch.

---

## Tags

Use 2–3 tags per choice. Use the tag lists below. Tags are invisible to students — they determine course recommendations behind the scenes.

**Tips:**
- Use specific tags over general ones: `machine-learning` beats `technology`
- Tags at the cluster and ending levels should overlap with the most relevant courses
- Each ending's `requiredTags` should reflect what that intellectual identity cares most about

---

## Tag Reference by School

### arts-humanities
`aesthetics` `anthropology` `applied-ethics` `art-analysis` `art-history` `artistic-expression` `arts` `bioethics` `civil-disobedience` `close-reading` `communication` `comparative-history` `constitutional-theory` `creative-expression` `creative-writing` `cross-cultural` `cultural-studies` `cultural-theory` `data-ethics` `democracy` `design` `design-thinking` `digital-history` `digital-humanities` `dilemmas` `empire` `environment` `environmental-ethics` `ethics` `evidence` `feminist-ethics` `film` `form` `gender` `global` `global-justice` `global-perspectives` `globalization` `historical-analysis` `historiography` `history` `human-rights` `identity` `ideology` `institutions` `interdisciplinary` `international-law` `justice` `labor` `law` `literary-criticism` `literature` `material-culture` `media` `memory` `methodology` `migration` `moral-philosophy` `museums` `music` `narrative` `nationalism` `normative-ethics` `persuasion` `philosophy` `policy` `political-philosophy` `politics` `positionality` `propaganda` `public-history` `social-change` `social-justice` `social-movements` `socioeconomics` `sociology` `structure` `sustainability` `technology` `visual-arts`

### social-sciences
`AI` `Nash-equilibrium` `behavior-change` `behavioral-economics` `behavioral-science` `brain` `causal-inference` `central-banking` `cognition` `cognitive-science` `comparative-law` `comparative-politics` `constitution-making` `constitutional-law` `corruption` `creativity` `decision-making` `democracy` `development-economics` `econometrics` `economic-policy` `economics` `education` `emotion` `game-theory` `global-development` `governance` `health-psychology` `healthcare` `inequality` `institutions` `international-relations` `international-trade` `macroeconomics` `market-failures` `markets` `memory` `mental-health` `microeconomics` `motivation` `neural-computation` `neuroscience` `nudging` `persuasion` `policy` `political-science` `political-systems` `political-theory` `psychology` `public-policy` `regression` `research-methods` `rule-of-law` `social-change` `social-movements` `social-psychology` `social-systems` `state-formation` `statistics` `sustainability`

### computational-sciences
`Bayesian` `Fourier-analysis` `Markov-chains` `Monte-Carlo` `NP-hardness` `Turing-machines` `abstract-algebra` `algorithms` `applied-math` `artificial-intelligence` `automata` `calculus` `causal-inference` `classification` `clustering` `complex-systems` `complexity-theory` `computational-math` `computational-thinking` `data-science` `data-structures` `differential-equations` `dynamic-programming` `dynamical-systems` `formal-languages` `hashing` `inference` `linear-algebra` `linear-programming` `logic` `logic-programming` `machine-learning` `mathematics` `modeling` `network-analysis` `network-theory` `neural-networks` `numerical-methods` `operations-research` `optimization` `probabilistic-modeling` `probability` `proof-writing` `python` `regression` `robotics` `simulation` `software-engineering` `statistics` `system-design` `theory-of-computation` `web-development`

### natural-sciences
`analytical-chemistry` `applied-physics` `atmospheric-science` `biochemistry` `biodiversity` `bioethics` `biology` `biomedical` `biophysics` `biotechnology` `cell-biology` `chemistry` `climate` `climate-change` `climate-modeling` `computation` `cosmology` `data-analysis` `ecology` `electromagnetism` `entropy` `evolution` `fluid-dynamics` `gene-engineering` `genetics` `genomics` `geology` `gravity` `information-theory` `life-sciences` `materials-science` `molecular-biology` `natural-selection` `organic-chemistry` `physics` `planetary-science` `quantum` `quantum-mechanics` `relativity` `research-methods` `statistics` `sustainability` `theoretical-physics` `thermodynamics`

### business
`accounting` `brand-management` `brand-strategy` `branding` `budgeting` `business-strategy` `capital-allocation` `capital-structure` `consumer-behavior` `consumer-psychology` `corporate-finance` `entrepreneurship` `finance` `financial-modeling` `financial-planning` `forecasting` `fundraising` `geopolitics` `global-business` `go-to-market` `growth-strategy` `hedging` `innovation` `investment` `market-entry` `market-research` `marketing` `operations` `optimization` `organizational-design` `private-equity` `product-analytics` `product-design` `product-development` `risk-management` `service-design` `startup` `strategy` `supply-chain` `systems-design` `user-research` `valuation` `value-creation` `venture-capital`

---

## Example: CS adventure (fully worked)

See `data/adventures.json` — the `cs-*` nodes are a complete example of the structure, tag usage, and tone to model from.

The CS adventure uses `cs-start` → three branches based on whether the student gravitates toward engineering, data analysis, or formal theory → clusters that refine within each direction → endings that give the student a label (builder, theorist, logician-builder).

---

## Node writing checklist

- [ ] Scenario is specific and sensory (not generic)
- [ ] Each choice is a concrete intellectual action
- [ ] Tags come from the school's tag list above
- [ ] 2–3 tags per choice
- [ ] Cluster choices all point to the same ending
- [ ] Ending text names the student's intellectual identity
- [ ] `requiredTags` reflect what makes that identity distinct
