#### 10.2.5.1 Otimizando as instruções `INSERT`

Para otimizar a velocidade de inserção, combine muitas operações pequenas em uma única operação grande. Idealmente, faça uma única conexão, envie os dados para muitas novas linhas de uma só vez e adiaste todas as atualizações de índices e verificações de consistência até o final.

O tempo necessário para inserir uma linha é determinado pelos seguintes fatores, onde os números indicam proporções aproximadas:

* Conectar: (3)
* Enviar consulta ao servidor: (2)
* Parar a consulta: (2)
* Inserir linha: (1 × tamanho da linha)
* Inserir índices: (1 × número de índices)
* Fechar: (1)

Isso não leva em consideração o overhead inicial para abrir tabelas, que é feito uma vez para cada consulta executada simultaneamente.

O tamanho da tabela desacelera a inserção de índices por log *`N`*, assumindo índices B-tree.

Você pode usar os seguintes métodos para acelerar as inserções:

* Se você está inserindo muitas linhas do mesmo cliente ao mesmo tempo, use instruções `INSERT` com várias listas de `VALUES` para inserir várias linhas de uma vez. Isso é consideravelmente mais rápido (muitas vezes mais rápido em alguns casos) do que usar instruções `INSERT` separadas para uma única linha. Se você está adicionando dados a uma tabela não vazia, pode ajustar a variável `bulk_insert_buffer_size` para tornar a inserção de dados ainda mais rápida. Veja a Seção 7.1.8, “Variáveis do Sistema do Servidor”.
* Ao carregar uma tabela de um arquivo de texto, use `LOAD DATA`. Isso geralmente é 20 vezes mais rápido do que usar instruções `INSERT`. Veja a Seção 15.2.9, “Instrução LOAD DATA”.
* Aproveite o fato de que as colunas têm valores padrão. Insira valores explicitamente apenas quando o valor a ser inserido difere do padrão. Isso reduz a análise que o MySQL deve fazer e melhora a velocidade de inserção.
* Veja a Seção 10.5.5, “Carregamento de Dados em Massa para Tabelas InnoDB” para dicas específicas para tabelas `InnoDB`.
* Veja a Seção 10.6.2, “Carregamento de Dados em Massa para Tabelas MyISAM” para dicas específicas para tabelas `MyISAM`.