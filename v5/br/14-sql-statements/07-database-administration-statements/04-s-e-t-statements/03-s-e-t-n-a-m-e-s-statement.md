#### 13.7.4.3 Declaração de NOME_SET

```sql
SET NAMES {'charset_name'
    [COLLATE 'collation_name'] | DEFAULT}
```

Esta declaração define as variáveis do sistema de sessão `character_set_client`, `character_set_connection` e `character_set_results` para o conjunto de caracteres especificado. Definir `character_set_connection` como `charset_name` também define `collation_connection` para a collation padrão para `charset_name`. Consulte Seção 10.4, “Conjunto de caracteres de conexão e colagens”.

A cláusula `COLLATE` opcional pode ser usada para especificar uma collation explicitamente. Se fornecida, a collation deve ser uma das collation permitidas para *`charset_name`*.

*`charset_name`* e *`collation_name`* podem ser citados ou não citados.

O mapeamento padrão pode ser restaurado usando um valor de `DEFAULT`. O padrão depende da configuração do servidor.

Alguns conjuntos de caracteres não podem ser usados como conjunto de caracteres do cliente. Tentar usá-los com `SET NAMES` produz um erro. Veja Conjunto de caracteres do cliente impermissível.
