// function merge(nums1, m, nums2, n) {
//     // Remove trailing zeroes from nums1 array
//     nums1.splice(m); // Keep only the first `m` elements
//     console.log(nums1);

//     // If n is not zero, iterate over nums2 and merge
//     if (n !== 0) {
//         nums2.forEach((element, index) => {
//             console.log('print me', m, index, nums1[m + index], nums2[index]);
//             nums1[m + index] = nums2[index];
//         });
//         console.log('ssdfsdf', nums1.sort((a, b) => a - b)); // Sort in ascending order
//     }

//     console.log('final----', nums1);
// }

// merge([1, 2, 3, 0, 0 ,0], 3, [2, 5, 6], 3)

// merge([0], 0, [1], 1)


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
var maxProfit2 = function (prices) {
   //if the prices array is empty or has only one element, return 0
   if (prices.length < 2) return 0;

   let minPrice = prices[0];
   let maxProfit = 0;
   prices.forEach(price => {
      console.warn("🚀 ~ maxProfit2 ~ price < minPrice:", price, minPrice)
      if (price < minPrice) {
         minPrice = price;
      }
      else if (price - minPrice > maxProfit) {
         console.warn("🚀 ~ maxProfit2 ~ price - minPrice > maxProfit:", price , minPrice, maxProfit)
         maxProfit =+ price - minPrice;
         minPrice = price;
      }
      // return price - minPrice[0] > maxProfit;
   })
   console.warn("🚀 ~ xx ~ xx:", minPrice, maxProfit)
   return maxProfit;
};
maxProfit2([7, 1, 5, 3, 6, 4])
// maxProfit2([7, 6, 4, 3, 1])
