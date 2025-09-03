# CSS Position Property Explained

CSS has five main position values:

- **static** (default)
- **relative**
- **absolute**
- **fixed**
- **sticky**

Let’s go through them one by one with examples 👇

---

## 1. `position: static`

- Default position.
- Element stays in the normal page flow (like paragraphs stacked one after another).
- Cannot move it using `top`, `left`, `right`, or `bottom`.

```html
<div style="position: static; background: lightblue; padding: 10px;">
    I'm static (default). I just follow normal flow.
</div>
```

---

## 2. `position: relative`

- Stays in the normal flow.
- Can shift using `top`, `left`, `right`, `bottom`.
- Think: "stay where you are, but then move a bit".

```html
<div style="position: relative; top: 20px; left: 30px; background: lightgreen; padding: 10px;">
    I'm relative. Moved 20px down and 30px right from my original spot.
</div>
```

---

## 3. `position: absolute`

- Removed from normal flow (other elements ignore it).
- Positions itself relative to the nearest ancestor with `position: relative` (or `absolute`/`fixed`).
- If no such ancestor exists, positions relative to `<html>` (the page itself).

```html
<div style="position: relative; background: lightgray; padding: 20px;">
    Parent (relative)
    <div style="position: absolute; top: 10px; left: 10px; background: coral; padding: 10px;">
        I'm absolute. Positioned 10px from top-left of my parent.
    </div>
</div>
```

---

## 4. `position: fixed`

- Fixed to the viewport (the screen), not the page.
- Doesn’t move when you scroll.
- Commonly used for navigation bars or sticky buttons.

```html
<div style="position: fixed; bottom: 10px; right: 10px; background: gold; padding: 10px;">
    I'm fixed at bottom-right corner of the screen.
</div>
```

---

## 5. `position: sticky`

- Mix of relative and fixed.
- Scrolls normally until it hits a given point, then “sticks” there.
- Useful for sticky headers.

```html
<div style="height: 200px; background: lightblue;">Scroll down ⬇️</div>
<div style="position: sticky; top: 0; background: pink; padding: 10px;">
    I'm sticky. I stick to the top when you scroll past me.
</div>
<div style="height: 500px; background: lightyellow;">Keep scrolling...</div>
```

---

## 🔑 Summary Table

| Position   | In Normal Flow? | Moves with Scroll?         | Relative To                  |
|------------|-----------------|---------------------------|------------------------------|
| static     | ✅ Yes          | ✅ Yes                    | Normal document flow         |
| relative   | ✅ Yes          | ✅ Yes                    | Its original position        |
| absolute   | ❌ No           | ✅ Yes                    | Nearest positioned ancestor  |
| fixed      | ❌ No           | ❌ No (fixed to screen)    | Viewport                     |
| sticky     | ✅ Yes (until stuck) | ✅ Yes (until stuck) | Nearest scrollable ancestor  |

---

## Full HTML + CSS Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Position Demo</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            height: 2000px; /* to allow scrolling */
        }
        .box {
            padding: 20px;
            margin: 20px;
            color: white;
            font-weight: bold;
        }
        /* 1. Static */
        .static {
            position: static;
            background: steelblue;
        }
        /* 2. Relative */
        .relative {
            position: relative;
            top: 20px;
            left: 30px;
            background: seagreen;
        }
        /* 3. Absolute */
        .parent {
            position: relative; /* needed for absolute child */
            background: lightgray;
            padding: 50px;
            height: 150px;
        }
        .absolute {
            position: absolute;
            top: 10px;
            right: 10px;
            background: tomato;
        }
        /* 4. Fixed */
        .fixed {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: gold;
            color: black;
        }
        /* 5. Sticky */
        .sticky {
            position: sticky;
            top: 0;
            background: violet;
        }
    </style>
</head>
<body>
    <div class="box static">1. Static (default)</div>
    <div class="box relative">2. Relative (moved 20px down, 30px right)</div>
    <div class="parent">
        Parent (relative)
        <div class="box absolute">3. Absolute (inside parent)</div>
    </div>
    <div style="height: 300px; background: lightblue;">
        Scroll down ⬇️
    </div>
    <div class="box sticky">5. Sticky (sticks to top when scrolling)</div>
    <div style="height: 1000px; background: lightyellow;">
        Keep scrolling... the fixed box stays at bottom-right.
    </div>
    <div class="box fixed">4. Fixed (always stays in corner)</div>
</body>
</html>
```

---

## 🔎 What happens here

- **Static (blue box):** stays in normal flow.
- **Relative (green box):** shifted slightly but space still reserved.
- **Absolute (red box):** placed inside its gray parent’s corner.
- **Fixed (gold box):** sticks to bottom-right of the screen, even when scrolling.
- **Sticky (violet box):** scrolls with the page until it hits the top, then sticks there.

