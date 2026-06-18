# Capítulo 26 Schema sys do MySQL

**Sumário**

26.1 Pré-requisitos para Usar o Schema sys

26.2 Usando o Schema sys

26.3 Relatório de Progresso do Schema sys

26.4 Referência de Objetos do Schema sys :
    26.4.1 Índice de Objetos do Schema sys

    26.4.2 Tables e Triggers do Schema sys

    26.4.3 Views do Schema sys

    26.4.4 Stored Procedures do Schema sys

    26.4.5 Stored Functions do Schema sys

O MySQL 5.7 inclui o `sys` schema, um conjunto de objetos que ajuda DBAs e desenvolvedores a interpretar os dados coletados pelo Performance Schema. Os objetos do `sys` schema podem ser usados para casos típicos de uso de tuning e diagnóstico. Os objetos neste schema incluem:

*   Views que sumarizam os dados do Performance Schema em um formato mais facilmente compreensível.

*   Stored procedures que executam operações como configuração do Performance Schema e geração de relatórios de diagnóstico.

*   Stored functions que consultam a configuração do Performance Schema e fornecem serviços de formatação.

Para novas instalações, o `sys` schema é instalado por padrão durante a inicialização do diretório de dados se você usar o **mysqld** com a opção `--initialize` ou `--initialize-insecure`. Você pode remover (drop) o `sys` schema manualmente após a inicialização, caso ele não seja necessário.

Para upgrades, o **mysql_upgrade** instala o `sys` schema se ele não estiver instalado, e o atualiza para a versão atual, caso contrário. Para permitir que esse comportamento seja suprimido, o **mysql_upgrade** possui a opção `--skip-sys-schema`.

O **mysql_upgrade** retorna um erro se um `sys` schema existir, mas não tiver uma `version` view, sob a suposição de que a ausência desta view indica um `sys` schema criado pelo usuário. Para realizar o upgrade neste caso, remova ou renomeie o `sys` schema existente primeiro.

Os objetos do `sys` schema têm um `DEFINER` de `'mysql.sys'@'localhost'`. O uso da conta dedicada `mysql.sys` evita problemas que ocorrem se um DBA renomear ou remover a conta `root`.