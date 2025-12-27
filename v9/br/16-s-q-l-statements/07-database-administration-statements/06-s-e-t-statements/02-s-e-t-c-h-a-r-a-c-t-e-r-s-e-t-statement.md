#### 15.7.6.2 Declaração de DEFINIR SET DE CARACTERES

```
SET {CHARACTER SET | CHARSET}
    {'charset_name' | DEFAULT}
```

Esta declaração mapeia todas as strings enviadas entre o servidor e o cliente atual com o mapeamento fornecido. `SET CHARACTER SET` define três variáveis de sistema de sessão: `character_set_client` e `character_set_results` são definidas para o conjunto de caracteres fornecido, e `character_set_connection` para o valor de `character_set_database`. Consulte a Seção 12.4, “Conjunto de caracteres de conexão e colagens”.

*`charset_name`* pode ser citado ou não citado.

O mapeamento do conjunto de caracteres padrão pode ser restaurado usando o valor `DEFAULT`. O padrão depende da configuração do servidor.

Alguns conjuntos de caracteres não podem ser usados como conjunto de caracteres do cliente. Tentar usá-los com `SET CHARACTER SET` produz um erro. Consulte Conjuntos de caracteres de cliente impermissíveis.