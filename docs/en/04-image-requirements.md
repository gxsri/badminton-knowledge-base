# Image Requirements & Production Guide — Design Principles Edition

> **For**: Designers, AI image tool users, coaches (anyone who needs to produce their own images)
> **Goal**: Not to give you 32 prompts to copy-paste. It is to teach you how to design sports science illustrations, so you can design and write your own prompts for any image you need in the future
> **Core philosophy**: A good sports science illustration is not about "looking good" — it is about "one image clearly explaining one principle"

---

## Chapter 1: Four Design Principles of Sports Science Illustrations

Before creating any image, understand these four principles. Violating any one of them robs the image of its instructional value.

| Principle | Explanation | Common Mistake |
|:----------|:------------|:---------------|
| **One Image, One Principle** | One image says one thing. Do not say "this image shows the force sequence AND the contact point AND the center of gravity shift" | Too much information crammed into one image, the reader does not know where to look |
| **Visual Hierarchy** | Place the most important information at the visual center; use color / thickness / size to differentiate priority | Leader lines are as thick as the main elements — cannot tell primary from secondary |
| **Annotation Guidance** | Leader lines start from the annotated point to the text; do not cross, do not pass through the body | Leader lines cross each other like a spider web — unreadable |
| **Clean Background** | White or light gray background, no decorative elements | Added shadows / gradients / decorative backgrounds that distract attention |

**How to check if your image qualifies:**
```
Show it to someone who does not understand this technique —
If they can say "what this image is about" within 3 seconds → Passes
If they still cannot tell after 10 seconds → Violates one or more principles
```

---

## Chapter 2: Three Image Types Have Different Design Logics

### 2.1 Technique Diagram (shows "how to do it")

**Design logic:**
```
Step 1: Determine the movement phase to display
  - Is it a static pose? → Choose the single most important moment
  - Is it a movement sequence? → Choose 3-5 key frames, no more than 5

Step 2: Determine the viewing angle
  - Side view → Suitable for sagittal plane movements (split squat, lunge, footwork)
  - Front view → Suitable for frontal plane movements (side shuffle, lateral movement)
  - 45-degree view → Suitable for rotational movements (pivot and strike)

Step 3: What to annotate
  - Moving joints → Draw arrows / arcs
  - Key angles → Label with degrees
  - Center of gravity → A dot + arrow
  - Direction of force → Arrow
```

**Four-tier annotation priority:**
```
Tier 1 (mandatory): Movement direction and key joint angles
Tier 2 (recommended): Center of gravity position and direction of force
Tier 3 (optional): Muscle activation areas
Tier 4 (can add): Reference lines (vertical / horizontal baselines)
```

### 2.2 Anatomical Illustration (shows "what it is")

**Design logic:**
```
Step 1: Determine which layer to display
  - Superficial → Show only the outermost muscles
  - Deep → Remove superficial muscles, show deep layers
  - Cross-section → Longitudinal or transverse cut

Step 2: Color coding rules
  - Agonist (contracting muscle): red / warm color
  - Antagonist (lengthening muscle): blue / cool color
  - Stabilizer (stabilizing muscle): yellow / neutral color
  - Bone: gray / beige
  - Ligament / tendon: white / light color

Step 3: Annotation logic
  - Leader lines start from the center of the structure
  - Leader line ends are aligned (left-side lines align left, right-side align right)
  - Text size by importance: primary > secondary > detail
```

### 2.3 Training Plan Infographic (shows "how to organize")

**Design logic:**
```
Step 1: Determine timeline direction
  - Horizontal (left to right) → Suitable for showing a timeline
  - Vertical (top to bottom) → Suitable for showing hierarchical relationships

Step 2: Color coding
  - Different modules use different color schemes
  - Different intensities within the same module use lighter/darker shades of the same scheme

Step 3: Information density
  - Do not write daily training content on one plan infographic
  - The plan infographic only shows "structure and rhythm"
  - Specific content goes in the text section
```

