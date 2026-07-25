// ===============================
// AKTUÁLIS TESZT BETÖLTÉSE
// ===============================


let currentCode = localStorage.getItem("currentTest");


if(!currentCode){

    alert("Nincs kiválasztott dolgozat!");
    window.location.href="index.html";

}



let currentTest = tests[currentCode];


let timeLeft = currentTest.time * 60;

let timer;



// ===============================
// OLDAL INDÍTÁSA
// ===============================


window.onload=function(){


document.getElementById("title").innerHTML =
currentTest.title;


loadQuestions();


startTimer();


}



// ===============================
// KÉRDÉSEK GENERÁLÁSA
// ===============================


function loadQuestions(){


let container =
document.getElementById("questions");



currentTest.questions.forEach(
(question,index)=>{


let div=document.createElement("div");


div.className="question";



let html="";


html+=
"<h2>"+
(index+1)+
". feladat</h2>";



html+=
"<p>"+
question.question+
"</p>";




// FELELETVÁLASZTÓ


if(question.type==="radio"){


question.answers.forEach(
(answer,i)=>{


html+=`

<label>

<input 
type="radio"
name="q${index}"
value="${i}">

${answer}

</label>

<br>

`;


});


}



// SZÖVEGES VÁLASZ


if(question.type==="text"){


html+=`

<input

type="text"

class="textAnswer"

id="q${index}"

>

`;


}



div.innerHTML=html;


container.appendChild(div);



}

);



if(window.MathJax){

MathJax.typeset();

}



}



// ===============================
// IDŐZÍTŐ
// ===============================



function startTimer(){



timer=setInterval(function(){



let minutes =
Math.floor(timeLeft/60);


let seconds =
timeLeft%60;



if(seconds<10){

seconds="0"+seconds;

}



document.getElementById("timer").innerHTML =
minutes+":"+seconds;



timeLeft--;



if(timeLeft<0){


clearInterval(timer);


alert(
"Lejárt az idő! A dolgozat automatikusan beadásra kerül."
);


submitTest();


}



},1000);



}




// ===============================
// JAVÍTÁS
// ===============================



function submitTest(){


clearInterval(timer);



let score=0;



let answers=[];



currentTest.questions.forEach(
(question,index)=>{



let userAnswer="";



// rádió


if(question.type==="radio"){


let selected =
document.querySelector(
`input[name="q${index}"]:checked`
);



if(selected){

userAnswer =
Number(selected.value);


}



}



// szöveges


if(question.type==="text"){


userAnswer =
document.getElementById(
"q"+index
).value.trim();


}




answers.push(userAnswer);




// ellenőrzés


if(question.type==="radio"){


if(userAnswer===question.correct){

score++;

}



}



if(question.type==="text"){


if(
userAnswer.toLowerCase()
===
question.correct.toLowerCase()

){

score++;

}



}



});





let percent =
Math.round(
score/currentTest.questions.length*100
);





document.getElementById("result").innerHTML=`

<h2>Eredmény</h2>

<p>
Pontszám:
${score}/${currentTest.questions.length}
</p>


<p>
${percent}%
</p>


`;



// később ide jön a Google Sheets küldés



let resultData = {


name:
document.getElementById("name").value,


test:
currentCode,


score:
score,


answers:
answers


};





fetch(
"https://script.google.com/macros/s/AKfycbybmqOmgoFE0_LEq-xQMnDv92cg8twq747WXCqVy05x157GjskmsF9b2SAUJjP1Z575jg/exec",
{


method:"POST",


body:
JSON.stringify(resultData),


headers:{


"Content-Type":
"application/json"


}



}

)

.then(response=>{


console.log("Elküldve");


})

.catch(error=>{


console.log(error);


});
