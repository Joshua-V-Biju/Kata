import { EquipmentItem, Exercise, ForgeRoutine } from '../types/forge';

export const AVAILABLE_EQUIPMENT: EquipmentItem[] = [
  {
    id: 'bodyweight',
    name: 'Bodyweight (Floor / Space)',
    icon: 'Activity',
    category: 'core',
    description: 'Fundamental calisthenics, push-ups, squats, floor core.',
    substitutionTip: 'Always available everywhere.'
  },
  {
    id: 'pullup_bar',
    name: 'Pull-up Bar (Doorway / Wall)',
    icon: 'Maximize2',
    category: 'core',
    description: 'Crucial for vertical pulling, lats, biceps, grip.',
    substitutionTip: 'No bar? Use door frame rows, towel-around-door, or under-table rows.'
  },
  {
    id: 'dip_bars',
    name: 'Dip Bars / Parallettes',
    icon: 'AlignJustify',
    category: 'core',
    description: 'Deep chest and triceps loading, L-sits, planches.',
    substitutionTip: 'Substitute with two sturdy chairs or countertop edge dips.'
  },
  {
    id: 'bands',
    name: 'Resistance Bands (Loop / Tube)',
    icon: 'Infinity',
    category: 'accessory',
    description: 'Accommodating resistance, face pulls, lat pulldowns, curls.',
    substitutionTip: 'Can mimic almost any cable or dumbbell movement at home.'
  },
  {
    id: 'dumbbells',
    name: 'Dumbbells / Adjustable Dumbbells',
    icon: 'Dumbbell',
    category: 'accessory',
    description: 'Overhead presses, lateral raises, curls, goblet squats.',
    substitutionTip: 'Can substitute with filled water jugs or a weighted backpack.'
  },
  {
    id: 'weighted_vest',
    name: 'Backpack / Weighted Vest',
    icon: 'Shield',
    category: 'accessory',
    description: 'Add progressive load to push-ups, pull-ups, and squats.',
    substitutionTip: 'Load a standard backpack with textbooks or water bottles.'
  },
  {
    id: 'bench',
    name: 'Workout Bench / Stable Ottoman',
    icon: 'MinusSquare',
    category: 'accessory',
    description: 'Chest press, step-ups, incline push-ups, seated rows.',
    substitutionTip: 'Use a sturdy wooden chair, bed edge, or floor press.'
  },
  {
    id: 'kettlebell',
    name: 'Kettlebell',
    icon: 'Disc',
    category: 'accessory',
    description: 'Explosive hip hinges, swings, carries, Romanian deadlifts.',
    substitutionTip: 'Use a single heavy dumbbell or heavy backpack handle.'
  },
  {
    id: 'chair_table',
    name: 'Sturdy Chair / Table',
    icon: 'Grid',
    category: 'improvised',
    description: 'Australian horizontal rows under table, elevated push-ups.',
    substitutionTip: 'Great for inverted rows without a pull-up bar.'
  }
];

