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



