### 10.3.3 Otimização de Índices Espaciais

O MySQL permite a criação de índices `SPATIAL` em colunas com valores de geometria `NOT NULL` (veja a Seção 13.4.10, “Criando Índices Espaciais”). O otimizador verifica o atributo `SRID` das colunas indexadas para determinar qual sistema de referência espacial (SRS) usar para comparações e utiliza cálculos apropriados para o SRS. (Antes do MySQL 9.5, o otimizador realiza comparações de valores de índices `SPATIAL` usando cálculos cartesianos; os resultados dessas operações são indefinidos se a coluna contiver valores com SRIDs não cartesianos.)

Para que as comparações funcionem corretamente, cada coluna em um índice `SPATIAL` deve ser restrita ao SRID. Isso significa que a definição da coluna deve incluir um atributo `SRID` explícito, e todos os valores da coluna devem ter o mesmo SRID.

O otimizador considera índices `SPATIAL` apenas para colunas restritas ao SRID:

* Índices em colunas restritas a um SRID cartesiano permitem cálculos de caixa de delimitação cartesiana.

* Índices em colunas restritas a um SRID geográfico permitem cálculos de caixa de delimitação geográfica.

O otimizador ignora índices `SPATIAL` em colunas que não têm o atributo `SRID` (e, portanto, não são restritas ao SRID). O MySQL ainda mantém esses índices, conforme segue:

* Eles são atualizados para modificações de tabela (`INSERT`, `UPDATE`, `DELETE`, etc.). As atualizações ocorrem como se o índice fosse cartesiano, mesmo que a coluna possa conter uma mistura de valores cartesianos e geográficos.

* Eles existem apenas para compatibilidade reversa (por exemplo, a capacidade de realizar uma dump no MySQL 8.4 e restaurar no MySQL 9.4). Como os índices `SPATIAL` em colunas que não são restritas ao SRID não são úteis para o otimizador, cada coluna desse tipo deve ser modificada:

+ Verifique se todos os valores na coluna têm o mesmo SRID. Para determinar os SRIDs contidos em uma coluna de geometria *`col_name`*, use a seguinte consulta:

    ```
    SELECT DISTINCT ST_SRID(col_name) FROM tbl_name;
    ```

    Se a consulta retornar mais de uma linha, a coluna contém uma mistura de SRIDs. Nesse caso, modifique seu conteúdo para que todos os valores tenham o mesmo SRID.

  + Redefina a coluna para ter um atributo `SRID` explícito.

  + Recrie o índice `SPATIAL`.