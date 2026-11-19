/* ========== الإعدادات والمنتجات — عدّل من هنا فقط ========== */
window.HAAJA_CONFIG = {
  whatsapp: "201000000000",      // رقم الواتساب بصيغة دولية بدون + (مثال: 2010xxxxxxxx)
  phone: "+20 100 000 0000",
  address: "المنصورة، الدقهلية، مصر",
  mapsUrl: "https://maps.google.com/?q=Mansoura",
  facebook: "#",
  instagram: "#",
  tiktok: "#",
  deliveryFee: 30,               // رسوم التوصيل بالجنيه
  freeDeliveryFrom: 500,         // توصيل مجاني لو الطلب أكبر من
  tablesCount: 20,               // عدد الترابيزات
  currency: "ج.م",
  hours: "يوميًا من 10 صباحًا حتى 2 بعد منتصف الليل"
};

window.HAAJA_CATEGORIES = [
  { id: "cold",   name: "مشروبات باردة", icon: "🧋" },
  { id: "frappe", name: "فرابيه",        icon: "🥤" },
  { id: "hot",    name: "مشروبات ساخنة", icon: "☕" },
  { id: "bakery", name: "مخبوزات",       icon: "🥐" },
  { id: "dessert",name: "حلويات",        icon: "🍰" },
  { id: "choc",   name: "شوكولاتة",      icon: "🍫" },
  { id: "nuts",   name: "مكسرات",        icon: "🥜" }
];

