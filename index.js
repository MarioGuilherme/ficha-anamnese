const { jsPDF } = window.jspdf;

const calcularIdade = dataNasc => {
  if (!dataNasc) return "";

  const hoje = new Date();
  const nascimento = new Date(dataNasc);

  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();

  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate()))
    idade--;

  return idade >= 0 ? idade : "";
}

document.getElementById("dataNascimento").addEventListener("change", () => {
  const data = document.getElementById("dataNascimento").value;
  const idadeCalc = calcularIdade(data);
  document.getElementById("idade").innerText = idadeCalc;
  salvarFormulario();
});

const writeSection = (doc, title, text, x, y, pageHeight, marginRight) => {
  const lineHeight = 14;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxLineWidth = pageWidth - marginRight - x;

  doc.setFont(undefined, "bold");
  doc.setFontSize(13);
  doc.text(title, x, y);
  y += lineHeight;

  doc.setFont(undefined, "normal");
  doc.setFontSize(11);

  const content = text && text.trim() !== "" ? text : "-";
  const lines = doc.splitTextToSize(content, maxLineWidth);

  for (let line of lines) {
    if (y + lineHeight > pageHeight - 40) {
      doc.addPage();
      y = 40;
    }
    doc.text(line, x, y);
    y += lineHeight;
  }

  y += 10;
  return y;
}

const generatePdf = () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 40;
  const marginRight = 40;
  let y = 50;

  function title(doc, text) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(text, marginLeft, y);
    y += 10;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1);
    doc.line(marginLeft, y, 550, y);
    y += 20;
  }

  // ====== Subtítulo ======
  function sectionHeader(doc, text) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(text, marginLeft, y);
    y += 15;
  }

  // ====== Texto ======
  function writeBlock(doc, txt) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    const lines = doc.splitTextToSize(txt, 550 - marginLeft - marginRight);

    lines.forEach(line => {
      if (y > pageHeight - 60) {
        doc.addPage();
        y = 50;
      }
      doc.text(line, marginLeft + 10, y);
      y += 15;
    });

    y += 10;
  }

  // TITULO PRINCIPAL
  title(doc, "FICHA ANAMNESE");

  // ==================== 1. IDENTIFICAÇÃO ====================
  sectionHeader(doc, "1. Identificação");

  const identificacaoTxt = [
    `Nome: ${nome.value || "Não informado"}`,
    `Data Nasc.: ${dataNascimento?.value.split("-").reverse().join("/") || "Não informado"}`,
    `Idade: ${idade.textContent || "Não informado"}`,
    `Sexo: ${sexo.value || "Não informado"}`,
    `Cor/Etnia: ${cor.value || "Não informado"}`,
    `Estado civil: ${estadoCivil.value || "Não informado"}`,
    `Profissão: ${profissao.value || "Não informado"}`,
    `Naturalidade: ${naturalidade.value || "Não informado"}`,
    `Procedência: ${procedencia.value || "Não informado"}`,
    `Escolaridade: ${escolaridade.value || "Não informado"}`,
    `Religião: ${religiao.value || "Não informado"}`,
    `Data consulta: ${dataConsulta?.value.split("-").reverse().join("/") || "Não informado"}`,
    `Local consulta: ${localConsulta.value || "Não informado"}`,
    `Informante: ${informante.value || "Não informado"}`,
    `Parentesco: ${parentesco.value || "Não informado"}`,
    `Fidedignidade: ${document.querySelector("input[name=fidedigno]:checked")?.value || "Não informado"}`,
  ].join("\n");

  writeBlock(doc, identificacaoTxt);

  // ==================== 2 ====================
  sectionHeader(doc, "2. Queixa Principal (QP)");
  writeBlock(doc, queixaPrincipal.value || "Não informado");

  // ==================== 3 ====================
  sectionHeader(doc, "3. História da Doença Atual (HDA)");
  writeBlock(doc, hdaNarrativa.value || "Não informado");

  // ==================== 4 ====================
  sectionHeader(doc, "4. Interrogatório Sintomatológico");

  const interrogatorioTxt = [
    `Sintomas Gerais: ${sintomasGerais.value || "Não informado"}`,
    `Sistema Cardiovascular: ${sistemaCardiovascular.value || "Não informado"}`,
    `Sistema Respiratório: ${sistemaRespiratorio.value || "Não informado"}`,
    `Sistema Digestório: ${sistemaDigestorio.value || "Não informado"}`,
    `Sistema Geniturinário: ${sistemaGeniturinario.value || "Não informado"}`,
    `Sistema Hematológico: ${sistemaHematologico.value || "Não informado"}`,
    `Sistema Endócrino: ${sistemaEndocrino.value || "Não informado"}`,
    `Sistema Neurológico: ${sistemaNeurologico.value || "Não informado"}`,
    `Sistema Osteoarticular: ${sistemaOsteoarticular.value || "Não informado"}`,
    `Sistema Tegumentar: ${sistemaTegumentar.value || "Não informado"}`,
  ].join("\n");

  writeBlock(doc, interrogatorioTxt);

  // ==================== 5 ====================
  sectionHeader(doc, "5. Antecedentes Pessoais");

  const antecedentesTxt = [
    `Fisiológicos: ${antecedentesFisiologicos.value || "Não informado"}`,
    `Patológicos: ${antecedentesPatologicos.value || "Não informado"}`,
    `Hábitos e Estilo de Vida: ${habitosEstiloVida.value || "Não informado"}`,
    `Ocupacionais: ${antecedentesOcupacionais.value || "Não informado"}`,
    `Gineco-obstétricos: ${antecedentesGineco.value || "Não informado"}`,
  ].join("\n");

  writeBlock(doc, antecedentesTxt);

  // ==================== 6 ====================
  sectionHeader(doc, "6. Antecedentes Familiares");
  writeBlock(doc, antecedentesFamiliares.value || "Não informado");

  // ==================== 7 ====================
  sectionHeader(doc, "7. Condições Socioeconômicas e Ambientais");
  writeBlock(doc, condicoesSociais.value || "Não informado");

  // ==================== 8 ====================
  sectionHeader(doc, "8. Aspectos Psicossociais");
  writeBlock(doc, aspectosPsicossociais.value || "Não informado");

  // ==================== 9 ====================
  sectionHeader(doc, "9. Conclusão da Anamnese");
  writeBlock(doc, conclusaoAnamnese.value || "Não informado");

  // Salvar
  const nomeArquivo = (nome.value || "paciente")
    .replace(/\s+/g, "_")
    .replace(/[^\w_]/g, "");

  doc.save(`FichaAnamnese_${nomeArquivo}_${Date.now()}.pdf`);
};

