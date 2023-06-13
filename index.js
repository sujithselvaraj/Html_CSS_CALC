var isPerformed=false;
var lastOperation="";
var isDecimal=false;


//function used to clear all in the display box
function remAll()
{
    isPerformed=false;
    isDecimal=false;
    lastOperation="";
    document.getElementById("display-box").value="0";
}

//to  find the last most entered character
function peek(val)
{
    return val.charAt(val.length-1);
}

//to take an particular value
function trim(val,lim)
{
    return val.substring(0,val.length-lim);
}


function mpeek(exp)
{
    return exp.substring(0,exp.length-1).charAt(exp.length-2);
}

function setDeciFlag(exp)
{
    var i=exp.length-1;
    while(i>=0 && exp.charAt(i)!='.'){

        i--;

    }

    if(i===-1){

        isDecimal=false;

    }else{

        isDecimal=true;

    }
}



function deletion()
{
    document.getElementById("display-box").value=document.getElementById("display-box")
    .value.substring(0,document.getElementById("display-box").value.length-1);
    setDeciFlag(document.getElementById("display-box").value);
}


//this is an input handle from an buttons present in an web page and  to validate according to the proper input
function expp(value)
{
  
    var exp=document.getElementById("display-box").value;


    if((exp===0 || exp=='0' && !isNaN(value)))
    {
        exp="";
    }

    if(isDecimal && value===".")
    {
        return ;

    }

    if(isNaN(peek(exp)) && value==='.')
    {
        exp+='0';
    }

    if(isNaN(value))
    {
        lastOperation="";
        isDecimal=(value==='.')?true:false;
        isPerformed=false;
    }


    if(isNaN(value) && value!='.' && isNaN(peek(exp)) && peek(exp)!='.')
    {
        exp=trim(exp,1)+value;
    }

    else
    {
        exp+=value.replaceAll(/\s/g,"");
    }
    document.getElementById("display-box").value=exp;
}


//to listen for the buttons we are clicking in the web page
document.addEventListener('click',(e)=>{
    if(e.target.name=="num" && e.target.value!=="C" &&e.target.value!=="DEL" && e.target.value!=="=")
    {
        expp(e.target.value);
    }
    if(e.target.value==='+'|| e.target.value==='-' || e.target.value==='*' || e.target.value ==='/' || e.target.value==='%')
    {
        isPerformed=false;
        lastOperation="";
    }
})


//to check the precedence of the operator to execute
function precedence(op1,op2)
{
    if(op2=="%")
        return true;
    if((op1=="*" || op1=="/") && (op2=="+" || op2=="-"))
        return false;
    else
        return true;

}


//actual perform
function perform(op,value1,value2)
{
    value1=parseFloat(value1);
    value2=parseFloat(value2);

    switch(op)
    {
        case '+':
            return value2+value1;
        case '-':
            return value2-value1;
        case '*':
            return value2*value1;
        case '/':
            return value2/value1;
        case '%':
            return value2%value1;
    }
}



//to perform an = function in the html 
function calc()
{
    var exp=document.getElementById("display-box").value;
    isEqualClicked=true;
    isNaN(exp[exp.length-1])&&(exp=exp.substring(0,exp.length-1))
    
    //if nothing in the input
    if(exp==='')
    {
        document.getElementById("display-box").value="";
    }
    
    while(isNaN(exp.charAt(exp.length-1)))
    {
        exp=exp.substring(0,exp.length-1);
    }
    

    //= to add improve all the event before 
    if(!isPerformed)
    {
        var i=exp.length-1;
        while(!isNaN(exp.charAt(i)||exp.charAt(i)==='.')&&i>=0)
        {
            lastOperation=exp.charAt(i--)+lastOperation;
        }
        lastOperation=exp.charAt(i)+lastOperation;
        
    }

    if(!isNaN(lastOperation.charAt(0))||lastOperation.charAt(0)==='.')
    {
        lastOperation="";
    }

    //if already an operation is happened and user presses equal it will increase accordingly to our last expression
    if(isPerformed)
    {
        exp+=lastOperation;
    }

    isPerformed=true;
    

    var op=[];
    var values=[];
//precedenece of an  operator
    for(i=0;i<exp.length;i++)
    {
        if(!isNaN(exp.charAt(i)))
        {
            var temp="";
            while(i<exp.length&&(!isNaN(exp.charAt(i))||exp.charAt(i)==='.'))
            {
                temp+=exp.charAt(i++);
            }
            values.push(temp);
            i--;
        }
        else if(isNaN(exp.charAt(i)))
        {
            while(op.length!=0 && precedence(exp.charAt(i),op[op.length-1]))
            {
                values.push(perform(op.pop(),values.pop(),values.pop()));
            }
            op.push(exp.charAt(i));
        }
    }


    while(op.length!=0)
    {
        values.push(perform(op.pop(),values.pop(),values.pop()));
    }

    if(isNaN(values[0]))
    {
        values[0]=0;
        isEqualClicked=false;
    }


    document.getElementById("display-box").value=values.pop();
    setDeciFlag(document.getElementById("display-box").value);
}

//to handle the input given from the keyboard
const handleInput=(event)=>
{
    var temp=event.target.value;
    var exp=temp.substring(0,temp.length);
    var value=peek(exp);

    console.log(exp+ " "+ value+" "+mpeek(exp))
    if(exp.charAt(0)==='0')
    {
        document.getElementById('display-box').value=exp.charAt(1);
        isDecimal=false;
    }

    //prevents the multiple decimal points in the same operands
    if(isDecimal&&value==='.')
    {
        event.target.value=trim(event.target.value,1);
        return;
    }

    //if one operand is given isdecimal is given to false
    if(isNaN(value) && value!='.')
    {
        isDecimal=false;
    }

    //add 0 if an  operator follow a dot
    if(isNaN(mpeek(exp)|| mpeek(exp)==="")&&value===".")
    {
        event.target.value=trim(event.target.value,1)+"0";
    }

    if(isNaN(value))
    {
        lastOperation="";
        isDecimal=(value==='.')?true:false;
        isPerformed=false;
    }


    //for elimainating the repetition of an operator and replaces with an new operator
    //not replaces an  decimal point
    if(isNaN(value) && value!="." && isNaN(mpeek(exp)) && mpeek(exp)!='.')
    {
        console.log("sujith");
        event.target.value=trim(exp,2)+value;
    }

    event.target.value=event.target.value.replace(/[^0-9+\-/*%.]/g,'')
}



  