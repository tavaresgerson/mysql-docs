### 7.6.4 Otimização de Tabelas MyISAM

Para coalescer linhas fragmentadas e eliminar o espaço desperdiçado que resulta da exclusão ou atualização de linhas, execute o **myisamchk** no modo de recuperação:

```sh
$> myisamchk -r tbl_name
```

Você pode otimizar uma tabela da mesma maneira usando a instrução SQL `OPTIMIZE TABLE`. `OPTIMIZE TABLE` realiza uma reparação da tabela e uma análise de chaves, além de ordenar a árvore de índice para que as consultas de chave sejam mais rápidas. Além disso, não há possibilidade de interação indesejada entre uma ferramenta e o servidor, porque o servidor realiza todo o trabalho quando você usa `OPTIMIZE TABLE`. Veja a Seção 13.7.2.4, “Instrução \`OPTIMIZE TABLE’”.

O **myisamchk** tem várias outras opções que você pode usar para melhorar o desempenho de uma tabela:

- `--analyze` ou `-a`: Realize a análise da distribuição de chaves. Isso melhora o desempenho da junção ao permitir que o otimizador de junção escolha melhor a ordem em que as tabelas devem ser unidas e quais índices devem ser usados.

- `--sort-index` ou `-S`: Sorteie os blocos do índice. Isso otimiza os buscas e torna mais rápidos os varreduras da tabela que utilizam índices.

- `--sort-records=index_num` ou `-R index_num`: Organize as linhas de dados de acordo com um índice específico. Isso torna seus dados muito mais localizados e pode acelerar operações `SELECT` e `ORDER BY` baseadas em intervalo que utilizam esse índice.

Para uma descrição completa de todas as opções disponíveis, consulte a Seção 4.6.3, “myisamchk — Ferramenta de manutenção de tabelas MyISAM”.
