// var romanToInt = function (str) {
//     let res = 0;
//     let roman = new Map();
//     roman.set('I', 1);
//     roman.set('V', 5);
//     roman.set('X', 10);
//     roman.set('L', 50);
//     roman.set('C', 100);
//     roman.set('D', 500);
//     roman.set('M', 1000);
//     for (let i = 0; i < str.length; i++) {
//         if (i != str.length - 1 && roman.get(str.charAt(i)) < roman.get(str.charAt(i + 1))) {
//             res += roman.get(str.charAt(i + 1)) - roman.get(str.charAt(i));
//             i++;
//         } else {
//             res += roman.get(str.charAt(i));
//         }
//     }
//     return res;
// };
// romanToInt("III") // 3
// romanToInt("IV") // 4
// romanToInt("IX") // 9
// romanToInt("LVIII") // 58
// romanToInt("MCMXCIV") // 1994


//------------------------------------------------------------------------------------------

//Integer to Roman
// var intToRoman = function (num) {
//     let hm = new Map();
//     hm.set(1, 'I');
//     hm.set(4, 'IV');
//     hm.set(5, 'V');
//     hm.set(9, 'IX');
//     hm.set(10, 'X');
//     hm.set(40, 'XL');
//     hm.set(50, 'L');
//     hm.set(90, 'XC');
//     hm.set(100, 'C');
//     hm.set(400, 'CD');
//     hm.set(500, 'D');
//     hm.set(900, 'CM');
//     hm.set(1000, 'M');
//     let res = '';
//     let keys = Array.from(hm.keys()).reverse();
//     console.warn("🚀 ~ intToRoman ~ keys:", keys)
//     for (let i = 0; i < keys.length; i++) {
//         while (num >= keys[i]) {
//             console.warn("🚀 ~ intToRoman ~ hm.get(keys[i]):", num, keys[i], hm.get(keys[i]))
//             res += hm.get(keys[i]);
//             num -= keys[i];
//         }
//     }
//     console.warn("🚀 ~ intToRoman ~ res:", res)
//     return res;
// };
//intToRoman(3) // "III"
// intToRoman(4) // "IV"
// intToRoman(9) // "IX"
// intToRoman(58) // "LVIII"
// intToRoman(1994) // "MCMXCIV"
// intToRoman(3999) // "MMMCMXCIX"


//------------------------------------------------------------------------------------------

// var lengthOfLastWord = function(s) {
//     return  s.trim().split(" ").pop().length;
// };

// lengthOfLastWord("Hello World") // 5
// lengthOfLastWord("   fly me   to   the moon  ") // 4
// lengthOfLastWord("luffy is still joyboy") // 6
// lengthOfLastWord("   ") // 0

//------------------------------------------------------------------------------------------
//14. Longest Common Prefix

/* var longestCommonPrefix = function (strs) {
    let sortedArr  = strs.sort();
    let str1 = sortedArr[0], str2 = sortedArr[strs.length-1];
    let ln1 = str1.length, ln2 = str2.length;
    let p1 =0, p2 = 0;
    let res = '';
    while (p1 < ln1 && p2 < ln2) {
        if (str1[p1] === str2[p2]) {
            res += str1[p1];
        } else {
            break;
        }
        p1++;
        p2++;
    }
    console.warn("🚀 ~ longestCommonPrefix ~ res:", res)
    return res;
}; */

//longestCommonPrefix(["flower", "flow", "flight"]) // "fl"
// longestCommonPrefix(["dog","racecar","car"]) // ""
// longestCommonPrefix(["a"]) // "a"
// longestCommonPrefix([""]) // ""


//------------------------------------------------------------------------------------------

//Find the Index of the First Occurrence in a String
// var strStr = function (haystack, needle) {
//     for (let i = 0; i < haystack.length - needle.length; i++) {
//         let found = true;
//         for (let j = 0; j < needle.length; j++) {
//             if (haystack[i + j] !== needle[j]) {
//                 found = false;
//                 break;
//             }
//         }
//         if (found) {
//             console.warn("🚀 ~ strStr ~ found:", i)
//             return i;
//         }
//     }
//     return -1;
// };

/* //optimized solution
var strStr = function (haystack, needle) {
   return haystack.indexOf(needle);
}; */
//strStr("sadbutsad", "sad") // 0
//strStr("leetcode", "leeto") // -1
// strStr("a", "a") // 0
// strStr("mississippi", "issip") // 4  

//--------------------------------------------------------------------------------------------

//Reverse Words in a String

/* var reverseWords = function(s) {
    //solution 1
    // return s.trim().split(' ').reverse().join(' ');
    //solution 2
    const words = s.trim().split(' ').filter(word => word.length > 0);
    const reversed = [];
    for (let i = words.length - 1; i >= 0; i--) {
        reversed.push(words[i]);
    }
    return reversed.join(' ');
}; */

// reverseWords("the sky is blue") // "blue is sky the"
// reverseWords("  hello world  ") // "world hello"
// reverseWords("a good   example") // "example good a"
// reverseWords("  Bob    Loves  Alice   ") // "Alice Loves Bob"

//----------------------------------------------------------------------------------------------

/* var isPalindrome = function(s) {
    const cleanedStr = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    // console.warn("🚀 ~ isPalindrome ~ cleanedStr:", cleanedStr)
    if (cleanedStr.length === 0) return true;
    let left = 0 
    let right  = cleanedStr.length - 1;
    for (left, right; left < right; left++, right--) {
        if(cleanedStr[left] !== cleanedStr[right]) {
            return false;
        }   
    }
    return true;
}; // O(n) time complexity and O(1) space complexity

console.log(isPalindrome("A man, a plan, a canal: Panama"))// true
console.log(isPalindrome("race a car")) // false */
// isPalindrome(" ") // true
// isPalindrome("0P") // false


