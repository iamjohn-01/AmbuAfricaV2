async function adminLogin(){
  const msg=document.getElementById("adminMessage");
  msg.textContent="";
  const email=document.getElementById("adminEmail").value.trim();
  const password=document.getElementById("adminPassword").value;
  if(!email||!password){msg.textContent="Enter your admin credentials.";return;}
  if(!window.supabase){msg.textContent="Supabase authentication is not configured yet.";return;}
  const {data,error}=await window.supabase.auth.signInWithPassword({email,password});
  if(error){msg.textContent=error.message;return;}
  window.location.href="dashboard.html";
}
