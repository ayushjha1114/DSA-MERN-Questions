// function merge(nums1, m, nums2, n) {
//     // Remove trailing zeroes from nums1 array
//     nums1.splice(m); // Keep only the first `m` elements
//     console.log(nums1);

//     // If n is not zero, iterate over nums2 and merge
//     if (n !== 0) {
//         nums2.forEach((_, index) => {
//             console.log('print me', m, index, nums1[m + index], nums2[index]);
//             nums1[m + index] = nums2[index];
//         });
//         console.log('ssdfsdf', nums1.sort((a, b) => a - b)); // Sort in ascending order
//     }

//     console.log('final----', nums1);
// }

// merge([1, 2, 3, 0, 0 ,0], 3, [2, 5, 6], 3)// [1, 2, 2, 3, 5, 6]
//merge([1], 1, [], 0) // [1]
// merge([0], 0, [1], 1) // [1]


// solve using two pointer approach
// let removeElement = function (nums, val) {
//     let i = 0;
//     for (let j = 0; j < nums.length; j++) {
//         if (nums[j] !== val) {
//             console.log("nums[j]->", nums[j], "nums[i]->", nums[i], i);
//             nums[i] = nums[j];
//             console.log("nums->", nums);
//             i++;
//         }
//     }
//     console.log("nums->", nums.slice(0, i), "count->", i);
//     return i;
// };
// let removeElement = function (nums, val) {
//     nums.forEach((element, index) => {
//         if (element === val) {
//             nums[index] = '_';
//         }
//     });

//     nums.sort((a, b) => {
//         if (a !== '_') {
//             return -1;
//         } else if (a === '_') {
//             return 1;
//         }
//         return 0;
//     })
//     let count = 0;
//     nums.forEach((element) => {
//         if (element !== '_') {
//             count++;
//         }
//     });
//     console.log("nums->", nums, "count->", count);
//     return count;
// };

// removeElement([3, 2, 2, 3], 3)
// removeElement([0, 1, 2, 2, 3, 0, 4, 2], 2)
// removeElement([0], 0)    


// --------------------two pointer approach------------------
// the time complexity of this code is O(n)
// var removeDuplicates = function (nums) {
//     let i = 0;
//     for (let j = 1; j < nums.length; j++) {
//         if (nums[i] !== nums[j]) {
//             i++;
//             nums[i] = nums[j];
//         }
//     }
//     nums.slice(0, i + 1);
//     return i + 1;
// };

// removeDuplicates([1, 1, 2]);
// removeDuplicates([0, 0, 1, 1, 1, 2, 2, 3, 3, 4]);

// // the time complexity of this code is O(n^2)
// var removeDuplicates = function (nums) {
//     for (let i = 0; i < nums.length; i++) {
//         for (let j = i + 1; j < nums.length; j++) {
//             if (nums[i] === nums[j]) {
//                 nums[j] = '_';
//             }
//         }
//     }
//     nums = nums.filter(element => element !== '_');
//     console.warn("🚀 ~ removeDuplicates ~ nums:", nums)

//     return nums.length;
// };

// removeDuplicates([1, 1, 2])
// removeDuplicates([0, 0, 1, 1, 1, 2, 2, 3, 3, 4]) 


// ---------------------Remove Duplicates from Sorted Array II------------------
// var removeDuplicates = function (nums) {
//     if (nums.length < 3) {
//         return nums.length;
//     }
//     let i = 2;   
//     for (let j = 2; j < nums.length; j++) {
//         if (nums[i - 2] !== nums[j]) {
//             nums[i] = nums[j];
//             i++;
//         }
//     }
//     console.warn("🚀 ~ removeDuplicates ~ nums:", nums)
//     return i;
// };
// removeDuplicates([1, 1, 1, 2, 2, 3]);
// removeDuplicates([0, 0, 1, 1, 1, 2, 2, 3, 3, 4]);
// removeDuplicates([1, 2, 3])
// removeDuplicates([1, 2, 3, 4])

