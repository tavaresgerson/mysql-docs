### 15.1.31 Sistema de Referência Espacial DROP Declaração

```
DROP SPATIAL REFERENCE SYSTEM
    [IF EXISTS]
    srid

srid: 32-bit unsigned integer
```

Esta declaração remove uma definição de sistema de referência espacial (SRS) do dicionário de dados. Requer o privilégio `SUPER`.

Exemplo:

```
DROP SPATIAL REFERENCE SYSTEM 4120;
```

Se não existir uma definição de SRS com o valor SRID, ocorrerá um erro, a menos que `IF EXISTS` seja especificado. Nesse caso, ocorrerá um aviso em vez de um erro.

Se o valor SRID for usado por alguma coluna em uma tabela existente, ocorrerá um erro. Por exemplo:

```
mysql> DROP SPATIAL REFERENCE SYSTEM 4326;
ERROR 3716 (SR005): Can't modify SRID 4326. There is at
least one column depending on it.
```

Para identificar qual coluna ou colunas usam o SRID, use esta consulta:

```
SELECT * FROM INFORMATION_SCHEMA.ST_GEOMETRY_COLUMNS WHERE SRS_ID=4326;
```

Os valores de SRID devem estar no intervalo de inteiros sem sinal de 32 bits, com as seguintes restrições:

- O SRID 0 é um SRID válido, mas não pode ser usado com `DROP SPATIAL REFERENCE SYSTEM`.

- Se o valor estiver em uma faixa de SRID reservada, um aviso será exibido. As faixas reservadas são \[0, 32767] (reservada pelo EPSG), \[60,000,000, 69,999,999] (reservada pelo EPSG) e \[2,000,000,000, 2,147,483,647] (reservada pelo MySQL). EPSG significa European Petroleum Survey Group.

- Os usuários não devem excluir SRSs com SRIDs nas faixas reservadas. Se SRSs instaladas pelo sistema forem excluídas, as definições dos SRS podem ser recriadas para atualizações do MySQL.
