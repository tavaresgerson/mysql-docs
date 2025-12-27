#### 25.2.7.7 Limitações relacionadas ao desempenho no NDB Cluster

Os seguintes problemas de desempenho são específicos ou especialmente pronunciados no NDB Cluster:

* **Pesquisas de intervalo.** Existem problemas de desempenho das consultas devido ao acesso sequencial ao motor de armazenamento `NDB`; também é relativamente mais caro realizar muitas pesquisas de intervalo do que com `MyISAM` ou `InnoDB`.

* **Confiabilidade dos registros no intervalo.** A estatística `Registros no intervalo` está disponível, mas não é completamente testada ou oficialmente suportada. Isso pode resultar em planos de consulta não ótimos em alguns casos. Se necessário, você pode usar `USE INDEX` ou `FORCE INDEX` para alterar o plano de execução. Consulte a Seção 10.9.4, “Dicas de índice”, para obter mais informações sobre como fazer isso.

* **Índices de hash únicos.** Índices de hash únicos criados com `USING HASH` não podem ser usados para acessar uma tabela se `NULL` for fornecido como parte da chave.