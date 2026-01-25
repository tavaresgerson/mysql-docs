#### 21.2.7.7 Limitações Relacionadas ao Desempenho no NDB Cluster

Os seguintes problemas de desempenho são específicos ou especialmente acentuados no NDB Cluster:

* **Range scans.** Existem problemas de desempenho de Query devido ao acesso sequencial ao Storage Engine [[NDB](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6")]; também é relativamente mais caro realizar muitos Range scans do que com `MyISAM` ou `InnoDB`.

* **Confiabilidade de Records in range.** A estatística `Records in range` está disponível, mas não está completamente testada ou oficialmente suportada. Isso pode resultar em planos de Query não ideais em alguns casos. Se necessário, você pode empregar `USE INDEX` ou `FORCE INDEX` para alterar o plano de execução. Consulte [Section 8.9.4, “Index Hints”](index-hints.html "8.9.4 Index Hints"), para mais informações sobre como fazer isso.

* **Unique hash indexes.** Unique hash indexes criados com `USING HASH` não podem ser usados para acessar uma tabela se `NULL` for fornecido como parte da Key.