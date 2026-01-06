### 11.2.1 Tipo de dados de data e hora Sintaxe

Os tipos de dados de data e hora para representar valores temporais são `DATE`, `TIME`, `DATETIME`, `TIMESTAMP` e `YEAR`.

Para as descrições de intervalo de `DATE` e `DATETIME`, "compatível" significa que, embora valores anteriores possam funcionar, não há garantia.

O MySQL permite frações de segundo para valores de `TIME`, `DATETIME` e `TIMESTAMP`, com precisão de até microsegundos (6 dígitos). Para definir uma coluna que inclua uma parte de frações de segundo, use a sintaxe `type_name(fsp)`, onde *`type_name`* é `TIME`, `DATETIME` ou `TIMESTAMP`, e *`fsp`* é a precisão de frações de segundo. Por exemplo:

```sql
CREATE TABLE t1 (t TIME(3), dt DATETIME(6), ts TIMESTAMP(0));
```

O valor *`fsp`*, se fornecido, deve estar no intervalo de 0 a 6. Um valor de 0 significa que não há parte fracionária. Se omitido, a precisão padrão é 0. (Isso difere do padrão padrão do SQL padrão de 6, para compatibilidade com versões anteriores do MySQL.)

Qualquer coluna `TIMESTAMP` ou `DATETIME` em uma tabela pode ter propriedades de inicialização e atualização automáticas; consulte a Seção 11.2.6, “Inicialização e Atualização Automática para TIMESTAMP e DATETIME”.

- `DATA`

  Uma data. A faixa de valores suportada é `'1000-01-01'` a `'9999-12-31'`. O MySQL exibe os valores `DATE` no formato `'YYYY-MM-DD'`, mas permite a atribuição de valores às colunas `DATE` usando strings ou números.

- `DATETIME[(fsp)]`

  Uma combinação de data e hora. O intervalo suportado é `'1000-01-01 00:00:00.000000'` a `'9999-12-31 23:59:59.499999'`. O MySQL exibe valores `DATETIME` no formato `'YYYY-MM-DD hh:mm:ss[.fraction]'`, mas permite a atribuição de valores às colunas `DATETIME` usando strings ou números.

  Um valor opcional *`fsp`* no intervalo de 0 a 6 pode ser fornecido para especificar a precisão de segundos fracionários. Um valor de 0 significa que não há parte fracionária. Se omitido, a precisão padrão é 0.

  A inicialização automática e a atualização para a data e hora atuais para as colunas `DATETIME` podem ser especificadas usando as cláusulas de definição de coluna `DEFAULT` e `ON UPDATE`, conforme descrito na Seção 11.2.6, “Inicialização e Atualização Automática para TIMESTAMP e DATETIME”.