---

## Chapter 3: AI Image Prompt Construction Formula

### 3.1 Universal Prompt Formula (Applicable to All Types)

```
[Composition Description] + [Subject Description] + [Action/Pose Description] +
[Annotation Requirements] + [Style Requirements] + [Technical Parameters]
```

Writing rules for each part:

| Part | Rule | Example (good) | Example (bad) |
|:-----|:-----|:---------------|:--------------|
| Composition Description | State whether single image or multi-panel | "4-panel medical illustration" | "a picture of" |
| Subject Description | Gender, view angle, position | "human figure in side view" | "a person" |
| Action Description | Specific movement, phase, key points | "performing single-leg squat at 90 degree knee bend" | "doing exercise" |
| Annotation Requirements | Arrows, text, leader lines | "arrows showing motion direction, Chinese labels" | Not mentioned |
| Style Requirements | Medical / sports / professional / clean | "clean medical illustration style, white background" | "realistic" |
| Technical Parameters | Resolution, aspect ratio | "300dpi, anatomical accuracy" | Not mentioned |

### 3.2 Prompt Parameter Priority by Image Type

| Image Type | Most Important Parameter | Second Most Important | Can Use Default |
|:-----------|:------------------------|:---------------------|:----------------|
| Technique Diagram | Accuracy of action description | Viewing angle | Background details |
| Anatomical Illustration | Color coding and layering | Annotation clarity | Movement dynamics |
| Training Plan Infographic | Color coding and timeline direction | Information density control | Texture details |

### 3.3 Prompt Writing Differences Across AI Tools

| Tool | Prompt Writing Difference | Additional Parameters |
|:-----|:--------------------------|:---------------------|
| **Midjourney** | Keep descriptions concise; place style words at the front | `--ar 4:3 --style raw` |
| **DALL-E 3** | Can write long prompts; describe in sections | No special parameters needed |
| **Stable Diffusion** | Requires positive prompt + negative prompt | Negative: `deformed, distorted, bad anatomy` |

---

## Chapter 4: Prompt Templates for Common Image Needs

> The following are not 32 individual prompts. They are **templates** for each type of image. Combine them yourself using the formulas from Chapter 2.

### 4.1 Single-Pose Technique Diagram (corresponds to Fig 1-1, 1-3, 1-5, 2-3, etc.)

**Template:**
```
Sports medicine illustration, [viewing angle] of [subject] [specific action].
[Key annotation requirements]. [style description]. [technical parameters].
Chinese labels: [Chinese text to annotate].
```

**Application example — Fig 1-1 Single-Leg Stance:**
```
Medical illustration style, human figure in side view performing single-leg stance on right leg, left leg bent behind. Green arrow pointing to center of mass over standing foot, green shaded stability zone on floor. Clean white background, professional sports medicine diagram style, anatomical accuracy. Chinese labels: "重心" next to arrow, "稳定区域" on floor zone.
```

**Your practice: Use the template to write one for Fig 3-4 (Gluteus Medius Activation Exercise)**
```
Take the template → Fill in the content:
Viewing angle = side view
Subject = athlete lying on side
Action = top leg straight, lifting upward
Annotation = gluteus medius highlighted in red, upward arrow
Style = medical fitness illustration
Technical parameters = white background, clean professional style
Labels = 臀中肌, 侧卧抬腿

→ Combine into a complete prompt
```

### 4.2 Multi-Panel Movement Breakdown (corresponds to Fig 1-4, 2-5, 3-3, etc.)

**Template:**
```
[Number of panels]-panel sports illustration showing [movement name] progression.
Panel 1: [phase 1 description].
Panel 2: [phase 2 description].
Panel 3: [phase 3 description].
[Additional requirements]. [style]. [technical parameters].
Chinese labels: [labels for each phase].
```

