import pkg from './package.json' assert { type: 'json' };
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import image from '@rollup/plugin-image';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.tsx',
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'esm' },
  ],
  plugins: [
    typescript(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env', '@babel/preset-react'],
    }),
    postcss({
      plugins: [tailwindcss(), autoprefixer()],
      extensions: ['.css'],
      minimize: true,
      inject: {
        insertAt: 'top',
      },
    }),
    image(),
    resolve(),
    commonjs(),
    terser(),
  ],
  external: Object.keys(pkg.peerDependencies),
};
