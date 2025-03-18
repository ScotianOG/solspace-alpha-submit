import { SolspaceIDL } from '@/types/program';
import fs from 'fs';
import path from 'path';

export function loadSolspaceIDL(): SolspaceIDL {
  const idlPath = path.join(process.cwd(), 'program', 'target', 'idl', 'solspace.json');
  const idlContent = fs.readFileSync(idlPath, 'utf-8');
  return JSON.parse(idlContent) as SolspaceIDL;
}
