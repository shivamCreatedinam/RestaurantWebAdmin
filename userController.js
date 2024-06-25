const Otpmodel =require('../models/otp');
const {otpVerification} =require('../helpers/otpvalidate');

const otpGenerator=require('otp-generator');
const twilio =require('twilio');

const accountSid=process.env.TWILIO_ACCOUNT_SID;
const authToken =process.env.TWILIO_AUTH_TOKEN;

const twilioClient=new twilio(accountSid,authToken);


const sendOtp=async(req,res)=> {
try{
 const {phoneNumber} =req.body;
    const otp =otpGenerator.generate(6,{upperCaseAlphabets:false,specialChars :false,lowerCaseAlphabets:false});
   console.log(phoneNumber);
    const cDate =new Date();

    Otpmodel.findOneAndUpdate(
        {phoneNumber},
        {otp,otpExpiration:new Date(cDate.getTime())},
        {upsert:true,new:true,setDefaultOnInsert:true}
    );

    await twilioClient.messages.create({
        body:`Your OTP is :${otp}`,
        to: phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER
    });
   
    return res.status(200).json({
        success:true,
        msg:'otp sent successfully ' + otp
    });
}catch(error){
    return res.status(400).json({
        success:false,
        msg:'e' 
    });
}

}

const verifyOtp =async(req,res)=>{
    try{
         const {phoneNumber,otp}=req.body;
         console.log("q"+otp);
            const otpData =await Otpmodel.findOne({
                phoneNumber,
                otp
             });
             console.log(otpData);
             if(!otpData){
                return res.status(400).json({
                    success:false,
                    msg:'You entered wrong OTP!'
                });
             }
const isOtpExpired =await otpVerification(otpData.otpExpiration);
if(isOtpExpired){
    console.log(isOtpExpired);
    return res.status(400).json({
        success:false,
        msg: `Your otp has been expired`
    });
}
return res.status(200).json({
    success:true,
    msg: `Your otp verfied succesfuly`
});
    }catch(error){
    return res.status(400).json({
        success:false,
        msg:'e' 
    });
}
}

module.exports={
sendOtp,
verifyOtp
}