const validateQuery = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.query);

  if (!error) {
    next();
  } else {
    res.status(400).json(error.message);
  }
};

const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (!error) {
    next();
  } else {
    res.status(400).json(error.message);
  }
};

module.exports = { validateQuery, validateBody };
