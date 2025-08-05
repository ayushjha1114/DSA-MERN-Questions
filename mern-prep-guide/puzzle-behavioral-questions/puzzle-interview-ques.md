# Classic Algorithm Puzzles: Water Jug & Bridge Crossing

## Water Jug Problem

This is a **classic water jug problem**, often used in puzzles and interviews to test **algorithmic thinking** and **state-based problem solving**.

### 🧠 Problem:

You have:
* One **5 ml bucket**
* One **3 ml bucket**
* Unlimited water supply
* No markings on the buckets

### 🎯 **Goal**: Measure exactly **4 ml** of water using these two buckets.

### ✅ Solution (Using 5ml and 3ml Buckets)

Here's how you can do it **step by step**:

### 🔢 Steps:

1. **Fill the 3ml bucket fully** → 3ml in 3ml bucket, 0ml in 5ml
2. **Pour from 3ml into 5ml** → 3ml in 5ml bucket, 0ml in 3ml
3. **Fill the 3ml bucket again**
4. **Pour from 3ml into 5ml** → Now 3ml + 3ml = 6ml total → 5ml bucket can only take 2 more ml → 5ml bucket full → 1ml left in 3ml bucket
5. **Empty the 5ml bucket**
6. **Pour the 1ml remaining (in 3ml) into 5ml bucket**
7. **Fill 3ml bucket again**
8. **Pour from 3ml into 5ml bucket**

### ✅ Final State:
* 5ml bucket has **1ml + 3ml = 4ml**
* 🎉 **4ml successfully measured**

### 📘 State Tracking (Optional)

| Step | 3ml Bucket | 5ml Bucket |
|------|------------|------------|
| 0    | 0          | 0          |
| 1    | 3          | 0          |
| 2    | 0          | 3          |
| 3    | 3          | 3          |
| 4    | 1          | 5          |
| 5    | 1          | 0          |
| 6    | 0          | 1          |
| 7    | 3          | 1          |
| 8    | 0          | 4 ✅       |

### 🔍 Why It Works

The key idea is using the **Greatest Common Divisor (GCD)**.
* GCD of 5 and 3 is 1 → ✅ So **you can measure any amount from 1 to 5**.

If the goal was something like 7ml with 5ml and 3ml buckets → ❌ impossible.

### ✅ Summary

You can measure **4ml** with a **5ml** and **3ml** bucket using these 8 steps by:
* Filling
* Pouring
* Emptying
* Transferring remaining water

---

## Bridge Crossing Problem

This is a classic **bridge crossing puzzle** involving:
* A group of people needing to cross a bridge.
* Only **two people can cross at a time** (because it's night and only one torch is available).
* The group must **always carry the torch when crossing**.
* When two cross together, they must walk at the **slower person's pace**.

### 👥 People:

| Person | Time to Cross |
|--------|---------------|
| A      | 3 min         |
| B      | 4 min         |
| C      | 10 min        |
| D      | 20 min        |

### 🎯 Goal:

Find the **minimum total time** for all 4 people to cross the bridge.

### 🧠 Optimal Strategy:

We need to **minimize the time** spent by the two slowest people (C & D) on the bridge **together**, because their times are high.

So we try to use the **fastest people** (A and B) to shuttle the torch back and forth.

### ✅ Optimal Steps:

1. **A and B cross** → 4 minutes (both are now on the other side)
2. **A returns** → 3 minutes (torch is back)
3. **C and D cross** → 20 minutes (both are now on the other side)
4. **B returns** → 4 minutes
5. **A and B cross again** → 4 minutes

⏱ **Total Time = 4 + 3 + 20 + 4 + 4 = 35 minutes**

### 🧾 Step-by-Step Summary

| Step | Action | Time | Total Time |
|------|--------|------|------------|
| 1    | A & B cross | 4 | 4 |
| 2    | A returns | 3 | 7 |
| 3    | C & D cross | 20 | 27 |
| 4    | B returns | 4 | 31 |
| 5    | A & B cross | 4 | 35 ✅ |

### ❗ Incorrect Greedy Approach (Leads to 37+ mins)

If you just try to always send the fastest and slowest pair:

1. A & C → 10
2. A returns → 3
3. A & D → 20
4. A returns → 3
5. A & B → 4 → Total = 10 + 3 + 20 + 3 + 4 = 40 ❌

Even trying other combinations like:
* A & D → 20
* A returns → 3
* A & C → 10
* A returns → 3
* A & B → 4 → Total = 40 again.

✅ **Only the 35-minute strategy is optimal**