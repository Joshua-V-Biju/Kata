export interface ProgressionNode {
  id: string;
  name: string;
  level: number;
  description: string;
  unlockCriteria: string;
  exerciseId: string;
  badgeKanji: string;
}

export interface ProgressionTree {
  id: 'pushup' | 'pullup' | 'dip' | 'squat' | 'handstand' | 'lsit';
  name: string;
  icon: string;
  focus: string;
  nodes: ProgressionNode[];
}

export const CALISTHENICS_TREES: ProgressionTree[] = [
  {
    id: 'pushup',
    name: 'Push-up Mastery Tree',
    icon: 'Activity',
    focus: 'Horizontal Pushing, Chest Armor & Triceps',
    nodes: [
      {
        id: 'pu-1',
        name: 'Incline Push-up',
        level: 1,
        description: 'Hands elevated on stable chair or bench to build baseline pressing groove.',
        unlockCriteria: '3 sets of 15 clean reps',
        exerciseId: 'pushup-incline',
        badgeKanji: '基礎'
      },
      {
        id: 'pu-2',
        name: 'Standard Floor Push-up',
        level: 2,
        description: 'Full chest-to-deck floor push-ups with locked hollow-body core.',
        unlockCriteria: '3 sets of 12 clean reps with 3s tempo',
        exerciseId: 'pushup-standard',
        badgeKanji: '初段'
      },
      {
        id: 'pu-3',
        name: 'Diamond Push-up',
        level: 3,
        description: 'Hands touching in diamond position to blast triceps and sternal chest.',
        unlockCriteria: '3 sets of 10 strict reps',
        exerciseId: 'pushup-diamond',
        badgeKanji: '金剛'
      },
      {
        id: 'pu-4',
        name: 'Archer Push-up',
        level: 4,
        description: 'Unilateral sliding push-up transferring 80% load onto single pressing arm.',
        unlockCriteria: '3 sets of 8 reps per side',
        exerciseId: 'pushup-archer',
        badgeKanji: '弓術'
      },
      {
        id: 'pu-5',
        name: 'Pseudo Planche Push-up',
        level: 5,
        description: 'Shoulders leaned far past wrists with protracted scapulae for elite deltoid strength.',
        unlockCriteria: '3 sets of 6 controlled reps',
        exerciseId: 'pushup-pseudo-planche',
        badgeKanji: '極意'
      },
      {
        id: 'pu-6',
        name: 'One-Arm Push-up',
        level: 6,
        description: 'The pinnacle of horizontal pressing power. Single arm floor mastery.',
        unlockCriteria: '3 clean reps each arm',
        exerciseId: 'pushup-onearm',
        badgeKanji: '覇王'
      }
    ]
  },
  {
    id: 'pullup',
    name: 'Pull-up & Lat Wing Tree',
    icon: 'Maximize2',
    focus: 'Vertical Pulling, Lat Width & Bicep Power',
    nodes: [
      {
        id: 'pull-1',
        name: 'Dead Hang & Scapular Pulls',
        level: 1,
        description: 'Decompress spine, build forearm grip armor, and master scapular depression.',
        unlockCriteria: '60s continuous dead hang + 15 scapular pulls',
        exerciseId: 'pullup-scapular',
        badgeKanji: '握力'
      },
      {
        id: 'pull-2',
        name: 'Inverted Table / Low Bar Row',
        level: 2,
        description: 'Horizontal bodyweight row under sturdy table to build upper back thickness.',
        unlockCriteria: '3 sets of 12 full-range reps',
        exerciseId: 'inverted-row',
        badgeKanji: '初陣'
      },
      {
        id: 'pull-3',
        name: 'Negative 5s Pull-up',
        level: 3,
        description: 'Jump to top and resist eccentric descent for 5 full seconds.',
        unlockCriteria: '5 sets of 3 reps with 5s eccentric',
        exerciseId: 'pullup-negative',
        badgeKanji: '降下'
      },
      {
        id: 'pull-4',
        name: 'Strict Overhand Pull-up',
        level: 4,
        description: 'Dead hang to chin cleanly cleared over bar without kicking or kipping.',
        unlockCriteria: '3 sets of 8 strict reps',
        exerciseId: 'pullup-strict',
        badgeKanji: '懸垂'
      },
      {
        id: 'pull-5',
        name: 'Backpack Weighted Pull-up',
        level: 5,
        description: 'Overload strict pulling with a +10kg loaded backpack.',
        unlockCriteria: '3 sets of 5 reps with +10kg',
        exerciseId: 'pullup-weighted',
        badgeKanji: '重厚'
      },
      {
        id: 'pull-6',
        name: 'Archer Pull-up',
        level: 6,
        description: 'Side-to-side unilateral pulling across the bar.',
        unlockCriteria: '3 sets of 4 reps each side',
        exerciseId: 'pullup-archer',
        badgeKanji: '翼神'
      }
    ]
  },
  {
    id: 'dip',
    name: 'Parallel Bar Dip Tree',
    icon: 'AlignJustify',
    focus: 'Chest Depth, Overhead Lockout & Triceps Mass',
    nodes: [
      {
        id: 'dip-1',
        name: 'Bench / Chair Dips',
        level: 1,
        description: 'Tricep pressing with feet on floor to condition elbow tendons.',
        unlockCriteria: '3 sets of 15 clean reps',
        exerciseId: 'dip-bench',
        badgeKanji: '初歩'
      },
      {
        id: 'dip-2',
        name: 'Bar Support Hold',
        level: 2,
        description: 'Lock out atop parallel bars or two sturdy chairs with depressed shoulders.',
        unlockCriteria: '45 seconds locked support hold',
        exerciseId: 'dip-standard',
        badgeKanji: '支持'
      },
      {
        id: 'dip-3',
        name: 'Parallel Bar Dips',
        level: 3,
        description: 'Full-range dips to 90 degrees with controlled torso forward lean.',
        unlockCriteria: '3 sets of 10 clean reps',
        exerciseId: 'dip-standard',
        badgeKanji: '練成'
      },
      {
        id: 'dip-4',
        name: 'Weighted Bar Dips',
        level: 4,
        description: 'Dips loaded with a +15kg weighted vest or backpack.',
        unlockCriteria: '3 sets of 8 reps with +15kg',
        exerciseId: 'dip-weighted',
        badgeKanji: '剛力'
      }
    ]
  },
  {
    id: 'squat',
    name: 'Pistol & Leg Armor Tree',
    icon: 'Activity',
    focus: 'Quad Power, Ankle Mobility & Unilateral Athleticism',
    nodes: [
      {
        id: 'sq-1',
        name: 'Tempo Air Squat',
        level: 1,
        description: 'Deep below-parallel squats with 3-second descent and proud chest.',
        unlockCriteria: '3 sets of 20 reps with 3s tempo',
        exerciseId: 'bodyweight-squat',
        badgeKanji: '下盤'
      },
      {
        id: 'sq-2',
        name: 'Bulgarian Split Squat',
        level: 2,
        description: 'Rear foot elevated on couch or chair. Unforgiving single-leg quad builder.',
        unlockCriteria: '3 sets of 12 reps per leg',
        exerciseId: 'bulgarian-split-squat',
        badgeKanji: '片脚'
      },
      {
        id: 'sq-3',
        name: 'Assisted Pistol Squat',
        level: 3,
        description: 'Pistol squat holding doorframe with fingertips for balance.',
        unlockCriteria: '3 sets of 8 reps per leg',
        exerciseId: 'pistol-squat-assisted',
        badgeKanji: '補助'
      },
      {
        id: 'sq-4',
        name: 'Strict Free Pistol Squat',
        level: 4,
        description: 'Full single-leg squat with opposite leg extended in front, zero support.',
        unlockCriteria: '3 sets of 5 strict reps per leg',
        exerciseId: 'pistol-squat',
        badgeKanji: '神速'
      }
    ]
  },
  {
    id: 'handstand',
    name: 'Handstand & Vertical Shoulder Tree',
    icon: 'Shield',
    focus: 'Overhead Shoulder Caps, Traps & Core Stability',
    nodes: [
      {
        id: 'hs-1',
        name: 'Floor Pike Push-up',
        level: 1,
        description: 'Hips held high in inverted V, building vertical pressing baseline.',
        unlockCriteria: '3 sets of 12 clean reps',
        exerciseId: 'pike-pushup',
        badgeKanji: '逆立'
      },
      {
        id: 'hs-2',
        name: 'Feet-Elevated Pike Push-up',
        level: 2,
        description: 'Toes elevated on chair with torso nearly perpendicular to floor.',
        unlockCriteria: '3 sets of 10 clean reps',
        exerciseId: 'pike-pushup-elevated',
        badgeKanji: '昇格'
      },
      {
        id: 'hs-3',
        name: 'Chest-to-Wall Handstand Hold',
        level: 3,
        description: 'Walk feet up wall, push through shoulders with hollow-body core.',
        unlockCriteria: '45 seconds continuous hold',
        exerciseId: 'handstand-wall-hold',
        badgeKanji: '壁立'
      },
      {
        id: 'hs-4',
        name: 'Wall Handstand Push-up',
        level: 4,
        description: 'Vertical push-ups with feet against wall touching head to floor.',
        unlockCriteria: '3 sets of 5 reps',
        exerciseId: 'handstand-pushup-wall',
        badgeKanji: '頂点'
      }
    ]
  },
  {
    id: 'lsit',
    name: 'L-Sit & Compression Core Tree',
    icon: 'Grid',
    focus: 'Abdominal Wall, Hip Flexors & Scapular Depression',
    nodes: [
      {
        id: 'lsit-1',
        name: 'Hollow Body Hold',
        level: 1,
        description: 'Gymnastics hollow body hold with lower back pressed flush into floor.',
        unlockCriteria: '60 seconds continuous hold',
        exerciseId: 'hollow-body-hold',
        badgeKanji: '体幹'
      },
      {
        id: 'lsit-2',
        name: 'Tuck L-Sit Hold (Chair / Parallettes)',
        level: 2,
        description: 'Support body on two chairs with knees tucked tight into chest.',
        unlockCriteria: '20 seconds continuous tuck hold',
        exerciseId: 'lsit-tuck',
        badgeKanji: '抱膝'
      },
      {
        id: 'lsit-3',
        name: 'Hanging Leg Raise (Toes to Bar)',
        level: 3,
        description: 'Hang from pull-up bar, bring straight toes to touch bar without kipping.',
        unlockCriteria: '3 sets of 8 strict reps',
        exerciseId: 'hanging-leg-raise',
        badgeKanji: '吊脚'
      },
      {
        id: 'lsit-4',
        name: 'Full L-Sit Hold (Parallel Bars / Floor)',
        level: 4,
        description: 'Legs held dead straight parallel to floor with locked elbows and pointed toes.',
        unlockCriteria: '30 seconds continuous full L-sit',
        exerciseId: 'lsit-parallettes',
        badgeKanji: '鉄壁'
      }
    ]
  }
];
