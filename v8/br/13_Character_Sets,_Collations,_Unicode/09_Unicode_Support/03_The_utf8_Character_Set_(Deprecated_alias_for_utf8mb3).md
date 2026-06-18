### 12.9.3 O conjunto de caracteres utf8 (alias desatualizado para utf8mb3)

`utf8` foi usado no passado pelo MySQL como um alias para o conjunto de caracteres `utf8mb3`, mas esse uso já está desatualizado; no MySQL 8.0, as instruções `SHOW` e as colunas das tabelas `INFORMATION_SCHEMA` mostram `utf8mb3` em vez disso. Para mais informações, consulte a Seção 12.9.2, “O conjunto de caracteres utf8mb3 (codificação Unicode UTF-8 de 3 bytes”)”).

Nota

O conjunto de caracteres recomendado para o MySQL é `utf8mb4`. Todas as novas aplicações devem usar `utf8mb4`.

O conjunto de caracteres `utf8mb3` está desatualizado. `utf8mb3` continua sendo suportado para a vida útil das séries de lançamentos LTS do MySQL 8.0.x e seguintes, bem como no MySQL 8.0.

Espere que o `utf8mb3` seja removido em uma futura versão principal do MySQL.

Como a mudança de conjuntos de caracteres pode ser uma tarefa complexa e demorada, você deve começar a se preparar para essa mudança agora, usando `utf8mb4` para novos aplicativos. Para obter orientações sobre a conversão de aplicativos existentes que utilizam utfmb3, consulte a Seção 12.9.8, “Conversão entre conjuntos de caracteres Unicode de 3 e 4 bytes”.
