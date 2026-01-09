# Capítulo 26 Schema do sistema MySQL

**Índice**

26.1 Pré-requisitos para usar o esquema sys

26.2 Usando o esquema sys

26.3 Relatório de progresso do esquema sys

26.4 Objeto de esquema do sistema :   26.4.1 Índice de objeto de esquema do sistema

```
26.4.2 sys Schema Tables and Triggers

26.4.3 sys Schema Views

26.4.4 sys Schema Stored Procedures

26.4.5 sys Schema Stored Functions
```

O MySQL 5.7 inclui o esquema `sys`, um conjunto de objetos que ajuda os administradores de banco de dados e desenvolvedores a interpretar os dados coletados pelo Gerenciador de Desempenho. Os objetos do esquema `sys` podem ser usados para casos típicos de ajuste e diagnóstico. Os objetos deste esquema incluem:

- Visões que resumem os dados do Performance Schema em uma forma mais fácil de entender.

- Procedimentos armazenados que realizam operações como a configuração do Schema de Desempenho e a geração de relatórios de diagnóstico.

- Funções armazenadas que consultam a configuração do Gerenciador de Desempenho e fornecem serviços de formatação.

Para novas instalações, o esquema `sys` é instalado por padrão durante a inicialização do diretório de dados se você usar o **mysqld** com a opção `--initialize` ou `--initialize-insecure`. Você pode excluir o esquema \`sys manualmente após a inicialização, se ele não for necessário.

Para atualizações, o **mysql_upgrade** instala o esquema `sys` se ele não estiver instalado e, caso contrário, o atualiza para a versão atual. Para permitir que esse comportamento seja suprimido, o **mysql_upgrade** tem a opção `--skip-sys-schema`.

O **mysql_upgrade** retorna um erro se um esquema `sys` existir, mas não tiver a visão `version`, assumindo que a ausência dessa visão indica um esquema `sys` criado pelo usuário. Para fazer a atualização nesse caso, remova ou renomeie primeiro o esquema `sys` existente.

Os objetos do esquema `sys` têm um `DEFINER` de `'mysql.sys'@'localhost'`. O uso da conta dedicada `mysql.sys` evita problemas que ocorrem se um DBA renomear ou remover a conta `root`.