/* img = اسم الصورة داخل assets/img — pos = مكان القص — emoji = بديل لو مفيش صورة */
window.HAAJA_PRODUCTS = [
  // --- باردة
  { id:"c1", cat:"cold", name:"آيسد كراميل ماكياتو", desc:"إسبريسو وحليب وصوص كراميل مع كريمة خفيفة", price:95,  img:"4.jpeg", pos:"50% 35%", tag:"الأكثر طلبًا" },
  { id:"c2", cat:"cold", name:"ماتشا لاتيه", desc:"ماتشا يابانية فاخرة مع حليب بارد وثلج", price:90, img:"2.jpeg", pos:"40% 25%", tag:"جديد" },
  { id:"c3", cat:"cold", name:"آيسد سبانيش لاتيه", desc:"قهوة مثلجة بحليب مكثف حلو وقوام كريمي", price:85, img:"6.jpeg", pos:"25% 55%" },
  { id:"c4", cat:"cold", name:"آيسد موكا", desc:"قهوة وشوكولاتة داكنة وحليب بارد", price:85, emoji:"🧊" },
  { id:"c5", cat:"cold", name:"ماتشا بالقهوة", desc:"طبقتين: ماتشا وإسبريسو في كوب واحد", price:98, img:"2.jpeg", pos:"60% 80%" },
  // --- فرابيه
  { id:"f1", cat:"frappe", name:"فرابيه فراولة", desc:"فراولة طبيعية وكريمة مخفوقة", price:95, img:"3.jpeg", pos:"65% 12%" },
  { id:"f2", cat:"frappe", name:"فرابيه موكا", desc:"شوكولاتة وقهوة وقطع أوريو", price:95, img:"3.jpeg", pos:"25% 40%" },
  { id:"f3", cat:"frappe", name:"فرابيه كراميل", desc:"كراميل مملح ومكسرات مجروشة", price:95, img:"3.jpeg", pos:"70% 66%", tag:"مميز" },
  { id:"f4", cat:"frappe", name:"فرابيه شوكولاتة", desc:"شوكولاتة بلجيكية وصوص نوتيلا", price:100, img:"3.jpeg", pos:"35% 92%" },
  // --- ساخنة
  { id:"h1", cat:"hot", name:"إسبريسو", desc:"شوت مركّز من بن مختار", price:45, emoji:"☕" },
  { id:"h2", cat:"hot", name:"كابتشينو", desc:"إسبريسو مع رغوة حليب مخملية", price:65, emoji:"☕" },
  { id:"h3", cat:"hot", name:"فلات وايت", desc:"قهوة قوية بحليب ناعم", price:70, emoji:"☕" },
  { id:"h4", cat:"hot", name:"قهوة تركي بالبندق", desc:"قهوة تركي بنكهة البندق المحمص", price:55, emoji:"🫖" },
  { id:"h5", cat:"hot", name:"هوت شوكولاتة", desc:"شوكولاتة ساخنة غنية بالمارشميلو", price:75, emoji:"🍫" },
  { id:"h6", cat:"hot", name:"شاي كرك", desc:"شاي بالتوابل والحليب", price:40, emoji:"🍵" },
  // --- مخبوزات
  { id:"b1", cat:"bakery", name:"كرواسون سادة", desc:"طبقات زبدة هشة تتخبز كل ساعة", price:55, img:"6.jpeg", pos:"75% 78%" },
  { id:"b2", cat:"bakery", name:"كرواسون شوكولاتة", desc:"محشي شوكولاتة داكنة", price:65, img:"6.jpeg", pos:"72% 74%" },
  { id:"b3", cat:"bakery", name:"كرواسون لوتس", desc:"كريمة لوتس وبسكويت مفتت", price:70, emoji:"🥐" },
  { id:"b4", cat:"bakery", name:"دانش بالجبنة", desc:"عجينة مورّقة مع كريمة جبنة", price:60, emoji:"🥮" },
  // --- حلويات
  { id:"d1", cat:"dessert", name:"تشيز كيك فراولة", desc:"قاعدة بسكويت وتوب فراولة طازجة", price:110, emoji:"🍰" },
  { id:"d2", cat:"dessert", name:"تيراميسو", desc:"طبقات ماسكاربوني وقهوة وكاكاو", price:105, emoji:"🍮" },
  { id:"d3", cat:"dessert", name:"براونيز بالمكسرات", desc:"براونيز طرية مع جوز وبندق", price:80, emoji:"🧁" },
  { id:"d4", cat:"dessert", name:"وافل نوتيلا", desc:"وافل مقرمش مع نوتيلا وموز", price:120, emoji:"🧇" },
  { id:"d5", cat:"dessert", name:"لافا كيك", desc:"قلب شوكولاتة سايح مع آيس كريم", price:95, emoji:"🎂" },
  // --- شوكولاتة
  { id:"s1", cat:"choc", name:"بوكس شوكولاتة فاخر", desc:"12 قطعة مشكلة بحشوات مختلفة", price:250, emoji:"🎁" },
  { id:"s2", cat:"choc", name:"ترافل بندق", desc:"150 جم ترافل بحشوة البندق", price:180, emoji:"🍫" },
  { id:"s3", cat:"choc", name:"شوكولاتة دبي", desc:"فستق وكنافة مقرمشة بالشوكولاتة", price:220, emoji:"🍫", tag:"ترند" },
  // --- مكسرات (سعر الربع كيلو)
  { id:"n1", cat:"nuts", name:"لوز محمص", desc:"ربع كيلو — محمص طازج", price:140, img:"1.jpeg", pos:"50% 30%" },
  { id:"n2", cat:"nuts", name:"فستق", desc:"ربع كيلو — فستق حلبي مملح خفيف", price:260, img:"1.jpeg", pos:"50% 62%", tag:"فاخر" },
  { id:"n3", cat:"nuts", name:"كاجو", desc:"ربع كيلو — كاجو كامل ذهبي", price:200, img:"1.jpeg", pos:"45% 95%" },
  { id:"n4", cat:"nuts", name:"جوز عين جمل", desc:"ربع كيلو — جوز وبيكان", price:150, img:"1.jpeg", pos:"5% 98%" },
  { id:"n5", cat:"nuts", name:"ماكاداميا", desc:"ربع كيلو — ماكاداميا فاخرة", price:300, img:"1.jpeg", pos:"95% 98%" },
  { id:"n6", cat:"nuts", name:"ميكس الحاجة", desc:"ربع كيلو — تشكيلة مكسرات خاصة", price:220, img:"1.jpeg", pos:"60% 5%", tag:"الأفضل" }
];
