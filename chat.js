/*
  Food Flow — widget de chat flotante.
  Habla con la función serverless /api/chat (que a su vez consulta a Gemini con la
  llave server-side). Se incluye en las páginas con <script src="chat.js"></script>.
*/
(function () {
  var CSS =
    '.ffc-btn{position:fixed;right:20px;bottom:20px;z-index:1080;width:56px;height:56px;border-radius:50%;' +
    'background:#A44A3F;color:#fff;border:none;font-size:1.5rem;box-shadow:0 6px 18px rgba(110,70,55,.35);cursor:pointer}' +
    '.ffc-btn:hover{background:#8f3f35}' +
    '.ffc-panel{position:fixed;right:20px;bottom:88px;z-index:1080;width:330px;max-width:calc(100vw - 40px);' +
    'height:460px;max-height:calc(100vh - 120px);background:#fff;border-radius:16px;overflow:hidden;display:none;' +
    'flex-direction:column;box-shadow:0 12px 34px rgba(110,70,55,.28);font-family:"Open Sans",system-ui,sans-serif}' +
    '.ffc-panel.open{display:flex}' +
    '.ffc-head{background:#A44A3F;color:#fff;padding:12px 16px;font-family:"Poppins",system-ui,sans-serif;font-weight:600}' +
    '.ffc-head small{display:block;font-weight:400;opacity:.85;font-size:.75rem}' +
    '.ffc-body{flex:1;overflow-y:auto;padding:14px;background:#FAF3EA}' +
    '.ffc-msg{max-width:85%;padding:8px 12px;border-radius:12px;margin-bottom:10px;font-size:.9rem;line-height:1.35}' +
    '.ffc-bot{background:#fff;color:#3a2b26;border:1px solid #eaddcd}' +
    '.ffc-user{background:#E4B363;color:#3a2b26;margin-left:auto}' +
    '.ffc-foot{display:flex;gap:8px;padding:10px;border-top:1px solid #eee;background:#fff}' +
    '.ffc-foot input{flex:1;border:1px solid #ddd;border-radius:10px;padding:8px 10px;font-size:.9rem;outline:none}' +
    '.ffc-foot button{background:#E4B363;color:#3a2b26;border:none;border-radius:10px;padding:8px 12px;font-weight:600;cursor:pointer}';

  var style = document.createElement("style");
  style.textContent = CSS;
  document.head.appendChild(style);

  var wrap = document.createElement("div");
  wrap.innerHTML =
    '<button class="ffc-btn" id="ffcBtn" title="Asistente Food Flow"><i class="bi bi-chat-dots-fill"></i></button>' +
    '<div class="ffc-panel" id="ffcPanel">' +
      '<div class="ffc-head">Asistente Food Flow<small>Pregúntame sobre el menú, envíos o cómo pedir</small></div>' +
      '<div class="ffc-body" id="ffcBody"></div>' +
      '<div class="ffc-foot">' +
        '<input id="ffcInput" placeholder="Escribe tu pregunta..." autocomplete="off">' +
        '<button id="ffcSend">Enviar</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(wrap);

  var panel = document.getElementById("ffcPanel");
  var body = document.getElementById("ffcBody");
  var input = document.getElementById("ffcInput");

  function add(texto, quien) {
    var m = document.createElement("div");
    m.className = "ffc-msg " + (quien === "user" ? "ffc-user" : "ffc-bot");
    m.textContent = texto;
    body.appendChild(m);
    body.scrollTop = body.scrollHeight;
    return m;
  }

  document.getElementById("ffcBtn").addEventListener("click", function () {
    panel.classList.toggle("open");
    if (panel.classList.contains("open") && body.childElementCount === 0) {
      add("¡Hola! Soy el asistente de Food Flow. ¿En qué te ayudo?", "bot");
    }
    if (panel.classList.contains("open")) { input.focus(); }
  });

  async function enviar() {
    var texto = input.value.trim();
    if (!texto) { return; }
    add(texto, "user");
    input.value = "";
    var pensando = add("…", "bot");
    try {
      var r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: texto })
      });
      var data = await r.json();
      pensando.textContent = r.ok ? (data.reply || "…") : ("No pude responder: " + (data.error || ""));
    } catch (e) {
      pensando.textContent = "No pude conectar con el asistente.";
    }
  }

  document.getElementById("ffcSend").addEventListener("click", enviar);
  input.addEventListener("keydown", function (e) { if (e.key === "Enter") { enviar(); } });
})();
