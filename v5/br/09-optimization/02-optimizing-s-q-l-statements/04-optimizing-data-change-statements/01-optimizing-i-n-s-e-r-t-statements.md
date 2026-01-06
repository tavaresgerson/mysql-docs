#### 8.2.4.1 Otimizando instruções INSERT

Para otimizar a velocidade de inserção, combine muitas operações pequenas em uma única operação grande. Idealmente, você faz uma única conexão, envia os dados para muitas novas linhas de uma só vez e adiatra todas as atualizações de índice e verificações de consistência até o final.

O tempo necessário para inserir uma linha é determinado pelos seguintes fatores, onde os números indicam proporções aproximadas:

- Conectar: (3)
- Enviando consulta ao servidor: (2)
- Analisando a consulta: (2)
- Inserindo linha: (1 × tamanho da linha)
- Inserindo índices: (1 × número de índices)
- Fechamento: (1)

Isso não leva em consideração o custo inicial para abrir as tabelas, que é feito uma vez para cada consulta executada simultaneamente.

O tamanho da tabela desacelera a inserção de índices por log *`N`*, assumindo índices de árvore B.

Você pode usar os seguintes métodos para acelerar as inserções:

- Se você estiver inserindo muitas linhas do mesmo cliente ao mesmo tempo, use instruções `INSERT` com várias listas de `VALUES` para inserir várias linhas de uma vez. Isso é consideravelmente mais rápido (muitas vezes mais rápido em alguns casos) do que usar instruções `INSERT` separadas para uma única linha. Se você estiver adicionando dados a uma tabela não vazia, pode ajustar a variável `bulk_insert_buffer_size` para tornar a inserção de dados ainda mais rápida. Veja a Seção 5.1.7, “Variáveis do Sistema do Servidor”.

- Ao carregar uma tabela de um arquivo de texto, use `LOAD DATA`. Isso geralmente é 20 vezes mais rápido do que usar instruções `INSERT`. Veja a Seção 13.2.6, “Instrução LOAD DATA”.

- Aproveite o fato de que as colunas têm valores padrão. Insira valores explicitamente apenas quando o valor a ser inserido for diferente do padrão. Isso reduz a análise que o MySQL deve fazer e melhora a velocidade de inserção.

- Consulte a Seção 8.5.5, “Carregamento de Dados em Massa para Tabelas InnoDB”, para obter dicas específicas para tabelas `InnoDB`.

- Consulte a Seção 8.6.2, “Carregamento de Dados em Massa para Tabelas MyISAM”, para obter dicas específicas para tabelas `MyISAM`.
