document.addEventListener("DOMContentLoaded", () => {

    // ============================
    // ELEMENTOS
    // ============================

    const canvas = document.getElementById("sig");
    const agree = document.getElementById("agree");

    const btnClear = document.getElementById("clear");
    const btnAccept = document.getElementById("ok");
    const btnDeny = document.getElementById("no");
    const btnSend = document.getElementById("send");

    const suggestion = document.getElementById("sug");
    const message = document.getElementById("msg");

    // ============================
    // ASSINATURA
    // ============================

    function resizeCanvas() {

        // guarda o desenho atual antes de redimensionar, pra não perder
        // a assinatura quando o teclado do celular abre/fecha e dispara "resize"
        const desenhoAtual = (typeof signature !== "undefined" && !signature.isEmpty())
            ? signature.toData()
            : null;

        const ratio = Math.max(window.devicePixelRatio || 1, 1);

        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = 220 * ratio;

        canvas.getContext("2d").scale(ratio, ratio);

        signature.clear();

        if (desenhoAtual) {
            signature.fromData(desenhoAtual);
        }

    }

    const signature = new SignaturePad(canvas, {

        backgroundColor: "rgb(255,255,255)",

        penColor: "rgb(30,30,30)"

    });

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    // Bloqueia o "puxar a página" no Safari/iOS e Chrome/Android
    // enquanto o dedo está desenhando dentro do canvas.
    canvas.addEventListener("touchstart", (e) => e.preventDefault(), { passive: false });
    canvas.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });

    // ============================
    // LIMPAR ASSINATURA
    // ============================

    btnClear.addEventListener("click", () => {

        signature.clear();

    });

    // ============================
    // ASSINAR
    // ============================

    btnAccept.addEventListener("click", () => {

        if (!agree.checked) {

            alert("Antes de assinar, confirme que concorda com o acordo.");

            return;

        }

        if (signature.isEmpty()) {

            alert("Por favor, faça sua assinatura.");

            return;

        }

        const agora = new Date();

        message.style.display = "block";

        message.innerHTML = `
            <h3>✔ Documento assinado com sucesso</h3>

            <p><strong>Data:</strong> ${agora.toLocaleDateString()}</p>

            <p><strong>Hora:</strong> ${agora.toLocaleTimeString()}</p>

            <p><strong>Status:</strong> Acordo em vigor.</p>

            <p>🐈 Calleri aprovou este documento.</p>

            <p style="margin-top:12px;">📥 A imagem da sua assinatura foi baixada. Anexe-a no e-mail que vai abrir em seguida antes de enviar.</p>
        `;

        window.scrollTo({

            top: document.body.scrollHeight,

            behavior: "smooth"

        });

        // ============================
        // BAIXA A ASSINATURA COMO PNG
        // ============================
        // (o mailto: não consegue anexar arquivos sozinho, então
        // baixamos a imagem pra pessoa anexar manualmente no e-mail)

        const imagemAssinatura = signature.toDataURL("image/png");

        const linkDownload = document.createElement("a");
        linkDownload.href = imagemAssinatura;
        linkDownload.download = "assinatura-acordo-financeiro.png";
        document.body.appendChild(linkDownload);
        linkDownload.click();
        document.body.removeChild(linkDownload);

        // ============================
        // ABRE O E-MAIL JÁ PREENCHIDO
        // ============================

        const destinatario = "victoralvesmv@hotmail.com";

        const assunto = encodeURIComponent(
            "Acordo Particular de Saúde Financeira - Assinado"
        );

        const corpo = encodeURIComponent(
`Acordo Particular de Saúde Financeira assinado digitalmente.

Data: ${agora.toLocaleDateString()}
Hora: ${agora.toLocaleTimeString()}
Status: Acordo em vigor.

IMPORTANTE: anexe a imagem "assinatura-acordo-financeiro.png" que acabou de ser baixada, antes de enviar este e-mail.

🐈 Calleri aprovou este documento.`
        );

        setTimeout(() => {

            window.location.href =
                `mailto:${destinatario}?subject=${assunto}&body=${corpo}`;

        }, 500);

    });

    // ============================
    // BOTÃO NÃO ACEITO
    // ============================

    const respostas = [

        "🐈 Calleri não aprovou essa decisão.",

        "😅 Boa tentativa...",

        "📄 O departamento financeiro recusou sua solicitação.",

        "💸 Essa opção está acima do orçamento.",

        "🤨 Tem certeza mesmo?",

        "❤️ Esse botão existe apenas por motivos decorativos.",

        "📈 Seu score de aprovação caiu 2 pontos.",

        "😂 Você realmente achou que conseguiria clicar?",

        "⚠ Opção indisponível no momento.",

        "🐈 Calleri apertou 'Aceito' antes de você."

    ];

    let tentativa = 0;

    function moverBotao() {

        const x = (Math.random() * 160) - 80;

        const y = (Math.random() * 40) - 20;

        btnDeny.style.transform = `translate(${x}px, ${y}px)`;

        alert(respostas[tentativa % respostas.length]);

        tentativa++;

    }

    // Desktop

    btnDeny.addEventListener("mouseenter", moverBotao);

    // Mobile

    btnDeny.addEventListener("touchstart", (e) => {

        e.preventDefault();

        moverBotao();

    }, {

        passive: false

    });

    // ============================
    // SUGESTÃO
    // ============================

    btnSend.addEventListener("click", () => {

        const texto = suggestion.value.trim();

        if (texto.length < 5) {

            alert("Escreva uma sugestão antes de enviar.");

            return;

        }

        const destinatario = "victoralvesmv@hotmail.com";

        const assunto = encodeURIComponent(

            "Solicitação de Revisão Contratual"

        );

        const corpo = encodeURIComponent(texto);

        window.location.href =

            `mailto:${destinatario}?subject=${assunto}&body=${corpo}`;

    });

});
