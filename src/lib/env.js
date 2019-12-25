import fs from 'fs';
import yaml from 'yaml';

const file = fs.readFileSync('../env.yaml', 'utf8');
if (!file) throw new Error('Cannot compile: missing env.yaml config file.');
export const data = YAML.parse(file);