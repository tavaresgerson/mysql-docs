#### 21.2.7.7 Limitações relacionadas ao desempenho no cluster NDB

Os seguintes problemas de desempenho são específicos ou especialmente pronunciados no NDB Cluster:

- **Análises de intervalo.** Existem problemas de desempenho das consultas devido ao acesso sequencial ao mecanismo de armazenamento `NDB`; também é relativamente mais caro realizar muitas análises de intervalo do que com `MyISAM` ou `InnoDB`.

- **Fiabilidade dos registros na faixa.** A estatística "Registros na faixa" está disponível, mas não foi totalmente testada ou oficialmente suportada. Isso pode resultar em planos de consulta não ótimos em alguns casos. Se necessário, você pode usar `USE INDEX` ou `FORCE INDEX` para alterar o plano de execução. Consulte Seção 8.9.4, "Dicas de índice" para obter mais informações sobre como fazer isso.

- **Indekses de hash únicos.** Índices de hash únicos criados com `USING HASH` não podem ser usados para acessar uma tabela se `NULL` for fornecido como parte da chave.
