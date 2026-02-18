const reiResponses = {
  greeting: [
    "Hola.",
    "Estoy aquí.",
    "¿Me necesitas?"
  ],
  neutral: [
    "Entendido.",
    "Procesando.",
    "De acuerdo."
  ],
  error: [
    "Algo falló.",
    "No fue suficiente."
  ]
};

function getReiResponse(type) {
  const responses = reiResponses[type] || reiResponses.neutral;
  return responses[Math.floor(Math.random() * responses.length)];
}

module.exports = { getReiResponse };
