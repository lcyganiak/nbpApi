const url = "http://api.nbp.pl/api/exchangerates/"

let currency = ''
let topCount = ''
/* ----wybrany checbox z tabelami -------- */
let inputCheckboxesContentValue = ''
/* ----wybrany checbox z tabelami -------- */


/* funkcja pobierająca dzisiejsza datę */ 
function getDataToday() {
const dataToDay = new Date()
const year = dataToDay.getFullYear()
const month = dataToDay.getMonth() + 1 
const day = dataToDay.getDate()
const spanData = document.getElementById('dataKursu')
const h = dataToDay.getHours()
let  min = dataToDay.getMinutes()
let sec = dataToDay.getSeconds()
if( min < 10) {
    min = "0" + min
}
if(sec < 10) {
    sec = "0" + sec
} else {
    sec = sec
}
spanData.innerHTML = day + '/' + month + '/' + year + " godzina " + h +" : " + min + " : " + sec

}
/* czyście tabele */
function clear() {
 const elementApp = document.getElementById('app')
 elementApp.innerHTML = ''

}

/* funkcja pobierająca dzisiejsza datę */ 

setInterval(getDataToday, 1000)

/* funkacja pobierająca value z checkbox z tabelami */ 
function getInput () {
    const inputCheckboxesContent = document.getElementsByName('tabela')
 for(let i =0; i< inputCheckboxesContent.length; i++) {
  if(inputCheckboxesContent[i].checked === true) {
   inputCheckboxesContentValue  = inputCheckboxesContent[i].value
  }
 }
}
/* --tworzewnie struktury html w div id="app"---*/
function createdElementTable(dataCoin, checboxValue) {
 const elementApp = document.getElementById('app')
 let divClassCard = document.createElement('div')
 divClassCard.classList.add('card')
 let divCardBody = document.createElement('div')
 divCardBody.classList.add('card-body')
 if(currency === '') {     
   let elementH5 = document.createElement('h5')
   elementH5.classList.add('card-title')
   let elementH5Text = document.createTextNode(dataCoin.currency)
   elementH5.appendChild(elementH5Text)
   divCardBody.appendChild(elementH5)
   let elementPFirst = document.createElement('p')
   elementPFirst.classList.add('card-text')
   let elementPFirstText = document.createTextNode(dataCoin.code)
   elementPFirst.appendChild(elementPFirstText)
   divCardBody.appendChild(elementPFirst)

 } else {
     let elementH5 = document.createElement('h5')
     elementH5.classList.add('card-title')
     let elementH5Text = document.createTextNode(dataCoin.effectiveDate)
     elementH5.appendChild(elementH5Text)
     divCardBody.appendChild(elementH5)
     let elementPFirst = document.createElement('p')
     elementPFirst.classList.add('card-text')
     let elementPFirstText = document.createTextNode(dataCoin.no)
     elementPFirst.appendChild(elementPFirstText)
     divCardBody.appendChild(elementPFirst)
 }
 if(checboxValue == 'c') {
     let elementPSecond = document.createElement('p')
     elementPSecond.classList.add('card-text')
     let elementPSecondText = document.createTextNode(dataCoin.bid + " end " + dataCoin.ask )
     elementPSecond.appendChild(elementPSecondText) 
     divCardBody.appendChild(elementPSecond)
 }
 else {
     let elementPSecond = document.createElement('p')
     elementPSecond.classList.add('card-text')
     let elementPSecondText = document.createTextNode(dataCoin.mid)
     elementPSecond.appendChild(elementPSecondText) 
     divCardBody.appendChild(elementPSecond)
 }
 divClassCard.appendChild(divCardBody)
 elementApp.appendChild(divClassCard)
}

/* funkacja pobierająca value z checkbox z tabelami */ 
function getTable () {
 getInput()
 fetch(`${url}tables/${inputCheckboxesContentValue}/?format=json`)
 .then(tabelaNbp => tabelaNbp.json())
 .then(tabelaNbp => {
    const elementApp = document.getElementById('app')
    elementApp.innerHTML = ''
    for(let i =0; i < tabelaNbp[0].rates.length; i++ ) {
     createdElementTable(tabelaNbp[0].rates[i], inputCheckboxesContentValue )
    }
 })
 .catch(error => alert(error))
}
/* funkcja pobierająca według wskazanej daty */
function getTableWithData() {
 getInput()
 const dataCalendar = document.getElementsByName('dataBox3')[0].value
 fetch(`${url}/tables/${inputCheckboxesContentValue}/${dataCalendar}/?format=json`)
 .then(tabelaNbp => tabelaNbp.json())
 .then(tabelaNbp => {
   clear()
   for(let i =0; i < tabelaNbp[0].rates.length; i++ ) {
    createdElementTable(tabelaNbp[0].rates[i], inputCheckboxesContentValue )
   }
  })
 .catch(error => alert(error))
}

/* ---pobieranie wskazanej waluty --- */
function getOneCoin() {
 getInput()
 currency = document.getElementById('exampleFormControlSelect1').value
 fetch(`${url}/rates/${inputCheckboxesContentValue}/${currency}/?format=json`)
 .then(oneCurrency => oneCurrency.json())
 .then(oneCurrency => {
    clear()
    for(let i = 0; i< oneCurrency.rates.length; i++) {
      createdElementTable( oneCurrency.rates[i], inputCheckboxesContentValue)
    }
    currency = ''
 })
 .catch(error => alert(error))
}

function handleLastCount () {
    getInput()
    topCount = document.getElementById('selectTopCount').value
    // console.log(topCount)

    fetch(`${url}/tables/${inputCheckboxesContentValue}/last/${topCount}/?format=json`)
    .then(res => res.json())
    .then(res => {
      clear()
      res.forEach(function (item) {
       for(let i = 0; i< item.rates.length; i++) {
        createdElementTable( item.rates[i], inputCheckboxesContentValue)
       }
      }) 
    })
}