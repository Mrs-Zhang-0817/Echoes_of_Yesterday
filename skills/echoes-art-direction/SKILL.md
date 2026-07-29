---
name: echoes-art-direction
description: Use when generating, reviewing, or adapting any image asset for Echoes of Yesterday / 昨日重现, especially chapter backgrounds, character layers, props, continuous frames, or prompts that must preserve the 10-chapter narrative, painterly memory style, and game-ready edges.
---

# Echoes of Yesterday Art Direction

Generate a coherent memory journey, not isolated attractive images. Keep the world believable; let memory alter paint, color, clarity, and light.

## Canonical visual language

- Use believable Chinese domestic/urban space, perspective, people, light, and lived-in wear.
- Mix watercolor pooling, restrained oil dry-brush and aged paper fiber. Never use a global photo filter, glossy CGI, anime, or flat vector styling.
- Reuse anchors: elderly father, adult daughter, family home, mirror, record player, photos, tin, wristband, sunflower, radio, and wind chime.
- Follow the arc: warm-but-fragile childhood → spatial loss and alarm → darkness and identity fracture → sensory repair → calm morning resolution. Chapter 10 must feel repaired, not like a different universe.

## Choose paint strength by asset purpose

| Asset | Paint treatment | Edge rule |
| --- | --- | --- |
| 1920×1080 full-screen background | Controlled watercolor and dry-brush; preserve room geometry and playable space. | Full-bleed scene to all four edges. No paper margin, torn edge, frame, black bar, or transparent hole. |
| 1280×720 continuous frame | Reduce blooms and brush scale so motion reads cleanly between frames. | Match the preceding frame's palette, camera and edge coverage. |
| Small prop / 40–500px interaction layer | Use texture only where it survives at size; favor readable silhouette and material cues. | PNG may use alpha outside the object; never create a white/paper halo. |
| Character layer | Keep face, clothing, hands and held object legible; do not let brush texture obscure interaction. | PNG may use alpha outside the figure; preserve a clean cutout boundary. |

Do not set a fixed “watercolor percentage.” Increase painterly expression when the image is a large emotional establishing shot; reduce it for small, moving, repeated, or interactive assets.

## Prompt contract

State: asset type/dimensions; chapter beat; anchors; camera; light; palette; size-appropriate paint treatment; negative space; and edge rule. Require no legible text, brands, watermark, or generated UI.

For any background, include: **“full-bleed complete scene to all four edges; no white paper border, torn paper edge, picture frame, black bar, or empty margin.”**

Honor the asset manifest. A background contains only environment and static dressing. Do not bake a separately named character, prop, clue, crack, light cone, or interactive layer into its background; reserve clean placement. In Chapter 10, `CH10_BG_LivingRoomMorning.jpg` is room only; daughter and porridge belong to `CH10_Daughter_Porridge.png`.

## Review before accepting

Check: (1) emotional position, (2) recognizable anchors, (3) separately layered interactions absent from the base, (4) readable style at this size, (5) planned interaction, and (6) valid edges. Iterate one variable at a time.
