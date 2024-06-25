const otpVerification =async(otpTime)=>{
    try{
       console.log('Milliseconds is :'+otpTime);
       const cDateTime=new Date();
       var differenceValue=(otpTime-cDateTime.getTime())/1000;
       differenceValue/=60;

const minutes =Math.abs(differenceValue);

       console.log('expiredminutes:'+minutes );
       if(minutes > 2){
        console.log("a1");
        return true;
       }
       console.log("a14");
       return false;
    }
    catch(error){
        console.log(error.message);
    }
}
module.exports={
    otpVerification
}


