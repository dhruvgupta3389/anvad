"use strict";(()=>{var e={};e.id=900,e.ids=[900],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},1282:e=>{e.exports=require("child_process")},4770:e=>{e.exports=require("crypto")},665:e=>{e.exports=require("dns")},7702:e=>{e.exports=require("events")},2048:e=>{e.exports=require("fs")},2615:e=>{e.exports=require("http")},5240:e=>{e.exports=require("https")},8216:e=>{e.exports=require("net")},9801:e=>{e.exports=require("os")},5315:e=>{e.exports=require("path")},6162:e=>{e.exports=require("stream")},2452:e=>{e.exports=require("tls")},7360:e=>{e.exports=require("url")},1764:e=>{e.exports=require("util")},1568:e=>{e.exports=require("zlib")},7138:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>x,patchFetch:()=>h,requestAsyncStorage:()=>c,routeModule:()=>p,serverHooks:()=>g,staticGenerationAsyncStorage:()=>u});var o={};r.r(o),r.d(o,{POST:()=>d});var i=r(9303),n=r(8716),s=r(670),a=r(7070),l=r(6685);async function d(e){try{let t=await e.json(),{email:r,name:o,orderId:i,items:n,totalPrice:s,address:d,phone:p}=t;if(!r||!o||!i||!n||!s||!d||!p)return a.NextResponse.json({error:"Missing required order details"},{status:400});let c=await (0,l.bn)(t);if(!c.success)return console.error("Email error:",c.error),a.NextResponse.json({error:"Failed to send order confirmation email"},{status:500});return a.NextResponse.json({success:!0,message:"Order confirmation email sent successfully"},{status:200})}catch(e){return console.error("API error:",e),a.NextResponse.json({error:"Internal server error"},{status:500})}}let p=new i.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/send-order-confirmation/route",pathname:"/api/send-order-confirmation",filename:"route",bundlePath:"app/api/send-order-confirmation/route"},resolvedPagePath:"E:\\anvad\\app\\api\\send-order-confirmation\\route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:c,staticGenerationAsyncStorage:u,serverHooks:g}=p,x="/api/send-order-confirmation/route";function h(){return(0,s.patchFetch)({serverHooks:g,staticGenerationAsyncStorage:u})}},6685:(e,t,r)=>{r.d(t,{Ky:()=>a,a2:()=>n,bn:()=>s});var o=r(5245);let i=()=>o.createTransport({service:"gmail",auth:{user:process.env.GMAIL_EMAIL,pass:process.env.GMAIL_APP_PASSWORD}}),n=async(e,t)=>{let r=i(),o={from:process.env.GMAIL_EMAIL,to:e,subject:"ANVEDA - Email Verification OTP",html:`
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
    `};try{return await r.sendMail(o),{success:!0}}catch(e){return console.error("Error sending OTP email:",e),{success:!1,error:e}}},s=async e=>{let t=i(),{email:r,name:o,orderId:n,items:s,totalPrice:a,address:l,phone:d}=e,p=s.map(e=>`
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 10px; text-align: left;">${e.product_name}</td>
      <td style="padding: 10px; text-align: center;">${e.variant_quantity}</td>
      <td style="padding: 10px; text-align: center;">${e.quantity}</td>
      <td style="padding: 10px; text-align: right;">₹${e.unit_price}</td>
      <td style="padding: 10px; text-align: right; font-weight: bold;">₹${e.total_price}</td>
    </tr>
  `).join(""),c={from:process.env.GMAIL_EMAIL,to:r,subject:`Order Confirmation - #${n} - ANVEDA`,html:`
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
          
          <h2 style="color: #333; margin-bottom: 20px;">Thank you for your order, ${o}!</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #7d3600; margin-top: 0;">Order Details</h3>
            <p><strong>Order ID:</strong> #${n}</p>
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
    `};try{return await t.sendMail(c),{success:!0}}catch(e){return console.error("Error sending order confirmation email:",e),{success:!1,error:e}}},a=async e=>{let t=i(),r={from:process.env.GMAIL_EMAIL,to:e,subject:"Welcome to ANVEDA Newsletter!",html:`
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
    `};try{return await t.sendMail(r),{success:!0}}catch(e){return console.error("Error sending newsletter welcome email:",e),{success:!1,error:e}}}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[948,770],()=>r(7138));module.exports=o})();