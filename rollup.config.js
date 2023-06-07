// import pkg from './package.json' assert { type: 'json' };
// import babel from '@rollup/plugin-babel';
// import resolve from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';
// import terser from '@rollup/plugin-terser';

// export default {
//   input: 'src/index.jsx',
//   output: [
//     {
//       file: 'dist/index.js',
//       format: 'es',
//       exports: 'named',
//       sourcemap: true,
//       strict: false,
//     },
//     { file: pkg.main, format: 'cjs' },
//     { file: pkg.module, format: 'esm' },
//   ],
//   plugins: [
//     babel({
//       babelHelpers: 'bundled',
//       exclude: 'node_modules/**',
//       presets: ['@babel/preset-env', '@babel/preset-react'],
//     }),
//     resolve(),
//     commonjs(),
//     terser(),
//   ],
//   external: Object.keys(pkg.peerDependencies),
// };

// // import babel from '@rollup/plugin-babel';

// // module.exports = {
// //   input: 'src/index.jsx',
// //   output: [
// //     {
// //       file: 'dist/index.js',
// //       format: 'es',
// //       exports: 'named',
// //       sourcemap: true,
// //       strict: false,
// //     },
// //   ],
// //   plugins: [
// //     babel({
// //       exclude: 'node_modules/**',
// //       babelHelpers: 'bundled',
// //       // if you are using React:
// //       presets: ['@babel/preset-react'],
// //     }),
// //     //   sass({ insert: true }),
// //     //   typescript({ objectHashIgnoreUnknownHack: true })
// //   ],
// //   external: ['react', 'react-dom'],
// // };

import pkg from './package.json' assert { type: 'json' };
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.jsx',
  output: [
    {
      file: 'dist/index.js',
      format: 'es',
      exports: 'named',
      sourcemap: true,
      strict: false,
    },
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'esm' },
  ],
  plugins: [
    postcss({
      extensions: ['.css'],
      inject: true,
      autoModules: true,
      plugins: [],
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env', '@babel/preset-react'],
    }),
    resolve(),
    commonjs(),
    terser(),
  ],
  external: Object.keys(pkg.peerDependencies),
};
