import {EditorOptionsType} from '../types/common';

export const EDITOR_DEFAULT_OPTIONS: EditorOptionsType = {
  scrollBeyondLastColumn: 0,
  codeLens: false,
  minimap: {
    enabled: false,
  },
  quickSuggestions: false,
  folding: false,
  foldingHighlight: false,
  foldingImportsByDefault: false,
  links: false,
  fontSize: 14,
  wordWrap: 'on',
  automaticLayout: true,
};