//-----------------------------------------------------------------------------------

// Boyer-Moore Voting Algorithm
// var majorityElement = function(nums) {
//     let count = 0;
//     let candidate = null;

//     for (let num of nums) {
//         if (count === 0) {
//             candidate = num;
//         }
//         count += (num === candidate) ? 1 : -1;
//     }

//     return candidate;
// };
// var majorityElement = function(nums) {
//     let hm = new Map();
//     for (let i = 0; i < nums.length; i++) {
//         if (hm.has(nums[i])) {
//             hm.set(nums[i], hm.get(nums[i]) + 1);
//         } else {
//             hm.set(nums[i], 1);
//         }
//     }
//     let max = 0;
//     let res = 0;
//     console.warn("🚀 ~ hm.forEach ~ hm:", hm)
//     for( const [key, value] of hm) {
//         console.warn("🚀 ~ majorityElement ~ value, key):", value, key)
//         if (max < value) {
//             max = value;
//             res = key;
//         }
//     }
//     console.warn("🚀 ~ majorityElement ~ max:", max)
//     return res;
// };
// // majorityElement([3, 2, 3])
// majorityElement([2, 2, 1, 1, 1, 2, 2])
// majorityElement([1])


//------------------------------------------------------------------------------------
/* var rotate = function (nums, k) {
   k = k % nums.length; // k is greater than arrr length
   console.warn("🚀 ~ rotate ~ k:", k)

   const reverse = (nums, start, end) => {
      for (; start < end; start++, end--) {
         let temp = nums[start];
         nums[start] = nums[end];
         nums[end] = temp;
      }
   }
   //    const reverse = (arr, start, end) => {
   //       while (start < end) {
   //          let temp = arr[start];
   //          arr[start] = arr[end];
   //          arr[end] = temp;
   //          start++;
   //          end--;
   //       }
   //    };
   reverse(nums, 0, nums.length - 1); // Reverse the entire array
   console.warn("🚀 ~ rotate ~ nums:", nums);
   reverse(nums, 0, k - 1); // Reverse the first k elements
   console.warn("🚀 ~ rotate ~ nums:", nums)
   reverse(nums, k, nums.length - 1); // Reverse the remaining elements
   console.warn("🚀 ~ rotate ~ nums:", nums)
};
rotate([1, 2, 3, 4, 5, 6, 7], 3)
rotate([-1, -100, 3, 99], 2)
rotate([1, 2], 3); */

//------------------------------------------------------------------------------------
// var maxProfit = function(prices) {
//    //if the prices array is empty or has only one element, return 0
// if (prices.length < 2) return 0;

// let minPrice = prices[0];
// let maxProfit = 0;

// prices.forEach(price => {
//    if (price < minPrice) {
//       minPrice = price;
//    }
//    else if (price - minPrice > maxProfit) {
//       maxProfit = price - minPrice;
//    }
//    // return price - minPrice[0] > maxProfit;
// })
// console.warn("🚀 ~ xx ~ xx:", minPrice, maxProfit)
// return maxProfit;
// };

// var maxProfit = function (prices) {
//    if (prices.length < 2) return 0;

//    let n = prices.length;
//    let dp = new Array(n).fill(0); // dp[i] will store the max profit up to day i
//    let minPrice = prices[0];

//    for (let i = 1; i < n; i++) {
//       dp[i] = Math.max(dp[i - 1], prices[i] - minPrice); // Max profit up to day i
//       minPrice = Math.min(minPrice, prices[i]); // Update the minimum price
//    }

//    return dp[n - 1]; // Max profit for the entire period
// };

// maxProfit([7, 1, 5, 3, 6, 4])
// maxProfit([7, 6, 4, 3, 1])
// maxProfit([1, 2]);