const salvarFormulario = () => {
  const formData = {};
  const elementos = document.querySelectorAll("input, select, textarea");

  elementos.forEach(el => {
    const key = el.id || el.name;
    if (!key) return;

    if (el.type === "radio") {
      if (el.checked) formData[key] = el.value;
    } else if (el.type === "checkbox") {
      formData[key] = el.checked;
    } else {
      formData[key] = el.value || null;
    }
  });

  localStorage.setItem("anamneseFormData", JSON.stringify(formData));
}

const limparDados = async () => {
  const { isConfirmed } = await Swal.fire({
    title: "Tem certeza?",
    text: "Isso limpará todos os campos da ficha?",
    icon: "question",
    showDenyButton: true,
    confirmButtonText: "Sim, limpar",
    denyButtonText: "Não, manter campos"
  });

  if (!isConfirmed) return;

  localStorage.removeItem("anamneseFormData");
  location.reload();
}

const restaurarFormulario = () => {
  const saved = localStorage.getItem("anamneseFormData");
  if (!saved) return;

  const formData = JSON.parse(saved);
  const elementos = document.querySelectorAll("input, select, textarea");

  elementos.forEach(el => {
    const key = el.id || el.name;
    if (!key || !(key in formData)) return;

    if (el.type === "radio")
      el.checked = formData[key] === el.value;
    else if (el.type === "checkbox")
      el.checked = !!formData[key];
    else
      el.value = formData[key] || null;
  });

  const data = document.getElementById("dataNascimento").value;
  document.getElementById("idade").innerText = calcularIdade(data);
}

