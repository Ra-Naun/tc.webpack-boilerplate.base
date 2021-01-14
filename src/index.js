import * as $ from 'jquery';
import Post from './post';
import './styles/styles.css';
import json from './assets/json.json';
import WP_logo from './assets/webpack-logo.png';
import xmlData from './assets/data.xml';
import csvData from './assets/data.csv';
import './styles/less.less';
import './styles/scss.scss';
import './babel';

const post = new Post('Post Title', WP_logo);

// console.log('post: ', post.toString());
// console.log('json: ', json);
// console.log('xmlData: ', xmlData);
console.log('csvData: ', csvData);

$('pre').html(post.toString());
