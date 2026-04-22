const res = await fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: "kya mujhe pm kisan yojna mil sakti hai? mera zameen 1 hectare hai.", language: "hi" })
});
console.log(await res.json());
