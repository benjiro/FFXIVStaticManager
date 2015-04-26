// Definition of mongodb database location for different working environments
module.exports = {
  'secret': 'wellmightneedtochangethis',
  'db': 'mongodb://localhost/prod',
  'port': process.env.PORT || 3000
};
