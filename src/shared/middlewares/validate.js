// Validasi body, query, dan params dengan schema Zod.
// Hasil yang sudah divalidasi (dan dikonversi tipenya) disimpan di req.validated,
// karena di Express 5 req.query bersifat read-only.
// Contoh: validate({ params: idParam, body: updateSchema })
function validate(schemas) {
  return (req, res, next) => {
    req.validated = {};
    for (const key of ['params', 'query', 'body']) {
      if (schemas[key]) {
        req.validated[key] = schemas[key].parse(req[key] ?? {});
      }
    }
    next();
  };
}

module.exports = validate;