//------------------------------------------------------------------------------------
/* var maxProfit2 = function (prices) {
   //if the prices array is empty or has only one element, return 0
   if (prices.length < 2) return 0;

   let minPrice = prices[0];
   let maxProfit = 0;
   let maxPrice = prices[0];
   for (let i = 1; i < prices.length; i++) {
      if (prices[i - 1] < prices[i]) {
         maxProfit += prices[i] - prices[i-1];
         console.warn("🚀 ~ maxProfit2 ~ maxProfit:", prices[i], prices[i-1], maxProfit)
      }
        
   }
   console.warn("🚀 ~ xx ~ xx:", maxProfit)
   return maxProfit;
};
maxProfit2([7, 1, 5, 3, 6, 4]) */
// maxProfit2([7, 6, 4, 3, 1])


//---------------------------------------------------------------------------------------

//Jump Game 

// var canJump = function(nums) {
//    let maxReachIndex = 0;
//      for (let i = 0; i < nums.length; i++) {
//         if (i > maxReachIndex) {
//               return false; // If we can't reach this index, return false
//         }
//         console.warn("🚀 ~ canJump ~ maxReachIndex:", maxReachIndex, i + nums[i])
//         maxReachIndex = Math.max(maxReachIndex, i + nums[i]); // Update the maximum reachable index
//      }
//      console.warn("🚀 ~ canJump ~ maxReachIndex:", maxReachIndex)
//      return true; // If we can reach the last index, return true
// };

// var canJump = function(nums) {
//    let maxReachIndex = 0;
//    for (let i = 0; i < nums.length && i <= maxReachIndex; i++) {
//       maxReachIndex = Math.max(maxReachIndex, i + nums[i]); // Update the maximum reachable index
//       if (maxReachIndex >= nums.length - 1) {
//          return true; // Early exit if we can already reach the last index
//       }
//    }
//    return false; // If we exit the loop, it means we can't reach the last index
// };

// canJump([2,3,1,1,4])
// canJump([3,2,1,0,4])
// canJump([0, 1])


//-------------------------------------------------------------------------------------

//Jump Game II

/* 
var jump = function (nums) {
   let maxReachIndex = 0;
   let count = 0;
   let currentEnd = 0;

   for (let i = 0; i < nums.length - 1; i++) {
      maxReachIndex = Math.max(maxReachIndex, i + nums[i]); // Update the maximum reachable index
      if (i === currentEnd) { // When we reach the end of the current jump
         count++;
         currentEnd = maxReachIndex; // Update the end to the farthest reachable index
      }
   }

   console.warn("🚀 ~ jump ~ count:", count, currentEnd, currentEnd >= nums.length - 1 ? count : 0);
   return currentEnd >= nums.length - 1 ? count : 0; // Return 0 if the last index is not reachable
};

jump([2, 3, 1, 1, 4])
jump([2, 3, 0, 1, 4]);
jump([3, 2, 1, 0, 4])
jump([0, 1])
jump([0]); */


//------------------------------------------------------------------------------------------
// H-Index

/* var hIndex = function (citations) {
   citations.sort((a, b) => b - a)
   for(let i = 0; i < citations.length; i++) {
      if (citations[i] <= i) {
         console.warn("🚀 ~ hIndex ~ i:", i)
         return i;
      }  
   }
 
   return citations.length;
};

hIndex([3, 0, 6, 1, 5])
hIndex([1, 3, 1])
hIndex([1]) */

//--------------------------------------------------------------------------------------------

// Minimum Size Subarray Sum

