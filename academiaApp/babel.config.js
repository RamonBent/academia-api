module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
<<<<<<< HEAD
=======
    plugins: [require.resolve('expo-router/babel')],
>>>>>>> origin/tela-de-exercicios
  };
};