const mockarDados = () => {
  const exemplo = {
    nome: "João da Silva",
    dataNascimento: "1985-04-12",
    sexo: "Masculino",
    cor: "Parda",
    estadoCivil: "Casado(a)",
    profissao: "Motorista de aplicativo",
    naturalidade: "Campinas - SP",
    procedencia: "São Paulo - SP",
    escolaridade: "Médio completo",
    religiao: "Católica",
    dataConsulta: "2025-11-12",
    localConsulta: "Clínica Vida Plena",
    informante: "Maria da Silva",
    parentesco: "Esposa",
    fidedignidade: "Fidedigno",
    queixaPrincipal: "“Dor no peito há dois dias.”",
    hdaNarrativa: "Paciente refere dor torácica iniciada há 48h, em aperto, irradiando para o braço esquerdo, associada a sudorese e leve dispneia. Sem febre. Refere melhora parcial com repouso e uso de analgésico comum. Nega traumas recentes. Sono e apetite preservados.",
    sintomasGerais: "Relata fadiga leve e sudorese noturna; nega febre, perda de peso ou alterações do sono.",
    sistemaCardiovascular: "Dor torácica em aperto, palpitações ocasionais, dispneia aos esforços moderados.",
    sistemaRespiratorio: "Nega tosse, chiado ou expectoração.",
    sistemaDigestorio: "Apresenta leve náusea ocasional; nega vômitos ou diarreia.",
    sistemaGeniturinario: "Micções normais; sem disúria, hematúria ou urgência.",
    sistemaHematologico: "Sem sangramentos, equimoses ou linfonodos palpáveis.",
    sistemaEndocrino: "Nega alterações de peso recentes; sudorese leve.",
    sistemaNeurologico: "Nega cefaleia, tontura ou parestesia; relata cansaço ocasional.",
    sistemaOsteoarticular: "Nega dor articular ou rigidez matinal.",
    sistemaTegumentar: "Sem lesões cutâneas aparentes.",
    antecedentesFisiologicos: "Nascimento a termo, vacinação em dia, menarca aos 12 anos, sono e apetite preservados.",
    antecedentesPatologicos: "Hipertensão arterial diagnosticada há 5 anos; cirurgia de apendicectomia aos 20 anos.",
    habitosEstiloVida: "Ex-tabagista (10 maços/ano), etilismo social, sem uso de drogas. Caminhada 3x por semana.",
    antecedentesOcupacionais: "Trabalha 10h/dia dirigindo. Relata estresse e dor lombar ocasional.",
    antecedentesGineco: "N/A - paciente masculino.",
    antecedentesFamiliares: "Pai falecido por infarto aos 68 anos. Mãe com diabetes tipo 2. Irmã com hipotireoidismo.",
    condicoesSociais: "Reside em casa própria com esposa e dois filhos. Boa ventilação e saneamento básico completo.",
    aspectosPsicossociais: "Relata boa relação familiar e suporte social. Estresse moderado devido ao trabalho.",
    conclusaoAnamnese: "Quadro sugestivo de síndrome coronariana aguda. Solicitar ECG e troponina. Encaminhar para avaliação cardiológica."
  };

  // Preenche os campos
  Object.keys(exemplo).forEach(key => {
    const el = document.getElementById(key);
    if (!el) return;

    if (el.type === "radio" || el.type === "checkbox") {
      el.checked = !!exemplo[key];
    } else {
      el.value = exemplo[key];
    }
  });

  document.getElementById(exemplo.fidedignidade === "Fidedigno" ? "fid1" : "fid2").checked = true;

  const data = document.getElementById("dataNascimento").value;
  const idadeCalc = calcularIdade(data);
  document.getElementById("idade").innerText = idadeCalc;

  salvarFormulario();
}

document.addEventListener("input", salvarFormulario);
document.addEventListener("change", salvarFormulario);

window.addEventListener("DOMContentLoaded", restaurarFormulario);
