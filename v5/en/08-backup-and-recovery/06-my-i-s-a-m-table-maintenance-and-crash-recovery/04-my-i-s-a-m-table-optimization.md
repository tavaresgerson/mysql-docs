### 7.6.4 Otimização de Tabelas MyISAM

Para consolidar linhas fragmentadas e eliminar espaço desperdiçado resultante da exclusão ou atualização de linhas, execute o **myisamchk** no modo de recuperação:

```sql
$> myisamchk -r tbl_name
```

Você pode otimizar uma tabela da mesma forma usando a instrução SQL `OPTIMIZE TABLE`. O `OPTIMIZE TABLE` realiza um *table repair* (reparo de tabela) e uma *key analysis* (análise de chave), e também classifica o *index tree* (árvore de Index) para que os *key lookups* (buscas de chave) sejam mais rápidos. Além disso, não há possibilidade de interação indesejada entre um *utility* (utilitário) e o *server*, pois o *server* realiza todo o trabalho ao usar `OPTIMIZE TABLE`. Consulte a Seção 13.7.2.4, “Instrução OPTIMIZE TABLE”.

O **myisamchk** possui várias outras opções que você pode usar para melhorar o *performance* de uma tabela:

*   `--analyze` ou `-a`: Realiza a *key distribution analysis* (análise de distribuição de chave). Isso melhora o *join performance* (desempenho de JOIN) ao permitir que o *join optimizer* (otimizador de JOIN) escolha melhor a ordem em que as tabelas devem fazer *JOIN* e quais *indexes* ele deve usar.

*   `--sort-index` ou `-S`: Classifica os *index blocks* (blocos de Index). Isso otimiza *seeks* (buscas) e torna *table scans* (varreduras de tabela) que usam *indexes* mais rápidos.

*   `--sort-records=index_num` ou `-R index_num`: Classifica as *data rows* (linhas de dados) de acordo com um *index* fornecido. Isso torna seus dados muito mais localizados e pode acelerar operações `SELECT` e `ORDER BY` baseadas em *range* (intervalo) que usam esse *index*.

Para uma descrição completa de todas as opções disponíveis, consulte a Seção 4.6.3, “myisamchk — Utilitário de Manutenção de Tabela MyISAM”.