- `TIMESTAMP[(fsp)]`

  Um timestamp. A faixa é de `'1970-01-01 00:00:01.000000'` UTC a `'2038-01-19 03:14:07.499999'` UTC. Os valores `TIMESTAMP` são armazenados como o número de segundos desde a época (`'1970-01-01 00:00:00'` UTC). Um `TIMESTAMP` não pode representar o valor `'1970-01-01 00:00:00'` porque isso é equivalente a 0 segundos desde a época e o valor 0 é reservado para representar `'0000-00-00 00:00:00'`, o valor `TIMESTAMP` "zero".

  Um valor opcional *`fsp`* no intervalo de 0 a 6 pode ser fornecido para especificar a precisão de segundos fracionários. Um valor de 0 significa que não há parte fracionária. Se omitido, a precisão padrão é 0.

  A forma como o servidor lida com as definições de `TIMESTAMP` depende do valor da variável de sistema `explicit_defaults_for_timestamp` (consulte a Seção 5.1.7, “Variáveis de sistema do servidor”).

  Se `explicit_defaults_for_timestamp` estiver habilitado, não há atribuição automática dos atributos `DEFAULT CURRENT_TIMESTAMP` ou `ON UPDATE CURRENT_TIMESTAMP` a qualquer coluna `TIMESTAMP`. Eles devem ser incluídos explicitamente na definição da coluna. Além disso, qualquer `TIMESTAMP` não declarado explicitamente como `NOT NULL` permite valores `NULL`.

  Se `explicit_defaults_for_timestamp` estiver desativado, o servidor trata o `TIMESTAMP` da seguinte forma:

  A menos que especificado de outra forma, a primeira coluna `TIMESTAMP` em uma tabela é definida para ser automaticamente configurada para a data e hora da última modificação, se não for explicitamente atribuído um valor. Isso torna o `TIMESTAMP` útil para registrar o timestamp de uma operação de `INSERT` ou `UPDATE`. Você também pode configurar qualquer coluna `TIMESTAMP` para a data e hora atuais, atribuindo-lhe um valor `NULL`, a menos que tenha sido definida com o atributo `NULL` para permitir valores `NULL`.

  A inicialização automática e a atualização para a data e hora atuais podem ser especificadas usando as cláusulas de definição de coluna `DEFAULT CURRENT_TIMESTAMP` e `ON UPDATE CURRENT_TIMESTAMP`. Por padrão, a primeira coluna `TIMESTAMP` possui essas propriedades, conforme mencionado anteriormente. No entanto, qualquer coluna `TIMESTAMP` em uma tabela pode ser definida para ter essas propriedades.

- `TIME[(fsp)]`

  Um horário. A faixa é de `'-838:59:59.000000'` a `'838:59:59.000000'`. O MySQL exibe os valores `TIME` no formato `'hh:mm:ss[.fraction]'`, mas permite a atribuição de valores às colunas `TIME` usando strings ou números.

  Um valor opcional *`fsp`* no intervalo de 0 a 6 pode ser fornecido para especificar a precisão de segundos fracionários. Um valor de 0 significa que não há parte fracionária. Se omitido, a precisão padrão é 0.

- `YEAR[(4)]`

  Um ano no formato de 4 dígitos. O MySQL exibe os valores de `YEAR` no formato *`YYYY`*, mas permite a atribuição de valores às colunas `YEAR` usando strings ou números. Os valores são exibidos como `1901` a `2155`, ou `0000`.

  Nota

  O tipo de dados `YEAR(2)` está desatualizado e o suporte a ele foi removido no MySQL 5.7.5. Para converter colunas `YEAR(2)` de 2 dígitos em colunas `YEAR` de 4 dígitos, consulte a Seção 11.2.5, "Limitações de `YEAR(2)` de 2 dígitos e migração para `YEAR` de 4 dígitos" e "Migração para `YEAR` de 4 dígitos").

  Para obter informações adicionais sobre o formato de exibição `YEAR` e a interpretação dos valores de entrada, consulte a Seção 11.2.4, “O Tipo YEAR”.

As funções agregadoras `SUM()` e `AVG()` não funcionam com valores temporais. (Elas convertem os valores em números, perdendo tudo após o primeiro caractere não numérico.) Para contornar esse problema, converta para unidades numéricas, realize a operação agregadora e converta de volta para um valor temporal. Exemplos:

```sql
SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(time_col))) FROM tbl_name;
SELECT FROM_DAYS(SUM(TO_DAYS(date_col))) FROM tbl_name;
```

Nota

O servidor MySQL pode ser executado com o modo SQL `MAXDB` habilitado. Nesse caso, `TIMESTAMP` é idêntico a `DATETIME`. Se esse modo for habilitado no momento em que uma tabela é criada, as colunas `TIMESTAMP` são criadas como colunas `DATETIME`. Como resultado, essas colunas usam o formato de exibição `DATETIME`, têm o mesmo intervalo de valores e não há inicialização ou atualização automática para a data e hora atuais. Veja a Seção 5.1.10, “Modos SQL do Servidor”.

Nota

A partir do MySQL 5.7.22, o `MAXDB` está desatualizado; espere que ele seja removido em uma versão futura do MySQL.
