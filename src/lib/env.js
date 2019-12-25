import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

const filePath = path.resolve(__dirname, '../../env.yaml');
const file = fs.readFileSync(filePath, 'utf8');
if (!file) throw new Error('Cannot compile: missing env.yaml config file.');
const { env_variables } = YAML.parse(file);

export default env_variables;