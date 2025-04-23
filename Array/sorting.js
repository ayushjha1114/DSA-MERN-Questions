// Quick Sort

// function partition(arr, low, high) {
//     let pivot = arr[low];
//     let i = low;
//     let j = high;
//     while (i < j) {
//         while (arr[i] <= pivot){ i++;}
//         while (arr[j] > pivot) {j--;}

//         if (i < j) {
//             let temp = arr[i];
//             arr[i] = arr[j];
//             arr[j] = temp;
//         }
//     }
//     let temp = arr[j];
//     arr[j] = arr[low];
//     arr[low] = temp;
//     return j;
// }

// function quickSort(arr, low, high) {
//     if (low < high) {
//         let pivot = partition(arr, low, high);
//         console.warn("🚀 ~ quickSort ~ pivot:", pivot)
//         quickSort(arr, low, pivot-1);
//         quickSort(arr, pivot + 1, high);       
//     }
//     console.log(arr);
// }
// quickSort([3, 6, 8, 10, 1, 2, 1], 0, 6);

//-------------------------------------------------------------------------------------------------------------------

// Merge Sort

function merge(arr, left, mid, right) {
    let i  = left;
    let j = mid + 1;
    let k = left;
    let b = [];
    while(i <= mid && j <= right) {
        if (arr[i] <= arr[j]) {
            b[k] =arr[i];
            i++;
        } else {
            b[k] = arr[j];
            j++;
        }
        k++;
    }
    if ( i > mid) {
        while ( j <= right) {
            b[k++] = arr[j++];
        }
    } else {
        while ( i <= mid) {
            b[k++] = arr[i++];
        }
    }
    
    for ( let i = left; i <= right; i++) {
        arr[i] = b[i];
    }
    // console.log(arr, b);

    
}

function mergeSort(arr, left, right) {
    if (left < right) {
        let mid = Math.floor((left + right) / 2);
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left , mid, right);
    }
    console.log(arr);
}

mergeSort([9, 4, 7, 6, 3, 1, 5], 0, 6);