**Application example — Fig 3-3 Single-Leg Squat Eccentric Control:**
```
3-panel sports medicine diagram, single-leg squat eccentric phase.
Panel 1: standing start, knee slightly bent.
Panel 2: 45 degree knee bend, red arrow showing controlled descent.
Panel 3: full 90 degree squat position, knee alignment line over second toe.
Clean medical style, white background, anatomical accuracy.
Chinese labels: "起始位" (panel 1), "离心控制" (panel 2), "最低位" (panel 3).
```

### 4.3 Anatomical Illustration (corresponds to Fig 1-7, 1-8, 3-5, 3-6, etc.)

**Template:**
```
Anatomical illustration of [body part], [viewing angle].
[Layer description]: [structure 1] (color 1), [structure 2] (color 2), [structure 3] (color 3).
Color-coded with leader lines to Chinese labels: [label 1], [label 2], [label 3].
Medical textbook quality, [technical parameters], white background.
```

### 4.4 Training Plan Infographic (corresponds to Fig 4-1, 4-2, 4-3, etc.)

**Template:**
```
[Type] infographic, [content overview].
[Timeline/structure description].
[Color coding description]. [style]. [technical parameters].
Chinese labels: [title labels].
```

---

## Chapter 5: How to Judge Whether an AI-Generated Image is Acceptable

### 5.1 Checklist (Review After Every Generation)

```
☐ Are the anatomical proportions correct? (limb length, torso proportions)
   → AI frequently gets finger count, arm length wrong
   → If wrong → Add negative prompt or manually correct

☐ Is the movement angle accurate? (knee at 90 degrees? spine neutral?)
   → AI does not understand the precise meaning of "knee at 90 degrees"
   → If wrong → Add specific reference object descriptions in the prompt

☐ Are the annotation leader lines clear and readable?
   → AI frequently draws leader lines passing through the body
   → If wrong → Add annotations manually using drawing software

☐ Are the Chinese labels displayed correctly?
   → AI is unstable at generating Chinese text
   → If wrong → Manually add Chinese labels after AI generation
```

### 5.2 Common AI Image Problems and Fixes

| Problem | Cause | Fix |
|:--------|:------|:----|
| Incorrect number of fingers/toes | AI is unstable with extremities | Add "correct number of fingers/toes" in prompt or fix in post-processing |
| Inaccurate movement angle | AI does not understand precise degrees | Replace degrees with reference object descriptions (e.g., "thigh parallel to ground") |
| Garbled annotation text | Poor AI support for Chinese | First annotate positions in English, then replace with Chinese in software |
| Disproportionate body ratios | Aesthetic bias in training data | Add "anatomical proportions, realistic body ratio" |
| Background not clean | Default parameters favor artistic styling | Add "white background, no shadows, no decorations" |

---

## Chapter 6: Design Workflow (Not "Generate One by One")

```
Step 1: Categorize
Group the 32 images by type into 4 categories: Technique / Anatomy / Training Plan / Nutrition & Recovery
Images within each category use the same style of prompt template

Step 2: Write Templates
Write a general template for each category (use the templates from Chapter 4)
Mark replaceable parts in the template with [variable]

Step 3: Batch Generate
Use the templates to generate the first round in batch
Do not aim for a perfect image on the first try — first check whether the overall style is consistent

Step 4: Filter + Optimize
Generate 2-3 versions of each image, select the best one
For images that need modification, only change the parts that need changing based on the template

Step 5: Post-Processing
AI-generated images need post-processing (software: Photoshop / GIMP / Canva)
Mandatory post-processing steps:
  1. Check and correct anatomical proportions
  2. Re-add Chinese labels (must be done manually, do not rely on AI)
  3. Unify the color style across all images
  4. Add figure numbers (1-1, 1-2, etc.)
```

---

*Version: v2.0 (Design Principles Edition)*
*Core change: From "giving you 32 prompts" to "teaching you how to write your own prompts, using templates + formulas to auto-generate"*
*How to use in practice: Categorize by type → Use templates → Batch generate → Manual post-processing*
