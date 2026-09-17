#!/usr/bin/env python3
"""Append missing chapters (6,7,Appendix D) to English anatomy doc."""
import os

EN_PATH = r'D:\athleteiq\athlete_monitor\badmintongithub\docs\en\17-sports-anatomy-rehab.md'

missing = """

---

## Chapter 6: Anatomical Analysis of Common Badminton Injuries

### 6.1 Tennis Elbow / Golfer's Elbow (Lateral/Medial Epicondylitis)

```
Anatomical location:
- Lateral epicondylitis: common origin of forearm extensors (extensor carpi radialis brevis)
- Medial epicondylitis: common origin of forearm flexors

Mechanism:
- Lateral: during backhand shots, wrist extensors are repeatedly eccentrically loaded
- Medial: during forehand shots, wrist flexors are overloaded

Diagnosis:
☐ Grip or wrist extension causes lateral elbow pain → lateral epicondylitis
☐ Grip or wrist flexion causes medial elbow pain → medial epicondylitis
☐ Mill's Test: forearm pronation + wrist flexion + elbow extension → lateral elbow pain

Treatment:
1. Acute phase (pain present): rest + ice + avoid power generation
2. Recovery phase: eccentric training (start with light resistance)
3. Prevention: strengthen forearm extensors/flexors, check grip technique
```

### 6.2 Subacromial Impingement Syndrome

```
Anatomical location:
- Space between acromion and humeral head (subacromial space)
- Contains supraspinatus tendon and subacromial bursa

Mechanism:
- Rotator cuff weakness → humeral head migrates upward during shoulder movement
- Migration → compresses supraspinatus tendon and bursa
- Repeated compression → inflammation → tendon degeneration

Risk factors:
- Pectoralis major too tight (pulls shoulder joint forward)
- Upper trapezius too tight (shrugging posture)
- Middle/lower trapezius and rhomboids weak (scapular instability)

Diagnosis:
☐ Painful arc (60-120° lateral elevation) → shoulder lateral pain
☐ Hawkins-Kennedy Test: shoulder flexed 90° + internal rotation → pain
☐ Empty Can Test: arm abducted 90° + internally rotated (thumb down) → weakness/pain

Treatment:
1. Avoid the painful range of motion
2. Strengthen rotator cuff (especially infraspinatus and teres minor — external rotators)
3. Strengthen scapular stabilizers (middle/lower trapezius, serratus anterior)
4. Stretch pectoralis major
5. Correct the "shrugging during racket preparation" habit
```

### 6.3 Patellofemoral Pain Syndrome (Runner's Knee)

```
Anatomical location:
- Joint surface between patella (kneecap) and femoral trochlea
- The patella should glide smoothly in the femoral trochlear groove

Mechanism:
- VMO weakness → patella pulled laterally by vastus lateralis
- Abnormal patellar tracking → uneven joint surface pressure → cartilage wear

Risk factors:
- Insufficient VMO strength
- Gluteus medius weakness → thigh adduction → knee valgus (caving in)
- IT band too tight

Diagnosis:
☐ Anterior knee pain when going up/down stairs or standing up after prolonged sitting
☐ Pain when pressing patellar border with knee extended
☐ Patella deviates laterally at 30° knee flexion

Treatment:
1. Strengthen VMO (seated knee extension last 10°, short arc extension)
2. Strengthen gluteus medius (clam shells, side-lying leg raises)
3. Stretch IT band, vastus lateralis
4. Check and correct "knee caving in" movement pattern
```

### 6.4 Achilles Tendinitis / Tendinopathy

```
Anatomical location:
- Achilles tendon: formed by gastrocnemius + soleus, attaching to calcaneus
- Strongest tendon in the body, bearing up to 8x body weight

Mechanism:
- Load exceeds tendon capacity
- Repeated eccentric loading (landing shock) → microtears → poor repair → degeneration

Risk factors:
- Poor triceps surae flexibility
- Excessive pronation (flat feet)
- Sudden increase in training volume or intensity
- Improper footwear or too-hard court surface

Diagnosis:
☐ Achilles stiffest in the morning (morning pain)
☐ Pain at the start of exercise, improves during activity
☐ Pain returns after exercise ends
☐ Tendon thickening, nodule formation

Treatment:
1. Eccentric training (heel drop — classic protocol)
2. Calf flexibility training
3. Control training load (avoid sudden increases)
4. Avoid jumping and sprinting during acute phase
```

### 6.5 Ankle Sprain (Ligament Injury)

```
Anatomical location:
- Lateral ligament complex (anterior talofibular, calcaneofibular, posterior talofibular)
- Anterior talofibular ligament (ATFL) is most commonly injured

Mechanism:
- Ankle inversion (sole turning inward) + plantar flexion (toes pointing down)
- Landing poorly or stepping on someone's foot

Grading:
- Grade 1: Ligament stretched (microtear) → mild swelling, can walk
- Grade 2: Partial tear → significant swelling, walking painful
- Grade 3: Complete rupture → severe swelling, cannot bear weight

Treatment principles (POLICE):
Protection → Optimal Loading → Ice → Compression → Elevation

Rehab phases:
1. Acute phase (1-7 days): reduce inflammation, protected weight-bearing
2. Recovery phase (1-4 weeks): ROM → proprioception → strength
3. Return-to-play phase (4 weeks+): sport-specific training → return to court

Key rehab content:
- Ankle proprioception training (single-leg stance, unstable surfaces)
- Peroneus longus/brevis strengthening (ankle eversion against resistance)
- Jump landing training (correct inversion landing pattern)
```

### 6.6 Patellar Tendinitis (Jumper's Knee)

```
Anatomical location:
- Patellar tendon: connects inferior patella to tibial tuberosity
- The weakest link in the quadriceps power chain

Mechanism:
- Repeated jumping (smash, jump serve) → excessive eccentric load on patellar tendon
- Microtears → poor repair → collagen degeneration → tendon thickening

Risk factors:
- Poor quadriceps flexibility
- Insufficient knee shock absorption on landing (hard landing)
- Sudden increase in jumping volume
- Too-hard court surface

Diagnosis:
☐ Sharp pain when pressing the tip of the inferior patella
☐ Anterior knee pain when squatting to 90°
☐ Pain most noticeable during jump landing (not during takeoff)
☐ Ultrasound shows tendon thickening, increased blood flow

Treatment:
1. Eccentric training on decline board (classic protocol)
2. Quadriceps flexibility training
3. Jump landing technique correction (sufficient knee flexion for shock absorption)
4. Acute phase: avoid jumping, substitute with isometric half-squats
```

### 6.7 Rotator Cuff Tear

```
Anatomical location:
- Tear in one or more of the four rotator cuff tendons
- 80% occur in the supraspinatus tendon
- Predilection site: the most ischemic area of the tendon (1-2cm from insertion)

Mechanism:
- Acute tear: one violent movement (e.g., full-power smash)
- Chronic tear: repeated impingement → tendon degeneration → eventual tear
- Supraspinatus has the poorest blood supply in the population → poor healing capacity

Risk factors:
- Age > 40 (tendon degeneration)
- Long history of smash/clear training
- Untreated subacromial impingement
- Long-term rotator cuff weakness

Diagnosis:
☐ Night pain (waking up when lying on the affected arm)
☐ Weakness when lifting arm overhead
☐ Drop Arm Test: passively raise arm to 180°, have patient slowly lower it
    → arm drops suddenly in the 30°-60° range → highly suspicious for complete tear
☐ Ultrasound/MRI for confirmation

Key differential:
- Impingement vs Tear
  Impingement: painful arc (60-120°), but strength largely preserved
  Tear: significant strength loss, passive ROM normal (not frozen shoulder)

Treatment:
1. Conservative (partial/small tears): physiotherapy + rehab
2. Surgical (complete tears or failed conservative): arthroscopic repair
3. Post-surgical rehab: 4-6 weeks protection → ROM restoration → strength → return to sport
```

### 6.8 Lumbar Strain / Facet Joint Dysfunction

```
Anatomical location:
- Lumbar strain: chronic inflammation or spasm of erector spinae, multifidus, quadratus lumborum
- Facet joint dysfunction: impingement of the facet joint capsule between lumbar vertebrae

Mechanism:
- Lumbar strain: repeated twisting + insufficient core control
- Facet joint dysfunction: a sudden rotational movement (e.g., twisting too hard to reach a backhand backcourt shot)

Risk factors:
- Core weakness (transversus abdominis + multifidus)
- Poor hip mobility (lumbar compensation)
- Poor hamstring flexibility (restricted pelvic movement)
- Gluteal weakness (lumbar compensation for hip extension)

Diagnosis — Lumbar strain:
☐ Diffuse low back ache, worse at rest (morning stiffness), better with movement
☐ Trigger points palpable in erector spinae and multifidus
☐ Pain with lumbar flexion and extension, but ROM generally normal

Diagnosis — Facet joint dysfunction:
☐ Sudden sharp pain, usually after a rotational movement
☐ Pain localized one finger-width lateral to the spine
☐ Extension + lateral flexion to the affected side worsens pain (capsule compression)
☐ Cannot find a comfortable position

Treatment (lumbar strain):
1. Trigger point treatment (foam roller/ball for erector spinae and multifidus)
2. Core activation (transversus abdominis + multifidus co-contraction)
3. Gluteal activation (hips share the load from the lower back)
4. Improve hip mobility and hamstring flexibility

Treatment (facet joint dysfunction):
1. Acute phase: avoid extension and rotation
2. Manual therapy: joint mobilization or manipulation (requires professional)
3. Recovery phase: core stabilization + pelvic control training
```

---

## Chapter 7: Designing Rehab and Prevention Programs from an Anatomical Perspective

### 7.1 The Four Phases of Rehabilitation

```
Phase 1: Pain Management (1-7 days)
  Goal: Control pain and inflammation
  Methods: Ice, appropriate rest, avoid aggravating movements
  Contraindication: Do not perform stretches that cause pain

Phase 2: ROM Restoration (3-14 days)
  Goal: Restore normal joint range of motion
  Methods: Gentle stretching, joint mobility exercises, fascial release
  Standard: Achieve ROM symmetrical with the uninjured side

Phase 3: Strength Restoration (7-28 days)
  Goal: Restore muscle strength and control
  Methods: Isometric → concentric → eccentric progression
  Standard: Affected side strength reaches 90% of uninjured side

Phase 4: Functional Rehab (14 days+)
  Goal: Return to playing level
  Methods: Sport-specific training (footwork, hitting), simulated match play
  Standard: Complete full-court footwork without pain
```

### 7.2 Key Muscles for Preventive Training

```
Anatomy-based prevention strategies:

1. Shoulder protection
   ☑ Shoulder external rotators (infraspinatus, teres minor) — counteract excessive IR in smash
   ☑ Middle/lower trapezius + rhomboids — maintain scapular stability
   ☑ Serratus anterior — scapular protraction and upward rotation

2. Knee protection
   ☑ VMO — maintain patellar tracking
   ☑ Gluteus medius — prevent thigh adduction and knee valgus
   ☑ Hamstrings — counterbalance quadriceps, stabilize knee

3. Lumbar protection
   ☑ Transversus abdominis + multifidus — core stability
   ☑ Gluteus maximus — share load from lumbar spine
   ☑ Hamstring flexibility — reduce anterior pelvic tilt

4. Ankle protection
   ☑ Peroneus longus/brevis — prevent ankle inversion
   ☑ Triceps surae flexibility — reduce Achilles load
   ☑ Intrinsic foot muscles — maintain arch
```

### 7.3 Pre-Training Fascial Activation Protocol (5 minutes)

```
This protocol should be done BEFORE the warm-up, not as a substitute.

1. Plantar activation (1 minute)
   Roll a massage ball or tennis ball from heel to arch
   Purpose: Wake up plantar fascia proprioception
   → Affects tension of the entire Superficial Back Line

2. Calf fascial release (1 minute)
   Roll a foam roller from Achilles to popliteal fossa
   Purpose: Release triceps surae, prepare ankle for movement

3. Thoracic and scapular activation (1 minute)
   Place foam roller across upper back, lie supine and roll
   Purpose: Improve thoracic extension, activate fascia around scapula

4. Lateral chain activation (1 minute)
   Standing lateral bends to stretch the lateral line
   Purpose: Wake up lateral line fascia, prepare for lateral movement

5. Full-body shaking (1 minute)
   Light bouncing, shake the whole body
   Purpose: Increase fascial hydration, improve whole-body gliding
```

### 7.4 Key Rehab Exercise Reference

```
The following exercises are organized by rehab phase.
Each exercise includes the "signal that tells you it's time for this exercise."

[Phase 1: Pain Management]

1. Pain-free isometric contractions
   Signal: Pain during joint movement, but want to maintain muscle activation
   Method: Gently contract the muscle without moving the joint, hold 10 sec, relax
   Example: Knee pain → seated quad isometric (leg straight, tense front thigh)
   Frequency: 3-5 sets daily, 10-15 contractions per set

2. Passive/active-assisted ROM maintenance
   Signal: Joint stiff but pain-free (mild stretch sensation OK)
   Method: Use opposite hand or band to assist joint through full ROM
   Example: Restricted shoulder → band-assisted external rotation

[Phase 2: ROM Restoration]

3. Cat-Cow — Spinal mobility
   Signal: Stiff low back, difficulty bending in the morning
   Method: Quadruped position, inhale drop belly/raise head, exhale round back
   Tempo: 5 seconds per movement, 10 reps

4. Thoracic extension (with foam roller)
   Signal: Rounded shoulders, shrugging during racket prep, limited shoulder elevation
   Method: Supine, foam roller under upper back, hands behind head, relax back
   Time: 2 minutes daily

5. Iliopsoas stretch (lunge stretch)
   Signal: Insufficient lunge distance, low back pain (anterior pelvic tilt type)
   Method: Lunge position, rear knee on ground, torso upright, push pelvis forward
   Hold: 30 seconds per side, 2 sets

6. Hamstring stretch (supine with towel)
   Signal: Cannot touch toes with straight legs, posterior thigh tight during backcourt braking
   Method: Supine, hook towel around foot, pull straight leg up
   Hold: 30 seconds per side, 2 sets

[Phase 3: Strength Restoration]

7. VMO activation (short arc extension)
   Signal: Anterior knee pain when going up/down stairs, weakness in last 10° of extension
   Method: Seated, rolled towel under knee, extend from 30° to 0°
         Consciously contract VMO (medial quad) in the last 10°
   Frequency: 3 sets × 15 reps, slow eccentric (3 sec)

8. Gluteus medius activation (clam shells)
   Signal: Knee valgus, unstable single-leg stance
   Method: Side-lying, knees bent 90°, band above knees, open top knee
          Keep torso stable — don't roll back
   Frequency: 3 sets × 12 reps per side

9. Middle/lower trapezius activation (prone Y/T/W)
   Signal: Shrugging during racket prep, weak smash, medial scapular pain
   Method:
   - Y: Prone, arms overhead forming Y, retract and depress scapulae, thumbs up
   - T: Arms out to sides forming T
   - W: Elbows bent, pull back forming W
   Frequency: 10 reps each posture, 2 rounds

10. Shoulder external rotator strengthening (band external rotation)
    Signal: Anterior shoulder pain after smashing, history of impingement
    Method: Standing, elbow bent 90° pressed to side, band fixed in front, rotate forearm outward
    Frequency: 3 sets × 15 reps

11. Transversus abdominis + multifidus co-contraction (dead bug)
    Signal: Feeling "disconnected" in the core when rotating to hit
    Method: Supine, limbs in air, low back pressed to floor
         Slowly lower opposite arm and leg, then return
         Key: low back stays on the floor throughout
    Frequency: 3 sets × 8 reps per side

12. Peroneus longus/brevis strengthening (band ankle eversion)
    Signal: History of recurring ankle sprains, lateral ankle instability
    Method: Seated, band around medial foot, evert ankle against resistance
    Frequency: 3 sets × 15 reps

[Phase 4: Functional Rehab]

13. Single-leg stance (progress to unstable surface)
    Signal: Unstable landings, weight wobbling after hitting
    Method: Single-leg stand for 30 sec, progress to eyes closed → soft surface → catching

14. Jump landing training
    Signal: Knee discomfort when landing from jumps
    Method: Step down from 10cm platform, land with knee flexed to 90°
          Hold landing stable for 3 sec before standing up
          Progress: randomize landing position (simulate match conditions)

15. Full-court footwork + hitting (simulated match play)
    Signal: All above exercises pain-free
    Method: Half-court → full-court footwork → add hitting → add random feeds
    Standard: No increased pain the day after completing 20 full-court patterns
           → ready to return to match play
```

---

## Appendix D: Diagnostic Tests and Rehab Quick Reference

> This appendix collects all diagnostic test methods, positive criteria, and rehab protocols for every injury/imbalance covered in this document.
> Organized by body region for quick on-court reference.

### D.1 Shoulder

#### D.1.1 Subacromial Impingement Syndrome

| Item | Description |
|:-----|:------------|
| **Self-check symptoms** | Sharp lateral shoulder pain at 60°-120° abduction; "clicking" sensation overhead; night pain on affected side |
| **Test ①: Neer Test** | Examiner stabilizes scapula, passively raises patient's arm forward overhead. **Positive**: provokes lateral shoulder pain at 120°-150° |
| **Test ②: Hawkins-Kennedy Test** | Patient shoulder flexed 90° + elbow flexed 90°, examiner passively depresses forearm (internal rotation). **Positive**: provokes lateral shoulder pain |
| **Test ③: Empty Can Test (Jobe Test)** | Patient arms abducted 90° + internally rotated (thumbs down), examiner pushes down against resistance. **Positive**: weakness or pain |
| **Rehab protocol** | ①Acute: avoid overhead movements, ice anterolateral shoulder → ②ROM: thoracic extension + pec stretch → ③Strength: external rotator (infraspinatus + teres minor) strengthening → ④Scapular stability: Y/T/W |
| **Return criteria** | Pain-free overhead movement + external rotation strength 90% of uninjured side |

#### D.1.2 Rotator Cuff Tear

| Item | Description |
|:-----|:------------|
| **Self-check symptoms** | Night pain waking from sleep, arm elevation weakness, difficulty combing hair/dressing, "gravelly" grinding sensation |
| **Test ①: Drop Arm Test** | Examiner passively raises arm to 180°, patient slowly lowers. **Positive**: arm drops suddenly at 30°-60° (uncontrollable) → highly suspicious for complete tear |
| **Test ②: External Rotation Lag Sign** | Patient seated, elbow 90° pressed to body, examiner passively rotates forearm to maximum ER, patient holds. **Positive**: unable to maintain ER, arm falls into IR → infraspinatus tear |
| **Test ③: Ultrasound/MRI** | Gold standard. US: tendon thickness, tear size; MRI: intra-articular structures |
| **Differential** | Impingement = strength preserved but painful arc; Tear = significant strength loss + trauma/degenerative history |
| **Rehab protocol** | ①Conservative (partial): immobilization 2-4 wks → passive ROM → isometrics → eccentric → functional. ②Surgical (complete/failed conservative): arthroscopic repair → 4-6 wk protection → graduated return |
| **Return criteria** | Pain-free overhead + Drop Arm Test negative + rotator cuff strength 85% of unaffected side |

---

### D.2 Elbow and Wrist

#### D.2.1 Tennis Elbow (Lateral Epicondylitis)

| Item | Description |
|:-----|:------------|
| **Self-check symptoms** | Lateral elbow pain when gripping/lifting/twisting a towel; tender over lateral bony prominence |
| **Test ①: Cozen's Test** | Patient forearm pronated + wrist extended, examiner applies downward resistance. **Positive**: lateral elbow pain |
| **Test ②: Mill's Test** | Patient forearm pronated + wrist flexed + elbow extended, examiner passively stretches. **Positive**: lateral elbow stretch pain |
| **Test ③: Maudsley's Test** | Patient extends middle finger against resistance. **Positive**: lateral elbow triggered pain |
| **Rehab protocol** | ①Acute: ice + stop power generation → ②Recovery: eccentric training (start light band, progressive, slow eccentric >3s) → ③Functional: gradual return to hitting (half-court light shots) |
| **Return criteria** | Cozen's Test negative + grip strength 90% of unaffected side + half-court hitting pain-free |

#### D.2.2 Golfer's Elbow (Medial Epicondylitis)

| Item | Description |
|:-----|:------------|
| **Self-check symptoms** | Medial elbow pain when flexing wrist against resistance; tender over medial bony prominence |
| **Test: Golfer's Elbow Test** | Patient forearm supinated + wrist flexed, examiner applies extension resistance. **Positive**: medial elbow pain |
| **Rehab protocol** | Similar to tennis elbow, substitute wrist flexor eccentrics (palm up) |
| **Return criteria** | Test negative + grip strength restored |

---

### D.3 Lower Back

#### D.3.1 Lumbar Strain vs Disc Herniation vs Facet Dysfunction

| Dimension | Lumbar strain | Disc herniation | Facet dysfunction |
|:----------|:--------------|:----------------|:-------------------|
| **Pain quality** | Diffuse ache, stiffness | Sharp pain + radiation to leg (sciatica) | Localized sharp pain, one finger lateral to spine |
| **Trigger** | Worsens after prolonged posture | Sudden with bending + rotation | Sudden rotational movement |
| **Activity effect** | Improves with movement | Flexion relieves, extension worsens | Extension + lateral flexion to painful side worsens |
| **Straight leg raise** | Negative (no leg pain) | Positive (30°-70° provokes leg radiating pain) | Negative |
| **Neurological signs** | None | Possible foot drop/weakness/numbness | None |

**Straight Leg Raise (SLR) Test:**

```
Patient supine, leg straight. Examiner slowly lifts the affected leg.
Normal: can lift >80° without leg radiating pain
Positive: leg radiating pain between 30°-70° (sciatic nerve stretch)
→ Suggests lumbar disc herniation
Note: posterior thigh tightness only (no radiating pain) = hamstring tightness, not positive
```

**Rehab protocols:**

| Type | Acute (1-3 days) | Recovery (4-14 days) | Functional (14d+) |
|:-----|:-----------------|:---------------------|:------------------|
| **Lumbar strain** | Rest + heat + avoid twisting | Core activation (TA + multifidus) | Gradual return, maintain core training |
| **Disc herniation** | Bed rest (not absolute) + avoid flexion | McKenzie extension exercises → core stability | Gradual return, avoid impact movements |
| **Facet dysfunction** | Avoid extension + rotation | Manual therapy (professional) + pelvic control | Core stability + hip mobility |

---

### D.4 Knee

#### D.4.1 Patellofemoral Pain Syndrome (PFPS)

| Item | Description |
|:-----|:------------|
| **Self-check symptoms** | Anterior knee pain with stairs/standing up/squatting; crepitus or clicking |
| **Test ①: Clarke's Test (Patellar Grind)** | Patient supine leg extended, examiner presses patella superiorly, patient contracts quad. **Positive**: provokes anterior knee pain |
| **Test ②: Patellar Apprehension Test** | Patient leg relaxed, examiner displaces patella laterally. **Positive**: pain or guarding reaction |
| **Test ③: Q-angle measurement** | ASIS → patella center → tibial tuberosity angle. **Abnormal**: >20°(F) or >15°(M) → high risk of abnormal tracking |
| **Rehab protocol** | ①VMO activation: short arc extension last 10° → ②Glute medius: clam shells → ③IT band stretch + VL release → ④Landing correction: avoid knee valgus |
| **Return criteria** | Stairs pain-free + squat to 90° pain-free + jump landing without knee valgus |

#### D.4.2 Patellar Tendinitis (Jumper's Knee)

| Item | Description |
|:-----|:------------|
| **Self-check symptoms** | Sharp pain pressing inferior patellar tip; worst during jump landing; painful squat to 90° |
| **Test ①: Step-Down Test** | Single-leg step down from 15cm platform with knee flexion shock absorption. **Positive**: inferior patellar pain |
| **Test ②: Decline Squat** | Stand on 15° decline board (heels higher), slowly squat. **Positive**: inferior patellar pain |
| **Rehab protocol** | ①Eccentric: decline board heel drop (classic, slow eccentric 3-5s) → ②Quad flexibility → ③Landing technique: knee flexion >90° |
| **Return criteria** | Decline squat pain-free + jump landing pain-free + no pain the day after 10 consecutive jumps |

#### D.4.3 Knee Ligament Screening

| Ligament | Test method | Positive finding |
|:---------|:------------|:-----------------|
| **ACL** | Lachman Test: knee 30° flexion, examiner stabilizes femur, pushes tibia forward | Tibial translation > unaffected side or soft endpoint |
| **PCL** | Posterior Drawer Test: knee 90° flexion, examiner pushes tibia backward | Tibial posterior translation |
| **MCL** | Valgus Stress Test: knee 30° flexion, examiner pushes lower leg outward | Medial gapping or pain |
| **LCL** | Varus Stress Test: knee 30° flexion, examiner pushes lower leg inward | Lateral gapping or pain |

**Note:** Positive ligament tests → recommend specialist consultation and MRI confirmation.

---

### D.5 Ankle

#### D.5.1 Ankle Sprain Grading and Tests

| Grade | Ligament injury | Presentation | Treatment |
|:------|:----------------|:-------------|:----------|
| **Grade 1** | Stretch (microtear) | Mild swelling, can bear weight | POLICE + proprioception training |
| **Grade 2** | Partial tear | Significant swelling + bruising, walking painful | Brace + partial weight bearing + rehab |
| **Grade 3** | Complete rupture | Severe swelling, unable to stand | Immobilization + specialist (some require surgery) |

**Test: Anterior Drawer Test**

```
Patient seated, knee 90° flexed, ankle relaxed.
Examiner stabilizes distal tibia with one hand, pulls calcaneus forward with the other.
Positive: talus translates forward > unaffected side (suggests ATFL laxity or rupture)
```

**Rehab protocol:**

| Phase | Time | Content |
|:------|:-----|:--------|
| Acute | 1-7 days | POLICE: Protection → Optimal Loading → Ice → Compression → Elevation |
| Recovery (ROM) | 3-14 days | Ankle alphabet (draw letters with foot), calf stretch |
| Recovery (Strength) | 7-28 days | Peroneal strengthening (band eversion), single-leg stance (proprioception) |
| Functional | 14+ days | Jump landing training (bilateral → unilateral), cutting drills |
| Return criteria | | Single-leg stance >30s (eyes closed >10s) + full-speed run + cut without pain + controlled landings |

---

### D.6 Muscle Imbalance Syndromes

#### D.6.1 Upper Cross Syndrome Screening

| Test | Procedure | Positive finding |
|:-----|:----------|:-----------------|
| **Wall Test** | Stand against wall, feet one foot-length away, glutes + upper back touching wall, head natural | Back of head cannot touch wall → forward head |
| **Supine head position** | Lie supine relaxed, observe chin position | Chin pointing up (cervical extension) → forward head |
| **Prone fly observation** | Prone, perform fly motion (thumbs up), observe ROM | Scapulae cannot squeeze or shoulder shrug compensates → middle/lower traps weak |
| **Shoulder flexion ROM** | Supine, straight arm raise overhead, check if touching ground | Arm cannot reach ground → tight pec major |

**Correction:**
```
☑ Stretch: pectoralis major (doorway stretch 30s×3), upper trapezius (lateral neck stretch 30s×3)
☑ Strengthen: Y/T/W (4x/week), chin tucks (5 min/day)
☑ Daily: every 30 min of sitting → Wall Test check
```

#### D.6.2 Lower Cross Syndrome Screening

| Test | Procedure | Positive finding |
|:-----|:----------|:-----------------|
| **Thomas Test** | Supine, hug one knee to chest, opposite leg falls naturally | Opposite leg cannot touch bed (floating) → tight iliopsoas |
| **Prone glute activation test** | Prone, single-leg extension | Extension <30°, or lumbar compensation (whole back arches) → weak glute max |
| **Standing forward bend observation** | Stand, slowly bend forward, observe lumbar curve | Lumbar "humps" rather than "curves evenly" → tight lumbar erector spinae |
| **Hamstring flexibility** | Supine, straight leg raise | Raise <80° (knee straight) → poor hamstring flexibility |

**Correction:**
```
☑ Stretch: iliopsoas (lunge stretch 30s×3), rectus femoris (standing heel to glute 30s×3)
☑ Strengthen: glute max (glute bridge 15×3), TA (dead bug 8×3)
☑ Daily: avoid prolonged sitting → every 30 min stand and do a glute bridge
```

---

### D.7 Rapid Diagnostic Flow

When you feel discomfort somewhere, follow this process:

```
Pain felt ↓
Ask: How did the pain start?
  ├─ Sudden violent movement → acute injury (ligament/tendon/muscle tear)
  │   └─ Can you walk/move? → Yes → find corresponding test → No → see doctor
  │
  ├─ Gradual onset → chronic overuse (tendinitis/trigger points/muscle imbalance)
  │   └─ Do the corresponding test
  │       Positive → follow rehab protocol
  │       Negative → check trigger points (see Chapter 4)
  │
  └─ Can't determine how → trigger point or compensatory tension
      └─ Check trigger point maps (Figures 12-13)
          Press the indicated area → does it reproduce your pain?
          Yes → treat per 4.4 process
          No → observe 2-3 days; if persists → see a specialist
```

---

### D.8 Rehab Phase Quick Reference

| How you feel | Phase | What to do |
|:-------------|:------|:-----------|
| Pain at rest, swelling obvious | Acute | Rest + ice + avoid aggravating + see doctor |
| Pain with movement, not at rest | ROM-restricted | Gentle stretch + joint mobility + pain-free isometrics |
| Movement pain-free but loading hurts | Strength recovery | Eccentric + concentric + gradual load increase |
| Loading OK but sport-specific hurts | Functional rehab | Sport-specific training + proprioception + simulated match |
| Completely pain-free, same as before injury | Return line | Gradual return to match play + maintain preventive training |

---

*Version: v1.0 (Anatomy & Rehabilitation Basics)*
*References: Sports Anatomy (Beijing Sport University Press), Sports Injury Anatomy (Brad Walker), Human Anatomy Color Atlas, NSCA-CSCS, Rehabilitation Medicine Handbook, Joint Mobilization*
*Audience: Badminton coaches, intermediate to advanced athletes, sports rehab beginners*

---

> **📖 Companion illustrations**: Anatomical diagrams for this chapter (motor control chain, trigger point mechanism, referred pain, upper/lower cross syndrome, rotator cuff, etc.) are available in `docs/zh/images/17/README.md` or directly in the `docs/zh/images/17/` directory as SVG files.
"""

with open(EN_PATH, 'a', encoding='utf-8') as f:
    f.write(missing)

print(f'Appended to {EN_PATH}')
print(f'New size: {os.path.getsize(EN_PATH)} bytes')
