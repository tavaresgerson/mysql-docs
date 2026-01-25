### 8.15.9 A Variável de Sistema end_markers_in_json

Ao ler um documento JSON muito grande, pode ser difícil parear seu colchete de fechamento com os colchetes de abertura; definir `end_markers_in_json=ON` repete a chave da estrutura, se houver uma, perto do colchete de fechamento. Esta variável afeta tanto os *traces* do otimizador quanto a saída de `EXPLAIN FORMAT=JSON`.

Nota

Se `end_markers_in_json` estiver habilitada, a repetição da chave significa que o resultado não é um documento JSON válido e faz com que os *parsers* JSON lancem um erro.