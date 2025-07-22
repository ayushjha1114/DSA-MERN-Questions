/* arr = [11, 15, 6, 8, 9, 10]
// arr = [11, 15, 26, 38, 9, 10]
let x = 16

let fn = () => {
  for (let i = 0; i < arr.length; i++) {
  for (let j = 1; j < arr.length; j++) {
    if ((arr[i]+arr[j]) === x) {
      console.log('found!!', arr[i]+arr[j], i, j);
      return;
    } 
  }
}
}

fn() */

//---------------------------------------------------------------------------

// count down timer

const uptoDate =  new Date('Jun 4, 2024 13:00:00').getTime();


const timerId = setInterval(() => {
	const currentDate = new Date().getTime();
	const gap = uptoDate - currentDate;
  
  const day = Math.floor(gap /(1000* 60 * 60 * 24));
  const hour =  Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const mins = Math.floor((gap % (1000 * 60 * 60))/ (1000 * 60))
  const secs = Math.floor((gap % (1000* 60))/ 1000)
  
  console.log(day, ' d', hour, ' h', mins, ' m', secs, ' s')
  
  if (gap <= 0) {
  	clearInterval(timerId)
  }
}, 1000)

//-------------------------------------------------------------------------

// Kadane's Algorithm

arr = [1,2,3,-2,5]
// arr = [-1,-2,-3,-4]

let sum = 0;
let max = arr[0];
for(let i = 0; i < arr.length; i++) {
    sum += arr[i];
  if (sum > max) {
    max = sum;
  } 
}

console.log(max)

//------------------------------------------------------------------------

//  Try two pointer algorithm
//     Step1: Maintain two pointer one starting from 0 and other one from n-2.
//     Step2: Check if sum of two such elements equal to the (n-1)th element of array if so then 
//            increase count and increment one pointer ahead by 1 and decerement other pointer by 1.
//     Step3: If sum is less, then move starting pointer ahead only
//     Step4: if sum is more, then decrement end pointer by 1 only.

let arr = [1, 5, 3, 2]
// let arr = [2, 3, 4]
n = 4
// let r;
// for (let i = 0; i < n;) {
//   for (let j = n-2; j < 0;) {
//      r = arr[i] + arr[j];
//     if (r === arr[n-1]) {
//         i++;
//         j--;
//     } else if (r < arr[n-1]) {
//         i++;
//         j++;
//     }else if (r > arr[n-1]) {
//         i--;
//         j--;
//     }
//   }
// }

arr.sort(function(a, b) {
  return a - b;
});

let  ans = 0;
for (let i = n - 1; i >= 0; i--)
{
  let j = 0;
  let k = i - 1;
  while (j < k)
  {
    if(arr[i] == arr[j] + arr[k])
    {
      ans++;
      j++;
      k--;
    }
    else if (arr[i] > arr[j] + arr[k])
      j++;
    else
      k--;
  }
}

console.log(ans);

//-------------------------------------------------------------------------

// Maintain start and last index to store and print these values 
// Iterate the complete array.
// Add array elements to cuursum
// If currsum becomes greater than S, then remove elements starting from start index, till it become less than 
// or equal to S, and increement start.
// if currsum becomes equals to S, then print the starting and last index
// if the currsum never maches to S, then print -1

let subarraySum = (arr, n, s) => {
    let fp = -1;
    let sumofelement =0;
     for (let i = 0; i < n; i++) {
       if (fp === -1) {
         fp = i;
       }
       sumofelement += arr[i];
       
       if (sumofelement > s) {
         sumofelement = sumofelement - arr[fp];
         fp++;
       }
       
       if (sumofelement === s) {
         console.log('sumofelement',sumofelement)
         console.log(fp , i);
       } 
  
     }
    if (sumofelement !== s) {
      console.log(-1);
    }
    console.log('final', sumofelement)
              
  }
  
  // subarraySum([1,2,3,4,5,6,7,8,9,10], 10, 15)
  subarraySum([1,2,3,7,5], 5, 12)

  //---------------------------------------------------------------     


  function convertObj(obj) {
    const result = {};

    const keys = Object.keys(obj);
    const values = Object.values(obj);

    for (let i = 0; i < keys.length; i++) {
        const keyParts = keys[i].split('.');
        const value = values[i];

        let current = result;

        for (let j = 0; j < keyParts.length; j++) {
            const part = keyParts[j];

            // If it's the last part, set the value
            if (j === keyParts.length - 1) {
                current[part] = value;
            } else {
                // If the next level doesn't exist, create it
                if (!current[part]) {
                    current[part] = {};
                }
                current = current[part];
            }
        }
    }

    console.log(result);
}

// ✅ Example usage
const a = { 'a.b': 1, 'a.c': 2, 'd.e.f': 3 };
convertObj(a);

// Output:
// {
//   a: { b: 1, c: 2 },
//   d: { e: { f: 3 } }
// }

//let a=  { 'a.b': 1, 'a.c': 2 } 

//{ a: { b: 1, c: 2 } }



