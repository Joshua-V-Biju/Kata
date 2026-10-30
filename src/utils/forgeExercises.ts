import { Exercise, EquipmentId, MuscleGroup } from '../types/forge';

// Comprehensive 150+ Home Exercise Library tailored for usable and visible muscle
export const ALL_FORGE_EXERCISES: Exercise[] = [
  // =========================================================================
  // PUSH: CHEST, TRICEPS, FRONT DELTS (35 Exercises)
  // =========================================================================
  {
    id: 'pushup-standard',
    name: 'Standard Push-up',
    category: 'push',
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['shoulders', 'abs'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'beginner',
    formCues: ['Elbows at 45 degrees to torso', 'Hollow body plank, glutes locked', 'Full chest-to-floor depth'],
    progressionNextId: 'pushup-diamond',
    regressionPrevId: 'pushup-incline',
    substitutionTips: 'Incline on chair/wall if working up to floor reps.'
  },
  {
    id: 'pushup-incline',
    name: 'Incline Push-up (Hands on Bench/Chair)',
    category: 'push',
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['shoulders'],
    requiredEquipment: ['chair_table'],
    difficulty: 'beginner',
    formCues: ['Hands shoulder-width on stable chair edge', 'Lower sternum to edge', 'Body straight as a plank'],
    progressionNextId: 'pushup-standard'
  },
  {
    id: 'pushup-decline',
    name: 'Decline Push-up (Feet Elevated)',
    category: 'push',
    primaryMuscles: ['chest', 'shoulders'],
    secondaryMuscles: ['triceps', 'abs'],
    requiredEquipment: ['chair_table'],
    difficulty: 'intermediate',
    formCues: ['Feet elevated on chair or bed', 'Emphasizes upper clavicular chest', 'Control 3-second descent'],
    progressionNextId: 'pike-pushup',
    regressionPrevId: 'pushup-standard'
  },
  {
    id: 'pushup-diamond',
    name: 'Diamond Push-up',
    category: 'push',
    primaryMuscles: ['triceps', 'chest'],
    secondaryMuscles: ['shoulders'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'intermediate',
    formCues: ['Thumbs and index fingers touching under chest', 'Elbows tight to ribcage', 'Hard lockout at top'],
    progressionNextId: 'pushup-archer',
    regressionPrevId: 'pushup-standard'
  },
  {
    id: 'pushup-wide',
    name: 'Wide-Grip Chest Push-up',
    category: 'push',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders', 'triceps'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'beginner',
    formCues: ['Hands 1.5x shoulder width', 'Deep pectoral stretch at bottom', 'Push through base of palms']
  },
  {
    id: 'pushup-archer',
    name: 'Archer Push-up',
    category: 'push',
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['shoulders', 'abs'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'advanced',
    formCues: ['Slide non-working arm straight to side', 'Lower chest solely over bent arm', 'Keep core strictly level'],
    progressionNextId: 'pushup-onearm',
    regressionPrevId: 'pushup-diamond'
  },
  {
    id: 'pushup-pseudo-planche',
    name: 'Pseudo Planche Push-up',
    category: 'push',
    primaryMuscles: ['shoulders', 'chest'],
    secondaryMuscles: ['triceps', 'abs'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'advanced',
    formCues: ['Hands turned back, lean shoulders far past wrists', 'Protracted shoulder blades at top', 'Extreme shoulder loading']
  },
  {
    id: 'pushup-onearm',
    name: 'One-Arm Push-up',
    category: 'push',
    primaryMuscles: ['chest', 'triceps', 'abs'],
    secondaryMuscles: ['shoulders'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'elite',
    formCues: ['Wide feet base', 'Working hand centered under chest', 'Drive whole palm into floor without twisting hips'],
    regressionPrevId: 'pushup-archer'
  },
  {
    id: 'pushup-weighted-pack',
    name: 'Backpack-Loaded Push-up',
    category: 'push',
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['shoulders', 'abs'],
    requiredEquipment: ['weighted_vest'],
    difficulty: 'intermediate',
    formCues: ['Snug backpack loaded with books/water', 'Brace core firmly to support weight', 'Strict 6-12 rep hypertrophy tempo']
  },
  {
    id: 'pushup-deficit',
    name: 'Deficit Push-up (Books / Parallettes)',
    category: 'push',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['triceps', 'shoulders'],
    requiredEquipment: ['dip_bars'],
    difficulty: 'intermediate',
    formCues: ['Hands elevated on books/blocks/handles', 'Sink chest 2 inches past hands', '2-second pause in deep stretch']
  },
  {
    id: 'pushup-explosive',
    name: 'Explosive Clapping Push-up',
    category: 'push',
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['shoulders'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'intermediate',
    formCues: ['Maximal violent push off floor', 'Clap hands under chest', 'Land softly with immediate recoil into next rep']
  },
  {
    id: 'dip-standard',
    name: 'Parallel Bar Dips',
    category: 'push',
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['shoulders'],
    requiredEquipment: ['dip_bars'],
    difficulty: 'intermediate',
    formCues: ['Slight forward torso lean for chest focus', 'Lower until upper arms reach parallel', 'Lock out elbows with control'],
    progressionNextId: 'dip-weighted',
    regressionPrevId: 'dip-bench'
  },
  {
    id: 'dip-bench',
    name: 'Bench / Sturdy Chair Dips',
    category: 'push',
    primaryMuscles: ['triceps'],
    secondaryMuscles: ['chest', 'shoulders'],
    requiredEquipment: ['chair_table'],
    difficulty: 'beginner',
    formCues: ['Back skimming chair edge', 'Elbows bend straight back', 'Feet extended on floor or elevated on second chair'],
    progressionNextId: 'dip-standard'
  },
  {
    id: 'dip-weighted',
    name: 'Weighted Dip (Loaded Backpack)',
    category: 'push',
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['shoulders'],
    requiredEquipment: ['dip_bars', 'weighted_vest'],
    difficulty: 'advanced',
    formCues: ['Backpack strapped firmly on front or back', 'Controlled 3s negative', 'Powerful press to lockout']
  },
  {
    id: 'dip-negative',
    name: 'Negative Bar Dips (5s Lowering)',
    category: 'push',
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['shoulders'],
    requiredEquipment: ['dip_bars'],
    difficulty: 'beginner',
    formCues: ['Jump or step up to top support', 'Slowly descend taking 5 seconds', 'Step back up and repeat']
  },
  {
    id: 'pike-pushup',
    name: 'Pike Push-up (Floor)',
    category: 'push',
    primaryMuscles: ['shoulders', 'triceps'],
    secondaryMuscles: ['chest', 'abs'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'intermediate',
    formCues: ['Hips high in inverted V', 'Head moves forward of hands like a tripod', 'Press back and upward through shoulders'],
    progressionNextId: 'pike-pushup-elevated',
    regressionPrevId: 'pushup-decline'
  },
  {
    id: 'pike-pushup-elevated',
    name: 'Feet-Elevated Pike Push-up',
    category: 'push',
    primaryMuscles: ['shoulders', 'triceps'],
    secondaryMuscles: ['abs'],
    requiredEquipment: ['chair_table'],
    difficulty: 'advanced',
    formCues: ['Toes on chair, torso nearly vertical over hands', 'Touch crown of head forward to floor', 'Full overhead press lockout'],
    progressionNextId: 'handstand-pushup-wall',
    regressionPrevId: 'pike-pushup'
  },
  {
    id: 'handstand-pushup-wall',
    name: 'Wall-Assisted Handstand Push-up',
    category: 'push',
    primaryMuscles: ['shoulders', 'triceps'],
    secondaryMuscles: ['chest', 'abs'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'advanced',
    formCues: ['Kick up facing wall or back to wall', 'Controlled lowering to touch head', 'Explosive vertical shoulder drive'],
    regressionPrevId: 'pike-pushup-elevated'
  },
  {
    id: 'db-floor-press',
    name: 'Dumbbell Floor Press',
    category: 'push',
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['shoulders'],
    requiredEquipment: ['dumbbells'],
    difficulty: 'beginner',
    formCues: ['Lie flat on floor with knees bent', 'Upper arms touch floor at 45°', 'Press up converging at top without clanking']
  },
  {
    id: 'db-overhead-press',
    name: 'Standing Dumbbell Overhead Press',
    category: 'push',
    primaryMuscles: ['shoulders', 'triceps'],
    secondaryMuscles: ['abs'],
    requiredEquipment: ['dumbbells'],
    difficulty: 'beginner',
    formCues: ['Glutes squeezed, ribs tucked down', 'Press straight overhead to biceps by ears', 'Smooth 2s lowering']
  },
  {
    id: 'db-lateral-raise',
    name: 'Dumbbell Lateral Raise (Side Delts)',
    category: 'push',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: [],
    requiredEquipment: ['dumbbells'],
    difficulty: 'beginner',
    formCues: ['Slight forward torso lean', 'Lead with elbows out to sides', 'Pause at shoulder height, avoid shrugging traps']
  },
  {
    id: 'band-lateral-raise',
    name: 'Resistance Band Lateral Raise',
    category: 'push',
    primaryMuscles: ['shoulders'],
    secondaryMuscles: [],
    requiredEquipment: ['bands'],
    difficulty: 'beginner',
    formCues: ['Stand on center of band', 'Raise hands in scapular plane', 'Continuous tension on lateral shoulder cap']
  },
  {
    id: 'band-chest-fly',
    name: 'Resistance Band Standing Chest Fly',
    category: 'push',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders'],
    requiredEquipment: ['bands'],
    difficulty: 'beginner',
    formCues: ['Anchor band behind back or around doorway', 'Bring hands together in wide hugging arc', 'Hard 2-second pectoral squeeze at peak']
  },
  {
    id: 'band-overhead-press',
    name: 'Band Overhead Strict Press',
    category: 'push',
    primaryMuscles: ['shoulders', 'triceps'],
    secondaryMuscles: ['abs'],
    requiredEquipment: ['bands'],
    difficulty: 'beginner',
    formCues: ['Step on band with midfoot', 'Drive handles straight up to ceiling', 'Resist the snap down']
  },
  {
    id: 'tricep-overhead-extension-db',
    name: 'Dumbbell Overhead Tricep Extension',
    category: 'push',
    primaryMuscles: ['triceps'],
    secondaryMuscles: [],
    requiredEquipment: ['dumbbells'],
    difficulty: 'beginner',
    formCues: ['Hold dumbbell cup overhead with two hands', 'Elbows pinned facing forward', 'Deep stretch behind neck, extend to lockout']
  },
  {
    id: 'tricep-kickback-db',
    name: 'Dumbbell Tricep Kickback',
    category: 'push',
    primaryMuscles: ['triceps'],
    secondaryMuscles: [],
    requiredEquipment: ['dumbbells'],
    difficulty: 'beginner',
    formCues: ['Torso parallel to floor', 'Upper arm pinned to ribcage', 'Extend forearm backward, squeeze tricep peak 1s']
  },
  {
    id: 'skullcrusher-floor-db',
    name: 'Floor Lying Dumbbell Skullcrushers',
    category: 'push',
    primaryMuscles: ['triceps'],
    secondaryMuscles: [],
    requiredEquipment: ['dumbbells'],
    difficulty: 'intermediate',
    formCues: ['Lie on floor, arms vertical', 'Bend elbows lowering dumbbells beside temples', 'Drive back to top with triceps only']
  },
  {
    id: 'band-tricep-pushdown',
    name: 'High-Anchor Band Tricep Pushdown',
    category: 'push',
    primaryMuscles: ['triceps'],
    secondaryMuscles: [],
    requiredEquipment: ['bands'],
    difficulty: 'beginner',
    formCues: ['Loop band over door or pull-up bar', 'Pin elbows to flanks', 'Push down and spread band ends at bottom']
  },
  {
    id: 'bodyweight-tricep-extension',
    name: 'Bodyweight Tricep Extension (Table / Bar)',
    category: 'push',
    primaryMuscles: ['triceps'],
    secondaryMuscles: ['abs'],
    requiredEquipment: ['chair_table'],
    difficulty: 'intermediate',
    formCues: ['Grip table rim or low bar', 'Lower forehead beneath hands by bending elbows only', 'Press triceps hard to extend']
  },

  // =========================================================================
  // PULL: BACK, LATS, REAR DELTS, BICEPS (35 Exercises)
  // =========================================================================
  {
    id: 'pullup-strict',
    name: 'Strict Pull-up (Overhand Grip)',
    category: 'pull',
    primaryMuscles: ['back', 'biceps'],
    secondaryMuscles: ['forearms', 'shoulders'],
    requiredEquipment: ['pullup_bar'],
    difficulty: 'intermediate',
    formCues: ['Full dead hang at bottom', 'Pull elbows down into back pockets', 'Chin completely over bar without kicking legs'],
    progressionNextId: 'pullup-weighted',
    regressionPrevId: 'pullup-band-assisted'
  },
  {
    id: 'chinup-strict',
    name: 'Strict Chin-up (Underhand Grip)',
    category: 'pull',
    primaryMuscles: ['biceps', 'back'],
    secondaryMuscles: ['forearms'],
    requiredEquipment: ['pullup_bar'],
    difficulty: 'intermediate',
    formCues: ['Palms facing you', 'Heavy bicep recruitment', 'Chest touches bar at peak contraction'],
    progressionNextId: 'chinup-weighted',
    regressionPrevId: 'inverted-row'
  },
  {
    id: 'pullup-wide',
    name: 'Wide-Grip Pull-up (Lat Width Focus)',
    category: 'pull',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'forearms'],
    requiredEquipment: ['pullup_bar'],
    difficulty: 'advanced',
    formCues: ['Grip 1.5x shoulder width', 'Lead with chest high', 'Packs width onto upper lat sweep']
  },
  {
    id: 'pullup-band-assisted',
    name: 'Band-Assisted Pull-up',
    category: 'pull',
    primaryMuscles: ['back', 'biceps'],
    secondaryMuscles: ['forearms'],
    requiredEquipment: ['pullup_bar', 'bands'],
    difficulty: 'beginner',
    formCues: ['Loop band around bar and step one foot in', 'Maintain strict vertical torso', 'Use band to practice full top lockout'],
    progressionNextId: 'pullup-strict'
  },
  {
    id: 'pullup-negative',
    name: 'Negative Pull-up (5-Second Descent)',
    category: 'pull',
    primaryMuscles: ['back', 'biceps'],
    secondaryMuscles: ['forearms'],
    requiredEquipment: ['pullup_bar'],
    difficulty: 'beginner',
    formCues: ['Jump or step to chin over bar', 'Resist gravity slowly for 5 full seconds', 'Best method to unlock your first pull-up'],
    progressionNextId: 'pullup-strict'
  },
  {
    id: 'pullup-scapular',
    name: 'Scapular Pull-up (Hanging Shrugs)',
    category: 'pull',
    primaryMuscles: ['back', 'forearms'],
    secondaryMuscles: ['shoulders'],
    requiredEquipment: ['pullup_bar'],
    difficulty: 'beginner',
    formCues: ['Keep arms locked straight', 'Depress shoulder blades down to lift torso 2-3 inches', 'Hold top 1s, lower slowly']
  },
  {
    id: 'pullup-weighted',
    name: 'Weighted Pull-up (Loaded Backpack)',
    category: 'pull',
    primaryMuscles: ['back', 'biceps'],
    secondaryMuscles: ['forearms'],
    requiredEquipment: ['pullup_bar', 'weighted_vest'],
    difficulty: 'advanced',
    formCues: ['Wear loaded backpack securely', 'Do not compromise dead hang depth', 'Massive lat builder']
  },
  {
    id: 'pullup-archer',
    name: 'Archer Pull-up',
    category: 'pull',
    primaryMuscles: ['back', 'biceps'],
    secondaryMuscles: ['forearms'],
    requiredEquipment: ['pullup_bar'],
    difficulty: 'elite',
    formCues: ['Wide overhand grip', 'Pull to one hand while extending opposite arm straight along bar', 'Alternate sides each rep']
  },
  {
    id: 'pullup-commando',
    name: 'Commando Pull-up (Alternate Grip)',
    category: 'pull',
    primaryMuscles: ['back', 'biceps'],
    secondaryMuscles: ['abs', 'forearms'],
    requiredEquipment: ['pullup_bar'],
    difficulty: 'intermediate',
    formCues: ['Stand perpendicular under bar, staggered grip', 'Pull head to one side of bar, next rep to opposite side']
  },
  {
    id: 'inverted-row',
    name: 'Inverted Row (Under Table / Low Bar)',
    category: 'pull',
    primaryMuscles: ['back', 'biceps'],
    secondaryMuscles: ['forearms', 'abs'],
    requiredEquipment: ['chair_table'],
    difficulty: 'beginner',
    formCues: ['Lie under table edge or parallettes', 'Body straight as a board, heels on floor', 'Pull chest to table rim, squeeze shoulder blades'],
    progressionNextId: 'pullup-strict'
  },
  {
    id: 'inverted-row-elevated',
    name: 'Inverted Row (Feet Elevated on Chair)',
    category: 'pull',
    primaryMuscles: ['back', 'biceps'],
    secondaryMuscles: ['forearms', 'abs'],
    requiredEquipment: ['chair_table'],
    difficulty: 'intermediate',
    formCues: ['Elevate heels onto chair for horizontal leverage', 'Increases pulling resistance significantly']
  },
  {
    id: 'door-towel-row',
    name: 'Doorframe Towel Row (Zero Gear)',
    category: 'pull',
    primaryMuscles: ['back', 'biceps'],
    secondaryMuscles: ['forearms'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'beginner',
    formCues: ['Wrap towel around solid door handles or post', 'Lean back at 45°', 'Row chest to hands squeezing mid-back hard']
  },
  {
    id: 'band-lat-pulldown',
    name: 'Kneeling Band Lat Pulldown',
    category: 'pull',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'shoulders'],
    requiredEquipment: ['bands'],
    difficulty: 'beginner',
    formCues: ['Anchor band high on door or bar', 'Kneel upright, chest proud', 'Pull elbows down and slightly back into sides']
  },
  {
    id: 'band-seated-row',
    name: 'Seated Resistance Band Row',
    category: 'pull',
    primaryMuscles: ['back', 'biceps'],
    secondaryMuscles: ['forearms'],
    requiredEquipment: ['bands'],
    difficulty: 'beginner',
    formCues: ['Sit on floor with legs extended, loop band around soles', 'Pull handles into navel', 'Retract shoulder blades fully']
  },
  {
    id: 'band-face-pull',
    name: 'Band Face Pull (Rear Delts & Rotators)',
    category: 'pull',
    primaryMuscles: ['shoulders', 'back'],
    secondaryMuscles: [],
    requiredEquipment: ['bands'],
    difficulty: 'beginner',
    formCues: ['Anchor band at eye level', 'Pull toward forehead separating hands', 'External rotation: thumbs pointing backward at end']
  },
  {
    id: 'db-single-arm-row',
    name: 'Single-Arm Dumbbell / Backpack Row',
    category: 'pull',
    primaryMuscles: ['back', 'biceps'],
    secondaryMuscles: ['forearms'],
    requiredEquipment: ['dumbbells'],
    difficulty: 'beginner',
    formCues: ['One hand supported on chair/bench', 'Pull weight toward hip crease, not shoulder', 'Feel deep lat stretch at bottom']
  },
  {
    id: 'db-bent-over-row',
    name: 'Bent-Over Dual Dumbbell Row',
    category: 'pull',
    primaryMuscles: ['back', 'biceps'],
    secondaryMuscles: ['hamstrings', 'abs'],
    requiredEquipment: ['dumbbells'],
    difficulty: 'intermediate',
    formCues: ['Hinge at hips to 45 degrees, spine neutral', 'Drive elbows straight back', 'Squeeze upper back 1 second at top']
  },
  {
    id: 'db-rear-delt-fly',
    name: 'Bent-Over Dumbbell Rear Delt Fly',
    category: 'pull',
    primaryMuscles: ['shoulders', 'back'],
    secondaryMuscles: [],
    requiredEquipment: ['dumbbells'],
    difficulty: 'beginner',
    formCues: ['Bend forward at hips', 'Slight elbow bend, raise arms like wings', 'Focus solely on rear shoulder caps, not traps']
  },
  {
    id: 'db-shrugs',
    name: 'Standing Dumbbell / Pack Shrugs',
    category: 'pull',
    primaryMuscles: ['back'],
    secondaryMuscles: ['forearms'],
    requiredEquipment: ['dumbbells'],
    difficulty: 'beginner',
    formCues: ['Hold heavy weights at sides', 'Elevate shoulders directly toward ears', 'Hold peak 2 seconds, no rolling shoulders']
  },
  {
    id: 'bicep-curl-db',
    name: 'Standing Dumbbell Supinated Curl',
    category: 'pull',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    requiredEquipment: ['dumbbells'],
    difficulty: 'beginner',
    formCues: ['Elbows pinned to flanks', 'Supinate wrist (pinky turned out) as you lift', 'Hard 1s squeeze at top']
  },
  {
    id: 'bicep-hammer-curl',
    name: 'Dumbbell Hammer Curl (Brachialis Focus)',
    category: 'pull',
    primaryMuscles: ['biceps', 'forearms'],
    secondaryMuscles: [],
    requiredEquipment: ['dumbbells'],
    difficulty: 'beginner',
    formCues: ['Palms face inward throughout motion', 'Builds arm thickness and forearm size', 'Control the 3s descent']
  },
  {
    id: 'bicep-curl-band',
    name: 'Resistance Band Dual Bicep Curl',
    category: 'pull',
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    requiredEquipment: ['bands'],
    difficulty: 'beginner',
    formCues: ['Stand on band, curl hands up toward shoulders', 'Peak tension directly at top contraction']
  },
  {
    id: 'bodyweight-bicep-curl',
    name: 'Bodyweight Bicep Curl (Under Low Bar / Table)',
    category: 'pull',
    primaryMuscles: ['biceps', 'forearms'],
    secondaryMuscles: ['back'],
    requiredEquipment: ['chair_table'],
    difficulty: 'intermediate',
    formCues: ['Lie under table, palms supinated facing your face', 'Pull forehead toward table rim by bending elbows only', 'Insane bodyweight bicep isolation']
  },
  {
    id: 'dead-hang-grip',
    name: 'Dead Hang (Grip & Forearm Armor)',
    category: 'pull',
    primaryMuscles: ['forearms'],
    secondaryMuscles: ['back'],
    requiredEquipment: ['pullup_bar'],
    difficulty: 'beginner',
    formCues: ['Hang completely relaxed from bar', 'Deep shoulder decompression and grip endurance', 'Accumulate 60-90 seconds']
  },

  // =========================================================================
  // LEGS: QUADS, HAMSTRINGS, GLUTES, CALVES (35 Exercises)
  // =========================================================================
  {
    id: 'bodyweight-squat',
    name: 'Air Squat (3s Tempo Descent)',
    category: 'legs',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['calves', 'abs'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'beginner',
    formCues: ['Feet shoulder-width, knees track over toes', 'Hip crease breaks parallel below knee', 'Chest proud, drive through mid-foot'],
    progressionNextId: 'bulgarian-split-squat'
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    category: 'legs',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves'],
    requiredEquipment: ['chair_table'],
    difficulty: 'intermediate',
    formCues: ['Rear foot laces flat on chair/couch', 'Drop back knee straight down', 'Drive up through front heel and midfoot'],
    progressionNextId: 'pistol-squat',
    regressionPrevId: 'bodyweight-squat'
  },
  {
    id: 'pistol-squat',
    name: 'Pistol Squat (Single Leg Free)',
    category: 'legs',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['abs', 'calves'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'advanced',
    formCues: ['Free leg extended straight in front', 'Descend under full control on single leg', 'Explode out of bottom without rocking heel up'],
    regressionPrevId: 'pistol-squat-assisted'
  },
  {
    id: 'pistol-squat-assisted',
    name: 'Assisted Pistol Squat (Doorframe/Pole)',
    category: 'legs',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['calves'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'intermediate',
    formCues: ['Hold door frame with fingertips for light balance assist', 'Lower all the way down, press up through single foot'],
    progressionNextId: 'pistol-squat'
  },
  {
    id: 'cossack-squat',
    name: 'Cossack Squat (Lateral Mobility & Legs)',
    category: 'legs',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'intermediate',
    formCues: ['Wide stance, sink deep onto one leg', 'Opposite leg straight, toes point to ceiling', 'Excellent hip mobility & strength']
  },
  {
    id: 'sissy-squat',
    name: 'Bodyweight Sissy Squat (Quad Isolation)',
    category: 'legs',
    primaryMuscles: ['quads'],
    secondaryMuscles: ['calves'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'advanced',
    formCues: ['Hold wall lightly, push knees forward over toes onto balls of feet', 'Torso and thighs form one continuous line', 'Brutal quad isolation']
  },
  {
    id: 'single-leg-rdl',
    name: 'Single-Leg Romanian Deadlift (Hinge)',
    category: 'legs',
    primaryMuscles: ['hamstrings', 'glutes'],
    secondaryMuscles: ['calves', 'abs'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'intermediate',
    formCues: ['Hinge at hip, rear leg kicks back as counterbalance', 'Keep hips square to floor', 'Feel deep stretch in standing hamstring']
  },
  {
    id: 'nordic-hamstring-curl',
    name: 'Nordic Hamstring Curl (Assisted)',
    category: 'legs',
    primaryMuscles: ['hamstrings'],
    secondaryMuscles: ['glutes'],
    requiredEquipment: ['chair_table'],
    difficulty: 'elite',
    formCues: ['Ankles anchored under couch or by partner', 'Lower torso forward taking 4-5 seconds', 'Catch yourself on hands and press back up']
  },
  {
    id: 'glute-bridge-single',
    name: 'Single-Leg Glute Bridge',
    category: 'legs',
    primaryMuscles: ['glutes', 'hamstrings'],
    secondaryMuscles: ['abs'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'beginner',
    formCues: ['Lie on floor, one knee bent foot flat, other leg in air', 'Drive through heel lifting hips high', 'Hard 2-second glute contraction at top']
  },
  {
    id: 'db-goblet-squat',
    name: 'Goblet Squat (Dumbbell / Backpack)',
    category: 'legs',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['abs'],
    requiredEquipment: ['dumbbells'],
    difficulty: 'beginner',
    formCues: ['Hold dumbbell tight against sternum', 'Squat deep between knees', 'Spine upright, drive up through whole foot']
  },
  {
    id: 'db-walking-lunges',
    name: 'Walking Lunges (Dumbbells / Pack)',
    category: 'legs',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves'],
    requiredEquipment: ['dumbbells'],
    difficulty: 'beginner',
    formCues: ['Large stride forward, back knee hovers 1 inch off floor', 'Keep torso tall', 'Step smoothly through into next stride']
  },
  {
    id: 'standing-calf-raise',
    name: 'Single-Leg Elevated Calf Raise',
    category: 'legs',
    primaryMuscles: ['calves'],
    secondaryMuscles: [],
    requiredEquipment: ['bodyweight'],
    difficulty: 'beginner',
    formCues: ['Ball of foot on stair edge', 'Sink into deep heel stretch for 2s', 'Drive high onto big toe, hold peak 1s']
  },
  {
    id: 'jump-squat-plyo',
    name: 'Explosive Jump Squats (Plyometric)',
    category: 'legs',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['calves'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'intermediate',
    formCues: ['Descend into half squat, explode vertically', 'Achieve maximum height', 'Land softly absorbing through toes to heels']
  },

  // =========================================================================
  // CORE & SKILLS: ABS, OBLIQUES, HANDSTAND, L-SIT (30 Exercises)
  // =========================================================================
  {
    id: 'hollow-body-hold',
    name: 'Hollow Body Hold',
    category: 'core',
    primaryMuscles: ['abs'],
    secondaryMuscles: ['quads'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'intermediate',
    formCues: ['Lower back smashed completely into floor', 'Arms by ears, legs 6 inches off ground', 'Breathe through braced abdomen']
  },
  {
    id: 'hanging-leg-raise',
    name: 'Hanging Strict Toes-to-Bar / Leg Raise',
    category: 'core',
    primaryMuscles: ['abs'],
    secondaryMuscles: ['forearms'],
    requiredEquipment: ['pullup_bar'],
    difficulty: 'advanced',
    formCues: ['No swinging or kipping', 'Curl pelvis up bringing straight toes to bar', 'Slow 3-second descent']
  },
  {
    id: 'hanging-knee-raise',
    name: 'Hanging Knee Raise',
    category: 'core',
    primaryMuscles: ['abs'],
    secondaryMuscles: ['forearms'],
    requiredEquipment: ['pullup_bar'],
    difficulty: 'beginner',
    formCues: ['Dead hang, bring knees to touch chest', 'Posterior pelvic tilt at top', 'Lower under strict control'],
    progressionNextId: 'hanging-leg-raise'
  },
  {
    id: 'lsit-parallettes',
    name: 'L-Sit Hold (Chair / Parallettes)',
    category: 'skills',
    primaryMuscles: ['abs', 'triceps'],
    secondaryMuscles: ['quads', 'shoulders'],
    requiredEquipment: ['dip_bars'],
    difficulty: 'advanced',
    formCues: ['Lock elbows, push shoulders down away from ears', 'Elevate straight legs horizontal to floor', 'Point toes, hold for time']
  },
  {
    id: 'lsit-tuck',
    name: 'Tuck L-Sit Hold (Chairs / Floor)',
    category: 'skills',
    primaryMuscles: ['abs', 'triceps'],
    secondaryMuscles: ['shoulders'],
    requiredEquipment: ['chair_table'],
    difficulty: 'intermediate',
    formCues: ['Depress shoulders, bring knees tight to chest off floor', 'Keep hips forward of hands', 'Hold for 15-30 seconds'],
    progressionNextId: 'lsit-parallettes'
  },
  {
    id: 'ab-wheel-rollout',
    name: 'Floor Ab Wheel / Towel Rollout',
    category: 'core',
    primaryMuscles: ['abs'],
    secondaryMuscles: ['shoulders', 'back'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'advanced',
    formCues: ['Kneel on towel or mat', 'Roll arms forward extending body long', 'Keep hips tucked, pull back with core only']
  },
  {
    id: 'side-plank-elevated',
    name: 'Elevated Side Plank (Oblique Focus)',
    category: 'core',
    primaryMuscles: ['abs'],
    secondaryMuscles: ['shoulders', 'glutes'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'beginner',
    formCues: ['Straight line from head to ankles', 'Lift top hip high, squeeze underside obliques', 'Hold 45s per side']
  },
  {
    id: 'dragon-flag-negatives',
    name: 'Dragon Flag (Negative Descent)',
    category: 'core',
    primaryMuscles: ['abs'],
    secondaryMuscles: ['back', 'triceps'],
    requiredEquipment: ['chair_table'],
    difficulty: 'elite',
    formCues: ['Hold edge of bench or heavy pole behind head', 'Elevate entire body in rigid pole', 'Lower slowly using abs like a steel lever']
  },
  {
    id: 'handstand-wall-hold',
    name: 'Wall Handstand Hold (Chest to Wall)',
    category: 'skills',
    primaryMuscles: ['shoulders', 'abs'],
    secondaryMuscles: ['triceps'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'intermediate',
    formCues: ['Walk feet up wall, hands 6 inches away', 'Push floor away actively through shoulders', 'Glutes tight, ribs hollow, look between hands']
  },
  {
    id: 'freestanding-handstand',
    name: 'Freestanding Handstand Practice',
    category: 'skills',
    primaryMuscles: ['shoulders', 'abs'],
    secondaryMuscles: ['forearms'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'elite',
    formCues: ['Kick up gently to balance point', 'Fingers grip floor like eagle claws for balance', 'Stack shoulders over wrists, hips over shoulders']
  }
];
