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
- บัญชีแอดมินต้องมี Username เท่ากับค่า ADMIN_USERNAME และต้องล็อกอินด้วย Password จริง
- ร้านค้าจะไม่อ่านราคาและสต็อกจาก localStorage อีกต่อไป
- ระบบไม่รับรหัสผ่าน Email ของลูกค้า
- ฟังก์ชันขอ OTP ซ้ำถูกปิดไว้จนกว่าจะใส่ endpoint resend ที่ถูกต้องของ SMSPool