/* var minSubArrayLen = function(target, nums) {
   let left = 0;
   let sum = 0;
   let minLength = Infinity;
   for (let right = 0; right < nums.length; right++) {
      sum += nums[right];
      //console.warn("🚀 ~ minSubArrayLen ~ sum:", sum, target)
      while (sum >= target) {
         //console.warn("🚀 ~ minSubArrayLen ~ minLength, right - left -1:", minLength, right - left, right, left)
         minLength = Math.min(minLength, right - left + 1);
         sum -= nums[left];
         //console.warn("🚀 ~ 356 ~ sum:", sum)
         left++;
      }

   }
   console.warn("🚀 ~ minSubArrayLen ~ minLength:", minLength)
   return minLength === Infinity ? 0 : minLength + 1;
};

minSubArrayLen(7, [2,3,1,2,4,3]) // 2
minSubArrayLen(4, [1,4,4]) // 1
minSubArrayLen(11, [1,1,1,1,1,1,1,1]) // 0
minSubArrayLen(15, [1,2,3,4,5]) // 5 */


//--------------------------------------------------------------------------------------------

// Longest Substring Without Repeating Characters

// var lengthOfLongestSubstring = function (s) {
//    let map = new Map();
//    let left = 0;
//    let maxLength = 0;

//    for (let right = 0; right < s.length; right++) {
//       const char = s[right];
//       console.warn("🚀 ~ lengthOfLongestSubstring ~ char:", char)
//       if (map.has(char) && map.get(char) >= left) {
//          left = map.get(char) + 1; // Move the left pointer to the right of the last occurrence
//       }
//       map.set(char, right); // Update the last occurrence of the character
//       console.warn("🚀 ~ lengthOfLongestSubstring ~ right - left + 1:", right, left, 1)
//       maxLength = Math.max(maxLength, right - left + 1); // Update the maximum length
//       // console.warn("🚀 ~ lengthOfLongestSubstring ~ maxLength:", maxLength)
//    }
// };

// // lengthOfLongestSubstring("abcabcbb") // 3
// // lengthOfLongestSubstring("bbbbb") // 1 
// // lengthOfLongestSubstring("pwwkew") // 3 
// lengthOfLongestSubstring("dvdf") // 3


//--------------------------------------------------------------------------------------------
// three sum

// function sum3(arr) {
//    let res = [];
//    arr.sort((a, b) => a - b); // Sort the array first

//    for (let i = 0; i < arr.length - 2; i++) {
//       // Skip duplicates for the first number
//       if (i > 0 && arr[i] === arr[i - 1]) continue;

//       let left = i + 1;
//       let right = arr.length - 1;

//       while (left < right) {
//          let sum = arr[i] + arr[left] + arr[right];

//          if (sum === 0) {
//             res.push([arr[i], arr[left], arr[right]]);

//             // Skip duplicates for left and right
//             while (arr[left] === arr[left + 1]) left++;
//             while (arr[right] === arr[right - 1]) right--;

//             left++;
//             right--;
//          } else if (sum < 0) {
//             left++; // Need a larger sum
//          } else {
//             right--; // Need a smaller sum
//          }
//       }
//    }

//    console.log(res);
// }



// sum3([-1, 0, 1, 2, -1, -4]) // // [[-1, -1, 2], [-1, 0, 1]]
// sum3([-2, 0, 1, 1, 2]) // [[-2, 1, 1]]
// sum3([0, 0, 0, 0]) // [[0, 0, 0]]
// sum3([-1, 0, 1, 2, -1, -4]) // [[-1, -1, 2], [-1, 0, 1]]


//----------- -----------------------------------------------------------------------------------

// Tapping Rain Water

// function rainWater(arr) {


//    let res = 0;
//    let left = [], right = [];
//    let max = 0, maxR = 0
//    for (let i = 0; i < arr.length; i++) {

//       left.push(Math.max(max, arr[i]))
//       max = Math.max(max, arr[i])
//    }

//    for (let i = arr.length - 1; i >= 0; i--) {

//       right.push(Math.max(maxR, arr[i]))
//       maxR = Math.max(maxR, arr[i])
//    }

//    console.log(left, right.reverse())

//    for (let i = 0; i < arr.length; i++) {
//       console.log(Math.min(left[i], right[i]) - arr[i])
//       res += Math.min(left[i], right[i]) - arr[i]
//    }

//    console.log(res)
// }

