(()=>{var e={};e.id=866,e.ids=[866],e.modules={399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8893:e=>{"use strict";e.exports=require("buffer")},1282:e=>{"use strict";e.exports=require("child_process")},4770:e=>{"use strict";e.exports=require("crypto")},665:e=>{"use strict";e.exports=require("dns")},7702:e=>{"use strict";e.exports=require("events")},2048:e=>{"use strict";e.exports=require("fs")},2615:e=>{"use strict";e.exports=require("http")},5240:e=>{"use strict";e.exports=require("https")},8216:e=>{"use strict";e.exports=require("net")},9801:e=>{"use strict";e.exports=require("os")},5315:e=>{"use strict";e.exports=require("path")},8621:e=>{"use strict";e.exports=require("punycode")},6162:e=>{"use strict";e.exports=require("stream")},2452:e=>{"use strict";e.exports=require("tls")},7360:e=>{"use strict";e.exports=require("url")},1764:e=>{"use strict";e.exports=require("util")},1568:e=>{"use strict";e.exports=require("zlib")},8359:()=>{},3739:()=>{},4431:(e,t,r)=>{"use strict";r.r(t),r.d(t,{originalPathname:()=>m,patchFetch:()=>h,requestAsyncStorage:()=>u,routeModule:()=>c,serverHooks:()=>x,staticGenerationAsyncStorage:()=>g});var i={};r.r(i),r.d(i,{POST:()=>p});var o=r(9303),s=r(8716),n=r(670),a=r(7070),l=r(6685),d=r(5228);async function p(e){try{let{email:t}=await e.json();if(!t||!t.includes("@"))return a.NextResponse.json({error:"Valid email is required"},{status:400});let{data:r}=await d.O.from("newsletter_subscriptions").select("email").eq("email",t).single();if(r)return a.NextResponse.json({message:"You are already subscribed to our newsletter!"},{status:200});let{error:i}=await d.O.from("newsletter_subscriptions").insert({email:t,subscribed_at:new Date().toISOString()});if(i)return console.error("Database error:",i),a.NextResponse.json({error:"Failed to subscribe to newsletter"},{status:500});let o=await (0,l.Ky)(t);return o.success||(console.error("Email error:",o.error),console.log("Newsletter subscription saved but welcome email failed to send")),a.NextResponse.json({success:!0,message:"Successfully subscribed to newsletter!"},{status:200})}catch(e){return console.error("API error:",e),a.NextResponse.json({error:"Internal server error"},{status:500})}}let c=new o.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/subscribe-newsletter/route",pathname:"/api/subscribe-newsletter",filename:"route",bundlePath:"app/api/subscribe-newsletter/route"},resolvedPagePath:"E:\\anvad\\app\\api\\subscribe-newsletter\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:u,staticGenerationAsyncStorage:g,serverHooks:x}=c,m="/api/subscribe-newsletter/route";function h(){return(0,n.patchFetch)({serverHooks:x,staticGenerationAsyncStorage:g})}},6685:(e,t,r)=>{"use strict";r.d(t,{Ky:()=>a,a2:()=>s,bn:()=>n});var i=r(5245);let o=()=>i.createTransport({service:"gmail",auth:{user:process.env.GMAIL_EMAIL,pass:process.env.GMAIL_APP_PASSWORD}}),s=async(e,t)=>{let r=o(),i={from:process.env.GMAIL_EMAIL,to:e,subject:"ANVEDA - Email Verification OTP",html:`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f5ef;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: #7d3600; margin-bottom: 20px;">
            <span style="color: #EDBC7E;">ANVEDA</span>
          </h1>
          <h2 style="color: #333; margin-bottom: 20px;">Email Verification</h2>
          <p style="color: #666; margin-bottom: 30px;">
            Please use the following OTP to verify your email address:
          </p>
          <div style="background-color: #7d3600; color: white; padding: 15px; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0;">
            ${t}
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            This OTP is valid for 10 minutes only.
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            If you didn't request this verification, please ignore this email.
          </p>
        </div>
      </div>
    `};try{return await r.sendMail(i),{success:!0}}catch(e){return console.error("Error sending OTP email:",e),{success:!1,error:e}}},n=async e=>{let t=o(),{email:r,name:i,orderId:s,items:n,totalPrice:a,address:l,phone:d}=e,p=n.map(e=>`
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 10px; text-align: left;">${e.product_name}</td>
      <td style="padding: 10px; text-align: center;">${e.variant_quantity}</td>
      <td style="padding: 10px; text-align: center;">${e.quantity}</td>
      <td style="padding: 10px; text-align: right;">₹${e.unit_price}</td>
      <td style="padding: 10px; text-align: right; font-weight: bold;">₹${e.total_price}</td>
    </tr>
  `).join(""),c={from:process.env.GMAIL_EMAIL,to:r,subject:`Order Confirmation - #${s} - ANVEDA`,html:`
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; background-color: #f9f5ef;">
        <div style="background-color: white; padding: 30px; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #7d3600; margin-bottom: 10px;">
              <span style="color: #EDBC7E;">ANVEDA</span>
            </h1>
            <div style="background-color: #4CAF50; color: white; padding: 10px; border-radius: 5px; display: inline-block;">
              ✅ Order Confirmed
            </div>
          </div>
          
          <h2 style="color: #333; margin-bottom: 20px;">Thank you for your order, ${i}!</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #7d3600; margin-top: 0;">Order Details</h3>
            <p><strong>Order ID:</strong> #${s}</p>
            <p><strong>Email:</strong> ${r}</p>
            <p><strong>Phone:</strong> ${d}</p>
            <p><strong>Delivery Address:</strong><br>${l}</p>
          </div>

          <h3 style="color: #7d3600; margin-bottom: 15px;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #7d3600; color: white;">
                <th style="padding: 12px; text-align: left;">Product</th>
                <th style="padding: 12px; text-align: center;">Size</th>
                <th style="padding: 12px; text-align: center;">Qty</th>
                <th style="padding: 12px; text-align: right;">Price</th>
                <th style="padding: 12px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${p}
            </tbody>
          </table>

          <div style="text-align: right; margin-bottom: 30px;">
            <div style="background-color: #7d3600; color: white; padding: 15px; border-radius: 5px; display: inline-block;">
              <h3 style="margin: 0;">Total Amount: ₹${a}</h3>
            </div>
          </div>

          <div style="background-color: #e8f5e8; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
            <h4 style="color: #2e7d32; margin-top: 0;">What's Next?</h4>
            <ul style="color: #666; margin: 0; padding-left: 20px;">
              <li>We'll process your order within 24 hours</li>
              <li>You'll receive a shipping confirmation with tracking details</li>
              <li>Expected delivery: 3-5 business days</li>
              <li>Free delivery on all orders</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666;">Need help? Contact us:</p>
            <p style="color: #7d3600; font-weight: bold;">
              📱 +91 75200 81717 | 📧 rakshittgupta@gmail.com
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              Thank you for choosing ANVEDA - Premium A2 Ghee<br>
              Traditional Methods • Modern Quality
            </p>
          </div>
        </div>
      </div>
    `};try{return await t.sendMail(c),{success:!0}}catch(e){return console.error("Error sending order confirmation email:",e),{success:!1,error:e}}},a=async e=>{let t=o(),r={from:process.env.GMAIL_EMAIL,to:e,subject:"Welcome to ANVEDA Newsletter!",html:`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f5ef;">
        <div style="background-color: white; padding: 30px; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #7d3600; margin-bottom: 10px;">
              <span style="color: #EDBC7E;">ANVEDA</span>
            </h1>
            <div style="background-color: #4CAF50; color: white; padding: 10px; border-radius: 5px; display: inline-block;">
              🎉 Welcome to the Family!
            </div>
          </div>
          
          <h2 style="color: #333; margin-bottom: 20px;">Thank you for subscribing!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            You're now part of the ANVEDA family! We're excited to share with you:
          </p>

          <ul style="color: #666; line-height: 1.8; margin-bottom: 30px;">
            <li>🌟 Exclusive offers and discounts</li>
            <li>🥛 Health tips and A2 ghee benefits</li>
            <li>📰 Latest product launches</li>
            <li>👨‍🍳 Traditional recipes and cooking tips</li>
            <li>🎁 Special subscriber-only deals</li>
          </ul>

          <div style="background-color: #fff8e1; padding: 20px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #EDBC7E;">
            <h3 style="color: #7d3600; margin-top: 0;">Did you know?</h3>
            <p style="color: #666; margin: 0;">
              A2 ghee contains only A2 beta-casein protein, which is easier to digest and may have additional health benefits compared to regular ghee. Our traditional churning methods preserve all the natural goodness!
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000" 
               style="background-color: #7d3600; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Shop Premium A2 Ghee
            </a>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666;">Stay connected with us:</p>
            <p style="color: #7d3600; font-weight: bold;">
              📱 +91 75200 81717 | 📧 rakshittgupta@gmail.com
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              You can unsubscribe at any time by replying to this email.<br>
              ANVEDA - Premium A2 Ghee • Traditional Methods • Modern Quality
            </p>
          </div>
        </div>
      </div>
    `};try{return await t.sendMail(r),{success:!0}}catch(e){return console.error("Error sending newsletter welcome email:",e),{success:!1,error:e}}}},5228:(e,t,r)=>{"use strict";r.d(t,{O:()=>i});let i=(0,r(2438).eI)("https://scxpgzgxqgjnrvfybcyc.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjeHBnemd4cWdqbnJ2ZnliY3ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NDk0NjgsImV4cCI6MjA2NzMyNTQ2OH0.l84EQBLql2WKQoRTD-0CPsLtOF5bVEdmS6IYmrKzwmg")}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),i=t.X(0,[948,770,438],()=>r(4431));module.exports=i})();