// ---------- Product Data ----------
const PRODUCTS = [
  {id:1, name:"Milton Water Bottle 1L", price:299, tag:"kitchen", img:"https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=250&fit=crop"},
  {id:2, name:"Slim Fit Jeans", price:899, tag:"fashion", img:"https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=250&fit=crop"},
  {id:3, name:"Ceramic Flower Pot Set", price:499, tag:"home", img:"https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=250&fit=crop"},
  {id:4, name:"Basmati Rice 5kg", price:399, tag:"grocery", img:"https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=250&fit=crop"},
  {id:5, name:"Non-Stick Tawa 28cm", price:599, tag:"kitchen", img:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=250&fit=crop"},
  {id:6, name:"Cotton Bedsheet Set", price:1299, tag:"home", img:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=250&fit=crop"},
  {id:7, name:"Plastic Storage Box Set", price:799, tag:"home", img:"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop"},
  {id:8, name:"Stainless Steel Lunch Box", price:449, tag:"kitchen", img:"https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop"},
  {id:9, name:"Hair Dryer 2000W", price:1199, tag:"appliances", img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=250&fit=crop"},
  {id:10, name:"Wireless Mouse", price:599, tag:"electronics", img:"https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=250&fit=crop"},
  {id:11, name:"Yoga Mat 6mm", price:699, tag:"fitness", img:"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop"},
  {id:12, name:"Wall Clock Round", price:349, tag:"home", img:"https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&h=250&fit=crop"},
];


// ---------- State ----------
const state = {
  cart: JSON.parse(localStorage.getItem("cart") || "[]"),
  step: "cart", // cart | payment | receipt
  theme: "dark",
  coupon: "",
  name: "",
  email: ""
};

// ---------- Helpers ----------
const el = id => document.getElementById(id);
const formatINR = v => "₹" + v.toFixed(2);
const saveCart = () => localStorage.setItem("cart", JSON.stringify(state.cart));
const toast = (msg) => {
  const t = el("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(()=> t.classList.remove("show"), 1600);
};
const setSteps = () => {
  el("stepCart").classList.toggle("active", state.step==="cart");
  el("stepPayment").classList.toggle("active", state.step==="payment");
  el("stepReceipt").classList.toggle("active", state.step==="receipt");
};

// ---------- Render Products ----------
function renderProducts(filter=""){
  const grid = el("productGrid");
  const q = filter.trim().toLowerCase();
  const list = PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q));
  grid.innerHTML = list.map(p => `
    <div class="card">
      <div class="thumb">
        <img src="${p.img}" alt="${p.name}" onerror="this.onerror=null; this.src='https://via.placeholder.com/400x250?text=No+Image'">
      </div>
      <div class="card-body">
        <div class="title">${p.name}</div>
        <div class="muted">Category: ${p.tag}</div>
        <div class="row">
          <div class="price">${formatINR(p.price)}</div>
          <button class="btn btn-cart" onclick="addToCart(${p.id})"><i class="fa fa-plus"></i> Add</button>
        </div>
      </div>
    </div>
  `).join("");
}

// ---------- Cart Logic ----------
function addToCart(id){
  const item = PRODUCTS.find(p => p.id===id);
  const existing = state.cart.find(c => c.id===id);
  if(existing){ existing.qty += 1; }
  else{ state.cart.push({ id:item.id, name:item.name, price:item.price, qty:1 }); }
  saveCart(); renderCart(); toast(`${item.name} added to cart`);
}
function removeFromCart(id){
  state.cart = state.cart.filter(c => c.id!==id);
  saveCart(); renderCart(); toast("Item removed");
}
function changeQty(id, delta){
  const item = state.cart.find(c => c.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty<=0){ removeFromCart(id); return; }
  saveCart(); renderCart();
}
function cartTotal(){
  return state.cart.reduce((sum, c)=> sum + c.price*c.qty, 0);
}
function renderCart(){
  const items = el("cartItems");
  if(state.cart.length===0){
    items.innerHTML = `<div class="muted">Your cart is empty.</div>`;
  } else {
    items.innerHTML = state.cart.map(c => `
      <div class="cart-item">
        <div>
          <div><strong>${c.name}</strong></div>
          <div class="muted">₹${c.price} each</div>
        </div>
        <div class="qty">
          <button class="btn btn-ghost" onclick="changeQty(${c.id}, -1)">−</button>
          <div><strong>${c.qty}</strong></div>
          <button class="btn btn-ghost" onclick="changeQty(${c.id}, 1)">+</button>
        </div>
        <div><strong>${formatINR(c.price*c.qty)}</strong></div>
        <div><button class="btn btn-danger" onclick="removeFromCart(${c.id})"><i class="fa fa-trash"></i></button></div>
      </div>
    `).join("");
  }
  el("cartTotal").textContent = formatINR(cartTotal());
}

// ---------- Sidebar ----------
function openCart(){ el("cartSidebar").classList.add("open"); }
function closeCart(){ el("cartSidebar").classList.remove("open"); }

// ---------- Checkout Flow ----------
function proceedToPayment(){
  if(state.cart.length===0){ toast("Add items before checkout"); return; }
  state.step = "payment"; setSteps(); openCart();
  showPaymentSection();
}
function showPaymentSection(){
  el("paymentSection").classList.remove("hidden");
  el("receiptSection").classList.add("hidden");
  updatePaymentSummary();
}
function backToCart(){
  state.step="cart"; setSteps();
  el("paymentSection").classList.add("hidden");
  el("receiptSection").classList.add("hidden");
  renderCart();
}
function updatePaymentSummary(){
  const subtotal = cartTotal();
  const coupon = state.coupon.trim().toLowerCase();
  let discount = 0;
  if(coupon==="save10") discount = subtotal*0.10;
  if(coupon==="indore5") discount = subtotal*0.05;
  const payable = subtotal - discount;
  el("subtotalText").textContent = formatINR(subtotal);
  el("discountText").textContent = formatINR(discount);
  el("payableText").textContent = formatINR(payable);
}
function pay(){
  const name = el("nameInput").value.trim();
  const email = el("emailInput").value.trim();
  state.coupon = el("couponInput").value.trim();
  if(!name || !email){ toast("Enter name and email"); return; }
  state.name = name; state.email = email;

  toast("Processing payment…");
  setTimeout(()=>{
    toast("Payment successful");
    state.step = "receipt"; setSteps();
    showReceipt();
    generatePDFReceipt();
    generateQR();
  }, 800);
}
function showReceipt(){
  el("paymentSection").classList.add("hidden");
  el("receiptSection").classList.remove("hidden");
}
function newOrder(){
  state.cart = []; saveCart();
  state.coupon = ""; state.name = ""; state.email = "";
  state.step="cart"; setSteps();
  el("receiptSection").classList.add("hidden");
  el("paymentSection").classList.add("hidden");
  renderCart(); closeCart();
}

// ---------- Receipt: PDF + QR ----------
function generatePDFReceipt(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const total = cartTotal();
  const coupon = state.coupon.trim().toLowerCase();
  let discount = 0;
  if(coupon==="save10") discount = total*0.10;
  if(coupon==="indore5") discount = total*0.05;
  const payable = total - discount;
  const date = new Date().toLocaleString();

  doc.setFontSize(14);
  doc.text('Smart Self‑Checkout Receipt', 20, 20);
  doc.setFontSize(10);
  doc.text(`Date: ${date}`, 20, 28);
  doc.text(`Customer: ${state.name}`, 20, 34);
  doc.text(`Email: ${state.email}`, 20, 40);

  let y = 50;
  doc.text('Items:', 20, y); y += 6;
  state.cart.forEach(i => {
    doc.text(`${i.name} x${i.qty} — ₹${(i.price*i.qty).toFixed(2)}`, 24, y);
    y += 6;
  });
  y += 4;
  doc.text(`Subtotal: ₹${total.toFixed(2)}`, 20, y); y+=6;
  doc.text(`Discount: ₹${discount.toFixed(2)}`, 20, y); y+=6;
  doc.text(`Payable: ₹${payable.toFixed(2)}`, 20, y);

  doc.save('receipt.pdf');
}
function generateQR(){
  const total = cartTotal();
  const coupon = state.coupon.trim().toLowerCase();
  let discount = 0;
  if(coupon==="save10") discount = total*0.10;
  if(coupon==="indore5") discount = total*0.05;
  const payable = total - discount;
  const date = new Date().toLocaleString();
  const summary = `Name:${state.name}|Email:${state.email}|Total:${payable}|Date:${date}`;

  const qrDiv = el("qrcode");
  qrDiv.innerHTML = "";
  // Create canvas via QRCode lib and append
  const canvas = document.createElement('canvas');
  QRCode.toCanvas(canvas, summary, { width: 160 }, function(err){
    if(err){ console.error(err); return; }
    qrDiv.appendChild(canvas);
  });
}

// ---------- Scanner ----------
function openScanner(){ el("scannerModal").classList.remove("hidden"); }
function closeScanner(){ el("scannerModal").classList.add("hidden"); }
function scan(){
  const code = el("scannerInput").value.trim().toLowerCase();
  if(!code){ toast("Enter a code"); return; }
  const match = PRODUCTS.find(p => p.name.toLowerCase().includes(code) || p.tag.toLowerCase().includes(code));
  if(match){ addToCart(match.id); openCart(); closeScanner(); }
  else toast("No product matched");
  el("scannerInput").value = "";
}

// ---------- Theme ----------
function toggleTheme(){
  if(state.theme==="dark"){
    document.documentElement.style.setProperty('--bg','#f7f9fc');
    document.documentElement.style.setProperty('--card','#ffffff');
    document.documentElement.style.setProperty('--text','#0e141b');
    document.documentElement.style.setProperty('--muted','#4b5a6a');
    document.documentElement.style.setProperty('--border','#e6ebf2');
    state.theme="light";
  } else {
    document.documentElement.style.setProperty('--bg','#0f1216');
    document.documentElement.style.setProperty('--card','#171b22');
    document.documentElement.style.setProperty('--text','#e8edf3');
    document.documentElement.style.setProperty('--muted','#a9b4c0');
    document.documentElement.style.setProperty('--border','#232832');
    state.theme="dark";
  }
}

// ---------- Events ----------
el("searchInput").addEventListener("input", e => renderProducts(e.target.value));
el("openCart").addEventListener("click", openCart);
el("closeCart").addEventListener("click", closeCart);
el("checkoutBtn").addEventListener("click", proceedToPayment);
el("toggleTheme").addEventListener("click", toggleTheme);
el("resetCart").addEventListener("click", () => { state.cart=[]; saveCart(); renderCart(); toast("Cart reset"); });

el("payBtn").addEventListener("click", pay);
el("backToCartBtn").addEventListener("click", backToCart);
el("newOrderBtn").addEventListener("click", newOrder);

el("openScanner").addEventListener("click", openScanner);
el("closeScanner").addEventListener("click", closeScanner);
el("scanBtn").addEventListener("click", scan);

// ---------- Init ----------
renderProducts();
renderCart();
setSteps();

// Expose for inline handlers
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.changeQty = changeQty;
