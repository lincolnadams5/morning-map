# Morning Map

Morning Map is a three-screen interactive prototype that works backward from a desired arrival time to show when to start getting ready, accounting for morning tasks and commuting.

**Live prototype:** [Add public URL]

## 1. Need, persona, capability, and value

- **Need:** People often underestimate how long their morning routine takes and leave too little time for their commute, leading them to rush, skip breakfast, or arrive late.
- **Persona:** A college student who commutes to morning classes several days a week, loses track of time while getting ready, and often leaves in a rush.
- **Capability:** Turn a class start time into a preparation schedule that accounts for their routine and commute.
- **Value:** Control. Know how to use the morning instead of feeling like time keeps slipping away.

## 2. Three screens

The interface uses “arrival time” rather than “class start time” to accommodate other routines while keeping college students as the initial evaluation audience.

| Screen | Description and single job | Why it earned a slot | Design question |
| --- | --- | --- | --- |
| **1. Take control of your morning** | Signal the capability and value with “Take back your morning,” the affordance sentence “Turn your arrival time into a morning plan,” a visual example schedule, and “Plan my morning.” | Visitors need to understand the benefit and picture how the product works before using it. | Do the headline and visual schedule communicate the purpose and value at first glance? |
| **2. Plan your morning** | Make preparation time visible through a question-by-question walkthrough of arrival time, commute, and tasks with durations; a live preview updates the start time within the same screen. | Users can see the calculation in action and account for tasks they might underestimate or skip. | Do users understand how their tasks and commute affect when they need to begin? |
| **3. Your morning, mapped out** | Provide a schedule to follow, with a prominent start time, a timeline of tasks, departure and arrival, task checkboxes, and “Edit my plan.” | The completed plan turns rough estimates into concrete times and actions. | Can users quickly identify when to start and leave, and does the schedule give them a greater sense of control? |

## 3. Design question plan

These are predictions for a later evaluation, not collected feedback or findings.

| Group | Question | Predicted answer | Prototype basis |
| --- | --- | --- | --- |
| **Need** | Tell me about the last time you were in a rush to get to a morning class. What happened, and how did that affect your morning? | I underestimated getting-ready time, skipped breakfast or other tasks, and still left late. | Screen 2 makes preparation tasks and their durations explicit, reflecting the assumed need. |
| **Value** | If you had more control over your time in the morning, what kind of impact could you see that making on the rest of your day? | I would start the day less stressed and feel more in control of my time. | Screen 3 provides a clear start time and an ordered schedule. |
| **Persona** | How often do you find yourself rushing to class, and what are those mornings usually like? | Several mornings a week, especially before an early class when I need to get ready, eat breakfast, and commute. | Screen 2's task and commute inputs reflect the expected routine. |
| **Capability** | I’ll show you this screen for five seconds, then hide it. From what you could gather, what do you think this tool could help you do? | Schedule what I need to do before leaving so I know how much time I actually have. | Screen 1 pairs the affordance sentence with a visual example schedule. |

## 4. Design justification and first read

1. Does the landing screen signal the primary capability and fundamental value at first glance, before reading?

- Yes. The headline “Take control of your morning” names the value, and the example schedule card beside it—“Your morning starts at 7:45 AM” above a timeline of tasks—shows the capability before any text is read.

2. Does every element on the landing screen earn its place, or does anything compete with the primary job?

- After trimming, the screen holds only the headline, one affordance sentence, one "Plan my morning" button, and the example card. There was a duplicate call to action beneath the card that was removed because it competed with the primary button and added scroll without new information.

3. What information and actions belong together on each screen, and which Gestalt grouping principle communicates that?

- Screen 1 groups the start time with its timeline inside a single card (common region), Screen 2 groups each task with its checkbox and minutes on one row (proximity) and keeps the live preview in a separate sidebar, and Screen 3 aligns times and task names in columns (alignment/continuity) so the schedule reads as one sequence.

4. Do screens 2 and 3 stay on mission, and can you return to the landing screen from everywhere?

- Screen 2 asks only the three inputs the calculation needs, and Screen 3 shows only the resulting schedule plus “Edit my plan.” The header logo and a “Home” link appear on every inner screen, and Screen 2’s first step also offers “Back to home.”

5. What did AI initially get wrong, skip, or oversimplify, and what did you change?

- The first pass hid the start time in a corner label, lumped the routine into one “Getting ready” row, let the preview card overpower the plan question, and styled leave/arrive like checkable tasks. I made the start time prominent, listed individual tasks, moved the preview to a sidebar, and visually separated tasks from fixed milestones.

6. Which design question or grouping/signaling decision motivated each important change?

- The Capability question (five-second test) drove the example card and later moving the start time to the card’s top-right so it reads first; the “does every element earn its place” question drove removing the second call to action; and the Screen 2 design question about seeing how tasks affect the start time drove moving the live preview beside the form so cause and effect sit together.