//----------------------------------------------------------------------------------------------

/* var isSubsequence = function(s, t) {
    let left = 0;
    let right = 0;
    if (s.length === 0) return true;
    if (t.length === 0) return false;
    for (left, right; left < s.length && right < t.length; right++) {
        // console.warn("🚀 ~ isSubsequence ~ s[left] , t[right]:", s[left] , t[right])
        if (s[left] === t[right]) {
            left++;
        }

    }
    console.warn("🚀 ~ isSubsequence ~ left:", left)
    return left === s.length;
};

isSubsequence("abc", "ahbgdc") // true
isSubsequence("axc", "ahbgdc") // false
isSubsequence("ace", "abcde") // true
isSubsequence("aec", "abcde") // false
isSubsequence("", "abc") // true */


//----------------------------------------------------------------------------------------------------------------------------

//Remove all continous repating character equal and more than the n number of times

// function removeContChar(str, n) {
//     let res = ''
//     let temp = str[0];
//     let left = 0
//     for (let i = 1; i < str.length; i++) {
//         if (str[i] !== str[left]) {
//             if (temp.length >= n) {
//                 temp = ''
//             } else {
//                 res += temp
//                 temp = ''
//             }
//         }
//         temp += str[i];
//         if (i === str.length -1 && temp.length < n) {
//             res += temp;
//         }
//         console.log('temp->', temp, 'res->', res)
//         left++;
//     }
// }

// removeContChar('aaaabbbaaaaaccd', 4) //bbbccd
// removeContChar('aaabbbbbaacc', 5) // aaaaacc

//In JavaScript, string concatenation in a loop is not as fast as using an array and joining it later. So...

//⏱️ Time Complexity (in worst case): O(s²) due to repeated string concatenation inside loops.

// ✅ How to Improve Your Code?

/* function removeContChar(str, n) {
    let res = [];
    let temp = [str[0]];
    for (let i = 1; i < str.length; i++) {
        if (str[i] !== str[i - 1]) {
            if (temp.length < n) {
                res.push(...temp);
            }
            temp = [];
        }
        temp.push(str[i]);
    }
    if (temp.length < n) {
        res.push(...temp);
    }
    return res.join('');
}

removeContChar('aaaabbbaaaaaccd', 4) //bbbccd
removeContChar('aaabbbbbaacc', 5) // aaaaacc */

/* 🧠 So why O(n²) Time?
If you're building a string res character by character in a loop:

Each time res += x copies the whole existing string

That’s O(1) + O(2) + O(3) + ... + O(n) operations

Which is 1 + 2 + 3 + ... + n = n(n+1)/2 = O(n²)

💡 It’s not about the memory being used — it’s about how many times you're copying and how big those copies are.

✅ Summary
String concatenation is expensive in both time and space.

Because strings are immutable, every += does:

Allocate new memory

Copy all previous characters (which takes time)

Result: O(n²) time in worst case. 

CHECK BENCHMARK CODE

function stringConcatTest(n) {
  let res = '';
  let start = performance.now();
  for (let i = 0; i < n; i++) {
    res += 'a';
  }
  let end = performance.now();
  console.log(`String concat: ${end - start} ms`);
}

function arrayJoinTest(n) {
  let res = [];
  let start = performance.now();
  for (let i = 0; i < n; i++) {
    res.push('a');
  }
  res = res.join('');
  let end = performance.now();
  console.log(`Array join: ${end - start} ms`);
}

// Run the test with a large number of characters
const N = 100000;

stringConcatTest(N);
arrayJoinTest(N);
*/


//----------------------------------------------------------------------------------------------
// Finding the Longest Substring Without Repeating Characters
// let str = “geeksforgeeks” // 7 (ksforge)
// let str = 'abcdefabcbb'// 6  (bcdefa)

// const longStr = (str) => {
//    const hs = new Set();
//    let left = 0 
//    let maxLength = 0
//    for (let right = 0; right < str.length; right++) {
//        while(hs.has(str[right])) {
//            hs.delete(str[left])
//         left++
//        }
//        hs.add(str[right]);
//            console.log(maxLength, right, left, hs)
//            maxLength = Math.max(maxLength, right-left +1)
//    }
//     return maxLength;
// }

// console.log(longStr(str))


//-----------------------------------------------------------------------------------------------

//  Handling Overlapping Intervals

function mergeIntervals(intervals) {
    let merged = [intervals[0]]
    
    for (let i = 1; i < intervals.length; i++) {
        let last = merged[merged.length -1]
        console.log(last)
        if(last[1] >= intervals[i][0]) {
            last[1] = Math.max(last[1], intervals[i][1])
        } else {
            merged.push(intervals[i])
        }
    }
    return merged;
}

console.log(mergeIntervals([[1,3], [2,6], [8,10], [9,12]])); // [ [ 1, 6 ], [ 8, 12 ] ]
console.log(mergeIntervals([[1,4], [2,3]])); // [ [ 1, 4 ] ]

console.log(mergeIntervals([[1,4], [0,4]])); // [ [ 1, 4 ] ]


//----------------------------------------------------------------------------------------------

// GENERATE RANDOM UNIQUE STRING
let char = 'QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890';

let str = '';

for (let i = 0; i < 6; i++) { // ADJUST THE LENGTH OF STRING ACCORDINGLY
    const index = Math.floor(Math.random() * char.length)
    str += char[index]
}

console.log(str)




