// 1. Two Sum

var twoSum = function (nums, target) {
   // Brute force solution O(n^2)
   /*   
         for (let i = 0; i < arr.length; i++) {
               for (let j = i+1; j < arr.length; j++) {
                  // console.log(arr[i], arr[j])
                  if (arr[i] +arr[j] === target) {
                     return [i, j]
                  }
               }
         }
         return undefined;
        
         */
   // Optimized solution O(n)
   // Using HashMap to store the indices of the numbers
   let hm = new Map()
   for (let i = 0; i < nums.length; i++) {
      const remaining = target - nums[i];
      if (hm.has(remaining)) {
         return [hm.get(remaining), i]
      } else {
         hm.set(nums[i], i)
      }
   }
};

// console.log(twoSum([2,7,11,15], 9)) // [0,1]
// console.log(twoSum([3,2,4], 6)) // [1,2]
// console.log(twoSum([3,3], 6)) // [0,1]
// console.log(twoSum([1,2,3,4,5], 9)) // [3,4]
// console.log(twoSum([1,2,3,4,5], 10)) // undefined

//--------------------------------------------------------------------------------------------
// three sum

function sum3(arr) {
   let res = [];
   arr.sort((a, b) => a - b); // Sort the array first

   for (let i = 0; i < arr.length - 2; i++) {
      // Skip duplicates for the first number
      if (i > 0 && arr[i] === arr[i - 1]) continue;

      let left = i + 1;
      let right = arr.length - 1;

      while (left < right) {
         let sum = arr[i] + arr[left] + arr[right];

         if (sum === 0) {
            res.push([arr[i], arr[left], arr[right]]);

            // Skip duplicates for left and right
            while (arr[left] === arr[left + 1]) left++;
            while (arr[right] === arr[right - 1]) right--;

            left++;
            right--;
         } else if (sum < 0) {
            left++; // Need a larger sum
         } else {
            right--; // Need a smaller sum
         }
      }
   }

   console.log(res);
}



// sum3([-1, 0, 1, 2, -1, -4]) // // [[-1, -1, 2], [-1, 0, 1]]
// sum3([-2, 0, 1, 1, 2]) // [[-2, 1, 1]]
// sum3([0, 0, 0, 0]) // [[0, 0, 0]]
// sum3([-1, 0, 1, 2, -1, -4]) // [[-1, -1, 2], [-1, 0, 1]]


//--------------------------------------------------------------------------------------------

// Longest Substring Without Repeating Characters

// var lengthOfLongestSubstring = function (s) {
//    let map = new Map();
//    let left = 0;
//    let maxLength = 0;

//    for (let right = 0; right < s.length; right++) {
//       const char = s[right];
//       if (map.has(char) && map.get(char) >= left) {
//          left = map.get(char) + 1; // Move the left pointer to the right of the last occurrence
//       }
//       map.set(char, right); // Update the last occurrence of the character
//       maxLength = Math.max(maxLength, right - left + 1); // Update the maximum length
//    }
// };

// // lengthOfLongestSubstring("abcabcbb") // 3
// // lengthOfLongestSubstring("bbbbb") // 1 
// // lengthOfLongestSubstring("pwwkew") // 3 
// lengthOfLongestSubstring("dvdf") // 3


//--------------------------------------------------------------------------------------------

// 1423. Maximum Points You Can Obtain from Cards

/*
🔶 Problem Summary:
You are given:

An integer array cardPoints, where each card has some points.

An integer k — you can pick k cards total, but only from the start or end of the array.

🧩 Goal:
Pick exactly k cards (from either end) such that the total points is maximized.

🔍 Example:
js
Copy
Edit
cardPoints = [1, 2, 3, 4, 5, 6, 1], k = 3

// Choose 1 card from left and 2 cards from right: 1 + 6 + 1 = 8
// Or 2 from left and 1 from right: 1 + 2 + 1 = 4
// Or 3 from right: 6 + 1 + 5 = 12 (best)

Output: 12 
*/

var maxScore = function (cardPoints, k) {
   let maxLen = 0, lsum = 0, rsum = 0, right = cardPoints.length - 1;

   // take first k cards from the start
   for (let i = 0; i <= k - 1; i++) {
      lsum += cardPoints[i];
   }
   maxLen = lsum;
   //console.log(lsum)

   // now shift one-by-one from left to right
   for (let i = k - 1; i >= 0; i--) {
      lsum -= cardPoints[i]
      //console.log('rgiht', right, i)
      rsum += cardPoints[right]
      right--
      maxLen = Math.max(maxLen, lsum + rsum)
   }

   return maxLen;
};
// console.log(maxScore([1, 2, 3, 4, 5, 6, 1], 3)) // 12
// console.log(maxScore([2, 2, 2], 2)) // 4
// console.log(maxScore([9, 7, 7, 9, 7, 7], 3)) // 25