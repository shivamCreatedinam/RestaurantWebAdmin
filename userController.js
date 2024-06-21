const Otpmodel =require('../models/otp');

const otpGenerator=require('otp-generator');
const twilio =require('twilio');

const accountSid=process.env.TWILIO_ACCOUNT_SID;
const authToken =process.env.TWILIO_AUTH.TOKEN;

const twilioClient=new twilio(accountSid,authToken);


const sendOtp=async(req,res)=> {
try{
 const {phoneNumber} =req.body;
    const otp =otpGenerator.generate(6,{upperCaseAlphabets:false,specialChars :false,lowerCaseAlphabets:false});
   
    Otpmodel.findOneUpdate(

    {
     phoneNumber
    },
    {
        otp,otpExipration
    }
   );
   
    return res.status(200).json({
        success:true,
        msg:otp
    });
}catch(error){
    return res.status(400).json({
        success:false,
        msg:error.message
    });
}

}
module.exports={
sendOtp
}