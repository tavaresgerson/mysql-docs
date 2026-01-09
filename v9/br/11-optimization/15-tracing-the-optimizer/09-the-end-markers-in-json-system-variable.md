### 10.15.9 A variável de sistema marcadores_de_fim_em_json

Ao ler um documento JSON muito grande, pode ser difícil combinar seus colchetes de fechamento e abertura; definir `end_markers_in_json=ON` repete a chave da estrutura, se tiver uma, perto do colchete de fechamento. Esta variável afeta tanto as traças do otimizador quanto a saída do `EXPLAIN FORMAT=JSON`.

Nota

Se `end_markers_in_json` estiver habilitado, a repetição da chave significa que o resultado não é um documento JSON válido e faz com que os analisadores JSON lancem um erro.