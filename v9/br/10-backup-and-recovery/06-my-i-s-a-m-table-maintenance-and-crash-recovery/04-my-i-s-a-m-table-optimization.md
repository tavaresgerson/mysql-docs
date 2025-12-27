### 9.6.4 Otimização de Tabelas MyISAM

Para coalescer linhas fragmentadas e eliminar o espaço desperdiçado que resulta da exclusão ou atualização de linhas, execute **myisamchk** no modo de recuperação:

```
$> myisamchk -r tbl_name
```

Você pode otimizar uma tabela da mesma maneira usando a instrução SQL `OPTIMIZE TABLE`. `OPTIMIZE TABLE` realiza uma reparação da tabela e uma análise de chaves, além de ordenar a árvore de índices para que as consultas por chave sejam mais rápidas. Não há também possibilidade de interação indesejada entre uma ferramenta e o servidor, porque o servidor realiza todo o trabalho quando você usa `OPTIMIZE TABLE`. Veja a Seção 15.7.3.4, “Instrução OPTIMIZE TABLE”.

**myisamchk** tem várias outras opções que você pode usar para melhorar o desempenho de uma tabela:

* `--analyze` ou `-a`: Realize a análise da distribuição de chaves. Isso melhora o desempenho das junções ao permitir que o otimizador de junção escolha melhor a ordem em que as tabelas devem ser unidas e quais índices devem ser usados.

* `--sort-index` ou `-S`: Ordene os blocos de índice. Isso otimiza as buscas e torna as varreduras da tabela que usam índices mais rápidas.

* `--sort-records=index_num` ou `-R index_num`: Ordene as linhas de dados de acordo com um índice específico. Isso torna seus dados muito mais localizados e pode acelerar operações de `SELECT` e `ORDER BY` baseadas em intervalo que usam esse índice.

Para uma descrição completa de todas as opções disponíveis, consulte a Seção 6.6.4, “myisamchk — Ferramenta de Manutenção de Tabelas MyISAM”.