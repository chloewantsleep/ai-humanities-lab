# Cut plates

Nine Midjourney costume plates (Madeleine's, generated 2026-10-19), each cut at the neck and hip by
`scripts/cut-plates.py` and pinned to one skeleton, so any head fits any torso fits any legs.
`manifest.json` holds the shared neck/hip points and each torso's hip offset (legs shift by it).

| plate | original Midjourney file (in ~/Downloads) |
|---|---|
| mj12 | …ERPr2zYpb5c_pa_0098803a…_2.png |
| mj13 | …ERPr2zYpb5c_pa_b089cc4b…_0.png |
| mj14 | …ERPr2zYpb5c_pa_5813e116…_3.png |
| mj15 | …YugGpR1L1ro_paper_doll_of_costume_desig_25055bf3…_0.png |
| mj16 | …YugGpR1L1ro_paper_doll_of_costume_desig_25055bf3…_1.png |
| mj17 | …yAqgCoPQre8_paper_doll_of_costume_desig_03f9f1c6…_2.png |
| mj18 | …sfma-dKB_AM…_a87ab467…_0.png |
| mj19 | …sfma-dKB_AM…_8dfb09ff…_2.png |
| mj20 | …sfma-dKB_AM…_4161770e…_1.png |

Which plate plays which part of the studio's agent is set in `CASTING` in `app/doll/Doll.tsx`.
