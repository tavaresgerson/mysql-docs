### 10.3.3 Otimização do Índice Espacial

O MySQL permite a criação de índices `SPATIAL` em colunas de geometria `NOT NULL` (ver Seção 13.4.10, “Criando Índices Espaciais”). O otimizador verifica o atributo `SRID` para colunas indexadas para determinar qual sistema de referência espacial (SRS) usar para comparações e utiliza cálculos apropriados para o SRS. (Antes do MySQL 8.0, o otimizador realiza comparações dos valores do índice `SPATIAL` usando cálculos cartesianos; os resultados dessas operações são indefinidos se a coluna contiver valores com SRIDs não cartesianos.)

Para que as comparações funcionem corretamente, cada coluna em um índice `SPATIAL` deve ser restrita ao SRID. Isso significa que a definição da coluna deve incluir um atributo explícito `SRID` e todos os valores das colunas devem ter o mesmo SRID.

O otimizador considera os índices `SPATIAL` apenas para as colunas restritas ao SRID:

- Os índices em colunas restritos a um SRID cartesiano permitem cálculos de caixa de delimitação cartesiana.

- Os índices em colunas restritos a um SRID geográfico permitem cálculos de caixa de delimitação geográfica.

O otimizador ignora índices `SPATIAL` em colunas que não possuem o atributo `SRID` (e, portanto, não são restritas pelo SRID). O MySQL ainda mantém esses índices, conforme descrito a seguir:

- Eles são atualizados para modificações de tabela (`INSERT`, `UPDATE`, `DELETE` e assim por diante). As atualizações ocorrem como se o índice fosse cartesiano, mesmo que a coluna possa conter uma mistura de valores cartesianos e geográficos.

- Eles existem apenas para compatibilidade retroativa (por exemplo, a capacidade de realizar um dump no MySQL 5.7 e restaurar no MySQL 8.0). Como os índices `SPATIAL` em colunas que não são restritas pelo SRID não são úteis para o otimizador, cada coluna desse tipo deve ser modificada:

  - Verifique se todos os valores na coluna têm o mesmo SRID. Para determinar os SRIDs contidos em uma coluna de geometria `col_name`, use a seguinte consulta:

    ```
    SELECT DISTINCT ST_SRID(col_name) FROM tbl_name;
    ```

    Se a consulta retornar mais de uma linha, a coluna contém uma mistura de SRIDs. Nesse caso, modifique seu conteúdo para que todos os valores tenham o mesmo SRID.

  - Redefina a coluna para ter um atributo explícito `SRID`.

  - Recrie o índice `SPATIAL`.
