### 8.15.9 A variável de sistema end\_markers\_in\_json

Ao ler um documento JSON muito grande, pode ser difícil alinhar os colchetes de fechamento e de abertura; definir `end_markers_in_json=ON` repete a chave da estrutura, se houver, perto do colchete de fechamento. Essa variável afeta tanto as traças do otimizador quanto a saída do `EXPLAIN FORMAT=JSON`.

Nota

Se `end_markers_in_json` estiver ativado, a repetição da chave significa que o resultado não é um documento JSON válido e faz com que os analisadores de JSON lancem um erro.
