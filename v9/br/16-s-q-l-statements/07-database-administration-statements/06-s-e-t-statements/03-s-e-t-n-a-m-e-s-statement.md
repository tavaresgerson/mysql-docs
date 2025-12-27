#### 15.7.6.3 Declaração de Nomes de Caracteres

```
SET NAMES {'charset_name'
    [COLLATE 'collation_name'] | DEFAULT}
```

Esta declaração define as três variáveis de sistema de sessão `character_set_client`, `character_set_connection` e `character_set_results` para o conjunto de caracteres especificado. Definir `character_set_connection` para `charset_name` também define `collation_connection` para a collation padrão para `charset_name`. Consulte a Seção 12.4, “Sistemas de Caracteres de Conexão e Colagens”.

A cláusula opcional `COLLATE` pode ser usada para especificar uma collation explicitamente. Se fornecida, a collation deve ser uma das collations permitidas para *`charset_name`*.

*`charset_name`* e *`collation_name`* podem ser citados ou não citados.

O mapeamento padrão pode ser restaurado usando um valor de `DEFAULT`. O padrão depende da configuração do servidor.

Alguns conjuntos de caracteres não podem ser usados como o conjunto de caracteres do cliente. Tentar usá-los com `SET NAMES` produz um erro. Consulte Conjuntos de Caracteres de Cliente Impermeáveis.