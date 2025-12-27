### 12.9.3 O Conjunto de Caracteres utf8 (Alias desatualizado para utf8mb3)

O `utf8` foi utilizado pelo MySQL no passado como um alias para o conjunto de caracteres `utf8mb3`, mas esse uso está agora desatualizado; no MySQL 8.4, as declarações `SHOW` e as colunas das tabelas do `INFORMATION_SCHEMA` exibem `utf8mb3` em vez disso. Para obter mais informações, consulte a Seção 12.9.2, “O Conjunto de Caracteres utf8mb3 (Codificação Unicode de 3 bytes utf8)”).

::: info Nota

O conjunto de caracteres recomendado para o MySQL é `utf8mb4`. Todas as novas aplicações devem usar `utf8mb4`.

O conjunto de caracteres `utf8mb3` está desatualizado. O `utf8mb3` continua sendo suportado pelo tempo de vida das séries de lançamentos MySQL 8.0.x e MySQL 8.4.x LTS.

Espere que o `utf8mb3` seja removido em um futuro lançamento principal do MySQL.

Como alterar conjuntos de caracteres pode ser uma tarefa complexa e demorada, você deve começar a se preparar para essa mudança agora, usando `utf8mb4` para novas aplicações. Para obter orientações sobre a conversão de aplicações existentes que usam utfmb3, consulte a Seção 12.9.8, “Conversão entre conjuntos de caracteres Unicode de 3 e 4 bytes”.