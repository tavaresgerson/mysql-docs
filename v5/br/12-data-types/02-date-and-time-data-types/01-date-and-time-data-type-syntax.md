### 11.2.1 Sintaxe dos Tipos de Dados de Data e Hora

Os tipos de dados de data e hora para representar valores temporais são `DATE`, `TIME`, `DATETIME`, `TIMESTAMP` e `YEAR`.

Para as descrições de intervalo de `DATE` e `DATETIME`, "suportado" significa que, embora valores anteriores possam funcionar, não há garantia.

O MySQL permite segundos fracionários para valores `TIME`, `DATETIME` e `TIMESTAMP`, com precisão de até microssegundos (6 dígitos). Para definir uma coluna que inclua uma parte de segundos fracionários, use a sintaxe `type_name(fsp)`, onde *`type_name`* é `TIME`, `DATETIME` ou `TIMESTAMP`, e *`fsp`* é a precisão dos segundos fracionários. Por exemplo:

```sql
CREATE TABLE t1 (t TIME(3), dt DATETIME(6), ts TIMESTAMP(0));
```

O valor *`fsp`*, se fornecido, deve estar no intervalo de 0 a 6. Um valor de 0 significa que não há parte fracionária. Se omitido, a precisão padrão (default) é 0. (Isso difere do padrão SQL default de 6, por motivos de compatibilidade com versões anteriores do MySQL.)

Qualquer coluna `TIMESTAMP` ou `DATETIME` em uma tabela pode ter propriedades de inicialização e atualização automáticas; consulte a Seção 11.2.6, “Inicialização e Atualização Automáticas para TIMESTAMP e DATETIME”.

* `DATE`

  Uma data. O intervalo suportado é de `'1000-01-01'` a `'9999-12-31'`. O MySQL exibe valores `DATE` no formato `'YYYY-MM-DD'`, mas permite a atribuição de valores a colunas `DATE` usando strings ou números.

* `DATETIME[(fsp)]`

  Uma combinação de data e hora. O intervalo suportado é de `'1000-01-01 00:00:00.000000'` a `'9999-12-31 23:59:59.499999'`. O MySQL exibe valores `DATETIME` no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'`, mas permite a atribuição de valores a colunas `DATETIME` usando strings ou números.

  Um valor *`fsp`* opcional no intervalo de 0 a 6 pode ser fornecido para especificar a precisão dos segundos fracionários. Um valor de 0 significa que não há parte fracionária. Se omitido, a precisão default é 0.

  A inicialização e a atualização automáticas para a data e hora atuais para colunas `DATETIME` podem ser especificadas usando as cláusulas de definição de coluna `DEFAULT` e `ON UPDATE`, conforme descrito na Seção 11.2.6, “Inicialização e Atualização Automáticas para TIMESTAMP e DATETIME”.