export const INITIAL_EXERCISES: Exercise[] = [
  // --- PUSH ---
  {
    id: 'pushup-standard',
    name: 'Standard Push-up',
    category: 'push',
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['shoulders', 'abs'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'beginner',
    formCues: ['Elbows at 45 degrees', 'Glutes squeezed, hollow body', 'Full lockout at top'],
    progressionNextId: 'pushup-diamond',
    regressionPrevId: 'pushup-incline',
    substitutionTips: 'Do on knees or against a table if too strenuous.'
  },
  {
    id: 'pushup-diamond',
    name: 'Diamond Push-up',
    category: 'push',
    primaryMuscles: ['triceps', 'chest'],
    secondaryMuscles: ['shoulders'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'intermediate',
    formCues: ['Index fingers and thumbs forming a diamond', 'Tuck elbows tight to ribs', 'Control 3s descent'],
    progressionNextId: 'pushup-archer',
    regressionPrevId: 'pushup-standard'
  },
  {
    id: 'pushup-archer',
    name: 'Archer Push-up',
    category: 'push',
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['shoulders', 'abs'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'advanced',
    formCues: ['Slide straight arm out to side', 'Push primarily through working arm', 'Wide foot base for stability'],
    progressionNextId: 'pushup-onearm',
    regressionPrevId: 'pushup-diamond'
  },
  {
    id: 'dip-standard',
    name: 'Parallel Bar Dips',
    category: 'push',
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['shoulders'],
    requiredEquipment: ['dip_bars'],
    difficulty: 'intermediate',
    formCues: ['Lean forward slightly for chest focus', 'Descend until elbows hit 90°', 'Lock out elbows with control'],
    progressionNextId: 'dip-weighted',
    regressionPrevId: 'dip-bench',
    substitutionTips: 'Use chair dips or bench dips if lacking bars.'
  },
  {
    id: 'dip-bench',
    name: 'Bench / Chair Dips',
    category: 'push',
    primaryMuscles: ['triceps'],
    secondaryMuscles: ['chest', 'shoulders'],
    requiredEquipment: ['chair_table'],
    difficulty: 'beginner',
    formCues: ['Keep back close to bench edge', 'Elbows pointing back, not flared', 'Elevate feet on floor or chair'],
    progressionNextId: 'dip-standard'
  },
  {
    id: 'pike-pushup',
    name: 'Pike Push-up',
    category: 'push',
    primaryMuscles: ['shoulders', 'triceps'],
    secondaryMuscles: ['chest', 'abs'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'intermediate',
    formCues: ['Hips high in inverted V', 'Head moves forward in front of hands', 'Press back and up'],
    progressionNextId: 'handstand-pushup',
    regressionPrevId: 'pushup-standard'
  },
  {
    id: 'db-overhead-press',
    name: 'Dumbbell Overhead Press',
    category: 'push',
    primaryMuscles: ['shoulders', 'triceps'],
    secondaryMuscles: ['abs'],
    requiredEquipment: ['dumbbells'],
    difficulty: 'beginner',
    formCues: ['Ribs down, core braced', 'Press straight overhead, bisecting ears', 'Full control on lowering'],
    substitutionTips: 'Can do single-arm with a loaded backpack.'
  },

  // --- PULL ---
  {
    id: 'pullup-strict',
    name: 'Strict Pull-up (Overhand)',
    category: 'pull',
    primaryMuscles: ['back', 'biceps'],
    secondaryMuscles: ['forearms', 'shoulders'],
    requiredEquipment: ['pullup_bar'],
    difficulty: 'intermediate',
    formCues: ['Full dead-hang at bottom', 'Depress shoulder blades first', 'Drive elbows into back pockets'],
    progressionNextId: 'pullup-weighted',
    regressionPrevId: 'inverted-row',
    substitutionTips: 'Use band-assisted pull-ups or table rows if working towards first rep.'
  },
  {
    id: 'chinup-strict',
    name: 'Chin-up (Underhand Grip)',
    category: 'pull',
    primaryMuscles: ['biceps', 'back'],
    secondaryMuscles: ['forearms'],
    requiredEquipment: ['pullup_bar'],
    difficulty: 'intermediate',
    formCues: ['Palms facing you', 'Heavy bicep recruitment', 'Chest to bar at peak contraction']
  },
  {
    id: 'inverted-row',
    name: 'Inverted Row (Under Table / Low Bar)',
    category: 'pull',
    primaryMuscles: ['back', 'biceps'],
    secondaryMuscles: ['forearms', 'abs'],
    requiredEquipment: ['chair_table'],
    difficulty: 'beginner',
    formCues: ['Hold edge of sturdy table or low bar', 'Body straight as a plank', 'Pull chest to table rim'],
    progressionNextId: 'pullup-strict',
    substitutionTips: 'Bend knees to decrease leverage if too hard.'
  },
  {
    id: 'band-lat-pulldown',
    name: 'Resistance Band Lat Pulldown',
    category: 'pull',
    primaryMuscles: ['back'],
    secondaryMuscles: ['biceps', 'shoulders'],
    requiredEquipment: ['bands'],
    difficulty: 'beginner',
    formCues: ['Anchor band overhead or hold wide', 'Pull down driving elbows back', 'Hold peak contraction 2s']
  },
  {
    id: 'db-single-arm-row',
    name: 'Single-Arm Dumbbell / Backpack Row',
    category: 'pull',
    primaryMuscles: ['back', 'biceps'],
    secondaryMuscles: ['forearms'],
    requiredEquipment: ['dumbbells'],
    difficulty: 'beginner',
    formCues: ['Hinge at hip, hand on knee or chair', 'Pull dumbbell toward hip crease', 'Do not rotate torso']
  },
  {
    id: 'bicep-curl-db',
    name: 'Bicep Hammer Curl',
    category: 'pull',
    primaryMuscles: ['biceps', 'forearms'],
    secondaryMuscles: [],
    requiredEquipment: ['dumbbells'],
    difficulty: 'beginner',
    formCues: ['Neutral grip (thumbs up)', 'Elbows pinned to sides', 'Squeeze at top for 1 full second']
  },

  // --- LEGS ---
  {
    id: 'bodyweight-squat',
    name: 'Air Squat (Deep Tempo)',
    category: 'legs',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['calves', 'abs'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'beginner',
    formCues: ['Crease of hip below knee', 'Knees track over toes', '3-second eccentric descent'],
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
    formCues: ['Back foot elevated on chair or bed', 'Lower straight down', 'Drive through front mid-foot'],
    progressionNextId: 'pistol-squat',
    regressionPrevId: 'bodyweight-squat'
  },
  {
    id: 'pistol-squat',
    name: 'Pistol Squat (Single Leg)',
    category: 'legs',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['abs', 'calves'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'advanced',
    formCues: ['Opposite leg straight out front', 'Balance on whole foot', 'Full depth, press smoothly up'],
    regressionPrevId: 'bulgarian-split-squat',
    substitutionTips: 'Practice holding a door frame for assisted balance.'
  },
  {
    id: 'single-leg-rdl',
    name: 'Single-Leg Romanian Deadlift (Hinge)',
    category: 'legs',
    primaryMuscles: ['hamstrings', 'glutes'],
    secondaryMuscles: ['abs', 'calves'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'intermediate',
    formCues: ['Soft knee bend', 'Hinge at hip sending rear leg back', 'Feel deep stretch in hamstring']
  },
  {
    id: 'standing-calf-raise',
    name: 'Single-Leg Elevated Calf Raise',
    category: 'legs',
    primaryMuscles: ['calves'],
    secondaryMuscles: [],
    requiredEquipment: ['bodyweight'],
    difficulty: 'beginner',
    formCues: ['Ball of foot on stair edge or book', 'Deep stretch at bottom for 2s', 'Drive all the way onto big toe']
  },

  // --- CORE & SKILLS ---
  {
    id: 'hollow-body-hold',
    name: 'Hollow Body Hold',
    category: 'core',
    primaryMuscles: ['abs'],
    secondaryMuscles: ['quads'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'intermediate',
    formCues: ['Lower back glued flat into floor', 'Arms overhead, toes pointed', 'Breathe calmly through diaphragm']
  },
  {
    id: 'plank-to-pike',
    name: 'Plank to Pike Walk',
    category: 'core',
    primaryMuscles: ['abs', 'shoulders'],
    secondaryMuscles: ['hamstrings'],
    requiredEquipment: ['bodyweight'],
    difficulty: 'beginner',
    formCues: ['Solid elbow plank', 'Walk feet up into pike', 'Draw belly button to spine']
  },
  {
    id: 'hanging-knee-raise',
    name: 'Hanging Knee / Leg Raise',
    category: 'core',
    primaryMuscles: ['abs'],
    secondaryMuscles: ['forearms'],
    requiredEquipment: ['pullup_bar'],
    difficulty: 'intermediate',
    formCues: ['No swinging or momentum', 'Roll pelvis up toward ribs', 'Slow 3s descent']
  },
  {
    id: 'lsit-parallettes',
    name: 'L-Sit Hold (Chair / Floor / Bars)',
    category: 'skills',
    primaryMuscles: ['abs', 'triceps'],
    secondaryMuscles: ['quads', 'shoulders'],
    requiredEquipment: ['dip_bars'],
    difficulty: 'advanced',
    formCues: ['Depress shoulders with locked elbows', 'Elevate legs parallel to floor', 'Point toes and brace']
  }
];

export const STARTER_ROUTINES: ForgeRoutine[] = [
  {
    id: 'home-full-body-3x',
    name: 'Home Full Body (Muscle & Strength)',
    description: '3 Days/week. Hits every major muscle group twice per week with optimal recovery.',
    focus: 'Hypertrophy & Functional Baseline',
    daysPerWeek: 3,
    requiredEquipment: ['bodyweight', 'pullup_bar', 'chair_table'],
    exerciseIds: [
      'pushup-standard',
      'pullup-strict',
      'bulgarian-split-squat',
      'pike-pushup',
      'inverted-row',
      'hollow-body-hold'
    ]
  },
  {
    id: 'home-upper-lower-4x',
    name: 'Home Upper / Lower Split',
    description: '4 Days/week. Perfect for packing on visible chest, back, and leg volume with dedicated rest.',
    focus: 'Hypertrophy & Armor Building',
    daysPerWeek: 4,
    requiredEquipment: ['bodyweight', 'pullup_bar', 'dip_bars'],
    exerciseIds: [
      'pushup-diamond',
      'pullup-strict',
      'dip-standard',
      'inverted-row',
      'bulgarian-split-squat',
      'pistol-squat',
      'hanging-knee-raise'
    ]
  },
  {
    id: 'calisthenics-skills-muscle',
    name: 'Calisthenics Skills + Functional Armor',
    description: 'Master pull-ups, dips, handstand push-ups and pistol squats with clean body control.',
    focus: 'Functional Strength & Skill Trees',
    daysPerWeek: 4,
    requiredEquipment: ['bodyweight', 'pullup_bar', 'dip_bars'],
    exerciseIds: [
      'pullup-strict',
      'dip-standard',
      'pike-pushup',
      'pushup-archer',
      'pistol-squat',
      'lsit-parallettes'
    ]
  }
];
