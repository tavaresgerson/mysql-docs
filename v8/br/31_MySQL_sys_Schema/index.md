# Capítulo 30 Schema do sistema MySQL

**Índice**

30.1 Pré-requisitos para usar o esquema sys

30.2 Usando o esquema sys

30.3 Relatório de progresso do esquema do sistema

30.4 Objeto do esquema do sistema :   30.4.1 Índice de objeto do esquema do sistema

```
30.4.2 sys Schema Tables and Triggers

30.4.3 sys Schema Views

30.4.4 sys Schema Stored Procedures

30.4.5 sys Schema Stored Functions
```

O MySQL 8.0 inclui o esquema `sys`, um conjunto de objetos que ajuda os administradores de banco de dados e desenvolvedores a interpretar os dados coletados pelo Gerenciador de Desempenho. Os objetos do esquema `sys` podem ser usados para casos típicos de ajuste e diagnóstico. Os objetos deste esquema incluem:

- Visões que resumem os dados do Performance Schema em uma forma mais fácil de entender.

- Procedimentos armazenados que realizam operações como a configuração do Schema de Desempenho e a geração de relatórios de diagnóstico.

- Funções armazenadas que consultam a configuração do Gerenciador de Desempenho e fornecem serviços de formatação.

Para novas instalações, o esquema `sys` é instalado por padrão durante a inicialização do diretório de dados se você usar o **mysqld** com a opção `--initialize` ou `--initialize-insecure`. Se isso não for desejado, você pode excluir o esquema `sys` manualmente após a inicialização, se ele não for necessário.

O procedimento de atualização do MySQL produz um erro se um esquema `sys` existir, mas não tiver nenhuma vista `version`, assumindo que a ausência dessa vista indica um esquema `sys` criado pelo usuário. Para atualizar nesse caso, remova ou renomeie primeiro o esquema existente `sys`.

Os objetos do esquema `sys` têm um `DEFINER` de `'mysql.sys'@'localhost'`. O uso da conta dedicada `mysql.sys` evita problemas que ocorrem se um DBA renomear ou remover a conta `root`.
