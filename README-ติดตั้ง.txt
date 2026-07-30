MAILLY OTP — ชุดแก้ไข
======================

ไฟล์บน GitHub:
- index.html
- page2.html
- shop.html
- youtube.html
- shared.css
- shared.js

ไฟล์ Google Apps Script:
- Code.gs

ขั้นตอนติดตั้ง
1. เปิด Code.gs แล้วใส่ SHEET_ID และ SMSPOOL_KEY จริงใน CONFIG
2. วาง Code.gs ทับใน Apps Script
3. รัน setupSheets() หนึ่งครั้ง เพื่อเพิ่มชีตและคอลัมน์ที่จำเป็น
4. Deploy > Manage deployments > Edit > New version > Deploy
5. ถ้า URL deployment เปลี่ยน ให้นำ URL ใหม่ไปแทนค่า MAILLY_API_URL ใน shared.js
   และ API_URL ใน index.html
6. อัปโหลดไฟล์หน้าเว็บทั้ง 6 ไฟล์ขึ้น GitHub/Vercel ในโฟลเดอร์เดียวกัน

แก้ปัญหาสมัครแล้วเด้งออก / ให้สมัครซ้ำ
---------------------------------------
1. วาง Code.gs ฉบับนี้ทับใน Apps Script
2. รัน setupSheets() หนึ่งครั้ง
3. Deploy > Manage deployments > Edit > New version > Deploy
4. วาง index.html ฉบับนี้ทับบน GitHub แล้วรอ Vercel Deploy
5. เปิดเว็บใหม่และสมัคร/ตั้ง Password อีกครั้งหนึ่ง

จากชีตเดิมที่มีเพียง userId, email, balance, createdAt, password:
- ค่าใน password เป็นข้อความธรรมดาจาก Backend เก่า
- ให้อัปเดต Code.gs และ Deploy ก่อน
- เมื่อเปิดเว็บใหม่ ระบบจะเพิ่มคอลัมน์ hash/session ให้อัตโนมัติ
- จากนั้นสมัครด้วย Username และ Email เดิมอีกครั้ง เพื่อแปลง Password เป็น hash
- หน้าเว็บจะแจ้งชัดเจนหากยังเชื่อมกับ Backend เวอร์ชันเก่า

Backend จะเพิ่มคอลัมน์ระบบล็อกอินที่ขาดให้เอง และหน้าเว็บจะตรวจว่า Session
ถูกบันทึกสำเร็จก่อนเปิดหน้าสั่งซื้อ OTP จึงไม่แสดงหน้าแอปแล้วเด้งออกทันที

การเตรียมสินค้าใน Google Sheets
-------------------------------
ชีต Products:
- product_id: รหัสสินค้า เช่น P001
- name: ชื่อสินค้า
- description: รายละเอียด
- category: หมวดหมู่
- price: ราคาขาย
- icon: ชื่อไอคอน Font Awesome เช่น fa-youtube
- logo_url: URL โลโก้ (เว้นว่างได้)
- active: TRUE

ชีต ProductStock:
- stock_id: รหัสสต็อกไม่ซ้ำ
- product_id: ต้องตรงกับ Products
- item_data: โค้ด/ลิงก์/ข้อมูลที่จะส่งให้ลูกค้า
- sold: FALSE
- created_at: วันที่เพิ่ม
- sold_at: เว้นว่าง

ข้อสำคัญ
--------
- ลูกค้าต้องเข้าสู่ระบบที่ index.html เพียงครั้งเดียว หน้าอื่นจะใช้ session เดียวกัน
- ระบบล็อกอินจะตรวจและเพิ่มคอลัมน์ password/session ที่ขาดให้อัตโนมัติ
- รองรับทั้งชีตเดิมที่ใช้คอลัมน์ password และชีตใหม่ที่ใช้ passwordHash
- บัญชีแอดมินต้องมี Username เท่ากับค่า ADMIN_USERNAME และต้องล็อกอินด้วย Password จริง
- ร้านค้าจะไม่อ่านราคาและสต็อกจาก localStorage อีกต่อไป
- ระบบไม่รับรหัสผ่าน Email ของลูกค้า
- ฟังก์ชันขอ OTP ซ้ำถูกปิดไว้จนกว่าจะใส่ endpoint resend ที่ถูกต้องของ SMSPool
