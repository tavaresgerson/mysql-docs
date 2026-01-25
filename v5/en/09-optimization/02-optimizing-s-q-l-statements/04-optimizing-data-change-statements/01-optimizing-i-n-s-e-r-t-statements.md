#### 8.2.4.1 Otimizando Instruções INSERT

Para otimizar a velocidade de `INSERT`, combine muitas operações pequenas em uma única operação grande. O ideal é fazer uma única `connection`, enviar os dados para muitas novas linhas de uma só vez e adiar todas as atualizações de `Index` e verificações de consistência para o final.

O tempo necessário para inserir uma linha é determinado pelos seguintes fatores, onde os números indicam proporções aproximadas:

* Conectando: (3)
* Enviando a `Query` para o `server`: (2)
* Fazendo o Parse da `Query`: (2)
* Inserindo a linha: (1 × tamanho da linha)
* Inserindo `Indexes`: (1 × número de `Indexes`)
* Fechando: (1)

Isso não leva em consideração o overhead inicial para abrir tabelas, que é feito uma vez para cada `Query` executada concorrentemente.

O tamanho da tabela diminui a inserção de `Indexes` por log *`N`*, assumindo `Indexes` B-tree.

Você pode usar os seguintes métodos para acelerar as operações de `INSERT`:

* Se você estiver inserindo muitas linhas do mesmo cliente ao mesmo tempo, use instruções `INSERT` com múltiplas listas `VALUES` para inserir várias linhas de uma vez. Isso é consideravelmente mais rápido (muitas vezes mais rápido em alguns casos) do que usar instruções `INSERT` separadas de linha única. Se você estiver adicionando dados a uma tabela não vazia, você pode ajustar a variável `bulk_insert_buffer_size` para tornar a inserção de dados ainda mais rápida. Consulte a Seção 5.1.7, “Variáveis de Sistema do Servidor”.

* Ao carregar uma tabela a partir de um arquivo de texto, use `LOAD DATA`. Isso é geralmente 20 vezes mais rápido do que usar instruções `INSERT`. Consulte a Seção 13.2.6, “Instrução LOAD DATA”.

* Aproveite o fato de que as colunas têm valores `default`. Insira valores explicitamente apenas quando o valor a ser inserido for diferente do `default`. Isso reduz o *parsing* que o MySQL deve fazer e melhora a velocidade de `INSERT`.

* Consulte a Seção 8.5.5, “Carregamento de Dados em Massa para Tabelas InnoDB” para dicas específicas para tabelas `InnoDB`.

* Consulte a Seção 8.6.2, “Carregamento de Dados em Massa para Tabelas MyISAM” para dicas específicas para tabelas `MyISAM`.