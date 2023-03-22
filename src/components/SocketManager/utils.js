function getRandomValues(array, n) {
    let randomValues = [];
    for (let i = 0; i < n; i++) {
        let random = Math.floor(Math.random() * array.length);
        randomValues.push(array[random]);
        array.splice(random, 1);
    }
    return randomValues;
}

//function to deep copy an array
function deepCopyArray(array) {
    let newArray = [];
    for (let i = 0; i < array.length; i++) {
        newArray.push(array[i]);
    }
    return newArray;
}



function generateRoundWords(words, round) {
    console.log(round, words)
    let roundArr = [];
    words.forEach(word => {
        if (word.round == round) {
            roundArr.push(word);
        }
    });
    console.log(roundArr, "roundArr")
    return roundArr;

}

//Function that gets a property called "category" from an array of objects, the function returns an array with all the categories, without repetitions
function getCategories(array) {
    console.log(array, "categoriesArray")
    let categories = [];
    for (let i = 0; i < array.length; i++) {
        if (!categories.includes(array[i].category)) {
            categories.push(array[i].category);
        }
    }
    return categories;
}



//Function that gets an array of objects and 


function verifyIfRepeated(word){
    
}

function generateRepeatedWords(categories,roundWords){
    let repeatedWords = roundWords
                .filter((word, index, arr) => {
                    // filter words with category in the given categories array
                    if (categories.includes(word.category)) {
                        // map each word to its value property
                        return arr
                            .slice(0, index)
                            .map(w => w.value)
                            .includes(word.value);
                    }
                    return false;
                })
                .reduce((uniqueWords, word) => {
                    // remove duplicates and return array of unique repeated words
                    if (!uniqueWords.includes(word.value)) {
                        uniqueWords.push(word.value);
                    }
                    return uniqueWords;
                }, []);
    return repeatedWords;
}

function generateTotalRoundPointsMap(words){
    const userPointsMap = words.reduce((map, word) => {
        if (!map.has(word.nickname)) {
          map.set(word.nickname, word.points);
        } else {
          map.set(word.nickname, map.get(word.nickname) + word.points);
        }
        return map;
      }, new Map());

        return userPointsMap;
}

export { getRandomValues, deepCopyArray, generateRoundWords, verifyIfRepeated, getCategories, generateRepeatedWords, generateTotalRoundPointsMap };
