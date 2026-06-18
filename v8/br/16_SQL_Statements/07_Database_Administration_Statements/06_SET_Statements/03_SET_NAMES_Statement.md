#### 15.7.6.3 Declaração de NOME\_SET

```
SET NAMES {'charset_name'
    [COLLATE 'collation_name'] | DEFAULT}
```

Essa declaração define as variáveis do sistema de sessão `character_set_client`, `character_set_connection` e `character_set_results` para o conjunto de caracteres fornecido. Definir `character_set_connection` para `charset_name` também define `collation_connection` para a collation padrão para `charset_name`. Veja a Seção 12.4, “Conjunto de caracteres de conexão e collation”.

A cláusula opcional `COLLATE` pode ser usada para especificar uma collation explicitamente. Se fornecida, a collation deve ser uma das collation permitidas para `charset_name`.

`charset_name` e `collation_name` podem ser citados ou não citados.

O mapeamento padrão pode ser restaurado usando o valor `DEFAULT`. O padrão depende da configuração do servidor.

Alguns conjuntos de caracteres não podem ser usados como conjunto de caracteres do cliente. Tentar usá-los com `SET NAMES` produz um erro. Veja Conjuntos de caracteres do cliente impermissíveis.