* `TIMESTAMP[(fsp)]`

  Um timestamp. O intervalo é de `'1970-01-01 00:00:01.000000'` UTC a `'2038-01-19 03:14:07.499999'` UTC. Valores `TIMESTAMP` são armazenados como o número de segundos desde a época (epoch) (`'1970-01-01 00:00:00'` UTC). Um `TIMESTAMP` não pode representar o valor `'1970-01-01 00:00:00'` porque isso é equivalente a 0 segundos da época, e o valor 0 é reservado para representar `'0000-00-00 00:00:00'`, o valor `TIMESTAMP` "zero".

  Um valor *`fsp`* opcional no intervalo de 0 a 6 pode ser fornecido para especificar a precisão dos segundos fracionários. Um valor de 0 significa que não há parte fracionária. Se omitido, a precisão default é 0.

  A maneira como o servidor lida com as definições de `TIMESTAMP` depende do valor da variável de sistema `explicit_defaults_for_timestamp` (consulte a Seção 5.1.7, “Variáveis de Sistema do Servidor”).

  Se `explicit_defaults_for_timestamp` estiver habilitado, não há atribuição automática dos atributos `DEFAULT CURRENT_TIMESTAMP` ou `ON UPDATE CURRENT_TIMESTAMP` a nenhuma coluna `TIMESTAMP`. Eles devem ser incluídos explicitamente na definição da coluna. Além disso, qualquer `TIMESTAMP` não declarado explicitamente como `NOT NULL` permite valores `NULL`.

  Se `explicit_defaults_for_timestamp` estiver desabilitado, o servidor lida com `TIMESTAMP` da seguinte forma:

  A menos que especificado de outra forma, a primeira coluna `TIMESTAMP` em uma tabela é definida para ser configurada automaticamente para a data e hora da modificação mais recente, se um valor não for explicitamente atribuído. Isso torna `TIMESTAMP` útil para registrar o timestamp de uma operação `INSERT` ou `UPDATE`. Você também pode definir qualquer coluna `TIMESTAMP` para a data e hora atuais atribuindo-lhe um valor `NULL`, a menos que tenha sido definida com o atributo `NULL` para permitir valores `NULL`.

  A inicialização e a atualização automáticas para a data e hora atuais podem ser especificadas usando as cláusulas de definição de coluna `DEFAULT CURRENT_TIMESTAMP` e `ON UPDATE CURRENT_TIMESTAMP`. Por padrão (default), a primeira coluna `TIMESTAMP` tem essas propriedades, conforme observado anteriormente. No entanto, qualquer coluna `TIMESTAMP` em uma tabela pode ser definida para ter essas propriedades.

* `TIME[(fsp)]`

  Uma hora. O intervalo é de `'-838:59:59.000000'` a `'838:59:59.000000'`. O MySQL exibe valores `TIME` no formato `'hh:mm:ss[.fraction]'`, mas permite a atribuição de valores a colunas `TIME` usando strings ou números.

  Um valor *`fsp`* opcional no intervalo de 0 a 6 pode ser fornecido para especificar a precisão dos segundos fracionários. Um valor de 0 significa que não há parte fracionária. Se omitido, a precisão default é 0.

* `YEAR[(4)]`

  Um ano no formato de 4 dígitos. O MySQL exibe valores `YEAR` no formato *`YYYY`*, mas permite a atribuição de valores a colunas `YEAR` usando strings ou números. Os valores são exibidos como `1901` a `2155`, ou `0000`.

  Note

  O tipo de dado `YEAR(2)` está obsoleto (deprecated) e seu suporte foi removido no MySQL 5.7.5. Para converter colunas `YEAR(2)` de 2 dígitos para colunas `YEAR` de 4 dígitos, consulte a Seção 11.2.5, “Limitações de YEAR(2) de 2 Dígitos e Migração para YEAR de 4 Dígitos”.

  Para obter informações adicionais sobre o formato de exibição `YEAR` e a interpretação dos valores de entrada, consulte a Seção 11.2.4, “O Tipo YEAR”.

As funções agregadas `SUM()` e `AVG()` não funcionam com valores temporais. (Elas convertem os valores para números, perdendo tudo após o primeiro caractere não numérico.) Para contornar esse problema, converta para unidades numéricas, execute a operação agregada e converta de volta para um valor temporal. Exemplos:

```sql
SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(time_col))) FROM tbl_name;
SELECT FROM_DAYS(SUM(TO_DAYS(date_col))) FROM tbl_name;
```

Note

O servidor MySQL pode ser executado com o `SQL mode` `MAXDB` ativado. Neste caso, `TIMESTAMP` é idêntico a `DATETIME`. Se este modo estiver ativado no momento em que uma tabela é criada, as colunas `TIMESTAMP` são criadas como colunas `DATETIME`. Como resultado, essas colunas usam o formato de exibição `DATETIME`, têm o mesmo intervalo de valores e não há inicialização ou atualização automática para a data e hora atuais. Consulte a Seção 5.1.10, “SQL Modes do Servidor”.

Note

A partir do MySQL 5.7.22, `MAXDB` está obsoleto (deprecated); espera-se que ele seja removido em uma futura versão do MySQL.