// rainWater([3, 1, 2, 4, 0, 1, 3, 2]) // 8
// rainWater([0, 1, 0, 2, 1, 0, 1, 3]) // 8
// rainWater([4, 2, 0, 3, 2, 5]) // 9


//----------------------------------------------------------------------------------------
// sort array converting elements square

// function sortArrElementSquare(arr) {
//    for (let i = 0; i < arr.length; i++) {
//       arr[i] *= arr[i];
//    }

//    console.warn("🚀 ~ sortArrElementSquare ~ arr:", arr.sort((a, b) => a - b))
// }
// sortArrElementSquare([-6, -3, -1, 2, 4, 5]) // [1, 4 , 9, 16, 25, 36]


//-----------------------------------------------------------------------------------------

//  Two Sum II - Input Array Is Sorted

// var twoSum = function (numbers, target) {
//    let left = 0;

//    let currSum = 0;
//    for (let right = numbers.length - 1; right !== left;) {
//        currSum = 0;
//        //if (numbers[right] > target) continue;
//        currSum = numbers[left] + numbers[right];
//        console.log(currSum)
//        if (currSum === target) return [left + 1, right + 1];
//        if (currSum < target) {
//            left++;
//        } else {
//            right--
//        }
//    }
//    return []
// };

// console.log(twoSum([2,7,11,15], 9)) // [1, 2]
// console.log(twoSum([2,3,4], 6)) // [1, 3]

//-----------------------------------------------------------------------------------------------

// 11. Container With Most Water

// var maxArea = function (height) {
//    let left = 0;
//    let right = height.length - 1;

//    let maxWater = 0

//    while (left < right) {
//        const width = right - left;
//        const area = Math.min(height[left], height[right]) * width;
//        maxWater = Math.max(maxWater, area)

//        if (height[left] > height[right]) {
//            right--
//        } else {
//            left++
//        }
//    }
//   // console.log(maxWater)

//    return maxWater;

// };

// maxArea([1,8,6,2,5,4,8,3,7]) // 49
// maxArea([1,1]) // 1

//------------------------------------------------------------------------------------------

// Maximum consecutive one’s (or zeros) in a binary circular array

// function maxConsecutiveOnesCircular(arr) {
//    // maxInMiddle count
//    let maxInMiddle = 0;
//    let current = 0;
//    for (let i = 0; i < arr.length; i++) {
//       if (arr[i] === 1) {
//          current++;
//          maxInMiddle = Math.max(maxInMiddle, current);
//       } else {
//          current = 0;
//       }
//    }
//    console.log(maxInMiddle)

//    // Count 1s from the beginning until we hit a 0.
//    let prefix = 0;
//    for (let i = 0; i < arr.length; i++) {
//       if (arr[i] === 0) break;
//       prefix++;
//    }
//    console.warn("🚀 ~ maxConsecutiveOnesCircular ~ prefix:", prefix)

//    // Count 1s from the end until we hit a 0.
//    let suffix = 0;
//    for (let i = arr.length -1; i >= 0; i--) {
//       if (arr[i] === 0) break;
//       suffix++;
//    }
//       console.warn("🚀 ~ maxConsecutiveOnesCircular ~ suffix:", suffix, Math.max(maxInMiddle, (prefix+suffix)))

//    return Math.max(maxInMiddle, (prefix+suffix))
   
// }

// maxConsecutiveOnesCircular([1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1]) // 6

//-----------------------------------------------------------------------------------------

// 74. Search a 2D Matrix

// var searchMatrix = function (matrix, target) {
//     for (let i = 0; i < matrix.length; i++) {
//         for (let j = 0; j < matrix[i].length; j++) {
//             if (matrix[i][j] === target) {
//                 // console.log(matrix[i][j], target)
//                 return true;

//             }
//         }
//     }
//     return false;
// };
// searchMatrix([[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 50]], 3) // true
// searchMatrix([[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 50]], 13) // false